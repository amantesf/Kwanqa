'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Captcha, { captchaEnabled } from '@/components/Captcha';
import Mascot from '@/components/Mascot';
import SocialButtons from '@/components/SocialButtons';
import { safeNext, useAuth } from '@/components/AuthProvider';
import { readProfile } from '@/lib/profile';
import { supabase } from '@/lib/supabase';

type Mode = 'signup' | 'login';

// Turns Supabase's error messages into friendlier ones.
function friendly(message: string) {
  const m = message.toLowerCase();
  if (m.includes('invalid login credentials')) return 'That email and password don’t match. Try again?';
  if (m.includes('email not confirmed')) return 'Please confirm your email first—check your inbox for the link.';
  if (m.includes('already registered')) return 'There’s already an account with that email. Try logging in.';
  if (m.includes('captcha')) return 'The “are you human?” check didn’t go through. Please try again.';
  if (m.includes('rate limit')) return 'Too many tries for now. Please wait a few minutes and try again.';
  if (m.includes('password')) return message;
  return 'Something went wrong. Please try again.';
}

export default function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get('next'));
  const { enabled, user } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [sentTo, setSentTo] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [captchaKey, setCaptchaKey] = useState(0);

  const isSignup = mode === 'signup';

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!supabase || busy) return;
    setError('');
    setBusy(true);
    // Each token works once, so get a fresh check ready for the next try.
    const token = captchaToken || undefined;
    setCaptchaToken('');
    setCaptchaKey(k => k + 1);

    if (isSignup) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name: name.trim(), onboarding: readProfile() ?? undefined },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
          captchaToken: token,
        },
      });
      setBusy(false);
      if (error) return setError(friendly(error.message));
      if (data.session) return router.push(next);
      setSentTo(email); // email confirmation is on: wait for the link
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password, options: { captchaToken: token } });
      setBusy(false);
      if (error) return setError(friendly(error.message));
      router.push(next);
    }
  }

  if (!enabled) {
    return (
      <div className="auth-card">
        <Mascot pose="happy" size={110} />
        <h1 className="h3" style={{ fontSize: 26 }}>
          Accounts are coming soon
        </h1>
        <p className="muted">
          You can still climb the whole trail—your progress is saved in this browser.
        </p>
        <Link href="/courses" className="btn btn-block">
          Try a lesson
        </Link>
      </div>
    );
  }

  if (user) {
    return (
      <div className="auth-card">
        <Mascot pose="wave" size={110} />
        <h1 className="h3" style={{ fontSize: 26 }}>
          You’re logged in
        </h1>
        <p className="muted">{user.email}</p>
        <Link href={next} className="btn btn-block">
          Continue climbing
        </Link>
      </div>
    );
  }

  if (sentTo) {
    return (
      <div className="auth-card">
        <Mascot pose="cheer" size={110} />
        <h1 className="h3" style={{ fontSize: 26 }}>
          Check your email
        </h1>
        <p className="muted">
          We sent a confirmation link to <strong>{sentTo}</strong>. Click it to finish
          creating your account.
        </p>
        <p className="faint small">Can’t find it? Check your spam folder.</p>
      </div>
    );
  }

  return (
    <form className="auth-card" onSubmit={submit}>
      <Mascot pose={isSignup ? 'wave' : 'happy'} size={110} />
      <h1 className="h3" style={{ fontSize: 26 }}>
        {isSignup ? 'Create your profile' : 'Welcome back'}
      </h1>
      <p className="muted small">
        {isSignup
          ? 'Save your climb and pick up on any device.'
          : 'Log in to keep climbing where you left off.'}
      </p>

      <SocialButtons next={next} onError={setError} />

      {isSignup && (
        <label className="field">
          <span>Name</span>
          <input
            className="input"
            value={name}
            onChange={e => setName(e.target.value)}
            autoComplete="given-name"
            required
            maxLength={60}
          />
        </label>
      )}
      <label className="field">
        <span>Email</span>
        <input
          className="input"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
      </label>
      <label className="field">
        <span>Password</span>
        <input
          className="input"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete={isSignup ? 'new-password' : 'current-password'}
          minLength={isSignup ? 8 : undefined}
          required
        />
        {isSignup && <small className="faint">At least 8 characters</small>}
      </label>
      {!isSignup && (
        <Link href="/forgot-password" className="text-link small forgot-link">
          Forgot password?
        </Link>
      )}

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      {isSignup && (
        <p className="faint small">
          By creating an account, you agree to our{' '}
          <Link href="/privacy" className="text-link">
            Privacy policy
          </Link>
          .
        </p>
      )}

      <Captcha key={captchaKey} onToken={setCaptchaToken} />

      <button type="submit" className="btn btn-block" disabled={busy || (captchaEnabled && !captchaToken)}>
        {busy ? 'One moment…' : isSignup ? 'Create account' : 'Log in'}
      </button>

      <p className="small muted">
        {isSignup ? (
          <>
            Already have an account?{' '}
            <Link href={`/login?next=${encodeURIComponent(next)}`} className="text-link">
              Log in
            </Link>
          </>
        ) : (
          <>
            New to kwanqa?{' '}
            <Link href={`/signup?next=${encodeURIComponent(next)}`} className="text-link">
              Create an account
            </Link>
          </>
        )}
      </p>
      <Link href="/" className="faint small text-link">
        ← Back to home
      </Link>
    </form>
  );
}
