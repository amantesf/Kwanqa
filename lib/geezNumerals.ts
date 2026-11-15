// Ge'ez numerals for the alphabet page: the 20 signs and the Amharic word
// for each. There's no zero: tens and ones sit side by side (፳፭ = 25), and
// ፻ (100) and ፼ (10,000) join bigger numbers (lib/ethiopianCalendar.ts has
// geezNumber, which writes any number this way).

export type GeezNumeral = { sign: string; value: number; amharic: string; tr: string };

export const GEEZ_ONES: GeezNumeral[] = [
  { sign: '፩', value: 1, amharic: 'አንድ', tr: 'and' },
  { sign: '፪', value: 2, amharic: 'ሁለት', tr: 'hulet' },
  { sign: '፫', value: 3, amharic: 'ሦስት', tr: 'sost' },
  { sign: '፬', value: 4, amharic: 'አራት', tr: 'arat' },
  { sign: '፭', value: 5, amharic: 'አምስት', tr: 'amist' },
  { sign: '፮', value: 6, amharic: 'ስድስት', tr: 'sidist' },
  { sign: '፯', value: 7, amharic: 'ሰባት', tr: 'sebat' },
  { sign: '፰', value: 8, amharic: 'ስምንት', tr: 'simint' },
  { sign: '፱', value: 9, amharic: 'ዘጠኝ', tr: 'zetegn' },
];

export const GEEZ_TENS: GeezNumeral[] = [
  { sign: '፲', value: 10, amharic: 'አስር', tr: 'asir' },
  { sign: '፳', value: 20, amharic: 'ሃያ', tr: 'haya' },
  { sign: '፴', value: 30, amharic: 'ሰላሳ', tr: 'selasa' },
  { sign: '፵', value: 40, amharic: 'አርባ', tr: 'arba' },
  { sign: '፶', value: 50, amharic: 'ሃምሳ', tr: 'hamsa' },
  { sign: '፷', value: 60, amharic: 'ስልሳ', tr: 'silsa' },
  { sign: '፸', value: 70, amharic: 'ሰባ', tr: 'seba' },
  { sign: '፹', value: 80, amharic: 'ሰማንያ', tr: 'semanya' },
  { sign: '፺', value: 90, amharic: 'ዘጠና', tr: 'zetena' },
];

export const GEEZ_BIG: GeezNumeral[] = [
  { sign: '፻', value: 100, amharic: 'መቶ', tr: 'meto' },
  { sign: '፼', value: 10_000, amharic: 'አስር ሺህ', tr: 'asir shih' },
];

/** Every number word in the chart, so Walia's voice may read them (lib/amharicAudio.ts). */
export function geezNumeralWords(): string[] {
  return [...GEEZ_ONES, ...GEEZ_TENS, ...GEEZ_BIG].map(n => n.amharic);
}
