import type { Metadata } from 'next';
import Link from 'next/link';
import Mascot from '@/components/Mascot';

export const metadata: Metadata = { title: 'Page not found', robots: { index: false } };

// Any address that isn't a page: Walia can't find it either.
export default function NotFound() {
  return (
    <main className="auth-page">
      <div className="auth-card">
        <Mascot mood="thinking" size={120} />
        <h1 className="h3" style={{ fontSize: 26 }}>
          Walia can’t find this page
        </h1>
        <p className="muted">The link may be old, or there’s a typo in the address. The trail is still right where you left it.</p>
        <Link href="/courses" className="btn btn-block">
          Back to the trail
        </Link>
        <Link href="/" className="btn btn-secondary btn-block">
          Home
        </Link>
      </div>
    </main>
  );
}
