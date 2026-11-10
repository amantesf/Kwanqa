// Quick meanings for Amharic words kwanqa already teaches: single-word
// phrases from the camps, picture words, passport-lesson words
// and the hand-glossed stories. Tapping one of these words in any story or
// book shows its meaning at once, offline and without an account; other
// words are looked up with Claude (lib/gloss.ts).

import { courseContent } from '@/lib/courses';
import { PICTURES } from '@/lib/pictures';
import { PLACE_LESSONS } from '@/lib/placeLessons';
import { STORIES } from '@/lib/stories';
import { cleanWord } from '@/lib/library';

export type Entry = { meaning: string; tr?: string };

let dict: Map<string, Entry> | null = null;

function build() {
  const d = new Map<string, Entry>();
  const add = (am: string, meaning: string, tr?: string) => {
    const word = cleanWord(am.trim());
    if (!word || /\s/.test(word) || d.has(word) || !meaning) return;
    d.set(word, { meaning: meaning.trim(), tr });
  };
  // hand-glossed story words first: they're the most precise
  for (const story of STORIES) for (const s of story.sentences) for (const [am, tr, meaning] of s.words) add(am, meaning, tr);
  for (const [slug, course] of Object.entries(courseContent)) {
    if (!slug.startsWith('amharic-')) continue;
    for (const lesson of course.sections) for (const p of lesson.phrases ?? []) add(p.amharic, p.english, p.transliteration);
  }
  for (const p of PICTURES) add(p.amharic, p.english, p.transliteration);
  for (const lesson of Object.values(PLACE_LESSONS)) for (const c of lesson.cards) add(c.word.am, c.word.en, c.word.tr);
  return d;
}

/** kwanqa's own meaning for this word, if it teaches it. */
export function lookUp(word: string): Entry | null {
  dict ??= build();
  return dict.get(cleanWord(word)) ?? null;
}
