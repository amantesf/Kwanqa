import type { Metadata } from 'next';
import StoriesPage from '@/components/StoriesPage';

export const metadata: Metadata = {
  title: 'Add a book · Stories',
  description: 'Read any Amharic book on kwanqa: add a PDF or paste the text, then tap any word for its meaning and transliteration.',
};

export default function AddBookPage() {
  return <StoriesPage view="add" />;
}
