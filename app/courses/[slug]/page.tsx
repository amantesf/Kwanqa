import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import JsonLd from '@/components/JsonLd';
import LessonViewer from '@/components/LessonViewer';
import MountainScene from '@/components/MountainScene';
import RequireAccount from '@/components/RequireAccount';
import { courseCatalog, courseContent } from '@/lib/courses';
import { ORGANIZATION, SITE, breadcrumbs, sharePreview } from '@/lib/seo';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return Object.keys(courseContent).map(slug => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = courseContent[slug];
  if (!course) return { title: 'Course not found' };
  const summary = courseCatalog.find(c => c.slug === slug)?.description;
  const description = `${summary ?? course.title} Free, bite-sized lessons with audio, transliteration and games on kwanqa.`;
  return { title: course.title, description, openGraph: sharePreview(course.title, description) };
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  const course = courseContent[slug];
  const summary = courseCatalog.find(c => c.slug === slug);
  if (!course || !summary) notFound();

  return (
    <main>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Course',
          name: course.title,
          description: summary.description,
          url: `${SITE}/courses/${slug}`,
          inLanguage: summary.track === 'english' ? 'en' : 'am',
          isAccessibleForFree: true,
          provider: ORGANIZATION,
          hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'online', courseWorkload: 'PT10M' },
          offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD', category: 'Free' },
        }}
      />
      <JsonLd data={breadcrumbs([['Home', '/'], ['Courses', '/courses'], [course.title, `/courses/${slug}`]])} />
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container">
          <Link href={`/courses?track=${summary.track}`} className="back-link">
            ← Back to the trail
          </Link>
          <div className={`camp-banner${summary.part === 2 ? ' alt' : ''}`}>
            <MountainScene className="camp-art" variant="light" />
            <div className="camp-banner-text">
              <span className="kicker">
                {summary.track === 'english' ? 'Learn English' : 'Learn Amharic'} · Camp{' '}
                {summary.part} · {course.sections.length} lessons
              </span>
              <h2>{course.title}</h2>
              {course.intro && <p>{course.intro}</p>}
            </div>
          </div>
          <Suspense fallback={null}>
            <RequireAccount>
              <LessonViewer slug={slug} track={summary.track} lessons={course.sections} />
            </RequireAccount>
          </Suspense>
        </div>
      </section>
    </main>
  );
}
