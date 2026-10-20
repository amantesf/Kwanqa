'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import LearnSidebar from '@/components/LearnSidebar';
import GrassIcon from '@/components/GrassIcon';
import { EthiopianDateCard, HolidaySeasonCard, useHolidaySeason } from '@/components/HolidayCards';
import ProverbCard from '@/components/ProverbCard';
import MesobBasket from '@/components/MesobBasket';
import SiniCup from '@/components/SiniCup';
import AddisTaxi from '@/components/AddisTaxi';
import Mascot from '@/components/Mascot';
import MountainScene from '@/components/MountainScene';
import TopStats from '@/components/TopStats';
import Trail, { type TrailStop } from '@/components/Trail';
import { courseContent, type Track } from '@/lib/courses';
import { useProfile } from '@/lib/profile';
import {
  BASE_ALTITUDE,
  hornLevel,
  isDone,
  readClimb,
  nextLesson,
  startCamp,
  SUMMIT_ALTITUDE,
  trackCourses,
  useClimb,
  zoneForCamp,
} from '@/lib/climb';

const WALIA_AT_KEY = 'kwanqa-walia-at';

const noopSubscribe = () => () => {};
/** False during the server render and hydration, true in the browser after. */
function useHydrated() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

/** Gold flip on the stone just finished, then Walia hops from it to the current stone. */
function celebrateArrival(fromStop: string) {
  const done = document.querySelector<HTMLElement>(`[data-stop="${CSS.escape(fromStop)}"] .stone`);
  const current = document.querySelector<HTMLElement>('[data-current-stone] .stone');
  const walia = document.querySelector<HTMLElement>('[data-current-stone] .trail-walia');
  if (!done) return;

  done.animate(
    [
      { backgroundColor: '#d2582e', boxShadow: '0 9px 0 #a8431f', transform: 'scale(1)' },
      { backgroundColor: '#d2582e', boxShadow: '0 9px 0 #a8431f', transform: 'scale(1.14)', offset: 0.4 },
      { backgroundColor: '#ffc233', boxShadow: '0 9px 0 #e0a000', transform: 'scale(1.2)', offset: 0.6 },
      { backgroundColor: '#ffc233', boxShadow: '0 9px 0 #e0a000', transform: 'scale(1)' },
    ],
    { duration: 700, easing: 'ease-out' },
  );

  if (!current || !walia) return;
  const a = done.getBoundingClientRect();
  const b = current.getBoundingClientRect();
  const dx = a.left + a.width / 2 - (b.left + b.width / 2);
  const dy = a.top + a.height / 2 - (b.top + b.height / 2);
  const base = getComputedStyle(walia).transform; // keeps the smaller phone size
  const at = (x: number, y: number) => `translate(${x}px, ${y}px)${base === 'none' ? '' : ` ${base}`}`;
  walia.animate(
    [
      { transform: at(dx, dy) },
      { transform: at(dx * 0.75, dy * 0.75 - 46), offset: 0.25 },
      { transform: at(dx * 0.5, dy * 0.5), offset: 0.5 },
      { transform: at(dx * 0.25, dy * 0.25 - 46), offset: 0.75 },
      { transform: at(0, 0) },
    ],
    { duration: 1100, delay: 600, easing: 'ease-in-out', fill: 'backwards' },
  );
}

function scrollToWalia(behavior: ScrollBehavior) {
  document
    .querySelector('[data-current-stone]')
    ?.scrollIntoView({ behavior, block: 'center' });
}

const lessonName = (title: string) => title.replace(/^Lesson \d+ – /, '');


