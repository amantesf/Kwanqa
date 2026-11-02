'use client';

// The screens for lib/interactive.ts's questions: speak into the microphone,
// type what you hear, put a conversation in order, and chat with Walia.
// The lesson screen (Practice) owns the hearts, the Check button and the
// feedback bar; these draw the question and report back.

import { useEffect, useRef, useState } from 'react';
import Mascot from '@/components/Mascot';
import { startRecording, type Recording } from '@/lib/recorder';
import { supabase } from '@/lib/supabase';
import { spokenRight, type ChatExercise, type OrderExercise, type SpeakExercise } from '@/lib/interactive';

const SPEAKER = (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
    <path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" />
    <path d="M16 8.5a5 5 0 0 1 0 7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

// ---------------------------------------------------------------------------
// Speak this

const MIC = (
  <svg width="34" height="34" viewBox="0 0 24 24" aria-hidden>
    <rect x="8.5" y="2.5" width="7" height="12" rx="3.5" fill="currentColor" />
    <path d="M5 11a7 7 0 0 0 14 0M12 18v3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

/** How many times a learner can try before Walia moves on. */
const SPEAK_TRIES = 2;

export function SpeakQuestion({
  exercise,
  english,
  onSay,
  onCorrect,
  onGiveUp,
  onUnavailable,
}: {
  exercise: SpeakExercise;
  /** English course: Amharic first in the labels. */
  english: boolean;
  onSay: (text: string) => void;
  onCorrect: () => void;
  /** Two tries that didn't match: move on without losing a heart. */
  onGiveUp: () => void;
  /** No microphone, no permission, or listening isn't set up: skip speaking questions. */
  onUnavailable: (reason: string) => void;
}) {
  const [state, setState] = useState<'ready' | 'recording' | 'checking'>('ready');
  const [heard, setHeard] = useState<string | null>(null);
  const [tries, setTries] = useState(0);
  const [level, setLevel] = useState(0);
  const rec = useRef<Recording | null>(null);
  const t = (en: string, am: string) => (english ? `${am} · ${en}` : en);

  // the level bars follow the voice while recording
  useEffect(() => {
    if (state !== 'recording') return;
    const timer = window.setInterval(() => setLevel(rec.current?.level() ?? 0), 80);
    return () => window.clearInterval(timer);
  }, [state]);
  useEffect(() => () => rec.current?.cancel(), []);

  async function start() {
    setHeard(null);
    try {
      rec.current = await startRecording(() => void stop());
      setState('recording');
    } catch {
      onUnavailable(t('Your microphone isn’t available, so we’ll skip speaking for now.', 'ማይክሮፎን አልተገኘም'));
    }
  }

  async function stop() {
    const r = rec.current;
    rec.current = null;
    if (!r) return;
    setState('checking');
    try {
      const wav = await r.stop();
      const token = (await supabase?.auth.getSession())?.data.session?.access_token;
      const res = await fetch(exercise.lang === 'en' ? '/api/listen?lang=en' : '/api/listen', {
        method: 'POST',
        headers: { 'Content-Type': 'audio/wav', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: wav,
      });
      const data = (await res.json()) as { text?: string; error?: string };
      if (res.status === 401 || res.status === 503) {
        onUnavailable(data.error ?? t('Speaking practice isn’t available right now.', 'የንግግር ልምምድ አሁን የለም'));
        return;
      }
      if (!res.ok) throw new Error(data.error);
      const said = data.text ?? '';
      if (spokenRight(exercise, said)) {
        setState('ready');
        setHeard(null);
        onCorrect();
        return;
      }
      const used = tries + 1;
      setTries(used);
      setHeard(said);
      setState('ready');
      if (used >= SPEAK_TRIES) onGiveUp();
    } catch {
      setHeard('');
      setState('ready');
    }
  }

  const bars = [0.5, 0.8, 1, 0.8, 0.5].map(k => Math.max(0.15, Math.min(1, level * 1.6 * k)));

  return (
    <div className="speak">
      <div className="practice-ask">
        <div className="practice-walia" aria-hidden>
          <Mascot mood={state === 'recording' ? 'thinking' : undefined} size={110} />
        </div>
        <div className="prompt-bubble has-audio">
          <button type="button" className="prompt-speak" onClick={() => onSay(exercise.prompt)} aria-label="Hear it">
            <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden>
              <path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" />
              <path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </button>
          <span className="prompt-main" lang={exercise.lang}>
            {exercise.prompt}
          </span>
          {exercise.promptHint && <span className="prompt-hint">{exercise.promptHint}</span>}
        </div>
      </div>

      <button
        type="button"
        className={`speak-mic ${state}`}
        onClick={() => (state === 'recording' ? void stop() : state === 'ready' ? void start() : undefined)}
        disabled={state === 'checking'}
        aria-label={state === 'recording' ? 'Stop recording' : 'Start speaking'}
      >
        {state === 'recording' ? (
          <span className="speak-bars" aria-hidden>
            {bars.map((h, i) => (
              <span key={i} style={{ transform: `scaleY(${h})` }} />
            ))}
          </span>
        ) : (
          MIC
        )}
        <span className="speak-mic-label">
          {state === 'recording'
            ? t('Tap when you’re done', 'ሲጨርሱ ይንኩ')
            : state === 'checking'
              ? t('Walia is listening…', 'ዋሊያ እያዳመጠ ነው…')
              : tries > 0 || heard !== null
                ? t('Try again', 'እንደገና ይሞክሩ')
                : t('Tap and speak', 'ይንኩና ይናገሩ')}
        </span>
      </button>

      <p className="speak-heard" aria-live="polite">
        {heard === ''
          ? t('Walia didn’t catch that. Speak a little louder?', 'ዋሊያ አልሰማም። ትንሽ ጮክ ብለው ይናገሩ?')
          : heard
            ? t(`Walia heard “${heard}”. Listen again and give it another go!`, `ዋሊያ “${heard}” ሰማ። እንደገና ያዳምጡና ይሞክሩ!`)
            : ' '}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Type what you hear

export function TypeAnswer({
  value,
  onChange,
  onSubmit,
  placeholder,
  disabled,
  state,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder: string;
  disabled: boolean;
  state: '' | 'good' | 'bad';
}) {
  const input = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (!disabled) input.current?.focus();
  }, [disabled]);
  return (
    <textarea
      ref={input}
      className={`type-answer${state ? ` ${state}` : ''}`}
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      rows={2}
      autoCapitalize="off"
      autoComplete="off"
      autoCorrect="off"
      spellCheck={false}
      onChange={e => onChange(e.target.value)}
      onKeyDown={e => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          e.stopPropagation();
          onSubmit();
        }
      }}
      aria-label="Your answer"
    />
  );
}

// ---------------------------------------------------------------------------
// Put the conversation in order

export function OrderQuestion({
  exercise,
  picked,
  onPick,
  onUnpick,
  onSay,
  disabled,
  state,
}: {
  exercise: OrderExercise;
  /** Lines placed so far, as indices into exercise.lines. */
  picked: number[];
  onPick: (line: number) => void;
  onUnpick: (line: number) => void;
  onSay: (text: string) => void;
  disabled: boolean;
  state: '' | 'good' | 'bad';
}) {
  return (
    <div className={`order${state ? ` ${state}` : ''}`}>
      <ol className="order-answer" aria-label="The conversation so far">
        {picked.map((i, n) => {
          const line = exercise.lines[i];
          return (
            <li key={i} className={`order-line placed side-${line.speaker}`}>
              <button type="button" disabled={disabled} onClick={() => onUnpick(i)}>
                <span className="order-num">{n + 1}</span>
                <span className="order-text">
                  {line.text}
                  {line.hint && <small>{line.hint}</small>}
                </span>
              </button>
            </li>
          );
        })}
        {picked.length < exercise.lines.length && (
          <li className="order-slot" aria-hidden>
            {picked.length + 1}
          </li>
        )}
      </ol>
      <div className="order-bank">
        {exercise.offered.map(i => {
          const line = exercise.lines[i];
          const used = picked.includes(i);
          return (
            <div key={i} className={`order-card${used ? ' used' : ''}`}>
              <button
                type="button"
                className="order-pick"
                disabled={used || disabled}
                aria-hidden={used}
                onClick={() => {
                  onPick(i);
                  onSay(line.text);
                }}
              >
                <span className="order-text">
                  {line.text}
                  {line.hint && <small>{line.hint}</small>}
                </span>
              </button>
              {!used && (
                <button type="button" className="order-say" onClick={() => onSay(line.text)} aria-label="Hear this line">
                  {SPEAKER}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Chat with Walia

export function ChatRound({
  exercise,
  onSay,
  onMistake,
  onDone,
}: {
  exercise: ChatExercise;
  onSay: (text: string) => void;
  onMistake: () => void;
  onDone: () => void;
}) {
  const [turn, setTurn] = useState(0);
  const [wrong, setWrong] = useState<string | null>(null);
  const [typing, setTyping] = useState(true);
  const log = useRef<HTMLDivElement>(null);
  const current = exercise.turns[turn];
  const finished = turn >= exercise.turns.length;

  // Walia "types" for a moment, then says the line out loud
  useEffect(() => {
    if (finished) return;
    setTyping(true);
    const timer = window.setTimeout(() => {
      setTyping(false);
      onSay(exercise.turns[turn].walia);
    }, turn === 0 ? 300 : 900);
    return () => window.clearTimeout(timer);
    // a new turn starts the next line
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turn]);

  useEffect(() => {
    log.current?.scrollTo({ top: log.current.scrollHeight, behavior: 'smooth' });
  }, [turn, typing]);

  function pick(option: string) {
    if (!current || typing) return;
    onSay(option);
    if (option !== current.answer) {
      setWrong(option);
      onMistake();
      window.setTimeout(() => setWrong(null), 600);
      return;
    }
    setWrong(null);
    const next = turn + 1;
    setTurn(next);
    if (next >= exercise.turns.length) window.setTimeout(onDone, 700);
  }

  return (
    <div className="wchat">
      <div className="chat-log" ref={log}>
        {exercise.turns.slice(0, Math.min(turn + 1, exercise.turns.length)).map((t, i) => (
          <div key={i} className="chat-pair">
            {(i < turn || !typing) && (
              <div className="chat-row walia">
                <span className="chat-avatar" aria-hidden>
                  <Mascot pose="happy" size={40} />
                </span>
                <button type="button" className="chat-bubble walia" onClick={() => onSay(t.walia)}>
                  <span>{t.walia}</span>
                  {t.waliaHint && <small>{t.waliaHint}</small>}
                </button>
              </div>
            )}
            {i < turn && (
              <div className="chat-row you">
                <button type="button" className="chat-bubble you" onClick={() => onSay(t.answer)}>
                  <span>{t.answer}</span>
                  {t.hints?.[t.answer] && <small>{t.hints[t.answer]}</small>}
                </button>
              </div>
            )}
          </div>
        ))}
        {typing && !finished && (
          <div className="chat-row walia">
            <span className="chat-avatar" aria-hidden>
              <Mascot pose="happy" size={40} />
            </span>
            <span className="chat-bubble walia chat-typing" aria-label="Walia is typing">
              <i />
              <i />
              <i />
            </span>
          </div>
        )}
      </div>

      {!finished && (
        <div className="chat-options" aria-label="Your reply">
          {current.options.map(option => (
            <button
              key={option}
              type="button"
              className={`option chat-option${wrong === option ? ' wrong' : ''}`}
              disabled={typing}
              onClick={() => pick(option)}
            >
              <span className="option-text">
                {option}
                {current.hints?.[option] && <small className="option-hint">{current.hints[option]}</small>}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
