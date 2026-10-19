'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import LessonViewer from '@/components/LessonViewer';
import { DateTile, ShareGreeting, countdown, useNow } from '@/components/HolidayCards';
import { daysBetween, holidayById } from '@/lib/holidays';
import { useProfile } from '@/lib/profile';

// A holiday's special lesson, in the learner's current course: Amharic learners
// learn the greetings; English learners learn to explain the holiday in English.
export default function HolidayLesson({ id }: { id: string }) {
  const profile = useProfile();
  const now = useNow();
  const holiday = holidayById(id)!;
  const track = profile?.track ?? 'amharic';
  const lesson = holiday.lessons[track];

  let next: Date | null = null;
  if (now) {
    const thisYear = holiday.date(now.getFullYear());
    next = daysBetween(now, thisYear) >= 0 ? thisYear : holiday.date(now.getFullYear() + 1);
  }

  return (
    <main className="section holiday-lesson" style={{ '--holiday': holiday.color } as React.CSSProperties}>
      <div className="container stack">
        <Link href="/holidays" className="back-link">
          ← All holidays
        </Link>
        <header className="holiday-hero">
          {next && <DateTile date={next} color={holiday.color} />}
          <div className="holiday-hero-text">
            <h1 className="h2">
              {holiday.name} <span lang="am">{holiday.amharic}</span>
            </h1>
            <p className="holiday-meta">
              {holiday.about}
              {now && next ? `, ${countdown(daysBetween(now, next))}` : ''}
            </p>
            <p className="holiday-greeting holiday-greeting-lg" lang="am">
              {holiday.greeting.amharic}
            </p>
            <p className="holiday-greeting-en">{holiday.greeting.english}</p>
          </div>
          <ShareGreeting holiday={holiday} className="btn holiday-hero-share" />
        </header>
        <Suspense>
          <LessonViewer
            key={track}
            slug={`holiday-${holiday.id}-${track}`}
            track={track}
            lessons={[lesson]}
            basePath={`/holidays/${holiday.id}`}
            backHref="/holidays"
            backLabel="Back to holidays"
          />
        </Suspense>
      </div>
    </main>
  );
}
