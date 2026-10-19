'use client';

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { showToast } from '@/components/Toaster';
import { accountsEnabled, supabase } from '@/lib/supabase';
import { clearClimb, mergeClimbs, readClimb, replaceClimb, subscribeClimb, type Climb } from '@/lib/climb';
import { clearProfile, normalizeProfile, readProfile, saveProfile, subscribeProfile } from '@/lib/profile';

type AuthState = {
  user: User | null;
  loading: boolean;
  enabled: boolean;
  signOut: () => Promise<void>;
  /** Deletes the account and everything saved in it. Returns an error message, or null. */
  deleteAccount: () => Promise<string | null>;
};

const AuthContext = createContext<AuthState>({
  user: null,
  loading: false,
  enabled: false,
  signOut: async () => {},
  deleteAccount: async () => null,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function displayName(user: User | null) {
  const meta = user?.user_metadata ?? {};
  const name = meta.name ?? meta.full_name;
  if (typeof name === 'string' && name.trim()) return name.trim().split(' ')[0];
  return user?.email?.split('@')[0] ?? '';
}

/** Only allow redirects to pages on this site (never to another domain). */
export function safeNext(next: string | null | undefined, fallback = '/courses') {
  return next && next.startsWith('/') && !next.startsWith('//') ? next : fallback;
}

async function pushClimb(userId: string, climb: Climb) {
  if (!supabase) return;
  const base = { user_id: userId, completed: climb.completed, grass: climb.grass, updated_at: new Date().toISOString() };
  const { error } = await supabase.from('climbs').upsert({ ...base, days: climb.days, log: climb.log });
  // If the database doesn't have the streak columns yet, still save the rest of the progress.
  if (error) await supabase.from('climbs').upsert(base);
}

/** Combine this browser's progress with the account's, then save both. */
async function pullAndMerge(userId: string) {
  if (!supabase) return;
  let result = await supabase.from('climbs').select('completed, grass, days, log').eq('user_id', userId).maybeSingle();
  // Older databases have no streak columns yet; read the rest of the progress without it.
  if (result.error) result = await supabase.from('climbs').select('completed, grass').eq('user_id', userId).maybeSingle();
  const { data, error } = result;
  if (error) return;
  const row = data as { completed?: Climb['completed']; grass?: number; days?: string[]; log?: Climb['log'] } | null;
  const remote: Climb = {
    completed: row?.completed ?? {},
    grass: row?.grass ?? 0,
    days: Array.isArray(row?.days) ? row.days : [],
    log: row?.log && typeof row.log === 'object' ? row.log : {},
  };
  const merged = mergeClimbs(readClimb(), remote);
  replaceClimb(merged);
  await pushClimb(userId, merged);
}

/** Keep the survey answers in step between this browser and the account. */
async function syncProfile(user: User) {
  const raw = user.user_metadata?.onboarding as Record<string, unknown> | undefined;
  const saved = raw ? normalizeProfile(raw) : undefined;
  const local = readProfile();
  if (saved && !local) {
    saveProfile(saved); // logging in on a new device
  } else if (local && !saved) {
    await supabase?.auth.updateUser({ data: { onboarding: local } }); // guest just signed up
  }
}

/** Remembers the learner's time zone, so streak reminders arrive at 7 pm their time. */
async function saveTimeZone(userId: string) {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (!timeZone) return;
  await supabase?.from('reminders').upsert({ user_id: userId, time_zone: timeZone, updated_at: new Date().toISOString() });
}

// Supabase reports bad email links in the URL, e.g. #error_code=otp_expired.
function authErrorFromUrl() {
  const params = new URLSearchParams(window.location.hash.slice(1) || window.location.search.slice(1));
  const code = params.get('error_code');
  if (!params.get('error') && !code) return null;
  if (code === 'otp_expired') return 'That link has expired or was already used. Log in, or sign up again to get a new one.';
  return params.get('error_description')?.replace(/\+/g, ' ') ?? 'Sign-in didn’t work. Please try again.';
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(accountsEnabled);
  const signingOut = useRef(false);
  const currentUserId = useRef<string | null>(null);

  useEffect(() => {
    if (!supabase) return;

    const error = authErrorFromUrl();
    if (error) {
      showToast(error, 'bad');
      window.history.replaceState(null, '', window.location.pathname);
    }

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      const next = session?.user ?? null;
      const wasSignedOut = currentUserId.current === null;
      currentUserId.current = next?.id ?? null;
      setUser(next);
      setLoading(false);

      if (event === 'PASSWORD_RECOVERY' && window.location.pathname !== '/reset-password') {
        // A reset link that landed anywhere else still goes to the new-password form.
        router.replace('/reset-password');
      }
      if (event === 'SIGNED_OUT') {
        // Covers expired sessions too: never leave one person's progress for the next.
        clearClimb();
        clearProfile();
      }
      if (next && (event === 'INITIAL_SESSION' || (event === 'SIGNED_IN' && wasSignedOut))) {
        // Supabase recommends doing follow-up requests outside this callback.
        window.setTimeout(() => {
          pullAndMerge(next.id);
          syncProfile(next);
          saveTimeZone(next.id);
        }, 0);
      }
    });
    return () => data.subscription.unsubscribe();
  }, [router]);

  // Save progress to the account whenever it changes on this device.
  useEffect(() => {
    if (!user) return;
    return subscribeClimb(() => {
      if (!signingOut.current) pushClimb(user.id, readClimb());
    });
  }, [user]);

  // Save survey answers and course choices to the account whenever they change.
  useEffect(() => {
    if (!user) return;
    return subscribeProfile(() => {
      const profile = readProfile();
      if (profile && !signingOut.current) supabase?.auth.updateUser({ data: { onboarding: profile } });
    });
  }, [user]);

  async function signOut() {
    if (signingOut.current) return; // ignore extra clicks while logging out
    signingOut.current = true;
    await supabase?.auth.signOut();
    clearClimb(); // the account keeps the progress; this device forgets it
    clearProfile();
    signingOut.current = false;
    router.push('/');
  }

  async function deleteAccount() {
    if (!supabase) return 'Accounts aren’t available right now.';
    signingOut.current = true; // stop saving to an account that's about to go
    const { error } = await supabase.rpc('delete_account');
    if (error) {
      signingOut.current = false;
      return 'Couldn’t delete your account. Please try again, or email us.';
    }
    await supabase.auth.signOut({ scope: 'local' }); // the account is gone, so just forget it here
    clearClimb();
    clearProfile();
    signingOut.current = false;
    router.push('/');
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, loading, enabled: accountsEnabled, signOut, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
}
