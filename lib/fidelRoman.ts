// Any Amharic word in easy Latin letters, the way kwanqa writes them
// (ትምህርት → timhirt, ሰላም → selam, ቋንቋ → qwanqwa). Used for books and
// stories that don't come with a hand-written transliteration.
//
// Each ፊደል row has seven vowel orders (ä u i a ē ə o) and often an eighth
// (wa). kwanqa writes ä and ē as "e". The sixth order (ə) is written "i" at
// the start of a word or after another bare consonant (ስንት → sint), and left
// off otherwise (ሰላም → selam).

const ORDERS = ['e', 'u', 'i', 'a', 'e', '', 'o', 'wa'];

// The first letter of each row and its consonant.
const ROWS: [number, string][] = [
  [0x1200, 'h'], [0x1208, 'l'], [0x1210, 'h'], [0x1218, 'm'], [0x1220, 's'], [0x1228, 'r'], [0x1230, 's'],
  [0x1238, 'sh'], [0x1240, 'q'], [0x1250, 'q'], [0x1260, 'b'], [0x1268, 'v'], [0x1270, 't'], [0x1278, 'ch'],
  [0x1280, 'h'], [0x1290, 'n'], [0x1298, 'gn'], [0x12a0, ''], [0x12a8, 'k'], [0x12b8, 'h'], [0x12c8, 'w'],
  [0x12d0, ''], [0x12d8, 'z'], [0x12e0, 'zh'], [0x12e8, 'y'], [0x12f0, 'd'], [0x12f8, 'd'], [0x1300, 'j'],
  [0x1308, 'g'], [0x1318, 'g'], [0x1320, 't'], [0x1328, 'ch'], [0x1330, 'p'], [0x1338, 'ts'], [0x1340, 'ts'],
  [0x1348, 'f'], [0x1350, 'p'],
];
// rows of "w" sounds after k, q, g, h: ቈ ቊ ቋ ቌ ቍ
const LABIO: [number, string][] = [[0x1248, 'q'], [0x1288, 'h'], [0x12b0, 'k'], [0x1310, 'g']];
const LABIO_VOWELS = ['we', '', 'wi', 'wa', 'we', 'w'];

const PUNCT: Record<string, string> = { '።': '.', '፣': ',', '፤': ';', '፥': ':', '፦': ':', '፧': '?', '፡': ' ', '፨': '.' };

type Syllable = { consonant: string; vowel: string; bare: boolean } | { other: string };

function syllable(ch: string): Syllable {
  const code = ch.codePointAt(0) ?? 0;
  for (const [start, c] of LABIO) {
    if (code >= start && code < start + 6) {
      const v = LABIO_VOWELS[code - start];
      return { consonant: c, vowel: v, bare: false };
    }
  }
  for (const [start, c] of ROWS) {
    if (code >= start && code < start + 8) {
      const order = code - start;
      // the glottal rows (አ, ዐ): አ is "a", እ is "i"
      if (c === '') return { consonant: '', vowel: ['a', 'u', 'i', 'a', 'e', 'i', 'o', 'wa'][order], bare: false };
      // ሀ ሐ ኀ start with "ha" (ሀገር → hager)
      const vowel = order === 0 && c === 'h' ? 'a' : ORDERS[order];
      return { consonant: c, vowel, bare: order === 5 };
    }
  }
  if (PUNCT[ch]) return { other: PUNCT[ch] };
  return { other: ch };
}

/** One Amharic word or sentence in Latin letters. */
export function fidelRoman(text: string): string {
  let out = '';
  const chars = Array.from(text);
  let prevBare = false;
  let wordStart = true;
  for (let i = 0; i < chars.length; i++) {
    const s = syllable(chars[i]);
    if ('other' in s) {
      out += s.other;
      wordStart = /[\s.,;:?!"“”'‘’«»()]/.test(s.other);
      prevBare = false;
      continue;
    }
    if (s.bare) {
      const next = chars[i + 1] ? syllable(chars[i + 1]) : null;
      const wordEnds = !next || 'other' in next;
      const sayI: boolean = !wordEnds && (wordStart || prevBare);
      // ው sounds like "wu" (ውስጥ → wust)
      out += s.consonant + (sayI ? (s.consonant === 'w' ? 'u' : 'i') : '');
      prevBare = !sayI;
    } else {
      out += s.consonant + s.vowel;
      prevBare = false;
    }
    wordStart = false;
  }
  return out;
}
