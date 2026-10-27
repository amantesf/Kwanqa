// The Amharic ፊደል (fidel): 33 traditional consonants (+ ቨ for loanwords) × 7 vowel orders.
// Unicode stores each consonant's forms in order (base, +1 … +6), so the
// characters are generated from code points rather than typed by hand.
//
// Romanization is a simple learner-friendly scheme — have a native speaker
// review it, and change it here if needed.

export type FidelVowel = { order: number; roman: string; hint: string };

export const VOWELS: FidelVowel[] = [
  { order: 1, roman: 'e', hint: 'like “e” in “the”' },
  { order: 2, roman: 'u', hint: 'like “oo” in “food”' },
  { order: 3, roman: 'i', hint: 'like “ee” in “see”' },
  { order: 4, roman: 'a', hint: 'like “a” in “father”' },
  { order: 5, roman: 'ē', hint: 'like “ay” in “say”' },
  { order: 6, roman: 'ə', hint: 'short “i” in “sit”, or no vowel' },
  { order: 7, roman: 'o', hint: 'like “o” in “go”' },
];

type Consonant = {
  code: number; // code point of the first-order form
  roman: string; // '' for the vowel carriers አ and ዐ
  name: string; // how the sound is described to learners
  sameAs?: string; // base letter it sounds identical to in Amharic
};

const CONSONANTS: Consonant[] = [
  { code: 0x1200, roman: 'h', name: 'h' },
  { code: 0x1208, roman: 'l', name: 'l' },
  { code: 0x1210, roman: 'h', name: 'h', sameAs: 'ሀ' },
  { code: 0x1218, roman: 'm', name: 'm' },
  { code: 0x1220, roman: 's', name: 's', sameAs: 'ሰ' },
  { code: 0x1228, roman: 'r', name: 'r (rolled)' },
  { code: 0x1230, roman: 's', name: 's' },
  { code: 0x1238, roman: 'sh', name: 'sh' },
  { code: 0x1240, roman: 'q', name: 'q (k made at the back of the throat)' },
  { code: 0x1260, roman: 'b', name: 'b' },
  { code: 0x1268, roman: 'v', name: 'v (in loanwords, e.g. ቪዲዮ “video”)' },
  { code: 0x1270, roman: 't', name: 't' },
  { code: 0x1278, roman: 'ch', name: 'ch' },
  { code: 0x1280, roman: 'h', name: 'h', sameAs: 'ሀ' },
  { code: 0x1290, roman: 'n', name: 'n' },
  { code: 0x1298, roman: 'ny', name: 'ny (as in “canyon”)' },
  { code: 0x12a0, roman: '', name: 'vowel carrier' },
  { code: 0x12a8, roman: 'k', name: 'k' },
  { code: 0x12b8, roman: 'kh', name: 'kh (rare, in loanwords)' },
  { code: 0x12c8, roman: 'w', name: 'w' },
  { code: 0x12d0, roman: '', name: 'vowel carrier', sameAs: 'አ' },
  { code: 0x12d8, roman: 'z', name: 'z' },
  { code: 0x12e0, roman: 'zh', name: 'zh (as in “measure”)' },
  { code: 0x12e8, roman: 'y', name: 'y' },
  { code: 0x12f0, roman: 'd', name: 'd' },
  { code: 0x1300, roman: 'j', name: 'j' },
  { code: 0x1308, roman: 'g', name: 'g' },
  { code: 0x1320, roman: 't’', name: 't’ (popped t)' },
  { code: 0x1328, roman: 'ch’', name: 'ch’ (popped ch)' },
  { code: 0x1330, roman: 'p’', name: 'p’ (popped p, rare)' },
  { code: 0x1338, roman: 'ts’', name: 'ts’ (popped ts)' },
  { code: 0x1340, roman: 'ts’', name: 'ts’ (popped ts)', sameAs: 'ጸ' },
  { code: 0x1348, roman: 'f', name: 'f' },
  { code: 0x1350, roman: 'p', name: 'p' },
];

/** `audio` is the recording of this sound (shared by letters that sound the same). */
export type FidelCell = { char: string; roman: string; vowel: FidelVowel; audio: string };

// Each letter is read by Walia's Microsoft Azure voice (Ameha) through /api/speak,
// a little slower than normal so a single sound is clear. It's made the first
// time anyone taps the letter and cached for a year after that.
// Letters that sound the same as another (sameAs) share that letter's sound.
// (The older recordings cut from a long clip are still in public/sounds/fidel/.)
const audioFor = (code: number) => `/api/speak?text=${encodeURIComponent(String.fromCodePoint(code))}&slow=1`;

/** Every letter that has its own sound, for the list of lines /api/speak may read. */
export function fidelSounds(): string[] {
  return CONSONANTS.filter(c => !c.sameAs).flatMap(c => VOWELS.map((_, i) => String.fromCodePoint(c.code + i)));
}
export type FidelRow = { base: string; roman: string; name: string; sameAs?: string; cells: FidelCell[] };

export const FIDEL: FidelRow[] = CONSONANTS.map(c => ({
  base: String.fromCodePoint(c.code),
  roman: c.roman,
  name: c.name,
  sameAs: c.sameAs,
  cells: VOWELS.map((vowel, i) => ({
    char: String.fromCodePoint(c.code + i),
    roman: c.roman + vowel.roman,
    vowel,
    audio: audioFor((c.sameAs ? c.sameAs.codePointAt(0)! : c.code) + i),
  })),
}));
