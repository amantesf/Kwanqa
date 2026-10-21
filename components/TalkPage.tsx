'use client';

// /talk: pick a conversation and call Walia. The calls themselves are in TalkCall.

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import Mascot from '@/components/Mascot';
import TalkCall from '@/components/TalkCall';
import { conversations, type Conversation, type Gender } from '@/lib/conversations';

const GENDER_KEY = 'kwanqa-talk-gender';

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
      <path
        d="M6.6 3.5l2.6.4c.5.1.8.4.9.9l.6 3.1c.1.4-.1.9-.4 1.1L8.6 10.3a12 12 0 0 0 5.1 5.1l1.3-1.7c.3-.4.7-.5 1.1-.4l3.1.6c.5.1.8.5.9.9l.4 2.6c.1.6-.3 1.2-.9 1.3-1 .2-2 .3-3 .3A13.6 13.6 0 0 1 3 4.4c0-1 .1-2 .3-3 .1-.6.7-1 1.3-.9z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function TalkPage() {
  const { enabled, loading, user } = useAuth();
  const [gender, setGender] = useState<Gender | null>(null);
  const [calling, setCalling] = useState<Conversation | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(GENDER_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- read once from storage after hydration
      if (saved === 'm' || saved === 'f') setGender(saved);
    } catch {
      // storage blocked: just ask each time
    }
  }, []);

  function pickGender(g: Gender) {
    setGender(g);
    try {
      localStorage.setItem(GENDER_KEY, g);
    } catch {
      // fine
    }
  }

  return (
    <main className="section pv-page talk-page">
      <div className="container pv-container">
        <header className="pv-hero">
          <div className="pv-hero-walia">
            <Mascot pose="wave" size={150} animated />
          </div>
          <div className="pv-hero-text">
            <p className="pv-hero-bubble">
              Give me a call! I’ll ask you simple questions, and you answer out loud, just like talking with family.
            </p>
            <h1 className="pv-title">
              <span lang="am">ጨዋታ</span> Talk with Walia
            </h1>
          </div>
        </header>

        {enabled && !user ? (
          <div className="gate talk-gate">
            {loading ? (
              <p className="muted">Getting Walia on the line…</p>
            ) : (
              <>
                <h2 className="h3" style={{ fontSize: 26 }}>
                  Make a free account to call Walia
                </h2>
                <p className="muted">
                  Calls use real speech recognition, so they’re for learners with an account. It’s free and takes a
                  minute.
                </p>
                <div className="row" style={{ justifyContent: 'center' }}>
                  <Link href="/signup?next=%2Ftalk" className="btn">
                    Sign up
                  </Link>
                  <Link href="/login?next=%2Ftalk" className="btn btn-secondary">
                    Log in
                  </Link>
                </div>
              </>
            )}
          </div>
        ) : (
          <>
            <section className="talk-setup" aria-labelledby="talk-gender">
              <h2 id="talk-gender" className="talk-h2">
                How should Walia talk to you?
              </h2>
              <p className="talk-note">
                Amharic changes with who you’re talking to: Walia asks a man <span lang="am">እንዴት ነህ?</span> and a woman{' '}
                <span lang="am">እንዴት ነሽ?</span>
              </p>
              <div className="talk-gender" role="radiogroup" aria-labelledby="talk-gender">
                {(['m', 'f'] as Gender[]).map(g => (
                  <button
                    key={g}
                    type="button"
                    role="radio"
                    aria-checked={gender === g}
                    className={`talk-gender-option${gender === g ? ' on' : ''}`}
                    onClick={() => pickGender(g)}
                  >
                    <strong>{g === 'm' ? 'As a man' : 'As a woman'}</strong>
                    <span lang="am">{g === 'm' ? 'እንዴት ነህ?' : 'እንዴት ነሽ?'}</span>
                  </button>
                ))}
              </div>
            </section>

            <section aria-labelledby="talk-beginner">
              <h2 id="talk-beginner" className="talk-h2">
                Beginner
              </h2>
              <div className="talk-list">
                {conversations.map(c => (
                  <article key={c.slug} className="talk-card">
                    <div className="talk-card-text">
                      <h3>
                        {c.title} <span lang="am">{c.amharicTitle}</span>
                      </h3>
                      <p>{c.blurb}</p>
                      <span className="talk-card-meta">{c.turns.length} questions · about 3 minutes</span>
                    </div>
                    <button
                      type="button"
                      className="btn talk-call-btn"
                      onClick={() => setCalling(c)}
                      disabled={!gender}
                      title={gender ? undefined : 'Choose how Walia should talk to you first'}
                    >
                      <PhoneIcon />
                      Call Walia
                    </button>
                  </article>
                ))}
              </div>
              {!gender && <p className="talk-note">Choose how Walia should talk to you, then call him.</p>}
              <p className="talk-note">More conversations, and harder levels, are on the way.</p>
            </section>
          </>
        )}
      </div>

      {calling && gender && (!enabled || user) && (
        <TalkCall conversation={calling} gender={gender} onEnd={() => setCalling(null)} />
      )}
    </main>
  );
}
