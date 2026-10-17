'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// "Sign in with Google" using Google's own button (Google Identity Services).
// The sign-in happens on kwanqa.com, so Google's popup names kwanqa instead of
// the Supabase address; the Google ID token is then handed to Supabase.

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const SCRIPT_SRC = 'https://accounts.google.com/gsi/client';

export const googleButtonEnabled = Boolean(CLIENT_ID);

type GoogleId = {
  initialize: (options: Record<string, unknown>) => void;
  renderButton: (el: HTMLElement, options: Record<string, unknown>) => void;
};

declare global {
  interface Window {
    google?: { accounts: { id: GoogleId } };
  }
}

function loadScript(): Promise<void> {
  if (window.google?.accounts?.id) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
    const script = existing ?? document.createElement('script');
    script.addEventListener('load', () => resolve());
    script.addEventListener('error', () => reject(new Error('Google script failed to load')));
    if (!existing) {
      script.src = SCRIPT_SRC;
      script.async = true;
      document.head.appendChild(script);
    }
  });
}

/** A one-time value that ties Google's token to this sign-in, so it can't be replayed. */
async function makeNonce() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  const raw = btoa(String.fromCharCode(...bytes)).replace(/[^a-zA-Z0-9]/g, '');
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw));
  const hashed = Array.from(new Uint8Array(digest))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  return { raw, hashed }; // Google gets the hash; Supabase checks it against the raw value
}

export default function GoogleButton({
  next,
  onError,
}: {
  next: string;
  onError: (message: string) => void;
}) {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await loadScript();
        const { raw, hashed } = await makeNonce();
        const el = ref.current;
        if (cancelled || !el || !window.google || !supabase) return;
        window.google.accounts.id.initialize({
          client_id: CLIENT_ID,
          nonce: hashed,
          use_fedcm_for_prompt: true,
          callback: async ({ credential }: { credential: string }) => {
            const { error } = await supabase!.auth.signInWithIdToken({ provider: 'google', token: credential, nonce: raw });
            if (error) return onError('Google sign-in didn’t work. Please try again.');
            router.push(next);
          },
        });
        window.google.accounts.id.renderButton(el, {
          theme: 'outline',
          size: 'large',
          shape: 'pill',
          text: 'continue_with',
          logo_alignment: 'center',
          width: Math.min(Math.round(el.getBoundingClientRect().width) || 360, 400),
        });
      } catch {
        if (!cancelled) onError('Couldn’t load Google sign-in. Check your connection and try again.');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [next, onError, router]);

  return <div ref={ref} className="google-button" />;
}
