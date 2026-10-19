import type { Metadata } from 'next';
import HolidayCalendar from '@/components/HolidayCalendar';

export const metadata: Metadata = {
  title: 'Ethiopian holidays',
  description: 'Today’s Ethiopian date, the next holidays, greetings to send your family, and a lesson for each.',
};

export default function HolidaysPage() {
  return <HolidayCalendar />;
}
