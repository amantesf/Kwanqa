import type { Metadata } from 'next';
import StatsView from '@/components/StatsView';

export const metadata: Metadata = { title: 'Numbers', robots: { index: false } };

export default function StatsPage() {
  return <StatsView />;
}
