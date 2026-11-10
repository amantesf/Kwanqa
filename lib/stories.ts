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
