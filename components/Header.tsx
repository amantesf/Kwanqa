'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { displayName, useAuth } from '@/components/AuthProvider';
import Logo from '@/components/Logo';
import { useProfile } from '@/lib/profile';

// One simple header for the whole site: the logo on the left and the
// learner's account controls on the right. Page links live in the footer.
// (The learn dashboard at /courses hides this header and uses its own sidebar.)
export default function Header() {
  const pathname = usePathname() || '/';
  const [scrolled, setScrolled] = useState(false);
  const { user, loading, enabled, signOut } = useAuth();
  const profile = useProfile();
  const name = displayName(user);
  const isLanding = pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Landing page: the hero already has Get started, so the header only shows
  // it once the hero's button has scrolled out of view.
  const [pastHero, setPastHero] = useState(false);
  useEffect(() => {
    if (!isLanding) return;
    const target = document.querySelector('[data-hero-cta]');
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => {
      setPastHero(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, [isLanding]);

  const startHref = profile ? `/courses?track=${profile.track}` : '/welcome';
  // "Continue climbing" shortens to "Continue" on small phones.
  const startLabel = profile ? (
    <>
      Continue<span className="label-long"> climbing</span>
    </>
  ) : (
    'Get started'
  );

  let actions = null;
  if (!loading && user) {
    actions = (
      <>
        <Link href="/profile" className="user-chip" title="Your profile">
          <span className="user-avatar">{name.charAt(0).toUpperCase()}</span>
          <span className="user-name">{name}</span>
        </Link>
        {!isLanding && (
          <button type="button" className="btn btn-secondary btn-sm" onClick={signOut}>
            Log out
          </button>
        )}
      </>
    );
  } else if (!loading && isLanding) {
    actions = (
      <Link
        href={startHref}
        className={`btn btn-sm header-cta${pastHero ? ' shown' : ''}`}
        tabIndex={pastHero ? undefined : -1}
        aria-hidden={!pastHero}
      >
        {startLabel}
      </Link>
    );
  } else if (!loading) {
    actions = (
      <>
        {enabled && pathname !== '/login' && (
          <Link href={`/login?next=${encodeURIComponent(pathname)}`} className="btn btn-secondary btn-sm">
            Log in
          </Link>
        )}
        <Link href={startHref} className="btn btn-sm">
          {startLabel}
        </Link>
      </>
    );
  }

  return (
    <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
      <div className="container">
        <Logo />
        <div className="header-account">{actions}</div>
      </div>
    </header>
  );
}
