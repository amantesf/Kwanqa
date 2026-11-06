import type { Metadata } from 'next';
import { Suspense } from 'react';
import PersonalPractice from '@/components/PersonalPractice';
import RequireAccount from '@/components/RequireAccount';

export const metadata: Metadata = {
  title: 'Practise your mistakes',
  robots: { index: false },
};

type Props = { searchParams: Promise<{ track?: string }> };

export default async function Page({ searchParams }: Props) {
  const { track } = await searchParams;
  return (
    <main>
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container">
          <Suspense fallback={null}>
            <RequireAccount what="your practice">
              <PersonalPractice requestedTrack={track === 'english' ? 'english' : track === 'amharic' ? 'amharic' : undefined} />
            </RequireAccount>
          </Suspense>
        </div>
      </section>
    </main>
  );
}
