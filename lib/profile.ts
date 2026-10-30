import { useMemo, useSyncExternalStore } from 'react';
import type { Track } from '@/lib/courses';
import { onOtherTab, storage } from '@/lib/storage';

// Answers from the "Get started" survey. Kept in this browser for guests and
// copied to the account (user metadata) once they sign up or log in.
export type Level = 'new' | 'some-words' | 'basic' | 'conversational';

export type Profile = {
  track: Track; // the course being climbed right now
  tracks: Track[]; // every course the learner has chosen 
  speaks: string[];
  level: Level; // the answer for `track` when the survey was taken
  /** How much of each language the learner already knew; decides where their trail starts. */
  levels: Partial<Record<Track, Level>>;
  reasons: string[];
  heardFrom: string[];
  dailyMinutes: number;
  completedAt: string;
};

const KEY = 'kwanqa-profile-v1';
const listeners = new Set<() => void>();

function readRaw(): string {
  try {
    return storage().getItem(KEY) ?? '';
  } catch {
    return '';
  }
}

function parse(raw: string): Profile | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw);
    if (!value || (value.track !== 'amharic' && value.track !== 'english')) return null;
    return normalizeProfile(value);
  } catch {
    return null;
  }
}

// Early versions stored one reason and one source; turn them into lists.
const asList = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : typeof v === 'string' ? [v] : [];

const isTrack = (t: unknown): t is Track => t === 'amharic' || t === 'english';
const isLevel = (l: unknown): l is Level =>
  l === 'new' || l === 'some-words' || l === 'basic' || l === 'conversational';

export function normalizeProfile(value: Record<string, unknown>): Profile {
  const track = value.track as Track;
  const tracks = asList(value.tracks).filter(isTrack);
  const level = isLevel(value.level) ? value.level : 'new';
  const saved = value.levels && typeof value.levels === 'object' ? (value.levels as Record<string, unknown>) : {};
  const levels: Partial<Record<Track, Level>> = {};
  for (const t of ['amharic', 'english'] as Track[]) if (isLevel(saved[t])) levels[t] = saved[t];
  // Answers saved before per-language levels: the level was for the course chosen then.
  if (!levels[track] && !value.levels) levels[track] = level;
  return {
    ...(value as Profile),
    track,
    tracks: tracks.includes(track) ? tracks : [...tracks, track],
    level,
    levels,
    speaks: asList(value.speaks),
    reasons: asList(value.reasons ?? value.reason),
    heardFrom: asList(value.heardFrom),
  };
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  const stop = onOtherTab(() => callback());
  return () => {
    listeners.delete(callback);
    stop();
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
    storage().setItem(KEY, JSON.stringify(profile));
  } catch {
    // storage unavailable; the survey just won't be remembered
  }
  notify();
}

export function clearProfile() {
  try {
    storage().removeItem(KEY);
  } catch {
    // nothing to clear
  }
  notify();
}

/** Make another course the active one (adding it to "My courses" if new). */
export function switchTrack(track: Track) {
  const profile = readProfile();
  if (!profile) return;
  const tracks = profile.tracks.includes(track) ? profile.tracks : [...profile.tracks, track];
  saveProfile({ ...profile, track, tracks });
}

/** Notifies on every change to the survey answers (used to sync to the account). */
export function subscribeProfile(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
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
