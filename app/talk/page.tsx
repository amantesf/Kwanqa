import type { Metadata } from 'next';
import TalkPage from '@/components/TalkPage';
import './call.css';
import './talk.css';
import './call.dark.css';
import './talk.dark.css';

export const metadata: Metadata = {
  title: 'Talk with Walia',
  description: 'ጨዋታ: call Walia and practice real Amharic conversations out loud, starting with simple greetings.',
};

export default function Page() {
  return <TalkPage />;
}
