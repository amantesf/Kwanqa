'use client';

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { phraseAudio } from '@/lib/phraseAudio';
import GrassIcon from '@/components/GrassIcon';
import LessonComplete from '@/components/LessonComplete';
import Mascot, { type Mood } from '@/components/Mascot';
import {
  altitudeFor,
  completeLesson,
  hornLevel,
  REST_COST,
  spendGrass,
  trackTotals,
  useClimb,
} from '@/lib/climb';
import { courseCatalog } from '@/lib/courses';
import type { LessonSection, Track } from '@/lib/courses';
import { buildExercises, shuffle, type Exercise, type MatchExercise } from '@/lib/exercises';

const MAX_STAMINA = 5;
const STREAK_TO_RECOVER = 3;

type Phase = 'question' | 'feedback' | 'cheer' | 'rest' | 'done';

// Mid-lesson encouragement, like Duolingo's "Super impressive!": after this many
// correct answers in a row, Walia pops up with a few words of praise.
const CHEERS: Record<number, { amharic: string; transliteration: string; english: string }> = {
  3: { amharic: 'ጎበዝ!', transliteration: 'gobez!', english: 'Well done. 3 in a row!' },
  5: { amharic: 'በጣም ጥሩ!', transliteration: 'betam tiru!', english: 'Very good. 5 in a row!' },
  8: { amharic: 'ዋው!', transliteration: 'wow!', english: 'Super impressive. 8 in a row!' },
  12: { amharic: 'ጎበዝ ጎበዝ!', transliteration: 'gobez gobez!', english: 'Walia can’t keep up with you. 12 in a row!' },
};
type Reaction = { kind: 'slip' | 'hop'; n: number } | null;

function Hoof({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden className={`hoof${filled ? ' on' : ''}`}>
      <path d="M11 4 C 6 4, 4 9, 4.5 15 C 5 19, 7.5 21, 10 20 C 11.2 19.5, 11.2 17, 11 14 Z" />
      <path d="M13 4 C 18 4, 20 9, 19.5 15 C 19 19, 16.5 21, 14 20 C 12.8 19.5, 12.8 17, 13 14 Z" />
    </svg>
  );
}

// Answer sounds. Learners can mute them; the choice is remembered in this browser.
const SOUND_FILES = {
  correct: '/sounds/correct.mp3',
  wrong: '/sounds/wrong.mp3',
  complete: '/sounds/complete.mp3', // ta-da on the lesson-complete screen
} as const;
const MUTE_KEY = 'kwanqa-sound-off';

// The mute setting lives in localStorage; reading it through a store keeps the
// server render (always "on") and the browser in sync without a hydration mismatch.
const muteListeners = new Set<() => void>();

function readMuted() {
  try {
    return window.localStorage.getItem(MUTE_KEY) === '1';
  } catch {
    return false; // storage unavailable; sounds stay on
  }
}

let mutedFallback = false; // used when storage is unavailable

function subscribeMuted(listener: () => void) {
  muteListeners.add(listener);
  return () => muteListeners.delete(listener);
}

function useAnswerSounds() {
  const audio = useRef<Partial<Record<keyof typeof SOUND_FILES, HTMLAudioElement>>>({});
  const muted = useSyncExternalStore(
    subscribeMuted,
    () => readMuted() || mutedFallback,
    () => false,
  );

  useEffect(() => {
    // Load both sounds up front so the first answer plays instantly.
    for (const [kind, src] of Object.entries(SOUND_FILES)) {
      const el = new Audio(src);
      el.preload = 'auto';
      audio.current[kind as keyof typeof SOUND_FILES] = el;
    }
  }, []);

  function play(kind: keyof typeof SOUND_FILES) {
    if (muted) return;
    const el = audio.current[kind];
    if (!el) return;
    el.currentTime = 0;
    el.volume = 0.6;
    el.play().catch(() => {});
  }

  function toggle() {
    const next = !muted;
    mutedFallback = next;
    try {
      window.localStorage.setItem(MUTE_KEY, next ? '1' : '0');
    } catch {
      // storage unavailable; the setting lasts for this session only
    }
    muteListeners.forEach(l => l());
  }

  return { play, muted, toggle };
}

