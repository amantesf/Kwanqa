'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Mascot from '@/components/Mascot';

// When a page breaks: say so kindly and offer a retry, instead of a blank screen.
// Progress is saved as you go, so nothing is lost.
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="auth-page">
      <div className="auth-card">
        <Mascot mood="sad" size={120} />
        <h1 className="h3" style={{ fontSize: 26 }}>
          Walia slipped on a rock
        </h1>
        <p className="muted">Something went wrong on this page. Your progress is saved, so nothing is lost.</p>
        <button type="button" className="btn btn-block" onClick={reset}>
          Try again
        </button>
        <Link href="/courses" className="btn btn-secondary btn-block">
          Back to the trail
        </Link>
      </div>
    </main>
  );
}
