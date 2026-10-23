'use client';

// The English alphabet for Amharic speakers: tap a letter to see it big, hear
// its name and an example word, with the word's Amharic meaning.

import { useRef, useState } from 'react';
import { ABC, type AbcLetter } from '@/lib/abc';
import { englishAudioUrl, speakWithBrowser } from '@/lib/englishAudio';

function SpeakerIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" />
      <path d="M15.5 9a4 4 0 0 1 0 6" />
      <path d="M18 6.5a7.5 7.5 0 0 1 0 11" />
    </svg>
  );
}

/** Says one or more bits of English in turn, with the browser's voice as a backup. */
function useSay() {
  const current = useRef<HTMLAudioElement | null>(null);
  return (texts: string[]) => {
    current.current?.pause();
    const [first, ...rest] = texts;
    if (!first) return;
    const el = new Audio(englishAudioUrl(first));
    current.current = el;
    el.onended = () => rest.length && current.current === el && sayNext(rest);
    el.onerror = () => current.current === el && speakWithBrowser(texts.join('. '));
    el.play().catch(() => {});
    function sayNext(next: string[]) {
      const [n, ...more] = next;
      const a = new Audio(englishAudioUrl(n));
      current.current = a;
      a.onended = () => more.length && current.current === a && sayNext(more);
      a.play().catch(() => {});
    }
  };
}

export default function AbcChart() {
  const [selected, setSelected] = useState<AbcLetter>(ABC[0]);
  const [quiz, setQuiz] = useState(false);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const say = useSay();

  function pick(letter: AbcLetter) {
    setSelected(letter);
    say([letter.upper, letter.word]);
    if (quiz) setRevealed(prev => new Set(prev).add(letter.upper));
  }

  const l = selected;
  return (
    <div className="fidel abc">
      <div className="fidel-controls">
        <label className="toggle">
          <input
            type="checkbox"
            checked={quiz}
            onChange={e => {
              setQuiz(e.target.checked);
              setRevealed(new Set());
            }}
          />
          <span lang="am">ፈትነኝ</span> · Quiz me
        </label>
      </div>

      <div className="fidel-layout">
        <aside className="fidel-detail abc-detail" aria-live="polite">
          <div className="abc-big">
            {l.upper}
            <span>{l.lower}</span>
          </div>
          <div className="fidel-roman-row">
            <div className="abc-name">
              <span className="abc-name-label">ስሙ · name</span>
              <span lang="am">{l.nameAm}</span>
            </div>
            <button
              type="button"
              className="fidel-speak"
              onClick={() => say([l.upper, l.word])}
              aria-label={`Hear ${l.upper} and ${l.word}`}
              title="Hear it"
            >
              <SpeakerIcon />
            </button>
          </div>
          <button type="button" className="abc-word" onClick={() => say([l.word])}>
            {l.picture && (
              // eslint-disable-next-line @next/next/no-img-element -- small local pictures
              <img src={l.picture} alt="" />
            )}
            <span className="abc-word-en">
              {l.ends ? (
                <>
                  {l.word.slice(0, -1)}
                  <b>{l.word.slice(-1)}</b>
                </>
              ) : (
                <>
                  <b>{l.word.charAt(0)}</b>
                  {l.word.slice(1)}
                </>
              )}
            </span>
            <span className="abc-word-am" lang="am">
              {l.wordAm}
            </span>
          </button>
          {l.ends && (
            <p className="fidel-note small">
              <span lang="am">ጥቂት ቃላት ብቻ በ X ይጀምራሉ፣ ስለዚህ ብዙ ጊዜ መጨረሻ ላይ ይገኛል።</span> Few words start with X, so you
              usually see it at the end.
            </p>
          )}
        </aside>

        <div className="abc-grid">
          {ABC.map(letter => {
            const hidden = quiz && !revealed.has(letter.upper);
            return (
              <button
                key={letter.upper}
                type="button"
                className={`abc-cell${letter.upper === l.upper ? ' on' : ''}`}
                onClick={() => pick(letter)}
                aria-label={`${letter.upper}, as in ${letter.word}`}
              >
                <span className="abc-cell-letter">
                  {letter.upper}
                  <small>{letter.lower}</small>
                </span>
                <span className="abc-cell-word">{hidden ? '?' : letter.word}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
