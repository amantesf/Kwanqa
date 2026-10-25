'use client';

// Write the ፊደል: watch a letter's strokes in order, trace them, then write it
// from memory. Uses Hanzi Writer (MIT) with Kwanqa's own stroke data for the
// 34 base letters (lib/fidelStrokes.json, made from Noto Sans Ethiopic: each
// stroke's centre line in writing order; a native speaker should confirm the
// order). Letters written without help get a ✓, kept in this browser.

import { useEffect, useRef, useState } from 'react';
import type HanziWriter from 'hanzi-writer';
import type { CharacterJson } from 'hanzi-writer';
import { FIDEL } from '@/lib/fidel';

type Mode = 'watch' | 'trace' | 'memory';

const DONE_KEY = 'kwanqa-fidel-written';
const MUTE_KEY = 'kwanqa-sound-off';

// the base letters, in chart order (one per family)
const LETTERS = FIDEL.map(row => ({ char: row.base, roman: row.cells[0].roman, name: row.name, audio: row.cells[0].audio }));

function readDone(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(DONE_KEY) ?? '[]'));
  } catch {
    return new Set();
  }
}

function effect(kind: 'correct' | 'wrong') {
  try {
    if (localStorage.getItem(MUTE_KEY) === '1') return;
    const a = new Audio(`/sounds/${kind}.mp3`);
    a.volume = 0.5;
    void a.play().catch(() => {});
  } catch {
    // no sound is fine
  }
}

function SpeakerIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" />
      <path d="M15.5 9a4 4 0 0 1 0 6" />
      <path d="M18 6.5a7.5 7.5 0 0 1 0 11" />
    </svg>
  );
}

