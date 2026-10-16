'use client';

import { useEffect, useMemo, useState } from 'react';
import GrassIcon from '@/components/GrassIcon';
import Mascot from '@/components/Mascot';
import { completeLesson, hornLevel, REST_COST, spendGrass, useClimb } from '@/lib/climb';
import type { LessonSection } from '@/lib/courses';
import { buildExercises, shuffle, type Exercise, type MatchExercise } from '@/lib/exercises';

const MAX_STAMINA = 5;
const STREAK_TO_RECOVER = 3;

type Phase = 'question' | 'feedback' | 'rest' | 'done';
type Reaction = { kind: 'slip' | 'hop'; n: number } | null;

function Hoof({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden className={`hoof${filled ? ' on' : ''}`}>
      <path d="M11 4 C 6 4, 4 9, 4.5 15 C 5 19, 7.5 21, 10 20 C 11.2 19.5, 11.2 17, 11 14 Z" />
      <path d="M13 4 C 18 4, 20 9, 19.5 15 C 19 19, 16.5 21, 14 20 C 12.8 19.5, 12.8 17, 13 14 Z" />
    </svg>
  );
}

function FeedbackIcon({ good }: { good: boolean }) {
  return (
    <span className={`feedback-icon${good ? ' good' : ' bad'}`} aria-hidden>
      <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round">
        {good ? <path d="M5 12.5l4.5 4.5L19 7.5" /> : <path d="M7 7l10 10M17 7L7 17" />}
      </svg>
    </span>
  );
}

