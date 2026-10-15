'use client';

import { useEffect, useState } from 'react';
import type { Provider } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

// Providers we offer, in display order. A button only shows once that
// provider is switched on in Supabase (Authentication > Sign In / Providers).
const PROVIDERS: { id: Provider; label: string; icon: React.ReactNode }[] = [
  {
    id: 'google',
    label: 'Google',
    icon: (
      <svg viewBox="0 0 48 48" width="20" height="20" aria-hidden>
        <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
        <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
        <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
        <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
      </svg>
    ),
  },
  {
    id: 'apple',
    label: 'Apple',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden>
        <path d="M16.37 1.43c0 1.14-.42 2.2-1.25 3.04-.9.93-1.97 1.47-3.13 1.38-.15-1.1.4-2.26 1.18-3.07.86-.9 2.31-1.57 3.2-1.35zM20.5 17.1c-.55 1.27-.82 1.84-1.53 2.96-1 1.56-2.4 3.5-4.14 3.52-1.55.01-1.95-1.01-4.05-1-2.1.01-2.54 1.02-4.09 1.01-1.74-.02-3.07-1.77-4.07-3.33C-.19 15.94-.48 10.8 1.42 7.98c1.34-2 3.46-3.17 5.45-3.17 2.03 0 3.3 1.11 4.98 1.11 1.62 0 2.61-1.11 4.95-1.11 1.77 0 3.65.96 4.98 2.63-4.38 2.4-3.67 8.65.72 9.66z" />
      </svg>
    ),
  },
  {
    id: 'facebook',
    label: 'Facebook',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
        <circle cx="12" cy="12" r="12" fill="#1877F2" />
        <path fill="#fff" d="M15.1 15.5l.5-3.3h-3.1v-2.1c0-.9.4-1.8 1.9-1.8h1.4V5.5s-1.3-.2-2.5-.2c-2.6 0-4.2 1.5-4.2 4.3v2.6H6.3v3.3h2.8V24a11 11 0 0 0 3.4 0v-8.5z" />
      </svg>
    ),
  },
];

async function enabledProviders(): Promise<Set<string>> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return new Set();
  try {
    const res = await fetch(`${url}/auth/v1/settings`, { headers: { apikey: key } });
    const settings = await res.json();
    return new Set(Object.entries(settings.external ?? {}).filter(([, on]) => on).map(([id]) => id));
  } catch {
    return new Set();
  }
}

export default function SocialButtons({ onError }: { onError: (message: string) => void }) {
  const [enabled, setEnabled] = useState<Set<string>>(new Set());

  useEffect(() => {
    enabledProviders().then(setEnabled);
  }, []);

  const available = PROVIDERS.filter(p => enabled.has(p.id));
  if (!supabase || available.length === 0) return null;

  async function signIn(provider: Provider) {
    const { error } = await supabase!.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) onError('Couldn’t reach that sign-in service. Please try again.');
  }

  return (
    <div className="social-block">
      {available.map(p => (
        <button
          key={p.id}
          type="button"
          className="btn btn-secondary btn-block social-btn"
          onClick={() => signIn(p.id)}
        >
          {p.icon}
          Continue with {p.label}
        </button>
      ))}
      <div className="divider">
        <span>or use email</span>
      </div>
    </div>
  );
}
