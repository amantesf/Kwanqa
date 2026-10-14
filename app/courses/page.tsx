import type { Metadata } from 'next';
import { Suspense } from 'react';
import CoursesView from '@/components/CoursesView';
import { sharePreview } from '@/lib/seo';

const description =
  'Free Amharic and English courses: 12 Amharic camps and 9 English camps, from first greetings to everyday conversation, with short, game-like lessons.';

export const metadata: Metadata = {
  title: 'Courses',
  description,
  openGraph: sharePreview('Free Amharic and English courses · kwanqa', description),
};

// Visitors see the course catalog; logged-in learners get the learn dashboard
// (navigation on the left, the Simien trail in the middle, climb stats on the right).
export default function CoursesPage() {
  return (
    <Suspense fallback={null}>
      <CoursesView />
    </Suspense>
  );
}
