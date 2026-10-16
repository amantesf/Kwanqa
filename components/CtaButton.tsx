'use client';

import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { useProfile } from '@/lib/profile';

// New visitors start the survey; learners and returning guests go back to the trail.
export default function CtaButton() {
  const { user } = useAuth();
  const profile = useProfile();
  const returning = user || profile;

  return (
    <Link
      href={returning ? `/courses${profile ? `?track=${profile.track}` : ''}` : '/welcome'}
      className="btn"
      style={{ minWidth: 260 }}
    >
      {returning ? 'Continue climbing' : 'Get started'}
    </Link>
  );
}
