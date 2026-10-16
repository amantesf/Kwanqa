import type { Metadata } from 'next';
import { Suspense } from 'react';
import Onboarding from '@/components/Onboarding';

export const metadata: Metadata = { title: 'Get started' };

export default function WelcomePage() {
  return (
    <main>
      <Suspense fallback={null}>
        <Onboarding />
      </Suspense>
    </main>
  );
}
