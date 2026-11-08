'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Captcha, { captchaEnabled } from '@/components/Captcha';
import Mascot from '@/components/Mascot';
import SocialButtons from '@/components/SocialButtons';
import { EyeIcon, FieldIcon } from '@/components/AuthIcons';
import { safeNext, useAuth } from '@/components/AuthProvider';
import { readProfile } from '@/lib/profile';
import { supabase } from '@/lib/supabase';

type Mode = 'signup' | 'login';

// Turns Supabase's error messages into friendlier ones.
function friendly(message: string) {
  const m = message.toLowerCase();
  if (m.includes('invalid login credentials')) return 'That email and password don’t match. Try again?';
  if (m.includes('email not confirmed')) return 'Please confirm your email first. Check your inbox for the link.';
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
  const [showPassword, setShowPassword] = useState(false);

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
          You can still climb the whole trail. Your progress is saved in this browser.
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
      <div className="auth-card auth-window">
        <span className="auth-app-icon" aria-hidden="true">
          <Mascot pose="cheer" size={44} />
        </span>
        <h1 className="auth-window-title">Check your email</h1>
        <p className="auth-window-text">
          We sent a link to <strong>{sentTo}</strong>. Open it to finish creating your account.
        </p>
        <p className="auth-window-text faint">Can’t find it? Look in your spam folder.</p>
      </div>
    );
  }

  return (
    <form className="auth-card auth-window" onSubmit={submit}>
      <span className="auth-app-icon" aria-hidden="true">
        <Mascot pose={isSignup ? 'wave' : 'happy'} size={44} />
      </span>
      <h1 className="auth-window-title">{isSignup ? 'Create your kwanqa account' : 'Log in to kwanqa'}</h1>

      {isSignup && (
        <label className="auth-field">
          <FieldIcon name="person" />
          <input
            className="auth-input"
            value={name}
            onChange={e => setName(e.target.value)}
            autoComplete="given-name"
            placeholder="Name"
            aria-label="Name"
            required
            maxLength={60}
          />
        </label>
      )}
      <label className="auth-field">
        <FieldIcon name="mail" />
        <input
          className="auth-input"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          autoComplete="email"
          placeholder="Email"
          aria-label="Email"
          required
        />
      </label>
      <label className="auth-field">
        <FieldIcon name="lock" />
        <input
          className="auth-input"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete={isSignup ? 'new-password' : 'current-password'}
          placeholder={isSignup ? 'Password (8 or more characters)' : 'Password'}
          aria-label="Password"
          minLength={isSignup ? 8 : undefined}
          required
        />
        <button
          type="button"
          className="auth-eye"
          onClick={() => setShowPassword(s => !s)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          aria-pressed={showPassword}
        >
          <EyeIcon open={showPassword} />
        </button>
      </label>
      {!isSignup && (
        <Link href="/forgot-password" className="auth-forgot">
          Forgot password?
        </Link>
      )}

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <Captcha key={captchaKey} onToken={setCaptchaToken} />

      <button type="submit" className="auth-submit" disabled={busy || (captchaEnabled && !captchaToken)}>
        {busy ? 'One moment…' : isSignup ? 'Create account' : 'Log in'}
      </button>

      <SocialButtons next={next} onError={setError} row={isSignup ? 'Or sign up with' : 'Or log in with'} />

      {isSignup && (
        <p className="auth-window-fine">
          By creating an account, you agree to our{' '}
          <Link href="/privacy" className="text-link">
            Privacy policy
          </Link>
          .
        </p>
      )}

      <p className="auth-window-switch">
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
    </form>
  );
}
