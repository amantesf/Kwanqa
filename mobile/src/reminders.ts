import { useSyncExternalStore } from 'react';
import { climbStreak, dateKey, readClimb } from '@/lib/climb';
import { storage } from '@/lib/storage';

// Streak reminders on this phone: local notifications the app schedules for
// itself (no server), at the time the learner picked on Profile. The next week
// of reminders is set up ahead, and as soon as a lesson is finished today's is
// dropped, so practising never earns a nag. They're set again whenever the
// app opens or progress changes (ReminderScheduler in the root layout).
//
// The notifications module is native: a build without it (an older dev build)
// just skips all of this.

type NotificationsModule = typeof import('expo-notifications');

let loaded: NotificationsModule | null | undefined;
function notifications(): NotificationsModule | null {
  if (loaded === undefined) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      loaded = require('expo-notifications') as NotificationsModule;
      // show a reminder even if it arrives while the app is open
      loaded.setNotificationHandler({
        handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: false, shouldSetBadge: false }),
      });
    } catch {
      loaded = null;
    }
  }
  return loaded;
}

const KEY = 'kwanqa-phone-reminders';
/** Hours learners can pick (24-hour clock). */
export const REMINDER_HOURS = [8, 12, 19, 21];
const DAYS_AHEAD = 7;

export type ReminderSettings = { on: boolean; hour: number };
const OFF: ReminderSettings = { on: false, hour: 19 };

const listeners = new Set<() => void>();

function readRaw() {
  try {
    return storage().getItem(KEY) ?? '';
  } catch {
    return '';
  }
}

export function readReminders(): ReminderSettings {
  try {
    const value = JSON.parse(readRaw());
    return { on: value.on === true, hour: REMINDER_HOURS.includes(value.hour) ? value.hour : OFF.hour };
  } catch {
    return OFF;
  }
}

/** The saved reminder settings, kept up to date. */
export function useReminders(): ReminderSettings {
  const raw = useSyncExternalStore(
    callback => {
      listeners.add(callback);
      return () => listeners.delete(callback);
    },
    readRaw,
    readRaw,
  );
  return raw ? readReminders() : OFF;
}

function save(settings: ReminderSettings) {
  try {
    storage().setItem(KEY, JSON.stringify(settings));
  } catch {
    // storage blocked: the switch just won't stick
  }
  listeners.forEach(fn => fn());
}

/**
 * Turns reminders on (asking the phone's permission first) or off, or changes
 * the hour. Returns false if the learner said no to notifications.
 */
export async function setReminders(next: ReminderSettings): Promise<boolean> {
  const n = notifications();
  if (next.on) {
    if (!n) return false;
    const current = await n.getPermissionsAsync();
    const granted = current.granted || (await n.requestPermissionsAsync()).granted;
    if (!granted) {
      save({ ...next, on: false });
      return false;
    }
  }
  save(next);
  await scheduleReminders();
  return true;
}

/** A line for the reminder: about the streak on the first day, gentler after that. */
function message(daysAway: number, streak: number) {
  if (daysAway === 0 && streak > 0) {
    return { title: `Keep your ${streak}-day climb going`, body: 'One short lesson today keeps your streak alive. Walia’s waiting on the trail.' };
  }
  const lines = [
    { title: 'ሰላም! Time for a little Amharic', body: 'A few minutes on the trail keeps it fresh.' },
    { title: 'Walia is waiting for you', body: 'Pick up where you left off: one lesson is enough.' },
    { title: 'ትንሽ ትንሽ, a little bit at a time', body: 'Little by little, an egg walks on its own legs. Come climb!' },
    { title: 'Your phrases miss you', body: 'A quick lesson brings back what you learned.' },
  ];
  return lines[daysAway % lines.length];
}

/** Clears the scheduled reminders and sets up the coming week again. */
export async function scheduleReminders() {
  const n = notifications();
  if (!n) return;
  try {
    await n.cancelAllScheduledNotificationsAsync();
    const settings = readReminders();
    if (!settings.on) return;
    const { granted } = await n.getPermissionsAsync();
    if (!granted) return;

    const climb = readClimb();
    const streak = climbStreak(climb.days).count;
    const now = new Date();
    const doneToday = climb.days.includes(dateKey(now));
    for (let d = 0; d < DAYS_AHEAD; d++) {
      const at = new Date(now.getFullYear(), now.getMonth(), now.getDate() + d, settings.hour, 0, 0);
      // nothing today if a lesson's done already, or the time has passed
      if (d === 0 && (doneToday || at <= now)) continue;
      const { title, body } = message(doneToday ? d - 1 : d, streak);
      await n.scheduleNotificationAsync({
        content: { title, body },
        trigger: { type: n.SchedulableTriggerInputTypes.DATE, date: at },
      });
    }
  } catch (error) {
    console.warn('Kwanqa: couldn’t schedule reminders', error);
  }
}
