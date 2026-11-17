'use client';

// "Act it out": the lesson's mini-dialogue as a conversation that flows down
// the page. Walia's lines appear and are read aloud; on your turn you pick the
// right reply or type the missing word, and the chat moves on. Built by
// lib/conversation.ts.

import { useEffect, useRef, useState } from 'react';
import Mascot from '@/components/Mascot';
import Peek from '@/components/Peek';
import SayButton, { say } from '@/components/SayButton';
import { buildScene, type Said, type Turn } from '@/lib/conversation';
import type { LessonSection, Track } from '@/lib/courses';
import { typedMatches } from '@/lib/interactive';

type Shown = { who: 'them' | 'you' | 'note'; said?: Said; text?: string };

function Bubble({ shown, track, hornScale }: { shown: Shown; track: Track; hornScale: number }) {
  if (shown.who === 'note') return <p className="dp-note">{shown.text}</p>;
  const line = shown.said!;
  const theirs = shown.who === 'them';
  return (
    <div className={`dp-line ${shown.who}`}>
      {theirs && <Mascot pose="happy" size={44} title="Walia" hornScale={hornScale} />}
      <div className="dp-bubble">
        <span className="dp-learn" lang={track === 'english' ? undefined : 'am'}>
          {line.learn}
        </span>
        {line.roman && <span className="dp-roman">{line.roman}</span>}
        <Peek track={track} className="dp-meaning">
          {line.meaning}
        </Peek>
      </div>
      <SayButton text={line.learn} track={track} size={15} className="dp-say" />
    </div>
  );
}

export default function DialoguePlay({
  lesson,
  courseLessons,
  track,
  hornScale,
  onClose,
}: {
  lesson: LessonSection;
  courseLessons: LessonSection[];
  track: Track;
  hornScale: number;
  onClose: () => void;
}) {
  // built once, when the learner opens it (it shuffles, so never on the server)
  const [scene, setScene] = useState(() => buildScene(lesson, courseLessons, track));
  const [shown, setShown] = useState<Shown[]>([]);
  const [at, setAt] = useState(0); // the turn we're on
  const [typed, setTyped] = useState('');
  const [tries, setTries] = useState(0);
  const [hint, setHint] = useState('');
  const [wrong, setWrong] = useState<string | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const end = useRef<HTMLDivElement>(null);

  const turns = scene?.turns ?? [];
  const turn: Turn | undefined = turns[at];
  const done = !!scene && at >= turns.length;

  // Walia's lines and the notes play by themselves, one after another.
  useEffect(() => {
    if (!turn || (turn.kind !== 'them' && turn.kind !== 'note')) return;
    const t = window.setTimeout(
      () => {
        if (turn.kind === 'them') {
          setShown(s => [...s, { who: 'them', said: turn.said }]);
          say(turn.said.learn, track);
        } else {
          setShown(s => [...s, { who: 'note', text: turn.text }]);
        }
        setAt(a => a + 1);
      },
      at === 0 ? 300 : 900,
    );
    return () => window.clearTimeout(t);
  }, [turn, at, track]);

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [shown, at]);

  if (!scene) return null;

  function answered(line: Said) {
    setShown(s => [...s, { who: 'you', said: line }]);
    setHint('');
    setTyped('');
    setTries(0);
    setAt(a => a + 1);
  }

  function miss(key: string, message: string) {
    setWrong(key);
    setHint(message);
    setMistakes(m => m + 1);
    window.setTimeout(() => setWrong(null), 450);
  }

  function pick(option: Said) {
    if (turn?.kind !== 'choose') return;
    if (option.learn === turn.said.learn) return answered(option);
    miss(option.learn, `Not quite: that one means “${option.meaning}”. What would you say back?`);
  }

  function check() {
    if (turn?.kind !== 'fill' || !typed.trim()) return;
    if (typedMatches(turn.accept, typed)) return answered(turn.said);
    const n = tries + 1;
    setTries(n);
    if (n >= 3) {
      // after three tries, show it and move on
      setHint(`It was ${turn.accept.join(' (')}${turn.accept.length > 1 ? ')' : ''}.`);
      window.setTimeout(() => answered(turn.said), 1600);
      return;
    }
    miss('typed', n === 1 ? `Not quite. It starts with ${turn.hint}` : `Close? The whole line means “${turn.said.meaning}”.`);
  }

  function restart() {
    setScene(buildScene(lesson, courseLessons, track));
    setShown([]);
    setAt(0);
    setMistakes(0);
    setHint('');
  }

  return (
    <div className="dp">
      <div className="dp-scene">
        <p className="dp-scene-title">{scene.title}</p>
        <p className="dp-scene-text">{scene.setting}</p>
      </div>

      <div className="dp-chat" aria-live="polite">
        {shown.map((s, i) => (
          <Bubble key={i} shown={s} track={track} hornScale={hornScale} />
        ))}
        {turn?.kind === 'fill' && (
          <div className="dp-line you dp-draft" aria-hidden>
            <div className="dp-bubble">
              <span className="dp-learn" lang={track === 'english' ? undefined : 'am'}>
                {turn.words.map((w, i) => (i === turn.blank ? <span key={i} className="dp-blank">{typed || ' '}</span> : <span key={i}>{w} </span>))}
              </span>
            </div>
          </div>
        )}
        <div ref={end} />
      </div>

      <div className="dp-turn">
        {hint && (
          <p className="dp-hint" role="status">
            {hint}
          </p>
        )}

        {turn?.kind === 'choose' && (
          <>
            <p className="dp-task">Your turn. What do you say?</p>
            <div className="dp-options">
              {turn.options.map(o => (
                <button key={o.learn} type="button" className={`dp-option${wrong === o.learn ? ' wrong' : ''}`} onClick={() => pick(o)}>
                  <span lang={track === 'english' ? undefined : 'am'}>{o.learn}</span>
                  {o.roman && <small>{o.roman}</small>}
                </button>
              ))}
            </div>
          </>
        )}

        {turn?.kind === 'fill' && (
          <form
            className="dp-fill"
            onSubmit={e => {
              e.preventDefault();
              check();
            }}
          >
            <p className="dp-task">
              Your turn. Type the missing word{track === 'amharic' ? ', in ፊደል or Latin letters' : ''}.
            </p>
            <div className="dp-fill-row">
              <input
                className={wrong === 'typed' ? 'wrong' : undefined}
                value={typed}
                onChange={e => setTyped(e.target.value)}
                placeholder={track === 'amharic' ? 'e.g. selam or ሰላም' : 'Type the word'}
                autoFocus
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                aria-label="The missing word"
              />
              <button type="submit" className="btn" disabled={!typed.trim()}>
                Check
              </button>
            </div>
          </form>
        )}

        {done && (
          <div className="dp-done">
            <p className="dp-task">{mistakes === 0 ? 'Perfect conversation!' : 'Conversation done!'}</p>
            <p className="muted small">
              {mistakes === 0 ? 'You answered every line right the first time.' : `You got there, with ${mistakes} ${mistakes === 1 ? 'slip' : 'slips'} on the way.`}
            </p>
            <div className="row">
              <button type="button" className="btn btn-secondary" onClick={restart}>
                Play again
              </button>
              <button type="button" className="btn" onClick={onClose}>
                Back to the dialogue
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
