// Spoken Amharic for every lesson line. Hand-made recordings (lib/phraseAudio.ts)
// come first; anything without one is read by Walia's Azure voice (Ameha)
// through /api/speak. Each line is made once and then cached for a year, so
// Azure only ever reads it the first time anyone hears it.

import { courseContent } from '@/lib/courses';
import { PICTURES } from '@/lib/pictures';
import { phraseAudio } from '@/lib/phraseAudio';
import { fidelSounds } from '@/lib/fidel';
import { proverbs } from '@/lib/proverbs';

const PUNCT = /[።፣፤፥፦፧?!.,]/g;

/** Lines with a gap in them (ስሜ ... ነው) are patterns, not something to say. */
const hasGap = (text: string) => text.includes('...') || text.includes('…') || text.includes('__');

/**
 * Every Amharic phrase, dialogue line, word tile, answer and picture word in the
 * Amharic course, plus the Amharic meaning of every line in the English course
 * (so Amharic speakers can hear those too).
 */
export function speakableAmharic(): Set<string> {
  const lines: string[] = [];
  for (const [slug, course] of Object.entries(courseContent)) {
    if (!slug.startsWith('amharic-')) continue;
    for (const lesson of course.sections) {
      for (const card of [...(lesson.phrases ?? []), ...(lesson.dialogue ?? [])]) lines.push(card.amharic);
      for (const set of lesson.respect ?? []) lines.push(set.man, set.woman, set.elder);
    }
  }
  const words = lines.flatMap(line => line.split(/\s+/).map(w => w.replace(PUNCT, '')));
  const meanings: string[] = [];
  for (const [slug, course] of Object.entries(courseContent)) {
    if (!slug.startsWith('english-')) continue;
    for (const lesson of course.sections) {
      for (const card of [...(lesson.phrases ?? []), ...(lesson.dialogue ?? [])]) meanings.push(card.amharic);
    }
  }
  return new Set(
    [
      ...lines,
      ...words,
      ...meanings,
      ...PICTURES.map(p => p.amharic),
      ...fidelSounds(),
      // every proverb, and each of its words for the tap-a-word hints
      ...proverbs.flatMap(p => [p.amharic, ...p.words.map(w => w.am)]),
    ]
      .map(t => t?.trim())
      .filter(t => t && !hasGap(t)),
  );
}

let allowed: Set<string> | null = null;

/** Where to hear this Amharic: a hand-made recording if there is one, otherwise Walia's voice. */
export function amharicAudio(text: string): string | null {
  const recorded = phraseAudio(text);
  if (recorded) return recorded;
  allowed ??= speakableAmharic();
  const clean = text.trim();
  return allowed.has(clean) ? `/api/speak?text=${encodeURIComponent(clean)}` : null;
}
