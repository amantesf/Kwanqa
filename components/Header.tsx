'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { displayName, useAuth } from '@/components/AuthProvider';
import Logo from '@/components/Logo';

const NAV_LINKS = [
  { href: '/courses', label: 'Courses' },
  { href: '/approach', label: 'Approach' },
  { href: '/about', label: 'About' },
];

function isActive(href: string, pathname: string) {
  return pathname === href || pathname.startsWith(href + '/');
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden>
      {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
    </svg>
  );
}

export default function Header() {
  const pathname = usePathname() || '/';
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);
  const { user, loading, enabled, signOut } = useAuth();
  const name = displayName(user);

  // Signed out: log in / get started. Signed in: who you are, and log out.
  const authActions = loading ? null : user ? (
    <>
      <Link href="/profile" className="user-chip" onClick={closeMenu} title="Your profile">
        <span className="user-avatar">{name.charAt(0).toUpperCase()}</span>
        <span className="user-name">{name}</span>
      </Link>
      <button
        type="button"
        className="btn btn-secondary btn-sm"
        onClick={() => {
          closeMenu();
          signOut();
        }}
      >
        Log out
      </button>
    </>
  ) : (
    <>
      {enabled && (
        <Link href="/login" className="btn btn-secondary btn-sm" onClick={closeMenu}>
          Log in
        </Link>
      )}
      <Link href="/welcome" className="btn btn-sm" onClick={closeMenu}>
        Get started
      </Link>
    </>
  );

  // The landing page keeps the header to just the logo: its links and buttons
  // are already in the hero and the footer. Logged-in learners keep their avatar.
  if (pathname === '/') {
    return (
      <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
        <div className="container">
          <Logo />
          {!loading && user && (
            <Link href="/profile" className="user-chip landing-chip" title="Your profile">
              <span className="user-avatar">{name.charAt(0).toUpperCase()}</span>
              <span className="user-name">{name}</span>
            </Link>
          )}
        </div>
      </header>
    );
  }

  return (
    <header className={`site-header${scrolled || menuOpen ? ' scrolled' : ''}`}>
      <div className="container">
        <Logo onClick={closeMenu} />

        <nav className="nav" aria-label="Main">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link${isActive(link.href, pathname) ? ' active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <div className="auth-actions">{authActions}</div>
          <button
            type="button"
            className="icon-button"
            onClick={() => setMenuOpen(open => !open)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <MenuIcon open={menuOpen} />
          </button>
        </div>
      </div>

      <div id="mobile-menu" className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        <nav aria-label="Mobile">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link${isActive(link.href, pathname) ? ' active' : ''}`}
              onClick={closeMenu}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mobile-auth">{authActions}</div>
      </div>
    </header>
  );
}
