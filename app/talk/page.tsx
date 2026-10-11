import type { Metadata } from 'next';
import TalkPage from '@/components/TalkPage';
import './call.css';
import './talk.css';
import './call.dark.css';
import './talk.dark.css';
import { sharePreview } from '@/lib/seo';

const description =
  'ጨዋታ: call Walia and practice real Amharic conversations out loud, starting with simple greetings.';

export const metadata: Metadata = {
  title: 'Talk with Walia',
  description,
  openGraph: sharePreview('Talk with Walia · ጨዋታ', description),
};

export default function Page() {
  return <TalkPage />;
}
