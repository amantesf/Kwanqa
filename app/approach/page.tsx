import type { Metadata } from 'next';
import { CTA, FeatureGrid, PageHero } from '@/components/sections';
import { approach } from '@/lib/content';

export const metadata: Metadata = { title: 'Our approach' };

export default function ApproachPage() {
  return (
    <main>
      <PageHero
        kicker="Our approach"
        title="How Kwanqa teaches Amharic, English, and heritage languages."
        lead="We’re committed to making language learning accessible, engaging, and meaningful, while honoring culture and identity."
      />
      <section className="section">
        <div className="container">
          <FeatureGrid items={approach} />
        </div>
      </section>
      <CTA />
    </main>
  );
}
