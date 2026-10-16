import type { Metadata } from 'next';
import { Suspense } from 'react';
import CoursesView from '@/components/CoursesView';

export const metadata: Metadata = { title: 'Courses' };

// Visitors see the course catalog; logged-in learners get the learn dashboard
// (navigation on the left, the Simien trail in the middle, climb stats on the right).
export default function CoursesPage() {
  return (
    <Suspense fallback={null}>
      <CoursesView />
    </Suspense>
  );
}
