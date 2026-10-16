'use client';

import Link from 'next/link';
import { displayName, useAuth } from '@/components/AuthProvider';
import { useProfile } from '@/lib/profile';

export default function HeroActions() {
  const { user, loading, enabled } = useAuth();
  const profile = useProfile();

  if (user) {
    return (
      <div className="hero-actions" data-hero-cta>
        <p className="muted">Welcome back, {displayName(user)}!</p>
        <Link href="/courses" className="btn">
          Continue climbing
        </Link>
      </div>
    );
  }

  // Guests who already took the survey pick up where they left off.
  if (profile) {
    return (
      <div className="hero-actions" data-hero-cta>
        <div className="row">
          <Link href={`/courses?track=${profile.track}`} className="btn">
            Continue climbing
          </Link>
          {enabled && (
            <Link href="/signup?next=%2Fcourses" className="btn btn-secondary">
              Save my progress
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="hero-actions" data-hero-cta style={{ visibility: loading ? 'hidden' : undefined }}>
      <div className="row">
        <Link href="/welcome" className="btn">
          Get started
        </Link>
        {enabled && (
          <Link href="/login" className="btn btn-secondary">
            I already have an account
          </Link>
        )}
      </div>
      <Link href="/courses" className="faint small text-link">
        or see what you can learn →
      </Link>
    </div>
  );
}
