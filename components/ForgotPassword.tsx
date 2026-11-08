'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import Captcha, { captchaEnabled } from '@/components/Captcha';
import Mascot from '@/components/Mascot';
import { FieldIcon } from '@/components/AuthIcons';
import { supabase } from '@/lib/supabase';

// Step 1 of a password reset: email the learner a link to /reset-password.
// The reply never says whether an account exists, so the form can't be used
// to find out who has a kwanqa account.
export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [captchaKey, setCaptchaKey] = useState(0);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!supabase || busy) return;
    setBusy(true);
    setError('');
    const token = captchaToken || undefined;
    setCaptchaToken(''); // each token works once
    setCaptchaKey(k => k + 1);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
      captchaToken: token,
    });
    setBusy(false);
    if (error && error.message.toLowerCase().includes('rate limit')) {
      return setError('Too many tries for now. Please wait a few minutes and try again.');
    }
    if (error && error.message.toLowerCase().includes('captcha')) {
      return setError('The “are you human?” check didn’t go through. Please try again.');
    }
    setSent(true); // same message whether or not the email has an account
  }

  if (sent) {
    return (
      <div className="auth-card auth-window">
        <span className="auth-app-icon" aria-hidden="true">
          <Mascot pose="cheer" size={44} />
        </span>
        <h1 className="auth-window-title">Check your email</h1>
        <p className="auth-window-text">
          If an account exists for <strong>{email}</strong>, we’ve sent a link to choose a new password. It expires in
          about an hour.
        </p>
        <p className="auth-window-fine">Can’t find it? Look in your spam folder.</p>
        <Link href="/login" className="auth-window-switch text-link">
          Back to log in
        </Link>
      </div>
    );
  }

  return (
    <form className="auth-card auth-window" onSubmit={submit}>
      <span className="auth-app-icon" aria-hidden="true">
        <Mascot pose="happy" size={44} />
      </span>
      <h1 className="auth-window-title">Reset your password</h1>
      <p className="auth-window-text">We’ll email you a link to choose a new one.</p>
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
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <Captcha key={captchaKey} onToken={setCaptchaToken} />
      <button type="submit" className="auth-submit" disabled={busy || (captchaEnabled && !captchaToken)}>
        {busy ? 'One moment…' : 'Send reset link'}
      </button>
      <p className="auth-window-switch">
        Remembered it?{' '}
        <Link href="/login" className="text-link">
          Log in
        </Link>
      </p>
    </form>
  );
}
