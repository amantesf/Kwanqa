'use client';

// Ge'ez numerals, under the ፊደል chart on the alphabet page: the ones, the
// tens, ፻ and ፼, each with its Amharic word (tap one to hear it), how they
// combine, and a box that writes any number in Ge'ez.

import { useState, useSyncExternalStore } from 'react';
import { say } from '@/components/SayButton';
import { geezNumber, toEthiopian } from '@/lib/ethiopianCalendar';
import { GEEZ_BIG, GEEZ_ONES, GEEZ_TENS, type GeezNumeral } from '@/lib/geezNumerals';

const noChange = () => () => {};

function Numeral({ n }: { n: GeezNumeral }) {
  return (
    <button type="button" className="gz-cell" onClick={() => say(n.amharic, 'amharic')} title={`Hear ${n.amharic}`}>
      <span className="gz-sign" lang="am">
        {n.sign}
      </span>
      <span className="gz-value">{n.value.toLocaleString()}</span>
      <span className="gz-word" lang="am">
        {n.amharic}
      </span>
      <span className="gz-tr">{n.tr}</span>
    </button>
  );
}

const EXAMPLES: [number, string][] = [
  [25, 'tens, then ones'],
  [300, 'how many hundreds, then ፻'],
  [1980, '19 hundreds and 80'],
];

export default function GeezNumerals() {
  const [typed, setTyped] = useState('1984');
  // this year in the Ethiopian calendar, worked out in the browser
  const year = useSyncExternalStore(noChange, () => toEthiopian(new Date()).year, () => null);
  const value = Number(typed);
  const valid = Number.isInteger(value) && value > 0 && value < 100_000_000;

  return (
    <section className="gz" aria-labelledby="gz-title">
      <div className="gz-head">
        <h2 id="gz-title">Ge’ez numerals</h2>
        <p className="muted">
          Ethiopia has its own numbers too. You’ll see them on calendars, in church books and on old buildings. There’s
          no zero: the tens and ones sit side by side. Tap a numeral to hear its Amharic name.
        </p>
      </div>

      <h3 className="gz-label">Ones</h3>
      <div className="gz-grid">
        {GEEZ_ONES.map(n => (
          <Numeral key={n.sign} n={n} />
        ))}
      </div>

      <h3 className="gz-label">Tens</h3>
      <div className="gz-grid">
        {GEEZ_TENS.map(n => (
          <Numeral key={n.sign} n={n} />
        ))}
      </div>

      <h3 className="gz-label">Hundred and ten thousand</h3>
      <div className="gz-grid">
        {GEEZ_BIG.map(n => (
          <Numeral key={n.sign} n={n} />
        ))}
      </div>

      <div className="gz-how">
        <h3 className="gz-label">Putting them together</h3>
        <ul>
          {EXAMPLES.map(([n, how]) => (
            <li key={n}>
              <span className="gz-example" lang="am">
                {geezNumber(n)}
              </span>
              <span>
                {n} · {how}
              </span>
            </li>
          ))}
          {year && (
            <li>
              <span className="gz-example" lang="am">
                {geezNumber(year)}
              </span>
              <span>{year} · this year in the Ethiopian calendar</span>
            </li>
          )}
        </ul>
      </div>

      <label className="gz-try">
        <span className="gz-label">Write any number in Ge’ez</span>
        <span className="gz-try-row">
          <input
            type="text"
            inputMode="numeric"
            value={typed}
            onChange={e => setTyped(e.target.value.replace(/\D/g, '').slice(0, 8))}
            aria-label="A number"
          />
          <span className="gz-try-out" lang="am" aria-live="polite">
            {valid ? geezNumber(value) : '–'}
          </span>
        </span>
      </label>
    </section>
  );
}
