import { courseCatalog, courseContent } from '@/lib/courses';

// Flashcard decks from the Amharic course's lesson phrases, one per camp,
// shared by the website and the phone app.

export type Card = { amharic: string; transliteration: string; english: string };
export type Deck = { slug: string; part: number; title: string; cards: Card[] };

const GAP = /\.\.\.|…|__/;

// one deck per Amharic camp: its lessons' phrases, without repeats or fill-in-the-gap patterns
export const DECKS: Deck[] = courseCatalog
  .filter(c => c.track === 'amharic')
  .sort((a, b) => a.part - b.part)
  .map(c => {
    const seen = new Set<string>();
    const cards: Card[] = [];
    for (const section of courseContent[c.slug]?.sections ?? []) {
      for (const p of section.phrases ?? []) {
        const key = p.amharic.trim();
        if (GAP.test(key) || seen.has(key)) continue;
        seen.add(key);
        cards.push({ amharic: key, transliteration: p.transliteration, english: p.english });
      }
    }
    return { slug: c.slug, part: c.part, title: c.description, cards };
  })
  .filter(d => d.cards.length > 0);

export function shuffle<T>(list: T[]) {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** "Still learning": the card goes back into the pile a few cards later. */
export function putBack(pile: Card[]) {
  const [card, ...rest] = pile;
  const at = Math.min(rest.length, 3 + Math.floor(Math.random() * 3));
  return [...rest.slice(0, at), card, ...rest.slice(at)];
}
