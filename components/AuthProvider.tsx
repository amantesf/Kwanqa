'use client';

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { showToast } from '@/components/Toaster';
import { accountsEnabled, supabase } from '@/lib/supabase';
import { clearClimb, mergeClimbs, readClimb, replaceClimb, subscribeClimb, type Climb } from '@/lib/climb';

type AuthState = {
  user: User | null;
  loading: boolean;
  enabled: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState>({
  user: null,
  loading: false,
  enabled: false,
  signOut: async () => {},
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
  await supabase
    ?.from('climbs')
    .upsert({ user_id: userId, completed: climb.completed, grass: climb.grass, updated_at: new Date().toISOString() });
}

/** Combine this browser's progress with the account's, then save both. */
async function pullAndMerge(userId: string) {
  if (!supabase) return;
  const { data, error } = await supabase.from('climbs').select('completed, grass').eq('user_id', userId).maybeSingle();
  if (error) return;
  const remote: Climb = data
    ? { completed: (data.completed as Climb['completed']) ?? {}, grass: data.grass ?? 0 }
    : { completed: {}, grass: 0 };
  const merged = mergeClimbs(readClimb(), remote);
  replaceClimb(merged);
  await pushClimb(userId, merged);
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

      if (event === 'SIGNED_OUT') {
        // Covers expired sessions too: never leave one person's progress for the next.
        clearClimb();
      }
      if (next && (event === 'INITIAL_SESSION' || (event === 'SIGNED_IN' && wasSignedOut))) {
        // Supabase recommends doing follow-up requests outside this callback.
        window.setTimeout(() => pullAndMerge(next.id), 0);
      }
      if (event === 'SIGNED_IN' && wasSignedOut && next && !window.location.pathname.startsWith('/auth')) {
        showToast(`Welcome, ${displayName(next)}! You’re logged in.`);
      }
    });
    return () => data.subscription.unsubscribe();
  }, []);

  // Save progress to the account whenever it changes on this device.
  useEffect(() => {
    if (!user) return;
    return subscribeClimb(() => {
      if (!signingOut.current) pushClimb(user.id, readClimb());
    });
  }, [user]);

  async function signOut() {
    signingOut.current = true;
    await supabase?.auth.signOut();
    clearClimb(); // the account keeps the progress; this device forgets it
    signingOut.current = false;
    router.push('/');
    showToast('You’re logged out. See you on the trail!');
  }

  return (
    <AuthContext.Provider value={{ user, loading, enabled: accountsEnabled, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
