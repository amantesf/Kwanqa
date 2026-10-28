'use client';

// The left navigation shared by the learn dashboard and the profile page,
// like Duolingo's sidebar. Each page has its own colour: a little app-style
// tile with a white symbol, the English name and its Amharic name underneath.

import type { CSSProperties, ReactNode } from 'react';
import Link from 'next/link';
import { displayName, useAuth } from '@/components/AuthProvider';
import Logo from '@/components/Logo';
import type { Track } from '@/lib/courses';

const glyph = { width: 26, height: 26, viewBox: '0 0 24 24', 'aria-hidden': true } as const;

const ICONS: Record<string, ReactNode> = {
  // a mountain with the sun behind it
  learn: (
    <svg {...glyph}>
      <circle cx="17.5" cy="6.5" r="2.6" fill="#ffd66b" />
      <path d="M2 20 L9.5 7.5 L13.5 13.5 L16 10 L22 20 Z" fill="#fff" />
    </svg>
  ),
  // an open book
  phrasebook: (
    <svg {...glyph}>
      <path d="M12 6.5 C 9.5 4.8, 6 4.6, 3 5.4 V19 C 6 18.2, 9.5 18.4, 12 20 Z" fill="#fff" />
      <path d="M12 6.5 C 14.5 4.8, 18 4.6, 21 5.4 V19 C 18 18.2, 14.5 18.4, 12 20 Z" fill="#fff" opacity="0.8" />
    </svg>
  ),
  // the first letter of ፊደል
  alphabet: (
    <svg {...glyph}>
      <text x="12" y="19" textAnchor="middle" fontSize="19" fontWeight="800" fill="#fff">
        ፊ
      </text>
    </svg>
  ),
  // a speech bubble with sound
  talk: (
    <svg {...glyph}>
      <path d="M4 4.5 h16 a2 2 0 0 1 2 2 v9 a2 2 0 0 1 -2 2 h-9 l-5 4 v-4 h-2 a2 2 0 0 1 -2 -2 v-9 a2 2 0 0 1 2 -2 z" fill="#fff" />
      <path d="M8 11 v-1 M11 13 v-5 M14 12 v-3 M17 11 v-1" stroke="var(--c)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  // quotation marks
  proverbs: (
    <svg {...glyph}>
      <path d="M4 17 c0-5 1.5-8.5 6-10 l0.8 2 c-2.4 1-3.4 2.6-3.5 4.5 h2.7 v3.5 z M13.5 17 c0-5 1.5-8.5 6-10 l0.8 2 c-2.4 1-3.4 2.6-3.5 4.5 h2.7 v3.5 z" fill="#fff" />
    </svg>
  ),
  // a passport book with a round stamp
  passport: (
    <svg {...glyph}>
      <rect x="5" y="3" width="14" height="18" rx="2.5" fill="#fff" />
      <circle cx="12" cy="11" r="3.6" fill="none" stroke="var(--c)" strokeWidth="1.8" />
      <path d="M8.5 17 h7" stroke="var(--c)" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  // a calendar page with ፲
  holidays: (
    <svg {...glyph}>
      <rect x="3" y="5" width="18" height="16" rx="3" fill="#fff" />
      <rect x="3" y="5" width="18" height="5" rx="2" fill="#fff" opacity="0.7" />
      <path d="M8 3 v4 M16 3 v4" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
      <text x="12" y="19" textAnchor="middle" fontSize="8.5" fontWeight="900" fill="var(--c)">
        ፲
      </text>
    </svg>
  ),
};

// The English alphabet's tile, for English learners.
const ABC_ICON = (
  <svg {...glyph}>
    <text x="12" y="18.5" textAnchor="middle" fontSize="17" fontWeight="900" fill="#fff">
      A
    </text>
  </svg>
);

type Item = {
  key: SidebarPage | 'talk' | 'proverbs' | 'holidays';
  href: string;
  label: string;
  amharic: string;
  color: string;
  soft: string;
  edge: string;
};

export type SidebarPage = 'learn' | 'phrasebook' | 'alphabet' | 'passport' | 'profile';

function NavLink({ item, current, icon }: { item: Item; current?: boolean; icon: ReactNode }) {
  const style = { '--c': item.color, '--c-soft': item.soft, '--c-edge': item.edge } as CSSProperties;
  return (
    <Link href={item.href} className="learn-nav-link" style={style} aria-current={current ? 'page' : undefined} title={item.label}>
      <span className="learn-nav-tile">{icon}</span>
      <span className="learn-nav-text">
        <span className="learn-nav-label">{item.label}</span>
        <span className="learn-nav-am" lang="am">
          {item.amharic}
        </span>
      </span>
    </Link>
  );
}

export default function LearnSidebar({ active, track }: { active: SidebarPage; track: Track }) {
  const { user, signOut } = useAuth();
  const initial = user ? displayName(user).charAt(0).toUpperCase() : null;

  const learn: Item[] = [
    { key: 'learn', href: `/courses?track=${track}`, label: 'Learn', amharic: 'ትምህርት', color: 'var(--primary)', soft: 'var(--primary-soft)', edge: 'var(--primary-shadow)' },
    { key: 'phrasebook', href: `/phrasebook?track=${track}`, label: 'Phrasebook', amharic: 'ሐረጎች', color: 'var(--blue)', soft: 'var(--blue-soft)', edge: 'var(--blue-shadow)' },
    // English learners already read ፊደል, so their alphabet is the English ABC.
    track === 'english'
      ? { key: 'alphabet', href: '/abc', label: 'Alphabet', amharic: 'ABC', color: 'var(--gold)', soft: 'var(--gold-soft)', edge: 'var(--gold-shadow)' }
      : { key: 'alphabet', href: '/fidel', label: 'Alphabet', amharic: 'ፊደል', color: 'var(--gold)', soft: 'var(--gold-soft)', edge: 'var(--gold-shadow)' },
    { key: 'talk', href: '/talk', label: 'Talk', amharic: 'ጨዋታ', color: 'var(--green)', soft: 'var(--green-soft)', edge: 'var(--green-dark)' },
  ];
  const culture: Item[] = [
    { key: 'proverbs', href: '/proverbs', label: 'Proverbs', amharic: 'ምሳሌዎች', color: '#e8345a', soft: '#fde8ed', edge: '#b8203f' },
    { key: 'holidays', href: '/holidays', label: 'Holidays', amharic: 'በዓላት', color: '#13a39b', soft: '#e1f6f4', edge: '#0c7a74' },
  ];
  const passport: Item = {
    key: 'passport',
    href: `/passport?track=${track}`,
    label: 'Passport',
    amharic: 'ፓስፖርት',
    color: '#0f6b4f',
    soft: '#e2f3ec',
    edge: '#0a4d39',
  };
  const profile: Item = {
    key: 'profile',
    href: '/profile',
    label: 'Profile',
    amharic: 'መገለጫ',
    color: 'var(--purple)',
    soft: 'var(--purple-soft)',
    edge: 'var(--purple-shadow)',
  };
  const profileIcon = initial ? (
    <span className="learn-nav-initial">{initial}</span>
  ) : (
    <svg {...glyph}>
      <circle cx="12" cy="8.5" r="4" fill="#fff" />
      <path d="M4.5 20.5 C 5.5 15, 18.5 15, 19.5 20.5 Z" fill="#fff" />
    </svg>
  );

  return (
    <aside className="learn-sidebar">
      <div className="learn-logo">
        <Logo />
      </div>
      <nav className="learn-nav" aria-label="Learn">
        <span className="learn-nav-heading">Learn</span>
        {learn.map(item => (
          <NavLink
            key={item.key}
            item={item}
            icon={item.key === 'alphabet' && track === 'english' ? ABC_ICON : ICONS[item.key]}
            current={active === item.key}
          />
        ))}
        <span className="learn-nav-heading">Culture</span>
        {culture.map(item => (
          <NavLink key={item.key} item={item} icon={ICONS[item.key]} />
        ))}
        <span className="learn-nav-heading">You</span>
        <NavLink item={passport} icon={ICONS.passport} current={active === 'passport'} />
        <NavLink item={profile} icon={profileIcon} current={active === 'profile'} />
      </nav>
      {user && (
        <div className="learn-account">
          <button type="button" className="learn-logout" onClick={signOut} aria-label="Log out" title="Log out">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" />
              <path d="M10 17l-5-5 5-5" />
              <path d="M5 12h11" />
            </svg>
            <span className="learn-logout-text">Log out</span>
          </button>
        </div>
      )}
    </aside>
  );
}
