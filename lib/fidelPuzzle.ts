// The daily ፊደል puzzle, on the alphabet page: guess today's three-letter
// Amharic word in six tries. Everyone gets the same word on the same day.
//
// After each guess every letter gets a colour:
//   right   – the right letter in the right place
//   family  – the right consonant in the right place, but the wrong vowel
//             (ቦ for ባ), which is how the ፊደል works: one row, seven vowels
//   moved   – the letter is in the word, in another place
//   out     – none of the above
//
// Letters that sound the same count as the same (ሀ ሐ ኀ, ሰ ሠ, አ ዐ, ጸ ፀ), so
// ሀኪም is right for ሐኪም. A native speaker should check the words.

import { FIDEL } from '@/lib/fidel';

export type PuzzleWord = { word: string; tr: string; meaning: string };

/** Three-letter words a learner meets in the camps and stories. */
const WORDS: PuzzleWord[] = [
  { word: 'ሰላም', tr: 'selam', meaning: 'peace, hello' },
  { word: 'ገበያ', tr: 'gebeya', meaning: 'market' },
  { word: 'ልጆች', tr: 'lijoch', meaning: 'children' },
  { word: 'አባት', tr: 'abat', meaning: 'father' },
  { word: 'እናት', tr: 'inat', meaning: 'mother' },
  { word: 'እህት', tr: 'ihit', meaning: 'sister' },
  { word: 'ቁርስ', tr: 'qurs', meaning: 'breakfast' },
  { word: 'እራት', tr: 'irat', meaning: 'dinner' },
  { word: 'ጥቁር', tr: 'tiqur', meaning: 'black' },
  { word: 'መኪና', tr: 'mekina', meaning: 'car' },
  { word: 'ባቡር', tr: 'babur', meaning: 'train' },
  { word: 'ከተማ', tr: 'ketema', meaning: 'city, town' },
  { word: 'ስልክ', tr: 'silk', meaning: 'phone' },
  { word: 'ሐኪም', tr: 'hakim', meaning: 'doctor' },
  { word: 'ዝናብ', tr: 'zinab', meaning: 'rain' },
  { word: 'ፀሐይ', tr: 'tsehay', meaning: 'sun' },
  { word: 'ጨረቃ', tr: 'chereqa', meaning: 'moon' },
  { word: 'ኮከብ', tr: 'kokeb', meaning: 'star' },
  { word: 'ተራራ', tr: 'terara', meaning: 'mountain' },
  { word: 'ወንዝ', tr: 'wenz', meaning: 'river' },
  { word: 'ሐይቅ', tr: 'hayq', meaning: 'lake' },
  { word: 'አበባ', tr: 'abeba', meaning: 'flower' },
  { word: 'ድመት', tr: 'dimet', meaning: 'cat' },
  { word: 'ፈረስ', tr: 'feres', meaning: 'horse' },
  { word: 'ዝሆን', tr: 'zihon', meaning: 'elephant' },
  { word: 'ዓመት', tr: 'amet', meaning: 'year' },
  { word: 'ጠዋት', tr: 'tewat', meaning: 'morning' },
  { word: 'ደስታ', tr: 'desta', meaning: 'joy' },
  { word: 'ፍቅር', tr: 'fiqir', meaning: 'love' },
  { word: 'ሰዓት', tr: 'se’at', meaning: 'hour, clock' },
  { word: 'ቁጥር', tr: 'qutir', meaning: 'number' },
  { word: 'ተማሪ', tr: 'temari', meaning: 'student' },
  { word: 'ገበሬ', tr: 'gebere', meaning: 'farmer' },
  { word: 'ሀገር', tr: 'hager', meaning: 'country' },
  { word: 'ልብስ', tr: 'libs', meaning: 'clothes' },
  { word: 'ቀሚስ', tr: 'qemis', meaning: 'dress' },
  { word: 'ወተት', tr: 'wetet', meaning: 'milk' },
  { word: 'ጎመን', tr: 'gomen', meaning: 'collard greens' },
  { word: 'ምስር', tr: 'misir', meaning: 'lentils' },
  { word: 'እሳት', tr: 'isat', meaning: 'fire' },
  { word: 'አልጋ', tr: 'alga', meaning: 'bed' },
  { word: 'ሙዚቃ', tr: 'muziqa', meaning: 'music' },
  { word: 'ዘፈን', tr: 'zefen', meaning: 'song' },
  { word: 'ጨዋታ', tr: 'chewata', meaning: 'game, chat' },
  { word: 'ሀሳብ', tr: 'hasab', meaning: 'idea, thought' },
  { word: 'ሕልም', tr: 'hilm', meaning: 'dream' },
  { word: 'ቀለም', tr: 'qelem', meaning: 'colour, ink' },
  { word: 'ስጦታ', tr: 'sitota', meaning: 'gift' },
  { word: 'በዓል', tr: 'be’al', meaning: 'holiday' },
  { word: 'ጥያቄ', tr: 'tiyaqe', meaning: 'question' },
  { word: 'መልስ', tr: 'mels', meaning: 'answer' },
].filter(w => [...w.word].length === 3);

