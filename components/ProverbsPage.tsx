'use client';

// /proverbs: Walia hosts a guessing game ("crack the proverb"), then every
// proverb as a flip card, sorted into five colourful themes.

import { useState, type CSSProperties } from 'react';
import Mascot from '@/components/Mascot';
import { useNow } from '@/components/HolidayCards';
import { showToast } from '@/components/Toaster';
import { THEMES, meaningChoices, proverbOfTheDay, proverbs, themeOf, type Proverb, type Theme } from '@/lib/proverbs';

const MUTE_KEY = 'kwanqa-sound-off'; // shared with the lessons' mute button

function play(kind: 'correct' | 'wrong') {
  try {
    if (localStorage.getItem(MUTE_KEY) === '1') return;
    const audio = new Audio(`/sounds/${kind}.mp3`);
    audio.volume = 0.6;
    void audio.play().catch(() => {});
  } catch {
    // no audio here; the game works silently
  }
}

/** A small icon for each theme. */
function ThemeIcon({ theme, size = 22 }: { theme: Theme; size?: number }) {
  const c = THEMES[theme].color;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      {theme === 'patience' && (
        <>
          <ellipse cx="12" cy="13" rx="7" ry="9" fill={c} />
          <path d="M8 18 L10 20 M16 18 L14 20" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
          <ellipse cx="10" cy="9" rx="2" ry="3" fill="#fff" opacity="0.55" />
        </>
      )}
      {theme === 'together' && (
        <>
          <circle cx="7" cy="12" r="5" fill="none" stroke={c} strokeWidth="2.6" />
          <circle cx="17" cy="12" r="5" fill="none" stroke={c} strokeWidth="2.6" />
          <circle cx="12" cy="12" r="2.2" fill={c} />
        </>
      )}
      {theme === 'careful' && (
        <>
          <path d="M2 12 C 6 5, 18 5, 22 12 C 18 19, 6 19, 2 12 Z" fill={c} />
          <circle cx="12" cy="12" r="4" fill="#fff" />
          <circle cx="12" cy="12" r="2" fill="#241a14" />
        </>
      )}
      {theme === 'wisdom' && (
        <>
          <path d="M12 2 L15 9 L22 12 L15 15 L12 22 L9 15 L2 12 L9 9 Z" fill={c} />
          <path d="M12 8 L13.5 12 L12 16 L10.5 12 Z" fill="#fff" />
        </>
      )}
      {theme === 'worth' && (
        <>
          <rect x="3" y="8" width="18" height="9" rx="2" fill={c} transform="rotate(-8 12 12)" />
          <rect x="6" y="10.5" width="12" height="2" rx="1" fill="#fff" opacity="0.6" transform="rotate(-8 12 12)" />
        </>
      )}
    </svg>
  );
}

function themeStyle(theme: Theme) {
  return { '--theme': THEMES[theme].color, '--theme-soft': THEMES[theme].soft } as CSSProperties;
}

