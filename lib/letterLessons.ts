import { courseCatalog, courseContent, type LessonSection } from '@/lib/courses';
import { FIDEL, type FidelCell } from '@/lib/fidel';
import { PICTURES } from '@/lib/pictures';
import type { Level } from '@/lib/profile';

// Reading on the trail: each Amharic lesson teaches a few ፊደል letters from its
// own words (Camp 1 lesson 1 teaches ሰ, ላ and ም from ሰላም), and its quiz gets
// two or three reading questions about them:
// - trace a new letter (website only; new learners),
// - "Which letter do you hear?": Walia says a letter, you pick it,
// - spell a short word from the lesson with letter tiles.
// Lessons with no new letters review ones learned earlier.

/** Most new letters one lesson introduces. */
const NEW_PER_LESSON = 3;
/** Longest word to spell, in letters. */
const SPELL_MAX = 4;

type Letter = FidelCell & { base: string; order: number; sameAs?: string };

/** Every letter in the chart, by character. */
const LETTERS = new Map<string, Letter>(
  FIDEL.flatMap(row => row.cells.map((cell, order) => [cell.char, { ...cell, base: row.base, order, sameAs: row.sameAs }])),
);

const isLetter = (ch: string) => LETTERS.has(ch);
const lettersOf = (word: string) => [...word].filter(isLetter);

/** How a letter is said, for prompts: "la", "se"; the sixth form can have no vowel, so "m(ə)". */
function soundOf(letter: Letter) {
  if (letter.order === 5) return letter.roman.replace(/ə$/, '') || letter.roman;
  return letter.roman;
}

function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** The words of a lesson in the order it teaches them: its phrases first, then its dialogue. */
function lessonWords(lesson: LessonSection) {
  const lines = [...(lesson.phrases ?? []), ...(lesson.dialogue ?? [])].map(c => c.amharic);
  const words = lines.flatMap(line => line.split(/[\s፡።፣፤፥፦፧?!.,…]+/)).filter(w => lettersOf(w).length > 0);
  return [...new Set(words)];
}

type Plan = { fresh: string[]; known: Set<string> };

/**
 * Which letters each Amharic lesson introduces, worked out once for the whole
 * course in order. Looked up by the lesson's content, not the object: pages
 * hand lessons to the browser as copies.
 */
let plans: Map<string, Plan> | null = null;
const lessonKey = (l: LessonSection) => `${l.title}|${l.description}|${l.phrases?.[0]?.amharic ?? l.dialogue?.[0]?.amharic ?? ''}`;

function planFor(lesson: LessonSection): Plan | null {
  if (!plans) {
    plans = new Map();
    const known = new Set<string>();
    const courses = courseCatalog.filter(c => c.track === 'amharic').sort((a, b) => a.part - b.part);
    for (const c of courses) {
      for (const section of courseContent[c.slug]?.sections ?? []) {
        // letters in the order the lesson's words bring them (its first phrase is
        // usually its key word, like ሰላም); the main letters before rarer ones
        // that sound the same as another (ሐ, ሠ, ኀ...)
        const order = [...new Set(lessonWords(section).flatMap(lettersOf))].filter(ch => !known.has(ch));
        const main = order.filter(ch => !LETTERS.get(ch)!.sameAs);
        const fresh = [...main, ...order.filter(ch => LETTERS.get(ch)!.sameAs)].slice(0, NEW_PER_LESSON);
        fresh.forEach(ch => known.add(ch));
        plans.set(lessonKey(section), { fresh, known: new Set(known) });
      }
    }
  }
  return plans.get(lessonKey(lesson)) ?? null;
}

/** Letters to show beside the right one: other forms of the same family and other learned letters, none sounding the same. */
function lookalikes(target: Letter, known: Set<string>, count: number) {
  const sound = soundOf(target);
  const ok = (l: Letter | undefined): l is Letter =>
    !!l && l.char !== target.char && soundOf(l) !== sound && !l.sameAs;
  const family = FIDEL.find(r => r.base === target.base)!.cells.map(c => LETTERS.get(c.char));
  const learned = [...known].map(ch => LETTERS.get(ch));
  const picked: Letter[] = [];
  for (const l of [...shuffle(family.filter(ok)).slice(0, 1), ...shuffle(learned.filter(ok)), ...shuffle(family.filter(ok))]) {
    if (picked.length >= count) break;
    if (!picked.some(p => p.char === l.char || soundOf(p) === soundOf(l))) picked.push(l);
  }
  return picked.map(l => l.char);
}

export type TraceExercise = {
  kind: 'trace';
  id: string;
  instruction: string;
  /** The letter to trace, and how it's said. */
  char: string;
  sound: string;
  /** A word from the lesson it's in, and what that word means. */
  word?: string;
  meaning?: string;
  explain: string;
};

type LetterQuestion =
  | {
      kind: 'choice';
      id: string;
      instruction: string;
      prompt: string;
      options: string[];
      answer: string;
      explain: string;
      listen: true;
      answerAudio: string;
      letters: true;
    }
  | {
      kind: 'build';
      id: string;
      instruction: string;
      prompt: string;
      promptHint?: string;
      tiles: string[];
      answer: string[];
      explain: string;
      answerAudio: string;
      letters: true;
    };

