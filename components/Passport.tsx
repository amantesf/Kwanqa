'use client';

// The Kwanqa passport: a stamp from a real place in Ethiopia for every camp
// finished. /passport shows the whole book; on the trail, a "New stamp!" card
// celebrates each one as it's earned, and a small card in the side rail shows
// how many are collected.

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { displayName, useAuth } from '@/components/AuthProvider';
import LearnSidebar from '@/components/LearnSidebar';
import Mascot from '@/components/Mascot';
import PassportStamp from '@/components/PassportStamp';
import StampReveal from '@/components/StampReveal';
import PlaceLesson, { hasPlaceLesson } from '@/components/PlaceLesson';
import { useClimb } from '@/lib/climb';
import type { Track } from '@/lib/courses';
import { useMistakes } from '@/lib/mistakes';
import { campComplete, stampsFor, type Stamp } from '@/lib/passport';
import { useProfile } from '@/lib/profile';
import { storage } from '@/lib/storage';

const SEEN_KEY = 'kwanqa-stamps-seen-v1';
const TILTS = [-6, 4, -3, 7, -5, 3, -7, 5];

const noopSubscribe = () => () => {};
/** False during the server render and hydration, true in the browser after. */
function useHydrated() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

export type PassportEntry = { stamp: Stamp; slug: string; camp: number; earned: boolean };

/** Every stamp of a course, and whether it's been earned. */
export function usePassport(track: Track): PassportEntry[] {
  const climb = useClimb();
  const mistakes = useMistakes();
  const hydrated = useHydrated();
  return stampsFor(track).map(s => ({
    ...s,
    earned: hydrated && campComplete(climb, s.slug, mistakes[s.slug]?.length ?? 0),
  }));
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
    // storage unavailable: the celebration may show again, which is harmless
  }
}

/**
 * "New stamp!" on the trail, the first time a camp's stamp is earned. Stamps
 * earned before the passport existed are filed away quietly the first time.
 */
