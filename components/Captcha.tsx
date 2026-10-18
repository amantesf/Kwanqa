'use client';

import { useEffect, useRef } from 'react';

// Cloudflare Turnstile: a quick "are you human?" check on the account forms, so
// bots can't mass-create accounts or send reset emails. Most people never see a
// puzzle. Supabase verifies the token it produces.

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

export const captchaEnabled = Boolean(SITE_KEY);

type Turnstile = {
  render: (el: HTMLElement, options: Record<string, unknown>) => string;
  remove: (id: string) => void;
};

declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

function loadScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
    const script = existing ?? document.createElement('script');
    script.addEventListener('load', () => resolve());
    script.addEventListener('error', () => reject(new Error('Turnstile failed to load')));
    if (!existing) {
      script.src = SCRIPT_SRC;
      script.async = true;
      document.head.appendChild(script);
    }
  });
}

/**
 * Calls onToken with a fresh token, or with '' when it expires or fails.
 * Tokens work once: remount it (change its `key`) after each attempt.
 */
export default function Captcha({ onToken }: { onToken: (token: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const callback = useRef(onToken);

  useEffect(() => {
    callback.current = onToken;
  });

  useEffect(() => {
    let id: string | undefined;
    let cancelled = false;
    loadScript()
      .then(() => {
        if (cancelled || !ref.current || !window.turnstile) return;
        id = window.turnstile.render(ref.current, {
          sitekey: SITE_KEY,
          theme: 'light',
          size: 'flexible',
          callback: (token: string) => callback.current(token),
          'expired-callback': () => callback.current(''),
          'error-callback': () => callback.current(''),
        });
      })
      .catch(() => callback.current(''));
    return () => {
      cancelled = true;
      if (id) window.turnstile?.remove(id);
    };
  }, []);

  if (!captchaEnabled) return null;
  return <div ref={ref} className="captcha" />;
}