export default function CoursesRoadmap() {
  const params = useSearchParams();
  const profile = useProfile();
  // The course being learned comes from the learner's own choice; the URL is
  // only a fallback (e.g. before the survey, or with accounts turned off).
  const track: Track = profile?.track ?? (params.get('track') === 'english' ? 'english' : 'amharic');
  const climb = useClimb();
  const hydrated = useHydrated();
  const { enabled, user } = useAuth();
  const guest = enabled && !user; // took the survey but hasn't made an account yet
  const [waliaVisible, setWaliaVisible] = useState(true);
  // The camp the learner is scrolled to; null until the page scrolls.
  const [viewCamp, setViewCamp] = useState<number | null>(null);

  // Learners who already know some of the language start at a higher camp.
  const start = startCamp(track, profile?.levels[track]);
  const next = nextLesson(climb, track, start);
  const season = useHolidaySeason();
  const courses = trackCourses(track);
  const horns = hornLevel(climb.grass);
  const nextKey = next ? `${next.slug}:${next.lesson}` : 'summit';
  // Camps above the one you're on stay locked under the clouds.
  const currentCamp = next ? courses.findIndex(c => c.slug === next.slug) : courses.length;

  // Open the trail where Walia is standing, not at the summit. Fonts and images
  // can still change the page height after the first scroll, so keep Walia in
  // view while the page settles—until the learner scrolls or taps themselves.
  useEffect(() => {
    scrollToWalia('auto');
    let userMoved = false;
    const stop = () => {
      userMoved = true;
    };
    const recenter = () => {
      if (!userMoved) scrollToWalia('auto');
    };
    const events = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const;
    events.forEach(e => window.addEventListener(e, stop, { passive: true }));
    const resize = new ResizeObserver(recenter);
    resize.observe(document.body);
    document.fonts?.ready.then(recenter);
    const done = window.setTimeout(() => resize.disconnect(), 4000);
    return () => {
      events.forEach(e => window.removeEventListener(e, stop));
      resize.disconnect();
      window.clearTimeout(done);
    };
  }, [track, nextKey]);

  // Back on the trail after finishing a lesson: the stone you just climbed
  // flips from orange to gold, then Walia hops up the path to the next one.
  // The trail remembers where Walia stood last time to know when to celebrate.
  useEffect(() => {
    if (!hydrated) return; // wait for the real progress, not the server placeholder
    let before: string | null = null;
    const remember = () => {
      try {
        window.localStorage.setItem(WALIA_AT_KEY, nextKey);
      } catch {
        // storage unavailable; the celebration just won't repeat-guard
      }
    };
    try {
      before = window.localStorage.getItem(WALIA_AT_KEY);
    } catch {
      return; // storage unavailable; skip the celebration
    }
    const [slug, lesson] = (before ?? '').split(':');
    const justClimbed =
      !!before && before !== nextKey && isDone(readClimb(), slug, Number(lesson));
    if (!justClimbed || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      remember();
      return;
    }
    const from = before as string;
    // Wait until the page has scrolled to Walia and stopped moving, so the
    // celebration happens where the learner can see it.
    let lastTop: number | null = null;
    let steady = 0;
    const started = Date.now();
    const poll = window.setInterval(() => {
      const stone = document.querySelector('[data-current-stone]');
      const r = stone?.getBoundingClientRect();
      const inView = !!r && r.top > 0 && r.bottom < window.innerHeight;
      steady = inView && lastTop !== null && Math.abs(r.top - lastTop) < 1 ? steady + 1 : 0;
      lastTop = r ? r.top : null;
      if (steady >= 3) {
        window.clearInterval(poll);
        remember(); // only now, so a cancelled visit still celebrates next time
        celebrateArrival(from);
      } else if (Date.now() - started > 6000) {
        window.clearInterval(poll); // never settled; skip rather than play off-screen
        remember();
      }
    }, 120);
    return () => window.clearInterval(poll);
  }, [hydrated, nextKey]);

  // Offer a shortcut back to Walia once the current stone scrolls out of view.
  useEffect(() => {
    const stone = document.querySelector('[data-current-stone]');
    if (!stone) return;
    const observer = new IntersectionObserver(([entry]) => setWaliaVisible(entry.isIntersecting));
    observer.observe(stone);
    return () => observer.disconnect();
  }, [track, nextKey]);

  // Like Duolingo's unit header, the floating banner names (and takes the
  // colour of) the camp you're scrolling through. Until the page scrolls it
  // shows the camp being climbed.
  useEffect(() => {
    let frame = 0;
    function update() {
      frame = 0;
      const banner = document.querySelector('.camp-header');
      // The camp that fills the upper-middle of the screen is the one you're looking at.
      const below = banner ? banner.getBoundingClientRect().bottom + 24 : 200;
      const line = Math.max(below, window.innerHeight * 0.45);
      const zones = Array.from(document.querySelectorAll<HTMLElement>('[data-camp]'));
      // At the very bottom of the page you're at the trailhead: that's Camp 1.
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      const hit = atBottom
        ? zones[zones.length - 1]
        : zones.find(zone => {
            const r = zone.getBoundingClientRect();
            return r.top <= line && r.bottom > line;
          });
      if (hit) setViewCamp(Number(hit.dataset.camp));
    }
    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [track, nextKey]);

  const myCampIdx = Math.min(currentCamp, courses.length - 1);
  const myCamp = courses[myCampIdx];
  const shownIdx = viewCamp !== null && courses[viewCamp] ? viewCamp : myCampIdx;
  const shownCamp = courses[shownIdx];
  const shownLocked = shownIdx > currentCamp && shownIdx >= start;
  const shownPhrasebookHref = shownCamp
    ? `/phrasebook?track=${track}&camp=${shownCamp.slug}`
    : `/phrasebook?track=${track}`;
  const phrasebookHref = `/phrasebook?track=${track}`;
  const nextTitle = next ? courseContent[next.slug]?.sections[next.lesson]?.title : null;
  const nextHref = next ? `/courses/${next.slug}?lesson=${next.lesson}&practice=1` : null;
  const hornProgress =
    horns.next === null ? 1 : (climb.grass - horns.from) / (horns.next - horns.from);

  return (
    <div className="learn-app">
      {/* Left: navigation */}
      <LearnSidebar active="learn" track={track} />

      {/* Middle: the trail, dressed up for the holiday season */}
      <div
        className={`learn-main${season ? ` holiday-theme holiday-${season.holiday.id}` : ''}`}
        style={
          season
            ? ({ '--holiday': season.holiday.color } as React.CSSProperties)
            : undefined
        }
      >
        {shownCamp && (
          <div className={`camp-header camp-color-${shownIdx % 6}`}>
            {/* each camp's own woven basket peeks in from the right */}
            {shownCamp.slug === 'amharic-beginner-3' ? (
              // the coffee camp gets a sini of buna instead of a basket
              <SiniCup key={`cup-${shownIdx}`} className="camp-cup" />
            ) : shownCamp.slug === 'amharic-beginner-4' ? (
              // the directions-and-taxis camp gets a blue-and-white Addis taxi
              <AddisTaxi key={`taxi-${shownIdx}`} className="camp-taxi" />
            ) : (
              <MesobBasket key={`basket-${shownIdx}`} camp={shownIdx} className="camp-basket" />
            )}
            <div className="camp-header-text" key={shownIdx}>
              <span className="camp-header-kicker">
                Camp {shownIdx + 1} ·{' '}
                {shownLocked ? 'Locked' : zoneForCamp(shownIdx, courses.length).name}
              </span>
              <h2>{shownCamp.description}</h2>
            </div>
            <Link href={shownPhrasebookHref} className="camp-header-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
                <rect x="4" y="3" width="16" height="18" rx="3" fill="none" stroke="currentColor" strokeWidth="2.4" />
                <path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
              </svg>
              Phrasebook
            </Link>
          </div>
        )}

        {/* Summit */}
        <div className={`summit${next ? ' zone-locked' : ' reached'}`}>
          <MountainScene className="summit-art" />
          <div className="summit-text">
            <span className="kicker">
              Summit · ራስ ዳሽን · {SUMMIT_ALTITUDE.toLocaleString()} m
            </span>
            <h2 className="h3" style={{ fontSize: 22 }}>
              {next ? 'Finish every lesson to reach the summit' : 'You made it to the top!'}
            </h2>
            <p className="muted small">
              Ras Dashen is the highest peak of the Simien Mountains—home of the Walia ibex.
            </p>
          </div>
          {!next && (
            <div className="summit-walia">
              <Mascot pose="cheer" size={110} hornScale={horns.scale} />
            </div>
          )}
        </div>

        {/* Camps, highest first so the trail climbs up the page */}
        {[...courses].reverse().map(course => {
          const campIdx = courses.indexOf(course);
          const zone = zoneForCamp(campIdx, courses.length);
          const lessons = courseContent[course.slug]?.sections ?? [];
          const started = lessons.some((_, i) => isDone(climb, course.slug, i));
          // Camps below the starting camp were skipped for the learner's level:
          // they stay open, and any of their lessons can be climbed for review.
          const skipped = campIdx < start && campIdx !== currentCamp && !started;
          const locked = campIdx > currentCamp && campIdx >= start && !started;

          const stops: TrailStop[] = lessons.map((lesson, i) => ({
            title: lesson.title,
            number: i + 1,
            state: isDone(climb, course.slug, i)
              ? 'done'
              : next?.slug === course.slug && next.lesson === i
                ? 'current'
                : campIdx < start && campIdx !== currentCamp
                  ? 'todo'
                  : 'locked',
            href: `/courses/${course.slug}?lesson=${i}&practice=1`,
            id: `${course.slug}:${i}`,
          }));

          const campDone = lessons.every((_, i) => isDone(climb, course.slug, i));
          // A mesob of grass waits halfway through each camp.
          if (lessons.length >= 3) {
            const half = Math.ceil(lessons.length / 2);
            const reached = lessons.slice(0, half).every((_, i) => isDone(climb, course.slug, i));
            stops.splice(half, 0, {
              title: 'Halfway mesob',
              kind: 'reward',
              state: reached ? 'done' : 'locked',
            });
          }

          // A trophy marks the top of every camp.
          stops.push({
            title: `Camp ${campIdx + 1} trophy`,
            kind: 'trophy',
            state: campDone ? 'done' : 'locked',
          });

          return (
            <section
              key={course.slug}
              data-camp={campIdx}
              className={`zone zone-${zone.tone}${locked ? ' zone-locked' : ''}`}
              aria-label={`Camp ${campIdx + 1}: ${course.title}${locked ? ' (locked)' : ''}`}
            >
              <div className="camp-divider">
                <span>
                  {locked
                    ? `Camp ${campIdx + 1} · Finish Camp ${campIdx} to unlock`
                    : skipped
                      ? `Camp ${campIdx + 1} · ${zone.name} · Skipped for your level, open anytime`
                      : `Camp ${campIdx + 1} · ${zone.name} · ${zone.from.toLocaleString()}–${zone.to.toLocaleString()} m`}
                </span>
              </div>
              <div className="trail-wrap">
                <Trail
                  stops={stops}
                  hornScale={horns.scale}
                  waliaSize={116}
                  scenery={locked ? 'locked' : zone.tone}
                />
              </div>
            </section>
          );
        })}

        {/* Trailhead */}
        <div className="trailhead">
          <span className="kicker">Trailhead · {BASE_ALTITUDE.toLocaleString()} m</span>
          <p className="muted small">
            Your climb starts here. Finish lessons to earn grass (ሳር)—it grows Walia’s horns
            and gives you energy when the climb gets tough.
          </p>
        </div>
      </div>

      {/* Right: the learner's climb */}
      <aside className="learn-rail" aria-label="Your climb">
        <TopStats track={track} />
        <HolidaySeasonCard />
        <EthiopianDateCard />
        <ProverbCard />

        {guest && (
          <div className="rail-card">
            <h3 className="rail-title">Create a profile to save your progress!</h3>
            <p className="small">
              Your climb is only saved on this device. Sign up free to keep your grass, horns, and
              progress on any device.
            </p>
            <Link href={`/signup?next=${encodeURIComponent(`/courses?track=${track}`)}`} className="btn btn-block">
              Create a profile
            </Link>
            <Link href={`/login?next=${encodeURIComponent(`/courses?track=${track}`)}`} className="btn btn-secondary btn-block">
              Log in
            </Link>
          </div>
        )}

        {next && nextTitle && nextHref && (
          <div className="rail-card rail-extra rail-promo">
            <div className="rail-promo-text">
              <span className="rail-badge">Up next</span>
              <h3 className="rail-title">{lessonName(nextTitle)}</h3>
              <p className="small">
                Lesson {next.lesson + 1} of Camp {currentCamp + 1}. Finish it to earn grass and
                climb higher.
              </p>
            </div>
            <div className="rail-promo-art" aria-hidden>
              <Mascot pose="wave" size={92} hornScale={horns.scale} animated />
            </div>
            <Link href={nextHref} className="btn btn-block">
              Continue climbing
            </Link>
          </div>
        )}

        <div className="rail-card rail-extra">
          <div className="rail-card-head">
            <h3 className="rail-title">Walia’s horns</h3>
            <span className="rail-link">Level {horns.level} of {horns.max}</span>
          </div>
          <div className="quest">
            <GrassIcon size={44} />
            <div className="quest-body">
              <span className="quest-title">
                {horns.next === null ? 'Fully grown. Gobez!' : 'Collect grass to grow a new ridge'}
              </span>
              <div className="quest-row">
                <div
                  className="quest-meter"
                  role="progressbar"
                  aria-label="Progress to the next horn ridge"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(hornProgress * 100)}
                >
                  <span style={{ width: `${Math.round(hornProgress * 100)}%` }} />
                  <em>
                    {horns.next === null
                      ? `${climb.grass}`
                      : `${climb.grass - horns.from} / ${horns.next - horns.from}`}
                  </em>
                </div>
                <Mascot pose="cheer" size={40} hornScale={Math.min(horns.scale + 0.12, 1.24)} title="Next horn level" />
              </div>
            </div>
          </div>
        </div>

        <div className="rail-card rail-extra">
          <div className="rail-card-head">
            <h3 className="rail-title">Phrasebook</h3>
            <Link href={phrasebookHref} className="rail-link">
              Open
            </Link>
          </div>
          <p className="small">
            Every phrase from {myCamp ? `Camp ${myCampIdx + 1}` : 'this camp'}
            {track === 'english'
              ? ' in English, with the Amharic meaning, ready to review.'
              : ' in Ge’ez script, transliteration, and English, ready to review.'}
          </p>
        </div>
      </aside>

      {!waliaVisible && next && (
        <button type="button" className="jump-walia" onClick={() => scrollToWalia('smooth')}>
          <Mascot pose="wave" size={30} hornScale={horns.scale} title="Walia" />
          Jump to Walia
        </button>
      )}
    </div>
  );
}
