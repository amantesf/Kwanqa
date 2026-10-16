'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import Mascot from '@/components/Mascot';
import { useAuth } from '@/components/AuthProvider';

/**
 * Lessons and practice need an account. Logged-out visitors get a friendly
 * prompt that brings them back here after signing up or logging in.
 * (Without Supabase keys, accounts are off and everything stays open.)
 */
export default function RequireAccount({ children, what = 'this lesson' }: { children: ReactNode; what?: string }) {
  const { enabled, loading, user } = useAuth();
  const pathname = usePathname();
  const params = useSearchParams();

  if (!enabled || user) return <>{children}</>;

  if (loading) {
    return (
      <div className="gate">
        <Mascot pose="happy" size={100} />
        <p className="muted">Getting your trail ready…</p>
      </div>
    );
  }

  const here = params.toString() ? `${pathname}?${params}` : pathname;
  const next = encodeURIComponent(here);

  return (
    <div className="gate">
      <Mascot pose="wave" size={120} />
      <h2 className="h3" style={{ fontSize: 26 }}>
        Create a free account to start {what}
      </h2>
      <p className="muted">
        Your account saves every stone you climb, the grass you earn, and Walia’s horns—on any
        device.
      </p>
      <div className="row" style={{ justifyContent: 'center' }}>
        <Link href={`/signup?next=${next}`} className="btn">
          Create free account
        </Link>
        <Link href={`/login?next=${next}`} className="btn btn-secondary">
          Log in
        </Link>
      </div>
    </div>
  );
}
