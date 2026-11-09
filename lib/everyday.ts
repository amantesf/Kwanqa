// Everyday Amharic: the things textbooks skip.
// - Small words: the little endings, linking words and exclamations that make
//   speech sound natural (ደክሞኛል እኮ! "I'm tired, you know!").
// - Read it: Amharic as it's really written around you (a minibus call, a café
//   menu, signs, a text message, a holiday card), to read before you check.
//
// Shared by the website (/everyday) and the phone app (Explore). A native
// speaker should check every example.

export type Example = { amharic: string; transliteration: string; english: string };

export type SmallWord = {
  word: string;
  roman: string;
  /** What it adds, in a few words. */
  meaning: string;
  /** How and when it's used. */
  how: string;
  examples: Example[];
};

export type WordGroup = { title: string; intro: string; words: SmallWord[] };

export const SMALL_WORDS: WordGroup[] = [
  {
    title: 'Little endings',
    intro: 'These stick onto the end of a word and change the feeling of the whole sentence.',
    words: [
      {
        word: '-ኮ / እኮ',
        roman: '-ko / ikko',
        meaning: 'you know!, really',
        how: 'Adds emphasis, often with a little impatience or surprise: you’re pointing out something the other person should know.',
        examples: [
          { amharic: 'ደክሞኛል እኮ!', transliteration: 'dekmognal ikko!', english: 'I’m tired, you know!' },
          { amharic: 'ነገርኩህ እኮ!', transliteration: 'negerkuh ikko!', english: 'I told you! (to a man)' },
        ],
      },
      {
        word: '-ማ',
        roman: '-ma',
        meaning: 'as for…, of course',
        how: 'Puts the spotlight on one word, often in contrast to someone or something else.',
        examples: [
          { amharic: 'እኔማ አልሄድም።', transliteration: 'inema alhedim.', english: 'Me, I’m not going.' },
          { amharic: 'እሱማ ይመጣል።', transliteration: 'isuma yimetal.', english: 'Oh, he’ll come, for sure.' },
        ],
      },
      {
        word: '-ስ',
        roman: '-s',
        meaning: 'and what about…?',
        how: 'Turns a word into a question back to someone, or asks about the next thing.',
        examples: [
          { amharic: 'አንተስ?', transliteration: 'antes?', english: 'And you? (to a man)' },
          { amharic: 'ቡናስ?', transliteration: 'bunas?', english: 'And the coffee?' },
        ],
      },
      {
        word: '-ም',
        roman: '-m',
        meaning: 'too, also',
        how: 'Means “too” after a word. In a list it can mean “both … and”.',
        examples: [
          { amharic: 'እኔም!', transliteration: 'inem!', english: 'Me too!' },
          { amharic: 'ደክሞኛል፣ ርቦኛልም።', transliteration: 'dekmognal, rabognalim.', english: 'I’m tired, and hungry too.' },
        ],
      },
    ],
  },
  {
    title: 'Linking words',
    intro: 'Short words that hold a conversation together, the way “so”, “well” and “I mean” do in English.',
    words: [
      {
        word: 'በቃ',
        roman: 'beqa',
        meaning: 'okay then, that’s it, enough',
        how: 'Settles something: agreeing, ending a discussion, or saying “that’s enough”.',
        examples: [
          { amharic: 'በቃ፣ እንሂድ።', transliteration: 'beqa, inhid.', english: 'Okay then, let’s go.' },
          { amharic: 'በቃኝ!', transliteration: 'beqagn!', english: 'That’s enough for me!' },
        ],
      },
      {
        word: 'እንግዲህ',
        roman: 'ingidih',
        meaning: 'well then, so',
        how: 'Moves things along, or sums up: “well, there you go”.',
        examples: [{ amharic: 'እንግዲህ ደህና ሁን።', transliteration: 'ingidih dehna hun.', english: 'Well then, goodbye. (to a man)' }],
      },
      {
        word: 'ታዲያ',
        roman: 'tadiya',
        meaning: 'so?, then',
        how: 'Asks what follows from something, sometimes with a shrug.',
        examples: [
          { amharic: 'ታዲያ ምን ይሻላል?', transliteration: 'tadiya min yishalal?', english: 'So what’s best, then?' },
          { amharic: 'ታዲያ ምን ይጠበስ?', transliteration: 'tadiya min yitebes?', english: 'So what? (literally “so what should be roasted?”)' },
        ],
      },
      {
        word: 'ደግሞ',
        roman: 'degmo',
        meaning: 'also, again, and on top of that',
        how: 'Adds one more thing, or shows mild surprise that something has happened again.',
        examples: [{ amharic: 'ደግሞ ምን ሆነ?', transliteration: 'degmo min hone?', english: 'Now what happened?' }],
      },
      {
        word: 'ማለት',
        roman: 'malet',
        meaning: 'I mean, that is',
        how: 'Explains or corrects yourself. It’s also how you ask what something means.',
        examples: [
          { amharic: 'ምን ማለት ነው?', transliteration: 'min malet new?', english: 'What does it mean?' },
          { amharic: 'ነገ፣ ማለት ቅዳሜ።', transliteration: 'nege, malet qidame.', english: 'Tomorrow, I mean Saturday.' },
        ],
      },
      {
        word: 'እስኪ',
        roman: 'iski',
        meaning: 'let’s see, come on',
        how: 'Softens a request or invites someone to try.',
        examples: [
          { amharic: 'እስኪ ልየው።', transliteration: 'iski liyew.', english: 'Let me see it.' },
          { amharic: 'እስኪ ንገረኝ።', transliteration: 'iski negerign.', english: 'Come on, tell me. (to a man)' },
        ],
      },
    ],
  },
  {
    title: 'Exclamations',
    intro: 'One-word reactions you’ll hear all day.',
    words: [
      {
        word: 'ወይኔ!',
        roman: 'weyne!',
        meaning: 'oh no!, oh my!',
        how: 'For bad news, a small disaster, or sympathy.',
        examples: [{ amharic: 'ወይኔ! ስልኬን ረሳሁት።', transliteration: 'weyne! silken resahut.', english: 'Oh no! I forgot my phone.' }],
      },
      {
        word: 'እሰይ!',
        roman: 'isey!',
        meaning: 'hooray!, great!',
        how: 'For good news.',
        examples: [{ amharic: 'እሰይ! አለፍኩ!', transliteration: 'isey! alefku!', english: 'Hooray! I passed!' }],
      },
      {
        word: 'እንዴ!',
        roman: 'inde!',
        meaning: 'what?!, really?!',
        how: 'Surprise, sometimes disbelief.',
        examples: [{ amharic: 'እንዴ! አንተ ነህ እንዴ?', transliteration: 'inde! ante neh inde?', english: 'What! Is that you?' }],
      },
      {
        word: 'አቦ',
        roman: 'abo',
        meaning: 'come on!, ugh',
        how: 'Casual impatience among friends. Not one to use with elders.',
        examples: [{ amharic: 'አቦ ቶሎ በል!', transliteration: 'abo tolo bel!', english: 'Come on, hurry up! (to a man)' }],
      },
    ],
  },
];

