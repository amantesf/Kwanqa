'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import Mascot from '@/components/Mascot';
import { useAuth } from '@/components/AuthProvider';
import { showToast } from '@/components/Toaster';

const CONTACT = 'kwanqa.team@gmail.com';

// Deleting an account takes two steps: read what will be lost, then type your
// email to confirm. It can't be undone, so the button stays off until then.
export default function DeleteAccount() {
  const { enabled, loading, user, deleteAccount } = useAuth();
  const [typed, setTyped] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const email = user?.email ?? '';
  const confirmed = email !== '' && typed.trim().toLowerCase() === email.toLowerCase();

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!confirmed || busy) return;
    setBusy(true);
    setError('');
    const message = await deleteAccount();
    if (message) {
      setBusy(false);
      return setError(message);
    }
    showToast('Your account has been deleted.');
  }

  if (enabled && loading) {
    return (
      <div className="auth-card">
        <Mascot pose="happy" size={110} />
        <p className="muted">Loading…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="auth-card">
        <Mascot pose="happy" size={110} />
        <h1 className="h3" style={{ fontSize: 26 }}>
          Delete your account
        </h1>
        <p className="muted">
          Log in to the account you want to delete. Can’t log in? Email us at{' '}
          <a href={`mailto:${CONTACT}`}>{CONTACT}</a> from the account’s email address.
        </p>
        <Link href="/login?next=%2Fdelete-account" className="btn btn-block">
          Log in
        </Link>
      </div>
    );
  }

  return (
    <form className="auth-card" onSubmit={submit}>
      <Mascot pose="happy" size={110} />
      <h1 className="h3" style={{ fontSize: 26 }}>
        Delete your account?
      </h1>
      <p className="muted">This permanently deletes:</p>
      <ul className="delete-list">
        <li>Your account and login for {email}</li>
        <li>Your progress, grass, and climb streak</li>
        <li>Your Get started answers and course choices</li>
      </ul>
      <p className="delete-warning">This can’t be undone.</p>
      <label className="field">
        <span>Type your email to confirm</span>
        <input
          className="input"
          type="email"
          value={typed}
          onChange={e => setTyped(e.target.value)}
          placeholder={email}
          autoComplete="off"
          required
        />
      </label>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <button type="submit" className="btn btn-danger btn-block" disabled={!confirmed || busy}>
        {busy ? 'Deleting…' : 'Delete my account'}
      </button>
      <Link href="/profile" className="btn btn-secondary btn-block">
        Keep my account
      </Link>
    </form>
  );
}
