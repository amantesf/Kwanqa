// Talk with Walia: short spoken conversations. Walia says a line, the learner
// answers out loud, and we check what they said against the answers that fit.
// Walia is a he, so learners address him with the male forms (አንተስ, ደህና ሁን).
// Walia's own lines change with the learner: ነህ to a man, ነሽ to a woman.

export type Gender = 'm' | 'f';

export type Line = { amharic: string; transliteration: string; english: string };

type Gendered<T> = T | { m: T; f: T };

export type Answer =
  /** A phrase; close-enough matches count, so small slips don't fail the learner. */
  | { say: string }
  /** A shape with a blank, like ስሜ … ነው, for answers that include their own name or town. */
  | { pattern: RegExp };

export type Turn = {
  walia: Gendered<Line>;
  /** What the learner's answer should do, in plain English; guides Walia's brain. */
  goal: string;
  answers: Answer[];
  /** Shown when the learner asks for help, and after two misses. */
  example: Line;
  /** Common slips worth a specific tip instead of "try again". */
  mistakes?: { say: string; tip: string }[];
};

export type Conversation = {
  slug: string;
  title: string;
  amharicTitle: string;
  level: 'beginner';
  blurb: string;
  turns: Turn[];
};

export const conversations: Conversation[] = [
  {
    slug: 'hello',
    title: 'Saying hello',
    amharicTitle: 'ሰላምታ',
    level: 'beginner',
    blurb: 'Greet Walia, say how you are, and tell him your name and where you’re from.',
    turns: [
      {
        walia: { amharic: 'ሰላም!', transliteration: 'selam!', english: 'Hello!' },
        goal: 'Greet Walia back.',
        answers: [{ say: 'ሰላም' }, { say: 'ጤና ይስጥልኝ' }],
        example: { amharic: 'ሰላም!', transliteration: 'selam!', english: 'Hello!' },
      },
      {
        walia: {
          m: { amharic: 'እንዴት ነህ?', transliteration: 'indet neh?', english: 'How are you?' },
          f: { amharic: 'እንዴት ነሽ?', transliteration: 'indet nesh?', english: 'How are you?' },
        },
        goal: 'Say how they are. Asking Walia back (አንተስ?) is a bonus.',
        answers: [{ say: 'ደህና ነኝ' }, { say: 'ደህና ነኝ፣ አንተስ?' }, { say: 'ደህና ነኝ፣ እግዚአብሔር ይመስገን' }],
        example: { amharic: 'ደህና ነኝ፣ አንተስ?', transliteration: 'dehna negn, antes?', english: 'I’m fine, and you?' },
        mistakes: [{ say: 'አንቺስ', tip: 'Walia is a he, so ask አንተስ? (antes). አንቺስ? is for asking a woman.' }],
      },
      {
        walia: {
          m: { amharic: 'እኔም ደህና ነኝ። ስምህ ማን ነው?', transliteration: 'inem dehna negn. simih man new?', english: 'I’m fine too. What’s your name?' },
          f: { amharic: 'እኔም ደህና ነኝ። ስምሽ ማን ነው?', transliteration: 'inem dehna negn. simish man new?', english: 'I’m fine too. What’s your name?' },
        },
        goal: 'Tell Walia their name.',
        answers: [{ pattern: /^ስሜ.+ነው$/ }, { pattern: /^.+እባላለሁ$/ }],
        example: { amharic: 'ስሜ … ነው።', transliteration: 'sime … new.', english: 'My name is …' },
      },
      {
        walia: {
          m: { amharic: 'ደስ ብሎኛል! ከየት ነህ?', transliteration: 'des bilognal! keyet neh?', english: 'Nice to meet you! Where are you from?' },
          f: { amharic: 'ደስ ብሎኛል! ከየት ነሽ?', transliteration: 'des bilognal! keyet nesh?', english: 'Nice to meet you! Where are you from?' },
        },
        goal: 'Say where they are from (a country, city or town).',
        answers: [{ pattern: /^ከ.+(ነኝ|መጣሁ)$/ }],
        example: { amharic: 'ከአሜሪካ ነኝ።', transliteration: 'ke-america negn.', english: 'I’m from America.' },
      },
      {
        walia: {
          m: { amharic: 'አማርኛ ትናገራለህ?', transliteration: 'amarigna tinageraleh?', english: 'Do you speak Amharic?' },
          f: { amharic: 'አማርኛ ትናገሪያለሽ?', transliteration: 'amarigna tinageriyalesh?', english: 'Do you speak Amharic?' },
        },
        goal: 'Say whether they speak Amharic (yes, a little, or no are all fine).',
        answers: [
          { say: 'ትንሽ ትንሽ እናገራለሁ' },
          { say: 'አዎ፣ እናገራለሁ' },
          { say: 'ትንሽ ትንሽ' },
          { say: 'አዎ' },
          { say: 'አይ' },
          { say: 'አልናገርም' },
        ],
        example: { amharic: 'ትንሽ ትንሽ እናገራለሁ።', transliteration: 'tinish tinish inageralehu.', english: 'I speak a little.' },
      },
      {
        walia: {
          m: { amharic: 'በጣም ጥሩ! ደህና ሁን!', transliteration: 'betam tiru! dehna hun!', english: 'Very good! Goodbye!' },
          f: { amharic: 'በጣም ጥሩ! ደህና ሁኚ!', transliteration: 'betam tiru! dehna hugn!', english: 'Very good! Goodbye!' },
        },
        goal: 'Say goodbye to Walia, using the male form ደህና ሁን if they use that phrase.',
        answers: [{ say: 'ደህና ሁን' }, { say: 'ቻው' }, { say: 'በኋላ እንገናኝ' }, { say: 'ነገ እንገናኝ' }],
        example: { amharic: 'ደህና ሁን! ነገ እንገናኝ።', transliteration: 'dehna hun! nege inigenagn.', english: 'Goodbye! See you tomorrow.' },
        mistakes: [{ say: 'ደህና ሁኚ', tip: 'Walia is a he, so say ደህና ሁን (dehna hun). ደህና ሁኚ is for a woman.' }],
      },
    ],
  },
];

