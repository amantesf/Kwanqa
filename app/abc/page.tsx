import type { Metadata } from 'next';
import AbcChart from '@/components/AbcChart';
import { PageHero } from '@/components/sections';

export const metadata: Metadata = { title: 'The English alphabet' };

export default function AbcPage() {
  return (
    <main>
      <PageHero
        kicker="ABC · የእንግሊዝኛ ፊደላት"
        title="Learn the English alphabet, one letter at a time."
        lead={
          <>
            <span lang="am">እንግሊዝኛ 26 ፊደላት አሉት። እያንዳንዱን ፊደል ይንኩ፣ ስሙንና አንድ ምሳሌ ቃል ይስሙ።</span>
            <br />
            English has 26 letters, each with a capital and a small form. Tap a letter to hear its name and an example
            word.
          </>
        }
        pose="happy"
        back={{ href: '/courses?track=english', label: 'Back to the trail' }}
      />
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container">
          <AbcChart />
        </div>
      </section>
    </main>
  );
}
