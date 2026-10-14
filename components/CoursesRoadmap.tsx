'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Flag from '@/components/Flag';
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

export default function CoursesRoadmap() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const track: Track = params.get('track') === 'english' ? 'english' : 'amharic';
  const climb = useClimb();
  const [waliaVisible, setWaliaVisible] = useState(true);

  const next = nextLesson(climb, track);
  const totals = trackTotals(climb, track);
  const courses = trackCourses(track);
  const altitude = altitudeFor(totals.done, totals.total);
  const horns = hornLevel(climb.grass);
  const nextKey = next ? `${next.slug}:${next.lesson}` : 'summit';
  // Camps above the one you're on stay locked under the clouds.
  const currentCamp = next ? courses.findIndex(c => c.slug === next.slug) : courses.length;

  // Open the trail where Walia is standing, not at the summit.
  useEffect(() => {
    scrollToWalia('auto');
  }, [track, nextKey]);

  // Offer a shortcut back to Walia once the current stone scrolls out of view.
  useEffect(() => {
    const stone = document.querySelector('[data-current-stone]');
    if (!stone) return;
    const observer = new IntersectionObserver(([entry]) => setWaliaVisible(entry.isIntersecting));
    observer.observe(stone);
    return () => observer.disconnect();
  }, [track, nextKey]);

  function selectTrack(id: Track) {
    router.replace(`${pathname}?track=${id}`, { scroll: false });
  }

  return (
    <div className="roadmap">
      {/* Sticky climb bar */}
      <div className="climb-bar">
        <div className="segmented" role="group" aria-label="Choose a track">
          {TRACKS.map(t => (
            <button
              key={t.id}
              type="button"
              aria-pressed={track === t.id}
              onClick={() => selectTrack(t.id)}
            >
              <Flag name={t.id === 'amharic' ? 'ethiopia' : 'usa'} className="segmented-flag" />
              {t.label}
            </button>
          ))}
        </div>
        <div className="climb-stats">
          <span className="climb-stat" title="Your altitude on this track">
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
              <path d="M2 20 L9 8 L13 14 L16 10 L22 20 Z" fill="var(--primary)" />
              <path d="M9 8 L11 11.5 L9.8 11 L8.3 12 Z" fill="#fff" />
            </svg>
            {altitude.toLocaleString()} m
          </span>
          <span className="climb-stat" title="Grass collected">
            <GrassIcon size={20} />
            {climb.grass}
          </span>
          <span
            className="climb-stat"
            title={
              horns.next === null
                ? 'Walia’s horns are fully grown'
                : `Collect ${horns.next - climb.grass} more grass to grow Walia’s horns`
            }
          >
            <Mascot pose="happy" size={22} hornScale={horns.scale} title="Walia" />
            Horns {horns.level}/{horns.max}
          </span>
        </div>
      </div>

      {/* Summit */}
      <div className={`summit${next ? ' zone-locked' : ' reached'}`}>
        <MountainScene className="summit-art" />
        <div className="summit-text">
          <span className="kicker">
            Summit · ራስ ዳሽን · {SUMMIT_ALTITUDE.toLocaleString()} m
          </span>
          <h2 className="h3" style={{ fontSize: 24 }}>
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
          state: isDone(climb, course.slug, i)
            ? 'done'
            : next?.slug === course.slug && next.lesson === i
              ? 'current'
              : 'locked',
          href: `/courses/${course.slug}?lesson=${i}`,
        }));
        const banner = (
          <>
            <MountainScene className="camp-art" variant="light" />
            <div className="camp-banner-text">
              <span className="kicker">
                Camp {campIdx + 1} · Part {course.part}
              </span>
              <h2>{course.title}</h2>
              <p>{course.description}</p>
            </div>
          </>
        );

        return (
          <section
            key={course.slug}
            className={`zone zone-${zone.tone}${locked ? ' zone-locked' : ''}`}
            aria-label={`${zone.name}${locked ? ' (locked)' : ''}`}
          >
            <span className="zone-chip">
              {locked
                ? `Finish Camp ${campIdx} to unlock`
                : `${zone.name} · ${zone.from.toLocaleString()}–${zone.to.toLocaleString()} m`}
            </span>
            <div className="trail-wrap">
              <Trail stops={stops} hornScale={horns.scale} />
            </div>
            {locked ? (
              <div className={`camp-banner${campIdx % 2 === 1 ? ' alt' : ''}`}>{banner}</div>
            ) : (
              <Link
                href={`/courses/${course.slug}`}
                className={`camp-banner${campIdx % 2 === 1 ? ' alt' : ''}`}
              >
                {banner}
              </Link>
            )}
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

      {!waliaVisible && next && (
        <button type="button" className="jump-walia" onClick={() => scrollToWalia('smooth')}>
          <Mascot pose="wave" size={30} hornScale={horns.scale} title="Walia" />
          Jump to Walia
        </button>
      )}
    </div>
  );
}
