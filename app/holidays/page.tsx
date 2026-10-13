import type { Metadata } from 'next';
import HolidayCalendar from '@/components/HolidayCalendar';
import { sharePreview } from '@/lib/seo';

const description =
  'Today’s Ethiopian date, the next holidays, greetings to send your family, and a lesson for each.';

export const metadata: Metadata = {
  title: 'Ethiopian holidays',
  description,
  openGraph: sharePreview('Ethiopian holidays · kwanqa', description),
};

export default function HolidaysPage() {
  return <HolidayCalendar />;
}
