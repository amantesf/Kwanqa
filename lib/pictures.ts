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
  { amharic: 'ወንድሜ', transliteration: 'wəndime', english: 'my brother', src: '/pictures/wendime.png', group: 'family' },
  { amharic: 'አያቴ', transliteration: 'ayyate', english: 'my grandmother', src: '/pictures/ayate.png', group: 'family' },
  { amharic: 'ጓደኛዬ', transliteration: 'gwadenyaye', english: 'my friend', src: '/pictures/gwadenya.png', group: 'family' },
  { amharic: 'ብር', transliteration: 'birr', english: 'money', src: '/pictures/birr.png' },
  { amharic: 'ሽማግሌ', transliteration: 'shimagile', english: 'elder', src: '/pictures/shimagile.png', group: 'family' },
  { amharic: 'ስኒ', transliteration: 'sini', english: 'coffee cup', src: '/pictures/sini.png' },
  { amharic: 'ስኳር', transliteration: 'sikwar', english: 'sugar', src: '/pictures/sikwar.png', group: 'white-bowl' },
  { amharic: 'ዕጣን', transliteration: 'itan', english: 'incense', src: '/pictures/itan.png' },
  { amharic: 'እንጀራ', transliteration: 'injera', english: 'injera', src: '/pictures/injera.png' },
  { amharic: 'ወጥ', transliteration: 'wet', english: 'stew', src: '/pictures/wet.png' },
  { amharic: 'ሽሮ', transliteration: 'shiro', english: 'shiro', src: '/pictures/shiro.png' },
  { amharic: 'ውሃ', transliteration: 'wiha', english: 'water', src: '/pictures/wiha.png' },
  { amharic: 'በርበሬ', transliteration: 'berbere', english: 'berbere', src: '/pictures/berbere.png' },
  { amharic: 'ጨው', transliteration: 'chew', english: 'salt', src: '/pictures/chew.png', group: 'white-bowl' },
  { amharic: 'ገበያ', transliteration: 'gebeya', english: 'market', src: '/pictures/gebeya.png' },
  { amharic: 'ሙዝ', transliteration: 'muz', english: 'banana', src: '/pictures/muz.png' },
];

export function pictureFor(amharic: string) {
  return PICTURES.find(p => p.amharic === amharic);
}
