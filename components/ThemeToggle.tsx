'use client';

import { setTheme, useTheme } from '@/lib/theme';

const SUN = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
    <circle cx="12" cy="12" r="4.2" fill="currentColor" stroke="none" />
    <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6" />
  </svg>
);

const MOON = (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
    <path d="M20 14.6A8.5 8.5 0 0 1 9.4 4a8.5 8.5 0 1 0 10.6 10.6Z" fill="currentColor" />
  </svg>
);

/** The sun/moon button at the bottom of the sidebar. */
export function ThemeButton() {
  const dark = useTheme() === 'dark';
  const label = dark ? 'Light mode' : 'Dark mode';
  return (
    <button
      type="button"
      className="learn-logout learn-theme"
      onClick={() => setTheme(dark ? 'light' : 'dark')}
      aria-label={`Switch to ${label.toLowerCase()}`}
      title={label}
    >
      {dark ? SUN : MOON}
      <span className="learn-logout-text">{label}</span>
    </button>
  );
}

/** The Dark mode switch in the profile page's settings. */
export default function ThemeToggle() {
  const dark = useTheme() === 'dark';
  return (
    <label className="toggle reminder-toggle">
      <input type="checkbox" checked={dark} onChange={e => setTheme(e.target.checked ? 'dark' : 'light')} />
      <span>
        <strong>Dark mode</strong>
        <span className="faint small">Easier on your eyes at night. Saved on this device.</span>
      </span>
    </label>
  );
}
