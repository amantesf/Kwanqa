import type { LessonSection } from '@/lib/courses';

// Practice questions generated from a lesson's phrases and dialogue.

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
};

export type MatchExercise = {
  kind: 'match';
  id: string;
  instruction: string;
  pairs: { left: string; right: string }[];
};

export type Exercise = ChoiceExercise | MatchExercise;

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

// Strip Ethiopic and Latin punctuation so words can be compared and blanked.
const PUNCT = /[።፣፤፥፦፧?!.,]/g;

export function buildExercises(lesson: LessonSection, courseLessons: LessonSection[]): Exercise[] {
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
  const picked = shuffle(uniqueCards).slice(0, 6);

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

export { shuffle };
