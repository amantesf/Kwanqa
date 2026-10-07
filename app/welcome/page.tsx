import type { Metadata } from 'next';
import { Suspense } from 'react';
import Onboarding from '@/components/Onboarding';

export const metadata: Metadata = {
  title: 'Get started',
  description: 'Start learning Amharic or English with kwanqa: pick your language and take your first lesson in a few minutes. Free, no account needed.',
};

export default function WelcomePage() {
  return (
    <main>
      <Suspense fallback={null}>
        <Onboarding />
      </Suspense>
    </main>
  );
}
