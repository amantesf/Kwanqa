'use client';

// Write the ፊደል: watch a letter's strokes in order, trace them, then write it
// from memory. Uses Hanzi Writer (MIT) with Kwanqa's own stroke data for all
// seven forms of every family, one file per family in public/fidel-strokes/
// (made from Noto Sans Ethiopic: each stroke's centre line in writing order,
// the six vowel forms following their base letter's order with the vowel mark
// last; a native speaker should confirm the order). Letters written without
// help get a ✓, kept in this browser.

import { useEffect, useRef, useState } from 'react';
import type HanziWriter from 'hanzi-writer';
import { FIDEL, VOWELS } from '@/lib/fidel';
import { loadFamily, loadLetter } from '@/lib/fidelStrokes';

type Mode = 'watch' | 'trace' | 'memory';

const DONE_KEY = 'kwanqa-fidel-written';
const MUTE_KEY = 'kwanqa-sound-off';

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
  const [row, setRow] = useState(0);
  const [form, setForm] = useState(0);
  const [mode, setMode] = useState<Mode>('watch');
  const [message, setMessage] = useState('');
  const [finished, setFinished] = useState<{ mistakes: number } | null>(null);
  const [done, setDone] = useState<Set<string>>(new Set());
  const [strokeCount, setStrokeCount] = useState(0);
  const [ready, setReady] = useState(false);

  const box = useRef<HTMLDivElement>(null);
  const writer = useRef<HanziWriter | null>(null);

  const family = FIDEL[row];
  const cell = family.cells[form];
  const vowel = VOWELS[form];

  // the ✓ marks live in this browser
  useEffect(() => {
    setDone(readDone());
  }, []);

  // load the library and make the writer
  useEffect(() => {
    let alive = true;
    (async () => {
      const [{ default: Writer }] = await Promise.all([import('hanzi-writer'), loadFamily(FIDEL[0].base)]);
      if (!alive || !box.current) return;
      const size = box.current.clientWidth;
      writer.current = Writer.create(box.current, FIDEL[0].base, {
        width: size,
        height: size,
        padding: Math.round(size * 0.08),
        charDataLoader: loadLetter,
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
    setMessage('');
    (async () => {
      w.cancelQuiz();
      const strokes = await loadFamily(family.base).catch(() => null);
      if (cancelled) return;
      setStrokeCount(strokes?.[cell.char]?.strokes.length ?? 0);
      await w.setCharacter(cell.char);
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
              const next = new Set(prev).add(cell.char);
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
  }, [ready, mode, family.base, cell.char]);

  function play() {
    void new Audio(cell.audio).play().catch(() => {});
  }

  function pick(r: number, f = 0) {
    setRow(r);
    setForm(f);
    setMode('watch');
  }

  function next() {
    if (form < 6) pick(row, form + 1);
    else pick((row + 1) % FIDEL.length, 0);
  }

  const familyDone = (r: number) => FIDEL[r].cells.filter(c => done.has(c.char)).length;

  return (
    <div className="fw">
      <div className="fw-letters" role="listbox" aria-label="Letter families">
        {FIDEL.map((f, r) => (
          <button
            key={f.base}
            type="button"
            role="option"
            aria-selected={r === row}
            className={`fw-letter${r === row ? ' on' : ''}${familyDone(r) === 7 ? ' done' : ''}`}
            onClick={() => pick(r)}
          >
            <span lang="am">{f.base}</span>
            <small>{f.cells[0].roman || 'a'}</small>
            {familyDone(r) > 0 && familyDone(r) < 7 && <i className="fw-part">{familyDone(r)}/7</i>}
          </button>
        ))}
      </div>

      <div className="fw-card">
        <div className="fw-forms" role="tablist" aria-label={`The seven forms of ${family.base}`}>
          {family.cells.map((c, k) => (
            <button
              key={c.char}
              type="button"
              role="tab"
              aria-selected={k === form}
              className={`fw-form${k === form ? ' on' : ''}${done.has(c.char) ? ' done' : ''}`}
              onClick={() => pick(row, k)}
            >
              <span lang="am">{c.char}</span>
              <small>{c.roman || '·'}</small>
            </button>
          ))}
        </div>

        <div className="fw-head">
          <div>
            <h2 lang="am">{cell.char}</h2>
            <p>
              <strong>{cell.roman || vowel.roman}</strong> · {vowel.hint} · {strokeCount} {strokeCount === 1 ? 'stroke' : 'strokes'}
            </p>
          </div>
          <button type="button" className="fw-speak" onClick={play} aria-label={`Hear ${cell.char}`}>
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
          <button type="button" className="btn btn-sm fw-next" onClick={next}>
            {form < 6 ? 'Next form' : 'Next letter'}
          </button>
        </div>
      </div>
    </div>
  );
}
