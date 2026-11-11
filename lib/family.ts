// Family mode: parents and kids learn together with a shared streak
// (supabase/family.sql). Everyone uses their own account and joins with the
// family's 6-letter code. The family streak grows on days when everyone in
// the family practised.

import { dateKey } from '@/lib/climb';
import { supabase } from '@/lib/supabase';

export type FamilyMember = {
  me: boolean;
  name: string;
  /** When they joined (ISO time). Days before that don't need them. */
  joined: string;
  /** Local dates (YYYY-MM-DD) they practised, the last 120 days. */
  days: string[];
  lessons: number;
};

export type Family = { name: string; code: string; members: FamilyMember[] };

export const FAMILY_MAX = 8;

function problem(error: { message: string } | null) {
  if (!error) return null;
  // Our own messages come from family.sql; anything else is a setup problem.
  if (/family|code|Log in|full/i.test(error.message)) return error.message;
  if (/function .* does not exist|family_/.test(error.message)) return 'Family mode isn’t set up yet: run supabase/family.sql.';
  return 'Something went wrong. Try again.';
}

export async function loadFamily(): Promise<{ family: Family | null; error: string | null }> {
  if (!supabase) return { family: null, error: 'Accounts aren’t set up.' };
  const { data, error } = await supabase.rpc('family_view');
  if (error) return { family: null, error: problem(error) };
  return { family: (data as Family | null) ?? null, error: null };
}

export async function createFamily(familyName: string, memberName: string) {
  if (!supabase) return { code: null, error: 'Accounts aren’t set up.' };
  const { data, error } = await supabase.rpc('family_create', { family_name: familyName, member_name: memberName });
  return { code: (data as string | null) ?? null, error: problem(error) };
}

export async function joinFamily(code: string, memberName: string) {
  if (!supabase) return 'Accounts aren’t set up.';
  const { error } = await supabase.rpc('family_join', { join_code: code, member_name: memberName });
  return problem(error);
}

export async function leaveFamily() {
  if (!supabase) return 'Accounts aren’t set up.';
  const { error } = await supabase.rpc('family_leave');
  return problem(error);
}

/** A join code as people type it: capitals, no spaces, at most 6 letters. */
export function cleanCode(input: string) {
  return input
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 6);
}

function addDays(date: Date, n: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + n);
  return next;
}

/**
 * The family streak: consecutive days when everyone who was in the family
 * practised. Like the climb streak, it stays alive until the end of the day
 * after the last full day, so it doesn't drop to zero while people still
 * have today to practise.
 */
export function familyStreak(members: FamilyMember[], now = new Date()) {
  const today = dateKey(now);
  const joinedDay = (m: FamilyMember) => dateKey(new Date(m.joined));
  const start = members.reduce((min, m) => (joinedDay(m) < min ? joinedDay(m) : min), today);
  const sets = members.map(m => ({ member: m, days: new Set(m.days), from: joinedDay(m) }));
  const everyone = (day: string) => {
    const due = sets.filter(s => s.from <= day);
    return due.length > 0 && due.every(s => s.days.has(day));
  };

  const doneToday = everyone(today);
  let count = 0;
  let cursor = doneToday ? now : addDays(now, -1);
  while (dateKey(cursor) >= start && everyone(dateKey(cursor))) {
    count += 1;
    cursor = addDays(cursor, -1);
  }
  const waitingOn = sets.filter(s => !s.days.has(today)).map(s => s.member);

  // this week, Sunday to Saturday: whether everyone practised each day
  const sunday = addDays(now, -now.getDay());
  const week = ['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((label, i) => {
    const key = dateKey(addDays(sunday, i));
    return { label, key, done: key <= today && key >= start && everyone(key), today: key === today, future: key > today };
  });

  /** A member's own streak, the same way. */
  const own = (m: FamilyMember) => {
    const days = new Set(m.days);
    let n = 0;
    let c = days.has(today) ? now : addDays(now, -1);
    while (days.has(dateKey(c))) {
      n += 1;
      c = addDays(c, -1);
    }
    return n;
  };

  return { count, doneToday, waitingOn, week, own };
}