export default function FidelWrite() {
  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState<Mode>('watch');
  const [message, setMessage] = useState('');
  const [finished, setFinished] = useState<{ mistakes: number } | null>(null);
  const [done, setDone] = useState<Set<string>>(new Set());
  const [strokeCount, setStrokeCount] = useState(0);
  const [ready, setReady] = useState(false);

  const box = useRef<HTMLDivElement>(null);
  const writer = useRef<HanziWriter | null>(null);
  const data = useRef<Record<string, CharacterJson> | null>(null);

  const letter = LETTERS[index];

  // the ✓ marks live in this browser
  useEffect(() => {
    setDone(readDone());
  }, []);

  // load the library and the stroke data, then make the writer
  useEffect(() => {
    let alive = true;
    (async () => {
      const [{ default: Writer }, strokes] = await Promise.all([import('hanzi-writer'), import('@/lib/fidelStrokes.json')]);
      if (!alive || !box.current) return;
      data.current = strokes.default as Record<string, CharacterJson>;
      const size = box.current.clientWidth;
      writer.current = Writer.create(box.current, LETTERS[0].char, {
        width: size,
        height: size,
        padding: Math.round(size * 0.08),
        charDataLoader: (char: string) => data.current![char],
        showOutline: true,
        strokeColor: '#3c3c3c',
        outlineColor: '#e8e2dc',
        highlightColor: '#d2582e',
        drawingColor: '#1f5bd0',
        drawingWidth: Math.max(14, Math.round(size / 22)),
        strokeAnimationSpeed: 0.9,
        delayBetweenStrokes: 450,
        showHintAfterMisses: 2,
        leniency: 1.4,
      });
      setReady(true);
    })();
    const resize = new ResizeObserver(() => {
      const size = box.current?.clientWidth;
      if (size && writer.current) writer.current.updateDimensions({ width: size, height: size, padding: Math.round(size * 0.08) });
    });
    if (box.current) resize.observe(box.current);
    return () => {
      alive = false;
      resize.disconnect();
    };
  }, []);

  // switching letter or mode starts it fresh
  useEffect(() => {
    const w = writer.current;
    if (!ready || !w) return;
    let cancelled = false;
    setFinished(null);
    setStrokeCount(data.current?.[letter.char]?.strokes.length ?? 0);
    (async () => {
      w.cancelQuiz();
      await w.setCharacter(letter.char);
      if (cancelled) return;
      if (mode === 'watch') {
        setMessage('Watch the order, then try tracing it.');
        await w.showOutline();
        await w.animateCharacter();
        return;
      }
      if (mode === 'trace') await w.showOutline();
      else await w.hideOutline();
      await w.hideCharacter();
      if (cancelled) return;
      setMessage(mode === 'trace' ? 'Trace stroke 1 over the outline.' : 'Write it from memory, stroke 1 first.');
      w.quiz({
        onCorrectStroke: s => {
          setMessage(s.strokesRemaining ? `Good. Now stroke ${s.strokeNum + 2}.` : '');
        },
        onMistake: s => {
          effect('wrong');
          setMessage(
            s.mistakesOnStroke >= 2
              ? `Follow the highlighted stroke ${s.strokeNum + 1}.`
              : `Not quite. Try stroke ${s.strokeNum + 1} again, in the right direction.`,
          );
        },
        onComplete: ({ totalMistakes }) => {
          effect('correct');
          setFinished({ mistakes: totalMistakes });
          setMessage('');
          if (mode === 'memory' || totalMistakes === 0) {
            setDone(prev => {
              const next = new Set(prev).add(letter.char);
              try {
                localStorage.setItem(DONE_KEY, JSON.stringify([...next]));
              } catch {
                // fine without saving
              }
              return next;
            });
          }
        },
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [ready, index, mode, letter.char]);

  function play() {
    const a = new Audio(letter.audio);
    void a.play().catch(() => {});
  }

  function pick(i: number) {
    setIndex(i);
    setMode('watch');
  }

  return (
    <div className="fw">
      <div className="fw-letters" role="listbox" aria-label="Letters to write">
        {LETTERS.map((l, i) => (
          <button
            key={l.char}
            type="button"
            role="option"
            aria-selected={i === index}
            className={`fw-letter${i === index ? ' on' : ''}${done.has(l.char) ? ' done' : ''}`}
            onClick={() => pick(i)}
          >
            <span lang="am">{l.char}</span>
            <small>{l.roman || 'a'}</small>
          </button>
        ))}
      </div>

      <div className="fw-card">
        <div className="fw-head">
          <div>
            <h2 lang="am">{letter.char}</h2>
            <p>
              <strong>{letter.roman || 'vowel carrier'}</strong> · {letter.name} · {strokeCount} {strokeCount === 1 ? 'stroke' : 'strokes'}
            </p>
          </div>
          <button type="button" className="fw-speak" onClick={play} aria-label={`Hear ${letter.char}`}>
            <SpeakerIcon />
          </button>
        </div>

        <div className="fw-paper">
          <div ref={box} className="fw-box" />
        </div>

        <p className="fw-message" aria-live="polite">
          {finished ? (
            <>
              <strong lang="am">ጎበዝ!</strong>{' '}
              {finished.mistakes === 0
                ? 'Written perfectly.'
                : `Done, with ${finished.mistakes} ${finished.mistakes === 1 ? 'slip' : 'slips'}. Try it from memory next.`}
            </>
          ) : (
            message || ' '
          )}
        </p>

        <div className="fw-modes" role="group" aria-label="How to practise">
          {(['watch', 'trace', 'memory'] as Mode[]).map(m => (
            <button key={m} type="button" className={`fw-mode${mode === m ? ' on' : ''}`} onClick={() => setMode(m)} aria-pressed={mode === m}>
              {m === 'watch' ? 'Watch' : m === 'trace' ? 'Trace' : 'From memory'}
            </button>
          ))}
          <button
            type="button"
            className="btn btn-sm fw-next"
            onClick={() => pick((index + 1) % LETTERS.length)}
          >
            Next letter
          </button>
        </div>
      </div>
    </div>
  );
}
