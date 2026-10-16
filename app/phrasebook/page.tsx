import type { Metadata } from 'next';
import { Suspense } from 'react';
import Phrasebook from '@/components/Phrasebook';

export const metadata: Metadata = { title: 'Phrasebook' };

export default function PhrasebookPage() {
  return (
    <main className="section" style={{ paddingTop: 40 }}>
      <div className="container">
        <Suspense fallback={null}>
          <Phrasebook />
        </Suspense>
      </div>
    </main>
  );
}
