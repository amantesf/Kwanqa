import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import HolidayLesson from '@/components/HolidayLesson';
import JsonLd from '@/components/JsonLd';
import { holidayById, holidays } from '@/lib/holidays';
import { ORGANIZATION, SITE, breadcrumbs, sharePreview } from '@/lib/seo';

export function generateStaticParams() {
  return holidays.map(h => ({ id: h.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const holiday = holidayById((await params).id);
  if (!holiday) return { title: 'Holiday lesson' };
  const description = `${holiday.amharic} (${holiday.name}): ${holiday.about}. Learn the greeting ${holiday.greeting.amharic} and the Amharic words for the day in a free, short lesson.`;
  return { title: `${holiday.name} lesson`, description, openGraph: sharePreview(`${holiday.amharic} · ${holiday.name}`, description) };
}

export default async function HolidayLessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const holiday = holidayById(id);
  if (!holiday) notFound();
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'LearningResource',
          name: `${holiday.name} (${holiday.amharic}) lesson`,
          description: holiday.about,
          learningResourceType: 'Lesson',
          inLanguage: 'am',
          url: `${SITE}/holidays/${holiday.id}`,
          isAccessibleForFree: true,
          provider: ORGANIZATION,
        }}
      />
      <JsonLd data={breadcrumbs([['Home', '/'], ['Holidays', '/holidays'], [holiday.name, `/holidays/${holiday.id}`]])} />
      <HolidayLesson id={id} />
    </>
  );
}
