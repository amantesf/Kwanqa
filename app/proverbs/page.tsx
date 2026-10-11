import type { Metadata } from 'next';
import ProverbsPage from '@/components/ProverbsPage';
import { sharePreview } from '@/lib/seo';

const description =
  'ተረትና ምሳሌ: a proverb of the day and dozens of traditional Amharic proverbs, word by word, with what they mean.';

export const metadata: Metadata = {
  title: 'Amharic proverbs',
  description,
  openGraph: sharePreview('Amharic proverbs · ተረትና ምሳሌ', description),
};

export default function Page() {
  return <ProverbsPage />;
}
