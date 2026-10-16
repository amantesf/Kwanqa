'use client';

import Link from 'next/link';
import { displayName, useAuth } from '@/components/AuthProvider';

// The two big buttons on the welcome page. Logged-in learners get a
// shortcut back to their trail instead.
export default function WelcomeActions() {
  const { user, loading, enabled } = useAuth();

  if (user) {
    return (
      <div className="welcome-actions">
        <p className="muted">Welcome back, {displayName(user)}!</p>
        <Link href="/courses" className="btn btn-block btn-lg">
          Continue climbing
        </Link>
      </div>
    );
  }

  return (
    <div className="welcome-actions" style={{ visibility: loading ? 'hidden' : undefined }}>
      <Link href="/welcome/learn" className="btn btn-block btn-lg">
        Get started
      </Link>
      {enabled && (
        <Link href="/login" className="btn btn-secondary btn-block btn-lg">
          I already have an account
        </Link>
      )}
    </div>
  );
}
