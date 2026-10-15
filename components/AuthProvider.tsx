'use client';

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
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
  const name = user?.user_metadata?.name;
  if (typeof name === 'string' && name.trim()) return name.trim();
  return user?.email?.split('@')[0] ?? '';
}

async function pushClimb(userId: string, climb: Climb) {
  await supabase
    ?.from('climbs')
    .upsert({ user_id: userId, completed: climb.completed, grass: climb.grass, updated_at: new Date().toISOString() });
}

/** On sign-in, combine this browser's progress with the account's, then save both. */
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

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(accountsEnabled);
  const signingOut = useRef(false);

  // Track the signed-in user.
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (event === 'SIGNED_IN' && session?.user) {
        // Run outside the auth callback, as Supabase recommends.
        window.setTimeout(() => pullAndMerge(session.user.id), 0);
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
  }

  return (
    <AuthContext.Provider value={{ user, loading, enabled: accountsEnabled, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
