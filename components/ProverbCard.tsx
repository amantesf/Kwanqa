'use client';

// Proverb of the day (ምሳሌ): tap the words to see what they mean, guess what
// the proverb is saying, then see the answer. A new one each day.

import { useState } from 'react';
import Link from 'next/link';
import { useNow } from '@/components/HolidayCards';
import { showToast } from '@/components/Toaster';
import { meaningChoices, proverbOfTheDay } from '@/lib/proverbs';

/** `className` defaults to hiding the card on phones when it sits in the learn page's side rail. */
export default function ProverbCard({ className = 'rail-extra' }: { className?: string }) {
  const now = useNow();
  const [word, setWord] = useState<number | null>(null);
  const [guess, setGuess] = useState<string | null>(null);
  if (!now) return null;

  const proverb = proverbOfTheDay(now);
  const choices = meaningChoices(proverb);
  const answered = guess !== null;
  const right = guess === proverb.meaning;

  async function share() {
    const text = `${proverb.amharic}\n“${proverb.literal}”\n${proverb.meaning}\n\nAmharic proverb of the day on kwanqa.com`;
    try {
      if (navigator.share) {
        await navigator.share({ text });
        return;
      }
      await navigator.clipboard.writeText(text);
      showToast('Proverb copied. Share it with someone!');
    } catch {
      // the learner closed the share sheet
    }
  }

  return (
    <div className={`rail-card proverb-card ${className}`}>
      <div className="rail-card-head">
        <h3 className="rail-title">Proverb of the day</h3>
        {className.includes('rail-extra') ? (
          <Link href="/proverbs" className="rail-link">
            All proverbs
          </Link>
        ) : (
          <span className="proverb-tag" lang="am">
            ምሳሌ
          </span>
        )}
      </div>

      <div>
        <p className="proverb-am" lang="am">
          {proverb.words.map((w, i) => (
            <button
              key={i}
              type="button"
              className={`proverb-word${word === i ? ' active' : ''}`}
              aria-pressed={word === i}
              onClick={() => setWord(word === i ? null : i)}
            >
              {w.am}
            </button>
          ))}
        </p>
        <p className="proverb-translit">{proverb.transliteration}</p>
        <p className="proverb-gloss" aria-live="polite">
          {word !== null ? (
            <>
              <strong lang="am">{proverb.words[word].am}</strong> = {proverb.words[word].en}
            </>
          ) : (
            <span className="muted">Tap a word to see what it means.</span>
          )}
        </p>
      </div>

      {!answered ? (
        <div className="proverb-guess">
          <p className="proverb-q">What do you think it means?</p>
          {choices.map(c => (
            <button key={c} type="button" className="proverb-choice" onClick={() => setGuess(c)}>
              {c}
            </button>
          ))}
        </div>
      ) : (
        <div className={`proverb-answer${right ? ' right' : ''}`}>
          <p className="proverb-verdict">{right ? 'ጎበዝ! You got it.' : 'Not quite. Here’s what it means:'}</p>
          <p className="proverb-literal">“{proverb.literal}”</p>
          <p className="proverb-meaning">{proverb.meaning}</p>
          <button type="button" className="btn btn-secondary btn-sm btn-block" onClick={share}>
            Share this proverb
          </button>
        </div>
      )}
    </div>
  );
}
