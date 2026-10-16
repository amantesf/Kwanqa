'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { displayName, useAuth } from '@/components/AuthProvider';
import ClimbStreak from '@/components/ClimbStreak';
import CourseSwitcher from '@/components/CourseSwitcher';
import Logo from '@/components/Logo';
import GrassIcon from '@/components/GrassIcon';
import Mascot from '@/components/Mascot';
import MountainScene from '@/components/MountainScene';
import Trail, { type TrailStop } from '@/components/Trail';
import { courseContent, type Track } from '@/lib/courses';
import { useProfile } from '@/lib/profile';
import {
  altitudeFor,
  BASE_ALTITUDE,
  hornLevel,
  isDone,
  nextLesson,
  SUMMIT_ALTITUDE,
  trackCourses,
  trackTotals,
  useClimb,
  zoneForCamp,
} from '@/lib/climb';

function scrollToWalia(behavior: ScrollBehavior) {
  document
    .querySelector('[data-current-stone]')
    ?.scrollIntoView({ behavior, block: 'center' });
}

const lessonName = (title: string) => title.replace(/^Lesson \d+ – /, '');

/* ---------- small icons for the side navigation ---------- */

function TrailIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden>
      <path d="M2 28 L12 10 L18 19 L22 13 L30 28 Z" fill="var(--primary)" />
      <path d="M12 10 L15 15.5 L13 14.6 L10.6 16.4 Z" fill="#fff" />
      <circle cx="25" cy="7" r="3.4" fill="var(--gold)" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden>
      <rect x="5" y="4" width="22" height="25" rx="4" fill="var(--blue)" />
      <rect x="9" y="4" width="18" height="21" rx="3" fill="#5b8ce6" />
      <rect x="13" y="10" width="10" height="3" rx="1.5" fill="#fff" />
      <rect x="13" y="16" width="7" height="3" rx="1.5" fill="#fff" />
    </svg>
  );
}

function AlphabetIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden>
      <rect x="3" y="3" width="26" height="26" rx="7" fill="var(--gold)" />
      <text x="16" y="23" textAnchor="middle" fontSize="18" fontWeight="700" fill="#fff">
        ፊ
      </text>
    </svg>
  );
}

export default function CoursesRoadmap() {
  const params = useSearchParams();
  const profile = useProfile();
  // The course being learned comes from the learner's own choice; the URL is
  // only a fallback (e.g. before the survey, or with accounts turned off).
  const track: Track = profile?.track ?? (params.get('track') === 'english' ? 'english' : 'amharic');
  const climb = useClimb();
  const { enabled, user, signOut } = useAuth();
  const guest = enabled && !user; // took the survey but hasn't made an account yet
  const [waliaVisible, setWaliaVisible] = useState(true);
  // The camp the learner is scrolled to; null until the page scrolls.
  const [viewCamp, setViewCamp] = useState<number | null>(null);

  const next = nextLesson(climb, track);
  const totals = trackTotals(climb, track);
  const courses = trackCourses(track);
  const altitude = altitudeFor(totals.done, totals.total);
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
  const shownLocked = shownIdx > currentCamp;
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
      <aside className="learn-sidebar">
        <div className="learn-logo">
          <Logo />
        </div>
        <nav className="learn-nav" aria-label="Learn">
          <Link href={`/courses?track=${track}`} className="learn-nav-link" aria-current="page">
            <TrailIcon />
            <span>Learn</span>
          </Link>
          <Link href={phrasebookHref} className="learn-nav-link">
            <BookIcon />
            <span>Phrasebook</span>
          </Link>
          <Link href="/fidel" className="learn-nav-link">
            <AlphabetIcon />
            <span>Alphabet</span>
          </Link>
        </nav>
        {user && (
          <div className="learn-account">
            <Link href="/profile" className="user-avatar" title="Your profile" aria-label="Your profile">
              {displayName(user).charAt(0).toUpperCase()}
            </Link>
            <button type="button" className="learn-logout" onClick={signOut} aria-label="Log out" title="Log out">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" />
                <path d="M10 17l-5-5 5-5" />
                <path d="M5 12h11" />
              </svg>
            </button>
          </div>
        )}
      </aside>

      {/* Middle: the trail */}
      <div className="learn-main">
        {shownCamp && (
          <div className={`camp-header camp-color-${shownIdx % 6}`}>
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
          const locked = campIdx > currentCamp;

          const stops: TrailStop[] = lessons.map((lesson, i) => ({
            title: lesson.title,
            number: i + 1,
            state: isDone(climb, course.slug, i)
              ? 'done'
              : next?.slug === course.slug && next.lesson === i
                ? 'current'
                : 'locked',
            href: `/courses/${course.slug}?lesson=${i}&practice=1`,
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
        <div className="rail-top">
          <CourseSwitcher track={track} />
          <ClimbStreak days={climb.days} log={climb.log} altitude={altitude} />
          <span className="top-stat grass" title="Grass collected">
            <GrassIcon size={26} />
            {climb.grass}
          </span>
          <span className="top-stat horns" title="Walia’s horn level">
            <Mascot pose="happy" size={28} hornScale={horns.scale} title="Walia" />
            {horns.level}
          </span>
        </div>

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
            Every phrase from {myCamp ? `Camp ${myCampIdx + 1}` : 'this camp'} in Ge’ez script,
            transliteration, and English, ready to review.
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
