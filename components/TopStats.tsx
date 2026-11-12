'use client';

// The row of stats at the top of the right column: course, climb streak,
// grass, Walia's horn level and, on phones, the light/dark switch. Shared by
// the learn dashboard and profile.

import ClimbStreak from '@/components/ClimbStreak';
import CourseSwitcher from '@/components/CourseSwitcher';
import GrassIcon from '@/components/GrassIcon';
import Mascot from '@/components/Mascot';
import { altitudeFor, hornLevel, trackTotals, useClimb } from '@/lib/climb';
import type { Track } from '@/lib/courses';
import { ThemeIconButton } from '@/components/ThemeToggle';
import { useCountUp } from '@/lib/useCountUp';

export default function TopStats({ track }: { track: Track }) {
  const climb = useClimb();
  const totals = trackTotals(climb, track);
  const altitude = altitudeFor(totals.done, totals.total);
  const horns = hornLevel(climb.grass);
  // New grass counts up; the saved total loading in on page load doesn't.
  const grass = useCountUp(climb.grass, { quietFor: 1500 });

  return (
    <div className="rail-top">
      <CourseSwitcher track={track} />
      <ClimbStreak days={climb.days} log={climb.log} altitude={altitude} />
      <span className="top-stat grass" title="Grass collected">
        <GrassIcon size={26} />
        {grass}
      </span>
      <span className="top-stat horns" title="Walia’s horn level">
        <Mascot pose="happy" size={28} hornScale={horns.scale} title="Walia" />
        {horns.level}
      </span>
      <ThemeIconButton />
    </div>
  );
}
