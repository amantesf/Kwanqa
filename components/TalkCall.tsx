'use client';

// The call screen for Talk with Walia. Walia says a line (Azure, Ameha's voice),
// the learner taps the mic and answers out loud, Azure writes down what it
// heard, and Walia's brain (/api/tutor, Claude) decides whether it fits and
// what to say back. If the brain is unavailable, the script in
// lib/conversations.ts checks the answer instead.

import { useEffect, useRef, useState } from 'react';
import Mascot, { type Mood } from '@/components/Mascot';
import GrassIcon from '@/components/GrassIcon';
import MountainScene from '@/components/MountainScene';
import { completeCall } from '@/lib/climb';
import { createLipSync, type LipSync } from '@/lib/lipSync';
import { check, normalize, spokenText, waliaLine, type Conversation, type Gender, type Line } from '@/lib/conversations';
import { startRecording, type Recording } from '@/lib/recorder';
import { supabase } from '@/lib/supabase';
import type { CallLine, TutorReply, TutorVerdict } from '@/lib/tutor';

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

function speakUrl(text: string, slow = false, lang?: 'en') {
  return `/api/speak?text=${encodeURIComponent(text)}${slow ? '&slow=1' : ''}${lang ? `&lang=${lang}` : ''}`;
}

async function authHeaders(): Promise<Record<string, string>> {
  const token = (await supabase?.auth.getSession())?.data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

type Answer = { verdict: TutorVerdict; reply: Line | null; note: string };

/**
 * The words on the call screen. English calls are for Amharic speakers, so
 * they get Amharic first with the English beside it.
 */
function callText(english: boolean) {
  const both = (en: string, am: string) => (english ? `${am} · ${en}` : en);
  return {
    titles: {
      right: both('Nice footing!', 'ጎበዝ!'),
      slip: both('Almost there', 'ልትደርስ ነው'),
      retry: both('Let’s try that again', 'እንደገና እንሞክር'),
      question: both('Good question', 'ጥሩ ጥያቄ'),
    } as Record<TutorVerdict, string>,
    silent: both('Walia didn’t catch anything. Hold the phone a little closer and try again.', 'ዋሊያ ምንም አልሰማም። ስልኩን ትንሽ አቅርበው እንደገና ይሞክሩ።'),
    unclear: both(
      'Hmm, that didn’t sound like an answer to Walia. Try again, or tap “What can I say?”.',
      'ይህ ለዋሊያ ጥያቄ መልስ አይመስልም። እንደገና ይሞክሩ፣ ወይም “ምን ልበል?” የሚለውን ይንኩ።',
    ),
    youSaid: both('You said', 'ያሉት'),
    asked: both('Walia asked:', 'ዋሊያ የጠየቀው፡'),
    slowly: both('Say it slowly', 'በዝግታ'),
    help: both('What can I say?', 'ምን ልበል?'),
    hideHelp: both('Hide help', 'እርዳታውን ደብቅ'),
    couldSay: both('You could say', 'እንዲህ ማለት ይችላሉ'),
    finished: english ? 'ጎበዝ! · Call finished' : 'ጎበዝ! Call finished',
    grass: both('grass', 'ሳር'),
    onOwn: (n: number, total: number) =>
      english
        ? `ከ${total} ጥያቄዎች ${n}ን በራስዎ መለሱ። · You answered ${n} of ${total} on your own.`
        : `You answered ${n} of ${total} on your own.`,
    again: (all: boolean) =>
      all ? both('Walia is impressed.', 'ዋሊያ ተደንቋል።') : both('Call again to get them all.', 'ሁሉንም ለመመለስ እንደገና ይደውሉ።'),
    callAgain: both('Call again', 'እንደገና ደውል'),
    hangUp: both('Hang up', 'ዝጋ'),
    finish: both('Finish', 'ጨርስ'),
    continue: both('Continue', 'ቀጥል'),
    answer: both('Answer Walia', 'ለዋሊያ መልስ'),
    tryAgain: both('Try again', 'እንደገና ሞክር'),
    skip: both('Skip for now', 'ለአሁን ዝለል'),
    send: both('Send', 'ላክ'),
    typeHere: english ? 'Type your answer in English' : 'Type your answer in ፊደል',
    mic: both('Walia needs your microphone. Allow it in your browser’s settings, or type your answer instead.', 'ዋሊያ ማይክሮፎንዎን ይፈልጋል። በብራውዘርዎ ይፍቀዱ፣ ወይም መልስዎን ይጻፉ።'),
    listening: both('Listening. Take your time, tap again when you’re done.', 'እያዳመጠ ነው። ሲጨርሱ እንደገና ይንኩ።'),
    checking: both('Walia is listening back…', 'ዋሊያ እያዳመጠ ነው…'),
    tapMic: english
      ? 'ማይኩን ይንኩና በእንግሊዝኛ ይመልሱ · Tap the mic and answer Walia in English'
      : 'Tap the mic and answer Walia out loud',
    you: english ? 'እርስዎ' : 'You',
  };
}

// When Walia's brain can't be reached, the script's own checker decides.
function scriptAnswer(verdict: ReturnType<typeof check>, text: ReturnType<typeof callText>): Answer {
  switch (verdict.kind) {
    case 'right':
      return { verdict: 'right', reply: null, note: '' };
    case 'tip':
      return { verdict: 'slip', reply: null, note: verdict.tip };
    case 'silent':
      return { verdict: 'retry', reply: null, note: text.silent };
    default:
      return { verdict: 'retry', reply: null, note: text.unclear };
  }
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

/**
 * A line of the call: the language being practised big, with its meaning
 * underneath when it's switched on (English for Amharic calls, Amharic for
 * English calls).
 */
function LineText({ line, meaning, englishCall }: { line: Line; meaning: boolean; englishCall: boolean }) {
  if (englishCall) {
    return (
      <>
        <span className="call-am" lang="en">{line.english}</span>
        {meaning && <span className="call-en" lang="am">{line.amharic}</span>}
      </>
    );
  }
  return (
    <>
      <span className="call-am" lang="am">{line.amharic}</span>
      <span className="call-tr">{line.transliteration}</span>
      {meaning && <span className="call-en">{line.english}</span>}
    </>
  );
}

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
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [history, setHistory] = useState<CallLine[]>([]);
  const [misses, setMisses] = useState(0);
  const [showExample, setShowExample] = useState(false);
  const [english, setEnglish] = useState(true);
  const [typing, setTyping] = useState(false);
  const [typed, setTyped] = useState('');
  const [problem, setProblem] = useState('');
  const [level, setLevel] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [onOwn, setOnOwn] = useState(0);
  // for the daily log: every answer judged, and how many were right
  const [answers, setAnswers] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [earned, setEarned] = useState<number | null>(null);

  const recording = useRef<Recording | null>(null);
  const audio = useRef<HTMLAudioElement | null>(null);
  // Walia's mouth follows his voice; `speaking` is true while any clip of his plays.
  const waliaRef = useRef<HTMLDivElement>(null);
  const lip = useRef<LipSync | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const [fakeLips, setFakeLips] = useState(false);
  const spoken = useRef(new Map<string, string>()); // reply text → object URL of its audio
  const stopRef = useRef<() => void>(() => {});
  const logRef = useRef<HTMLOListElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const englishCall = conversation.lang === 'en';
  const text = callText(englishCall);
  const lang = englishCall ? ('en' as const) : undefined;
  const say_ = (l: Line) => spokenText(l, conversation);
  const turn = conversation.turns[turnIndex];
  const line = waliaLine(turn, gender);
  const last = turnIndex === conversation.turns.length - 1;

  // call timer
  useEffect(() => {
    const tick = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(tick);
  }, []);

  // hang up cleanly: stop the mic and any audio
  useEffect(() => {
    const clips = spoken.current;
    return () => {
      recording.current?.cancel();
      audio.current?.pause();
      lip.current?.close();
      clips.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  // Walia says his line at the start of every turn
  useEffect(() => {
    setHistory(h => [...h, { from: 'walia', text: say_(line) }]);
    play(say_(line), false, () => setPhase(p => (p === 'walia' ? 'ready' : p)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turnIndex]);

  // keep the newest lines of the transcript in view
  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
    // on phones the whole panel scrolls: bring Walia's latest reply and its buttons into view
    panelRef.current?.scrollTo({ top: panelRef.current.scrollHeight, behavior: 'smooth' });
  }, [history.length, phase]);

  // live mic level for the self-view tile
  useEffect(() => {
    if (phase !== 'listening') return;
    const id = setInterval(() => setLevel(recording.current?.level() ?? 0), 80);
    return () => clearInterval(id);
  }, [phase]);

  function playSrc(src: string, done?: () => void) {
    audio.current?.pause();
    const clip = new Audio(src);
    audio.current = clip;
    lip.current ??= createLipSync(() => waliaRef.current);
    setFakeLips(!lip.current.attach(clip));
    clip.onplaying = () => setSpeaking(true);
    clip.onpause = () => setSpeaking(false);
    clip.onended = () => {
      setSpeaking(false);
      done?.();
    };
    clip.onerror = () => {
      setSpeaking(false);
      done?.();
    };
    void clip.play().catch(() => {
      setSpeaking(false);
      done?.();
    });
  }

  /** One of Walia's scripted lines: cached and open to everyone. */
  function play(text: string, slow = false, done?: () => void) {
    playSrc(speakUrl(text, slow, lang), done);
  }

  /** A reply Walia's brain just wrote: spoken fresh, for signed-in learners. */
  async function playReply(text: string, slow = false) {
    const key = `${slow ? 'slow:' : ''}${text}`;
    let url = spoken.current.get(key);
    if (!url) {
      const res = await fetch('/api/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(await authHeaders()) },
        body: JSON.stringify({ text, slow, lang }),
      });
      if (!res.ok) return; // the words are on screen either way
      url = URL.createObjectURL(await res.blob());
      spoken.current.set(key, url);
    }
    playSrc(url);
  }

  function say(shown: Line, slow = false) {
    if (shown === line) play(say_(shown), slow);
    else void playReply(say_(shown), slow);
  }

  async function askBrain(text: string): Promise<Answer | null> {
    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(await authHeaders()) },
        body: JSON.stringify({ slug: conversation.slug, turn: turnIndex, gender, heard: text, history }),
      });
      if (!res.ok) return null;
      const data = (await res.json()) as TutorReply;
      return { verdict: data.verdict, reply: say_(data.reply) ? data.reply : null, note: data.note };
    } catch {
      return null;
    }
  }

  async function judge(heardText: string) {
    setHeard(heardText);
    setPhase('checking');
    const said = normalize(heardText);
    const result = (said && (await askBrain(said))) || scriptAnswer(check(turn, heardText), text);

    setAnswer(result);
    setPhase('verdict');
    setHistory(h => [
      ...h,
      ...(said ? [{ from: 'learner' as const, text: said }] : []),
      ...(result.reply ? [{ from: 'walia' as const, text: say_(result.reply) }] : []),
    ]);
    if (result.reply) void playReply(say_(result.reply));

    if (result.verdict !== 'question') setAnswers(n => n + 1);
    if (result.verdict === 'right') {
      setCorrect(n => n + 1);
      effect('correct');
      if (misses === 0 && !showExample) setOnOwn(n => n + 1);
    } else if (result.verdict !== 'question') {
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
      setProblem(text.mic);
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
      const res = await fetch(englishCall ? '/api/listen?lang=en' : '/api/listen', {
        method: 'POST',
        headers: { 'Content-Type': 'audio/wav', ...(await authHeaders()) },
        body: wav,
      });
      const data = (await res.json()) as { text?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong');
      await judge(data.text ?? '');
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
    void judge(typed);
    setTyped('');
  }

  function retry() {
    setAnswer(null);
    setHeard('');
    setPhase('ready');
  }

  function next() {
    setAnswer(null);
    setHeard('');
    setMisses(0);
    setShowExample(false);
    if (last) {
      setPhase('done');
      setEarned(
        completeCall(conversation.slug, onOwn, conversation.turns.length, { answers, correct, seconds }),
      );
    } else {
      setPhase('walia');
      setTurnIndex(i => i + 1);
    }
  }

  function callAgain() {
    setOnOwn(0);
    setAnswers(0);
    setCorrect(0);
    setEarned(null);
    setSeconds(0);
    setAnswer(null);
    setHistory([]);
    setHeard('');
    setMisses(0);
    setShowExample(false);
    setPhase('walia');
    if (turnIndex === 0) play(say_(waliaLine(conversation.turns[0], gender)), false, () => setPhase('ready'));
    setTurnIndex(0);
  }

  const verdict = phase === 'verdict' ? answer?.verdict : undefined;
  const right = verdict === 'right';
  // What Walia is saying right now: his reply after an answer, otherwise his question.
  const shown = (phase === 'verdict' && answer?.reply) || line;
  const tone =
    phase === 'done' || right ? ' good' : verdict === 'slip' || verdict === 'retry' ? ' bad' : '';
  const mood: Mood | undefined =
    phase === 'checking'
      ? 'thinking'
      : phase === 'done' || right
        ? 'cheer'
        : verdict === 'slip' || verdict === 'retry'
          ? 'sad'
          : undefined;
  const busy = phase === 'checking' || phase === 'done';

  // Everything said before the current exchange, for the transcript beside the
  // video on wide screens (the current lines already show below it).
  let cut = history.length;
  if (phase === 'verdict' && answer) {
    if (answer.reply) cut--;
    if (normalize(heard)) cut--;
  } else if (phase !== 'done') {
    cut--;
  }
  const earlier = history.slice(0, Math.max(0, cut));

  return (
    <div className="call-page" role="dialog" aria-modal="true" aria-label={`Call with Walia: ${conversation.title}`}>
      <div className="call-phone">
        <div className="call-video" aria-hidden>
          <MountainScene className="call-mountains" />
          <div ref={waliaRef} className={`call-walia${fakeLips ? ' fake-lips' : ''}`}>
            <Mascot
              mood={mood}
              size={230}
              animated={!mood}
              talking={speaking}
              listening={phase === 'listening'}
            />
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
            <span className="call-self-face">{text.you}</span>
            {phase === 'listening' && (
              <span className="call-self-level">
                {[0.6, 0.9, 1, 0.8, 0.5].map((k, i) => (
                  <i key={i} style={{ transform: `scaleY(${Math.max(0.15, Math.min(1, level * k * 1.6))})` }} />
                ))}
              </span>
            )}
          </div>
        </div>

        <div className="call-bottom" ref={panelRef}>
          <div className="call-turns" aria-label={`Question ${Math.min(turnIndex + 1, conversation.turns.length)} of ${conversation.turns.length}`}>
            {conversation.turns.map((_, i) => (
              <span key={i} className={i < turnIndex || phase === 'done' ? 'done' : i === turnIndex ? 'now' : ''} />
            ))}
          </div>

          {earlier.length > 0 && (
            <ol className="call-log" aria-label="The call so far" ref={logRef}>
              {earlier.map((l, i) => (
                <li key={i} className={l.from}>
                  <span lang={englishCall ? 'en' : 'am'}>{l.text}</span>
                </li>
              ))}
            </ol>
          )}

          {heard && phase === 'verdict' && (
            <div className="call-heard">
              <span className="call-heard-label">{text.youSaid}</span>
              <span lang={englishCall ? 'en' : 'am'}>{heard}</span>
            </div>
          )}

          <div className={`call-caption${tone}`} aria-live="polite">
            {phase === 'done' ? (
              <div className="call-feedback call-finish">
                <strong lang="am">{text.finished}</strong>
                {earned !== null && (
                  <span className="call-earned">
                    <GrassIcon size={18} /> +{earned} {text.grass}
                  </span>
                )}
                <span>
                  {text.onOwn(onOwn, conversation.turns.length)} {text.again(onOwn >= conversation.turns.length)}
                </span>
                <div className="call-actions">
                  <button type="button" className="btn btn-sm" onClick={callAgain}>
                    {text.callAgain}
                  </button>
                  <button type="button" className="btn btn-sm btn-secondary" onClick={onEnd}>
                    {text.hangUp}
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
                  <LineText line={shown} meaning={english} englishCall={englishCall} />
                )}

                {shown !== line && verdict !== 'retry' && (
                  <span className="call-asked">
                    {text.asked} <span lang={englishCall ? 'en' : 'am'}>{say_(line)}</span>
                  </span>
                )}

                {phase !== 'checking' && (
                  <div className="call-caption-tools">
                    <button type="button" className="call-link" onClick={() => say(shown, true)}>
                      {text.slowly}
                    </button>
                    <button type="button" className="call-link" onClick={() => setShowExample(s => !s)}>
                      {showExample ? text.hideHelp : text.help}
                    </button>
                  </div>
                )}

                {showExample && phase !== 'checking' && (
                  <div className="call-example">
                    <span className="call-example-label">{text.couldSay}</span>
                    <LineText line={turn.example} meaning englishCall={englishCall} />
                  </div>
                )}

                {verdict && answer && (
                  <div className="call-feedback">
                    <strong>{text.titles[verdict]}</strong>
                    {answer.note && <span>{answer.note}</span>}
                    <div className="call-actions">
                      {right ? (
                        <button type="button" className="btn btn-sm" onClick={next} autoFocus>
                          {last ? text.finish : text.continue}
                        </button>
                      ) : verdict === 'question' ? (
                        <button type="button" className="btn btn-sm" onClick={retry} autoFocus>
                          {text.answer}
                        </button>
                      ) : (
                        <>
                          <button type="button" className="btn btn-sm btn-danger" onClick={retry} autoFocus>
                            {text.tryAgain}
                          </button>
                          {misses >= 2 && (
                            <button type="button" className="btn btn-sm btn-secondary" onClick={next}>
                              {text.skip}
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
                lang={englishCall ? 'en' : 'am'}
                placeholder={text.typeHere}
                aria-label="Your answer"
                autoFocus
              />
              <button type="submit" className="btn btn-sm">
                {text.send}
              </button>
            </form>
          )}

          <p className="call-hint" aria-live="polite">
            {problem ||
              (phase === 'listening'
                ? text.listening
                : phase === 'checking'
                  ? text.checking
                  : phase === 'ready' || phase === 'walia'
                    ? text.tapMic
                    : ' ')}
          </p>

          <div className="call-controls">
            <button
              type="button"
              className={`call-btn${english ? ' on' : ''}`}
              onClick={() => setEnglish(e => !e)}
              aria-pressed={english}
              aria-label={
                englishCall ? (english ? 'Hide the Amharic meaning' : 'Show the Amharic meaning') : english ? 'Hide English' : 'Show English'
              }
            >
              <span className="call-btn-text" lang={englishCall ? 'am' : undefined}>
                {englishCall ? 'አማ' : 'EN'}
              </span>
            </button>
            <button
              type="button"
              className="call-btn"
              onClick={() => say(shown)}
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
