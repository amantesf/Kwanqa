import type { Metadata } from 'next';
import StoriesPage from '@/components/StoriesPage';

// Each learner's own word list, so there's nothing here for search engines.
export const metadata: Metadata = { title: 'Words you’re learning · Stories', robots: { index: false } };

export default function WordsPage() {
  return <StoriesPage view="words" />;
}
