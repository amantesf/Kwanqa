// Learning activity for the numbers on /stats (supabase/events.sql): opening
// the site (once a day per device), starting a lesson, finishing it, leaving
// early. Each device makes up a random id and keeps it, so learners without an
// account are counted too; nothing else about the learner is sent. The
// database adds the account id itself when someone is logged in.
//
// Fire and forget: a blocked or failed save never gets in the way of a lesson.
// Nothing is sent while developing (npm run dev), so tests don't count.

import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase as webClient } from '@/lib/supabase';
import { storage } from '@/lib/storage';
import type { Track } from '@/lib/courses';

const DEVICE_KEY = 'kwanqa-device';
const VISIT_KEY = 'kwanqa-visit-day';

type Kind = 'visit' | 'lesson_start' | 'lesson_finish' | 'lesson_quit';

export type LessonEvent = {
  track?: Track;
  camp?: string;
  /** 0-based, like ?lesson= */
  lesson?: number;
  review?: boolean;
  level?: string;
  answered?: number;
  mistakes?: number;
};

// The phone app plugs in its own Supabase client and says it's the app.
let client: SupabaseClient | null = webClient;
let platform: 'web' | 'app' = 'web';

export function setEventsClient(next: SupabaseClient | null, on: 'web' | 'app') {
  client = next;
  platform = on;
}

function deviceId(): string | null {
  try {
    const store = storage();
    let id = store.getItem(DEVICE_KEY);
    if (!id) {
      id =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
      store.setItem(DEVICE_KEY, id);
    }
    return id;
  } catch {
    return null; // storage blocked: don't count this visitor
  }
}

function send(kind: Kind, event: LessonEvent = {}) {
  if (!client || process.env.NODE_ENV !== 'production') return;
  const device = deviceId();
  if (!device) return;
  const row = {
    device,
    kind,
    platform,
    track: event.track ?? null,
    camp: event.camp ?? null,
    lesson: event.lesson ?? null,
    review: event.review ?? false,
    level: event.level ?? null,
    answered: event.answered ?? null,
    mistakes: event.mistakes ?? null,
  };
  void Promise.resolve(client.from('lesson_events').insert(row)).catch(() => {});
}

/** Someone opened the site or app: counted once a day per device. */
export function logVisit() {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const store = storage();
    if (store.getItem(VISIT_KEY) === today) return;
    store.setItem(VISIT_KEY, today);
  } catch {
    return;
  }
  send('visit');
}

export function logLessonStart(event: LessonEvent) {
  send('lesson_start', event);
}

export function logLessonFinish(event: LessonEvent) {
  send('lesson_finish', event);
}

/** Left a lesson before finishing it, after answering `answered` questions. */
export function logLessonQuit(event: LessonEvent) {
  send('lesson_quit', event);
}
