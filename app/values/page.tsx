import type { Metadata } from 'next';
import { CTA, FeatureGrid, PageHero } from '@/components/sections';
import { values } from '@/lib/content';

export const metadata: Metadata = { title: 'Our values' };

export default function ValuesPage() {
  return (
    <main>
      <PageHero
        kicker="Our values"
        title="What guides how we build Kwanqa."
        lead="Kwanqa is more than an app. It’s a commitment to language, culture, and community. These principles shape every feature we ship."
      />
      <section className="section">
        <div className="container">
          <FeatureGrid items={values} />
        </div>
      </section>
      <CTA />
    </main>
  );
}
