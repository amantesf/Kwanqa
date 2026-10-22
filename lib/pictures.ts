// Words with a picture, for the "Which one of these is …?" questions.
// A lesson that teaches one of these words gets picture questions for it;
// the other pictures are the wrong answers.

export type Picture = { amharic: string; transliteration: string; english: string; src: string };

export const PICTURES: Picture[] = [
  { amharic: 'ቡና', transliteration: 'buna', english: 'coffee', src: '/pictures/buna.png' },
  { amharic: 'ቤት', transliteration: 'bet', english: 'house', src: '/pictures/bet.png' },
  { amharic: 'ታክሲ', transliteration: 'taksi', english: 'taxi', src: '/pictures/taksi.png' },
  { amharic: 'አበባ', transliteration: 'abeba', english: 'flower', src: '/pictures/abeba.png' },
];

export function pictureFor(amharic: string) {
  return PICTURES.find(p => p.amharic === amharic);
}