/** A short word with a meaning to spell: a one-word phrase of the lesson, or a picture word, all in letters learned so far. */
function wordToSpell(lesson: LessonSection, known: Set<string>, prefer: string[]) {
  const cards = [...(lesson.phrases ?? []), ...(lesson.dialogue ?? [])]
    .map(c => ({ amharic: c.amharic.replace(/[።፣፧?!.]+$/g, '').trim(), transliteration: c.transliteration, english: c.english }))
    .filter(c => !/\s/.test(c.amharic));
  const candidates = [...cards, ...PICTURES].filter(c => {
    const ls = [...c.amharic];
    return ls.length >= 2 && ls.length <= SPELL_MAX && ls.every(ch => known.has(ch));
  });
  // a word with one of this lesson's new letters, if there is one
  return candidates.find(c => prefer.some(ch => c.amharic.includes(ch))) ?? candidates[0] ?? null;
}

/** "Hello / Peace" -> "hello" (lowercase, except words like "I" or names). */
function meaningOf(english: string) {
  const first = english.split(/\s*[/(]/)[0].trim();
  return /^[A-Z][a-z]/.test(first) ? first[0].toLowerCase() + first.slice(1) : first;
}

/**
 * "Trace the new letter" for a lesson's first new letter, for beginners (the
 * survey's "new" and "some words"), on screens that can draw it. Null when the
 * lesson brings no new letters or the learner is past tracing.
 */
export function traceQuestion(lesson: LessonSection, level: Level | undefined): TraceExercise | null {
  const plan = planFor(lesson);
  const first = plan?.fresh[0] ? LETTERS.get(plan.fresh[0]) : undefined;
  if (!first || (level && level !== 'new' && level !== 'some-words')) return null;
  const word = lessonWords(lesson).find(w => w.includes(first.char));
  const card = word
    ? [...(lesson.phrases ?? []), ...(lesson.dialogue ?? [])].find(c => c.amharic.replace(/[።፣፧?!.]+$/g, '').trim() === word)
    : undefined;
  const meaning = card ? meaningOf(card.english) : undefined;
  return {
    kind: 'trace',
    id: `letter-trace-${first.char}`,
    instruction: 'Trace the new letter',
    char: first.char,
    sound: soundOf(first),
    word,
    meaning,
    explain: word
      ? `${first.char} says “${soundOf(first)}”, as in ${word}${meaning ? ` (“${meaning}”)` : ''}.`
      : `${first.char} says “${soundOf(first)}”.`,
  };
}

/** The reading questions for one Amharic lesson. Harder levels hear the letter without its written sound. */
export function letterQuestions(lesson: LessonSection, level: Level | undefined): LetterQuestion[] {
  const plan = planFor(lesson);
  if (!plan) return [];
  const beginner = !level || level === 'new' || level === 'some-words';
  const out: LetterQuestion[] = [];
  const words = lessonWords(lesson);

  // 1. "Which letter do you hear?": a new letter (or a learned one in review lessons) that has its own sound
  const pool = (plan.fresh.length ? plan.fresh : shuffle(words.flatMap(lettersOf))).map(ch => LETTERS.get(ch)!);
  const target = shuffle(pool.filter(l => !l.sameAs))[0] ?? [...plan.known].map(ch => LETTERS.get(ch)!).find(l => !l.sameAs);
  if (target) {
    const wrong = lookalikes(target, plan.known, beginner ? 2 : 3);
    if (wrong.length >= 2) {
      const family = FIDEL.find(r => r.base === target.base)!;
      const formNote =
        target.order === 0
          ? `the first letter of its family (${family.cells.map(c => c.char).join(' ')})`
          : `it’s ${family.base} (${family.cells[0].roman}), changed to say “${soundOf(target)}”`;
      out.push({
        kind: 'choice',
        id: `letter-hear-${target.char}`,
        instruction: beginner ? `Which letter says “${soundOf(target)}”?` : 'Which letter do you hear?',
        prompt: target.char,
        options: shuffle([target.char, ...wrong]),
        answer: target.char,
        explain: `${target.char} is “${soundOf(target)}”: ${formNote}.`,
        listen: true,
        answerAudio: target.char,
        letters: true,
      });
    }
  }

  // 2. spell a short word with letter tiles
  const spell = wordToSpell(lesson, plan.known, plan.fresh);
  if (spell) {
    const letters = [...spell.amharic];
    const extra = lookalikes(LETTERS.get(letters[letters.length - 1])!, plan.known, 2).filter(ch => !letters.includes(ch));
    const meaning = meaningOf(spell.english);
    out.push({
      kind: 'build',
      id: `letter-spell-${spell.amharic}`,
      instruction: `Spell “${meaning}” with letters`,
      prompt: beginner ? letters.map(ch => soundOf(LETTERS.get(ch)!)).join(' · ') : spell.transliteration,
      promptHint: beginner ? spell.transliteration : undefined,
      tiles: shuffle([...letters, ...extra]),
      answer: letters,
      explain: `${spell.amharic} (${spell.transliteration}) means “${meaning}”.`,
      answerAudio: spell.amharic,
      letters: true,
    });
  }
  return out;
}

/** The letters a lesson introduces, in order (for showing which letters a learner has met). */
export function lettersIntroduced(lesson: LessonSection) {
  return planFor(lesson)?.fresh ?? [];
}
