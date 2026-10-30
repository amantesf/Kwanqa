// Words with a picture, for the "Which one of these is …?" questions.
// A lesson that teaches one of these words gets picture questions for it;
// the other pictures are the wrong answers.

export type Picture = {
  amharic: string;
  transliteration: string;
  english: string;
  src: string;
  /**
   * Pictures that look alike (the family portraits, sugar and salt) share a
   * group and are never the wrong answers for each other.
   */
  group?: 'family' | 'white-bowl';
};

export const PICTURES: Picture[] = [
  { amharic: 'ቡና', transliteration: 'buna', english: 'coffee', src: '/pictures/buna.png' },
  { amharic: 'ቤት', transliteration: 'bet', english: 'house', src: '/pictures/bet.png' },
  { amharic: 'ታክሲ', transliteration: 'taksi', english: 'taxi', src: '/pictures/taksi.png' },
  { amharic: 'አበባ', transliteration: 'abeba', english: 'flower', src: '/pictures/abeba.png' },
  { amharic: 'ጀበና', transliteration: 'jebena', english: 'coffee pot', src: '/pictures/jebena.png' },
  { amharic: 'ባጃጅ', transliteration: 'bajaj', english: 'bajaj', src: '/pictures/bajaj.png' },
  { amharic: 'ዳቦ', transliteration: 'dabo', english: 'bread', src: '/pictures/dabo.png' },
  { amharic: 'ሽንኩርት', transliteration: 'shinkurt', english: 'onion', src: '/pictures/shinkurt.png' },
  { amharic: 'ኳስ', transliteration: 'kwas', english: 'ball', src: '/pictures/kwas.png' },
  { amharic: 'አባቴ', transliteration: 'abate', english: 'my father', src: '/pictures/abate.png', group: 'family' },
  { amharic: 'እናቴ', transliteration: 'ənnate', english: 'my mother', src: '/pictures/inate.png', group: 'family' },
  { amharic: 'እህቴ', transliteration: 'əhtē', english: 'my sister', src: '/pictures/ihite.png', group: 'family' },
];

export function pictureFor(amharic: string) {
  return PICTURES.find(p => p.amharic === amharic);
}
