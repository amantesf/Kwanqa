import type { Metadata } from 'next';
import VoiceLab from '@/components/VoiceLab';

export const metadata: Metadata = { title: 'Voice lab', robots: { index: false } };

export default function VoiceLabPage() {
  return <VoiceLab />;
}