/** "Crack the proverb": tap words for hints, pick the meaning, Walia reacts. */
function ProverbGame({ first }: { first: Proverb }) {
  const [proverb, setProverb] = useState(first);
  const [seen, setSeen] = useState<string[]>([first.id]);
  const [word, setWord] = useState<number | null>(null);
  const [guess, setGuess] = useState<string | null>(null);
  const [score, setScore] = useState({ right: 0, played: 0 });

  const theme = themeOf(proverb);
  const choices = meaningChoices(proverb);
  const answered = guess !== null;
  const right = guess === proverb.meaning;
  const isToday = proverb.id === first.id;

  function answer(choice: string) {
    if (answered) return;
    const correct = choice === proverb.meaning;
    setGuess(choice);
    setScore(s => ({ right: s.right + (correct ? 1 : 0), played: s.played + 1 }));
    play(correct ? 'correct' : 'wrong');
  }

  function another() {
    const pool = proverbs.filter(p => !seen.includes(p.id));
    const next = (pool.length ? pool : proverbs.filter(p => p.id !== proverb.id))[
      Math.floor(Math.random() * (pool.length || proverbs.length - 1))
    ];
    setSeen(pool.length ? [...seen, next.id] : [next.id]);
    setProverb(next);
    setWord(null);
    setGuess(null);
  }

  async function share() {
    const text = `${proverb.amharic}\n“${proverb.literal}”\n${proverb.meaning}\n\nAmharic proverbs on kwanqa.com`;
    try {
      if (navigator.share) {
        await navigator.share({ text });
        return;
      }
      await navigator.clipboard.writeText(text);
      showToast('Proverb copied. Send it to someone!');
    } catch {
      // the learner closed the share sheet
    }
  }

  return (
    <section className={`pv-game${answered ? (right ? ' is-right' : ' is-wrong') : ''}`} style={themeStyle(theme)} aria-label="Crack the proverb">
      <div className="pv-game-top">
        <span className="pv-chip">
          <ThemeIcon theme={theme} size={18} />
          {isToday ? 'Today’s proverb' : THEMES[theme].label}
        </span>
        {score.played > 0 && (
          <span className="pv-score">
            {score.right}/{score.played} cracked
          </span>
        )}
      </div>

      <div className="pv-words" lang="am">
        {proverb.words.map((w, i) => (
          <button
            key={`${proverb.id}-${i}`}
            type="button"
            className={`pv-word${word === i ? ' active' : ''}`}
            aria-pressed={word === i}
            onClick={() => setWord(word === i ? null : i)}
          >
            {w.am}
          </button>
        ))}
      </div>
      <p className="pv-translit">{proverb.transliteration}</p>
      <p className="pv-hint" aria-live="polite">
        {word !== null ? (
          <>
            <strong lang="am">{proverb.words[word].am}</strong> means “{proverb.words[word].en}”
          </>
        ) : (
          'Stuck? Tap any word for a hint.'
        )}
      </p>

      <div className="pv-ask">
        <div className={`pv-walia${answered ? (right ? ' cheer' : ' oops') : ''}`}>
          <Mascot pose={answered && right ? 'cheer' : 'happy'} size={86} />
        </div>
        <p className="pv-bubble">
          {!answered
            ? 'What’s Grandma really trying to say?'
            : right
              ? 'ጎበዝ! You cracked it!'
              : 'Ahh, so close! Here’s the real meaning.'}
        </p>
      </div>

      <div className="pv-options">
        {choices.map((c, i) => {
          const state = !answered ? '' : c === proverb.meaning ? ' correct' : c === guess ? ' wrong' : ' dim';
          return (
            <button key={c} type="button" className={`pv-option${state}`} onClick={() => answer(c)} disabled={answered}>
              <span className="pv-option-key">{i + 1}</span>
              {c}
            </button>
          );
        })}
      </div>

      {answered && (
        <div className="pv-reveal">
          <p className="pv-literal">Word for word: “{proverb.literal}”</p>
          <div className="pv-actions">
            <button type="button" className="btn" onClick={another}>
              Another one!
            </button>
            <button type="button" className="btn btn-secondary" onClick={share}>
              Share
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

/** Tap to flip: the Amharic on the front, what it means on the back. */
function FlipCard({ proverb }: { proverb: Proverb }) {
  const [flipped, setFlipped] = useState(false);
  const theme = themeOf(proverb);
  return (
    <li>
      <button
        type="button"
        className={`pv-flip${flipped ? ' flipped' : ''}`}
        style={themeStyle(theme)}
        onClick={() => setFlipped(f => !f)}
        aria-pressed={flipped}
        aria-label={flipped ? `${proverb.amharic}: ${proverb.meaning}` : `${proverb.amharic}. Tap to see what it means.`}
      >
        <span className="pv-flip-inner">
          <span className="pv-face pv-front">
            <span className="pv-face-icon">
              <ThemeIcon theme={theme} />
            </span>
            <span className="pv-face-am" lang="am">
              {proverb.amharic}
            </span>
            <span className="pv-face-tr">{proverb.transliteration}</span>
            <span className="pv-face-tap">Tap to flip</span>
          </span>
          <span className="pv-face pv-back" aria-hidden={!flipped}>
            <span className="pv-face-lit">“{proverb.literal}”</span>
            <span className="pv-face-mean">{proverb.meaning}</span>
          </span>
        </span>
      </button>
    </li>
  );
}

export default function ProverbsPage() {
  const now = useNow();
  const [theme, setTheme] = useState<Theme | 'all'>('all');
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const shown = proverbs.filter(
    p =>
      (theme === 'all' || themeOf(p) === theme) &&
      (!q || [p.amharic, p.transliteration, p.literal, p.meaning].some(t => t.toLowerCase().includes(q))),
  );

  return (
    <main className="section pv-page">
      <div className="container pv-container">
        <header className="pv-hero">
          <div className="pv-hero-walia">
            <Mascot pose="wave" size={150} animated />
          </div>
          <div className="pv-hero-text">
            <p className="pv-hero-bubble">
              Ethiopian grandmas have a proverb for <em>everything</em>. Let’s see if you can crack a few!
            </p>
            <h1 className="pv-title">
              <span lang="am">ተረትና ምሳሌ</span> Proverbs
            </h1>
          </div>
        </header>

        {now && <ProverbGame first={proverbOfTheDay(now)} />}

        <section className="pv-collection" aria-label="All proverbs">
          <div className="pv-collection-head">
            <h2 className="h3">
              The whole collection <span className="pv-count">{proverbs.length}</span>
            </h2>
            <input
              type="search"
              className="pv-search"
              placeholder="Search: lion, water, hyena…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              aria-label="Search proverbs"
            />
          </div>

          <div className="pv-filters" role="group" aria-label="Themes">
            <button type="button" className={`pv-filter${theme === 'all' ? ' active' : ''}`} onClick={() => setTheme('all')}>
              All
            </button>
            {(Object.keys(THEMES) as Theme[]).map(t => (
              <button
                key={t}
                type="button"
                className={`pv-filter${theme === t ? ' active' : ''}`}
                style={themeStyle(t)}
                onClick={() => setTheme(theme === t ? 'all' : t)}
              >
                <ThemeIcon theme={t} size={18} />
                {THEMES[t].label}
              </button>
            ))}
          </div>

          <ul className="pv-grid">
            {shown.map(p => (
              <FlipCard key={p.id} proverb={p} />
            ))}
          </ul>
          {shown.length === 0 && <p className="muted pv-empty">No proverbs match that. Try “water” or “lion”.</p>}
        </section>
      </div>
    </main>
  );
}
