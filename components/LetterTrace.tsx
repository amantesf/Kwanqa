'use client';

// "Trace the new letter" in a lesson: the letter's outline, traced stroke by
// stroke with a finger or the mouse (Hanzi Writer with Kwanqa's stroke data,
// like the alphabet page's Write tab). Walia says the letter first. Finishing
// the trace answers the question; a letter whose strokes can't load is skipped.

import { useEffect, useRef, useState } from 'react';
import type HanziWriter from 'hanzi-writer';
import { loadLetter } from '@/lib/fidelStrokes';
import type { TraceExercise } from '@/lib/letterLessons';
import { useTheme } from '@/lib/theme';

export default function LetterTrace({
  exercise,
  onSay,
  onMistake,
  onDone,
}: {
  exercise: TraceExercise;
  /** Say the letter (does nothing when sound is off). */
  onSay: (text: string) => void;
  onMistake: () => void;
  /** Traced it (or the strokes couldn't load, so there's nothing to trace). */
  onDone: () => void;
}) {
  const box = useRef<HTMLDivElement>(null);
  const writer = useRef<HanziWriter | null>(null);
  const [message, setMessage] = useState('Watch first, then trace stroke 1.');
  const [finished, setFinished] = useState(false);
  const dark = useTheme() === 'dark';
  // the latest callbacks, without restarting the trace when the parent re-renders
  const calls = useRef({ onSay, onMistake, onDone });
  useEffect(() => {
    calls.current = { onSay, onMistake, onDone };
  });

  useEffect(() => {
    let alive = true;
    const el = box.current;
    (async () => {
      const { default: Writer } = await import('hanzi-writer');
      if (!alive || !el) return;
      el.innerHTML = '';
      const size = Math.min(el.clientWidth || 240, 260);
      const w = Writer.create(el, exercise.char, {
        width: size,
        height: size,
        padding: Math.round(size * 0.08),
        charDataLoader: (char, onLoad, onError) =>
          loadLetter(char, onLoad, err => {
            onError(err);
            // no strokes for this letter: nothing to trace, so move on
            if (alive) calls.current.onDone();
          }),
        showOutline: true,
        strokeColor: dark ? '#eef3f6' : '#3c3c3c',
        outlineColor: dark ? '#2e3c43' : '#e8e2dc',
        highlightColor: '#d2582e',
        drawingColor: dark ? '#4f8ff2' : '#1f5bd0',
        drawingWidth: Math.max(14, Math.round(size / 18)),
        strokeAnimationSpeed: 1,
        delayBetweenStrokes: 350,
        showHintAfterMisses: 2,
        leniency: 1.5,
      });
      writer.current = w;
      calls.current.onSay(exercise.char);
      // show how it's written once, then hand over
      await w.animateCharacter();
      if (!alive) return;
      await w.hideCharacter();
      setMessage('Trace stroke 1 over the outline.');
      w.quiz({
        onCorrectStroke: s => setMessage(s.strokesRemaining ? `Good. Now stroke ${s.strokeNum + 2}.` : ''),
        onMistake: s => {
          calls.current.onMistake();
          setMessage(
            s.mistakesOnStroke >= 2
              ? `Follow the highlighted stroke ${s.strokeNum + 1}.`
              : `Not quite. Try stroke ${s.strokeNum + 1} again, in the right direction.`,
          );
        },
        onComplete: () => {
          setFinished(true);
          setMessage('');
          calls.current.onDone();
        },
      });
    })();
    return () => {
      alive = false;
      writer.current?.cancelQuiz();
    };
    // a new letter (or theme) starts it fresh
  }, [exercise.char, dark]);

  return (
    <div className="letter-trace">
      <div className="letter-trace-card">
        <div ref={box} className="letter-trace-box" aria-label={`Trace the letter ${exercise.char}`} />
        <div className="letter-trace-side">
          <span className="letter-trace-char" lang="am">
            {exercise.char}
          </span>
          <span className="letter-trace-sound">“{exercise.sound}”</span>
          {exercise.word && (
            <span className="letter-trace-word">
              as in <span lang="am">{exercise.word}</span>
              {exercise.meaning && <> · {exercise.meaning}</>}
            </span>
          )}
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => onSay(exercise.char)}>
            Hear it
          </button>
        </div>
      </div>
      <p className="letter-trace-message" aria-live="polite">
        {finished ? 'Nicely written!' : message}
      </p>
    </div>
  );
}
