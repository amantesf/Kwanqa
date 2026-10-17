'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Mascot from '@/components/Mascot';
import { useAuth } from '@/components/AuthProvider';
import { showToast } from '@/components/Toaster';
import { supabase } from '@/lib/supabase';

// Step 2 of a password reset: the emailed link signs the learner in for this
// one purpose (Supabase reads it from the URL), then they choose a new password.
export default function ResetPassword() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!supabase || busy) return;
    if (password !== confirm) return setError('Those passwords don’t match.');
    setBusy(true);
    setError('');
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) {
      const m = error.message.toLowerCase();
      return setError(
        m.includes('different from the old')
          ? 'Please choose a password you haven’t used before.'
          : m.includes('password')
            ? error.message
            : 'Couldn’t update your password. Please request a new link.',
      );
    }
    showToast('Password updated!');
    router.push('/courses');
  }

  if (loading) {
    return (
      <div className="auth-card">
        <Mascot pose="happy" size={110} />
        <p className="muted">Checking your link…</p>
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
        <p className="muted">It may have expired or already been used. Request a new one.</p>
        <Link href="/forgot-password" className="btn btn-block">
          Send a new link
        </Link>
      </div>
    );
  }

  return (
    <form className="auth-card" onSubmit={submit}>
      <Mascot pose="wave" size={110} />
      <h1 className="h3" style={{ fontSize: 26 }}>
        Choose a new password
      </h1>
      <p className="muted small">For {user.email}</p>
      <label className="field">
        <span>New password</span>
        <input
          className="input"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="new-password"
          minLength={8}
          required
        />
        <small className="faint">At least 8 characters</small>
      </label>
      <label className="field">
        <span>Confirm new password</span>
        <input
          className="input"
          type="password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          autoComplete="new-password"
          minLength={8}
          required
        />
      </label>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <button type="submit" className="btn btn-block" disabled={busy}>
        {busy ? 'Saving…' : 'Save new password'}
      </button>
    </form>
  );
}
