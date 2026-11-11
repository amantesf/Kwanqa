import type { Metadata } from 'next';
import { Suspense } from 'react';
import FamilyPage from '@/components/FamilyPage';

export const metadata: Metadata = {
  title: 'Family',
  description: 'Learn Amharic together as a family: share a code, keep a family streak, and see who has practised today.',
};

export default function Page() {
  return (
    <Suspense>
      <FamilyPage />
    </Suspense>
  );
}
