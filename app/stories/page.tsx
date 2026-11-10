import type { Metadata } from 'next';
import StoriesPage from '@/components/StoriesPage';

export const metadata: Metadata = {
  title: 'Stories',
  description: 'Short Amharic stories to read and listen to. Tap any word you don’t know, and watch your known words grow.',
};

export default function Page() {
  return <StoriesPage />;
}
