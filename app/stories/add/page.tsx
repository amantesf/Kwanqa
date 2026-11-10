import type { Metadata } from 'next';
import StoriesPage from '@/components/StoriesPage';

export const metadata: Metadata = { title: 'Add a book · Stories' };

export default function AddBookPage() {
  return <StoriesPage view="add" />;
}
