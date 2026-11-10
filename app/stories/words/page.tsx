import type { Metadata } from 'next';
import StoriesPage from '@/components/StoriesPage';

export const metadata: Metadata = { title: 'Words you’re learning · Stories' };

export default function WordsPage() {
  return <StoriesPage view="words" />;
}
