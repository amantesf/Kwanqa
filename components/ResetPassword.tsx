'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Mascot from '@/components/Mascot';
import { EyeIcon, FieldIcon } from '@/components/AuthIcons';
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
  const [show, setShow] = useState(false);
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
      <div className="auth-card auth-window">
        <span className="auth-app-icon" aria-hidden="true">
          <Mascot pose="happy" size={44} />
        </span>
        <p className="auth-window-text">Checking your link…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="auth-card auth-window">
        <span className="auth-app-icon" aria-hidden="true">
          <Mascot pose="happy" size={44} />
        </span>
        <h1 className="auth-window-title">That link didn’t work</h1>
        <p className="auth-window-text">It may have expired or already been used. Ask for a new one.</p>
        <Link href="/forgot-password" className="auth-submit auth-submit-link">
          Send a new link
        </Link>
      </div>
    );
  }

  return (
    <form className="auth-card auth-window" onSubmit={submit}>
      <span className="auth-app-icon" aria-hidden="true">
        <Mascot pose="wave" size={44} />
      </span>
      <h1 className="auth-window-title">Choose a new password</h1>
      <p className="auth-window-text">For {user.email}</p>
      <label className="auth-field">
        <FieldIcon name="lock" />
        <input
          className="auth-input"
          type={show ? 'text' : 'password'}
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="new-password"
          placeholder="New password (8 or more characters)"
          aria-label="New password"
          minLength={8}
          required
        />
        <button
          type="button"
          className="auth-eye"
          onClick={() => setShow(s => !s)}
          aria-label={show ? 'Hide passwords' : 'Show passwords'}
          aria-pressed={show}
        >
          <EyeIcon open={show} />
        </button>
      </label>
      <label className="auth-field">
        <FieldIcon name="lock" />
        <input
          className="auth-input"
          type={show ? 'text' : 'password'}
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          autoComplete="new-password"
          placeholder="Type it again"
          aria-label="Confirm new password"
          minLength={8}
          required
        />
      </label>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <button type="submit" className="auth-submit" disabled={busy}>
        {busy ? 'Saving…' : 'Save new password'}
      </button>
    </form>
  );
}
