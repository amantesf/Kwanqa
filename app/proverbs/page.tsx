import type { Metadata } from 'next';
import ProverbsPage from '@/components/ProverbsPage';

export const metadata: Metadata = {
  title: 'Amharic proverbs',
  description: 'ተረትና ምሳሌ: a proverb of the day and dozens of traditional Amharic proverbs, word by word, with what they mean.',
};

export default function Page() {
  return <ProverbsPage />;
}
