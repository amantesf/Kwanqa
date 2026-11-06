// The learner's own name in Walia's chats. The Amharic course's first
// conversation is "ሰላም፣ ስሜ ዳዊት ነው። ስምህ ማን ነው?" / "ስሜ አሌክስ ነው።". When
// you're logged in, Walia says his own name and your reply says yours:
// "ስሜ ዋሊያ ነው ... ስሜ ናሆም ነው።".
//
// Your name in ፊደል is spelled from the name on your account (amharicName
// below), and you can fix the spelling on your profile (saved as name_am).

import type { ChatExercise } from '@/lib/interactive';

export type LearnerName = {
  /** First name as written on the account, e.g. "Nahom". */
  latin: string;
  /** The same name in ፊደል, e.g. "ናሆም". */
  amharic: string;
  /** Walia asks "ስምሽ ማን ነው?" instead of "ስምህ ማን ነው?". */
  female?: boolean;
};

const ETHIOPIC = /[ሀ-፿]/;

// The first letter of each family: ለ ሉ ሊ ላ ሌ ል ሎ follow it in order.
const FAMILY: Record<string, number> = {
  h: 0x1200, l: 0x1208, m: 0x1218, r: 0x1228, s: 0x1230, sh: 0x1238, q: 0x1240,
  b: 0x1260, v: 0x1268, t: 0x1270, ch: 0x1278, n: 0x1290, ny: 0x1298, k: 0x12a8,
  w: 0x12c8, z: 0x12d8, zh: 0x12e0, y: 0x12e8, d: 0x12f0, j: 0x1300, g: 0x1308,
  ts: 0x1338, f: 0x1348, p: 0x1350,
};
// order in the family: ä u i a e (ē) ə o
const ORDER: Record<string, number> = { e: 0, u: 1, i: 2, a: 3, ie: 4, ee: 4, é: 4, o: 6 };
const ALONE: Record<string, string> = { a: 'አ', e: 'ኤ', ie: 'ኤ', ee: 'ኢ', é: 'ኤ', i: 'ኢ', u: 'ኡ', o: 'ኦ' };
const DIGRAPHS: [string, string][] = [
  ['sh', 'sh'], ['ch', 'ch'], ['ph', 'f'], ['th', 't'], ['kh', 'k'], ['ts', 'ts'], ['tz', 'ts'],
  ['zh', 'zh'], ['ny', 'ny'], ['ck', 'k'], ['qu', 'kw'],
];

/**
 * A best guess at writing a name in ፊደል, the way Ethiopian names are usually
 * spelled in English: Nahom → ናሆም, Amanuel → አማኑኤል, Dawit → ዳዊት.
 * Names that are already in ፊደል come back as they are.
 */
export function amharicName(name: string): string {
  const word = name.trim();
  if (!word || ETHIOPIC.test(word)) return word;
  let s = word
    .toLowerCase()
    .normalize('NFD')
    .replace(/é/g, 'é')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zé]/g, '');
  s = s
    .replace(/x/g, 'ks')
    .replace(/ch(?=r)/g, 'k') // Chris → ክሪስ
    .replace(/c(?=[eiy])/g, 's')
    .replace(/(?<=[b-df-hj-np-tv-z])i(?=[aou])/g, 'iy'); // Biniam → ቢኒያም, Tsion → ጺዮን
  // double letters are said once
  s = s.replace(/([b-df-hj-np-tv-z])\1/g, '$1');

  const out: string[] = [];
  let i = 0;
  const vowelAt = (at: number): string | null => {
    for (const v of ['ie', 'ee', 'a', 'e', 'é', 'i', 'o', 'u']) if (s.startsWith(v, at)) return v;
    return null;
  };
  while (i < s.length) {
    let cons: string | null = null;
    for (const [from, to] of DIGRAPHS) {
      if (s.startsWith(from, i)) {
        cons = to;
        i += from.length;
        break;
      }
    }
    if (!cons) {
      const ch = s[i];
      if (ch === 'y' && i > 0 && !vowelAt(i + 1) && out.length) {
        // a final or before-a-consonant y sounds like i: Mary → ሜሪ
        cons = null;
      } else if (!vowelAt(i)) {
        cons = ch === 'c' ? 'k' : ch;
        i += 1;
      }
    }
    if (cons === 'kw') {
      out.push(String.fromCodePoint(FAMILY.k + 5));
      cons = 'w';
    }
    if (cons && !(cons in FAMILY)) continue;
    const v = vowelAt(i);
    if (!cons && !v && s[i] === 'y') {
      // y as a vowel after a consonant: turn the last letter into its i form
      const last = out.pop()!;
      const base = last.codePointAt(0)! - 5;
      out.push(String.fromCodePoint(base + 2));
      i += 1;
      continue;
    }
    if (v) i += v.length;
    if (cons) {
      out.push(String.fromCodePoint(FAMILY[cons] + (v ? ORDER[v] : 5)));
    } else if (v) {
      out.push(ALONE[v]);
    }
  }
  return out.join('');
}

/**
 * The learner's first name for the chats, from the name on their account, or
 * null when there isn't one (guests, or an account with only an email): they
 * keep Alex.
 */
export function learnerName(meta: Record<string, unknown> | undefined, female?: boolean): LearnerName | null {
  const full = typeof meta?.name === 'string' ? meta.name : typeof meta?.full_name === 'string' ? meta.full_name : '';
  const latin = full.trim().split(/\s+/)[0] ?? '';
  if (!latin) return null;
  const saved = typeof meta?.name_am === 'string' && meta.name_am.trim() ? meta.name_am.trim() : '';
  const amharic = saved || amharicName(latin);
  if (!amharic) return null;
  return { latin: latin.charAt(0).toUpperCase() + latin.slice(1), amharic, female };
}

/** Put Walia's name and the learner's name into an Amharic chat. */
export function personalizeChat(exercise: ChatExercise, who: LearnerName | null): ChatExercise {
  if (!who) return exercise;
  const you = (text: string) => text.replace(/አሌክስ/g, who.amharic).replace(/\bAlex\b/g, who.latin);
  const walia = (text: string) => {
    let out = you(text);
    if (!/ዳዊት|\bDawit\b/.test(out)) return out;
    out = out.replace(/ዳዊት/g, 'ዋሊያ').replace(/\bDawit\b/g, 'Walia');
    if (who.female) out = out.replace('ስምህ ማን ነው', 'ስምሽ ማን ነው').replace('səmməh man new', 'səmməsh man new');
    return out;
  };
  return {
    ...exercise,
    turns: exercise.turns.map(turn => ({
      ...turn,
      walia: walia(turn.walia),
      waliaHint: turn.waliaHint && walia(turn.waliaHint),
      options: turn.options.map(you),
      answer: you(turn.answer),
      hints: turn.hints && Object.fromEntries(Object.entries(turn.hints).map(([k, v]) => [you(k), you(v)])),
    })),
  };
}
