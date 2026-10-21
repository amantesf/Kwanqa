import type { Metadata } from 'next';
import FidelChart from '@/components/FidelChart';
import { PageHero } from '@/components/sections';

export const metadata: Metadata = { title: 'The ፊደል alphabet' };

export default function FidelPage() {
  return (
    <main>
      <PageHero
        kicker="ፊደል · The Ge’ez alphabet"
        title="Learn to read Amharic, one letter family at a time."
        lead="Each character is a consonant plus a vowel. Every row is one consonant, and every column is one of the seven vowel sounds. Once you know a row’s pattern, you can read all seven forms."
        pose="happy"
        back={{ href: '/courses', label: 'Back to the trail' }}
      />
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container">
          <FidelChart />
        </div>
      </section>
    </main>
  );
}
