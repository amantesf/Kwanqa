'use client';

// The daily ፊደል puzzle (the alphabet page's Puzzle tab): guess today's
// three-letter word in six tries. Tap a consonant, then pick its vowel form.
// Today's guesses are kept in this browser, so leaving and coming back keeps
// the board. Rules and words are in lib/fidelPuzzle.ts.

import { useEffect, useState, useSyncExternalStore } from 'react';
import { FIDEL } from '@/lib/fidel';
import { amharicAudio } from '@/lib/amharicAudio';
import {
  PUZZLE_LENGTH,
  PUZZLE_TRIES,
  isPuzzleLetter,
  markGuess,
  puzzleNumber,
  puzzleWord,
  rowInWord,
  sameRow,
  shareText,
  type Mark,
} from '@/lib/fidelPuzzle';

const KEY = 'kwanqa-fidel-puzzle';

type Saved = { number: number; guesses: string[] };

function load(number: number): string[] {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? 'null') as Saved | null;
    return saved?.number === number ? saved.guesses : [];
  } catch {
    return [];
  }
}

function save(number: number, guesses: string[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ number, guesses } satisfies Saved));
  } catch {
    // no storage: the board lasts for this visit
  }
}

const MARK_LABEL: Record<Mark, string> = {
  right: 'right letter, right place',
  family: 'right consonant, wrong vowel',
  moved: 'in the word, another place',
  out: 'not in the word',
};

const noChange = () => () => {};

/** Today's puzzle is worked out in the browser, in the learner's own time zone. */
export default function FidelPuzzle() {
  const number = useSyncExternalStore(noChange, () => puzzleNumber(), () => null);
  if (!number) return <div className="fp" aria-busy />;
  return <Board key={number} number={number} />;
}

