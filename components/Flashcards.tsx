'use client';

// Flashcards from the Amharic course's lesson phrases, one deck per camp.
// Flip a card to check yourself, then sort it: "Got it" takes it out of the
// pile, "Still learning" sends it back in to see again. Amharic plays in the
// family recording when there is one, otherwise Walia's voice (amharicAudio).

import { useCallback, useEffect, useMemo, useState } from 'react';
import { amharicAudio } from '@/lib/amharicAudio';
import { courseCatalog, courseContent } from '@/lib/courses';

type Card = { amharic: string; transliteration: string; english: string };
type Direction = 'am-en' | 'en-am';

const DECK_KEY = 'kwanqa-flashcards-deck';
const GAP = /\.\.\.|…|__/;

// one deck per Amharic camp: its lessons' phrases, without repeats or fill-in-the-gap patterns
const DECKS = courseCatalog
  .filter(c => c.track === 'amharic')
  .sort((a, b) => a.part - b.part)
  .map(c => {
    const seen = new Set<string>();
    const cards: Card[] = [];
    for (const section of courseContent[c.slug]?.sections ?? []) {
      for (const p of section.phrases ?? []) {
        const key = p.amharic.trim();
        if (GAP.test(key) || seen.has(key)) continue;
        seen.add(key);
        cards.push({ amharic: key, transliteration: p.transliteration, english: p.english });
      }
    }
    return { slug: c.slug, part: c.part, title: c.description, cards };
  })
  .filter(d => d.cards.length > 0);

function shuffle<T>(list: T[]) {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function SpeakerIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" />
      <path d="M15.5 9a4 4 0 0 1 0 6" />
      <path d="M18 6.5a7.5 7.5 0 0 1 0 11" />
    </svg>
  );
}

export default function Flashcards() {
  const [deckIndex, setDeckIndex] = useState(0);
  const [direction, setDirection] = useState<Direction>('am-en');
  const [pile, setPile] = useState<Card[]>(() => DECKS[0]?.cards ?? []);
  const [known, setKnown] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const deck = DECKS[deckIndex];
  const card = pile[0];
  const total = deck?.cards.length ?? 0;

  const start = useCallback((i: number) => {
    setDeckIndex(i);
    setPile(shuffle(DECKS[i].cards));
    setKnown(0);
    setFlipped(false);
    try {
      localStorage.setItem(DECK_KEY, DECKS[i].slug);
    } catch {
      // fine without remembering
    }
  }, []);

  // reopen the deck the learner was last on, shuffled
  useEffect(() => {
    let saved = 0;
    try {
      const slug = localStorage.getItem(DECK_KEY);
      saved = Math.max(0, DECKS.findIndex(d => d.slug === slug));
    } catch {
      // first visit
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read once from storage after hydration
    start(saved);
  }, [start]);

  const audio = useMemo(() => (card ? amharicAudio(card.amharic) : null), [card]);

  const play = useCallback(() => {
    if (!audio) return;
    void new Audio(audio).play().catch(() => {});
  }, [audio]);

  const sort = useCallback(
    (gotIt: boolean) => {
      if (!card) return;
      setFlipped(false);
      if (gotIt) {
        setKnown(k => k + 1);
        setPile(p => p.slice(1));
      } else {
        // back into the pile a few cards later
        setPile(p => {
          const rest = p.slice(1);
          const at = Math.min(rest.length, 3 + Math.floor(Math.random() * 3));
          return [...rest.slice(0, at), card, ...rest.slice(at)];
        });
      }
    },
    [card],
  );

  // space flips; 1 = still learning, 2 = got it (once flipped)
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.target as HTMLElement)?.closest('input, textarea, select')) return;
      if (e.key === ' ') {
        e.preventDefault();
        setFlipped(f => !f);
      } else if (flipped && e.key === '1') sort(false);
      else if (flipped && e.key === '2') sort(true);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [flipped, sort]);

  if (!deck) return null;

  const front =
    direction === 'am-en' ? (
      <>
        <span className="fc-big" lang="am">{card?.amharic}</span>
        <span className="fc-hint">What does it mean?</span>
      </>
    ) : (
      <>
        <span className="fc-big fc-big-en">{card?.english}</span>
        <span className="fc-hint">How do you say it in Amharic?</span>
      </>
    );

  const back =
    direction === 'am-en' ? (
      <>
        <span className="fc-small" lang="am">{card?.amharic}</span>
        <span className="fc-tr">{card?.transliteration}</span>
        <span className="fc-big fc-big-en">{card?.english}</span>
      </>
    ) : (
      <>
        <span className="fc-big" lang="am">{card?.amharic}</span>
        <span className="fc-tr">{card?.transliteration}</span>
        <span className="fc-hint">{card?.english}</span>
      </>
    );

  return (
    <div className="fc">
      <div className="fc-decks" role="group" aria-label="Choose a camp">
        {DECKS.map((d, i) => (
          <button key={d.slug} type="button" className={`fc-deck${i === deckIndex ? ' on' : ''}`} onClick={() => start(i)} aria-pressed={i === deckIndex}>
            <strong>Camp {d.part}</strong>
            <span>{d.cards.length} cards</span>
          </button>
        ))}
      </div>

      <div className="fc-bar">
        <p className="fc-deck-title">{deck.title}</p>
        <div className="fc-direction" role="group" aria-label="Which side first">
          <button type="button" className={direction === 'am-en' ? 'on' : ''} onClick={() => { setDirection('am-en'); setFlipped(false); }} aria-pressed={direction === 'am-en'}>
            <span lang="am">አማርኛ</span> → English
          </button>
          <button type="button" className={direction === 'en-am' ? 'on' : ''} onClick={() => { setDirection('en-am'); setFlipped(false); }} aria-pressed={direction === 'en-am'}>
            English → <span lang="am">አማርኛ</span>
          </button>
        </div>
      </div>

      <div className="fc-progress" aria-label={`${known} of ${total} known`}>
        <span style={{ width: `${total ? (known / total) * 100 : 0}%` }} />
      </div>

      {card ? (
        <>
          <div className={`fc-card${flipped ? ' flipped' : ''}`}>
            <button type="button" className="fc-inner" onClick={() => setFlipped(f => !f)} aria-label={flipped ? 'Show the front' : 'Flip the card'}>
              <span className="fc-face fc-front">{front}</span>
              <span className="fc-face fc-back">{back}</span>
            </button>
            {audio && (direction === 'am-en' || flipped) && (
              <button type="button" className="fc-speak" onClick={play} aria-label="Hear it">
                <SpeakerIcon />
              </button>
            )}
          </div>

          <div className="fc-actions">
            {flipped ? (
              <>
                <button type="button" className="btn btn-secondary" onClick={() => sort(false)}>
                  Still learning
                </button>
                <button type="button" className="btn" onClick={() => sort(true)}>
                  Got it
                </button>
              </>
            ) : (
              <button type="button" className="btn btn-secondary" onClick={() => setFlipped(true)}>
                Show answer
              </button>
            )}
          </div>
          <p className="fc-count">
            {pile.length} left · {known} known
          </p>
        </>
      ) : (
        <div className="fc-done">
          <strong lang="am">ጎበዝ!</strong>
          <p>You know all {total} cards in Camp {deck.part}.</p>
          <div className="fc-actions">
            <button type="button" className="btn btn-secondary" onClick={() => start(deckIndex)}>
              Go again
            </button>
            {deckIndex + 1 < DECKS.length && (
              <button type="button" className="btn" onClick={() => start(deckIndex + 1)}>
                Camp {DECKS[deckIndex + 1].part}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
