'use client';

// The call screen for Talk with Walia. Walia says a line (Azure, Ameha's voice),
// the learner taps the mic and answers out loud, Azure writes down what it
// heard, and lib/conversations.ts decides whether it fits.

import { useEffect, useRef, useState } from 'react';
import Mascot, { type Mood } from '@/components/Mascot';
import MountainScene from '@/components/MountainScene';
import { check, waliaLine, type Conversation, type Gender, type Line, type Verdict } from '@/lib/conversations';
import { startRecording, type Recording } from '@/lib/recorder';
import { supabase } from '@/lib/supabase';

const MUTE_KEY = 'kwanqa-sound-off'; // shared with the lessons' mute button

type Phase = 'walia' | 'ready' | 'listening' | 'checking' | 'verdict' | 'done';

function effect(kind: 'correct' | 'wrong') {
  try {
    if (localStorage.getItem(MUTE_KEY) === '1') return;
    const audio = new Audio(`/sounds/${kind}.mp3`);
    audio.volume = 0.6;
    void audio.play().catch(() => {});
  } catch {
    // no sound is fine
  }
}

function speakUrl(text: string, slow = false) {
  return `/api/speak?text=${encodeURIComponent(text)}${slow ? '&slow=1' : ''}`;
}

function formatTime(total: number) {
  return `${Math.floor(total / 60)}:${(total % 60).toString().padStart(2, '0')}`;
}

function MicIcon() {
  return (
    <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor" />
      <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden>
      <rect x="6" y="6" width="12" height="12" rx="3" fill="currentColor" />
    </svg>
  );
}

function ReplayIcon() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 12a8 8 0 1 0 2.5-5.8M4 4v4.5h4.5" />
    </svg>
  );
}

function KeyboardIcon() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2.5" y="6" width="19" height="12" rx="2.5" />
      <path d="M6.5 10h.01M10 10h.01M14 10h.01M17.5 10h.01M8 14h8" />
    </svg>
  );
}

function EndIcon() {
  return (
    <svg viewBox="0 0 24 24" width="30" height="30" aria-hidden>
      <path
        d="M3.5 14.2c4.9-4.3 12.1-4.3 17 0l-1.9 2.6c-.3.4-.9.5-1.3.3l-2.6-1.3c-.4-.2-.6-.6-.6-1v-1.6a10.6 10.6 0 0 0-4.2 0v1.6c0 .4-.2.8-.6 1l-2.6 1.3c-.4.2-1 .1-1.3-.3z"
        fill="currentColor"
      />
    </svg>
  );
}

function LineText({ line, english }: { line: Line; english: boolean }) {
  return (
    <>
      <span className="call-am" lang="am">{line.amharic}</span>
      <span className="call-tr">{line.transliteration}</span>
      {english && <span className="call-en">{line.english}</span>}
    </>
  );
}

const VERDICT_TEXT: Record<Exclude<Verdict['kind'], 'right' | 'tip'>, string> = {
  unclear: 'Hmm, that didn’t sound like an answer to Walia. Try again, or tap “What can I say?”.',
  silent: 'Walia didn’t catch anything. Hold the phone a little closer and try again.',
};

