// Words with a picture, for the "Which one of these is …?" questions.
// A lesson that teaches one of these words gets picture questions for it;
// the other pictures are the wrong answers.

export type Picture = {
  amharic: string;
  transliteration: string;
  english: string;
  src: string;
  /**
   * Pictures that look alike share a group and are never the wrong answers
   * for each other: the people (family portraits, the bride, groom and
   * priest), sugar and salt, plates of food, buildings, and so on.
   */
  group?: 'family' | 'white-bowl' | 'food' | 'building' | 'bread' | 'mosque' | 'health' | 'stalls';
  /**
   * Other pictures of the same word, so quizzes can show any of them (an
   * Orthodox or a Protestant church for ቤተ ክርስቲያን). `src` stays the one
   * used on lesson cards.
   */
  also?: string[];
};

export const PICTURES: Picture[] = [
  { amharic: 'ቡና', transliteration: 'buna', english: 'coffee', src: '/pictures/buna.png' },
  { amharic: 'ቤት', transliteration: 'bet', english: 'house', src: '/pictures/bet.png', group: 'building' },
  { amharic: 'ታክሲ', transliteration: 'taksi', english: 'taxi', src: '/pictures/taksi.png' },
  { amharic: 'አበባ', transliteration: 'abeba', english: 'flower', src: '/pictures/abeba.png' },
  { amharic: 'ጀበና', transliteration: 'jebena', english: 'coffee pot', src: '/pictures/jebena.png' },
  { amharic: 'ባጃጅ', transliteration: 'bajaj', english: 'bajaj', src: '/pictures/bajaj.png' },
  { amharic: 'ዳቦ', transliteration: 'dabo', english: 'bread', src: '/pictures/dabo.png', group: 'bread' },
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
  { amharic: 'እንጀራ', transliteration: 'injera', english: 'injera', src: '/pictures/injera.png', group: 'food' },
  { amharic: 'ወጥ', transliteration: 'wet', english: 'stew', src: '/pictures/wet.png', group: 'food' },
  { amharic: 'ሽሮ', transliteration: 'shiro', english: 'shiro', src: '/pictures/shiro.png', group: 'food' },
  { amharic: 'ውሃ', transliteration: 'wiha', english: 'water', src: '/pictures/wiha.png' },
  { amharic: 'በርበሬ', transliteration: 'berbere', english: 'berbere', src: '/pictures/berbere.png' },
  { amharic: 'ጨው', transliteration: 'chew', english: 'salt', src: '/pictures/chew.png', group: 'white-bowl' },
  { amharic: 'ገበያ', transliteration: 'gebeya', english: 'market', src: '/pictures/gebeya.png', group: 'stalls' },
  { amharic: 'ሙዝ', transliteration: 'muz', english: 'banana', src: '/pictures/muz.png' },
  { amharic: 'ቲማቲም', transliteration: 'timatim', english: 'tomato', src: '/pictures/timatim.png' },
  { amharic: 'ቀኝ', transliteration: 'qegn', english: 'right', src: '/pictures/qegn.png' },
  { amharic: 'ግራ', transliteration: 'gira', english: 'left', src: '/pictures/gira.png' },
  { amharic: 'ቀጥታ', transliteration: 'qetita', english: 'straight ahead', src: '/pictures/qetita.png' },
  { amharic: 'መንገድ', transliteration: 'menged', english: 'road', src: '/pictures/menged.png' },
  { amharic: 'ሰዓት', transliteration: 'se\'at', english: 'clock', src: '/pictures/seat.png' },
  { amharic: 'ጠዋት', transliteration: 'tewat', english: 'morning', src: '/pictures/tewat.png' },
  { amharic: 'ማታ', transliteration: 'mata', english: 'evening', src: '/pictures/mata.png' },
  { amharic: 'መስጊድ', transliteration: 'mesgid', english: 'mosque', src: '/pictures/mesgid.png', group: 'mosque' },
  { amharic: 'ሆስፒታል', transliteration: 'hospital', english: 'hospital', src: '/pictures/hospital.png', group: 'health' },
  { amharic: 'ባንክ', transliteration: 'bank', english: 'bank', src: '/pictures/bank.png' },
  { amharic: 'ሱቅ', transliteration: 'suq', english: 'shop', src: '/pictures/suq.png', group: 'stalls' },
  { amharic: 'ካፌ', transliteration: 'kafe', english: 'café', src: '/pictures/kafe.png' },
  { amharic: 'ደክሞኛል', transliteration: 'dekmognal', english: 'I\'m tired', src: '/pictures/dekmognal.png' },
  { amharic: 'ርቦኛል', transliteration: 'rabognal', english: 'I\'m hungry', src: '/pictures/rabognal.png' },
  { amharic: 'ጠምቶኛል', transliteration: 'temtognal', english: 'I\'m thirsty', src: '/pictures/temtognal.png' },
  { amharic: 'አሞኛል', transliteration: 'amognal', english: 'I\'m sick', src: '/pictures/amognal.png' },
  { amharic: 'ሙዚቃ', transliteration: 'muziqa', english: 'music', src: '/pictures/muziqa.png' },
  { amharic: 'በር', transliteration: 'ber', english: 'door', src: '/pictures/ber.png' },
  { amharic: 'መስኮት', transliteration: 'meskot', english: 'window', src: '/pictures/meskot.png' },
  { amharic: 'ወንበር', transliteration: 'wenber', english: 'chair', src: '/pictures/wenber.png' },
  { amharic: 'ጠረጴዛ', transliteration: 'terepeza', english: 'table', src: '/pictures/terepeza.png' },
  { amharic: 'መስቀል', transliteration: 'meskel', english: 'Meskel', src: '/pictures/meskel.png' },
  { amharic: 'ገና', transliteration: 'genna', english: 'Ethiopian Christmas', src: '/pictures/genna.png' },
  { amharic: 'ክረምት', transliteration: 'kiremt', english: 'rainy season', src: '/pictures/kiremt.png' },
  { amharic: 'ልጆቼ', transliteration: 'lijoche', english: 'my children', src: '/pictures/lijoche.png', group: 'family' },
  { amharic: 'ፀሐይ', transliteration: 'tsehay', english: 'sun', src: '/pictures/tsehay.png' },
  { amharic: 'ደመና', transliteration: 'demena', english: 'cloud', src: '/pictures/demena.png' },
  { amharic: 'ጃንጥላ', transliteration: 'jantila', english: 'umbrella', src: '/pictures/jantila.png' },
  { amharic: 'ሐኪም', transliteration: 'hakim', english: 'doctor', src: '/pictures/hakim.png' },
  { amharic: 'መድኃኒት', transliteration: 'medhanit', english: 'medicine', src: '/pictures/medhanit.png' },
  { amharic: 'ሻይ', transliteration: 'shay', english: 'tea', src: '/pictures/shai.png' },
  { amharic: 'ማኪያቶ', transliteration: 'makiyato', english: 'macchiato', src: '/pictures/makiyato.png' },
  { amharic: 'ሥጋ', transliteration: 'siga', english: 'meat', src: '/pictures/siga.png' },
  { amharic: 'አውቶቡስ', transliteration: 'awtobus', english: 'bus', src: '/pictures/autobus.png' },
  { amharic: 'ጫማ', transliteration: 'chama', english: 'shoes', src: '/pictures/chama.png' },
  { amharic: 'ቁልፍ', transliteration: 'qulf', english: 'key', src: '/pictures/kulf.png' },
  { amharic: 'ሕፃን', transliteration: 'hitsan', english: 'baby', src: '/pictures/hitsan.png', group: 'family' },
  { amharic: 'ሙሽሪት', transliteration: 'mushirit', english: 'bride', src: '/pictures/mushirit.png', group: 'family' },
  { amharic: 'ሙሽራ', transliteration: 'mushira', english: 'groom', src: '/pictures/mushra.png', group: 'family' },
  { amharic: 'ካህን', transliteration: 'kahin', english: 'priest', src: '/pictures/kahin.png', group: 'family' },
  { amharic: 'ቁርስ', transliteration: 'qurs', english: 'breakfast', src: '/pictures/kurs.png', group: 'food' },
  { amharic: 'ምግብ', transliteration: 'migib', english: 'food', src: '/pictures/migib.png', group: 'food' },
  { amharic: 'ደረሰኝ', transliteration: 'deresegn', english: 'receipt', src: '/pictures/deresegn.png' },
  { amharic: 'ፋርማሲ', transliteration: 'farmasi', english: 'pharmacy', src: '/pictures/farmasi.png', group: 'health' },
  { amharic: 'ሆቴል', transliteration: 'hotel', english: 'hotel', src: '/pictures/hotel.png', group: 'building' },
  { amharic: 'ትምህርት ቤት', transliteration: 'timhirt bet', english: 'school', src: '/pictures/timhirt-bet.png', group: 'building' },
  { amharic: 'ዳቦ ቤት', transliteration: 'dabo bet', english: 'bakery', src: '/pictures/dabo-bet.png', group: 'bread' },
  { amharic: 'ቤተ ክርስቲያን', transliteration: 'bete kristiyan', english: 'church', src: '/pictures/betekristiyan.png', also: ['/pictures/protestant-church.png'] },
  { amharic: 'ወጥ ቤት', transliteration: 'wet bet', english: 'kitchen', src: '/pictures/wet-bet.png', group: 'food' },
  { amharic: 'ፋሲካ', transliteration: 'fasika', english: 'Easter', src: '/pictures/fasika.png', group: 'food' },
  { amharic: 'ኢድ', transliteration: 'id', english: 'Eid', src: '/pictures/id.png', group: 'food' },
  { amharic: 'ረመዳን', transliteration: 'remedan', english: 'Ramadan', src: '/pictures/remedan.png', group: 'mosque' },
];

/** One of a word's pictures, picked at random (for quizzes, which run in the browser). */
export function pictureSrc(p: Picture): string {
  const all = [p.src, ...(p.also ?? [])];
  return all[Math.floor(Math.random() * all.length)];
}

export function pictureFor(amharic: string) {
  return PICTURES.find(p => p.amharic === amharic);
}
