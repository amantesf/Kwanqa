import type { Metadata } from 'next';
import LearnSidebar from '@/components/LearnSidebar';
import Merkato from '@/components/Merkato';
import { sharePreview } from '@/lib/seo';

const description =
  'Practise Amharic at Addis Ababa’s big open market: ask the price, understand the number, ask for less and make a fair offer.';

export const metadata: Metadata = {
  title: 'Bargain at Merkato',
  description,
  openGraph: sharePreview('Bargain at Merkato · ገበያ', description),
};

export default function MerkatoPage() {
  return (
    <div className="learn-app">
      <LearnSidebar active="learn" track="amharic" />
      <main className="learn-main mk-page">
        <Merkato />
      </main>
    </div>
  );
}
