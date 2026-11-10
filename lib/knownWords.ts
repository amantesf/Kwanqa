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

// ---------------------------------------------------------------------------
// Notes: what each marked word means, so the Words page can review the words
// someone is learning. Saved when a word is marked, with the meaning the
// reader showed and the sentence it came from.

export type WordNote = {
  meaning: string;
  tr: string;
  /** The sentence the word was met in. */
  sentence?: string;
  /** Right answers in a row in review; three makes it known. */
  streak?: number;
};

const NOTES_KEY = 'kwanqa-word-notes';
const MAX_NOTES = 3000;

function readNotesRaw(): string {
  try {
    return storage().getItem(NOTES_KEY) ?? '{}';
  } catch {
    return '{}';
  }
}

function writeNotes(notes: Record<string, WordNote>) {
  const keys = Object.keys(notes);
  if (keys.length > MAX_NOTES) for (const k of keys.slice(0, keys.length - MAX_NOTES)) delete notes[k];
  try {
    storage().setItem(NOTES_KEY, JSON.stringify(notes));
  } catch {
    // storage full or blocked: notes are a nice-to-have
  }
  listeners.forEach(l => l());
}

export function setWordNote(word: string, note: WordNote) {
  const notes = parse(readNotesRaw()) as unknown as Record<string, WordNote>;
  notes[word] = { ...notes[word], ...note };
  writeNotes(notes);
}

export function useWordNotes(): Record<string, WordNote> {
  const raw = useSyncExternalStore(subscribe, readNotesRaw, () => '{}');
  return useMemo(() => parse(raw) as unknown as Record<string, WordNote>, [raw]);
}

/** A review answer: three right in a row makes a word known; a miss starts over. */
export function reviewWord(word: string, right: boolean) {
  const notes = parse(readNotesRaw()) as unknown as Record<string, WordNote>;
  const note = notes[word];
  const streak = right ? (note?.streak ?? 0) + 1 : 0;
  if (note) notes[word] = { ...note, streak };
  writeNotes(notes);
  if (right && streak >= 3) setWordStatus(word, 'known');
}

// ---------------------------------------------------------------------------
// Meanings Walia already looked up (lib/gloss.ts), so a word is only asked
// about once per sentence on this device.

const GLOSS_KEY = 'kwanqa-gloss';
const MAX_GLOSSES = 600;

export type CachedGloss = { meaning: string; base: string; baseMeaning: string; parts: string };

export function cachedGloss(word: string, sentence: string): CachedGloss | null {
  try {
    const all = JSON.parse(storage().getItem(GLOSS_KEY) ?? '{}') as Record<string, CachedGloss>;
    return all[`${word}|${sentence}`] ?? all[word] ?? null;
  } catch {
    return null;
  }
}

export function cacheGloss(word: string, sentence: string, gloss: CachedGloss) {
  try {
    const all = JSON.parse(storage().getItem(GLOSS_KEY) ?? '{}') as Record<string, CachedGloss>;
    all[`${word}|${sentence}`] = gloss;
    all[word] ??= gloss; // a fallback for the same word in another sentence
    const keys = Object.keys(all);
    if (keys.length > MAX_GLOSSES) for (const k of keys.slice(0, keys.length - MAX_GLOSSES)) delete all[k];
    storage().setItem(GLOSS_KEY, JSON.stringify(all));
  } catch {
    // storage full or blocked
  }
}