export default function TalkCall({
  conversation,
  gender,
  onEnd,
}: {
  conversation: Conversation;
  gender: Gender;
  onEnd: () => void;
}) {
  const [turnIndex, setTurnIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('walia');
  const [heard, setHeard] = useState('');
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [misses, setMisses] = useState(0);
  const [showExample, setShowExample] = useState(false);
  const [english, setEnglish] = useState(true);
  const [typing, setTyping] = useState(false);
  const [typed, setTyped] = useState('');
  const [problem, setProblem] = useState('');
  const [level, setLevel] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [onOwn, setOnOwn] = useState(0);

  const recording = useRef<Recording | null>(null);
  const audio = useRef<HTMLAudioElement | null>(null);
  const stopRef = useRef<() => void>(() => {});

  const turn = conversation.turns[turnIndex];
  const line = waliaLine(turn, gender);
  const last = turnIndex === conversation.turns.length - 1;

  // call timer
  useEffect(() => {
    const tick = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(tick);
  }, []);

  // hang up cleanly: stop the mic and any audio
  useEffect(
    () => () => {
      recording.current?.cancel();
      audio.current?.pause();
    },
    [],
  );

  // Walia says his line at the start of every turn
  useEffect(() => {
    play(line.amharic, false, () => setPhase(p => (p === 'walia' ? 'ready' : p)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turnIndex]);

  // live mic level for the self-view tile
  useEffect(() => {
    if (phase !== 'listening') return;
    const id = setInterval(() => setLevel(recording.current?.level() ?? 0), 80);
    return () => clearInterval(id);
  }, [phase]);

  function play(text: string, slow = false, done?: () => void) {
    audio.current?.pause();
    const clip = new Audio(speakUrl(text, slow));
    audio.current = clip;
    clip.onended = () => done?.();
    clip.onerror = () => done?.();
    void clip.play().catch(() => done?.());
  }

  function judge(text: string) {
    const result = check(turn, text);
    setHeard(text);
    setVerdict(result);
    setPhase('verdict');
    if (result.kind === 'right') {
      effect('correct');
      if (misses === 0 && !showExample) setOnOwn(n => n + 1);
    } else {
      effect('wrong');
      const nextMisses = misses + 1;
      setMisses(nextMisses);
      if (nextMisses >= 2) setShowExample(true);
    }
  }

  async function startTalking() {
    setProblem('');
    audio.current?.pause();
    try {
      recording.current = await startRecording(() => stopRef.current());
      setPhase('listening');
    } catch {
      setProblem('Walia needs your microphone. Allow it in your browser’s settings, or type your answer instead.');
      setPhase('ready');
    }
  }

  async function stopTalking() {
    const rec = recording.current;
    recording.current = null;
    if (!rec) return;
    setPhase('checking');
    try {
      const wav = await rec.stop();
      const token = (await supabase?.auth.getSession())?.data.session?.access_token;
      const res = await fetch('/api/listen', {
        method: 'POST',
        headers: { 'Content-Type': 'audio/wav', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: wav,
      });
      const data = (await res.json()) as { text?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong');
      judge(data.text ?? '');
    } catch (error) {
      setProblem(error instanceof Error ? error.message : 'Something went wrong. Try again.');
      setPhase('ready');
    }
  }
  stopRef.current = () => void stopTalking();

  function tapMic() {
    if (phase === 'ready' || phase === 'walia') void startTalking();
    else if (phase === 'listening') void stopTalking();
  }

  function sendTyped() {
    if (!typed.trim()) return;
    judge(typed);
    setTyped('');
  }

  function retry() {
    setVerdict(null);
    setHeard('');
    setPhase('ready');
  }

  function next() {
    setVerdict(null);
    setHeard('');
    setMisses(0);
    setShowExample(false);
    if (last) {
      setPhase('done');
    } else {
      setPhase('walia');
      setTurnIndex(i => i + 1);
    }
  }

  function callAgain() {
    setOnOwn(0);
    setSeconds(0);
    setVerdict(null);
    setHeard('');
    setMisses(0);
    setShowExample(false);
    setPhase('walia');
    if (turnIndex === 0) play(waliaLine(conversation.turns[0], gender).amharic, false, () => setPhase('ready'));
    setTurnIndex(0);
  }

  const right = verdict?.kind === 'right';
  const tone = phase === 'verdict' ? (right ? ' good' : ' bad') : phase === 'done' ? ' good' : '';
  const mood: Mood | undefined =
    phase === 'checking' ? 'thinking' : phase === 'done' || right ? 'cheer' : phase === 'verdict' ? 'sad' : undefined;
  const busy = phase === 'checking' || phase === 'done';

  return (
    <div className="call-page" role="dialog" aria-modal="true" aria-label={`Call with Walia: ${conversation.title}`}>
      <div className="call-phone">
        <div className="call-video" aria-hidden>
          <MountainScene className="call-mountains" />
          <div className={`call-walia${phase === 'walia' ? ' talking' : ''}`}>
            <Mascot mood={mood} size={230} animated={!mood} />
          </div>
        </div>

        <div className="call-top">
          <div className="call-who">
            <strong>Walia</strong>
            <span>
              {conversation.title} · {formatTime(seconds)}
            </span>
          </div>
          <div className={`call-self${phase === 'listening' ? ' live' : ''}`} aria-hidden>
            <span className="call-self-face">You</span>
            {phase === 'listening' && (
              <span className="call-self-level">
                {[0.6, 0.9, 1, 0.8, 0.5].map((k, i) => (
                  <i key={i} style={{ transform: `scaleY(${Math.max(0.15, Math.min(1, level * k * 1.6))})` }} />
                ))}
              </span>
            )}
          </div>
        </div>

        <div className="call-bottom">
          <div className="call-turns" aria-label={`Question ${Math.min(turnIndex + 1, conversation.turns.length)} of ${conversation.turns.length}`}>
            {conversation.turns.map((_, i) => (
              <span key={i} className={i < turnIndex || phase === 'done' ? 'done' : i === turnIndex ? 'now' : ''} />
            ))}
          </div>

          {heard && phase === 'verdict' && (
            <div className="call-heard">
              <span className="call-heard-label">You said</span>
              <span lang="am">{heard}</span>
            </div>
          )}

          <div className={`call-caption${tone}`} aria-live="polite">
            {phase === 'done' ? (
              <div className="call-feedback call-finish">
                <strong lang="am">ጎበዝ! Call finished</strong>
                <span>
                  You answered {onOwn} of {conversation.turns.length} on your own.
                  {onOwn < conversation.turns.length ? ' Call again to get them all.' : ' Walia is impressed.'}
                </span>
                <div className="call-actions">
                  <button type="button" className="btn btn-sm" onClick={callAgain}>
                    Call again
                  </button>
                  <button type="button" className="btn btn-sm btn-secondary" onClick={onEnd}>
                    Hang up
                  </button>
                </div>
              </div>
            ) : (
              <>
                {phase === 'checking' ? (
                  <span className="call-dots" aria-label="Walia is listening back">
                    <span />
                    <span />
                    <span />
                  </span>
                ) : (
                  <LineText line={line} english={english} />
                )}

                {phase !== 'checking' && (
                  <div className="call-caption-tools">
                    <button type="button" className="call-link" onClick={() => play(line.amharic, true)}>
                      Say it slowly
                    </button>
                    <button type="button" className="call-link" onClick={() => setShowExample(s => !s)}>
                      {showExample ? 'Hide help' : 'What can I say?'}
                    </button>
                  </div>
                )}

                {showExample && phase !== 'checking' && (
                  <div className="call-example">
                    <span className="call-example-label">You could say</span>
                    <LineText line={turn.example} english />
                  </div>
                )}

                {phase === 'verdict' && verdict && (
                  <div className="call-feedback">
                    <strong>{right ? 'Nice footing!' : verdict.kind === 'tip' ? 'Almost there' : 'Let’s try that again'}</strong>
                    {verdict.kind === 'tip' && <span>{verdict.tip}</span>}
                    {(verdict.kind === 'unclear' || verdict.kind === 'silent') && <span>{VERDICT_TEXT[verdict.kind]}</span>}
                    <div className="call-actions">
                      {right ? (
                        <button type="button" className="btn btn-sm" onClick={next} autoFocus>
                          {last ? 'Finish' : 'Continue'}
                        </button>
                      ) : (
                        <>
                          <button type="button" className="btn btn-sm btn-danger" onClick={retry} autoFocus>
                            Try again
                          </button>
                          {misses >= 2 && (
                            <button type="button" className="btn btn-sm btn-secondary" onClick={next}>
                              Skip for now
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {typing && (phase === 'ready' || phase === 'walia') && (
            <form
              className="call-type"
              onSubmit={e => {
                e.preventDefault();
                sendTyped();
              }}
            >
              <input
                value={typed}
                onChange={e => setTyped(e.target.value)}
                lang="am"
                placeholder="Type your answer in ፊደል"
                aria-label="Your answer"
                autoFocus
              />
              <button type="submit" className="btn btn-sm">
                Send
              </button>
            </form>
          )}

          <p className="call-hint" aria-live="polite">
            {problem ||
              (phase === 'listening'
                ? 'Listening. Take your time, tap again when you’re done.'
                : phase === 'checking'
                  ? 'Walia is listening back…'
                  : phase === 'ready' || phase === 'walia'
                    ? 'Tap the mic and answer Walia out loud'
                    : ' ')}
          </p>

          <div className="call-controls">
            <button
              type="button"
              className={`call-btn${english ? ' on' : ''}`}
              onClick={() => setEnglish(e => !e)}
              aria-pressed={english}
              aria-label={english ? 'Hide English' : 'Show English'}
            >
              <span className="call-btn-text">EN</span>
            </button>
            <button
              type="button"
              className="call-btn"
              onClick={() => play(line.amharic)}
              disabled={busy || phase === 'listening'}
              aria-label="Hear Walia again"
            >
              <ReplayIcon />
            </button>
            <button
              type="button"
              className={`call-mic${phase === 'listening' ? ' on' : ''}`}
              onClick={tapMic}
              disabled={busy || phase === 'verdict'}
              aria-label={phase === 'listening' ? 'Stop and send' : 'Start talking'}
            >
              {phase === 'listening' ? <StopIcon /> : <MicIcon />}
            </button>
            <button
              type="button"
              className={`call-btn${typing ? ' on' : ''}`}
              onClick={() => setTyping(t => !t)}
              aria-pressed={typing}
              aria-label={typing ? 'Stop typing' : 'Type instead'}
              disabled={busy}
            >
              <KeyboardIcon />
            </button>
            <button type="button" className="call-btn call-end" onClick={onEnd} aria-label="End the call">
              <EndIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
