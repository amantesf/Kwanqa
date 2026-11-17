'use client';

// The lesson page's "Hide English" switch, and the lines it hides. With the
// switch on, every meaning on the lesson page (phrase cards, grammar examples,
// word families, the mini-dialogue) becomes a small "Show English" button, so
// you read the Amharic first and only peek when you need to. The choice is
// remembered in this browser, from lesson to lesson.

import { useState, useSyncExternalStore, type ReactNode } from 'react';
import type { Track } from '@/lib/courses';

const KEY = 'kwanqa-hide-meaning';
const listeners = new Set<() => void>();
let fallback = false; // when storage is unavailable

function read() {
  try {
    return localStorage.getItem(KEY) === '1';
  } catch {
    return fallback;
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useHideMeaning() {
  return useSyncExternalStore(subscribe, read, () => false);
}

function setHideMeaning(hide: boolean) {
  fallback = hide;
  try {
    localStorage.setItem(KEY, hide ? '1' : '0');
  } catch {
    // the setting lasts for this visit
  }
  listeners.forEach(l => l());
}

/** What the meaning is called: English for the Amharic course, Amharic for the English one. */
const meaningName = (track: Track) => (track === 'english' ? 'Amharic' : 'English');

/** The switch, at the top of the lesson. */
export function HideMeaningToggle({ track }: { track: Track }) {
  const hide = useHideMeaning();
  return (
    <label className="toggle hide-meaning" title="Read the Amharic first; tap a line to peek">
      <input type="checkbox" checked={hide} onChange={e => setHideMeaning(e.target.checked)} />
      Hide {meaningName(track)}
    </label>
  );
}

/** A meaning that hides behind a "Show English" button while the switch is on. */
export default function Peek({ children, track, className }: { children: ReactNode; track: Track; className?: string }) {
  const hide = useHideMeaning();
  const [shown, setShown] = useState(false);
  if (!hide || shown) return <span className={className}>{children}</span>;
  return (
    <button
      type="button"
      className="peek"
      onClick={e => {
        e.stopPropagation(); // don't also flip a quiz card
        setShown(true);
      }}
    >
      Show {meaningName(track)}
    </button>
  );
}
