'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { displayName, useAuth } from '@/components/AuthProvider';
import Flag from '@/components/Flag';
import Logo from '@/components/Logo';
import GrassIcon from '@/components/GrassIcon';
import Mascot from '@/components/Mascot';
import MountainScene from '@/components/MountainScene';
import Trail, { type TrailStop } from '@/components/Trail';
import { courseContent, type Track } from '@/lib/courses';
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

const TRACKS: { id: Track; label: string }[] = [
  { id: 'amharic', label: 'Amharic' },
  { id: 'english', label: 'English' },
];

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

function CompassIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden>
      <circle cx="16" cy="16" r="13" fill="var(--purple)" />
      <circle cx="16" cy="16" r="9.5" fill="#cfa3f7" />
      <path d="M19.8 12.2 L17.6 17.6 L12.2 19.8 L14.4 14.4 Z" fill="#fff" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden>
      <path
        d="M16 28 C 6 21, 3 15, 3 10.5 C 3 6.5, 6 4, 9.5 4 C 12.5 4, 14.6 5.8, 16 8 C 17.4 5.8, 19.5 4, 22.5 4 C 26 4, 29 6.5, 29 10.5 C 29 15, 26 21, 16 28 Z"
        fill="var(--red)"
      />
      <path d="M8 9.5 C 8 8, 9 7, 10.5 7" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export default function CoursesRoadmap() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const track: Track = params.get('track') === 'english' ? 'english' : 'amharic';
  const climb = useClimb();
  const { enabled, user, signOut } = useAuth();
  const guest = enabled && !user; // took the survey but hasn't made an account yet
  const [waliaVisible, setWaliaVisible] = useState(true);

  const next = nextLesson(climb, track);
  const totals = trackTotals(climb, track);
  const courses = trackCourses(track);
  const altitude = altitudeFor(totals.done, totals.total);
  const horns = hornLevel(climb.grass);
  const nextKey = next ? `${next.slug}:${next.lesson}` : 'summit';
  // Camps above the one you're on stay locked under the clouds.
  const currentCamp = next ? courses.findIndex(c => c.slug === next.slug) : courses.length;
  const [viewCamp, setViewCamp] = useState(Math.min(currentCamp, courses.length - 1));

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

  // The banner at the top always names the camp you're scrolling through.
  useEffect(() => {
    let frame = 0;
    function update() {
      frame = 0;
      const banner = document.querySelector('.camp-header');
      const line = banner ? banner.getBoundingClientRect().bottom + 24 : 200;
      const zones = Array.from(document.querySelectorAll<HTMLElement>('[data-camp]'));
      const hit = zones.find(z => {
        const r = z.getBoundingClientRect();
        return r.top <= line && r.bottom > line;
      });
      if (hit) setViewCamp(Number(hit.dataset.camp));
    }
    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [track, nextKey]);

  function selectTrack(id: Track) {
    router.replace(`${pathname}?track=${id}`, { scroll: false });
  }

  const shownCamp = courses[viewCamp] ?? courses[0];
  // The banner's Phrasebook button follows the camp on screen; the sidebar and
  // the rail card always open the learner's own camp (where Walia is).
  const shownPhrasebookHref = shownCamp
    ? `/phrasebook?track=${track}&camp=${shownCamp.slug}`
    : `/phrasebook?track=${track}`;
  const myCampIdx = Math.min(currentCamp, courses.length - 1);
  const myCamp = courses[myCampIdx];
  const phrasebookHref = `/phrasebook?track=${track}`;
  const nextTitle = next ? courseContent[next.slug]?.sections[next.lesson]?.title : null;
  const nextHref = next ? `/courses/${next.slug}?lesson=${next.lesson}` : null;
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
          <Link href="/approach" className="learn-nav-link">
            <CompassIcon />
            <span>Our approach</span>
          </Link>
          <Link href="/about" className="learn-nav-link">
            <HeartIcon />
            <span>About us</span>
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
          <div className={`camp-header${viewCamp % 2 === 1 ? ' alt' : ''}`}>
            <div className="camp-header-text">
              <span className="camp-header-kicker">
                Camp {viewCamp + 1} · Part {shownCamp.part}
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
            href: `/courses/${course.slug}?lesson=${i}`,
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
                <Trail stops={stops} hornScale={horns.scale} waliaSize={116} />
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
          <div className="track-flags" role="group" aria-label="Choose a track">
            {TRACKS.map(t => (
              <button
                key={t.id}
                type="button"
                className="track-flag"
                aria-pressed={track === t.id}
                title={`Learn ${t.label}`}
                onClick={() => selectTrack(t.id)}
              >
                <Flag name={t.id === 'amharic' ? 'ethiopia' : 'usa'} className="track-flag-img" />
                <span className="sr-only">{t.label}</span>
              </button>
            ))}
          </div>
          <span className="top-stat altitude" title="Your altitude on this track">
            <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden>
              <path d="M2 20 L9 8 L13 14 L16 10 L22 20 Z" fill="var(--primary)" />
              <path d="M9 8 L11 11.5 L9.8 11 L8.3 12 Z" fill="#fff" />
            </svg>
            {altitude.toLocaleString()} m
          </span>
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
              <Mascot pose="wave" size={92} hornScale={horns.scale} />
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
