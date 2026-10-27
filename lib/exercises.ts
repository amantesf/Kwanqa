import type { LessonSection, Track } from '@/lib/courses';
import { PICTURES, pictureFor, type Picture } from '@/lib/pictures';

// Practice questions generated from a lesson's phrases and dialogue. The Amharic
// course quizzes Amharic; the English course quizzes English, with Amharic as
// the learner's own language (instructions are in both).

type Card = { amharic: string; transliteration: string; english: string };

export type ChoiceExercise = {
  kind: 'choice';
  id: string;
  instruction: string;
  prompt: string;
  promptHint?: string;
  options: string[];
  answer: string;
  /** Shown after answering, so mistakes become learning moments. */
  explain: string;
  /**
   * Amharic to say out loud after answering instead of while answering
   * (fill-in-the-blank: hearing the whole line first would give it away).
   */
  revealAudio?: string;
  /** Picture questions: each option is a card with this picture. */
  pictures?: Record<string, { src: string; transliteration: string }>;
  /** Harder picture questions: the cards show only pictures until answered. */
  hideWords?: boolean;
  /** "Tap what you hear": the prompt is only heard, not shown, until answered. */
  listen?: boolean;
  /** The line in the language being learned, said aloud once the question is answered. */
  answerAudio?: string;
};

export type MatchExercise = {
  kind: 'match';
  id: string;
  instruction: string;
  pairs: { left: string; right: string }[];
};

/** Tap word tiles in order to answer: one tile for a single word, several to build a sentence. */
export type BuildExercise = {
  kind: 'build';
  id: string;
  instruction: string;
  prompt: string;
  promptHint?: string;
  /** Every tile on offer: the answer's words plus a few wrong ones, shuffled. */
  tiles: string[];
  answer: string[];
  explain: string;
  /** The whole line, said aloud once the question is answered. */
  answerAudio?: string;
};

