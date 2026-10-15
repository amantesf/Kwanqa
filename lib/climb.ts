import { useMemo, useSyncExternalStore } from 'react';
import { courseCatalog, courseContent, type Track } from '@/lib/courses';

// The learner's climb lives in this browser's localStorage (there are no accounts yet).
export type Climb = {
  completed: Record<string, number[]>; // course slug -> completed lesson indexes
  grass: number; // ሳር — earned by finishing lessons, spent to recover stamina
};

const KEY = 'kwanqa-climb-v1';
const LEGACY_KEY = 'kwanqa-progress-v1';
const EMPTY = '{"completed":{},"grass":0}';

// Grass economy
export const LESSON_GRASS = 10;
export const PERFECT_BONUS = 5;
export const REPLAY_GRASS = 3;
export const REST_COST = 10;

// Altitude: the trail climbs from the foothills to Ras Dashen.
export const BASE_ALTITUDE = 2000;
export const SUMMIT_ALTITUDE = 4550;

const listeners = new Set<() => void>();

function readRaw(): string {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) return raw;
    // Carry over lesson progress saved before grass existed.
    const legacy = window.localStorage.getItem(LEGACY_KEY);
    return legacy ? JSON.stringify({ completed: JSON.parse(legacy), grass: 0 }) : EMPTY;
  } catch {
    return EMPTY;
  }
}

function parse(raw: string): Climb {
  try {
    const value = JSON.parse(raw);
    return {
      completed: value?.completed && typeof value.completed === 'object' ? value.completed : {},
      grass: Number.isFinite(value?.grass) ? Math.max(0, value.grass) : 0,
    };
  } catch {
    return { completed: {}, grass: 0 };
  }
}

function write(climb: Climb) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(climb));
  } catch {
    // storage unavailable; the climb just won't persist
  }
  listeners.forEach(listener => listener());
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener('storage', callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener('storage', callback);
  };
}

/** Notifies on every local progress change (used to sync to the account). */
export function subscribeClimb(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

export function readClimb(): Climb {
  return parse(readRaw());
}

export function replaceClimb(climb: Climb) {
  write(climb);
}

export function clearClimb() {
  try {
    window.localStorage.removeItem(KEY);
    window.localStorage.removeItem(LEGACY_KEY);
  } catch {
    // nothing to clear
  }
  listeners.forEach(listener => listener());
}

/** Combines two climbs: every completed lesson from both, and the larger grass total. */
export function mergeClimbs(a: Climb, b: Climb): Climb {
  const completed: Climb['completed'] = {};
  for (const slug of new Set([...Object.keys(a.completed), ...Object.keys(b.completed)])) {
    completed[slug] = [...new Set([...(a.completed[slug] ?? []), ...(b.completed[slug] ?? [])])].sort(
      (x, y) => x - y,
    );
  }
  return { completed, grass: Math.max(a.grass, b.grass) };
}

export function useClimb(): Climb {
  const raw = useSyncExternalStore(subscribe, readRaw, () => EMPTY);
  return useMemo(() => parse(raw), [raw]);
}

export function isDone(climb: Climb, slug: string, lesson: number) {
  return climb.completed[slug]?.includes(lesson) ?? false;
}

/** Marks a lesson complete and awards grass. Returns the grass earned. */
export function completeLesson(slug: string, lesson: number, mistakes: number) {
  const climb = parse(readRaw());
  const firstTime = !isDone(climb, slug, lesson);
  const earned = firstTime ? LESSON_GRASS + (mistakes === 0 ? PERFECT_BONUS : 0) : REPLAY_GRASS;
  const done = new Set(climb.completed[slug] ?? []);
  done.add(lesson);
  climb.completed[slug] = [...done].sort((a, b) => a - b);
  climb.grass += earned;
  write(climb);
  return earned;
}

/** Spends grass if the learner has enough. Returns whether it worked. */
export function spendGrass(amount: number) {
  const climb = parse(readRaw());
  if (climb.grass < amount) return false;
  climb.grass -= amount;
  write(climb);
  return true;
}

export function trackCourses(track: Track) {
  return courseCatalog.filter(c => c.track === track).sort((a, b) => a.part - b.part);
}

/** The first unfinished lesson on a track, or null once the summit is reached. */
export function nextLesson(climb: Climb, track: Track) {
  for (const course of trackCourses(track)) {
    const lessons = courseContent[course.slug]?.sections ?? [];
    const idx = lessons.findIndex((_, i) => !isDone(climb, course.slug, i));
    if (idx !== -1) return { slug: course.slug, lesson: idx };
  }
  return null;
}

export function trackTotals(climb: Climb, track: Track) {
  let total = 0;
  let done = 0;
  for (const course of trackCourses(track)) {
    const lessons = courseContent[course.slug]?.sections ?? [];
    total += lessons.length;
    done += lessons.filter((_, i) => isDone(climb, course.slug, i)).length;
  }
  return { total, done };
}

export function altitudeFor(done: number, total: number) {
  const ratio = total ? done / total : 0;
  return Math.round((BASE_ALTITUDE + ratio * (SUMMIT_ALTITUDE - BASE_ALTITUDE)) / 10) * 10;
}

// Real vegetation bands of the Simien Mountains (approximate).
const ZONES = [
  { below: 2800, name: 'Farmland foothills', tone: 'foothills' },
  { below: 3300, name: 'Montane forest', tone: 'forest' },
  { below: 3800, name: 'Heather belt', tone: 'heather' },
  { below: Infinity, name: 'Afroalpine meadows', tone: 'alpine' },
] as const;

export type Zone = { name: string; tone: (typeof ZONES)[number]['tone']; from: number; to: number };

/** The altitude band a camp covers, given how many camps share the mountain. */
export function zoneForCamp(campIdx: number, campCount: number): Zone {
  const span = (SUMMIT_ALTITUDE - BASE_ALTITUDE) / Math.max(campCount, 1);
  const from = Math.round(BASE_ALTITUDE + span * campIdx);
  const to = Math.round(BASE_ALTITUDE + span * (campIdx + 1));
  const zone = ZONES.find(z => (from + to) / 2 < z.below)!;
  return { name: zone.name, tone: zone.tone, from, to };
}

// Walia's horns grow a new ridge as grass is collected, like a real ibex's.
const HORN_THRESHOLDS = [0, 30, 80, 150, 250];
const HORN_SCALES = [0.72, 0.86, 1, 1.12, 1.24];

export function hornLevel(grass: number) {
  let level = 0;
  HORN_THRESHOLDS.forEach((threshold, i) => {
    if (grass >= threshold) level = i;
  });
  const next = HORN_THRESHOLDS[level + 1] ?? null;
  return { level: level + 1, scale: HORN_SCALES[level], next, max: HORN_THRESHOLDS.length };
}