export const PUZZLE_LENGTH = 3;
export const PUZZLE_TRIES = 6;

// ---------------------------------------------------------------------------
// Letters: which row (consonant) and column (vowel) a character sits in.

const ROWS = FIDEL.map(row => ({ code: row.base.codePointAt(0)!, same: row.sameAs?.codePointAt(0) }));

/** The row a letter belongs to, with sound-alike rows merged (ሐ → ሀ), and its vowel (0–6). */
function place(char: string): { row: number; vowel: number } | null {
  const cp = char.codePointAt(0);
  if (cp === undefined) return null;
  const row = ROWS.find(r => cp >= r.code && cp < r.code + 7);
  if (!row) return null;
  return { row: row.same ?? row.code, vowel: cp - row.code };
}

/** Whether a character is a letter on the puzzle keyboard. */
export function isPuzzleLetter(char: string) {
  return place(char) !== null;
}

/** The letter as it's compared: ሐኪም and ሀኪም read the same. */
function sound(char: string) {
  const p = place(char);
  return p ? `${p.row}:${p.vowel}` : char;
}

export type Mark = 'right' | 'family' | 'moved' | 'out';

/** The colours for one guess, Wordle-style: each answer letter is used once. */
export function markGuess(guess: string, answer: string): Mark[] {
  const g = [...guess];
  const a = [...answer];
  const marks: Mark[] = g.map(() => 'out');
  const left: string[] = [];
  g.forEach((ch, i) => {
    if (sound(ch) === sound(a[i])) marks[i] = 'right';
    else left.push(sound(a[i]));
  });
  g.forEach((ch, i) => {
    if (marks[i] === 'right') return;
    const k = left.indexOf(sound(ch));
    if (k >= 0) {
      marks[i] = 'moved';
      left.splice(k, 1);
    } else if (place(ch)?.row === place(a[i])?.row) {
      marks[i] = 'family';
    }
  });
  return marks;
}

/** Whether a consonant row is anywhere in the answer (for greying out keyboard keys). */
export function rowInWord(base: string, answer: string) {
  const row = place(base)?.row;
  return [...answer].some(ch => place(ch)?.row === row);
}

/** Whether two letters sit in the same consonant row. */
export function sameRow(a: string, b: string) {
  return place(a)?.row === place(b)?.row;
}

// ---------------------------------------------------------------------------
// Today's word

/** Days since 1 Jan 2026 in the learner's own time zone: puzzle #1 was that day. */
export function puzzleNumber(now = new Date()) {
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.floor((today - Date.UTC(2026, 0, 1)) / 86_400_000) + 1;
}

/** A fixed shuffle, so the words don't come round in the order they're listed. */
const ORDER = WORDS.map((_, i) => i).sort((x, y) => ((x * 7919) % 101) - ((y * 7919) % 101));

export function puzzleWord(number: number): PuzzleWord {
  const n = ((number % WORDS.length) + WORDS.length) % WORDS.length;
  return WORDS[ORDER[n]];
}

/** Every puzzle word, so Walia's voice may read them (lib/amharicAudio.ts). */
export function puzzleWords(): string[] {
  return WORDS.map(w => w.word);
}

/** The squares to share: 🟩 right, 🟨 moved, 🟦 right row wrong vowel, ⬜ out. */
export function shareText(number: number, rows: Mark[][], won: boolean) {
  const square: Record<Mark, string> = { right: '🟩', moved: '🟨', family: '🟦', out: '⬜' };
  const grid = rows.map(row => row.map(m => square[m]).join('')).join('\n');
  return `ፊደል puzzle #${number} ${won ? rows.length : 'X'}/${PUZZLE_TRIES}\n${grid}\nkwanqa.com/fidel?tab=puzzle`;
}