export type Exercise = ChoiceExercise | MatchExercise | BuildExercise;

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function unique(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

// --- Keeping every question fair -------------------------------------------
// A wrong option must really be wrong. These checks stop the builder from
// offering two answers that both fit.

/** English meanings that are different words for the same thing, so only one can be offered. */
const SAME_MEANING: [RegExp, string][] = [
  [/^your name please$/, 'what is your name'],
  [/^i came from (.+)$/, 'i am from $1'],
  [/^it's nothing no problem$/, "you're welcome it's nothing"],
];

/** An English meaning without notes like "(to a man)", so "I am fine, and you?" matches its variants. */
function meaningKey(text: string) {
  let key = text
    .replace(/\([^)]*\)/g, '')
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[^a-z' ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  for (const [from, to] of SAME_MEANING) key = key.replace(from, to);
  return key;
}

/**
 * Words that are the same word said to a man, a woman, an elder or a group
 * (ነህ / ነሽ / ኖት). When a question can't show who's being spoken to, these
 * would all be right, so they never appear as each other's wrong options.
 */
const TWINS: string[][] = [
  ['ነህ', 'ነሽ', 'ኖት', 'ነዎት', 'ናችሁ'],
  ['አንተስ', 'አንቺስ', 'እርስዎስ', 'እናንተስ'],
  ['አንተ', 'አንቺ', 'እርስዎ', 'እናንተ'],
  ['ሁን', 'ሁኚ', 'ሁኑ', 'ይሁኑ'],
  ['ስምህ', 'ስምሽ', 'ስምዎ'],
  ['እባክህ', 'እባክሽ', 'እባክዎ', 'እባካችሁ'],
  ['ግባ', 'ግቢ', 'ግቡ', 'ይግቡ'],
  ['ተቀመጥ', 'ተቀመጪ', 'ተቀመጡ', 'ይቀመጡ'],
  ['ብላ', 'ብዪ', 'ብሉ'],
  ['መጣህ', 'መጣሽ', 'መጡ', 'መጣችሁ'],
  ['ትወዳለህ', 'ትወጃለሽ', 'ይወዳሉ'],
  ['አለህ', 'አለሽ', 'አሎት', 'አላችሁ'],
  ['እደር', 'እደሪ', 'እደሩ'],
  ['አደርክ', 'አደርሽ', 'አደሩ'],
  ['አደረሰህ', 'አደረሰሽ', 'አደረሳችሁ'],
  ['ትናገራለህ', 'ትናገሪያለሽ', 'ይናገራሉ'],
  ['ሂድ', 'ሂጂ', 'ሂዱ'],
  ['ተናገር', 'ተናገሪ', 'ተናገሩ'],
  ['አቁም', 'አቁሚ', 'አቁሙ'],
  ['ቆይ', 'ቆዪ', 'ቆዩ'],
  ['ይሰማሃል', 'ይሰማሻል', 'ይሰማዎታል'],
  ['ሆንክ', 'ሆንሽ', 'ሆኑ'],
  ['አደረግህ', 'አደረግሽ'],
  ['ቤትህ', 'ቤትሽ'],
  ['ቀንስልኝ', 'ቀንሺልኝ'],
  ['አድርግልኝ', 'አድርጊልኝ', 'ያድርጉልኝ'],
  ['ብለህ', 'ብለሽ'],
  ['የምትሄደው', 'የምትሄጂው'],
  ['ወንድምህ', 'ወንድምሽ'],
  ['ቤተሰቦችህ', 'ቤተሰቦችሽ'],
  ['ልደትህ', 'ልደትሽ', 'ልደትዎ'],
  ['ትመጣለህ', 'ትመጫለሽ', 'ይመጣሉ'],
  ['ናፍቀኸኛል', 'ናፍቀሽኛል', 'ናፍቀውኛል', 'ናፍቃችሁኛል'],
  ['ይማርህ', 'ይማርሽ', 'ይማርዎት', 'ይማራችሁ'],
  ['ተሻለህ', 'ተሻለሽ'],
  ['ደረስክ', 'ደረስሽ'],
];
const TWIN_OF = new Map(TWINS.flatMap((group, i) => group.map(w => [w, i] as const)));
const PUNCT_ALL = /[።፣፤፥፦፧?!.,]/g;

/** A phrase with every man/woman/elder word replaced by its family, so twin phrases look alike. */
function twinShape(text: string) {
  return text
    .split(/\s+/)
    .map(w => w.replace(PUNCT_ALL, ''))
    .filter(Boolean)
    .map(w => (TWIN_OF.has(w) ? `#${TWIN_OF.get(w)}` : w))
    .join(' ');
}

/** True when a wrong option would also be a right answer. */
function clashes(answer: string, option: string) {
  if (option === answer) return true;
  const a = meaningKey(answer);
  if (a && a === meaningKey(option)) return true;
  return twinShape(answer) === twinShape(option);
}

/** People and places in example sentences: blanking them out tests nothing. */
const NAMES = new Set(['አሌክስ', 'ዳዊት', 'ሃና', 'ፒያሳ', 'አሜሪካ', 'ከአሜሪካ', 'ኢትዮጵያ', 'ከኢትዮጵያ']);

/** Picks up to `count` wrong options, preferring this lesson, then the wider pool. */
function distractors(answer: string, local: string[], pool: string[], count = 3) {
  const fromLesson = shuffle(unique(local).filter(v => !clashes(answer, v)));
  const fromPool = shuffle(unique(pool).filter(v => !clashes(answer, v) && !fromLesson.includes(v)));
  // and no two options may clash with each other either
  const picked: string[] = [];
  for (const v of [...fromLesson, ...fromPool]) {
    if (picked.length === count) break;
    if (!picked.some(p => clashes(p, v))) picked.push(v);
  }
  return picked;
}

function choice(
  id: string,
  instruction: string,
  prompt: string,
  answer: string,
  wrong: string[],
  explain: string,
  promptHint?: string,
): ChoiceExercise | null {
  if (wrong.length < 1) return null;
  return {
    kind: 'choice',
    id,
    instruction,
    prompt,
    promptHint,
    answer,
    options: shuffle([answer, ...wrong]),
    explain,
  };
}

function build(
  id: string,
  instruction: string,
  prompt: string,
  answer: string[],
  wrong: string[],
  explain: string,
  promptHint?: string,
): BuildExercise | null {
  if (!answer.length) return null;
  const extra = unique(wrong).filter(w => !answer.includes(w));
  return { kind: 'build', id, instruction, prompt, promptHint, tiles: shuffle([...answer, ...extra]), answer, explain };
}

/** Puts the tile questions in the middle of the lesson, spread out. */
function spreadIn(exercises: Exercise[], extra: Exercise[]) {
  extra.forEach((ex, i) => {
    const at = Math.round(((i + 1) * exercises.length) / (extra.length + 1));
    exercises.splice(at, 0, ex);
  });
}

// Strip Ethiopic and Latin punctuation so words can be compared and blanked.
const PUNCT = /[።፣፤፥፦፧?!.,]/g;

/**
 * "Which one of these is …?" for a word with a picture, plus a harder version
 * with pictures only. The Amharic course asks in English and answers in
 * Amharic; the English course asks in Amharic and answers in English.
 */
function pictureExercises(pictured: Picture, track: Track): { see: ChoiceExercise; read: ChoiceExercise } {
  const others = shuffle(PICTURES.filter(p => p.amharic !== pictured.amharic)).slice(0, 2);
  const cards = [pictured, ...others];
  if (track === 'english') {
    const pictures = Object.fromEntries(cards.map(p => [p.english, { src: p.src, transliteration: '' }]));
    const explain = `“${pictured.english}” = ${pictured.amharic}`;
    return {
      see: {
        kind: 'choice',
        id: 'picture-see',
        instruction: `“${pictured.amharic}” የትኛው ነው? · Which one is “${pictured.amharic}”?`,
        prompt: pictured.amharic,
        options: shuffle(cards.map(p => p.english)),
        answer: pictured.english,
        explain,
        pictures,
        answerAudio: pictured.english,
      },
      read: {
        kind: 'choice',
        id: 'picture-read',
        instruction: 'ለዚህ ቃል ስዕሉን ይንኩ · Tap the picture for this word',
        prompt: pictured.english,
        options: shuffle(cards.map(p => p.english)),
        answer: pictured.english,
        explain,
        pictures,
        hideWords: true,
        answerAudio: pictured.english,
      },
    };
  }
  const pictures = Object.fromEntries(cards.map(p => [p.amharic, { src: p.src, transliteration: p.transliteration }]));
  const explain = `${pictured.amharic} (${pictured.transliteration}) means “${pictured.english}”.`;
  return {
    see: {
      kind: 'choice',
      id: 'picture-see',
      instruction: `Which one of these is “${pictured.english}”?`,
      prompt: pictured.english,
      options: shuffle(cards.map(p => p.amharic)),
      answer: pictured.amharic,
      explain,
      pictures,
      answerAudio: pictured.amharic,
    },
    read: {
      kind: 'choice',
      id: 'picture-read',
      instruction: 'Tap the picture for this word',
      prompt: pictured.amharic,
      options: shuffle(cards.map(p => p.amharic)),
      answer: pictured.amharic,
      explain,
      pictures,
      hideWords: true,
      answerAudio: pictured.amharic,
    },
  };
}

/** The picture question opens the lesson; the harder one comes back fourth or last. */
function addPictureExercises(exercises: Exercise[], pictured: Picture | undefined, track: Track) {
  if (!pictured) return;
  const { see, read } = pictureExercises(pictured, track);
  exercises.unshift(see);
  if (Math.random() < 0.5) exercises.splice(Math.min(3, exercises.length), 0, read);
  else exercises.push(read);
}

/** Extra question types a screen can turn on once it knows how to show them. */
export type BuildOptions = {
  /** "Tap what you hear" questions: the prompt must be played, not shown. */
  listening?: boolean;
  /** Says whether a line can be heard, so listening questions only use lines with audio. */
  canHear?: (text: string) => boolean;
};

// Keeping a lesson fresh: no phrase should come up more than about three times
// in one session, so each part of the lesson picks the phrases used least so far.
function usage<T>(keyOf: (item: T) => string) {
  const counts = new Map<string, number>();
  return {
    use(item: T) {
      counts.set(keyOf(item), (counts.get(keyOf(item)) ?? 0) + 1);
    },
    count(item: T) {
      return counts.get(keyOf(item)) ?? 0;
    },
    /** The items used least so far, ties in random order. */
    least(items: T[]) {
      return shuffle(items).sort((a, b) => (counts.get(keyOf(a)) ?? 0) - (counts.get(keyOf(b)) ?? 0));
    },
  };
}

// Short replies that fit after almost anything ("Yes!", "Thank you", "Okay"):
// never offered as a wrong answer in "What would you say back?".
const GENERIC_AM = /(^|\s)(አዎ|አይ|አይደለም|እሺ|አመሰግናለሁ|ይቅርታ|ጥሩ|ደህና|ሰላም|እግዚአብሔር|ይመስገን|በጣም|እውነት|ልክ|ችግር|ምንም)/;
const GENERIC_EN =
  /\b(yes|no|not yet|okay|ok|sure|thanks|thank|sorry|fine|good|great|hello|hi|of course|please|really|nice|i think so|that's true|that’s true|up to you|no worries|no problem|a good point)\b/i;

/** Lines that answer each other in a dialogue: what one person says, then the reply. */
function replyPairs<T extends { speaker: 'A' | 'B' }>(dialogue: T[]) {
  const pairs: { said: T; reply: T }[] = [];
  for (let i = 0; i + 1 < dialogue.length; i++) {
    if (dialogue[i].speaker !== dialogue[i + 1].speaker) pairs.push({ said: dialogue[i], reply: dialogue[i + 1] });
  }
  return pairs;
}

export function buildExercises(
  lesson: LessonSection,
  courseLessons: LessonSection[],
  track: Track = 'amharic',
  /** The very first lesson of the course opens with a picture question, like Duolingo. */
  firstLesson = false,
  options: BuildOptions = {},
): Exercise[] {
  if (track === 'english') return buildEnglishExercises(lesson, courseLessons, firstLesson);
  const cards: Card[] = [
    ...(lesson.phrases ?? []),
    ...(lesson.dialogue ?? []).map(({ amharic, transliteration, english }) => ({
      amharic,
      transliteration,
      english,
    })),
  ];
  const seen = new Set<string>();
  // the same Amharic once, even when one copy ends in ። and the other doesn't
  const bareAm = (text: string) => text.replace(PUNCT_ALL, '').trim();
  const uniqueCards = cards.filter(card => {
    const key = bareAm(card.amharic);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const poolCards = courseLessons.flatMap(l => [...(l.phrases ?? []), ...(l.dialogue ?? [])]);
  const local = {
    english: uniqueCards.map(c => c.english),
  };
  const pool = {
    english: poolCards.map(c => c.english),
  };
  const used = usage<Card>(c => bareAm(c.amharic));
  const cardFor = (amharic: string) => uniqueCards.find(c => bareAm(c.amharic) === bareAm(amharic));
  const canHear = (text: string) => !text.includes('...') && (options.canHear ? options.canHear(text) : true);

  const exercises: Exercise[] = [];
  const picked = shuffle(uniqueCards).slice(0, 5);
  // A mix of question types, so no two in a row feel the same.
  const kinds = ['meaning', 'say', 'listen', 'say', 'meaning'] as const;

  picked.forEach((card, i) => {
    const explain = `${card.amharic} (${card.transliteration}) means “${card.english}”.`;
    const otherMeanings = (list: Card[]) => list.filter(c => meaningKey(c.english) !== meaningKey(card.english));
    let kind: (typeof kinds)[number] = kinds[i % kinds.length];
    if (kind === 'listen' && !(options.listening && canHear(card.amharic))) kind = 'meaning';
    let ex: ChoiceExercise | null;
    if (kind === 'meaning') {
      ex = choice(
        `meaning-${i}`,
        'What does this mean?',
        card.amharic,
        card.english,
        distractors(card.english, local.english, pool.english),
        explain,
        card.transliteration,
      );
    } else if (kind === 'say') {
      // Skip options that share this meaning, so only one answer is right.
      ex = choice(
        `say-${i}`,
        'How do you say this?',
        card.english,
        card.amharic,
        distractors(
          card.amharic,
          otherMeanings(uniqueCards).map(c => c.amharic),
          otherMeanings(poolCards).map(c => c.amharic),
        ),
        explain,
      );
    } else {
      // Tap what you hear: Walia says it, the learner picks the line they heard.
      ex = choice(
        `listen-${i}`,
        'Tap what you hear',
        card.amharic,
        card.amharic,
        distractors(
          card.amharic,
          otherMeanings(uniqueCards).filter(c => canHear(c.amharic)).map(c => c.amharic),
          otherMeanings(poolCards).filter(c => canHear(c.amharic)).map(c => c.amharic),
        ),
        explain,
      );
      if (ex) ex.listen = true;
    }
    if (ex) {
      ex.answerAudio = card.amharic;
      exercises.push(ex);
      used.use(card);
    }
  });

  // Word tiles in the middle of the lesson: tap the Amharic word, then build a sentence.
  const amWords = (text: string) =>
    text
      .split(/\s+/)
      .map(w => w.replace(PUNCT, ''))
      .filter(Boolean);
  const tilePool = unique(poolCards.flatMap(c => amWords(c.amharic))).filter(w => !w.includes('...'));
  const localWords = unique(uniqueCards.flatMap(c => amWords(c.amharic))).filter(w => !w.includes('...'));
  // Wrong tiles: never one of the answer's words, or a man/woman/elder twin of one.
  const fits = (answer: string[]) => (w: string) => !answer.some(a => clashes(a, w));
  const pickWrong = (answer: string[], count: number) =>
    [
      ...shuffle(localWords.filter(fits(answer))),
      ...shuffle(tilePool.filter(w => fits(answer)(w) && !localWords.includes(w))),
    ].slice(0, count);
  const tiles: Exercise[] = [];
  const single = shuffle(uniqueCards).find(c => amWords(c.amharic).length === 1 && !c.amharic.includes('...'));
  if (single) {
    const ex = build(
      'tap-word',
      'Tap the Amharic word',
      single.english,
      amWords(single.amharic),
      pickWrong(amWords(single.amharic), 4),
      `${single.amharic} (${single.transliteration}) means “${single.english}”.`,
    );
    if (ex) {
      ex.answerAudio = single.amharic;
      tiles.push(ex);
      used.use(single);
    }
  }

  // One or two sentences to build, short enough to be fun.
  const buildable = uniqueCards.filter(c => {
    const n = amWords(c.amharic).length;
    return n >= 2 && n <= 7 && !c.amharic.includes('...');
  });
  shuffle(buildable)
    .slice(0, 2)
    .forEach((card, i) => {
      const answer = amWords(card.amharic);
      const ex = build(
        `build-${i}`,
        'Build the sentence',
        card.english,
        answer,
        pickWrong(answer, 3),
        `${card.amharic} (${card.transliteration}) means “${card.english}”.`,
      );
      if (ex) {
        ex.answerAudio = card.amharic;
        tiles.push(ex);
        used.use(card);
      }
    });
  spreadIn(exercises, tiles);

  // "Who are you talking to?": pick the right form for a friend, a girl or an elder.
  const respect = respectExercises(lesson);
  respect.forEach((ex, i) => exercises.splice(Math.min(1 + i * 3, exercises.length), 0, ex));

  // Fill in the missing word of a dialogue line (the one used least so far).
  const lines = (lesson.dialogue ?? []).filter(l => l.amharic.split(/\s+/).length >= 2);
  const line = shuffle(lines)[0];
  if (line) {
    const words = line.amharic.split(/\s+/);
    // blank a real word, never a name like አሌክስ
    const blankable = words.map((w, i) => i).filter(i => !NAMES.has(words[i].replace(PUNCT, '')));
    const blankIdx = blankable[Math.floor(Math.random() * blankable.length)] ?? 0;
    const answer = words[blankIdx].replace(PUNCT, '');
    const wordPool = unique(
      courseLessons
        .flatMap(l => [...(l.phrases ?? []), ...(l.dialogue ?? [])])
        .flatMap(c => c.amharic.split(/\s+/))
        .map(w => w.replace(PUNCT, '')),
    );
    const sentence = words.map((w, i) => (i === blankIdx ? '____' + w.replace(/[^።፣፤፥፦፧?!.,]/g, '') : w)).join(' ');
    const ex = choice(
      'fill',
      'Fill in the missing word',
      sentence,
      answer,
      distractors(answer, [], wordPool),
      `The full line is ${line.amharic} (“${line.english}”).`,
      line.english,
    );
    if (ex) ex.revealAudio = line.amharic;
    if (ex && answer) {
      exercises.splice(Math.min(3, exercises.length), 0, ex);
      const card = cardFor(line.amharic);
      if (card) used.use(card);
    }
  }

  // Picture questions for a word with a picture: "Which one of these is “coffee”?"
  // opens the lesson, and near the end the same word comes back the other way
  // round, as Amharic only, with picture cards and no words to lean on.
  const pictured =
    shuffle(uniqueCards)
      .map(c => pictureFor(c.amharic.replace(PUNCT, '').trim()))
      .find(Boolean) ?? (firstLesson ? shuffle(PICTURES)[0] : undefined);
  addPictureExercises(exercises, pictured, 'amharic');

  // Match pairs as a final round, with the phrases seen least.
  const meanings = new Set<string>();
  const matchCards = shuffle(uniqueCards)
    .filter(c => !meanings.has(meaningKey(c.english)) && meanings.add(meaningKey(c.english)))
    .slice(0, 4);
  if (matchCards.length >= 3) {
    exercises.push({
      kind: 'match',
      id: 'match',
      instruction: 'Match the pairs',
      pairs: matchCards.map(c => ({ left: c.amharic, right: c.english })),
    });
  }

  return exercises;
}

// ---------------------------------------------------------------------------
// Respect: Amharic changes with who you're talking to.

const LISTENERS = {
  man: { who: ['your friend Dawit', 'your boy cousin', 'a boy your age'], label: 'a guy your age' },
  woman: { who: ['your friend Hana', 'your girl cousin', 'a girl your age'], label: 'a girl your age' },
  elder: { who: ['your grandma', 'your grandpa', 'an elder at church', 'your teacher'], label: 'an elder' },
} as const;

type Listener = keyof typeof LISTENERS;

function respectExercises(lesson: LessonSection): ChoiceExercise[] {
  const sets = shuffle(lesson.respect ?? []).slice(0, 3);
  return sets.map((set, i) => {
    // The first one is always an elder: that's the point of the lesson.
    const to: Listener = i === 0 ? 'elder' : shuffle<Listener>(['man', 'woman', 'elder'])[0];
    const who = shuffle([...LISTENERS[to].who])[0];
    const answer = set[to];
    const others = (['man', 'woman', 'elder'] as Listener[]).filter(l => l !== to);
    const explain =
      to === 'elder'
        ? `For an elder, say ${set.elder} to show respect. ${set.man} is for a guy and ${set.woman} is for a girl.`
        : `For ${LISTENERS[to].label}, say ${answer}. ${others.map(o => `${set[o]} is for ${LISTENERS[o].label}`).join(', and ')}.`;
    return {
      kind: 'choice',
      id: `respect-${i}`,
      instruction: 'Who are you talking to?',
      prompt: `To ${who}: “${set.english}”`,
      options: shuffle([set.man, set.woman, set.elder]),
      answer,
      explain,
      answerAudio: answer,
    };
  });
}

// ---------------------------------------------------------------------------
// English course: the learner already speaks Amharic and is learning English.

const words = (text: string) => text.split(/\s+/).filter(Boolean);
const bare = (word: string) => word.replace(/[.,!?;:“”"…()]/g, '');

/** The sentence with one meaningful word blanked out, or null if it's too short. */
function blankWord(text: string) {
  const parts = words(text);
  const candidates = parts
    .map((w, i) => ({ w: bare(w), i }))
    .filter(({ w }) => w.length >= 3 && !w.includes('...'));
  if (parts.length < 3 || !candidates.length) return null;
  const { w, i } = candidates[Math.floor(Math.random() * candidates.length)];
  const sentence = parts.map((p, j) => (j === i ? p.replace(w, '____') : p)).join(' ');
  return { sentence, answer: w };
}

function buildEnglishExercises(lesson: LessonSection, courseLessons: LessonSection[], firstLesson = false): Exercise[] {
  const cards: Card[] = [...(lesson.phrases ?? []), ...(lesson.dialogue ?? [])];
  const seen = new Set<string>();
  const uniqueCards = cards.filter(card => !seen.has(card.english) && seen.add(card.english));
  const poolCards = courseLessons.flatMap(l => [...(l.phrases ?? []), ...(l.dialogue ?? [])]);
  const wordPool = unique(poolCards.flatMap(c => words(c.english).map(bare)).filter(w => w.length >= 3));

  const exercises: Exercise[] = [];
  shuffle(uniqueCards)
    .slice(0, 5)
    .forEach((card, i) => {
      const explain = `“${card.english}” = ${card.amharic}`;
      const others = (list: Card[]) => list.filter(c => c.english !== card.english && c.amharic !== card.amharic);
      let ex: ChoiceExercise | null = null;
      if (i % 3 === 0) {
        ex = choice(
          `meaning-${i}`,
          'ይህ ምን ማለት ነው? · What does this mean?',
          card.english,
          card.amharic,
          distractors(card.amharic, others(uniqueCards).map(c => c.amharic), others(poolCards).map(c => c.amharic)),
          explain,
        );
      } else if (i % 3 === 1) {
        ex = choice(
          `say-${i}`,
          'በእንግሊዝኛ እንዴት ይባላል? · How do you say this in English?',
          card.amharic,
          card.english,
          distractors(card.english, others(uniqueCards).map(c => c.english), others(poolCards).map(c => c.english)),
          explain,
        );
      } else {
        const blank = blankWord(card.english);
        if (blank) {
          ex = choice(
            `word-${i}`,
            'የጎደለውን ቃል ይምረጡ · Choose the missing word',
            blank.sentence,
            blank.answer,
            distractors(blank.answer, [], wordPool.filter(w => w.toLowerCase() !== blank.answer.toLowerCase())),
            explain,
            card.amharic,
          );
          if (ex) ex.revealAudio = card.english; // say the whole line once it's answered
        }
      }
      if (ex) exercises.push(ex);
    });

  // Complete a line from the dialogue.
  const line = shuffle(lesson.dialogue ?? []).find(l => blankWord(l.english));
  const blank = line && blankWord(line.english);
  if (line && blank) {
    const ex = choice(
      'fill',
      'ውይይቱን ያጠናቅቁ · Complete the conversation',
      blank.sentence,
      blank.answer,
      distractors(blank.answer, [], wordPool.filter(w => w.toLowerCase() !== blank.answer.toLowerCase())),
      `The full line is “${line.english}” (${line.amharic})`,
      line.amharic,
    );
    if (ex) ex.revealAudio = line.english;
    if (ex) exercises.splice(Math.min(3, exercises.length), 0, ex);
  }

  // Word tiles in the middle of the lesson: tap the English word, then build sentences.
  const enWords = (text: string) => words(text).map(w => w.replace(/[.,!?;:“”"…]/g, '')).filter(Boolean);
  const usable = (c: Card) => !/[/()…]|\.\.\./.test(c.english);
  const enPool = unique(poolCards.filter(usable).flatMap(c => enWords(c.english)));
  const enLocal = unique(uniqueCards.filter(usable).flatMap(c => enWords(c.english)));
  const wrongEn = (answer: string[], count: number) => {
    const lower = answer.map(a => a.toLowerCase());
    const ok = (w: string) => !lower.includes(w.toLowerCase());
    return [...shuffle(enLocal.filter(ok)), ...shuffle(enPool.filter(w => ok(w) && !enLocal.includes(w)))].slice(0, count);
  };
  const enTiles: Exercise[] = [];
  const oneWord = shuffle(uniqueCards).find(c => usable(c) && enWords(c.english).length === 1);
  if (oneWord) {
    const ex = build(
      'tap-word',
      'ቃሉን ይንኩ · Tap the English word',
      oneWord.amharic,
      enWords(oneWord.english),
      wrongEn(enWords(oneWord.english), 4),
      `“${oneWord.english}” = ${oneWord.amharic}`,
    );
    if (ex) enTiles.push(ex);
  }
  shuffle(uniqueCards.filter(c => usable(c) && enWords(c.english).length >= 2 && enWords(c.english).length <= 8))
    .slice(0, 2)
    .forEach((card, i) => {
      const answer = enWords(card.english);
      const ex = build(
        `build-${i}`,
        'ዓረፍተ ነገሩን ይገንቡ · Build the sentence',
        card.amharic,
        answer,
        wrongEn(answer, 3),
        `“${card.english}” = ${card.amharic}`,
      );
      if (ex) enTiles.push(ex);
    });
  spreadIn(exercises, enTiles);

  // Picture questions for a word with a picture that the lesson uses (coffee at
  // the café, taxi on the bus lesson); the very first lesson gets one too.
  const mentioned = shuffle(PICTURES).find(p =>
    uniqueCards.some(c => new RegExp(`\\b${p.english}\\b`, 'i').test(c.english)),
  );
  addPictureExercises(exercises, mentioned ?? (firstLesson ? shuffle(PICTURES)[0] : undefined), 'english');

  // each Amharic meaning only once, so every pair has exactly one match
  const seenAm = new Set<string>();
  const matchCards = shuffle(uniqueCards)
    .filter(c => c.english.length <= 40)
    .filter(c => {
      const am = twinShape(c.amharic);
      return !seenAm.has(am) && seenAm.add(am);
    })
    .slice(0, 4);
  if (matchCards.length >= 3) {
    exercises.push({
      kind: 'match',
      id: 'match',
      instruction: 'ጥንዶቹን ያዛምዱ · Match the pairs',
      pairs: matchCards.map(c => ({ left: c.english, right: c.amharic })),
    });
  }

  return exercises;
}

export { shuffle };
