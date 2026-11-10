'use client';

// The tap-a-word reader behind Stories, the Library and learners' own books,
// the Kaufmann / LingQ way: new words are blue, words you're learning are
// yellow, known words are plain. Tap a word to hear it, see what it means and
// mark it. Turning the page counts the blue words you didn't tap as known,
// like LingQ, and the known-words count (lib/knownWords.ts) grows.
//
// Meanings come, in order, from the story's own hand-written glosses,
// kwanqa's lessons (lib/dictionary.ts), meanings Walia already looked up on
// this device, and finally Walia himself (Claude, /api/gloss) for any word,
// for learners with an account.

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { lookUp } from '@/lib/dictionary';
import { fidelRoman } from '@/lib/fidelRoman';
import {
  cacheGloss,
  cachedGloss,
  markRestKnown,
  setWordNote,
  setWordStatus,
  useKnownWords,
  type CachedGloss,
  type WordStatus,
} from '@/lib/knownWords';
import { cleanWord } from '@/lib/library';
import { supabase } from '@/lib/supabase';

export type ReaderToken = {
  /** As shown, with punctuation and quote marks. */
  display: string;
  /** The word itself, the key for its status. Empty for punctuation alone. */
  word: string;
  /** Hand-written transliteration and meaning, when the text has them. */
  tr?: string;
  meaning?: string;
};

export type ReaderSentence = {
  text: string;
  tokens: ReaderToken[];
  english?: string;
  transliteration?: string;
};

export type ReaderPage = {
  sentences: ReaderSentence[];
  image?: string | null;
  /** The whole page in English, when the book has it. */
  english?: string;
};

/**
 * How the text is read aloud: "lines" for kwanqa's stories and the Library
 * (Walia's cached voice, for everyone), "own" for a learner's own book (read
 * fresh, for learners with an account).
 */
export type Voice = { kind: 'lines'; url: (text: string) => string | null } | { kind: 'own' };

/** Splits a sentence into tokens; every token is a word with its punctuation. */
export function tokenize(sentence: string): ReaderToken[] {
  return sentence
    .split(/\s+/)
    .filter(Boolean)
    .map(display => ({ display, word: /[ሀ-፼]/.test(display) ? cleanWord(display) : '' }));
}

// One voice at a time.
let voice: HTMLAudioElement | null = null;
const ownClips = new Map<string, string>();

async function authHeader(): Promise<Record<string, string>> {
  const token = (await supabase?.auth.getSession())?.data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function clipFor(text: string, how: Voice): Promise<string | null> {
  if (how.kind === 'lines') return how.url(text);
  if (text.length > 200) return null;
  const known = ownClips.get(text);
  if (known) return known;
  const res = await fetch('/api/speak', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(await authHeader()) },
    body: JSON.stringify({ text }),
  }).catch(() => null);
  if (!res?.ok) return null;
  const url = URL.createObjectURL(await res.blob());
  ownClips.set(text, url);
  return url;
}

async function play(text: string, how: Voice, onEnd?: () => void) {
  voice?.pause();
  const src = await clipFor(text, how);
  if (!src) {
    onEnd?.();
    return;
  }
  const el = new Audio(src);
  voice = el;
  el.onended = () => onEnd?.();
  el.onerror = () => onEnd?.();
  el.play().catch(() => onEnd?.());
}

function Speaker({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" />
      <path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </svg>
  );
}

const STATUS_LABEL: Record<WordStatus, string> = { new: 'New', learning: 'Learning', known: 'Known' };

function WordPanel({
  token,
  sentence,
  how,
  onClose,
}: {
  token: ReaderToken;
  sentence: string;
  how: Voice;
  onClose: () => void;
}) {
  const { user } = useAuth();
  const { status } = useKnownWords();
  const word = token.word;
  const ours = token.meaning ? { meaning: token.meaning, tr: token.tr } : lookUp(word);
  const tr = token.tr ?? ours?.tr ?? fidelRoman(word);
  const [gloss, setGloss] = useState<CachedGloss | null>(() => cachedGloss(word, sentence));
  const [asking, setAsking] = useState(false);
  const [problem, setProblem] = useState('');
  const meaning = ours?.meaning ?? gloss?.meaning ?? '';
  const current = status(word);

  async function ask() {
    setAsking(true);
    setProblem('');
    try {
      const res = await fetch('/api/gloss', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(await authHeader()) },
        body: JSON.stringify({ word, sentence }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? 'Couldn’t look that up.');
      cacheGloss(word, sentence, body);
      setGloss(body);
    } catch (e) {
      setProblem(e instanceof Error ? e.message : 'Couldn’t look that up.');
    } finally {
      setAsking(false);
    }
  }

  function mark(s: WordStatus) {
    setWordStatus(word, s);
    // saved even without a meaning yet, so the word still shows up in review
    if (s !== 'new') setWordNote(word, { meaning, tr, sentence });
  }

  return (
    <div className="st-panel" role="dialog" aria-label={`The word ${word}`}>
      <div className="st-panel-top">
        <div>
          <p className="st-panel-word" lang="am">
            {word}
          </p>
          <p className="st-panel-tr">{tr}</p>
        </div>
        <button type="button" className="st-icon-btn" onClick={() => void play(word, how)} aria-label={`Hear ${word}`}>
          <Speaker />
        </button>
        <button type="button" className="st-icon-btn st-close" onClick={onClose} aria-label="Close">
          ×
        </button>
      </div>
      {meaning ? (
        <p className="st-panel-meaning">{meaning}</p>
      ) : user ? (
        <button type="button" className="st-ask" onClick={() => void ask()} disabled={asking}>
          {asking ? 'Walia is looking it up…' : 'What does it mean here?'}
        </button>
      ) : (
        <p className="st-panel-hint">
          <Link href="/login?next=/stories" className="text-link">
            Log in
          </Link>{' '}
          and Walia explains any word.
        </p>
      )}
      {gloss && !ours && (gloss.parts || gloss.base !== word) && (
        <p className="st-panel-parts">
          {gloss.parts || (
            <>
              From <span lang="am">{gloss.base}</span>: {gloss.baseMeaning}
            </>
          )}
        </p>
      )}
      {problem && <p className="form-error">{problem}</p>}
      <div className="st-status" role="group" aria-label="How well do you know it?">
        {(['new', 'learning', 'known'] as const).map(s => (
          <button
            key={s}
            type="button"
            className={`st-status-btn st-${s}${current === s ? ' on' : ''}`}
            aria-pressed={current === s}
            onClick={() => mark(s)}
          >
            {STATUS_LABEL[s]}
          </button>
        ))}
      </div>
    </div>
  );
}

