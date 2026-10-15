'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Mascot from '@/components/Mascot';
import { useAuth } from '@/components/AuthProvider';

// Where email confirmation links and Google/Apple/Facebook sign-ins land.
// Supabase reads the login from the URL; once the user shows up we send them to the trail.
export default function AuthCallbackPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (user) router.replace('/courses');
  }, [user, router]);

  useEffect(() => {
    const timer = window.setTimeout(() => setTimedOut(true), 8000);
    return () => window.clearTimeout(timer);
  }, []);

  const failed = timedOut && !loading && !user;

  return (
    <main className="auth-page">
      <div className="auth-card">
        <Mascot pose={failed ? 'happy' : 'cheer'} size={110} />
        <h1 className="h3" style={{ fontSize: 26 }}>
          {failed ? 'That didn’t work' : 'Signing you in…'}
        </h1>
        {failed && (
          <>
            <p className="muted">The link may have expired, or sign-in was cancelled. Please try again.</p>
            <Link href="/login" className="btn btn-block">
              Log in
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
