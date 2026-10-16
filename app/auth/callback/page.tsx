'use client';

import { Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Mascot from '@/components/Mascot';
import { displayName, safeNext, useAuth } from '@/components/AuthProvider';

// Where email confirmation links and Google/Apple/Facebook sign-ins land.
// Supabase reads the login from the URL; we confirm it, then move the user on.
function Callback() {
  const router = useRouter();
  const params = useSearchParams();
  const { user, loading } = useAuth();
  const next = safeNext(params.get('next'));

  useEffect(() => {
    if (!user) return;
    const timer = window.setTimeout(() => router.replace(next), 2200);
    return () => window.clearTimeout(timer);
  }, [user, next, router]);

  if (loading) {
    return (
      <div className="auth-card">
        <Mascot pose="happy" size={110} />
        <h1 className="h3" style={{ fontSize: 26 }}>
          Signing you in…
        </h1>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="auth-card">
        <Mascot pose="happy" size={110} />
        <h1 className="h3" style={{ fontSize: 26 }}>
          That link didn’t work
        </h1>
        <p className="muted">
          It may have expired or already been used. Log in if you’ve confirmed before, or
          sign up again to get a fresh link.
        </p>
        <Link href="/login" className="btn btn-block">
          Log in
        </Link>
        <Link href="/signup" className="text-link small">
          Sign up again
        </Link>
      </div>
    );
  }

  return (
    <div className="auth-card">
      <Mascot pose="cheer" size={120} />
      <h1 className="h3" style={{ fontSize: 26 }}>
        You’re in, {displayName(user)}! 🎉
      </h1>
      <p className="muted">Your account is ready and your climb will be saved. Taking you to the trail…</p>
      <Link href={next} className="btn btn-block">
        Start climbing
      </Link>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <main className="auth-page">
      <Suspense fallback={null}>
        <Callback />
      </Suspense>
    </main>
  );
}