function SentenceTranslation({ sentence }: { sentence: ReaderSentence }) {
  const [english, setEnglish] = useState(sentence.english ?? '');
  const [problem, setProblem] = useState('');
  useEffect(() => {
    if (sentence.english) return;
    let alive = true;
    (async () => {
      try {
        const res = await fetch('/api/gloss', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...(await authHeader()) },
          body: JSON.stringify({ sentence: sentence.text }),
        });
        const body = await res.json();
        if (!res.ok) throw new Error(body.error ?? 'Couldn’t translate that.');
        if (alive) setEnglish(body.english);
      } catch (e) {
        if (alive) setProblem(e instanceof Error ? e.message : 'Couldn’t translate that.');
      }
    })();
    return () => {
      alive = false;
    };
  }, [sentence]);
  return (
    <p className="st-translation">
      <span>{sentence.transliteration ?? fidelRoman(sentence.text)}</span>
      {english || problem || 'Translating…'}
    </p>
  );
}

export default function Reader({
  title,
  subtitle,
  backHref,
  backLabel,
  pages,
  how,
  translateSentences,
  startPage = 0,
  onPage,
  note,
  credits,
}: {
  title: string;
  subtitle?: ReactNode;
  backHref: string;
  backLabel: string;
  pages: ReaderPage[];
  how: Voice;
  /** Translate sentence by sentence (kwanqa stories, own books) instead of a whole page. */
  translateSentences: boolean;
  startPage?: number;
  onPage?: (page: number) => void;
  note?: string;
  credits?: ReactNode;
}) {
  const { user } = useAuth();
  const { status, known } = useKnownWords();
  const [pageIndex, setPageIndex] = useState(Math.min(startPage, Math.max(0, pages.length - 1)));
  const [picked, setPicked] = useState<{ s: number; t: number } | null>(null);
  const [shown, setShown] = useState<Set<number>>(new Set());
  const [pageEnglish, setPageEnglish] = useState(false);
  const [reading, setReading] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const stopped = useRef(false);
  const page = pages[pageIndex];
  const last = pageIndex === pages.length - 1;
  const canHear = how.kind === 'lines' || !!user;

  const pageWords = [...new Set(page.sentences.flatMap(s => s.tokens.map(t => t.word).filter(Boolean)))];
  const allWords = [...new Set(pages.flatMap(p => p.sentences.flatMap(s => s.tokens.map(t => t.word).filter(Boolean))))];
  const counts = { new: 0, learning: 0, known: 0 };
  for (const w of allWords) counts[status(w)] += 1;
  const pageNew = pageWords.filter(w => status(w) === 'new').length;

  useEffect(
    () => () => {
      stopped.current = true;
      voice?.pause();
    },
    [],
  );

  function stop() {
    stopped.current = true;
    voice?.pause();
    setReading(null);
  }

  function readFrom(pi: number, si: number) {
    if (stopped.current) return;
    const p = pages[pi];
    if (si >= p.sentences.length) {
      // carry on to the next page, like an audiobook
      if (pi + 1 < pages.length) {
        goTo(pi, pi + 1, true);
        readFrom(pi + 1, 0);
      } else setReading(null);
      return;
    }
    setReading(si);
    void play(p.sentences[si].text, how, () => readFrom(pi, si + 1));
  }

  function listen() {
    if (reading !== null) return stop();
    stopped.current = false;
    readFrom(pageIndex, 0);
  }

  function wordsOn(p: ReaderPage) {
    return p.sentences.flatMap(s => s.tokens.map(t => t.word).filter(Boolean));
  }

  function goTo(from: number, next: number, keepPlaying = false) {
    if (!keepPlaying) stop();
    // LingQ: moving on counts the words you didn't tap as known
    if (next > from) markRestKnown(wordsOn(pages[from]));
    setPageIndex(next);
    setPicked(null);
    setShown(new Set());
    setPageEnglish(false);
    onPage?.(next);
    if (!keepPlaying) window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const token = picked ? page.sentences[picked.s]?.tokens[picked.t] : null;

  return (
    <>
      <Link href={backHref} className="st-back">
        ← {backLabel}
      </Link>
      <header className="st-head">
        <h1 lang="am">{title}</h1>
        {subtitle && <p className="lead">{subtitle}</p>}
        <div className="st-tools">
          {canHear && (
            <button type="button" className="st-listen" onClick={listen} aria-pressed={reading !== null}>
              <Speaker /> {reading !== null ? 'Stop' : 'Listen'}
            </button>
          )}
          <p className="st-legend">
            <span className="st-word st-new">{counts.new} new</span>
            <span className="st-word st-learning">{counts.learning} learning</span>
            <span>{counts.known} known</span>
          </p>
        </div>
      </header>

      {page.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="st-picture" src={`/library/${page.image}`} alt="" width={480} height={480} />
      )}

      <div className="st-text">
        {page.sentences.map((sentence, si) => (
          <div key={si} className={`st-sentence${reading === si ? ' reading' : ''}`}>
            <p className="st-line" lang="am">
              {sentence.tokens.map((t, ti) => {
                if (!t.word) return <span key={ti}>{t.display} </span>;
                const st = status(t.word);
                const on = picked?.s === si && picked.t === ti;
                return (
                  <span key={ti}>
                    <button
                      type="button"
                      className={`st-word st-${st}${on ? ' picked' : ''}`}
                      onClick={() => {
                        setPicked(on ? null : { s: si, t: ti });
                        if (!on && canHear) void play(t.word, how);
                      }}
                      aria-label={`${t.word}, ${STATUS_LABEL[st].toLowerCase()} word`}
                    >
                      {t.display}
                    </button>{' '}
                  </span>
                );
              })}
            </p>
            <div className="st-line-tools">
              {canHear && (
                <button type="button" className="st-mini" onClick={() => void play(sentence.text, how)} aria-label="Hear this sentence">
                  <Speaker size={16} />
                </button>
              )}
              {translateSentences && (sentence.english || user) && (
                <button
                  type="button"
                  className="st-mini"
                  aria-expanded={shown.has(si)}
                  onClick={() =>
                    setShown(s => {
                      const next = new Set(s);
                      if (next.has(si)) next.delete(si);
                      else next.add(si);
                      return next;
                    })
                  }
                >
                  {shown.has(si) ? 'Hide' : 'Translate'}
                </button>
              )}
            </div>
            {shown.has(si) && <SentenceTranslation sentence={sentence} />}
          </div>
        ))}
      </div>

      {page.english && (
        <div className="st-page-english">
          <button type="button" className="st-mini" aria-expanded={pageEnglish} onClick={() => setPageEnglish(v => !v)}>
            {pageEnglish ? 'Hide the English' : 'Show this page in English'}
          </button>
          {pageEnglish && <p>{page.english}</p>}
        </div>
      )}

      {pages.length > 1 && (
        <nav className="st-pager" aria-label="Pages">
          <button type="button" className="st-page-btn" disabled={pageIndex === 0} onClick={() => goTo(pageIndex, pageIndex - 1)}>
            ← Back
          </button>
          <span>
            Page {pageIndex + 1} of {pages.length}
          </span>
          <button type="button" className="st-page-btn st-page-next" disabled={last} onClick={() => goTo(pageIndex, pageIndex + 1)}>
            Next page →
          </button>
        </nav>
      )}
      {!last && pageNew > 0 && (
        <p className="st-finish-hint">
          The {pageNew} blue {pageNew === 1 ? 'word' : 'words'} on this page that you don’t tap will count as known when you turn the page.
        </p>
      )}

      {last && (
        <>
          {note && <p className="st-note">{note}</p>}
          <div className="st-finish">
            {finished ? (
              <p className="st-done">
                Finished. You now know <strong>{known}</strong> words.{' '}
                <Link href={backHref} className="text-link">
                  Read another
                </Link>
              </p>
            ) : (
              <>
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    stop();
                    markRestKnown(pageWords);
                    setFinished(true);
                    setPicked(null);
                  }}
                >
                  I’ve finished reading
                </button>
                {pageNew > 0 && (
                  <p className="st-finish-hint">
                    The {pageNew} blue {pageNew === 1 ? 'word' : 'words'} you didn’t tap will count as known.
                  </p>
                )}
              </>
            )}
          </div>
        </>
      )}

      {credits && <footer className="st-credits">{credits}</footer>}

      {token && token.word && (
        <WordPanel
          key={`${pageIndex}-${picked?.s}-${picked?.t}`}
          token={token}
          sentence={page.sentences[picked!.s].text}
          how={how}
          onClose={() => setPicked(null)}
        />
      )}
    </>
  );
}
