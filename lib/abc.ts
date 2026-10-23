// The English alphabet, for Amharic speakers learning English. Each letter has
// its name written the way it sounds in ፊደል, an example word, and the word's
// Amharic meaning. Words with a picture reuse the lesson pictures.

export type AbcLetter = {
  upper: string;
  lower: string;
  /** The letter's English name, written in ፊደል (B is ቢ). */
  nameAm: string;
  word: string;
  wordAm: string;
  /** Most words start with the letter; X is the odd one out. */
  ends?: boolean;
  picture?: string;
};

export const ABC: AbcLetter[] = [
  { upper: 'A', lower: 'a', nameAm: 'ኤ', word: 'apple', wordAm: 'ፖም' },
  { upper: 'B', lower: 'b', nameAm: 'ቢ', word: 'ball', wordAm: 'ኳስ', picture: '/pictures/kwas.png' },
  { upper: 'C', lower: 'c', nameAm: 'ሲ', word: 'coffee', wordAm: 'ቡና', picture: '/pictures/buna.png' },
  { upper: 'D', lower: 'd', nameAm: 'ዲ', word: 'dog', wordAm: 'ውሻ' },
  { upper: 'E', lower: 'e', nameAm: 'ኢ', word: 'egg', wordAm: 'እንቁላል' },
  { upper: 'F', lower: 'f', nameAm: 'ኤፍ', word: 'flower', wordAm: 'አበባ', picture: '/pictures/abeba.png' },
  { upper: 'G', lower: 'g', nameAm: 'ጂ', word: 'goat', wordAm: 'ፍየል' },
  { upper: 'H', lower: 'h', nameAm: 'ኤች', word: 'house', wordAm: 'ቤት', picture: '/pictures/bet.png' },
  { upper: 'I', lower: 'i', nameAm: 'አይ', word: 'ice', wordAm: 'በረዶ' },
  { upper: 'J', lower: 'j', nameAm: 'ጄ', word: 'juice', wordAm: 'ጭማቂ' },
  { upper: 'K', lower: 'k', nameAm: 'ኬ', word: 'key', wordAm: 'ቁልፍ' },
  { upper: 'L', lower: 'l', nameAm: 'ኤል', word: 'lion', wordAm: 'አንበሳ' },
  { upper: 'M', lower: 'm', nameAm: 'ኤም', word: 'milk', wordAm: 'ወተት' },
  { upper: 'N', lower: 'n', nameAm: 'ኤን', word: 'nose', wordAm: 'አፍንጫ' },
  { upper: 'O', lower: 'o', nameAm: 'ኦ', word: 'onion', wordAm: 'ሽንኩርት', picture: '/pictures/shinkurt.png' },
  { upper: 'P', lower: 'p', nameAm: 'ፒ', word: 'pen', wordAm: 'እስክሪብቶ' },
  { upper: 'Q', lower: 'q', nameAm: 'ኪው', word: 'queen', wordAm: 'ንግሥት' },
  { upper: 'R', lower: 'r', nameAm: 'አር', word: 'rain', wordAm: 'ዝናብ' },
  { upper: 'S', lower: 's', nameAm: 'ኤስ', word: 'sun', wordAm: 'ፀሐይ' },
  { upper: 'T', lower: 't', nameAm: 'ቲ', word: 'taxi', wordAm: 'ታክሲ', picture: '/pictures/taksi.png' },
  { upper: 'U', lower: 'u', nameAm: 'ዩ', word: 'umbrella', wordAm: 'ጃንጥላ' },
  { upper: 'V', lower: 'v', nameAm: 'ቪ', word: 'vegetables', wordAm: 'አትክልቶች' },
  { upper: 'W', lower: 'w', nameAm: 'ደብሊው', word: 'water', wordAm: 'ውሃ' },
  { upper: 'X', lower: 'x', nameAm: 'ኤክስ', word: 'box', wordAm: 'ሳጥን', ends: true },
  { upper: 'Y', lower: 'y', nameAm: 'ዋይ', word: 'yes', wordAm: 'አዎ' },
  { upper: 'Z', lower: 'z', nameAm: 'ዚ', word: 'zebra', wordAm: 'የሜዳ አህያ' },
];

/** Everything the ABC page reads aloud. */
export function abcSpeakable() {
  return ABC.flatMap(l => [l.upper, l.word]);
}
