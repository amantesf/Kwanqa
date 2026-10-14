import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import LessonViewer from '@/components/LessonViewer';
import MountainScene from '@/components/MountainScene';
import { courseCatalog, courseContent } from '@/lib/courses';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return Object.keys(courseContent).map(slug => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: courseContent[slug]?.title ?? 'Course not found' };
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  const course = courseContent[slug];
  const summary = courseCatalog.find(c => c.slug === slug);
  if (!course || !summary) notFound();

  return (
    <main>
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
            <LessonViewer slug={slug} track={summary.track} lessons={course.sections} />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
