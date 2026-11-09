import type { Metadata } from 'next';
import EverydayPage from '@/components/EverydayPage';

export const metadata: Metadata = {
  title: 'Everyday Amharic',
  description: 'The small words that make your Amharic sound natural, and real Amharic to read: minibus signs, café menus, text messages and holiday cards.',
};

export default function Page() {
  return <EverydayPage />;
}
