import { useMemo, useSyncExternalStore } from 'react';
import { shuffle, type Exercise } from '@/lib/exercises';

// The questions each learner got wrong, kept per camp so they can be asked
// again before the learner moves on to the next camp. The exact question is
// saved (not just the word), so the review asks what they actually missed.
// Like the climb, this lives in this browser's localStorage.

const KEY = 'kwanqa-mistakes-v1';
/** Most saved questions per camp; the oldest fall off first. */
const MAX_PER_CAMP = 40;
/** Questions in one review session. */
export const REVIEW_SIZE = 12;

export type SavedMistake = { key: string; lesson: number; exercise: Exercise; at: number };
type Store = Record<string, SavedMistake[]>;

const listeners = new Set<() => void>();

function readRaw(): string {
  try {
    return window.localStorage.getItem(KEY) ?? '{}';
  } catch {
    return '{}';
  }
}

function parse(raw: string): Store {
  try {
    const value = JSON.parse(raw);
    if (!value || typeof value !== 'object') return {};
    const store: Store = {};
    for (const [slug, list] of Object.entries(value)) {
      if (Array.isArray(list)) store[slug] = list.filter(m => m && typeof m.key === 'string' && m.exercise);
    }
    return store;
  } catch {
    return {};
  }
}

function write(store: Store) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(store));
  } catch {
    // storage full or blocked: the review just won't happen
  }
  listeners.forEach(fn => fn());
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) callback();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener('storage', onStorage);
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
