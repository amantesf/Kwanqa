import { useMemo, useSyncExternalStore } from 'react';
import { shuffle, type Exercise } from '@/lib/exercises';
import { onOtherTab, storage } from '@/lib/storage';

// The questions each learner got wrong, kept per camp so they can be asked
// again before the learner moves on to the next camp. The exact question is
// saved (not just the word), so the review asks what they actually missed.
//
// Once a question is put right it isn't forgotten straight away: it moves up
// a "box" and comes back for practice after 1, 3, 7 and then 16 days (spaced
// repetition), until it's answered right on the first try from the last box.
// Only questions not yet put right (box 0) hold up a camp's review stone.
// Like the climb, it's kept on this device and synced with the learner's
// account (lib/accountSync.ts), so it follows them to the app or a new phone.

const KEY = 'kwanqa-mistakes-v1';
/** Most saved questions per camp; the oldest fall off first. */
export const MAX_PER_CAMP = 40;
/** Questions in one review session. */
export const REVIEW_SIZE = 12;
/** Days until a question in each box comes back for practice. */
const SPACING_DAYS = [0, 1, 3, 7, 16];
const DAY = 24 * 60 * 60 * 1000;

/** Not put right yet: still waiting for the camp's review. */
export const isPending = (m: SavedMistake) => !m.box;

/** How many of a camp's saved questions still need its review. */
export function pendingCount(list: SavedMistake[] | undefined) {
  return (list ?? []).filter(isPending).length;
}

export type SavedMistake = {
  key: string;
  lesson: number;
  exercise: Exercise;
  /** When it last changed (got wrong, or practised): the newer copy wins when syncing. */
  at: number;
  /** 0 or missing: not put right yet. 1–4: put right, and spaced out further each time. */
  box?: number;
  /** When it's next due for practice (missing: now). */
  due?: number;
};
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

/** Saves a question the learner just got wrong (back to box 0 if it was already saved). */
export function recordMistake(slug: string, lesson: number, exercise: Exercise) {
  if (exercise.kind === 'match') return; // matching rounds can't be failed
  const store = parse(readRaw());
  const key = keyOf(lesson, exercise);
  const list = (store[slug] ?? []).filter(m => m.key !== key);
  list.push({ key, lesson, exercise, at: Date.now() });
  store[slug] = list.slice(-MAX_PER_CAMP);
  write(store);
}

/** Questions put right in a camp's review: into box 1, back for practice tomorrow. */
export function fixMistakes(slug: string, keys: string[]) {
  const store = parse(readRaw());
  const fixed = new Set(keys);
  const now = Date.now();
  store[slug] = (store[slug] ?? []).map(m => (fixed.has(m.key) ? { ...m, box: Math.max(m.box ?? 0, 1), due: now + DAY, at: now } : m));
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
  const picked = list.filter(isPending).slice(-REVIEW_SIZE);
  return { exercises: asked(picked, 'review'), keys: picked.map(m => m.key) };
}

/** Saved questions ready to ask again: in a fresh order, with their answers shuffled. */
function asked(list: SavedMistake[], prefix: string) {
  return shuffle(list.map((m, i) => ({ m, i }))).map(({ m, i }): Exercise => {
    const id = `${prefix}-${i}`;
    if (m.exercise.kind === 'choice') return { ...m.exercise, id, options: shuffle(m.exercise.options) };
    if (m.exercise.kind === 'build') return { ...m.exercise, id, tiles: shuffle(m.exercise.tiles) };
    return { ...m.exercise, id };
  });
}

/** Saved questions across these camps that are due for practice now, oldest first. */
export function dueForPractice(store: Store, slugs: string[], now = Date.now()) {
  return slugs
    .flatMap(slug => (store[slug] ?? []).map(m => ({ slug, m })))
    .filter(({ m }) => (m.due ?? 0) <= now)
    .sort((a, b) => (a.m.due ?? a.m.at) - (b.m.due ?? b.m.at));
}

/**
 * Personal practice: up to REVIEW_SIZE questions due across the learner's
 * camps. Question ids are "practice-<n>", and keys[n] is "<camp>::<key>", so
 * settlePractice can tell which were missed.
 */
export function practiceSession(store: Store, slugs: string[]) {
  const picked = dueForPractice(store, slugs).slice(0, REVIEW_SIZE);
  return { exercises: asked(picked.map(p => p.m), 'practice'), keys: picked.map(p => `${p.slug}::${p.m.key}`) };
}

/**
 * After a practice session: each question answered right the first time
 * moves up a box (and out of the list after the last one); one that was
 * missed goes back to box 1, due tomorrow.
 */
export function settlePractice(keys: string[], missedIds: Set<string>) {
  const store = parse(readRaw());
  const now = Date.now();
  keys.forEach((full, i) => {
    const cut = full.indexOf('::');
    const slug = full.slice(0, cut);
    const key = full.slice(cut + 2);
    const list = store[slug];
    const at = list?.findIndex(m => m.key === key) ?? -1;
    if (!list || at === -1) return;
    const m = list[at];
    const box = missedIds.has(`practice-${i}`) ? 1 : (m.box ?? 0) + 1;
    if (box >= SPACING_DAYS.length) list.splice(at, 1); // mastered
    else list[at] = { ...m, box, due: now + SPACING_DAYS[box] * DAY, at: now };
    if (!list.length) delete store[slug];
  });
  write(store);
}
