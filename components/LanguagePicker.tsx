'use client';

import Link from 'next/link';
import Flag, { type FlagName } from '@/components/Flag';
import { useAuth } from '@/components/AuthProvider';

type Course = {
  name: string;
  native: string;
  flag: FlagName;
  /** Track to open on the trail; courses without one are coming soon. */
  track?: 'amharic' | 'english';
};

const COURSES: Course[] = [
  { name: 'Amharic', native: 'አማርኛ', flag: 'ethiopia', track: 'amharic' },
  { name: 'English', native: 'for Amharic speakers', flag: 'usa', track: 'english' },
  { name: 'Afaan Oromoo', native: 'Oromo', flag: 'oromia' },
  { name: 'Tigrinya', native: 'ትግርኛ', flag: 'tigray' },
];

// The course cards. Picking a course sends new learners to sign up first
// (when accounts are on), then straight onto that course's trail.
export default function LanguagePicker() {
  const { user, enabled } = useAuth();

  return (
    <div className="choose-grid">
      {COURSES.map(course => {
        const body = (
          <>
            <Flag name={course.flag} className="choose-flag" />
            <span className="choose-name">{course.name}</span>
            <span className="choose-native">{course.native}</span>
            {!course.track && <span className="choose-soon">Coming soon</span>}
          </>
        );

        if (!course.track) {
          return (
            <div key={course.name} className="choose-card soon" aria-disabled="true">
              {body}
            </div>
          );
        }

        const trail = `/courses?track=${course.track}`;
        const href = enabled && !user ? `/signup?next=${encodeURIComponent(trail)}` : trail;
        return (
          <Link key={course.name} href={href} className="choose-card">
            {body}
          </Link>
        );
      })}
    </div>
  );
}
