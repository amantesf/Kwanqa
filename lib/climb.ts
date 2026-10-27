import { useMemo, useSyncExternalStore } from 'react';
import { courseCatalog, courseContent, type Track } from '@/lib/courses';
import type { Level } from '@/lib/profile';
import { onOtherTab, storage } from '@/lib/storage';

// The learner's climb lives in this browser's localStorage (there are no accounts yet).
export type Climb = {
  completed: Record<string, number[]>; // course slug -> completed lesson indexes
  grass: number; // ሳር: earned by finishing lessons, spent to recover stamina
  days: string[]; // local dates (YYYY-MM-DD) with at least one finished lesson, for the climb streak
  log: Record<string, DayWork>; // what the learner did on each of those dates
};

/** One day's work: lessons finished, questions answered (right and wrong), and time spent. */
export type DayWork = { lessons: number; answers: number; correct: number; seconds: number };

const KEY = 'kwanqa-climb-v1';
const LEGACY_KEY = 'kwanqa-progress-v1';
const EMPTY = '{"completed":{},"grass":0,"days":[],"log":{}}';

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
    const raw = storage().getItem(KEY);
    if (raw) return raw;
    // Carry over lesson progress saved before grass existed.
    const legacy = storage().getItem(LEGACY_KEY);
    return legacy ? JSON.stringify({ completed: JSON.parse(legacy), grass: 0, days: [], log: {} }) : EMPTY;
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
      days: Array.isArray(value?.days) ? value.days.filter(isDateKey) : [],
      log: parseLog(value?.log),
    };
  } catch {
    return { completed: {}, grass: 0, days: [], log: {} };
  }
}

function write(climb: Climb) {
  try {
    storage().setItem(KEY, JSON.stringify(climb));
  } catch {
    // storage unavailable; the climb just won't persist
  }
  listeners.forEach(listener => listener());
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  const stop = onOtherTab(() => callback());
  return () => {
    listeners.delete(callback);
    stop();
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
    storage().removeItem(KEY);
    storage().removeItem(LEGACY_KEY);
  } catch {
    // nothing to clear
  }
  listeners.forEach(listener => listener());
}

/** Combines two climbs: every completed lesson and practice day from both, and the larger grass total. */
export function mergeClimbs(a: Climb, b: Climb): Climb {
  const completed: Climb['completed'] = {};
  for (const slug of new Set([...Object.keys(a.completed), ...Object.keys(b.completed)])) {
    completed[slug] = [...new Set([...(a.completed[slug] ?? []), ...(b.completed[slug] ?? [])])].sort(
      (x, y) => x - y,
    );
  }
  const days = [...new Set([...a.days, ...b.days])].sort();
  // Each device saves the full day, so keep the larger count rather than adding them twice.
  const log: Record<string, DayWork> = { ...a.log };
  for (const [day, work] of Object.entries(b.log)) {
    const mine = log[day];
    log[day] = mine
      ? {
          lessons: Math.max(mine.lessons, work.lessons),
          answers: Math.max(mine.answers, work.answers),
          correct: Math.max(mine.correct, work.correct),
          seconds: Math.max(mine.seconds, work.seconds),
        }
      : work;
  }
  return { completed, grass: Math.max(a.grass, b.grass), days, log };
}

export function useClimb(): Climb {
  const raw = useSyncExternalStore(subscribe, readRaw, () => EMPTY);
  return useMemo(() => parse(raw), [raw]);
}

export function isDone(climb: Climb, slug: string, lesson: number) {
  return climb.completed[slug]?.includes(lesson) ?? false;
}

/** Marks a lesson complete and awards grass. Returns the grass earned. */
/** What happened during one lesson, for the daily log. */
export type LessonWork = { answers: number; correct: number; seconds: number };

// Time spent per lesson is capped, so a tab left open overnight doesn't count as hours of study.
const MAX_LESSON_SECONDS = 30 * 60;

/**
 * Marks a lesson finished and returns the grass earned. Only lessons with real
 * answered questions (`work`) count toward the daily log and the climb streak.
 */
export function completeLesson(slug: string, lesson: number, mistakes: number, work?: LessonWork) {
  const climb = parse(readRaw());
  const firstTime = !isDone(climb, slug, lesson);
  const earned = firstTime ? LESSON_GRASS + (mistakes === 0 ? PERFECT_BONUS : 0) : REPLAY_GRASS;
  const done = new Set(climb.completed[slug] ?? []);
  done.add(lesson);
  climb.completed[slug] = [...done].sort((a, b) => a - b);
  climb.grass += earned;
  if (work && work.answers > 0) logToday(climb, work);
  write(climb);
  return earned;
}

export const REVIEW_GRASS = 5;

/** A finished mistakes review: a little grass, and it counts toward today's work and streak. */
export function completeReview(work: LessonWork) {
  const climb = parse(readRaw());
  climb.grass += REVIEW_GRASS;
  if (work.answers > 0) logToday(climb, work);
  write(climb);
  return REVIEW_GRASS;
}

