'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Mascot from '@/components/Mascot';

// Where the "Turn off streak reminders" link in each reminder email lands.
// It asks first, so an email scanner opening the link can't unsubscribe anyone.
export default function Unsubscribe() {
  const params = useSearchParams();
  const [state, setState] = useState<'ask' | 'busy' | 'done' | 'error'>('ask');

  async function confirm() {
    setState('busy');
    const response = await fetch('/api/unsubscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ u: params.get('u'), t: params.get('t') }),
    }).catch(() => null);
    setState(response?.ok ? 'done' : 'error');
  }

  if (state === 'done') {
    return (
      <div className="auth-card">
        <Mascot pose="wave" size={110} />
        <h1 className="h3" style={{ fontSize: 26 }}>
          Reminders are off
        </h1>
        <p className="muted">
          You won’t get streak reminder emails any more. You can turn them back on anytime from
          your profile.
        </p>
        <Link href="/courses" className="btn btn-block">
          Keep climbing
        </Link>
      </div>
    );
  }

  return (
    <div className="auth-card">
      <Mascot pose="happy" size={110} />
      <h1 className="h3" style={{ fontSize: 26 }}>
        Turn off streak reminders?
      </h1>
      <p className="muted">
        Walia will stop emailing you when your climb streak is about to end. Your account and
        progress stay the same.
      </p>
      {state === 'error' && (
        <p className="form-error" role="alert">
          That link didn’t work. You can turn reminders off from your profile instead.
        </p>
      )}
      <button type="button" className="btn btn-block" onClick={confirm} disabled={state === 'busy'}>
        {state === 'busy' ? 'One moment…' : 'Turn off reminders'}
      </button>
      <Link href="/" className="faint small text-link">
        ← Back to home
      </Link>
    </div>
  );
}
