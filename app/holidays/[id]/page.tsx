import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import HolidayLesson from '@/components/HolidayLesson';
import { holidayById, holidays } from '@/lib/holidays';

export function generateStaticParams() {
  return holidays.map(h => ({ id: h.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const holiday = holidayById((await params).id);
  return { title: holiday ? `${holiday.name} lesson` : 'Holiday lesson' };
}

export default async function HolidayLessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!holidayById(id)) notFound();
  return <HolidayLesson id={id} />;
}
