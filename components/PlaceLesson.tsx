'use client';

// The one-minute lesson about a passport stamp's place: a few short cards, each
// with an Amharic word Walia can say, then one quick question.

import { useEffect, useState } from 'react';
import PassportStamp from '@/components/PassportStamp';
import SayButton, { say } from '@/components/SayButton';
import type { Stamp } from '@/lib/passport';
import { PLACE_LESSONS } from '@/lib/placeLessons';

export function hasPlaceLesson(stamp: Stamp) {
  return Boolean(PLACE_LESSONS[stamp.id]);
}

export default function PlaceLesson({ stamp, onDone }: { stamp: Stamp; onDone: () => void }) {
  const lesson = PLACE_LESSONS[stamp.id];
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  if (!lesson) return null;

  const total = lesson.cards.length + 1;
  const card = lesson.cards[step];
  const { question } = lesson;

  return (
    <div className="place-lesson" style={{ ['--ink' as string]: stamp.ink }}>
      <div className="place-lesson-head">
        <PassportStamp stamp={stamp} earned size={56} tilt={-6} />
        <div>
          <span className="place-lesson-kicker">Quick lesson</span>
          <h2 className="place-lesson-title">
            {stamp.name} <span lang="am">{stamp.amharic}</span>
          </h2>
        </div>
      </div>

      <div className="place-lesson-dots" aria-label={`Step ${step + 1} of ${total}`}>
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={i <= step ? 'on' : ''} />
        ))}
      </div>

      {card ? (
        <div className="place-lesson-card" key={step}>
          <p className="place-lesson-text">{card.text}</p>
          <WordChip word={card.word} />
          <button type="button" className="btn place-lesson-next" onClick={() => setStep(step + 1)} autoFocus>
            {step === lesson.cards.length - 1 ? 'Quiz me' : 'Next'}
          </button>
        </div>
      ) : (
        <div className="place-lesson-card" key="quiz">
          <p className="place-lesson-q">{question.q}</p>
          <div className="place-lesson-options">
            {question.options.map((o, i) => {
              const state =
                picked === null ? '' : i === question.answer ? ' right' : i === picked ? ' wrong' : ' dim';
              return (
                <button
                  key={o}
                  type="button"
                  className={`place-lesson-option${state}`}
                  disabled={picked !== null}
                  onClick={() => setPicked(i)}
                >
                  {o}
                </button>
              );
            })}
          </div>
          {picked !== null && (
            <>
              <p className={`place-lesson-why${picked === question.answer ? ' right' : ''}`}>
                <strong>{picked === question.answer ? 'ጎበዝ! That’s right. ' : 'Not quite. '}</strong>
                {question.why}
              </p>
              <button type="button" className="btn place-lesson-next" onClick={onDone} autoFocus>
                Done
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

/** The Amharic word on a card: tap it to hear Walia say it. */
function WordChip({ word }: { word: { am: string; tr: string; en: string } }) {
  // say each new word once as it appears (quietly ignored if sound is blocked)
  useEffect(() => {
    try {
      if (window.localStorage.getItem('kwanqa-sound-off') === '1') return;
    } catch {
      // no storage: just play it
    }
    const t = window.setTimeout(() => say(word.am, 'amharic'), 300);
    return () => window.clearTimeout(t);
  }, [word.am]);

  return (
    <div className="place-lesson-word">
      <SayButton text={word.am} track="amharic" size={20} />
      <span className="place-lesson-word-am" lang="am">
        {word.am}
      </span>
      <span className="place-lesson-word-tr">{word.tr}</span>
      <span className="place-lesson-word-en">{word.en}</span>
    </div>
  );
}
