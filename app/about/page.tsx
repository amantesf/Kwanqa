import type { Metadata } from 'next';
import Link from 'next/link';
import { FadeInOnScroll } from '@/components/FadeInOnScroll';
import {
  CTA,
  FeatureGrid,
  PageHero,
  SectionHead,
  Testimonials,
} from '@/components/sections';
import { approach, testimonials, values } from '@/lib/content';

export const metadata: Metadata = { title: 'About' };

const anchors = [
  { href: '#why', label: 'Why we built it' },
  { href: '#values', label: 'Values' },
  { href: '#approach', label: 'How we teach' },
  { href: '#reviews', label: 'Reviews' },
];

export default function AboutPage() {
  return (
    <main>
      <PageHero
        kicker="About Kwanqa"
        title="The modern way to learn Amharic and English, built for connection."
        lead="We built Kwanqa for Amharic speakers, Ethiopian families, and the diaspora who never saw themselves in traditional language apps."
      >
        <nav className="anchor-nav" aria-label="On this page">
          {anchors.map(anchor => (
            <Link key={anchor.href} href={anchor.href} className="btn btn-secondary btn-sm">
              {anchor.label}
            </Link>
          ))}
        </nav>
      </PageHero>

      {/* Why */}
      <section className="section" id="why">
        <div className="container grid-2" style={{ gap: 48, alignItems: 'start' }}>
          <SectionHead
            kicker="Why we built Kwanqa"
            title="No one built it for us, so we built it ourselves."
          />
          <FadeInOnScroll delay={0.06}>
            <div className="prose">
              <p>
                Millions of Amharic speakers still don’t have quality tools to learn
                English, and millions of Ethiopian diaspora kids grow up wanting to learn
                Amharic but never get the chance. The world didn’t make space for our
                language, so we decided to build it ourselves.
              </p>
              <p>
                For years, major language apps ignored Amharic. That meant fewer
                opportunities at home, and no real way for the diaspora to reconnect with
                their culture, their families, or their identity.
              </p>
              <p>
                <strong>We don’t think that’s right.</strong>
              </p>
              <ul>
                <li>Learning a language shouldn’t depend on where you’re born.</li>
                <li>Amharic speakers deserve the same resources everyone else gets.</li>
                <li>Our community deserves a place to learn and stay connected.</li>
              </ul>
              <p>
                So we created Kwanqa: a modern, culturally grounded platform for Amharic
                speakers and the Ethiopian diaspora, with tools to help you learn your
                parents’ languages too, including Afaan Oromo, Tigrinya, and more.
              </p>
            </div>
          </FadeInOnScroll>
        </div>
      </section>

      <section className="section section-soft" id="values">
        <div className="container">
          <SectionHead
            kicker="Our values"
            title="What guides how we build Kwanqa."
            lead="Kwanqa is more than an app. It’s a commitment to language, culture, and community."
          />
          <FeatureGrid items={values} />
        </div>
      </section>

      <section className="section" id="approach">
        <div className="container">
          <SectionHead
            kicker="How we teach"
            title="Accessible, engaging, and meaningful."
            lead="We help learners master English, Amharic, and heritage languages while honoring culture and identity."
          />
          <FeatureGrid items={approach} />
        </div>
      </section>

      <section className="section" id="reviews">
        <div className="container">
          <SectionHead
            kicker="Reviews"
            title="What learners are saying."
            lead="Real people using Kwanqa to grow in English, Amharic, and their connection to Ethiopia."
          />
          <Testimonials items={testimonials} />
        </div>
      </section>

      <CTA />
    </main>
  );
}
