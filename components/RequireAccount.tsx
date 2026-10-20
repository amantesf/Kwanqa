'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import Mascot from '@/components/Mascot';
import { useAuth } from '@/components/AuthProvider';
import { useProfile, useProfileReady } from '@/lib/profile';

/**
 * Lessons are open to learners with an account and to guests who finished the
 * "Get started" survey. Everyone else is invited to take it (or log in) first.
 * (Without Supabase keys, accounts are off and everything stays open.)
 */
export default function RequireAccount({ children, what = 'this lesson' }: { children: ReactNode; what?: string }) {
  const { enabled, loading, user } = useAuth();
  const profile = useProfile();
  const ready = useProfileReady();
  const pathname = usePathname();
  const params = useSearchParams();

  if (!enabled || user || profile) return <>{children}</>;

  if (loading || !ready) {
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
        Answer a few quick questions to start {what}
      </h2>
      <p className="muted">
        Tell Walia what you want to learn and why. It takes under a minute. No account needed to
        try it.
      </p>
      <div className="row" style={{ justifyContent: 'center' }}>
        <Link href="/welcome" className="btn">
          Get started
        </Link>
        <Link href={`/login?next=${next}`} className="btn btn-secondary">
          Log in
        </Link>
      </div>
    </div>
  );
}
