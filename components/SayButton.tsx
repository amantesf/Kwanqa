'use client';

// A small speaker button that reads a phrase aloud in the language being
// learned: Amharic (your recordings first, then Walia's Azure voice) or
// English (the English voice, with the browser's voice as a backup).
// It hides itself when there's nothing to say, like ስሜ ... ነው.
// Hold it (or right-click it) to hear the phrase slowly.

import { useRef, useState } from 'react';
import type { Track } from '@/lib/courses';
import { amharicAudio } from '@/lib/amharicAudio';
import { englishAudioUrl, isSpeakableEnglish, speakWithBrowser } from '@/lib/englishAudio';

// One voice at a time across the page: a new tap stops the last one.
let playing: HTMLAudioElement | null = null;

export function soundFor(text: string, track: Track): { src: string; say?: string } | null {
  if (track === 'english') return isSpeakableEnglish(text) ? { src: englishAudioUrl(text), say: text } : null;
  const src = amharicAudio(text);
  return src ? { src } : null;
}

/** Walia's voice can read slowly itself; a recording is just played slower. */
function slowed(src: string) {
  return src.startsWith('/api/speak') ? { src: `${src}&slow=1`, rate: 1 } : { src, rate: 0.7 };
}

export function say(text: string, track: Track, slow = false) {
  const sound = soundFor(text, track);
  if (!sound) return;
  const { src, rate } = slow ? slowed(sound.src) : { src: sound.src, rate: 1 };
  playing?.pause();
  try {
    window.speechSynthesis?.cancel();
  } catch {
    // no browser voice: fine
  }
  const el = new Audio(src);
  el.playbackRate = rate;
  el.preservesPitch = true;
  playing = el;
  const fallback = () => {
    if (sound.say && playing === el) speakWithBrowser(sound.say);
  };
  el.onerror = fallback;
  el.play().catch(err => {
    if (err?.name !== 'NotAllowedError') fallback();
  });
}

export default function SayButton({
  text,
  track,
  className,
  size = 18,
}: {
  text: string;
  /** Which voice reads it: 'amharic' for Walia's Amharic voice, 'english' for the English one. */
  track: Track;
  className?: string;
  size?: number;
}) {
  const hold = useRef<number | null>(null);
  const heldSlow = useRef(false);
  const [slow, setSlow] = useState(false);

  if (!soundFor(text, track)) return null;

  function playSlow() {
    heldSlow.current = true;
    say(text, track, true);
    setSlow(true);
    window.setTimeout(() => setSlow(false), 1400);
  }

  function release() {
    if (hold.current !== null) window.clearTimeout(hold.current);
    hold.current = null;
  }

  return (
    <button
      type="button"
      className={`say-btn${slow ? ' slow' : ''}${className ? ` ${className}` : ''}`}
      onPointerDown={() => {
        heldSlow.current = false;
        release();
        hold.current = window.setTimeout(playSlow, 450);
      }}
      onPointerUp={release}
      onPointerLeave={release}
      onPointerCancel={release}
      onContextMenu={e => {
        e.preventDefault();
        e.stopPropagation();
        release();
        playSlow();
      }}
      onClick={e => {
        e.stopPropagation(); // don't also reveal a quiz card underneath
        if (heldSlow.current) {
          heldSlow.current = false; // that was a hold: it's already playing slowly
          return;
        }
        say(text, track);
      }}
      aria-label={`Hear “${text}”`}
      title={`${track === 'amharic' ? 'Hear it in Amharic' : 'Hear it'}. Hold to hear it slowly.`}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
        <path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" />
        <path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    </button>
  );
}
