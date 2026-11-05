// How Amharic works, in small pieces, for the Amharic course:
// - Grammar cards ("How it works"): one rule, a small table and examples from
//   the lesson, shown on the lesson page after its phrases.
// - Word breakdowns: tap a word in a phrase to see the pieces it's built from
//   (ስምህ = səmm-əh, name-your), so a phrase becomes a pattern you can reuse.
//
// Shared by the website and the phone app. Everything here should be checked
// by a native speaker before it goes out: a wrong rule teaches a wrong habit.

import type { LessonSection } from '@/lib/courses';

export type GrammarCard = {
  title: string;
  /** The rule, in a sentence or two of plain English. */
  rule: string;
  /** A small pattern table: the first row is the header. */
  table?: string[][];
  /** Lines from the lesson that show the rule. */
  examples: { amharic: string; transliteration: string; english: string }[];
  /** An extra hint, e.g. how it connects to an earlier lesson. */
  tip?: string;
};

/** One piece of a word: how it's said and what it adds. */
export type WordPart = { roman: string; gloss: string };

/** Grammar cards by lesson: "<course slug>:<lesson index>". */
const CARDS: Record<string, GrammarCard[]> = {
  // Camp 1, Lesson 2: Introducing Yourself
  'amharic-beginner-1:1': [
    {
      title: 'My and your go on the end of the word',
      rule: 'Amharic has no separate words for “my” and “your”. It adds an ending to the noun. “Your” has one form for a man and another for a woman.',
      table: [
        ['', 'ስም səm (name)', 'ቤት bet (house)'],
        ['my', 'ስሜ səme', 'ቤቴ bete'],
        ['your (man)', 'ስምህ səmməh', 'ቤትህ betəh'],
        ['your (woman)', 'ስምሽ səmməsh', 'ቤትሽ betəsh'],
        ['his', 'ስሙ səmu', 'ቤቱ betu'],
        ['her', 'ስሟ səmwa', 'ቤቷ betwa'],
      ],
      examples: [
        { amharic: 'ስሜ ዳዊት ነው።', transliteration: 'səme Dawit new.', english: 'My name is Dawit.' },
        { amharic: 'ስምሽ ማን ነው?', transliteration: 'səmməsh man new?', english: 'What is your name? (to a woman)' },
      ],
    },
    {
      title: '“Is” and “am” come last',
      rule: 'Amharic puts the verb at the end of the sentence. “My name Dawit is.” “From America I-am.” The word for “is / am” changes with who it’s about.',
      table: [
        ['', 'is / am / are'],
        ['I am', 'ነኝ neñ'],
        ['you are (man)', 'ነህ neh'],
        ['you are (woman)', 'ነሽ nesh'],
        ['he / it is', 'ነው new'],
        ['she is', 'ናት nat'],
        ['we are', 'ነን nen'],
      ],
      examples: [
        { amharic: 'ከአሜሪካ ነኝ።', transliteration: 'kə Amerika neñ.', english: 'I am from America.' },
        { amharic: 'ስምህ ማን ነው?', transliteration: 'səmməh man new?', english: 'What is your name? (to a man)' },
      ],
      tip: 'You met ነህ and ነሽ in Lesson 1: እንዴት ነህ? is “how are you?” to a man. And ከ- (kə-, “from”) joins the front of the place: ከአሜሪካ.',
    },
  ],
};

/** The pieces of words used in the lessons, by the word as it's written. */
const PARTS: Record<string, WordPart[]> = {
  ስሜ: [
    { roman: 'səm', gloss: 'name' },
    { roman: '-e', gloss: 'my' },
  ],
  ስምህ: [
    { roman: 'səmm', gloss: 'name' },
    { roman: '-əh', gloss: 'your (man)' },
  ],
  ስምሽ: [
    { roman: 'səmm', gloss: 'name' },
    { roman: '-əsh', gloss: 'your (woman)' },
  ],
  ነው: [{ roman: 'new', gloss: 'is' }],
  ነኝ: [
    { roman: 'ne', gloss: 'be' },
    { roman: '-ñ', gloss: 'I' },
  ],
  ማን: [{ roman: 'man', gloss: 'who' }],
  እባክህ: [
    { roman: 'əbbak', gloss: 'please (I beg)' },
    { roman: '-əh', gloss: 'you (man)' },
  ],
  እባክሽ: [
    { roman: 'əbbak', gloss: 'please (I beg)' },
    { roman: '-əsh', gloss: 'you (woman)' },
  ],
  ከአሜሪካ: [
    { roman: 'kə-', gloss: 'from' },
    { roman: 'Amerika', gloss: 'America' },
  ],
  ከኢትዮጵያ: [
    { roman: 'kə-', gloss: 'from' },
    { roman: 'Ityopya', gloss: 'Ethiopia' },
  ],
  መጣሁ: [
    { roman: 'metta', gloss: 'came' },
    { roman: '-hu', gloss: 'I' },
  ],
};

const PUNCTUATION = /[።፣፤፥፦፧?!.,…]/g;

export function grammarFor(slug: string, lessonIndex: number): GrammarCard[] {
  return CARDS[`${slug}:${lessonIndex}`] ?? [];
}

/** The pieces of one written word (punctuation ignored), if we know them. */
export function partsOf(word: string): WordPart[] | null {
  return PARTS[word.replace(PUNCTUATION, '').trim()] ?? null;
}

/** A line split into its words, each with its pieces when known. */
export function wordsOf(line: string): { word: string; parts: WordPart[] | null }[] {
  return line
    .split(/\s+/)
    .filter(Boolean)
    .map(word => ({ word, parts: partsOf(word) }));
}

/** Whether any word in the lesson's phrases can be broken down. */
export function hasBreakdowns(lesson: LessonSection) {
  return (lesson.phrases ?? []).some(p => wordsOf(p.amharic).some(w => w.parts));
}
