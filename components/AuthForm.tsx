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
  if (m.includes('email not confirmed')) return 'Please confirm your email first. Check your inbox for the link.';
  if (m.includes('already registered')) return 'There’s already an account with that email. Try logging in.';
  if (m.includes('captcha')) return 'The “are you human?” check didn’t go through. Please try again.';
  if (m.includes('rate limit')) return 'Too many tries for now. Please wait a few minutes and try again.';
  if (m.includes('password')) return message;
  return 'Something went wrong. Please try again.';
}

// Small icons inside the log-in fields.
const FIELD_ICONS = {
  person: 'M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm0 2c-4.4 0-8 2.2-8 5v1.5h16V19c0-2.8-3.6-5-8-5Z',
  mail: 'M3 5.5h18v13H3v-13Zm2 2.3v.2l7 4.6 7-4.6v-.2H5Z',
  lock: 'M7 10V8a5 5 0 0 1 10 0v2h1.5v11h-13V10H7Zm2 0h6V8a3 3 0 0 0-6 0v2Z',
};

function FieldIcon({ name }: { name: keyof typeof FIELD_ICONS }) {
  return (
    <svg className="auth-field-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path d={FIELD_ICONS[name]} fill="currentColor" />
    </svg>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
      {!open && <path d="M4 20 20 4" />}
    </svg>
  );
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