function SoundIcon({ muted }: { muted: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" />
      {muted ? (
        <path d="M16 9.5l5 5M21 9.5l-5 5" />
      ) : (
        <>
          <path d="M15.5 9a4 4 0 0 1 0 6" />
          <path d="M18 6.5a7.5 7.5 0 0 1 0 11" />
        </>
      )}
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
  onSay,
}: {
  exercise: MatchExercise;
  onMistake: () => void;
  onSolved: () => void;
  /** Say a card out loud when it's tapped (does nothing without a recording). */
  onSay?: (text: string) => void;
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
            onClick={() => {
              setLeft(p.left);
              onSay?.(p.left);
            }}
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
            onClick={() => {
              onSay?.(r);
              pickRight(r);
            }}
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
  track: trackProp,
}: {
  slug: string;
  lessonIndex: number;
  lesson: LessonSection;
  courseLessons: LessonSection[];
  onExit: () => void;
  onFinish: () => void;
  finishLabel: string;
  /** Which course this is; looked up from the catalog when not given. */
  track?: Track;
}) {
  const climb = useClimb();
  const track = trackProp ?? courseCatalog.find(c => c.slug === slug)?.track ?? 'amharic';
  const [initial] = useState(() =>
    buildExercises(lesson, courseLessons, track, slug === 'amharic-beginner-1' && lessonIndex === 0),
  );
  const [queue, setQueue] = useState<Exercise[]>(initial);
  const [solved, setSolved] = useState<Set<string>>(new Set());
  // Questions missed once: when they come back they're labelled "Previous mistake".
  const [missed, setMissed] = useState<Set<string>>(new Set());
  const [stamina, setStamina] = useState(MAX_STAMINA);
  const [streak, setStreak] = useState(0);
  const [combo, setCombo] = useState(0); // correct answers in a row; resets on any mistake
  const [mistakes, setMistakes] = useState(0);
  const [phase, setPhase] = useState<Phase>('question');
  const [choice, setChoice] = useState<string | null>(null);
  const [picked, setPicked] = useState<number[]>([]); // tiles tapped so far, in order
  const [lastCorrect, setLastCorrect] = useState(true);
  const [reaction, setReaction] = useState<Reaction>(null);
  const [earned, setEarned] = useState(0);
  const [hornsBefore] = useState(() => hornLevel(climb.grass).level);
  const [startedAt] = useState(() => Date.now()); // for the daily log's time spent
  // Altitude on this lesson's track, before and after, for the lesson-complete screen.
  const altitudeOf = (c: typeof climb) => {
    const t = trackTotals(c, track);
    return altitudeFor(t.done, t.total);
  };
  const [altitudeBefore] = useState(() => altitudeOf(climb));
  const altitudeNow = altitudeOf(climb);
  const sounds = useAnswerSounds();

  const current = queue[0];

  // A recording of the Amharic in the question, when we have one: it plays by
  // itself when the question appears (unless muted) and the speaker replays it.
  // Fill-in-the-blank questions keep quiet until answered, then say the whole line.
  const reveal = current?.kind === 'choice' && current.revealAudio ? current.revealAudio : null;
  // While answering they play only the part you can see (if recorded), never the answer.
  const promptAudio =
    !current || current.kind === 'match'
      ? null
      : reveal && phase === 'feedback'
        ? (phraseAudio(reveal) ?? phraseAudio(current.prompt))
        : phraseAudio(current.prompt);
  const voice = useRef<HTMLAudioElement | null>(null);
  function playClip(src: string | null) {
    if (!src) return;
    voice.current?.pause();
    const el = new Audio(src);
    voice.current = el;
    el.play().catch(() => {});
  }
  function playPrompt() {
    playClip(promptAudio);
  }
  /** Say an Amharic word or answer out loud when it's tapped, if we have a recording. */
  function sayAloud(text: string) {
    if (!sounds.muted) playClip(phraseAudio(text));
  }
  const promptKey = !promptAudio
    ? null
    : phase === 'question'
      ? `${current.id}:${queue.length}`
      : reveal && phase === 'feedback'
        ? `${current.id}:${queue.length}:reveal`
        : null;
  useEffect(() => {
    if (!promptKey || sounds.muted) return;
    playPrompt();
    // play once per question, not on every re-render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [promptKey]);
  const progress = initial.length ? solved.size / initial.length : 1;
  const horns = hornLevel(climb.grass);
  // Walia's face: puzzling over the question, then cheering or disappointed.
  // Matching rounds react pair by pair, so they follow the last tap instead.
  const mood: Mood =
    phase === 'feedback'
      ? lastCorrect
        ? 'cheer'
        : 'sad'
      : current?.kind === 'match' && reaction
        ? reaction.kind === 'hop'
          ? 'cheer'
          : 'sad'
        : 'thinking';

  function react(kind: 'slip' | 'hop') {
    setReaction(prev => ({ kind, n: (prev?.n ?? 0) + 1 }));
  }

  function loseStamina() {
    setCombo(0);
    setMistakes(m => m + 1);
    setStreak(0);
    react('slip');
    setStamina(s => Math.max(0, s - 1));
  }

  function gainStreak() {
    react('hop');
    setCombo(c => c + 1);
    const nextStreak = streak + 1;
    if (nextStreak >= STREAK_TO_RECOVER) {
      setStamina(s => Math.min(MAX_STAMINA, s + 1));
      setStreak(0);
    } else {
      setStreak(nextStreak);
    }
  }

  const builtAnswer = current?.kind === 'build' ? picked.map(i => current.tiles[i]) : [];
  const canCheck = current?.kind === 'choice' ? choice !== null : current?.kind === 'build' ? picked.length > 0 : false;

  function check() {
    if (!current || !canCheck) return;
    let correct: boolean;
    if (current.kind === 'choice') correct = choice === current.answer;
    else if (current.kind === 'build') correct = builtAnswer.join(' ') === current.answer.join(' ');
    else return;
    setLastCorrect(correct);
    sounds.play(correct ? 'correct' : 'wrong');
    if (correct) {
      gainStreak();
    } else {
      loseStamina();
    }
    setPhase('feedback');
  }

  function solveMatch() {
    setLastCorrect(true);
    sounds.play('correct');
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
      setMissed(m => new Set(m).add(current.id));
    }
    setSolved(nextSolved);
    setQueue(nextQueue);
    setChoice(null);
    setPicked([]);
    setReaction(null);

    if (nextQueue.length === 0) {
      // Every question was answered correctly once, plus each wrong try along the way.
      const work = { answers: initial.length + mistakes, correct: initial.length, seconds: (Date.now() - startedAt) / 1000 };
      setEarned(completeLesson(slug, lessonIndex, mistakes, work));
      sounds.play('complete');
      setPhase('done');
    } else if (stamina === 0) {
      setPhase('rest');
    } else if (lastCorrect && CHEERS[combo]) {
      setPhase('cheer');
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
      if (phase === 'done' && e.key === 'Enter') {
        e.preventDefault();
        onFinish();
        return;
      }
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
      } else if (phase === 'question' && current.kind === 'build') {
        if (e.key === 'Backspace') {
          setPicked(p => p.slice(0, -1)); // take back the last tile
        } else if (e.key === 'Enter' && picked.length) {
          e.preventDefault();
          check();
        }
      } else if (phase === 'feedback' && e.key === 'Enter') {
        e.preventDefault();
        advance();
      } else if (phase === 'cheer' && e.key === 'Enter') {
        e.preventDefault();
        setPhase('question');
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
    const answers = initial.length + mistakes;
    return (
      <LessonComplete
        earned={earned}
        accuracy={answers ? Math.round((initial.length / answers) * 100) : 100}
        altitude={altitudeNow}
        altitudeGain={Math.max(0, altitudeNow - altitudeBefore)}
        hornsGrew={horns.level > hornsBefore}
        note={lesson.note}
        finishLabel={finishLabel}
        onFinish={onFinish}
      />
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
          {canRest ? '' : '. Finish lessons to earn more'}.
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
        <button
          type="button"
          className="practice-sound"
          onClick={sounds.toggle}
          aria-pressed={!sounds.muted}
          aria-label={sounds.muted ? 'Turn sounds on' : 'Turn sounds off'}
          title={sounds.muted ? 'Sounds off' : 'Sounds on'}
        >
          <SoundIcon muted={sounds.muted} />
        </button>
        <div className="stamina" aria-label={`Stamina ${stamina} of ${MAX_STAMINA}`} title="Stamina (ጉልበት)">
          {Array.from({ length: MAX_STAMINA }, (_, i) => (
            <Hoof key={i} filled={i < stamina} />
          ))}
        </div>
      </div>

      <div className="practice-body">
        {phase === 'cheer' && CHEERS[combo] ? (
          <div className="practice-cheer" role="status">
            <div className="cheer-walia" aria-hidden>
              <Mascot pose="cheer" size={150} hornScale={horns.scale} animated />
            </div>
            <div className="cheer-bubble">
              <strong lang="am">{CHEERS[combo].amharic}</strong>
              <span className="cheer-tr">{CHEERS[combo].transliteration}</span>
              <span>{CHEERS[combo].english}</span>
            </div>
          </div>
        ) : (
        <div className="practice-question">
          {missed.has(current.id) && (
            <span className="practice-retry">
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
                <circle cx="12" cy="12" r="11" fill="currentColor" />
                <path
                  d="M7.5 11a4.6 4.6 0 0 1 8.2-2.4M16.5 13a4.6 4.6 0 0 1-8.2 2.4M15.9 5.8v3h-3M8.1 18.2v-3h3"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Previous mistake
            </span>
          )}
          <h2 className="practice-instruction">{current.instruction}</h2>

          {/* "Which one of these is “coffee”?" already says it all, so the cards come straight after */}
          {!(current.kind === 'choice' && current.pictures && !current.hideWords) && (
            <div className="practice-ask">
              <div key={`${mood}-${reaction?.n ?? 0}`} className="practice-walia" aria-hidden>
                <Mascot mood={mood} size={110} hornScale={horns.scale} />
              </div>
              {current.kind !== 'match' && (
                <div className={`prompt-bubble${promptAudio ? ' has-audio' : ''}`}>
                  {promptAudio && (
                    <button type="button" className="prompt-speak" onClick={playPrompt} aria-label="Play the Amharic again">
                      <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden>
                        <path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" />
                        <path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                      </svg>
                    </button>
                  )}
                  <span className="prompt-main">{current.prompt}</span>
                  {current.promptHint && <span className="prompt-hint">{current.promptHint}</span>}
                </div>
              )}
            </div>
          )}

          {current.kind === 'choice' ? (
            <>
              <div className={`options${current.pictures ? ' picture-options' : ''}`}>
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
                      onClick={() => {
                        setChoice(option);
                        sayAloud(option);
                      }}
                    >
                      {current.pictures?.[option] ? (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element -- small local pictures */}
                          <img className="picture-img" src={current.pictures[option].src} alt="" draggable={false} />
                          {current.hideWords && !reveal ? (
                            <span className="picture-word picture-word-hidden" aria-label={`Picture ${i + 1}`} />
                          ) : (
                            <span className="picture-word">
                              <span lang="am">{option}</span>
                              <small>{current.pictures[option].transliteration}</small>
                            </span>
                          )}
                          <span className="option-key">{i + 1}</span>
                        </>
                      ) : (
                        <>
                          <span className="option-key">{i + 1}</span>
                          {option}
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          ) : current.kind === 'build' ? (
            <div className={`build${phase === 'feedback' ? (lastCorrect ? ' good' : ' bad') : ''}`}>
              <div className="build-answer" aria-label="Your answer">
                {picked.map(i => (
                  <button
                    key={i}
                    type="button"
                    className="tile"
                    lang={track === 'english' ? 'en' : 'am'}
                    disabled={phase === 'feedback'}
                    onClick={() => setPicked(p => p.filter(x => x !== i))}
                  >
                    {current.tiles[i]}
                  </button>
                ))}
              </div>
              <div className="build-bank">
                {current.tiles.map((tile, i) => {
                  const used = picked.includes(i);
                  return (
                    <button
                      key={i}
                      type="button"
                      className={`tile${used ? ' used' : ''}`}
                      lang={track === 'english' ? 'en' : 'am'}
                      aria-hidden={used}
                      disabled={used || phase === 'feedback'}
                      onClick={() => {
                        setPicked(p => [...p, i]);
                        sayAloud(tile);
                      }}
                    >
                      {tile}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <MatchRound
              key={current.id + solved.size + queue.length}
              exercise={current}
              onSay={sayAloud}
              onMistake={() => {
                sounds.play('wrong');
                loseStamina();
                if (stamina <= 1) setPhase('rest');
              }}
              onSolved={solveMatch}
            />
          )}
        </div>
        )}
      </div>

      <div className={`practice-footer${phase === 'feedback' ? (lastCorrect ? ' good' : ' bad') : ''}`}>
        <div className="practice-footer-inner">
          {phase === 'cheer' ? (
            <>
              <span />
              <button type="button" className="btn" onClick={() => setPhase('question')} autoFocus>
                Continue
              </button>
            </>
          ) : phase === 'feedback' ? (
          <>
            <FeedbackIcon good={lastCorrect} />
            <div className="feedback-text">
              <strong>{lastCorrect ? 'Nice footing!' : 'Walia slipped!'}</strong>
              {current.kind !== 'match' && (
                <span>
                  {lastCorrect
                    ? current.explain
                    : `Correct answer: ${current.kind === 'build' ? current.answer.join(' ') : current.answer}. ${current.explain}`}
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
              {streak > 0 ? `${streak} in a row. ${STREAK_TO_RECOVER - streak} more to regain stamina` : ' '}
            </span>
            {current.kind !== 'match' && (
              <button type="button" className="btn" onClick={check} disabled={!canCheck}>
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
