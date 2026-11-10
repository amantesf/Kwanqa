'use client';

// /stories and /stories/[id]: read and listen to short Amharic stories, the
// Kaufmann / LingQ way (lib/stories.ts). New words are blue, words you're
// learning are yellow, known words are plain. Tap a word for its meaning and
// sound, then mark it. Finishing a story marks the words you never tapped as
// known, and the known-words count (lib/knownWords.ts) is your progress.

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import LearnSidebar from '@/components/LearnSidebar';
import { amharicAudio } from '@/lib/amharicAudio';
import { markRestKnown, setWordStatus, useKnownWords, type WordStatus } from '@/lib/knownWords';
import { useProfile } from '@/lib/profile';
import { STORIES, sentenceAudio, storyWords, wordText, type Story, type StoryWord } from '@/lib/stories';

// One voice at a time on the page.
let voice: HTMLAudioElement | null = null;
function play(text: string, onEnd?: () => void) {
  const src = amharicAudio(text);
  voice?.pause();
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

function Speaker() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" />
      <path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function KnownCount() {
  const { known, learning } = useKnownWords();
  return (
    <p className="st-count">
      <strong>{known}</strong> {known === 1 ? 'word' : 'words'} known
      {learning > 0 && <span> · {learning} learning</span>}
    </p>
  );
}

function StoryList() {
  const { status } = useKnownWords();
  return (
    <>
      <header className="st-head">
        <h1>Stories</h1>
        <p className="lead">Read and listen to short stories. Tap any word you don’t know.</p>
        <KnownCount />
      </header>
      <ul className="st-list">
        {STORIES.map(story => {
          const words = storyWords(story);
          const fresh = words.filter(w => status(w) === 'new').length;
          return (
            <li key={story.id}>
              <Link href={`/stories/${story.id}`} className="st-card">
                <span className="st-card-am" lang="am">
                  {story.amharicTitle}
                </span>
                <span className="st-card-title">{story.title}</span>
                <span className="st-card-blurb">{story.blurb}</span>
                <span className="st-card-meta">
                  Camp {story.camp} · {words.length} words · {fresh === 0 ? 'all marked' : `${fresh} new`}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}

const STATUS_LABEL: Record<WordStatus, string> = { new: 'New', learning: 'Learning', known: 'Known' };

function WordPanel({ word, onClose }: { word: StoryWord; onClose: () => void }) {
  const { status } = useKnownWords();
  const [am, tr, meaning] = word;
  const current = status(am);
  const canHear = !!amharicAudio(am);
  return (
    <div className="st-panel" role="dialog" aria-label={`The word ${am}`}>
      <div className="st-panel-top">
        <div>
          <p className="st-panel-word" lang="am">
            {am}
          </p>
          <p className="st-panel-tr">{tr}</p>
        </div>
        {canHear && (
          <button type="button" className="st-icon-btn" onClick={() => play(am)} aria-label={`Hear ${am}`}>
            <Speaker />
          </button>
        )}
        <button type="button" className="st-icon-btn st-close" onClick={onClose} aria-label="Close">
          ×
        </button>
      </div>
      <p className="st-panel-meaning">{meaning}</p>
      <div className="st-status" role="group" aria-label="How well do you know it?">
        {(['new', 'learning', 'known'] as const).map(s => (
          <button
            key={s}
            type="button"
            className={`st-status-btn st-${s}${current === s ? ' on' : ''}`}
            aria-pressed={current === s}
            onClick={() => setWordStatus(am, s)}
          >
            {STATUS_LABEL[s]}
          </button>
        ))}
      </div>
    </div>
  );
}

function Reader({ story }: { story: Story }) {
  const { status, known } = useKnownWords();
  const [picked, setPicked] = useState<{ s: number; w: number } | null>(null);
  const [shown, setShown] = useState<Set<number>>(new Set());
  const [reading, setReading] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const stopped = useRef(false);
  const words = storyWords(story);
  const counts = { new: 0, learning: 0, known: 0 };
  for (const w of words) counts[status(w)] += 1;

  useEffect(
    () => () => {
      stopped.current = true;
      voice?.pause();
    },
    [],
  );

  function readFrom(i: number) {
    if (stopped.current || i >= story.sentences.length) {
      setReading(null);
      return;
    }
    setReading(i);
    play(sentenceAudio(story.sentences[i]), () => {
      if (!stopped.current) readFrom(i + 1);
    });
  }

  function listen() {
    if (reading !== null) {
      stopped.current = true;
      voice?.pause();
      setReading(null);
      return;
    }
    stopped.current = false;
    readFrom(0);
  }

  const word = picked ? story.sentences[picked.s].words[picked.w] : null;

  return (
    <>
      <Link href="/stories" className="st-back">
        ← All stories
      </Link>
      <header className="st-head">
        <h1 lang="am">{story.amharicTitle}</h1>
        <p className="lead">
          {story.title} · Camp {story.camp}
        </p>
        <div className="st-tools">
          <button type="button" className="st-listen" onClick={listen} aria-pressed={reading !== null}>
            <Speaker /> {reading !== null ? 'Stop' : 'Listen'}
          </button>
          <p className="st-legend">
            <span className="st-word st-new">{counts.new} new</span>
            <span className="st-word st-learning">{counts.learning} learning</span>
            <span>{counts.known} known</span>
          </p>
        </div>
      </header>

      <div className="st-text">
        {story.sentences.map((sentence, si) => (
          <div key={si} className={`st-sentence${reading === si ? ' reading' : ''}`}>
            <p className="st-line" lang="am">
              {sentence.words.map((w, wi) => {
                const st = status(w[0]);
                const on = picked?.s === si && picked.w === wi;
                return (
                  <button
                    key={wi}
                    type="button"
                    className={`st-word st-${st}${on ? ' picked' : ''}`}
                    onClick={() => {
                      setPicked(on ? null : { s: si, w: wi });
                      if (!on) play(w[0]);
                    }}
                    aria-label={`${w[0]}, ${STATUS_LABEL[st].toLowerCase()} word`}
                  >
                    {wordText(sentence, wi)}
                  </button>
                );
              })}
            </p>
            <div className="st-line-tools">
              <button type="button" className="st-mini" onClick={() => play(sentenceAudio(sentence))} aria-label="Hear this sentence">
                <Speaker />
              </button>
              <button
                type="button"
                className="st-mini st-translate"
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
            </div>
            {shown.has(si) && (
              <p className="st-translation">
                <span>{sentence.transliteration}</span>
                {sentence.english}
              </p>
            )}
          </div>
        ))}
      </div>

      {story.note && <p className="st-note">{story.note}</p>}

      <div className="st-finish">
        {finished ? (
          <p className="st-done">
            Story finished. You now know <strong>{known}</strong> words.{' '}
            <Link href="/stories" className="text-link">
              Read another
            </Link>
          </p>
        ) : (
          <>
            <button
              type="button"
              className="btn"
              onClick={() => {
                markRestKnown(words);
                setFinished(true);
                setPicked(null);
              }}
            >
              I’ve finished this story
            </button>
            <p className="st-finish-hint">
              {counts.new > 0
                ? `The ${counts.new} blue ${counts.new === 1 ? 'word' : 'words'} you didn’t tap will count as known.`
                : 'Every word here is marked already.'}
            </p>
          </>
        )}
      </div>

      {word && <WordPanel word={word} onClose={() => setPicked(null)} />}
    </>
  );
}

export default function StoriesPage({ id }: { id?: string }) {
  const track = useProfile()?.track ?? 'amharic';
  const story = id ? STORIES.find(s => s.id === id) : undefined;
  return (
    <div className="learn-app">
      <LearnSidebar active="stories" track={track} />
      <main className="learn-main st-page">{story ? <Reader story={story} /> : <StoryList />}</main>
    </div>
  );
}