/** Adds one finished lesson or call to today's log and the climb streak. */
function logToday(climb: Climb, work: LessonWork) {
  const today = dateKey();
  if (!climb.days.includes(today)) climb.days = [...climb.days, today].sort();
  const day = climb.log[today] ?? { lessons: 0, answers: 0, correct: 0, seconds: 0 };
  climb.log = {
    ...climb.log,
    [today]: {
      lessons: day.lessons + 1,
      answers: day.answers + work.answers,
      correct: day.correct + work.correct,
      seconds: day.seconds + Math.min(Math.max(0, Math.round(work.seconds)), MAX_LESSON_SECONDS),
    },
  };
}

// Talk calls are kept in `completed` too, under "talk:<slug>", so they sync with
// the rest of the climb. The list holds the best number of questions the learner
// answered on their own (devices may each add one; the highest counts).
const CALL_PREFIX = 'talk:';

/** True for a `completed` key that belongs to a Talk call rather than a lesson. */
export function isCallKey(key: string) {
  return key.startsWith(CALL_PREFIX);
}

/** The most questions answered on their own in this call, or null if never finished. */
export function callBest(climb: Climb, slug: string): number | null {
  const list = climb.completed[CALL_PREFIX + slug];
  return list?.length ? Math.max(...list) : null;
}

/** Marks a Talk call finished, keeps the best score, and returns the grass earned. */
export function completeCall(slug: string, onOwn: number, questions: number, work: LessonWork) {
  const climb = parse(readRaw());
  const best = callBest(climb, slug);
  const earned = best === null ? LESSON_GRASS + (onOwn === questions ? PERFECT_BONUS : 0) : REPLAY_GRASS;
  climb.completed[CALL_PREFIX + slug] = [Math.max(best ?? 0, onOwn)];
  climb.grass += earned;
  if (work.answers > 0) logToday(climb, work);
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

// Placement: learners who already know some of the language start higher up
// the trail. The camps below stay open for review.
const PLACEMENT: Record<Level, number> = { new: 0, 'some-words': 0.2, basic: 0.4, conversational: 0.7 };

/** The camp (0-based) a learner starts at on a track, from their survey answer. */
export function startCamp(track: Track, level: Level | undefined) {
  const camps = trackCourses(track).length;
  return Math.min(Math.floor(PLACEMENT[level ?? 'new'] * camps), Math.max(camps - 1, 0));
}

/**
 * The next lesson to climb: the first unfinished one from the learner's
 * starting camp upward, then any skipped ones below it. Null at the summit.
 */
export function nextLesson(climb: Climb, track: Track, start = 0) {
  const courses = trackCourses(track);
  for (const course of [...courses.slice(start), ...courses.slice(0, start)]) {
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
  // The last camp is the summit itself.
  const name = campIdx === campCount - 1 && campCount > 1 ? 'Ras Dashen summit' : zone.name;
  return { name, tone: zone.tone, from, to };
}

// Walia's horns grow a new ridge as grass is collected, like a real ibex's.
const HORN_THRESHOLDS = [0, 30, 80, 150, 250];
const HORN_SCALES = [0.86, 0.96, 1.06, 1.15, 1.24];

export function hornLevel(grass: number) {
  let level = 0;
  HORN_THRESHOLDS.forEach((threshold, i) => {
    if (grass >= threshold) level = i;
  });
  const next = HORN_THRESHOLDS[level + 1] ?? null;
  return {
    level: level + 1,
    scale: HORN_SCALES[level],
    from: HORN_THRESHOLDS[level],
    next,
    max: HORN_THRESHOLDS.length,
  };
}

// ---------------------------------------------------------------------------
// Climb streak: consecutive days with at least one finished lesson.
// ---------------------------------------------------------------------------

const DATE_KEY = /^\d{4}-\d{2}-\d{2}$/;

function isDateKey(value: unknown): value is string {
  return typeof value === 'string' && DATE_KEY.test(value);
}

function count(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? Math.max(0, Math.round(value)) : 0;
}

function parseLog(value: unknown): Record<string, DayWork> {
  const log: Record<string, DayWork> = {};
  if (!value || typeof value !== 'object') return log;
  for (const [day, raw] of Object.entries(value as Record<string, Record<string, unknown>>)) {
    if (!isDateKey(day) || !raw || typeof raw !== 'object') continue;
    log[day] = { lessons: count(raw.lessons), answers: count(raw.answers), correct: count(raw.correct), seconds: count(raw.seconds) };
  }
  return log;
}

/** The learner's local calendar date as YYYY-MM-DD. */
export function dateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function addDays(date: Date, n: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + n);
  return next;
}

export type StreakDay = { label: string; key: string; active: boolean; today: boolean; future: boolean };

/**
 * The current streak and this week's practice days (Sunday to Saturday).
 * A streak stays alive until the end of the day after the last lesson,
 * so learners who haven't practiced yet today don't see it drop to zero.
 */
export function climbStreak(days: string[], now = new Date()) {
  const practiced = new Set(days);
  const today = dateKey(now);
  const doneToday = practiced.has(today);

  let count = 0;
  let cursor = doneToday ? now : addDays(now, -1);
  while (practiced.has(dateKey(cursor))) {
    count += 1;
    cursor = addDays(cursor, -1);
  }

  const sunday = addDays(now, -now.getDay());
  const week: StreakDay[] = ['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((label, i) => {
    const key = dateKey(addDays(sunday, i));
    return { label, key, active: practiced.has(key), today: key === today, future: key > today };
  });

  return { count, doneToday, week };
}
