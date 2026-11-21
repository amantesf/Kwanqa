import type { Metadata } from 'next';
import { Suspense } from 'react';
import Phrasebook from '@/components/Phrasebook';

export const metadata: Metadata = {
  title: 'Phrasebook',
  description: 'Everyday Amharic and English phrases with audio and transliteration: greetings, family, food, shopping, travel and more.',
};

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
