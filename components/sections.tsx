import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FadeInOnScroll } from '@/components/FadeInOnScroll';
import Flag from '@/components/Flag';
import Mascot from '@/components/Mascot';
import type { Feature, Testimonial } from '@/lib/content';
import type { CourseSummary } from '@/lib/courses';
import { lessonCount } from '@/lib/courses';
import type { Founder } from '@/lib/team';

const TONES = ['tone-primary', 'tone-gold', 'tone-blue'];
// Ge'ez letters double as playful feature icons.
const GLYPHS = ['ሀ', 'ለ', 'ሐ', 'መ', 'ሠ', 'ረ', 'ሰ', 'ቀ'];

function initials(name: string) {
  return name
    .split(' ')
    .map(part => part[0])
    .slice(0, 2)
    .join('');
}

export function PageHero({
  kicker,
  title,
  lead,
  back,
  pose = 'wave',
  children,
}: {
  kicker: string;
  title: ReactNode;
  lead?: ReactNode;
  back?: { href: string; label: string };
  pose?: 'wave' | 'happy' | 'cheer';
  children?: ReactNode;
}) {
  return (
    <section className="page-hero">
      <div className="container page-hero-grid">
        <FadeInOnScroll>
          <div>
            {back && (
              <Link href={back.href} className="back-link">
                ← {back.label}
              </Link>
            )}
            <div className="page-hero-inner">
              <span className="kicker">{kicker}</span>
              <h1 className="h1">{title}</h1>
              {lead && <p className="lead">{lead}</p>}
              {children}
            </div>
          </div>
        </FadeInOnScroll>
        <div className="page-hero-art">
          <Mascot pose={pose} size={190} className="floaty" />
        </div>
      </div>
    </section>
  );
}

export function SectionHead({
  kicker,
  title,
  lead,
  center,
}: {
  kicker?: string;
  title: ReactNode;
  lead?: ReactNode;
  center?: boolean;
}) {
  return (
    <FadeInOnScroll>
      <div className={`section-head${center ? ' center' : ''}`}>
        {kicker && <span className="kicker">{kicker}</span>}
        <h2 className="h2">{title}</h2>
        {lead && <p className="lead">{lead}</p>}
      </div>
    </FadeInOnScroll>
  );
}

export function FeatureGrid({ items }: { items: Feature[] }) {
  return (
    <div className="grid-3">
      {items.map((item, idx) => (
        <FadeInOnScroll key={item.title} delay={(idx % 3) * 0.06}>
          <div className="card" style={{ height: '100%' }}>
            <span className={`icon-circle ${TONES[idx % TONES.length]}`}>
              {GLYPHS[idx % GLYPHS.length]}
            </span>
            <h3 className="h3">{item.title}</h3>
            <p className="muted small">{item.body}</p>
          </div>
        </FadeInOnScroll>
      ))}
    </div>
  );
}

export function FounderCard({ founder }: { founder: Founder }) {
  return (
    <div className="card founder-card" style={{ height: '100%' }}>
      <div className="founder-photo">
        {founder.image ? (
          <Image
            src={founder.image}
            alt={`Portrait of ${founder.name}`}
            fill
            sizes="(max-width: 700px) 100vw, 520px"
          />
        ) : (
          <span className="founder-initials">{initials(founder.name)}</span>
        )}
      </div>
      <div className="founder-body">
        <span className="founder-role">{founder.role}</span>
        <h3 className="h3">{founder.name}</h3>
        <p className="muted small">{founder.bio}</p>
      </div>
    </div>
  );
}

export function FounderGrid({ founders }: { founders: Founder[] }) {
  return (
    <div className="grid-2">
      {founders.map((founder, idx) => (
        <FadeInOnScroll key={founder.name} delay={idx * 0.08}>
          <FounderCard founder={founder} />
        </FadeInOnScroll>
      ))}
    </div>
  );
}

export function Testimonials({ items }: { items: Testimonial[] }) {
  return (
    <div className="grid-3">
      {items.map((item, idx) => (
        <FadeInOnScroll key={item.name} delay={idx * 0.06}>
          <figure className="card quote-card" style={{ height: '100%' }}>
            <blockquote>“{item.quote}”</blockquote>
            <figcaption>
              <span className={`avatar ${TONES[(idx + 1) % TONES.length]}`}>
                {initials(item.name)}
              </span>
              {item.name}
            </figcaption>
          </figure>
        </FadeInOnScroll>
      ))}
    </div>
  );
}

export function CourseCard({ course }: { course: CourseSummary }) {
  const lessons = lessonCount(course.slug);
  return (
    <Link href={`/courses/${course.slug}`} className="card card-link course-card">
      <div className="course-top">
        <Flag name={course.track === 'amharic' ? 'ethiopia' : 'usa'} className="course-flag" />
        <div className="row" style={{ gap: 8 }}>
          <span className={`badge ${course.track === 'amharic' ? 'badge-primary' : 'badge-blue'}`}>
            Part {course.part}
          </span>
          {course.part === 1 && <span className="badge">Start here</span>}
        </div>
      </div>
      <h3 className="h3">{course.title}</h3>
      <p className="muted small">{course.description}</p>
      <div className="card-foot">
        <span className="faint small">
          {lessons} {lessons === 1 ? 'lesson' : 'lessons'}
        </span>
        <span className="link">Start →</span>
      </div>
    </Link>
  );
}

export function CTA({ title = 'ready to start the climb?' }: { title?: string }) {
  return (
    <section className="section section-rule">
      <div className="container">
        <FadeInOnScroll>
          <div className="cta">
            <h2 className="h2">{title}</h2>
            <Mascot pose="cheer" size={170} className="floaty" />
            <Link href="/courses" className="btn" style={{ minWidth: 260 }}>
              Start the trail
            </Link>
          </div>
        </FadeInOnScroll>
      </div>
    </section>
  );
}
