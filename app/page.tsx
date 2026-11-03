import Image from 'next/image';
import Link from 'next/link';
import { FadeInOnScroll } from '@/components/FadeInOnScroll';
import Flag from '@/components/Flag';
import GrassIcon from '@/components/GrassIcon';
import HeroActions from '@/components/HeroActions';
import Mascot from '@/components/Mascot';
import { CTA, SectionHead, Testimonials } from '@/components/sections';
import { testimonials } from '@/lib/content';
import { courseContent } from '@/lib/courses';

const greeting = courseContent['amharic-beginner-1'].sections[0];
const dialogue = (greeting.dialogue ?? []).slice(0, 3);

export default function Home() {
  return (
    <main>
      {/* Hero: Walia and friends on the left, the pitch and buttons on the right */}
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
          <HeroActions />
        </div>
      </section>

      {/* Language strip */}
      <div className="lang-strip">
        <div className="container">
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
        </div>
      </div>

      {/* Feature rows */}
      <section>
        <div className="container">
          <FadeInOnScroll>
            <div className="feature-row">
              <div className="feature-copy">
                <h2 className="h2">bite‑sized. fun. effective.</h2>
                <p className="lead">
                  Every lesson takes just a few minutes. Learn the phrases that matter
                  first (greetings, introductions, family) and build real confidence one
                  small step at a time.
                </p>
              </div>
              <div className="feature-art">
                <span className="art-bg" style={{ background: 'var(--gold-soft)' }} aria-hidden />
                <div className="art-stack">
                  <div className="mini-card">
                    <div className="mini-progress">
                      <span style={{ width: '60%' }} />
                    </div>
                    <strong style={{ color: 'var(--text-strong)' }}>What does ሰላም mean?</strong>
                    <div className="mini-option">Thank you</div>
                    <div className="mini-option correct">Hello / Peace</div>
                    <div className="mini-option">Goodbye</div>
                  </div>
                  <Mascot pose="cheer" size={110} />
                </div>
              </div>
            </div>
          </FadeInOnScroll>

          <FadeInOnScroll>
            <div className="feature-row flip">
              <div className="feature-copy">
                <h2 className="h2">rooted in culture</h2>
                <p className="lead">
                  Learn the Ge’ez script with transliteration as your bridge. Our lessons
                  honor Amharic as identity, history, and connection, not just vocabulary.
                </p>
              </div>
              <div className="feature-art">
                <span className="art-bg" style={{ background: 'var(--blue-soft)' }} aria-hidden />
                <div className="letter-tiles">
                  {['ሀ', 'ለ', 'ሐ', 'መ', 'ሰ', 'ቀ'].map((letter, idx) => (
                    <span key={letter} className={`letter-tile${idx === 4 ? ' on' : ''}`}>
                      {letter}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </FadeInOnScroll>

          <FadeInOnScroll>
            <div className="feature-row">
              <div className="feature-copy">
                <h2 className="h2">real conversations</h2>
                <p className="lead">
                  Practice short, everyday dialogues with script, transliteration, and
                  translation side by side, so you can talk with family and friends from
                  day one.
                </p>
              </div>
              <div className="feature-art">
                <span className="art-bg" style={{ background: 'var(--gold-soft)' }} aria-hidden />
                <div className="chat">
                  {dialogue.map((line, idx) => (
                    <div key={idx} className={`chat-line${line.speaker === 'B' ? ' me' : ''}`}>
                      {line.speaker === 'A' ? (
                        <Mascot pose="happy" size={44} title="Walia" />
                      ) : (
                        <span className="person-dot">You</span>
                      )}
                      <div className="bubble">
                        {line.amharic}
                        <small>{line.english}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeInOnScroll>

          <FadeInOnScroll>
            <div className="feature-row flip">
              <div className="feature-copy">
                <h2 className="h2">made for our community</h2>
                <p className="lead">
                  For years, major language apps ignored Amharic. kwanqa is built by
                  Ethiopians for families at home and across the diaspora. It’s free, with no
                  account needed.
                </p>
                <div>
                  <Link href="/about" className="link">
                    Read our story →
                  </Link>
                </div>
              </div>
              <div className="feature-art">
                <span className="art-bg" style={{ background: 'var(--primary-soft)' }} aria-hidden />
                <Image
                  src="/brand/walia.png"
                  alt="Walia the ibex"
                  width={200}
                  height={267}
                  className="floaty feature-walia"
                />
              </div>
            </div>
          </FadeInOnScroll>
        </div>
      </section>

      {/* Reviews */}
      <section className="section">
        <div className="container">
          <SectionHead kicker="Reviews" title="loved by learners" center />
          <Testimonials items={testimonials} />
        </div>
      </section>

      <CTA />
    </main>
  );
}