function MatchRound({
  exercise,
  onMistake,
  onSolved,
}: {
  exercise: MatchExercise;
  onMistake: () => void;
  onSolved: () => void;
}) {
  const rights = useMemo(() => shuffle(exercise.pairs.map(p => p.right)), [exercise]);
  const [left, setLeft] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrong, setWrong] = useState<string | null>(null);

  function pickRight(right: string) {
    if (!left) return;
    const pair = exercise.pairs.find(p => p.left === left);
    if (pair?.right === right) {
      const next = new Set(matched).add(left);
      setMatched(next);
      setLeft(null);
      if (next.size === exercise.pairs.length) onSolved();
    } else {
      setWrong(right);
      setLeft(null);
      onMistake();
      window.setTimeout(() => setWrong(null), 500);
    }
  }

  const matchedRights = new Set(
    exercise.pairs.filter(p => matched.has(p.left)).map(p => p.right),
  );

  return (
    <div className="match-grid">
      <div className="match-col">
        {exercise.pairs.map(p => (
          <button
            key={p.left}
            type="button"
            className={`option${left === p.left ? ' selected' : ''}${matched.has(p.left) ? ' matched' : ''}`}
            disabled={matched.has(p.left)}
            onClick={() => setLeft(p.left)}
          >
            {p.left}
          </button>
        ))}
      </div>
      <div className="match-col">
        {rights.map(r => (
          <button
            key={r}
            type="button"
            className={`option${matchedRights.has(r) ? ' matched' : ''}${wrong === r ? ' wrong' : ''}`}
            disabled={matchedRights.has(r) || !left}
            onClick={() => pickRight(r)}
          >
            {r}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Practice({
  slug,
  lessonIndex,
  lesson,
  courseLessons,
  onExit,
  onFinish,
  finishLabel,
}: {
  slug: string;
  lessonIndex: number;
  lesson: LessonSection;
  courseLessons: LessonSection[];
  onExit: () => void;
  onFinish: () => void;
  finishLabel: string;
}) {
  const climb = useClimb();
  const [initial] = useState(() => buildExercises(lesson, courseLessons));
  const [queue, setQueue] = useState<Exercise[]>(initial);
  const [solved, setSolved] = useState<Set<string>>(new Set());
  const [stamina, setStamina] = useState(MAX_STAMINA);
  const [streak, setStreak] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [phase, setPhase] = useState<Phase>('question');
  const [choice, setChoice] = useState<string | null>(null);
  const [lastCorrect, setLastCorrect] = useState(true);
  const [reaction, setReaction] = useState<Reaction>(null);
  const [earned, setEarned] = useState(0);
  const [hornsBefore] = useState(() => hornLevel(climb.grass).level);

  const current = queue[0];
  const progress = initial.length ? solved.size / initial.length : 1;
  const horns = hornLevel(climb.grass);

  function react(kind: 'slip' | 'hop') {
    setReaction(prev => ({ kind, n: (prev?.n ?? 0) + 1 }));
  }

  function loseStamina() {
    setMistakes(m => m + 1);
    setStreak(0);
    react('slip');
    setStamina(s => Math.max(0, s - 1));
  }

  function gainStreak() {
    react('hop');
    const nextStreak = streak + 1;
    if (nextStreak >= STREAK_TO_RECOVER) {
      setStamina(s => Math.min(MAX_STAMINA, s + 1));
      setStreak(0);
    } else {
      setStreak(nextStreak);
    }
  }

  function check() {
    if (!current || current.kind !== 'choice' || !choice) return;
    const correct = choice === current.answer;
    setLastCorrect(correct);
    if (correct) {
      gainStreak();
    } else {
      loseStamina();
    }
    setPhase('feedback');
  }

  function solveMatch() {
    setLastCorrect(true);
    gainStreak();
    setPhase('feedback');
  }

  function advance() {
    if (!current) return;
    const nextSolved = new Set(solved);
    let nextQueue = queue.slice(1);
    if (lastCorrect) {
      nextSolved.add(current.id);
    } else {
      nextQueue = [...nextQueue, current]; // missed questions come back later
    }
    setSolved(nextSolved);
    setQueue(nextQueue);
    setChoice(null);

    if (nextQueue.length === 0) {
      setEarned(completeLesson(slug, lessonIndex, mistakes));
      setPhase('done');
    } else if (stamina === 0) {
      setPhase('rest');
    } else {
      setPhase('question');
    }
  }

  function rest() {
    if (spendGrass(REST_COST)) {
      setStamina(MAX_STAMINA);
      setPhase('question');
    }
  }

  // Keyboard, like Duolingo: number keys pick an answer, Enter checks or continues.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (!current) return;
      if (phase === 'question' && current.kind === 'choice') {
        const n = Number(e.key);
        if (n >= 1 && n <= current.options.length) {
          setChoice(current.options[n - 1]);
          return;
        }
        if (e.key === 'Enter' && choice) {
          e.preventDefault();
          check();
        }
      } else if (phase === 'feedback' && e.key === 'Enter') {
        e.preventDefault();
        advance();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  // A lesson without phrases has nothing to quiz; finish it straight away.
  if (initial.length === 0 && phase !== 'done') {
    return (
      <div className="practice practice-screen practice-done">
        <p className="muted">This lesson has no practice yet.</p>
        <button
          type="button"
          className="btn"
          onClick={() => {
            setEarned(completeLesson(slug, lessonIndex, 0));
            setPhase('done');
          }}
        >
          Mark complete
        </button>
      </div>
    );
  }

  if (phase === 'done') {
    const grew = horns.level > hornsBefore;
    return (
      <div className="practice practice-screen practice-done">
        <Mascot pose="cheer" size={150} hornScale={horns.scale} className="floaty" />
        <h2 className="h2">Lesson complete!</h2>
        <div className="reward-row">
          <div className="reward">
            <span className="reward-label">Grass earned</span>
            <span className="reward-value">
              <GrassIcon size={26} /> +{earned}
            </span>
          </div>
          <div className="reward">
            <span className="reward-label">Mistakes</span>
            <span className="reward-value">{mistakes === 0 ? 'None!' : mistakes}</span>
          </div>
          <div className="reward">
            <span className="reward-label">Walia’s horns</span>
            <span className="reward-value">
              {horns.level}/{horns.max}
            </span>
          </div>
        </div>
        {grew && <p className="grew">Walia’s horns grew a new ridge!</p>}
        <button type="button" className="btn" style={{ minWidth: 260 }} onClick={onFinish}>
          {finishLabel}
        </button>
      </div>
    );
  }

  if (phase === 'rest') {
    const canRest = climb.grass >= REST_COST;
    return (
      <div className="practice practice-screen practice-done">
        <Mascot pose="happy" size={140} hornScale={horns.scale} />
        <h2 className="h2">Walia needs a rest</h2>
        <p className="lead" style={{ maxWidth: 460 }}>
          Out of stamina on this ledge. Graze to recover, or review the phrases and try again.
        </p>
        <div className="row" style={{ justifyContent: 'center' }}>
          <button type="button" className="btn" onClick={rest} disabled={!canRest}>
            Eat {REST_COST} grass
          </button>
          <button type="button" className="btn btn-secondary" onClick={onExit}>
            Review phrases
          </button>
        </div>
        <p className="faint small">
          You have <GrassIcon size={16} className="inline-icon" /> {climb.grass} grass
          {canRest ? '' : ' — finish lessons to earn more'}.
        </p>
      </div>
    );
  }

  return (
    <div className="practice practice-screen">
      <div className="practice-top">
        <button type="button" className="practice-close" onClick={onExit} aria-label="Leave practice">
          ✕
        </button>
        <div className="meter practice-meter" aria-label={`${Math.round(progress * 100)}% complete`}>
          <span style={{ width: `${progress * 100}%` }} />
        </div>
        <div className="stamina" aria-label={`Stamina ${stamina} of ${MAX_STAMINA}`} title="Stamina (ጉልበት)">
          {Array.from({ length: MAX_STAMINA }, (_, i) => (
            <Hoof key={i} filled={i < stamina} />
          ))}
        </div>
      </div>

      <div className="practice-body">
        <div className="practice-question">
          <h2 className="practice-instruction">{current.instruction}</h2>

          <div className="practice-ask">
            <div
              key={reaction?.n ?? 0}
              className={`practice-walia${reaction ? ` ${reaction.kind}` : ''}`}
              aria-hidden
            >
              <Mascot pose={reaction?.kind === 'hop' ? 'cheer' : 'happy'} size={110} hornScale={horns.scale} />
            </div>
            {current.kind === 'choice' && (
              <div className="prompt-bubble">
                <span className="prompt-main">{current.prompt}</span>
                {current.promptHint && <span className="prompt-hint">{current.promptHint}</span>}
              </div>
            )}
          </div>

          {current.kind === 'choice' ? (
            <>
              <div className="options">
                {current.options.map((option, i) => {
                  const reveal = phase === 'feedback';
                  const state = reveal
                    ? option === current.answer
                      ? ' correct'
                      : option === choice
                        ? ' wrong'
                        : ''
                    : option === choice
                      ? ' selected'
                      : '';
                  return (
                    <button
                      key={option}
                      type="button"
                      className={`option${state}`}
                      disabled={reveal}
                      onClick={() => setChoice(option)}
                    >
                      <span className="option-key">{i + 1}</span>
                      {option}
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <MatchRound
              key={current.id + solved.size + queue.length}
              exercise={current}
              onMistake={() => {
                loseStamina();
                if (stamina <= 1) setPhase('rest');
              }}
              onSolved={solveMatch}
            />
          )}
        </div>
      </div>

      <div className={`practice-footer${phase === 'feedback' ? (lastCorrect ? ' good' : ' bad') : ''}`}>
        <div className="practice-footer-inner">
          {phase === 'feedback' ? (
          <>
            <FeedbackIcon good={lastCorrect} />
            <div className="feedback-text">
              <strong>{lastCorrect ? 'Nice footing!' : 'Walia slipped!'}</strong>
              {current.kind === 'choice' && (
                <span>
                  {lastCorrect ? current.explain : `Correct answer: ${current.answer}. ${current.explain}`}
                </span>
              )}
              {!lastCorrect && <span className="faint small">This one will come back later.</span>}
            </div>
            <button type="button" className={`btn${lastCorrect ? '' : ' btn-danger'}`} onClick={advance}>
              Continue
            </button>
          </>
        ) : (
          <>
            <span className="faint small">
              {streak > 0 ? `${streak} in a row — ${STREAK_TO_RECOVER - streak} more to regain stamina` : ' '}
            </span>
            {current.kind === 'choice' && (
              <button type="button" className="btn" onClick={check} disabled={!choice}>
                Check
              </button>
            )}
          </>
          )}
        </div>
      </div>
    </div>
  );
}