export function waliaLine(turn: Turn, gender: Gender): Line {
  return 'm' in turn.walia ? turn.walia[gender] : turn.walia;
}

/** Every Amharic line the app may ask the speech service to read out. */
export function speakableLines(): Set<string> {
  const lines = new Set<string>();
  for (const c of conversations) {
    for (const t of c.turns) {
      for (const g of ['m', 'f'] as const) lines.add(waliaLine(t, g).amharic);
      if (!t.example.amharic.includes('…')) lines.add(t.example.amharic);
    }
  }
  return lines;
}

// --- Checking what the learner said ---------------------------------------

/** Drop punctuation and extra spaces so speech-to-text output compares cleanly. */
export function normalize(text: string) {
  return text
    .normalize('NFC')
    .replace(/[።፣፤፥፦፧፨?!.,;:'"“”‘’()\-…]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const squash = (text: string) => normalize(text).replace(/ /g, '');

/** Share of letters that would have to change to turn `heard` into `target`. */
function distance(target: string, heard: string) {
  const a = squash(target);
  const b = squash(heard);
  if (!a) return 1;
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

export type Verdict = { kind: 'right' } | { kind: 'tip'; tip: string } | { kind: 'unclear' } | { kind: 'silent' };

export function check(turn: Turn, heard: string): Verdict {
  const said = normalize(heard);
  if (!said) return { kind: 'silent' };

  // Specific slips first: "ደህና ነኝ፣ አንቺስ?" contains a right answer, but the tip matters more.
  const slip = turn.mistakes?.find(m => squash(said).includes(squash(m.say)));
  if (slip) return { kind: 'tip', tip: slip.tip };

  const ok = turn.answers.some(a =>
    'pattern' in a
      ? a.pattern.test(said)
      : squash(said).includes(squash(a.say)) || distance(a.say, said) <= 0.34,
  );
  return ok ? { kind: 'right' } : { kind: 'unclear' };
}
