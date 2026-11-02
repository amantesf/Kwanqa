// Four livelier question types for the website's lessons, added next to the
// usual ones (lib/exercises.ts):
// - "Speak this": say a phrase into the microphone; Walia checks it (/api/listen).
// - "Type what you hear": hear a line and type it (Amharic learners can type
//   the ፊደል or the transliteration).
// - "Put the conversation in order": tap the lines of a short dialogue in order.
// - "Chat with Walia": a role-play. Walia says a line, you pick your reply, and
//   the conversation carries on for two or three turns.
//
// They're kept out of the shared Exercise type on purpose: the phone app
// builds lessons from lib/exercises.ts and doesn't know how to show these yet.

import type { LessonSection, Track } from '@/lib/courses';
import type { Level } from '@/lib/profile';

type Card = { amharic: string; transliteration: string; english: string };

export type SpeakExercise = {
  kind: 'speak';
  id: string;
  instruction: string;
  /** What to say, in the language being learned. */
  prompt: string;
  /** Help under it: the transliteration (Amharic) or the Amharic meaning (English). */
  promptHint?: string;
  lang: 'am' | 'en';
  explain: string;
  answerAudio: string;
};

export type TypeExercise = {
  kind: 'type';
  id: string;
  instruction: string;
  /** The line that's played (and shown once it's answered). */
  prompt: string;
  /** Spellings that count as right: the line itself, and for Amharic its transliteration. */
  accept: string[];
  /** What to show as the answer, e.g. "ውሃ እፈልጋለሁ (wiha ifeligalehu)". */
  shown: string;
  placeholder: string;
  listen: true;
  explain: string;
  answerAudio: string;
};

export type OrderLine = { speaker: 'A' | 'B'; text: string; hint?: string };

export type OrderExercise = {
  kind: 'order';
  id: string;
  instruction: string;
  /** The conversation in the right order. The screen shuffles them. */
  lines: OrderLine[];
  /** The shuffled order the lines are offered in (indices into `lines`). */
  offered: number[];
  explain: string;
};

export type ChatTurn = {
  /** Walia's line, in the language being learned, and help under it. */
  walia: string;
  waliaHint?: string;
  options: string[];
  answer: string;
  /** Help under each option (transliteration for beginners, or the Amharic meaning). */
  hints?: Record<string, string>;
};

export type ChatExercise = {
  kind: 'chat';
  id: string;
  instruction: string;
  turns: ChatTurn[];
  explain: string;
};

/** "New phrase": shown the first time a lesson's phrase comes up, before any question about it. */
export type IntroExercise = {
  kind: 'intro';
  id: string;
  instruction: string;
  /** The phrase in the language being learned, how to read it, and what it means. */
  learn: string;
  roman?: string;
  meaning: string;
  picture?: string;
};

export type InteractiveExercise = SpeakExercise | TypeExercise | OrderExercise | ChatExercise | IntroExercise;

function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const ETHIOPIC_PUNCT = /[።፣፤፥፦፧፨]/g;
const strip = (t: string) => t.replace(ETHIOPIC_PUNCT, ' ').replace(/[?!.,;:"“”]/g, ' ').replace(/\s+/g, ' ').trim();
const wordCount = (t: string) => strip(t).split(' ').filter(Boolean).length;
const hasGap = (t: string) => t.includes('...') || t.includes('…') || t.includes('__');

// ---------------------------------------------------------------------------
// Checking answers

/** Letters only, lowercased: "I'm ok!" → "imok"; Amharic keeps its letters. */
function squash(text: string) {
  return text
    .normalize('NFC')
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(ETHIOPIC_PUNCT, '')
    .replace(/[^\p{L}\p{N}]/gu, '');
}

/** Transliterations are spelled many ways (ə/e, ñ/gn, doubled letters): smooth them out. */
function looseRoman(text: string) {
  return squash(
    text
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '') // ē → e
      .replace(/ə/g, 'e')
      .replace(/ñ/g, 'gn'),
  ).replace(/(.)\1+/g, '$1'); // "ennate" ~ "enate"
}

/** Share of letters that would have to change to turn `a` into `b`. */
function distance(a: string, b: string) {
  if (!a) return b ? 1 : 0;
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) {
      cur.push(Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)));
    }
    prev = cur;
  }
  return prev[b.length] / a.length;
}

/** A typed answer: right if it's one of the accepted spellings, give or take a small typo. */
export function typedRight(exercise: TypeExercise, typed: string) {
  const t = squash(typed);
  const roman = looseRoman(typed);
  if (!t) return false;
  return exercise.accept.some(a => {
    if (/[ሀ-፿]/.test(a)) return distance(squash(a), t) <= 0.15;
    const target = looseRoman(a);
    return distance(target, roman) <= 0.25;
  });
}

