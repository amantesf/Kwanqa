import type { User } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { AppState } from 'react-native';
import { clearClimb, mergeClimbs, readClimb, replaceClimb, subscribeClimb, type Climb } from '@/lib/climb';
import { clearProfile, normalizeProfile, readProfile, saveProfile, subscribeProfile } from '@/lib/profile';
import { signOutOfGoogle } from '@/social';
import { accountsEnabled, supabase } from '@/supabase';

// Accounts in the app, and keeping the phone's climb in step with the account's
// `climbs` row, the same row the website uses. The sync follows the website's
// rules (components/AuthProvider.tsx): it always reads the account first and
// never saves blindly, so another device can't lose progress:
// - if nobody else changed the account since our last sync, this phone's copy wins;
// - otherwise both copies are merged (every finished lesson and day is kept).

type AuthState = {
  user: User | null;
  loading: boolean;
  enabled: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState>({ user: null, loading: false, enabled: false, signOut: async () => {} });

export function useAuth() {
  return useContext(AuthContext);
}

export function displayName(user: User | null) {
  const meta = user?.user_metadata ?? {};
  const name = meta.name ?? meta.full_name;
  if (typeof name === 'string' && name.trim()) return name.trim().split(' ')[0];
  return user?.email?.split('@')[0] ?? '';
}

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

const sameClimb = (a: Climb, b: Climb) => stable(a) === stable(b);
const isEmptyClimb = (c: Climb) => Object.keys(c.completed).length === 0 && c.grass === 0 && c.days.length === 0;

/** The account's saved climb, or null if it couldn't be read (offline, server error). */
async function fetchRemote(userId: string): Promise<Climb | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from('climbs').select('completed, grass, days, log').eq('user_id', userId).maybeSingle();
  if (error) return null;
  const row = data as { completed?: Climb['completed']; grass?: number; days?: string[]; log?: Climb['log'] } | null;
  return {
    completed: row?.completed && typeof row.completed === 'object' ? row.completed : {},
    grass: typeof row?.grass === 'number' ? row.grass : 0,
    days: Array.isArray(row?.days) ? row.days : [],
    log: row?.log && typeof row.log === 'object' ? row.log : {},
  };
}

async function pushClimb(userId: string, climb: Climb) {
  if (!supabase) return false;
  const { error } = await supabase.from('climbs').upsert({
    user_id: userId,
    completed: climb.completed,
    grass: climb.grass,
    days: climb.days,
    log: climb.log,
    updated_at: new Date().toISOString(),
  });
  return !error;
}

function scheduleRetry() {
  clearTimeout(retryTimer);
  retryTimer = setTimeout(requestSync, RETRY_MS);
}

async function syncOnce(userId: string) {
  const remote = await fetchRemote(userId);
  if (userId !== syncUser) return; // signed out meanwhile
  if (!remote) return scheduleRetry(); // never save without knowing what's there

  const local = readClimb();
  const untouched = lastSynced !== null && sameClimb(remote, lastSynced);
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

function startSync(userId: string | null) {
  syncUser = userId;
  lastSynced = null;
  clearTimeout(retryTimer);
  if (userId) requestSync();
}

/** Keep the survey answers in step between this phone and the account. */
async function syncProfile(user: User) {
  const raw = user.user_metadata?.onboarding as Record<string, unknown> | undefined;
  const saved = raw ? normalizeProfile(raw) : undefined;
  const local = readProfile();
  if (saved && !local) saveProfile(saved);
  else if (local && !saved) await supabase?.auth.updateUser({ data: { onboarding: local } });
}

/** Remembers the learner's time zone, so streak reminder emails arrive at 7 pm their time. */
async function saveTimeZone(userId: string) {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (timeZone) await supabase?.from('reminders').upsert({ user_id: userId, time_zone: timeZone, updated_at: new Date().toISOString() });
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(accountsEnabled);
  const signingOut = useRef(false);
  const currentUserId = useRef<string | null>(null);

  useEffect(() => {
    if (!supabase) return;
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      const next = session?.user ?? null;
      const wasSignedOut = currentUserId.current === null;
      currentUserId.current = next?.id ?? null;
      setUser(next);
      setLoading(false);
      if (event === 'SIGNED_OUT') {
        // never leave one person's progress for the next
        startSync(null);
        clearClimb();
        clearProfile();
      }
      if (next && (event === 'INITIAL_SESSION' || (event === 'SIGNED_IN' && wasSignedOut))) {
        // Supabase recommends doing follow-up requests outside this callback.
        setTimeout(() => {
          startSync(next.id);
          void syncProfile(next);
          void saveTimeZone(next.id);
        }, 0);
      }
    });
    return () => data.subscription.unsubscribe();
  }, []);

  // Save progress whenever it changes on the phone, and catch up with other
  // devices whenever the app comes back to the front.
  useEffect(() => {
    if (!user) return;
    const stopClimb = subscribeClimb(() => {
      if (!signingOut.current) requestSync();
    });
    const stopProfile = subscribeProfile(() => {
      const profile = readProfile();
      if (profile && !signingOut.current) void supabase?.auth.updateUser({ data: { onboarding: profile } });
    });
    const appState = AppState.addEventListener('change', state => {
      if (state === 'active') requestSync();
    });
    return () => {
      stopClimb();
      stopProfile();
      appState.remove();
    };
  }, [user]);

  async function signOut() {
    if (signingOut.current) return;
    signingOut.current = true;
    startSync(null);
    await supabase?.auth.signOut();
    await signOutOfGoogle();
    clearClimb(); // the account keeps the progress; this phone forgets it
    clearProfile();
    signingOut.current = false;
  }

  return <AuthContext.Provider value={{ user, loading, enabled: accountsEnabled, signOut }}>{children}</AuthContext.Provider>;
}
