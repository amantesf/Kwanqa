import { onOtherTab, storage } from '@/lib/storage';

// Which passport stamps this learner has already been shown the "New stamp!"
// celebration for, as "track:camp-slug" keys. It's synced with the account
// (lib/accountSync.ts), so a stamp celebrated on one device isn't celebrated
// again on another. Before anything is saved it's null, and the trail files
// away the stamps that are already earned without a celebration.

const KEY = 'kwanqa-stamps-seen-v1';
const VALID = /^(amharic|english):[a-z0-9-]{1,80}$/;
const MAX = 200;

const listeners = new Set<() => void>();

/** Keeps only well-formed keys, without duplicates. */
export function cleanSeen(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((k): k is string => typeof k === 'string' && VALID.test(k)))].slice(0, MAX);
}

/** The stamps already celebrated, or null if nothing has been saved yet. */
export function readSeen(): string[] | null {
  try {
    const raw = storage().getItem(KEY);
    return raw ? cleanSeen(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

export function writeSeen(keys: string[]) {
  try {
    storage().setItem(KEY, JSON.stringify(cleanSeen(keys)));
  } catch {
    // storage unavailable: a celebration may show again, which is harmless
  }
  listeners.forEach(fn => fn());
}

/** Adds stamps to the celebrated list. */
export function markSeen(keys: string[]) {
  if (!keys.length) return;
  writeSeen([...(readSeen() ?? []), ...keys]);
}

/** Forgets the list on this device (on sign-out; the account keeps it). */
export function clearSeen() {
  try {
    storage().removeItem(KEY);
  } catch {
    // nothing to clear
  }
  listeners.forEach(fn => fn());
}

export function subscribeSeen(callback: () => void) {
  listeners.add(callback);
  const stop = onOtherTab(key => {
    if (key === KEY) callback();
  });
  return () => {
    listeners.delete(callback);
    stop();
  };
}
