'use client';

// A small speaker button that reads a phrase aloud in the language being
// learned: Amharic (your recordings first, then Walia's Azure voice) or
// English (the English voice, with the browser's voice as a backup).
// It hides itself when there's nothing to say, like ስሜ ... ነው.

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

export function say(text: string, track: Track) {
  const sound = soundFor(text, track);
  if (!sound) return;
  playing?.pause();
  try {
    window.speechSynthesis?.cancel();
  } catch {
    // no browser voice: fine
  }
  const el = new Audio(sound.src);
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
  track: Track;
  className?: string;
  size?: number;
}) {
  if (!soundFor(text, track)) return null;
  return (
    <button
      type="button"
      className={`say-btn${className ? ` ${className}` : ''}`}
      onClick={e => {
        e.stopPropagation(); // don't also reveal a quiz card underneath
        say(text, track);
      }}
      aria-label={`Hear “${text}”`}
      title="Hear it"
    >
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
        <path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" />
        <path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    </button>
  );
}
