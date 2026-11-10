// The words a learner knows, LingQ style. Each word they've marked is either
// "learning" (still getting it) or "known"; every other word is new. The
// count of known words is the progress number on /stories.
//
// Kept on this device (lib/storage.ts), keyed by the word as written.

import { useMemo, useSyncExternalStore } from 'react';
import { onOtherTab, storage } from '@/lib/storage';

export type WordStatus = 'new' | 'learning' | 'known';

const KEY = 'kwanqa-words';
const listeners = new Set<() => void>();

function readRaw(): string {
  try {
    return storage().getItem(KEY) ?? '{}';
  } catch {
    return '{}';
  }
}

function parse(raw: string): Record<string, Exclude<WordStatus, 'new'>> {
  try {
    const data = JSON.parse(raw);
    return data && typeof data === 'object' ? data : {};
  } catch {
    return {};
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const stop = onOtherTab(key => {
    if (key === KEY || key === null) listener();
  });
  return () => {
    listeners.delete(listener);
    stop();
  };
}

function write(words: Record<string, Exclude<WordStatus, 'new'>>) {
  try {
    storage().setItem(KEY, JSON.stringify(words));
  } catch {
    // storage blocked: the marks last until the page closes
  }
  listeners.forEach(l => l());
}

export function setWordStatus(word: string, status: WordStatus) {
  const words = parse(readRaw());
  if (status === 'new') delete words[word];
  else words[word] = status;
  write(words);
}

/** Marks every word in `list` that's still new as known (finishing a story, like LingQ). */
export function markRestKnown(list: string[]) {
  const words = parse(readRaw());
  for (const w of list) if (!words[w]) words[w] = 'known';
  write(words);
}

export function useKnownWords() {
  const raw = useSyncExternalStore(subscribe, readRaw, () => '{}');
  return useMemo(() => {
    const words = parse(raw);
    const status = (word: string): WordStatus => words[word] ?? 'new';
    const known = Object.values(words).filter(s => s === 'known').length;
    const learning = Object.values(words).filter(s => s === 'learning').length;
    return { status, known, learning };
  }, [raw]);
}