export function StampCelebration({ track }: { track: Track }) {
  const entries = usePassport(track);
  const hydrated = useHydrated();
  const [showing, setShowing] = useState<PassportEntry | null>(null);
  const earnedKeys = entries.filter(e => e.earned).map(e => seenKey(track, e));
  const earnedSig = earnedKeys.join('|');

  useEffect(() => {
    if (!hydrated) return;
    const seen = readSeen();
    if (seen === null) {
      writeSeen(earnedKeys);
      return;
    }
    const fresh = entries.find(e => e.earned && !seen.includes(seenKey(track, e)));
    if (fresh) {
      // let the trail settle (and Walia hop) before the stamp lands
      const timer = window.setTimeout(() => setShowing(fresh), 1400);
      return () => window.clearTimeout(timer);
    }
    // a new stamp appears only when progress changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, earnedSig, track]);

  const close = useCallback(() => {
    setShowing(current => {
      if (current) {
        const seen = readSeen() ?? [];
        writeSeen([...new Set([...seen, seenKey(track, current)])]);
      }
      return null;
    });
  }, [track]);

  if (!showing) return null;
  return <StampReveal stamp={showing.stamp} camp={showing.camp} track={track} onClose={close} />;
}

/** The side-rail card on the learn page: stamps collected, and the next one to earn. */
export function PassportRailCard({ track }: { track: Track }) {
  const entries = usePassport(track);
  const got = entries.filter(e => e.earned);
  const next = entries.find(e => !e.earned);
  return (
    <div className="rail-card rail-extra passport-rail">
      <div className="rail-card-head">
        <h3 className="rail-title">Your passport</h3>
        <Link href={`/passport?track=${track}`} className="rail-link">
          Open
        </Link>
      </div>
      <div className="passport-rail-row">
        {entries.map((e, i) => (
          <PassportStamp key={e.slug} stamp={e.stamp} earned={e.earned} size={34} tilt={TILTS[i % TILTS.length]} />
        ))}
      </div>
      <p className="small">
        <strong>
          {got.length} of {entries.length}
        </strong>{' '}
        stamps collected.
        {next ? ` Finish Camp ${next.camp} to stamp ${next.stamp.name}.` : ' Every stamp collected. ጎበዝ!'}
      </p>
    </div>
  );
}

/** /passport: the whole book. */
export default function PassportPage({ initialTrack }: { initialTrack?: Track }) {
  const profile = useProfile();
  const { user } = useAuth();
  const [track, setTrack] = useState<Track>(initialTrack ?? profile?.track ?? 'amharic');
  const entries = usePassport(track);
  const got = entries.filter(e => e.earned).length;
  const name = user ? displayName(user) : 'Traveller';
  const [lessonFor, setLessonFor] = useState<Stamp | null>(null);
  const [replay, setReplay] = useState<PassportEntry | null>(null);
  const closeReplay = useCallback(() => setReplay(null), []);

  useEffect(() => {
    if (!lessonFor) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLessonFor(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lessonFor]);

  return (
    <div className="learn-app">
      <LearnSidebar active="passport" track={track} />
      <div className="learn-main passport-main">
        <section className="passport-cover">
          <div className="passport-cover-text">
            <span className="passport-cover-kicker" lang="am">
              ፓስፖርት · Kwanqa passport
            </span>
            <h1 className="passport-cover-title">{name}</h1>
            <p className="passport-cover-sub">
              {got} of {entries.length} stamps · Finish a camp to stamp a new place in Ethiopia.
            </p>
            <div className="passport-meter" role="progressbar" aria-valuemin={0} aria-valuemax={entries.length} aria-valuenow={got}>
              <span style={{ width: `${(got / Math.max(entries.length, 1)) * 100}%` }} />
            </div>
          </div>
          <div className="passport-cover-walia" aria-hidden>
            <Mascot pose={got === entries.length ? 'cheer' : 'wave'} size={110} animated />
          </div>
        </section>

        <div className="passport-tabs" role="tablist" aria-label="Course">
          {(['amharic', 'english'] as Track[]).map(t => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={track === t}
              className={`passport-tab${track === t ? ' active' : ''}`}
              onClick={() => setTrack(t)}
            >
              {t === 'amharic' ? 'Amharic course' : 'English course'}
            </button>
          ))}
        </div>

        <ol className="passport-pages">
          {entries.map((e, i) => (
            <li key={e.slug} className={`passport-page${e.earned ? ' earned' : ''}`}>
              {e.earned ? (
                <button
                  type="button"
                  className="passport-page-replay"
                  onClick={() => setReplay(e)}
                  aria-label={`Replay the ${e.stamp.name} stamp celebration`}
                  title="Tap to replay"
                >
                  <PassportStamp stamp={e.stamp} earned size={140} tilt={TILTS[i % TILTS.length]} />
                </button>
              ) : (
                <PassportStamp stamp={e.stamp} earned={false} size={140} />
              )}
              <div className="passport-page-text">
                <span className="passport-page-camp">
                  Camp {e.camp} · {e.stamp.region}
                </span>
                <h2 className="passport-page-name">
                  {e.stamp.name} <span lang="am">{e.stamp.amharic}</span>
                </h2>
                {e.earned ? (
                  <>
                    <p className="passport-page-fact">{e.stamp.fact}</p>
                    {hasPlaceLesson(e.stamp) && (
                      <button type="button" className="passport-page-lesson" onClick={() => setLessonFor(e.stamp)}>
                        Quick lesson about {e.stamp.name} →
                      </button>
                    )}
                  </>
                ) : (
                  <p className="passport-page-locked">Finish Camp {e.camp} to collect this stamp.</p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>

      {replay && <StampReveal stamp={replay.stamp} camp={replay.camp} track={track} onClose={closeReplay} />}

      {lessonFor && (
        <div className="stamp-backdrop" onClick={() => setLessonFor(null)}>
          <div
            className="stamp-dialog"
            role="dialog"
            aria-modal="true"
            aria-label={`Quick lesson about ${lessonFor.name}`}
            onClick={e => e.stopPropagation()}
          >
            <PlaceLesson stamp={lessonFor} onDone={() => setLessonFor(null)} />
          </div>
        </div>
      )}
    </div>
  );
}
