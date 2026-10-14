import Link from 'next/link';
import { FadeInOnScroll } from '@/components/FadeInOnScroll';
import Flag from '@/components/Flag';
import Mascot from '@/components/Mascot';
import MountainScene from '@/components/MountainScene';
import { CTA, SectionHead, Testimonials } from '@/components/sections';
import { testimonials } from '@/lib/content';
import { courseContent } from '@/lib/courses';

const greeting = courseContent['amharic-beginner-1'].sections[0];
const dialogue = (greeting.dialogue ?? []).slice(0, 3);

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="hero">
        <div className="container hero-grid">
          <FadeInOnScroll>
            <div className="hero-copy">
              <span className="kicker">Amharic ⇄ English</span>
              <h1 className="display">
                Climb to fluency in Amharic and English—one small step at a time.
              </h1>
              <p className="lead">
                Bite‑sized lessons, real phrases, and everyday dialogues, built for
                Ethiopian families and the diaspora. Free, with no account needed.
              </p>
              <div className="row">
                <Link href="/courses?track=amharic" className="btn">
                  Learn Amharic
                </Link>
                <Link href="/courses?track=english" className="btn btn-secondary">
                  Learn English
                </Link>
              </div>
            </div>
          </FadeInOnScroll>

          <div className="hero-scene">
            <MountainScene className="hero-mountains" />
            <div className="hero-walia">
              <div className="speech floaty">
                ሰላም!
                <small>selam — hello!</small>
              </div>
              <Mascot pose="wave" size={190} title="Walia the ibex waving hello" />
            </div>
          </div>
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
            Afaan Oromo <span className="lang-soon">Soon</span>
          </span>
          <span className="lang-item">
            Tigrinya <span className="lang-soon">Soon</span>
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
                  first—greetings, introductions, family—and build real confidence one
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
                  honor Amharic as identity, history, and connection—not just vocabulary.
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
                  translation side by side—so you can talk with family and friends from
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
                  Ethiopians for families at home and across the diaspora—free, with no
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
                <Mascot pose="happy" size={220} className="floaty" />
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