function Board({ number }: { number: number }) {
  const [guesses, setGuesses] = useState<string[]>(() => load(number));
  const [typed, setTyped] = useState<string[]>([]);
  const [row, setRow] = useState<string | null>(null); // the consonant whose vowels are showing
  const [note, setNote] = useState('');
  const [shared, setShared] = useState(false);

  const answer = puzzleWord(number);
  // ሀኪም counts for ሐኪም, so a win is a guess with every letter right
  const won = guesses.some(g => markGuess(g, answer.word).every(m => m === 'right'));
  const over = won || guesses.length >= PUZZLE_TRIES;

  function add(char: string) {
    if (over || typed.length >= PUZZLE_LENGTH) return;
    setTyped(t => [...t, char]);
    setRow(null);
    setNote('');
  }

  function erase() {
    if (over) return;
    setTyped(t => t.slice(0, -1));
    setNote('');
  }

  function enter() {
    if (over) return;
    if (typed.length < PUZZLE_LENGTH) {
      setNote(`Today’s word has ${PUZZLE_LENGTH} letters.`);
      return;
    }
    const next = [...guesses, typed.join('')];
    setGuesses(next);
    save(number, next);
    setTyped([]);
  }

  // A computer keyboard works too: Ethiopic letters, Backspace and Enter.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === 'Enter') enter();
      else if (e.key === 'Backspace') erase();
      else if (e.key === 'Escape') setRow(null);
      else if ([...e.key].length === 1 && isPuzzleLetter(e.key)) add(e.key);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const marks = guesses.map(g => markGuess(g, answer.word));

  /** The best thing known about a consonant key, to colour it. */
  function keyState(base: string): Mark | undefined {
    let best: Mark | undefined;
    guesses.forEach((g, gi) =>
      [...g].forEach((ch, i) => {
        if (!sameRow(ch, base)) return;
        const m = marks[gi][i];
        if (m === 'right') best = 'right';
        else if (m === 'moved' && best !== 'right') best = 'moved';
        else if (m === 'family' && best !== 'right' && best !== 'moved') best = 'family';
        else if (!best && !rowInWord(base, answer.word)) best = 'out';
      }),
    );
    return best;
  }

  async function share() {
    const text = shareText(number, marks, won);
    try {
      if (navigator.share) await navigator.share({ text });
      else await navigator.clipboard.writeText(text);
      setShared(true);
    } catch {
      // closed the share sheet
    }
  }

  function hear() {
    const url = amharicAudio(answer.word);
    if (url) void new Audio(url).play().catch(() => {});
  }

  const rows = Array.from({ length: PUZZLE_TRIES }, (_, i) => {
    if (i < guesses.length) return { letters: [...guesses[i]], marks: marks[i] };
    if (i === guesses.length && !over) return { letters: typed, marks: null };
    return { letters: [], marks: null };
  });
  const open = row ? FIDEL.find(r => r.base === row) : null;

  return (
    <div className="fp">
      <div className="fp-intro">
        <h2>Daily ፊደል puzzle #{number}</h2>
        <p className="muted">
          Guess today’s three-letter Amharic word in six tries. Tap a letter family, then pick the vowel. Everyone
          gets the same word, and a new one comes at midnight.
        </p>
      </div>

      <div className="fp-board" role="grid" aria-label="Your guesses">
        {rows.map((r, i) => (
          <div key={i} className="fp-row" role="row">
            {Array.from({ length: PUZZLE_LENGTH }, (_, j) => {
              const m = r.marks?.[j];
              return (
                <span
                  key={j}
                  role="gridcell"
                  className={`fp-tile${m ? ` ${m}` : ''}${r.letters[j] && !m ? ' typed' : ''}`}
                  style={m ? { animationDelay: `${j * 0.15}s` } : undefined}
                  aria-label={r.letters[j] ? `${r.letters[j]}${m ? `, ${MARK_LABEL[m]}` : ''}` : 'empty'}
                  lang="am"
                >
                  {r.letters[j] ?? ''}
                </span>
              );
            })}
          </div>
        ))}
      </div>

      <ul className="fp-legend">
        {(['right', 'family', 'moved'] as Mark[]).map(m => (
          <li key={m}>
            <span className={`fp-swatch ${m}`} aria-hidden /> {MARK_LABEL[m]}
          </li>
        ))}
      </ul>

      {over ? (
        <div className="fp-result" role="status">
          <p className="fp-result-title">{won ? `Got it in ${guesses.length}!` : 'Not this time.'}</p>
          <p>
            Today’s word was{' '}
            <button type="button" className="fp-word" onClick={hear} lang="am" title="Hear it">
              {answer.word}
            </button>{' '}
            <em>{answer.tr}</em>, “{answer.meaning}”.
          </p>
          <div className="fp-result-actions">
            <button type="button" className="btn" onClick={() => void share()}>
              {shared ? 'Copied, ready to send' : 'Share your result'}
            </button>
            <span className="faint small">A new word comes at midnight.</span>
          </div>
        </div>
      ) : (
        <div className="fp-keys">
          {note && (
            <p className="fp-note" role="status">
              {note}
            </p>
          )}
          {open && (
            <div className="fp-vowels" aria-label={`Vowel forms of ${open.base}`}>
              {open.cells.map(cell => (
                <button key={cell.char} type="button" className="fp-key fp-vowel" onClick={() => add(cell.char)} lang="am">
                  {cell.char}
                  <small>{cell.roman || cell.vowel.roman}</small>
                </button>
              ))}
            </div>
          )}
          <div className="fp-consonants">
            {FIDEL.map(r => {
              const state = keyState(r.base);
              return (
                <button
                  key={r.base}
                  type="button"
                  className={`fp-key${state ? ` ${state}` : ''}${row === r.base ? ' on' : ''}`}
                  onClick={() => setRow(o => (o === r.base ? null : r.base))}
                  aria-expanded={row === r.base}
                  lang="am"
                >
                  {r.base}
                </button>
              );
            })}
          </div>
          <div className="fp-actions">
            <button type="button" className="btn btn-secondary" onClick={erase} disabled={!typed.length}>
              Delete
            </button>
            <button type="button" className="btn" onClick={enter}>
              Guess
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
