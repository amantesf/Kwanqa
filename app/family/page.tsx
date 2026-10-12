import type { Metadata } from 'next';
import { Suspense } from 'react';
import FamilyPage from '@/components/FamilyPage';
import { sharePreview } from '@/lib/seo';

const description =
  'Learn Amharic together as a family: share a code, keep a family streak, and see who has practised today.';

export const metadata: Metadata = {
  title: 'Family',
  description,
  openGraph: sharePreview('Learn Amharic as a family · kwanqa', description),
};

export default function Page() {
  return (
    <Suspense>
      <FamilyPage />
    </Suspense>
  );
}
