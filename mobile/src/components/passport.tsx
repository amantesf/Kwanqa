import { useEffect, useState } from 'react';
import { useClimb } from '@/lib/climb';
import type { Track } from '@/lib/courses';
import { useMistakes } from '@/lib/mistakes';
import { campComplete, stampsFor, type Stamp } from '@/lib/passport';
import { storage } from '@/lib/storage';
import StampReveal from '@/components/stamp-reveal';

// The Kwanqa passport, like the website's (components/Passport.tsx): a stamp
// from a real place in Ethiopia for every camp finished. The trail celebrates
// each new stamp once; stamps earned before the passport existed are filed
// away quietly the first time.

const SEEN_KEY = 'kwanqa-stamps-seen-v1';
export const TILTS = [-6, 4, -3, 7, -5, 3, -7, 5];

export type PassportEntry = { stamp: Stamp; slug: string; camp: number; earned: boolean };

/** Every stamp of a course, and whether it's been earned. */
export function usePassport(track: Track): PassportEntry[] {
  const climb = useClimb();
  const mistakes = useMistakes();
  return stampsFor(track).map(s => ({ ...s, earned: campComplete(climb, s.slug, mistakes[s.slug]?.length ?? 0) }));
}

const seenKey = (track: Track, e: PassportEntry) => `${track}:${e.slug}`;

function readSeen(): string[] | null {
  try {
    const raw = storage().getItem(SEEN_KEY);
    return raw ? (JSON.parse(raw) as string[]) : null;
  } catch {
    return null;
  }
}

function writeSeen(keys: string[]) {
  try {
    storage().setItem(SEEN_KEY, JSON.stringify(keys));
  } catch {
    // the celebration may show again, which is harmless
  }
}

/** "New stamp!" on the trail, the first time a camp's stamp is earned. */
export function StampCelebration({ track }: { track: Track }) {
  const entries = usePassport(track);
  const [showing, setShowing] = useState<PassportEntry | null>(null);
  const earnedKeys = entries.filter(e => e.earned).map(e => seenKey(track, e));
  const earnedSig = earnedKeys.join('|');

  useEffect(() => {
    const seen = readSeen();
    if (seen === null) {
      writeSeen(earnedKeys);
      return;
    }
    const fresh = entries.find(e => e.earned && !seen.includes(seenKey(track, e)));
    if (!fresh) return;
    // let the trail settle before the stamp lands
    const timer = setTimeout(() => setShowing(fresh), 1400);
    return () => clearTimeout(timer);
    // a new stamp appears only when progress changes
  }, [earnedSig, track]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!showing) return null;
  return (
    <StampReveal
      stamp={showing.stamp}
      camp={showing.camp}
      track={track}
      onClose={() => {
        writeSeen([...new Set([...(readSeen() ?? []), seenKey(track, showing)])]);
        setShowing(null);
      }}
    />
  );
}
