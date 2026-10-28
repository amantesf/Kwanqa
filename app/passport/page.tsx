import type { Metadata } from 'next';
import PassportPage from '@/components/Passport';

export const metadata: Metadata = {
  title: 'Your passport',
  description: 'Collect a stamp from a real place in Ethiopia for every camp you finish.',
};

type Props = { searchParams: Promise<{ track?: string }> };

export default async function Page({ searchParams }: Props) {
  const { track } = await searchParams;
  return <PassportPage initialTrack={track === 'english' ? 'english' : track === 'amharic' ? 'amharic' : undefined} />;
}
