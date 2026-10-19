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

// ---------------------------------------------------------------------------
// Progress sync: this browser's climb <-> the account's `climbs` row.
//
// Every sync reads the account first and never saves blindly, so a tab left
// open since yesterday, or a second device, can't wipe newer progress:
// - if nobody else changed the account since our last sync, this device's
//   copy wins (so spending grass sticks);
// - otherwise both copies are merged (every finished lesson and day is kept).
// Failed saves are retried, and coming back to the tab syncs again.
// ---------------------------------------------------------------------------

const RETRY_MS = 15000;

let syncUser: string | null = null; // whose account we're syncing with
let lastSynced: Climb | null = null; // the account's row as of our last sync
let syncing = false;
let syncAgain = false;
let applyingRemote = false;
let retryTimer: ReturnType<typeof setTimeout> | undefined;

/** JSON with sorted keys, so two climbs can be compared regardless of key order. */
function stable(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`;
  if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    return `{${Object.keys(obj)
      .sort()
      .map(k => `${JSON.stringify(k)}:${stable(obj[k])}`)
      .join(',')}}`;
  }
  return JSON.stringify(value);
}

function sameClimb(a: Climb, b: Climb) {
  return stable(a) === stable(b);
}

function isEmptyClimb(c: Climb) {
  return Object.keys(c.completed).length === 0 && c.grass === 0 && c.days.length === 0;
}

/** The account's saved climb, or null if it couldn't be read (offline, server error). */
async function fetchRemote(userId: string): Promise<Climb | null> {
  if (!supabase) return null;
  let result = await supabase.from('climbs').select('completed, grass, days, log').eq('user_id', userId).maybeSingle();
  // Older databases have no streak columns yet; read the rest of the progress without them.
  if (result.error) result = await supabase.from('climbs').select('completed, grass').eq('user_id', userId).maybeSingle();
  if (result.error) return null;
  const row = result.data as { completed?: Climb['completed']; grass?: number; days?: string[]; log?: Climb['log'] } | null;
  return {
    completed: row?.completed && typeof row.completed === 'object' ? row.completed : {},
    grass: typeof row?.grass === 'number' ? row.grass : 0,
    days: Array.isArray(row?.days) ? row.days : [],
    log: row?.log && typeof row.log === 'object' ? row.log : {},
  };
}

/** Saves the climb to the account. Returns whether it worked. */
async function pushClimb(userId: string, climb: Climb) {
  if (!supabase) return false;
  const base = { user_id: userId, completed: climb.completed, grass: climb.grass, updated_at: new Date().toISOString() };
  const { error } = await supabase.from('climbs').upsert({ ...base, days: climb.days, log: climb.log });
  if (!error) return true;
  // If the database doesn't have the streak columns yet, still save the rest of the progress.
  const fallback = await supabase.from('climbs').upsert(base);
  return !fallback.error;
}

function scheduleRetry() {
  clearTimeout(retryTimer);
  retryTimer = setTimeout(requestSync, RETRY_MS);
}

async function syncOnce(userId: string) {
  const remote = await fetchRemote(userId);
  if (userId !== syncUser) return; // signed out (or switched accounts) meanwhile
  if (!remote) return scheduleRetry(); // never save without knowing what's there

  const local = readClimb();
  const untouched = lastSynced !== null && sameClimb(remote, lastSynced);
  // This device's copy wins only if nobody else changed the account and it isn't a wiped-out copy.
  const next = untouched && !(isEmptyClimb(local) && !isEmptyClimb(remote)) ? local : mergeClimbs(local, remote);

  if (!sameClimb(next, local)) {
    applyingRemote = true;
    replaceClimb(next);
    applyingRemote = false;
  }
  if (sameClimb(next, remote)) {
    lastSynced = next;
    return;
  }
  const saved = await pushClimb(userId, next);
  if (userId !== syncUser) return;
  if (saved) lastSynced = next;
  else scheduleRetry();
}

/** Sync now, or right after the sync that's already running. */
function requestSync() {
  if (!syncUser || applyingRemote) return;
  if (syncing) {
    syncAgain = true;
    return;
  }
  syncing = true;
  void (async () => {
    try {
      do {
        syncAgain = false;
        clearTimeout(retryTimer);
        if (syncUser) await syncOnce(syncUser);
      } while (syncAgain && syncUser);
    } catch {
      scheduleRetry();
    } finally {
      syncing = false;
    }
  })();
}

/** Start syncing with this account (or stop, with null). */
function startSync(userId: string | null) {
  syncUser = userId;
  lastSynced = null;
  clearTimeout(retryTimer);
  if (userId) requestSync();
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
        startSync(null); // stop first, so the cleared copy is never saved
        clearClimb();
        clearProfile();
      }
      if (next && (event === 'INITIAL_SESSION' || (event === 'SIGNED_IN' && wasSignedOut))) {
        // Supabase recommends doing follow-up requests outside this callback.
        window.setTimeout(() => {
          startSync(next.id);
          syncProfile(next);
          saveTimeZone(next.id);
        }, 0);
      }
    });
    return () => data.subscription.unsubscribe();
  }, [router]);

  // Save progress to the account whenever it changes on this device, and catch up
  // with other devices when the learner comes back to this tab or gets back online.
  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeClimb(() => {
      if (!signingOut.current) requestSync();
    });
    const onVisible = () => {
      if (document.visibilityState === 'visible') requestSync();
    };
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('online', requestSync);
    return () => {
      unsubscribe();
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('online', requestSync);
    };
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
    startSync(null);
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
    startSync(null);
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
