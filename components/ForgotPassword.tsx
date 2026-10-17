'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import Mascot from '@/components/Mascot';
import { supabase } from '@/lib/supabase';

// Step 1 of a password reset: email the learner a link to /reset-password.
// The reply never says whether an account exists, so the form can't be used
// to find out who has a kwanqa account.
export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!supabase || busy) return;
    setBusy(true);
    setError('');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (error && error.message.toLowerCase().includes('rate limit')) {
      return setError('Too many tries for now. Please wait a few minutes and try again.');
    }
    setSent(true); // same message whether or not the email has an account
  }

  if (sent) {
    return (
      <div className="auth-card">
        <Mascot pose="cheer" size={110} />
        <h1 className="h3" style={{ fontSize: 26 }}>
          Check your email
        </h1>
        <p className="muted">
          If an account exists for <strong>{email}</strong>, we’ve sent a link to choose a new
          password. It expires in about an hour.
        </p>
        <p className="faint small">Can’t find it? Check your spam folder.</p>
        <Link href="/login" className="text-link small">
          ← Back to log in
        </Link>
      </div>
    );
  }

  return (
    <form className="auth-card" onSubmit={submit}>
      <Mascot pose="happy" size={110} />
      <h1 className="h3" style={{ fontSize: 26 }}>
        Forgot your password?
      </h1>
      <p className="muted small">Enter your email and we’ll send you a link to choose a new one.</p>
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
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <button type="submit" className="btn btn-block" disabled={busy}>
        {busy ? 'One moment…' : 'Send reset link'}
      </button>
      <Link href="/login" className="text-link small">
        ← Back to log in
      </Link>
    </form>
  );
}
