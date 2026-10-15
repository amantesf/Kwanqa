'use client';

import Link from 'next/link';
import { displayName, useAuth } from '@/components/AuthProvider';

export default function HeroActions() {
  const { user, loading, enabled } = useAuth();

  if (user) {
    return (
      <div className="hero-actions">
        <p className="muted">Welcome back, {displayName(user)}!</p>
        <Link href="/courses" className="btn">
          Continue climbing
        </Link>
      </div>
    );
  }

  return (
    <div className="hero-actions" style={{ visibility: loading ? 'hidden' : undefined }}>
      <div className="row">
        <Link href={enabled ? '/signup' : '/courses'} className="btn">
          Get started
        </Link>
        {enabled && (
          <Link href="/login" className="btn btn-secondary">
            I already have an account
          </Link>
        )}
      </div>
      <Link href="/courses" className="faint small text-link">
        or try a lesson first, no account needed →
      </Link>
    </div>
  );
}
