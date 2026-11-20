import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import HolidayLesson from '@/components/HolidayLesson';
import { holidayById, holidays } from '@/lib/holidays';

export function generateStaticParams() {
  return holidays.map(h => ({ id: h.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const holiday = holidayById((await params).id);
  if (!holiday) return { title: 'Holiday lesson' };
  const description = `${holiday.amharic} (${holiday.name}): ${holiday.about}. Learn the greeting ${holiday.greeting.amharic} and the Amharic words for the day in a free, short lesson.`;
  return { title: `${holiday.name} lesson`, description, openGraph: { title: `${holiday.amharic} · ${holiday.name}`, description } };
}

export default async function HolidayLessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!holidayById(id)) notFound();
  return <HolidayLesson id={id} />;
}
