import { useSyncExternalStore } from 'react';
import { THEME_KEY } from '@/lib/themeScript';

// Light or dark mode, chosen with the switch on the profile page or the
// sun/moon button in the sidebar. It's remembered on this device and applied
// as <html data-theme="dark"> before the page first paints (lib/themeScript.ts),
// so there's no white flash when dark mode is on.

export type Theme = 'light' | 'dark';

const KEY = THEME_KEY;
const listeners = new Set<() => void>();

export function readTheme(): Theme {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

export function setTheme(theme: Theme) {
  const html = document.documentElement;
  if (theme === 'dark') html.setAttribute('data-theme', 'dark');
  else html.removeAttribute('data-theme');
  try {
    if (theme === 'dark') window.localStorage.setItem(KEY, 'dark');
    else window.localStorage.removeItem(KEY);
  } catch {
    // storage blocked: it still switches for this visit
  }
  listeners.forEach(fn => fn());
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  // another tab switched it
  const onStorage = (e: StorageEvent) => {
    if (e.key !== KEY) return;
    const theme: Theme = e.newValue === 'dark' ? 'dark' : 'light';
    if (theme !== readTheme()) setTheme(theme);
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener('storage', onStorage);
  };
}

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, readTheme, () => 'light');
}
