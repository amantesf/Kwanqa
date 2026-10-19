'use client';

// The left navigation shared by the learn dashboard and the profile page,
// like Duolingo's sidebar: Learn, Phrasebook, Alphabet, and Profile.

import Link from 'next/link';
import { displayName, useAuth } from '@/components/AuthProvider';
import Logo from '@/components/Logo';
import type { Track } from '@/lib/courses';

function TrailIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden>
      <path d="M2 28 L12 10 L18 19 L22 13 L30 28 Z" fill="var(--primary)" />
      <path d="M12 10 L15 15.5 L13 14.6 L10.6 16.4 Z" fill="#fff" />
      <circle cx="25" cy="7" r="3.4" fill="var(--gold)" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden>
      <rect x="5" y="4" width="22" height="25" rx="4" fill="var(--blue)" />
      <rect x="9" y="4" width="18" height="21" rx="3" fill="#5b8ce6" />
      <rect x="13" y="10" width="10" height="3" rx="1.5" fill="#fff" />
      <rect x="13" y="16" width="7" height="3" rx="1.5" fill="#fff" />
    </svg>
  );
}

function AlphabetIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden>
      <rect x="3" y="3" width="26" height="26" rx="7" fill="var(--gold)" />
      <text x="16" y="23" textAnchor="middle" fontSize="18" fontWeight="700" fill="#fff">
        ፊ
      </text>
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden>
      <rect x="4" y="6" width="24" height="23" rx="5" fill="var(--green-dark)" />
      <rect x="4" y="12" width="24" height="17" rx="0" fill="var(--green)" />
      <rect x="4" y="24" width="24" height="5" rx="5" fill="var(--green)" />
      <rect x="9.5" y="3" width="3.4" height="7" rx="1.7" fill="#2f7a20" />
      <rect x="19.1" y="3" width="3.4" height="7" rx="1.7" fill="#2f7a20" />
      <text x="16" y="25.5" textAnchor="middle" fontSize="12" fontWeight="800" fill="#fff">
        ፲
      </text>
    </svg>
  );
}

function ProfileIcon({ initial }: { initial: string | null }) {
  return (
    <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden>
      <circle cx="16" cy="16" r="14" fill="var(--purple)" />
      {initial ? (
        <text x="16" y="21.5" textAnchor="middle" fontSize="15" fontWeight="800" fill="#fff">
          {initial}
        </text>
      ) : (
        <>
          <circle cx="16" cy="12.5" r="5" fill="#fff" />
          <path d="M7.5 25 C 9 19.5, 23 19.5, 24.5 25 Z" fill="#fff" />
        </>
      )}
    </svg>
  );
}

export type SidebarPage = 'learn' | 'phrasebook' | 'alphabet' | 'profile';

export default function LearnSidebar({ active, track }: { active: SidebarPage; track: Track }) {
  const { user, signOut } = useAuth();
  const initial = user ? displayName(user).charAt(0).toUpperCase() : null;
  const current = (page: SidebarPage) => (active === page ? ('page' as const) : undefined);

  return (
    <aside className="learn-sidebar">
      <div className="learn-logo">
        <Logo />
      </div>
      <nav className="learn-nav" aria-label="Learn">
        <Link href={`/courses?track=${track}`} className="learn-nav-link" aria-current={current('learn')}>
          <TrailIcon />
          <span>Learn</span>
        </Link>
        <Link href={`/phrasebook?track=${track}`} className="learn-nav-link" aria-current={current('phrasebook')}>
          <BookIcon />
          <span>Phrasebook</span>
        </Link>
        <Link href="/fidel" className="learn-nav-link" aria-current={current('alphabet')}>
          <AlphabetIcon />
          <span>Alphabet</span>
        </Link>
        <Link href="/holidays" className="learn-nav-link">
          <CalendarIcon />
          <span>Holidays</span>
        </Link>
        <Link href="/profile" className="learn-nav-link" aria-current={current('profile')}>
          <ProfileIcon initial={initial} />
          <span>Profile</span>
        </Link>
      </nav>
      {user && (
        <div className="learn-account">
          <button type="button" className="learn-logout" onClick={signOut} aria-label="Log out" title="Log out">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" />
              <path d="M10 17l-5-5 5-5" />
              <path d="M5 12h11" />
            </svg>
          </button>
        </div>
      )}
    </aside>
  );
}