/** A piece of real-world Amharic: a sign, a menu, a message. */
export type ReadingScene = {
  id: string;
  title: string;
  /** Where you'd see it. */
  context: string;
  /** How it looks: a street sign, a printed menu, a phone message, a card. */
  look: 'sign' | 'menu' | 'message' | 'card';
  lines: Example[];
  tip?: string;
};

export const READING: ReadingScene[] = [
  {
    id: 'taxi',
    title: 'Where is this minibus going?',
    context: 'The conductor (ረዳት) leans out of the window and shouts the stops. Often there’s a sign in the window too.',
    look: 'sign',
    lines: [
      { amharic: 'ፒያሳ', transliteration: 'Piassa', english: 'Piassa (the old city centre)' },
      { amharic: 'መገናኛ', transliteration: 'Megenagna', english: 'Megenagna (“meeting place”, a big junction)' },
      { amharic: 'ቦሌ', transliteration: 'Bole', english: 'Bole (near the airport)' },
      { amharic: 'መርካቶ', transliteration: 'Merkato', english: 'Merkato (the huge open market)' },
    ],
    tip: 'መገናኛ comes from the same verb as እንገናኝ (let’s meet): it’s where the roads meet.',
  },
  {
    id: 'cafe',
    title: 'A café menu',
    context: 'The board behind the counter in any Addis café.',
    look: 'menu',
    lines: [
      { amharic: 'ቡና', transliteration: 'buna', english: 'coffee' },
      { amharic: 'ማኪያቶ', transliteration: 'makiyato', english: 'macchiato' },
      { amharic: 'ሻይ', transliteration: 'shay', english: 'tea' },
      { amharic: 'ወተት', transliteration: 'wetet', english: 'milk' },
      { amharic: 'ጭማቂ', transliteration: 'chimaqi', english: 'fresh juice' },
      { amharic: 'ኬክ', transliteration: 'keik', english: 'cake' },
    ],
    tip: 'ማኪያቶ is one of many Italian words in Amharic, from the 1930s. Ethiopian macchiatos are famous.',
  },
  {
    id: 'restaurant',
    title: 'A restaurant menu',
    context: 'The dishes you’ll see at almost every Ethiopian restaurant.',
    look: 'menu',
    lines: [
      { amharic: 'ሽሮ', transliteration: 'shiro', english: 'chickpea stew' },
      { amharic: 'ዶሮ ወጥ', transliteration: 'doro wet', english: 'chicken stew (a holiday favourite)' },
      { amharic: 'ጥብስ', transliteration: 'tibs', english: 'pan-fried meat' },
      { amharic: 'ክትፎ', transliteration: 'kitfo', english: 'minced beef with spiced butter' },
      { amharic: 'በየዓይነቱ', transliteration: 'beyaynetu', english: 'a fasting platter with “a bit of each kind”' },
    ],
    tip: 'በየዓይነቱ is በ- + የ- + ዓይነት (kind) + -ኡ: “of each kind”. It’s the vegan platter on fasting days.',
  },
  {
    id: 'signs',
    title: 'Signs around town',
    context: 'On doors, in hotels, at the bank.',
    look: 'sign',
    lines: [
      { amharic: 'መግቢያ', transliteration: 'megbiya', english: 'Entrance' },
      { amharic: 'መውጫ', transliteration: 'mewcha', english: 'Exit' },
      { amharic: 'ክፍት ነው', transliteration: 'kift new', english: 'Open' },
      { amharic: 'ዝግ ነው', transliteration: 'zig new', english: 'Closed' },
      { amharic: 'መጸዳጃ ቤት', transliteration: 'metsedaja bet', english: 'Toilet' },
      { amharic: 'ማጨስ ክልክል ነው', transliteration: 'machses kilkil new', english: 'No smoking' },
    ],
    tip: 'መግቢያ (entrance) and መውጫ (exit) are both a place-to-do-it: ገባ (entered) and ወጣ (went out), with መ- … -ያ.',
  },
  {
    id: 'message',
    title: 'A text from a friend',
    context: 'Messages are short, and often mix in a little English.',
    look: 'message',
    lines: [
      { amharic: 'ሰላም! የት ነህ?', transliteration: 'selam! yet neh?', english: 'Hi! Where are you? (to a man)' },
      { amharic: 'መንገድ ላይ ነኝ።', transliteration: 'menged lay negn.', english: 'I’m on the way.' },
      { amharic: 'ደርሻለሁ።', transliteration: 'dershalehu.', english: 'I’ve arrived.' },
      { amharic: 'ስትደርስ ደውልልኝ።', transliteration: 'sitders dewililign.', english: 'Call me when you get here. (to a man)' },
    ],
  },
  {
    id: 'card',
    title: 'A holiday card',
    context: 'The wishes printed on cards and posted on social media at holidays.',
    look: 'card',
    lines: [
      { amharic: 'መልካም አዲስ ዓመት!', transliteration: 'melkam addis amet!', english: 'Happy New Year!' },
      { amharic: 'እንኳን ለገና በዓል በሰላም አደረሳችሁ!', transliteration: 'inkwan legenna beal beselam aderesachihu!', english: 'Merry Christmas! (glad you reached Genna in peace)' },
      { amharic: 'መልካም በዓል!', transliteration: 'melkam beal!', english: 'Happy holiday!' },
    ],
    tip: 'Swap the holiday’s name in: እንኳን ለመስቀል በዓል… for Meskel, እንኳን ለፋሲካ በዓል… for Easter.',
  },
];
