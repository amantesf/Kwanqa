// Stories: short Amharic stories to read and listen to, the Kaufmann / LingQ
// way. You read real sentences a little above your level, tap any word you
// don't know, and mark it "learning" or "known"; the number of words you know
// is your progress (lib/knownWords.ts).
//
// Every word has its own meaning written by hand, because one Amharic word
// often holds several English ones (አያቴ = "my grandmother"). Sentences and
// words are read aloud by Walia's voice (lib/amharicAudio.ts).
//
// A native speaker should check every story.

/**
 * One word as written in the story: [Amharic, transliteration, meaning here,
 * punctuation right after it (። ፣ ! ?)].
 */
export type StoryWord = [am: string, tr: string, meaning: string, after?: string];

export type StorySentence = {
  /** The words in order. */
  words: StoryWord[];
  /** Opening and closing quote marks around words, by index: [from, to]. */
  quote?: [number, number];
  transliteration: string;
  english: string;
};

export type Story = {
  id: string;
  title: string;
  amharicTitle: string;
  /** The camp whose words it mostly uses. */
  camp: number;
  blurb: string;
  sentences: StorySentence[];
  /** A culture note shown at the end. */
  note?: string;
};

export const STORIES: Story[] = [
  {
    id: 'the-new-neighbour',
    title: 'The New Neighbour',
    amharicTitle: 'አዲሷ ጎረቤት',
    camp: 1,
    blurb: 'Dawit meets the woman who just moved in next door.',
    sentences: [
      {
        words: [['ዛሬ', 'zare', 'today'], ['አዲስ', 'addis', 'new'], ['ጎረቤት', 'gorebet', 'neighbour'], ['አለኝ', 'allegn', 'I have', '።']],
        transliteration: 'zare addis gorebet allegn.',
        english: 'Today I have a new neighbour.',
      },
      {
        words: [['ሰላም', 'selam', 'hello, hi', '!'], ['እላለሁ', 'ilalehu', 'I say', '።']],
        quote: [0, 0],
        transliteration: '“selam!” ilalehu.',
        english: '“Hello!” I say.',
      },
      {
        words: [['ሰላም', 'selam', 'hello, hi', '፣'], ['ስሜ', 'sime', 'my name'], ['ሳራ', 'Sara', 'Sara (a name)'], ['ነው', 'new', 'is'], ['ትላለች', 'tilalech', 'she says', '።']],
        quote: [0, 3],
        transliteration: '“selam, sime Sara new,” tilalech.',
        english: '“Hi, my name is Sara,” she says.',
      },
      {
        words: [['ስምህ', 'simih', 'your name (to a man)'], ['ማን', 'man', 'who, what (for names)'], ['ነው', 'new', 'is', '?']],
        quote: [0, 2],
        transliteration: '“simih man new?”',
        english: '“What’s your name?”',
      },
      {
        words: [['ስሜ', 'sime', 'my name'], ['ዳዊት', 'Dawit', 'Dawit (a name; David)'], ['ነው', 'new', 'is'], ['እላለሁ', 'ilalehu', 'I say', '።']],
        quote: [0, 2],
        transliteration: '“sime Dawit new,” ilalehu.',
        english: '“My name is Dawit,” I say.',
      },
      {
        words: [['ከየት', 'keyet', 'from where'], ['ነሽ', 'nesh', 'are you (to a woman)', '?']],
        quote: [0, 1],
        transliteration: '“keyet nesh?”',
        english: '“Where are you from?”',
      },
      {
        words: [['ከጎንደር', 'kegonder', 'from Gondar (ke- = from)'], ['ነኝ', 'negn', 'I am'], ['ትላለች', 'tilalech', 'she says', '።']],
        quote: [0, 1],
        transliteration: '“kegonder negn,” tilalech.',
        english: '“I’m from Gondar,” she says.',
      },
      {
        words: [['እንኳን', 'inkwan', 'part of “welcome” (word by word: “even”)'], ['ደህና', 'dehna', 'well, safely'], ['መጣሽ', 'metash', 'you came (to a woman)', '!']],
        quote: [0, 2],
        transliteration: '“inkwan dehna metash!”',
        english: '“Welcome!”',
      },
      {
        words: [['ሳራ', 'Sara', 'Sara'], ['ፈገግ', 'fegeg', 'part of “smile” (ፈገግ አለ = to smile)'], ['ትላለች', 'tilalech', 'she does, she says', '።']],
        transliteration: 'Sara fegeg tilalech.',
        english: 'Sara smiles.',
      },
      {
        words: [['አመሰግናለሁ', 'amesegnalehu', 'thank you', '።'], ['ደህና', 'dehna', 'well'], ['ሁን', 'hun', 'be (to a man)', '!']],
        quote: [0, 2],
        transliteration: '“amesegnalehu. dehna hun!”',
        english: '“Thank you. Goodbye!”',
      },
    ],
    note: 'Goodbye changes with who you’re talking to: ደህና ሁን to a man, ደህና ሁኚ to a woman, ደህና ሁኑ to a group or an elder. Word by word it means “be well.”',
  },
  {
    id: 'my-family',
    title: 'My Family',
    amharicTitle: 'ቤተሰቤ',
    camp: 2,
    blurb: 'Hanna introduces everyone in her house, from her tall father to her grandmother.',
    sentences: [
      {
        words: [['ስሜ', 'sime', 'my name'], ['ሐና', 'Hanna', 'Hanna (a name)'], ['ነው', 'new', 'is', '።']],
        transliteration: 'sime Hanna new.',
        english: 'My name is Hanna.',
      },
      {
        words: [['ይህ', 'yih', 'this'], ['ቤተሰቤ', 'betesebe', 'my family'], ['ነው', 'new', 'is', '።']],
        transliteration: 'yih betesebe new.',
        english: 'This is my family.',
      },
      {
        words: [['አባቴ', 'abate', 'my father'], ['ረጅም', 'rejim', 'tall'], ['ነው', 'new', 'is', '።']],
        transliteration: 'abate rejim new.',
        english: 'My father is tall.',
      },
      {
        words: [['እናቴ', 'inate', 'my mother'], ['በጣም', 'betam', 'very'], ['ደግ', 'deg', 'kind'], ['ናት', 'nat', 'is (for a woman)', '።']],
        transliteration: 'inate betam deg nat.',
        english: 'My mother is very kind.',
      },
      {
        words: [['ሁለት', 'hulet', 'two'], ['ወንድሞች', 'wendimoch', 'brothers'], ['አሉኝ', 'alugn', 'I have (more than one)', '።']],
        transliteration: 'hulet wendimoch alugn.',
        english: 'I have two brothers.',
      },
      {
        words: [['ወንድሞቼ', 'wendimoche', 'my brothers'], ['ተማሪዎች', 'temariwoch', 'students'], ['ናቸው', 'nachew', 'are (for a group)', '።']],
        transliteration: 'wendimoche temariwoch nachew.',
        english: 'My brothers are students.',
      },
      {
        words: [['አንድ', 'and', 'one'], ['እህት', 'ihit', 'sister'], ['አለችኝ', 'allechign', 'I have (a woman or girl)', '።']],
        transliteration: 'and ihit allechign.',
        english: 'I have one sister.',
      },
      {
        words: [['እህቴ', 'ihite', 'my sister'], ['አምስት', 'amist', 'five'], ['ዓመቷ', 'ametwa', 'her years (her age)'], ['ነው', 'new', 'is', '።']],
        transliteration: 'ihite amist ametwa new.',
        english: 'My sister is five years old.',
      },
      {
        words: [['አያቴም', 'ayatem', 'my grandmother too (-ም = too)'], ['ከእኛ', 'ke’igna', 'with us (ke- … ጋር = with)'], ['ጋር', 'gar', 'with'], ['ትኖራለች', 'tinoralech', 'she lives', '።']],
        transliteration: 'ayatem ke’igna gar tinoralech.',
        english: 'My grandmother lives with us too.',
      },
      {
        words: [['ቤታችን', 'betachin', 'our house'], ['ትንሽ', 'tinish', 'small'], ['ነው', 'new', 'is', '፣'], ['ግን', 'gin', 'but'], ['ደስተኞች', 'destegnoch', 'happy (for a group)'], ['ነን', 'nen', 'we are', '።']],
        transliteration: 'betachin tinish new, gin destegnoch nen.',
        english: 'Our house is small, but we are happy.',
      },
      {
        words: [['ቤተሰቤን', 'beteseben', 'my family (as the object)'], ['እወዳለሁ', 'iwedalehu', 'I love', '!']],
        transliteration: 'beteseben iwedalehu!',
        english: 'I love my family!',
      },
    ],
    note: 'Many Ethiopian homes have grandparents living with the family. Notice how “my” is an ending: አባት → አባቴ (my father), እህት → እህቴ (my sister).',
  },
  {
    id: 'coffee-at-grandmas',
    title: 'Coffee at Grandma’s',
    amharicTitle: 'ቡና በአያቴ ቤት',
    camp: 3,
    blurb: 'A Sunday visit, the smell of coffee, and popcorn on the side.',
    sentences: [
      {
        words: [['ዛሬ', 'zare', 'today'], ['እሁድ', 'ihud', 'Sunday'], ['ነው', 'new', 'is', '።']],
        transliteration: 'zare ihud new.',
        english: 'Today is Sunday.',
      },
      {
        words: [['ወደ', 'wede', 'to'], ['አያቴ', 'ayate', 'my grandmother'], ['ቤት', 'bet', 'house'], ['እሄዳለሁ', 'ihedalehu', 'I go, I’m going', '።']],
        transliteration: 'wede ayate bet ihedalehu.',
        english: 'I’m going to my grandmother’s house.',
      },
      {
        words: [['አያቴ', 'ayate', 'my grandmother'], ['በሩን', 'berun', 'the door'], ['ትከፍታለች', 'tikeftalech', 'she opens', '።']],
        transliteration: 'ayate berun tikeftalech.',
        english: 'My grandmother opens the door.',
      },
      {
        words: [['እንኳን', 'inkwan', 'part of “welcome” (word by word: “even”)'], ['ደህና', 'dehna', 'well, safely'], ['መጣህ', 'metah', 'you came (to a man)', '!'], ['ትላለች', 'tilalech', 'she says', '።']],
        quote: [0, 2],
        transliteration: '“inkwan dehna metah!” tilalech.',
        english: '“Welcome!” she says.',
      },
      {
        words: [['ቤቱ', 'betu', 'the house'], ['ውስጥ', 'wust', 'inside'], ['የቡና', 'yebuna', 'of coffee'], ['ሽታ', 'shita', 'smell'], ['አለ', 'alle', 'there is', '።']],
        transliteration: 'betu wust yebuna shita alle.',
        english: 'The house smells of coffee.',
      },
      {
        words: [['አያቴ', 'ayate', 'my grandmother'], ['ቡና', 'buna', 'coffee'], ['ታፈላለች', 'tafelalech', 'she brews (it)', '።']],
        transliteration: 'ayate buna tafelalech.',
        english: 'My grandmother brews coffee.',
      },
      {
        words: [['ከቡናው', 'kebunaw', 'with the coffee (ke- … ጋር = with)'], ['ጋር', 'gar', 'with'], ['ፋንዲሻ', 'fandisha', 'popcorn'], ['እንበላለን', 'inbelalen', 'we eat', '።']],
        transliteration: 'kebunaw gar fandisha inbelalen.',
        english: 'We eat popcorn with the coffee.',
      },
      {
        words: [['ቡናው', 'bunaw', 'the coffee'], ['በጣም', 'betam', 'very'], ['ጣፋጭ', 'tafach', 'delicious, sweet'], ['ነው', 'new', 'is', '!']],
        transliteration: 'bunaw betam tafach new!',
        english: 'The coffee is delicious!',
      },
      {
        words: [['አመሰግናለሁ', 'amesegnalehu', 'thank you', '፣'], ['አያቴ', 'ayate', 'my grandmother, Grandma', '!']],
        quote: [0, 1],
        transliteration: '“amesegnalehu, ayate!”',
        english: '“Thank you, Grandma!”',
      },
    ],
    note: 'Popcorn (ፋንዲሻ) is the classic snack at an Ethiopian coffee ceremony, and the host usually serves three rounds of coffee.',
  },
  {
    id: 'the-minibus',
    title: 'The Minibus',
    amharicTitle: 'ሚኒባሱ',
    camp: 4,
    blurb: 'Dawit is late, and the first minibus is going the wrong way.',
    sentences: [
      {
        words: [['ዳዊት', 'dawit', 'Dawit (a name)'], ['ዛሬ', 'zare', 'today'], ['አርፍዷል', 'arfidwal', 'he is late', '።']],
        transliteration: 'dawit zare arfidwal.',
        english: 'Dawit is late today.',
      },
      {
        words: [['ፈጥኖ', 'fetno', 'quickly'], ['ከቤት', 'kebet', 'from home'], ['ይወጣል', 'yiwetal', 'he goes out', '።']],
        transliteration: 'fetno kebet yiwetal.',
        english: 'He hurries out of the house.',
      },
      {
        words: [['ሚኒባስ', 'minibas', 'minibus'], ['ያያል', 'yayal', 'he sees', '።']],
        transliteration: 'minibas yayal.',
        english: 'He sees a minibus.',
      },
      {
        words: [['ወያላው', 'weyalaw', 'the minibus conductor'], ['ፒያሳ', 'piyasa', 'Piassa (a part of Addis)', '!'], ['ፒያሳ', 'piyasa', 'Piassa', '!'], ['ይላል', 'yilal', 'he says, he calls out', '።']],
        quote: [1, 2],
        transliteration: 'weyalaw “piyasa! piyasa!” yilal.',
        english: 'The conductor calls out, “Piassa! Piassa!”',
      },
      {
        words: [['ቦሌ', 'bole', 'Bole (a part of Addis)'], ['ትሄዳለህ', 'tihedaleh', 'do you go? (to a man)', '?']],
        quote: [0, 1],
        transliteration: '“bole tihedaleh?”',
        english: '“Are you going to Bole?”',
      },
      {
        words: [['አይ', 'ay', 'no', '፣'], ['ፒያሳ', 'piyasa', 'Piassa'], ['ብቻ', 'bicha', 'only', '።']],
        quote: [0, 2],
        transliteration: '“ay, piyasa bicha.”',
        english: '“No, only Piassa.”',
      },
      {
        words: [['ዳዊት', 'dawit', 'Dawit'], ['ሌላ', 'lela', 'another, other'], ['ሚኒባስ', 'minibas', 'minibus'], ['ይጠብቃል', 'yitebqal', 'he waits for', '።']],
        transliteration: 'dawit lela minibas yitebqal.',
        english: 'Dawit waits for another minibus.',
      },
      {
        words: [['በመጨረሻ', 'bemecheresha', 'finally, at last'], ['የቦሌ', 'yebole', 'Bole’s, for Bole'], ['ሚኒባስ', 'minibas', 'minibus'], ['መጣ', 'meta', 'came', '!']],
        transliteration: 'bemecheresha yebole minibas meta!',
        english: 'At last a minibus for Bole came!',
      },
    ],
    note: 'In Addis Ababa the ወያላ (minibus conductor) leans out of the door and calls out where the minibus is going, so you just listen for your stop.',
  },
  {
    id: 'at-the-market',
    title: 'At the Market',
    amharicTitle: 'ገበያ ላይ',
    camp: 3,
    blurb: 'Selam wants tomatoes, and a fair price.',
    sentences: [
      {
        words: [['ሰላም', 'selam', 'Selam (a name; it also means “peace”)'], ['ወደ', 'wede', 'to'], ['ገበያ', 'gebeya', 'market'], ['ትሄዳለች', 'tihedalech', 'she goes', '።']],
        transliteration: 'selam wede gebeya tihedalech.',
        english: 'Selam goes to the market.',
      },
      {
        words: [['ቲማቲም', 'timatim', 'tomatoes'], ['እና', 'ina', 'and'], ['ሽንኩርት', 'shinkurt', 'onions'], ['ትፈልጋለች', 'tifeligalech', 'she wants', '።']],
        transliteration: 'timatim ina shinkurt tifeligalech.',
        english: 'She wants tomatoes and onions.',
      },
      {
        words: [['ቲማቲም', 'timatim', 'tomatoes'], ['ስንት', 'sint', 'how much, how many'], ['ነው', 'new', 'is', '?']],
        quote: [0, 2],
        transliteration: '“timatim sint new?”',
        english: '“How much are the tomatoes?”',
      },
      {
        words: [['ነጋዴው', 'negadew', 'the seller'], ['አንድ', 'and', 'one'], ['ኪሎ', 'kilo', 'kilo'], ['ሰማንያ', 'semanya', 'eighty'], ['ብር', 'birr', 'birr (Ethiopian money)'], ['ይላል', 'yilal', 'he says', '።']],
        quote: [1, 4],
        transliteration: 'negadew “and kilo semanya birr” yilal.',
        english: 'The seller says, “Eighty birr a kilo.”',
      },
      {
        words: [['ውድ', 'wud', 'expensive'], ['ነው', 'new', 'is', '!'], ['ሰባ', 'seba', 'seventy'], ['ብር', 'birr', 'birr', '?']],
        quote: [0, 3],
        transliteration: '“wud new! seba birr?”',
        english: '“That’s expensive! Seventy birr?”',
      },
      {
        words: [['ነጋዴው', 'negadew', 'the seller'], ['ይስቃል', 'yisqal', 'he laughs', '።']],
        transliteration: 'negadew yisqal.',
        english: 'The seller laughs.',
      },
      {
        words: [['እሺ', 'ishi', 'okay', '፣'], ['ሰባ', 'seba', 'seventy'], ['አምስት', 'amist', 'five', '።']],
        quote: [0, 2],
        transliteration: '“ishi, seba amist.”',
        english: '“Okay, seventy-five.”',
      },
      {
        words: [['ሰላም', 'selam', 'Selam'], ['ሁለት', 'hulet', 'two'], ['ኪሎ', 'kilo', 'kilos'], ['ትገዛለች', 'tigezalech', 'she buys', '።']],
        transliteration: 'selam hulet kilo tigezalech.',
        english: 'Selam buys two kilos.',
      },
      {
        words: [['ደስ', 'des', 'glad (ደስ አለ = to be pleased)'], ['ብሏታል', 'bilwatal', 'she feels (it)', '!']],
        transliteration: 'des bilwatal!',
        english: 'She’s happy!',
      },
    ],
    note: 'Bargaining is normal at open-air markets in Ethiopia, and a smile and a bit of joking go a long way. Prices in this story are just an example.',
  },
  {
    id: 'a-call-from-mum',
    title: 'A Call from Mum',
    amharicTitle: 'የእናቴ ስልክ',
    camp: 5,
    blurb: 'At the end of the day, Mum calls to ask what you did.',
    sentences: [
      {
        words: [['ማታ', 'mata', 'in the evening'], ['ስልኬ', 'silke', 'my phone'], ['ይጮኻል', 'yichohal', 'it rings (word by word: it shouts)', '።']],
        transliteration: 'mata silke yichohal.',
        english: 'In the evening my phone rings.',
      },
      {
        words: [['እናቴ', 'inate', 'my mother'], ['ናት', 'nat', 'it is (for a woman)', '።']],
        transliteration: 'inate nat.',
        english: 'It’s my mother.',
      },
      {
        words: [['ሄሎ', 'helo', 'hello (on the phone)', '፣'], ['ልጄ', 'lije', 'my child', '!'], ['እንዴት', 'indet', 'how'], ['ነህ', 'neh', 'are you (to a man)', '?']],
        quote: [0, 3],
        transliteration: '“helo, lije! indet neh?”',
        english: '“Hello, my child! How are you?”',
      },
      {
        words: [['ደህና', 'dehna', 'well, fine'], ['ነኝ', 'negn', 'I am', '፣'], ['እማዬ', 'imaye', 'Mum (a loving way to say mother)', '።']],
        quote: [0, 2],
        transliteration: '“dehna negn, imaye.”',
        english: '“I’m fine, Mum.”',
      },
      {
        words: [['ዛሬ', 'zare', 'today'], ['ምን', 'min', 'what'], ['አደረግህ', 'aderegh', 'did you do (to a man)', '?'], ['ትላለች', 'tilalech', 'she asks, she says', '።']],
        quote: [0, 2],
        transliteration: '“zare min aderegh?” tilalech.',
        english: '“What did you do today?” she asks.',
      },
      {
        words: [['ጠዋት', 'tewat', 'in the morning'], ['ሥራ', 'sira', 'work'], ['ሄድኩ', 'hedku', 'I went', '።']],
        quote: [0, 2],
        transliteration: '“tewat sira hedku.”',
        english: '“In the morning I went to work.”',
      },
      {
        words: [['ከሰዓት', 'kese’at', 'in the afternoon (with በኋላ)'], ['በኋላ', 'behwala', 'after'], ['ከጓደኛዬ', 'kegwadegnaye', 'with my friend (ke- … ጋር = with)'], ['ጋር', 'gar', 'with'], ['ቡና', 'buna', 'coffee'], ['ጠጣሁ', 'tetahu', 'I drank', '።']],
        quote: [0, 5],
        transliteration: '“kese’at behwala kegwadegnaye gar buna tetahu.”',
        english: '“In the afternoon I had coffee with my friend.”',
      },
      {
        words: [['አሁን', 'ahun', 'now'], ['ትንሽ', 'tinish', 'a little'], ['ደክሞኛል', 'dekmognal', 'I’m tired', '።']],
        quote: [0, 2],
        transliteration: '“ahun tinish dekmognal.”',
        english: '“Now I’m a little tired.”',
      },
      {
        words: [['እሺ', 'ishi', 'okay'], ['ልጄ', 'lije', 'my child', '።'], ['ደህና', 'dehna', 'well'], ['እደር', 'ider', 'spend the night (to a man)', '!']],
        quote: [0, 3],
        transliteration: '“ishi lije. dehna ider!”',
        english: '“Okay, my child. Good night!”',
      },
      {
        words: [['ደህና', 'dehna', 'well'], ['እደሪ', 'ideri', 'spend the night (to a woman)', '፣'], ['እማዬ', 'imaye', 'Mum', '!']],
        quote: [0, 2],
        transliteration: '“dehna ideri, imaye!”',
        english: '“Good night, Mum!”',
      },
    ],
    note: 'Good night is ደህና እደር to a man, ደህና እደሪ to a woman and ደህና እደሩ to a group or an elder. Word by word it means “spend the night well.”',
  },
  {
    id: 'new-year',
    title: 'New Year',
    amharicTitle: 'እንቁጣጣሽ',
    camp: 6,
    blurb: 'Meskerem 1: yellow flowers, singing children and doro wot.',
    sentences: [
      {
        words: [['ዛሬ', 'zare', 'today'], ['መስከረም', 'meskerem', 'Meskerem (the first month)'], ['አንድ', 'and', 'one'], ['ነው', 'new', 'is', '።']],
        transliteration: 'zare meskerem and new.',
        english: 'Today is Meskerem 1.',
      },
      {
        words: [['የኢትዮጵያ', 'ye’ityopya', 'Ethiopia’s, Ethiopian'], ['አዲስ', 'addis', 'new'], ['ዓመት', 'amet', 'year'], ['ነው', 'new', 'is', '።']],
        transliteration: 'ye’ityopya addis amet new.',
        english: 'It’s the Ethiopian New Year.',
      },
      {
        words: [['ሜዳው', 'medaw', 'the field'], ['በቢጫ', 'bebicha', 'with yellow'], ['አበባ', 'abeba', 'flower(s)'], ['ተሞልቷል', 'temoltwal', 'it is full', '።']],
        transliteration: 'medaw bebicha abeba temoltwal.',
        english: 'The fields are full of yellow flowers.',
      },
      {
        words: [['ልጆች', 'lijoch', 'children'], ['በሩን', 'berun', 'the door'], ['ያንኳኳሉ', 'yankwakwalu', 'they knock (on)', '።']],
        transliteration: 'lijoch berun yankwakwalu.',
        english: 'Children knock on the door.',
      },
      {
        words: [['አበባዬ', 'abebaye', 'part of the New Year song (“my flower”)'], ['ሆሽ', 'hosh', 'part of the song'], ['ብለው', 'bilew', 'saying'], ['ይዘፍናሉ', 'yizefnalu', 'they sing', '።']],
        quote: [0, 1],
        transliteration: '“abebaye hosh” bilew yizefnalu.',
        english: 'They sing “Abebaye hosh.”',
      },
      {
        words: [['እናቴ', 'inate', 'my mother'], ['ዶሮ', 'doro', 'chicken'], ['ወጥ', 'wet', 'stew'], ['ትሠራለች', 'tiseralech', 'she makes', '።']],
        transliteration: 'inate doro wet tiseralech.',
        english: 'My mother makes doro wot.',
      },
      {
        words: [['ቤተሰቡ', 'betesebu', 'the family'], ['በሙሉ', 'bemulu', 'whole, all'], ['አብሮ', 'abro', 'together'], ['ይበላል', 'yibelal', 'eats', '።']],
        transliteration: 'betesebu bemulu abro yibelal.',
        english: 'The whole family eats together.',
      },
      {
        words: [['ጎረቤታችን', 'gorebetachin', 'our neighbour'], ['እንኳን', 'inkwan', 'part of the holiday wish'], ['አደረሰህ', 'aderesih', 'brought you to it (to a man)', '!'], ['ይላል', 'yilal', 'he says', '።']],
        quote: [0, 2],
        transliteration: 'gorebetachin “inkwan aderesih!” yilal.',
        english: 'Our neighbour says “Happy holiday!”',
      },
      {
        words: [['እንኳን', 'inkwan', 'part of the holiday wish'], ['አብሮ', 'abro', 'together'], ['አደረሰን', 'aderesen', 'brought us to it', '!'], ['እላለሁ', 'ilalehu', 'I say', '።']],
        quote: [0, 2],
        transliteration: '“inkwan abro aderesen!” ilalehu.',
        english: 'I say “And to us all, together!”',
      },
      {
        words: [['መልካም', 'melkam', 'good, happy'], ['አዲስ', 'addis', 'new'], ['ዓመት', 'amet', 'year', '!']],
        transliteration: 'melkam addis amet!',
        english: 'Happy New Year!',
      },
    ],
    note: 'Enkutatash falls on Meskerem 1, usually 11 September, right after the rainy season, when the yellow Meskel daisies (አደይ አበባ) cover the hills. Children go door to door singing and get bread or a few birr.',
  },
];

/** The whole sentence as written, with its quote marks and punctuation. */
export function sentenceText(s: StorySentence): string {
  return s.words.map((w, i) => wordText(s, i)).join(' ');
}

/** One word as shown, with its punctuation and any quote mark. */
export function wordText(s: StorySentence, i: number): string {
  const [am, , , after = ''] = s.words[i];
  const open = s.quote?.[0] === i ? '“' : '';
  const close = s.quote?.[1] === i ? '”' : '';
  return `${open}${am}${after}${close}`;
}

/** The sentence Walia reads aloud: no quote marks. */
export function sentenceAudio(s: StorySentence): string {
  return s.words.map(w => w[0] + (w[3] ?? '')).join(' ');
}

/** Every distinct word in a story. */
export function storyWords(story: Story): string[] {
  return [...new Set(story.sentences.flatMap(s => s.words.map(w => w[0])))];
}

/** Lines and words for the audio list in lib/amharicAudio.ts. */
export function storyLines(): string[] {
  return STORIES.flatMap(story => [...story.sentences.map(sentenceAudio), ...storyWords(story)]);
}
