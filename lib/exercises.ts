import type { LessonSection, Track } from '@/lib/courses';

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

/** Picks up to `count` wrong options, preferring this lesson, then the wider pool. */
function distractors(answer: string, local: string[], pool: string[], count = 3) {
  const fromLesson = shuffle(unique(local).filter(v => v !== answer));
  const fromPool = shuffle(unique(pool).filter(v => v !== answer && !fromLesson.includes(v)));
  return [...fromLesson, ...fromPool].slice(0, count);
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

export function buildExercises(
  lesson: LessonSection,
  courseLessons: LessonSection[],
  track: Track = 'amharic',
): Exercise[] {
  if (track === 'english') return buildEnglishExercises(lesson, courseLessons);
  const cards: Card[] = [
    ...(lesson.phrases ?? []),
    ...(lesson.dialogue ?? []).map(({ amharic, transliteration, english }) => ({
      amharic,
      transliteration,
      english,
    })),
  ];
  const seen = new Set<string>();
  const uniqueCards = cards.filter(card => {
    if (seen.has(card.amharic)) return false;
    seen.add(card.amharic);
    return true;
  });

  const poolCards = courseLessons.flatMap(l => [...(l.phrases ?? []), ...(l.dialogue ?? [])]);
  const local = {
    english: uniqueCards.map(c => c.english),
    translit: uniqueCards.map(c => c.transliteration),
  };
  const pool = {
    english: poolCards.map(c => c.english),
    translit: poolCards.map(c => c.transliteration),
  };

  const exercises: Exercise[] = [];
  const picked = shuffle(uniqueCards).slice(0, 5);

  picked.forEach((card, i) => {
    const explain = `${card.amharic} (${card.transliteration}) means “${card.english}”.`;
    let ex: ChoiceExercise | null;
    switch (i % 3) {
      case 0:
        ex = choice(
          `meaning-${i}`,
          'What does this mean?',
          card.amharic,
          card.english,
          distractors(card.english, local.english, pool.english),
          explain,
          card.transliteration,
        );
        break;
      case 1:
        // Skip options that share this meaning, so only one answer is right.
        ex = choice(
          `say-${i}`,
          'How do you say this?',
          card.english,
          card.amharic,
          distractors(
            card.amharic,
            uniqueCards.filter(c => c.english !== card.english).map(c => c.amharic),
            poolCards.filter(c => c.english !== card.english).map(c => c.amharic),
          ),
          explain,
        );
        break;
      default:
        ex = choice(
          `read-${i}`,
          'How is this read?',
          card.amharic,
          card.transliteration,
          distractors(card.transliteration, local.translit, pool.translit),
          explain,
        );
    }
    if (ex) exercises.push(ex);
  });

  // Word tiles in the middle of the lesson: tap the Amharic word, then build sentences.
  const amWords = (text: string) =>
    text
      .split(/\s+/)
      .map(w => w.replace(PUNCT, ''))
      .filter(Boolean);
  const tilePool = unique(poolCards.flatMap(c => amWords(c.amharic))).filter(w => !w.includes('...'));
  const localWords = unique(uniqueCards.flatMap(c => amWords(c.amharic))).filter(w => !w.includes('...'));
  const pickWrong = (answer: string[], count: number) =>
    [
      ...shuffle(localWords.filter(w => !answer.includes(w))),
      ...shuffle(tilePool.filter(w => !answer.includes(w) && !localWords.includes(w))),
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
    if (ex) tiles.push(ex);
  }
  shuffle(
    uniqueCards.filter(c => {
      const n = amWords(c.amharic).length;
      return n >= 2 && n <= 7 && !c.amharic.includes('...');
    }),
  )
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
      if (ex) tiles.push(ex);
    });
  spreadIn(exercises, tiles);

  // "Who are you talking to?": pick the right form for a friend, a girl or an elder.
  const respect = respectExercises(lesson);
  respect.forEach((ex, i) => exercises.splice(Math.min(1 + i * 3, exercises.length), 0, ex));

  // Fill in the missing word of a dialogue line.
  const lines = shuffle(lesson.dialogue ?? []).filter(l => l.amharic.split(/\s+/).length >= 2);
  const line = lines[0];
  if (line) {
    const words = line.amharic.split(/\s+/);
    const blankIdx = Math.floor(Math.random() * words.length);
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
      `The full line is ${line.amharic} — “${line.english}”.`,
      line.english,
    );
    if (ex) ex.revealAudio = line.amharic;
    if (ex && answer) exercises.splice(Math.min(3, exercises.length), 0, ex);
  }

  // Match pairs as a final round.
  const meanings = new Set<string>();
  const matchCards = shuffle(uniqueCards)
    .filter(c => !meanings.has(c.english) && meanings.add(c.english))
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

function buildEnglishExercises(lesson: LessonSection, courseLessons: LessonSection[]): Exercise[] {
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
      `The full line is “${line.english}” — ${line.amharic}`,
      line.amharic,
    );
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

  const matchCards = shuffle(uniqueCards)
    .filter(c => c.english.length <= 40)
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
