import { useMemo, useSyncExternalStore } from 'react';
import type { Track } from '@/lib/courses';

// Answers from the "Get started" survey. Kept in this browser for guests and
// copied to the account (user metadata) once they sign up or log in.
export type Profile = {
  track: Track;
  speaks: string[];
  level: 'new' | 'some-words' | 'basic' | 'conversational';
  reason: string;
  heardFrom: string;
  dailyMinutes: number;
  completedAt: string;
};

const KEY = 'kwanqa-profile-v1';
const listeners = new Set<() => void>();

function readRaw(): string {
  try {
    return window.localStorage.getItem(KEY) ?? '';
  } catch {
    return '';
  }
}

function parse(raw: string): Profile | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw);
    return value && (value.track === 'amharic' || value.track === 'english') ? (value as Profile) : null;
  } catch {
    return null;
  }
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener('storage', callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener('storage', callback);
  };
}

function notify() {
  listeners.forEach(listener => listener());
}

export function readProfile(): Profile | null {
  return parse(readRaw());
}

export function saveProfile(profile: Profile) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(profile));
  } catch {
    // storage unavailable; the survey just won't be remembered
  }
  notify();
}

export function clearProfile() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // nothing to clear
  }
  notify();
}

/** The survey answers on this device, or null if the visitor hasn't taken it. */
export function useProfile(): Profile | null {
  const raw = useSyncExternalStore(subscribe, readRaw, () => '');
  return useMemo(() => parse(raw), [raw]);
}

/** False until the browser has been read, so pages don't flash the wrong view. */
export function useProfileReady(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}
