import type { Climb } from '@/lib/climb';
import {
  clearAllMistakes,
  cleanMistakes,
  MAX_PER_CAMP,
  readMistakes,
  replaceMistakes,
  subscribeMistakes,
  type MistakeStore,
  type SavedMistake,
} from '@/lib/mistakes';
import { campComplete, stampsFor } from '@/lib/passport';
import { clearSeen, cleanSeen, readSeen, subscribeSeen, writeSeen } from '@/lib/stampsSeen';

// The rest of a learner's progress that's saved in their account next to the
// climb (the `mistakes` and `stamps` columns of the `climbs` row): the questions
// waiting to be practised again, and the passport stamps already celebrated.
// The website (components/AuthProvider.tsx) and the app (mobile/src/auth.tsx)
// both sync it the same way, right alongside the climb.

export type Extras = { mistakes: MistakeStore; stamps: string[] };

/** The extra columns to read and save; older databases don't have them yet. */
export const EXTRA_COLUMNS = 'mistakes, stamps';

/** JSON with sorted keys, so two copies can be compared regardless of key order. */
export function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(',')}]`;
  if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    return `{${Object.keys(obj)
      .sort()
      .map(k => `${JSON.stringify(k)}:${stableJson(obj[k])}`)
      .join(',')}}`;
  }
  return JSON.stringify(value);
}

export function sameExtras(a: Extras, b: Extras) {
  return stableJson(a) === stableJson(b);
}

/** The account's copy, cleaned up so nothing malformed reaches the lessons. */
export function extrasFromRow(row: { mistakes?: unknown; stamps?: unknown } | null): Extras {
  return { mistakes: cleanMistakes(row?.mistakes), stamps: [...cleanSeen(row?.stamps)].sort() };
}

/** This device's copy. */
export function readExtras(): Extras {
  return { mistakes: readMistakes(), stamps: [...(readSeen() ?? [])].sort() };
}

/**
 * Combines this device's mistakes with the account's. `base` is the account's
 * copy as of the last sync, which tells a question one side cleared (in a
 * review) apart from one the other side newly got wrong, so a cleared mistake
 * doesn't come back from the other device.
 */
function mergeMistakes(local: MistakeStore, remote: MistakeStore, base: MistakeStore | null): MistakeStore {
  const out: MistakeStore = {};
  for (const slug of new Set([...Object.keys(local), ...Object.keys(remote)])) {
    const mine = new Map((local[slug] ?? []).map(m => [m.key, m]));
    const theirs = new Map((remote[slug] ?? []).map(m => [m.key, m]));
    const before = new Map((base?.[slug] ?? []).map(m => [m.key, m.at]));
    // kept if both sides have it, if it's new since the last sync, or if it was got wrong again since
    const keep = (m: SavedMistake) => !before.has(m.key) || m.at > (before.get(m.key) ?? 0);
    const kept: SavedMistake[] = [];
    for (const key of new Set([...mine.keys(), ...theirs.keys()])) {
      const a = mine.get(key);
      const b = theirs.get(key);
      if (a && b) kept.push(a.at >= b.at ? a : b);
      else if (a && keep(a)) kept.push(a);
      else if (b && keep(b)) kept.push(b);
    }
    kept.sort((x, y) => x.at - y.at);
    if (kept.length) out[slug] = kept.slice(-MAX_PER_CAMP);
  }
  return out;
}

export function mergeExtras(local: Extras, remote: Extras, base: Extras | null): Extras {
  return {
    mistakes: mergeMistakes(local.mistakes, remote.mistakes, base?.mistakes ?? null),
    // a celebrated stamp stays celebrated everywhere
    stamps: [...cleanSeen([...local.stamps, ...remote.stamps])].sort(),
  };
}

/** Every passport stamp earned with this climb and these pending mistakes. */
function earnedStamps(climb: Climb, mistakes: MistakeStore) {
  const keys = new Set<string>();
  for (const track of ['amharic', 'english'] as const) {
    for (const s of stampsFor(track)) {
      if (campComplete(climb, s.slug, mistakes[s.slug]?.length ?? 0)) keys.add(`${track}:${s.slug}`);
    }
  }
  return keys;
}

/**
 * Stamps that only became earned because of progress made on another device
 * are filed as already celebrated, so a new phone doesn't replay every old
 * stamp. Only stamps earned on this device get the big celebration here.
 */
export function settleExtras(local: Extras, merged: Extras, localClimb: Climb, nextClimb: Climb): Extras {
  const before = earnedStamps(localClimb, local.mistakes);
  const elsewhere = [...earnedStamps(nextClimb, merged.mistakes)].filter(k => !before.has(k));
  return { mistakes: merged.mistakes, stamps: [...cleanSeen([...merged.stamps, ...elsewhere])].sort() };
}

/** Puts the synced copy on this device, changing only what differs. */
export function applyExtras(next: Extras) {
  const local = readExtras();
  if (stableJson(local.mistakes) !== stableJson(next.mistakes)) replaceMistakes(next.mistakes);
  // Keep "nothing saved yet" (null) as it is when there's nothing to save, so
  // the trail can still file away already-earned stamps quietly.
  const seen = readSeen();
  if ((seen !== null || next.stamps.length > 0) && stableJson([...(seen ?? [])].sort()) !== stableJson(next.stamps)) {
    writeSeen(next.stamps);
  }
}

/** Calls back when the mistakes or celebrated stamps change on this device. */
export function subscribeExtras(callback: () => void) {
  const stopMistakes = subscribeMistakes(callback);
  const stopSeen = subscribeSeen(callback);
  return () => {
    stopMistakes();
    stopSeen();
  };
}

/** Forgets them on this device (on sign-out; the account keeps them). */
export function clearExtras() {
  clearAllMistakes();
  clearSeen();
}
