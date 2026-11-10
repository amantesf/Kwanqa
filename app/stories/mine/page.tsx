import type { Metadata } from 'next';
import StoriesPage from '@/components/StoriesPage';

export const metadata: Metadata = { title: 'My book · Stories', robots: { index: false } };

// The book itself lives in the learner's browser (lib/myBooks.ts), so the page only gets its id.
export default async function MyBookPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;
  return <StoriesPage view="mine" id={id ?? ''} />;
}
