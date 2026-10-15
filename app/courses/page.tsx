import type { Metadata } from 'next';
import { Suspense } from 'react';
import CoursesRoadmap from '@/components/CoursesRoadmap';

export const metadata: Metadata = { title: 'Courses' };

// The learn dashboard: navigation on the left, the Simien trail in the
// middle, and the learner's climb stats on the right.
export default function CoursesPage() {
  return (
    <main className="learn-page">
      <h1 className="sr-only">Your Simien trail</h1>
      <Suspense fallback={null}>
        <CoursesRoadmap />
      </Suspense>
    </main>
  );
}