/** What the microphone heard: right if it's close enough to the phrase (speech-to-text isn't perfect). */
export function spokenRight(exercise: SpeakExercise, heard: string) {
  const target = squash(exercise.prompt);
  const said = squash(heard);
  if (!said) return false;
  return said.includes(target) || distance(target, said) <= (exercise.lang === 'am' ? 0.4 : 0.3);
}

// ---------------------------------------------------------------------------
// Building the questions for a lesson

type Options = {
  level?: Level;
  /** The camp's first lessons: beginners get the gentler question types only. */
  firstCamp?: boolean;
  /** Lines that can be played aloud: questions only use those. */
  canHear: (text: string) => boolean;
  /** The microphone can be used (a logged-in learner whose browser can record). */
  speaking: boolean;
};

/** The lesson's cards, both ways round: what's learned and the learner's own language. */
function sides(card: Card, track: Track) {
  return track === 'english'
    ? { learn: card.english, roman: '', meaning: card.amharic }
    : { learn: card.amharic, roman: card.transliteration, meaning: card.english };
}

/**
 * The interactive questions for one lesson: one of each kind the lesson's
 * content allows. The lesson screen spreads them through the lesson.
 */
export function interactiveQuestions(
  lesson: LessonSection,
  courseLessons: LessonSection[],
  track: Track,
  options: Options,
): InteractiveExercise[] {
  const beginner = !options.level || options.level === 'new' || options.level === 'some-words';
  // Beginners in Camp 1 can't read or type the ፊደል yet: they listen, speak,
  // and chat, and typing and ordering come in from Camp 2.
  const gentle = beginner && !!options.firstCamp;
  const phrases = (lesson.phrases ?? []).filter(c => !hasGap(c.amharic) && !hasGap(c.english));
  const dialogue = (lesson.dialogue ?? []).filter(c => !hasGap(c.amharic) && !hasGap(c.english));
  const out: InteractiveExercise[] = [];
  const both = (en: string, am: string) => (track === 'english' ? `${am} · ${en}` : en);

  // Speak this: a short phrase, 1–6 words
  if (options.speaking) {
    const card = shuffle(phrases).find(c => {
      const s = sides(c, track);
      return wordCount(s.learn) <= 6 && options.canHear(s.learn);
    });
    if (card) {
      const s = sides(card, track);
      out.push({
        kind: 'speak',
        id: `speak-${s.learn}`,
        instruction: both('Speak this', 'ይህን ይናገሩ'),
        prompt: s.learn,
        promptHint: track === 'english' ? s.meaning : beginner ? `${s.roman} · ${s.meaning}` : s.meaning,
        lang: track === 'english' ? 'en' : 'am',
        explain: track === 'english' ? `“${s.learn}” = ${s.meaning}` : `${s.learn} (${s.roman}) means “${s.meaning}”.`,
        answerAudio: s.learn,
      });
    }
  }

  // Type what you hear: a short line, so typing it is quick (not the one just
  // spoken). Beginners only type single words.
  const spoken = out.find(q => q.kind === 'speak')?.prompt;
  const longest = beginner ? (track === 'english' ? 3 : 1) : track === 'english' ? 6 : 3;
  const typeCard = gentle
    ? undefined
    : shuffle([...phrases, ...dialogue]).find(c => {
        const s = sides(c, track);
        return s.learn !== spoken && wordCount(s.learn) >= 1 && wordCount(s.learn) <= longest && options.canHear(s.learn);
      });
  if (typeCard) {
    const s = sides(typeCard, track);
    out.push({
      kind: 'type',
      id: `type-${s.learn}`,
      instruction: both('Type what you hear', 'የሰሙትን ይጻፉ'),
      prompt: s.learn,
      accept: track === 'english' ? [s.learn] : [s.learn, s.roman].filter(Boolean),
      shown: track === 'english' ? s.learn : `${s.learn} (${s.roman})`,
      placeholder: track === 'english' ? 'እዚህ ይጻፉ · Type in English' : 'Type in ፊደል or in English letters',
      listen: true,
      explain: track === 'english' ? `“${s.learn}” = ${s.meaning}` : `${s.learn} (${s.roman}) means “${s.meaning}”.`,
      answerAudio: s.learn,
    });
  }

  // Put the conversation in order: 3–4 lines of the dialogue, starting at its beginning
  if (dialogue.length >= 3 && !gentle) {
    const lines = (lesson.dialogue ?? []).slice(0, 4).filter(l => !hasGap(l.amharic) && !hasGap(l.english));
    if (lines.length >= 3) {
      const ordered: OrderLine[] = lines.map(l => {
        const s = sides(l, track);
        return {
          speaker: l.speaker === 'B' ? 'B' : 'A',
          text: s.learn,
          hint: track === 'english' ? s.meaning : beginner ? s.roman : s.meaning,
        };
      });
      let offered = shuffle(ordered.map((_, i) => i));
      // never offer them already in order
      if (offered.every((v, i) => v === i)) offered = [...offered.slice(1), offered[0]];
      out.push({
        kind: 'order',
        id: `order-${ordered[0].text}`,
        instruction: both('Put the conversation in order', 'ውይይቱን በቅደም ተከተል ያስቀምጡ'),
        lines: ordered,
        offered,
        explain: both('That’s how the conversation goes.', 'ውይይቱ እንዲህ ነው የሚሄደው።'),
      });
    }
  }

  // Chat with Walia: Walia says A's lines, you choose B's replies. Many
  // dialogues are a single exchange, so the chat carries on with exchanges from
  // the camp's earlier lessons (things the learner has already met).
  const pairsIn = (l: LessonSection) => {
    const lines = l.dialogue ?? [];
    const found: { said: Card; reply: Card }[] = [];
    for (let i = 0; i + 1 < lines.length; i++) {
      const [a, b] = [lines[i], lines[i + 1]];
      if (a.speaker === 'A' && b.speaker === 'B' && ![a, b].some(c => hasGap(c.amharic) || hasGap(c.english))) {
        found.push({ said: a, reply: b });
      }
    }
    return found;
  };
  const here = courseLessons.findIndex(l => l === lesson || l.title === lesson.title);
  const earlier = here > 0 ? courseLessons.slice(0, here) : [];
  const pairs = [...pairsIn(lesson), ...shuffle(earlier.flatMap(pairsIn))].slice(0, 3);
  if (pairs.length >= 2) {
    // wrong replies: other lines from this camp that aren't questions or lines of this chat
    const own = new Set(pairs.flatMap(p => [sides(p.reply, track).learn, sides(p.said, track).learn]));
    const pool = [
      ...new Set(
        courseLessons
          .flatMap(l => [...(l.dialogue ?? []), ...(l.phrases ?? [])])
          .filter(c => !hasGap(c.amharic) && !hasGap(c.english))
          .map(c => sides(c, track).learn)
          .filter(t => !own.has(t) && !/[?፧]/.test(t) && wordCount(t) >= 2),
      ),
    ];
    const hintOf = new Map(
      courseLessons
        .flatMap(l => [...(l.dialogue ?? []), ...(l.phrases ?? [])])
        .map(c => {
          const s = sides(c, track);
          return [s.learn, track === 'english' ? s.meaning : beginner ? s.roman : s.meaning] as const;
        }),
    );
    const turns: ChatTurn[] = pairs.map(pair => {
      const said = sides(pair.said, track);
      const reply = sides(pair.reply, track);
      const wrong = shuffle(pool.filter(t => t !== reply.learn)).slice(0, beginner ? 1 : 2);
      const choices = shuffle([reply.learn, ...wrong]);
      return {
        walia: said.learn,
        waliaHint: track === 'english' ? said.meaning : beginner ? `${said.roman} · ${said.meaning}` : said.meaning,
        options: choices,
        answer: reply.learn,
        hints: Object.fromEntries(choices.flatMap(c => (hintOf.get(c) ? [[c, hintOf.get(c)!]] : []))),
      };
    });
    if (turns.every(t => t.options.length >= 2)) {
      out.push({
        kind: 'chat',
        id: `chat-${turns[0].walia}`,
        instruction: both('Chat with Walia', 'ከዋሊያ ጋር ያውሩ'),
        turns,
        explain: both('Great conversation!', 'ጥሩ ውይይት ነበር!'),
      });
    }
  }
  return out;
}

/**
 * "New phrase" cards for a lesson being climbed for the first time: each of
 * its phrases, with how to say it and what it means (and its picture), shown
 * just before the first question about it. Teach, then test.
 */
export function introCards(
  lesson: LessonSection,
  track: Track,
  pictureOf: (amharic: string) => string | undefined,
): IntroExercise[] {
  return (lesson.phrases ?? [])
    .filter(c => !hasGap(c.amharic) && !hasGap(c.english))
    .map(card => {
      const s = sides(card, track);
      return {
        kind: 'intro' as const,
        id: `intro-${s.learn}`,
        instruction: track === 'english' ? 'አዲስ ሐረግ · New phrase' : 'New phrase',
        learn: s.learn,
        roman: s.roman || undefined,
        meaning: s.meaning,
        picture: pictureOf(card.amharic.replace(ETHIOPIC_PUNCT, '').trim()),
      };
    });
}
