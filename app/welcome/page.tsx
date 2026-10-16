import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Flag from '@/components/Flag';
import GrassIcon from '@/components/GrassIcon';
import Logo from '@/components/Logo';
import WelcomeActions from '@/components/WelcomeActions';

export const metadata: Metadata = { title: 'Welcome' };

// The first screen a visitor sees before signing up or logging in:
// Walia and friends on the left, the pitch and two buttons on the right.
export default function WelcomePage() {
  return (
    <main className="welcome-page">
      <header className="welcome-top">
        <Logo />
      </header>

      <section className="welcome-hero">
        <div className="welcome-art" aria-hidden>
          <div className="welcome-blob" />

          <span className="wf wf-bubble wf-selam">
            ሰላም!
            <small>selam</small>
          </span>
          <span className="wf wf-bubble wf-hello">Hello!</span>
          <span className="wf wf-bubble wf-endet">
            እንዴት ነህ?
            <small>how are you?</small>
          </span>

          <span className="wf wf-letter wf-ha">ሀ</span>
          <span className="wf wf-letter wf-le">ለ</span>
          <span className="wf wf-letter wf-me">መ</span>

          <span className="wf wf-buna">
            <svg viewBox="0 0 48 48" width="56" height="56">
              <path d="M17 6c-2 3 2 5 0 8M24 4c-2 3 2 5 0 8M31 6c-2 3 2 5 0 8" stroke="#c9a27a" strokeWidth="2.6" strokeLinecap="round" fill="none" />
              <path d="M9 19h30v6a15 15 0 0 1-30 0z" fill="#d2582e" />
              <path d="M39 22h3a5 5 0 0 1 0 10h-4" stroke="#d2582e" strokeWidth="3.4" fill="none" />
              <rect x="10" y="19" width="28" height="4" rx="2" fill="#6b3216" />
              <ellipse cx="24" cy="44" rx="17" ry="3" fill="#e5d3c2" />
            </svg>
          </span>
          <span className="wf wf-grass">
            <GrassIcon size={54} />
          </span>
          <span className="wf wf-star">★</span>

          <div className="welcome-walia">
            <Image
              src="/brand/walia.png"
              alt=""
              width={435}
              height={581}
              priority
              sizes="(max-width: 860px) 60vw, 300px"
            />
          </div>
        </div>

        <div className="welcome-copy">
          <h1>The fun, free way to learn Amharic and English!</h1>
          <WelcomeActions />
        </div>
      </section>

      <nav className="welcome-langs" aria-label="Courses">
        <Link href="/courses?track=amharic" className="lang-item">
          <Flag name="ethiopia" className="lang-flag" />
          Amharic
        </Link>
        <Link href="/courses?track=english" className="lang-item">
          <Flag name="usa" className="lang-flag" />
          English
        </Link>
        <span className="lang-item">
          <Flag name="oromia" className="lang-flag" />
          Afaan Oromoo <span className="lang-soon">Coming soon</span>
        </span>
        <span className="lang-item">
          <Flag name="tigray" className="lang-flag" />
          Tigrinya <span className="lang-soon">Coming soon</span>
        </span>
      </nav>
    </main>
  );
}
