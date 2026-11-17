// "Act it out": a lesson's mini-dialogue played as a real conversation. Walia
// says one side, out loud; you answer the other, sometimes by choosing the
// right reply and sometimes by typing the missing word. Short dialogues carry
// on with exchanges from the camp's earlier lessons, so there's always a bit of
// a story to follow. The screen is components/DialoguePlay.tsx.

import type { LessonSection, Track } from '@/lib/courses';

type Card = { amharic: string; transliteration: string; english: string };
type Speaker = 'A' | 'B';
type Line = Card & { speaker: Speaker };

export type Said = { learn: string; roman: string; meaning: string };

export type Turn =
  | { kind: 'them'; said: Said }
  | { kind: 'note'; text: string }
  | { kind: 'choose'; said: Said; options: Said[] }
  /** fill in the missing word: `words` with `blank` taken out; `accept` are the spellings that count */
  | { kind: 'fill'; said: Said; words: string[]; blank: number; accept: string[]; hint: string };

export type Scene = { title: string; setting: string; turns: Turn[] };

const GAP = /\.\.\.|…|__/;
const PUNCT = /[።፣፤፥፦፧?!.,;:"“”]/g;

function said(card: Card, track: Track): Said {
  return track === 'english'
    ? { learn: card.english, roman: '', meaning: card.amharic }
    : { learn: card.amharic, roman: card.transliteration, meaning: card.english };
}

function shuffle<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const usable = (c: Card) => !GAP.test(c.amharic) && !GAP.test(c.english);
const bare = (word: string) => word.replace(PUNCT, '');

/** A fill-in-the-blank turn, if the line has a word worth leaving out. */
function fillTurn(line: Said, track: Track): Turn | null {
  const words = line.learn.split(/\s+/).filter(Boolean);
  if (words.length < 2) return null;
  const roman = line.roman.split(/\s+/).filter(Boolean);
  // the Amharic and its transliteration have to line up word for word
  if (track === 'amharic' && roman.length !== words.length) return null;
  // leave out the longest word: it's usually the one that carries the meaning
  let blank = 0;
  words.forEach((w, i) => {
    if (bare(w).length > bare(words[blank]).length) blank = i;
  });
  if (bare(words[blank]).length < 2) return null;
  const accept = [bare(words[blank]), ...(track === 'amharic' ? [bare(roman[blank])] : [])];
  return {
    kind: 'fill',
    said: line,
    words,
    blank,
    accept,
    hint: track === 'amharic' ? `${bare(roman[blank])[0] ?? ''}…` : `${bare(words[blank])[0]}…`,
  };
}

/** The conversation for one lesson, ready to play. Random, so build it in the browser. */
export function buildScene(lesson: LessonSection, courseLessons: LessonSection[], track: Track): Scene | null {
  const own = (lesson.dialogue ?? []).filter(usable) as Line[];
  if (own.length < 2) return null;

  // you take the side with the most lines to say back (usually B)
  const you: Speaker = own.filter(l => l.speaker === 'B').length ? 'B' : 'A';
  const lines: (Line | { note: string })[] = [...own];

  // keep chatting with earlier exchanges from this camp if the dialogue is short
  const yourTurns = () => lines.filter(l => 'speaker' in l && l.speaker === you).length;
  if (yourTurns() < 3) {
    const here = courseLessons.indexOf(lesson);
    const earlier = shuffle(courseLessons.slice(0, Math.max(0, here)));
    for (const l of earlier) {
      if (yourTurns() >= 3) break;
      const d = (l.dialogue ?? []).filter(usable) as Line[];
      const i = d.findIndex((x, k) => x.speaker !== you && d[k + 1]?.speaker === you);
      if (i < 0) continue;
      lines.push({ note: 'Walia keeps chatting…' }, d[i], d[i + 1]);
    }
  }

  // wrong replies to choose from: other lines from this camp
  const pool = [
    ...new Set(
      courseLessons
        .flatMap(l => [...(l.dialogue ?? []), ...(l.phrases ?? [])])
        .filter(usable)
        .map(c => JSON.stringify(said(c, track))),
    ),
  ].map(s => JSON.parse(s) as Said);

  let asked = 0;
  const turns: Turn[] = lines.map(l => {
    if (!('speaker' in l)) return { kind: 'note', text: l.note };
    const line = said(l, track);
    if (l.speaker !== you) return { kind: 'them', said: line };
    asked++;
    // every other answer is typed, when the line has a good word to leave out
    const fill = asked % 2 === 0 ? fillTurn(line, track) : null;
    if (fill) return fill;
    const wrong = shuffle(pool.filter(p => p.learn !== line.learn)).slice(0, 2);
    return { kind: 'choose', said: line, options: shuffle([line, ...wrong]) };
  });

  const title = lesson.title.replace(/^Lesson \d+ – /, '');
  return {
    title,
    setting: `${lesson.description} Walia starts the conversation. Answer in ${track === 'english' ? 'English' : 'Amharic'}.`,
    turns,
  };
}
