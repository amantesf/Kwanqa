import type { Metadata } from 'next';
import StoriesPage from '@/components/StoriesPage';

export const metadata: Metadata = {
  title: 'Stories',
  description:
    'Read and listen to real Amharic: kwanqa stories, 29 illustrated storybooks, and your own books. Tap any word you don’t know, and watch your known words grow.',
};

export default function Page() {
  return <StoriesPage view="shelf" />;
}
