import type { Metadata } from 'next';
import { Suspense } from 'react';
import Unsubscribe from '@/components/Unsubscribe';

export const metadata: Metadata = { title: 'Streak reminders', robots: { index: false } };

export default function UnsubscribePage() {
  return (
    <main className="auth-page">
      <Suspense>
        <Unsubscribe />
      </Suspense>
    </main>
  );
}
