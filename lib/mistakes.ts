import { useMemo, useSyncExternalStore } from 'react';
import { shuffle, type Exercise } from '@/lib/exercises';
import { onOtherTab, storage } from '@/lib/storage';

// The questions each learner got wrong, kept per camp so they can be asked
// again before the learner moves on to the next camp. The exact question is
// saved (not just the word), so the review asks what they actually missed.
// Like the climb, it's kept on this device and synced with the learner's
// account (lib/accountSync.ts), so it follows them to the app or a new phone.

const KEY = 'kwanqa-mistakes-v1';
/** Most saved questions per camp; the oldest fall off first. */
export const MAX_PER_CAMP = 40;
/** Questions in one review session. */
export const REVIEW_SIZE = 12;

export type SavedMistake = { key: string; lesson: number; exercise: Exercise; at: number };
export type MistakeStore = Record<string, SavedMistake[]>;
type Store = MistakeStore;

const listeners = new Set<() => void>();

function readRaw(): string {
  try {
    return storage().getItem(KEY) ?? '{}';
  } catch {
    return '{}';
  }
}

function parse(raw: string): Store {
  try {
    return cleanMistakes(JSON.parse(raw));
  } catch {
    return {};
  }
}

/** Keeps only well-formed saved questions (from this device or the account). */
export function cleanMistakes(value: unknown): Store {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const store: Store = {};
  for (const [slug, list] of Object.entries(value).slice(0, 64)) {
    if (!Array.isArray(list)) continue;
    const kept = list
      .filter(
        m =>
          m &&
          typeof m.key === 'string' &&
          typeof m.lesson === 'number' &&
          typeof m.at === 'number' &&
          m.exercise &&
          typeof m.exercise === 'object' &&
          typeof m.exercise.kind === 'string',
      )
      .slice(-MAX_PER_CAMP);
    if (kept.length) store[slug] = kept;
  }
  return store;
}

function write(store: Store) {
  try {
    storage().setItem(KEY, JSON.stringify(store));
  } catch {
    // storage full or blocked: the review just won't happen
  }
  listeners.forEach(fn => fn());
}

/** Calls back whenever the saved mistakes change. */
export function subscribeMistakes(callback: () => void) {
  return subscribe(callback);
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  const stop = onOtherTab(key => {
    if (key === KEY) callback();
  });
  return () => {
    listeners.delete(callback);
    stop();
  };
}

/** One question, however its options were shuffled. */
function keyOf(lesson: number, exercise: Exercise) {
  if (exercise.kind === 'match') return `${lesson}|match|${exercise.pairs.map(p => p.left).sort().join('/')}`;
  const answer = exercise.kind === 'build' ? exercise.answer.join(' ') : exercise.answer;
  return `${lesson}|${exercise.kind}|${exercise.instruction}|${exercise.prompt}|${answer}`;
}

/** Saves a question the learner just got wrong. */
export function recordMistake(slug: string, lesson: number, exercise: Exercise) {
  if (exercise.kind === 'match') return; // matching rounds can't be failed
  const store = parse(readRaw());
  const key = keyOf(lesson, exercise);
  const list = (store[slug] ?? []).filter(m => m.key !== key);
  list.push({ key, lesson, exercise, at: Date.now() });
  store[slug] = list.slice(-MAX_PER_CAMP);
  write(store);
}

/** Forgets questions once they've been answered right in a review. */
export function clearMistakes(slug: string, keys: string[]) {
  const store = parse(readRaw());
  const gone = new Set(keys);
  const left = (store[slug] ?? []).filter(m => !gone.has(m.key));
  if (left.length) store[slug] = left;
  else delete store[slug];
  write(store);
}

/** Puts in the saved mistakes after syncing with the account. */
export function replaceMistakes(store: Store) {
  write(store);
}

/** Forgets every saved mistake on this device (on sign-out; the account keeps them). */
export function clearAllMistakes() {
  try {
    storage().removeItem(KEY);
  } catch {
    // nothing to clear
  }
  listeners.forEach(fn => fn());
}

/** Saved mistakes for every camp, as they are right now. */
export function readMistakes(): Store {
  return parse(readRaw());
}

/** Saved mistakes for every camp, kept up to date. */
export function useMistakes(): Store {
  const raw = useSyncExternalStore(subscribe, readRaw, () => '{}');
  return useMemo(() => parse(raw), [raw]);
}

/**
 * The questions for one review session: the most recent mistakes, in a fresh
 * order, with their answers shuffled again so it isn't a memory test of where
 * the right one was.
 */
export function reviewSession(list: SavedMistake[]) {
  const picked = list.slice(-REVIEW_SIZE);
  const exercises = shuffle(picked).map((m, i): Exercise => {
    const id = `review-${i}`;
    if (m.exercise.kind === 'choice') return { ...m.exercise, id, options: shuffle(m.exercise.options) };
    if (m.exercise.kind === 'build') return { ...m.exercise, id, tiles: shuffle(m.exercise.tiles) };
    return { ...m.exercise, id };
  });
  return { exercises, keys: picked.map(m => m.key) };
}
