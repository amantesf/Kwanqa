// How Amharic works, in small pieces, for the Amharic course:
// - Grammar cards ("How it works"): one rule, a small table and examples from
//   the lesson, shown on the lesson page after its phrases.
// - Word breakdowns: tap a word in a phrase to see the pieces it's built from
//   (ስምህ = səmm-əh, name-your), so a phrase becomes a pattern you can reuse.
// - Word families: Amharic builds words from a few shared consonants (a root),
//   so ገባኝ "I understand", ግባ "come in" and መግቢያ "entrance" are all "enter".
//
// Shared by the website and the phone app. Everything here should be checked
// by a native speaker before it goes out: a wrong rule teaches a wrong habit.

import type { LessonSection } from '@/lib/courses';

export type GrammarCard = {
  title: string;
  /** The rule, in a sentence or two of plain English. */
  rule: string;
  /** A small pattern table: the first row is the header. */
  table?: string[][];
  /** Lines from the lesson that show the rule. */
  examples: { amharic: string; transliteration: string; english: string }[];
  /** An extra hint, e.g. how it connects to an earlier lesson. */
  tip?: string;
};

/** Words built from the same consonants, shown in the lesson where one of them first comes up. */
export type WordFamily = {
  /** The plain past “he …” form the family is named after. */
  word: string;
  roman: string;
  meaning: string;
  /** The consonants the words share. */
  root: string;
  members: { amharic: string; transliteration: string; english: string }[];
  tip?: string;
};

/** One piece of a word: how it's said and what it adds. */
export type WordPart = { roman: string; gloss: string };

/** Grammar cards by lesson: "<course slug>:<lesson index>". */
const CARDS: Record<string, GrammarCard[]> = {
  // Camp 1, Lesson 1: Greetings
  'amharic-beginner-1:0': [
    {
      title: 'Talking to a man or a woman',
      rule: 'Amharic has two words for “you”: one for a man and one for a woman. The little word that goes with it changes too, so you hear it all through the sentence.',
      table: [
        ['', 'to a man', 'to a woman'],
        ['you', 'አንተ ante', 'አንቺ anchi'],
        ['you are', 'ነህ neh', 'ነሽ nesh'],
        ['how are you?', 'እንዴት ነህ? endet neh?', 'እንዴት ነሽ? endet nesh?'],
      ],
      examples: [
        { amharic: 'ሰላም እንዴት ነህ?', transliteration: 'selam, endet neh?', english: 'Hello, how are you? (to a man)' },
        { amharic: 'ሰላም እንዴት ነሽ?', transliteration: 'selam, endet nesh?', english: 'Hello, how are you? (to a woman)' },
      ],
      tip: 'Add -ስ (-s) to ask “and you?” back: አንተስ? (antes?) to a man, አንቺስ? (anchis?) to a woman.',
    },
  ],
  // Camp 1, Lesson 3: Thank You & Sorry
  'amharic-beginner-1:2': [
    {
      title: 'Asking someone to do something',
      rule: 'When you ask one person to do something, the verb changes for a man or a woman. For a woman it usually ends in an -i sound.',
      table: [
        ['', 'to a man', 'to a woman'],
        ['forgive me', 'ይቅርታ አድርግልኝ yiqirta adrigilliñ', 'ይቅርታ አድርጊልኝ yiqirta adrigiilliñ'],
        ['come in', 'ግባ giba', 'ግቢ gibi'],
        ['sit down', 'ተቀመጥ teqemet', 'ተቀመጪ teqemechi'],
      ],
      examples: [
        { amharic: 'ይቅርታ አድርግልኝ', transliteration: 'yiqirta adrigilliñ', english: 'Please forgive me (to a man)' },
        { amharic: 'ይቅርታ አድርጊልኝ', transliteration: 'yiqirta adrigiilliñ', english: 'Please forgive me (to a woman)' },
      ],
      tip: 'አመሰግናለሁ (amesegenallo) is a verb too: “I thank (you)”. The -ለሁ (-allo) at the end means “I”, now.',
    },
  ],
  // Camp 1, Lesson 4: Yes, No & Simple Answers
  'amharic-beginner-1:3': [
    {
      title: 'Saying “not”: al- … -m wraps around the verb',
      rule: 'To make a verb negative, Amharic puts አል- (al-) in front and -ም (-m) at the end. It wraps around the verb like a sandwich.',
      table: [
        ['', 'yes', 'not'],
        ['I understand', 'ገባኝ gebagn', 'አልገባኝም algebagnim'],
        ['I know', 'አውቃለሁ awqalehu', 'አላውቅም alawqim'],
        ['it is', 'ነው new', 'አይደለም aydelem'],
      ],
      examples: [
        { amharic: 'አላውቅም', transliteration: 'alawqim', english: 'I don’t know' },
        { amharic: 'አልገባኝም', transliteration: 'algebagnim', english: 'I don’t understand' },
      ],
      tip: 'ገባኝ (gebagn) literally means “it entered me”. When something makes sense, it has gone in!',
    },
    {
      title: 'Who is doing it: pieces at the front and the back',
      rule: 'An Amharic verb shows who is doing it with a piece at the front and one at the back. You can often leave out “I” and “you” because the verb already says it.',
      table: [
        ['', 'speak(s)'],
        ['I', 'እናገራለሁ inageralehu'],
        ['you (man)', 'ትናገራለህ tinageraleh'],
        ['you (woman)', 'ትናገሪያለሽ tinageriyalesh'],
        ['he', 'ይናገራል yinageral'],
        ['she', 'ትናገራለች tinageralech'],
      ],
      examples: [
        { amharic: 'አማርኛ ትናገራለህ ወይ?', transliteration: 'amarigna tinageraleh wey?', english: 'Do you speak Amharic? (to a man)' },
        { amharic: 'ትንሽ ትንሽ እናገራለሁ።', transliteration: 'tinish tinish inageralehu.', english: 'I speak a little bit.' },
      ],
    },
  ],
  // Camp 1, Lesson 5: Goodbye & See You
  'amharic-beginner-1:4': [
    {
      title: 'One man, one woman, or a group',
      rule: 'Goodbyes are little commands (“be well!”), so they end differently for a man, a woman, or a group. A group ending (-u) is also the polite one for elders.',
      table: [
        ['', 'man', 'woman', 'group'],
        ['stay well', 'ሁን hun', 'ሁኚ hunyi', 'ሁኑ hunu'],
        ['good night', 'እደር ider', 'እደሪ ideri', 'እደሩ ideru'],
      ],
      examples: [
        { amharic: 'ደህና ሁን', transliteration: 'dehna hun', english: 'Goodbye (to a man)' },
        { amharic: 'ደህና ሁኑ', transliteration: 'dehna hunu', english: 'Goodbye (to a group, or politely)' },
      ],
    },
    {
      title: '“Let’s”: እን- in front',
      rule: 'Put እን- (in-) in front of a verb to say “let’s” or “we will”.',
      table: [
        ['', ''],
        ['let’s meet', 'እንገናኝ inigenagn'],
        ['let’s go', 'እንሂድ inhid'],
        ['let’s eat', 'እንብላ inbila'],
      ],
      examples: [
        { amharic: 'ነገ እንገናኝ', transliteration: 'nege inigenagn', english: 'See you tomorrow (let’s meet tomorrow)' },
        { amharic: 'በኋላ እንገናኝ', transliteration: 'behwala inigenagn', english: 'See you later' },
      ],
    },
  ],
  // Camp 1, Lesson 6: Talking to Elders
  'amharic-beginner-1:5': [
    {
      title: 'Respect changes the endings',
      rule: 'With elders, teachers and people you don’t know, use እርስዎ (ərswo). The endings change with it: -ህ / -ሽ become -ዎ (-wo), and commands take a polite form.',
      table: [
        ['', 'man', 'woman', 'elder'],
        ['you', 'አንተ ante', 'አንቺ anchi', 'እርስዎ ərswo'],
        ['your name', 'ስምህ səmməh', 'ስምሽ səmməsh', 'ስምዎ səmwo'],
        ['please', 'እባክህ əbbakih', 'እባክሽ əbbakish', 'እባክዎ əbakwo'],
        ['sit down', 'ተቀመጥ teqemet', 'ተቀመጪ teqemechi', 'ይቀመጡ yiqemetu'],
      ],
      examples: [
        { amharic: 'ስምዎ ማን ነው?', transliteration: 'səmwo man new?', english: 'What is your name? (to an elder)' },
        { amharic: 'ጤናዎ እንዴት ነው?', transliteration: 'tenawo endet new?', english: 'How is your health? (to an elder)' },
      ],
      tip: 'እንደምን አደሩ? (əndemin aderu?) literally asks “how did you spend the night?”. It’s the respectful good morning.',
    },
  ],
  // Camp 1, Lesson 2: Introducing Yourself
  'amharic-beginner-1:1': [
    {
      title: 'My and your go on the end of the word',
      rule: 'Amharic has no separate words for “my” and “your”. It adds an ending to the noun. “Your” has one form for a man and another for a woman.',
      table: [
        ['', 'ስም səm (name)', 'ቤት bet (house)'],
        ['my', 'ስሜ səme', 'ቤቴ bete'],
        ['your (man)', 'ስምህ səmməh', 'ቤትህ betəh'],
        ['your (woman)', 'ስምሽ səmməsh', 'ቤትሽ betəsh'],
        ['his', 'ስሙ səmu', 'ቤቱ betu'],
        ['her', 'ስሟ səmwa', 'ቤቷ betwa'],
      ],
      examples: [
        { amharic: 'ስሜ ዳዊት ነው።', transliteration: 'səme Dawit new.', english: 'My name is Dawit.' },
        { amharic: 'ስምሽ ማን ነው?', transliteration: 'səmməsh man new?', english: 'What is your name? (to a woman)' },
      ],
    },
    {
      title: '“Is” and “am” come last',
      rule: 'Amharic puts the verb at the end of the sentence. “My name Dawit is.” “From America I-am.” The word for “is / am” changes with who it’s about.',
      table: [
        ['', 'is / am / are'],
        ['I am', 'ነኝ neñ'],
        ['you are (man)', 'ነህ neh'],
        ['you are (woman)', 'ነሽ nesh'],
        ['he / it is', 'ነው new'],
        ['she is', 'ናት nat'],
        ['we are', 'ነን nen'],
      ],
      examples: [
        { amharic: 'ከአሜሪካ ነኝ።', transliteration: 'kə Amerika neñ.', english: 'I am from America.' },
        { amharic: 'ስምህ ማን ነው?', transliteration: 'səmməh man new?', english: 'What is your name? (to a man)' },
      ],
      tip: 'You met ነህ and ነሽ in Lesson 1: እንዴት ነህ? is “how are you?” to a man. And ከ- (kə-, “from”) joins the front of the place: ከአሜሪካ.',
    },
  ],
  // Camp 2, Lesson 1: Numbers & Counting
  'amharic-beginner-2:0': [
    {
      title: 'Counting things: the noun stays as it is',
      rule: 'Put the number before the thing. After a number, Amharic usually keeps the noun singular: “two coffee”, not “two coffees”.',
      table: [
        ['', ''],
        ['one coffee', 'አንድ ቡና and buna'],
        ['two coffees', 'ሁለት ቡና hulet buna'],
        ['three people', 'ሦስት ሰው sost sew'],
      ],
      examples: [
        { amharic: 'ከአንድ እስከ አስር', transliteration: 'ke-and iska asir', english: 'from one to ten' },
      ],
      tip: 'ከ- (ke-) means “from” and እስከ (iska) means “until”: ከአንድ እስከ አስር is “from one to ten”.',
    },
  ],
  // Camp 2, Lesson 2: Family & People
  'amharic-beginner-2:1': [
    {
      title: '“My” on family words',
      rule: 'Add -e for “my”, as with ስሜ (my name). When the word already ends in a vowel, “my” becomes -ዬ (-ye).',
      table: [
        ['', 'word', 'my …'],
        ['father', 'አባት abat', 'አባቴ abate'],
        ['mother', 'እናት ənnat', 'እናቴ ənnate'],
        ['sister', 'እህት əht', 'እህቴ əhte'],
        ['brother', 'ወንድም wəndim', 'ወንድሜ wəndime'],
        ['friend', 'ጓደኛ gwadenya', 'ጓደኛዬ gwadenyaye'],
      ],
      examples: [
        { amharic: 'ቤተሰቦችህ እንዴት ናቸው?', transliteration: 'betesebotchih endet nachəw?', english: 'How is your family?' },
      ],
      tip: 'ቤተሰቦችህ packs three pieces: ቤተሰብ (family) + -ኦች (plural) + -ህ (your). ናቸው (nachəw) is “they are”.',
    },
  ],
  // Camp 2, Lesson 3: Everyday Expressions
  'amharic-beginner-2:2': [
    {
      title: '“Have”: there is, to me',
      rule: 'Amharic says “have” as “there is, to me”: the word አለ (alle, there is) plus an ending for who has it.',
      table: [
        ['', 'have'],
        ['I have', 'አለኝ alleñ'],
        ['you have (man)', 'አለህ alleh'],
        ['you have (woman)', 'አለሽ allesh'],
        ['he has', 'አለው allew'],
        ['she has', 'አላት allat'],
      ],
      examples: [
        { amharic: 'ጊዜ አለህ?', transliteration: 'gize alleh?', english: 'Do you have time? (to a man)' },
        { amharic: 'ጊዜ አለሽ?', transliteration: 'gize allesh?', english: 'Do you have time? (to a woman)' },
      ],
      tip: 'አልችልም (alchilim, “I can’t”) is the al- … -m “not” sandwich again, around ችል (can).',
    },
  ],
  // Camp 2, Lesson 4: Bigger Numbers & Prices
  'amharic-beginner-2:3': [
    {
      title: 'Building bigger numbers',
      rule: 'The teens are አስራ (asra) + a number. The tens have their own words, and you add the ones after them. Hundreds are a number + መቶ (meto).',
      table: [
        ['', ''],
        ['15', 'አስራ አምስት asra amist'],
        ['20 · 40', 'ሃያ haya · አርባ arba'],
        ['25', 'ሃያ አምስት haya amist'],
        ['60 · 80', 'ስልሳ silsa · ሰማንያ semanya'],
        ['200', 'ሁለት መቶ hulet meto'],
      ],
      examples: [
        { amharic: 'ይሄ ስንት ነው?', transliteration: 'yihe sint new?', english: 'How much is this?' },
      ],
      tip: 'ስንት (sint) means both “how much” and “how many”.',
    },
  ],
  // Camp 2, Lesson 5: Describing People
  'amharic-beginner-2:4': [
    {
      title: 'Describing: before the noun, or with “is” at the end',
      rule: 'A describing word goes before the noun (“a tall person”). To say someone “is” tall, put ነው (is) or ናት (she is) at the end.',
      table: [
        ['', ''],
        ['a tall person', 'ረጅም ሰው rejim sew'],
        ['he is tall', 'ረጅም ነው rejim new'],
        ['she is beautiful', 'ቆንጆ ናት qonjo nat'],
        ['they are kind', 'ደግ ናቸው deg nachew'],
      ],
      examples: [
        { amharic: 'ወንድምህ ምን ይመስላል?', transliteration: 'wendimih min yimeslal?', english: 'What is your brother like? (to a man)' },
      ],
    },
  ],
  // Camp 3, Lesson 1: The Coffee Ceremony
  'amharic-beginner-3:0': [
    {
      title: 'Inviting everyone: the -u ending',
      rule: 'ቡና ጠጡ is a command to a group, which is also the polite way to invite anyone. Like ሁኑ (stay well), the group form ends in -u.',
      table: [
        ['', 'man', 'woman', 'group / polite'],
        ['drink!', 'ጠጣ teta', 'ጠጪ techi', 'ጠጡ tetu'],
        ['eat!', 'ብላ bila', 'ብዪ biyi', 'ብሉ bilu'],
      ],
      examples: [{ amharic: 'ቡና ጠጡ!', transliteration: 'buna tetu!', english: 'Come have coffee!' }],
    },
  ],
  // Camp 3, Lesson 2: Ordering Food
  'amharic-beginner-3:1': [
    {
      title: 'The thing first, the verb last',
      rule: 'Amharic puts the verb at the end, so “I want water” is “water I-want”. Change the verb’s pieces to ask someone else.',
      table: [
        ['', ''],
        ['I want water', 'ውሃ እፈልጋለሁ wiha ifeligalehu'],
        ['I don’t want meat', 'ስጋ አልፈልግም siga alfeligim'],
        ['what would you like? (polite)', 'ምን ይፈልጋሉ? min yifeligalu?'],
      ],
      examples: [{ amharic: 'ምን ይፈልጋሉ?', transliteration: 'min yifeligalu?', english: 'What would you like? (polite)' }],
    },
    {
      title: '“Of”: የ- in front',
      rule: 'Put የ- (ye-) in front of a word to mean “of” or “-’s”. The word with የ- comes first.',
      table: [
        ['', ''],
        ['fasting food', 'የጾም ምግብ ye-tsom migib'],
        ['Ethiopian coffee', 'የኢትዮጵያ ቡና ye-Ityopya buna'],
        ['Dawit’s house', 'የዳዊት ቤት ye-Dawit bet'],
      ],
      examples: [{ amharic: 'የጾም ምግብ', transliteration: 'ye-tsom migib', english: 'fasting food (food of fasting)' }],
    },
  ],
  // Camp 3, Lesson 3: Tastes
  'amharic-beginner-3:2': [
    {
      title: '“The” goes on the end',
      rule: 'Amharic adds “the” as an ending: -u after a consonant, -w after a vowel. (The same -u also means “his”, so context tells you which.)',
      table: [
        ['', 'a …', 'the …'],
        ['stew', 'ወጥ wet', 'ወጡ wetu'],
        ['coffee', 'ቡና buna', 'ቡናው bunaw'],
        ['house', 'ቤት bet', 'ቤቱ betu'],
      ],
      examples: [{ amharic: 'ወጡ እንዴት ነው?', transliteration: 'wetu indet new?', english: 'How is the stew?' }],
    },
    {
      title: '“It” verbs: ይ- … -ል',
      rule: 'When “it” or “he” does something now, the verb starts with ይ- (yi-) or ያ- (ya-) and ends in -ል (-l). “Not” turns ያ- into አያ- and adds -ም.',
      table: [
        ['', ''],
        ['it’s delicious', 'ይጣፍጣል yitafital'],
        ['it’s spicy (it burns)', 'ያቃጥላል yaqatilal'],
        ['it’s not spicy', 'አያቃጥልም ayaqatilim'],
      ],
      examples: [{ amharic: 'ይጣፍጣል', transliteration: 'yitafital', english: 'It’s delicious' }],
    },
  ],
  // Camp 3, Lesson 4: At the Market
  'amharic-beginner-3:3': [
    {
      title: 'This and that',
      rule: '“This” and “that” change for a man or a woman, or anything thought of that way. Most things use the first form.',
      table: [
        ['', 'most things', 'feminine'],
        ['this', 'ይሄ yihe', 'ይቺ yichi'],
        ['that', 'ያ ya', 'ያቺ yachi'],
      ],
      examples: [{ amharic: 'ይሄ ስንት ነው?', transliteration: 'yihe sint new?', english: 'How much is this?' }],
      tip: 'ቀንስልኝ (qenisilign) is “lower it for me” to a man: ቀንስ (lower) + -ልኝ (for me). To a woman: ቀንሺልኝ (qenshilign).',
    },
  ],
  // Camp 3, Lesson 5: Being a Guest
  'amharic-beginner-3:4': [
    {
      title: 'The past: endings only at the back',
      rule: 'The present tense has pieces at both ends (እናገራለሁ). The past tense only adds an ending at the back.',
      table: [
        ['', 'came', 'got full'],
        ['I', 'መጣሁ metahu', 'ጠገብኩ tegebku'],
        ['you (man)', 'መጣህ metah', 'ጠገብክ tegebk'],
        ['you (woman)', 'መጣሽ metash', 'ጠገብሽ tegebsh'],
        ['he', 'መጣ meta', 'ጠገበ tegebe'],
        ['she', 'መጣች metach', 'ጠገበች tegebech'],
      ],
      examples: [
        { amharic: 'እንኳን ደህና መጣህ', transliteration: 'inkwan dehna metah', english: 'Welcome (to a man): literally “good that you came well”' },
        { amharic: 'ጠገብኩ', transliteration: 'tegebku', english: 'I’m full (I got full)' },
      ],
    },
  ],
  // Camp 4, Lesson 1: Directions
  'amharic-beginner-4:0': [
    {
      title: 'Asking “where”: the question word goes before the verb',
      rule: 'Amharic doesn’t move the question word to the front. It sits where the answer would go, right before ነው: “the hotel where is?”',
      table: [
        ['', ''],
        ['where is the hotel?', 'ሆቴሉ የት ነው? hotelu yet new?'],
        ['where is the bank?', 'ባንኩ የት ነው? banku yet new?'],
        ['what is this?', 'ይሄ ምንድን ነው? yihe mindin new?'],
      ],
      examples: [{ amharic: 'ይቅርታ፣ ሆቴሉ የት ነው?', transliteration: 'yiqirta, hotelu yet new?', english: 'Excuse me, where is the hotel?' }],
    },
    {
      title: 'To and from: ወደ and ከ',
      rule: 'ወደ (wede) means “to, toward” and is a separate word. ከ- (ke-) means “from” and joins the front of the word.',
      table: [
        ['', ''],
        ['to the right', 'ወደ ቀኝ wede qegn'],
        ['to Piassa', 'ወደ ፒያሳ wede Piassa'],
        ['from there (then)', 'ከዚያ keziya'],
        ['from home', 'ከቤት kebet'],
      ],
      examples: [{ amharic: 'ቀጥታ ሂድ፣ ከዚያ ወደ ቀኝ።', transliteration: 'qetita hid, keziya wede qegn.', english: 'Go straight, then turn right.' }],
    },
  ],
  // Camp 4, Lesson 2: Taxi & Bajaj
  'amharic-beginner-4:1': [
    {
      title: '“I’m going”: one verb, every person',
      rule: 'The same pieces you saw with “speak” work for “go”: who at the front, “now” at the back.',
      table: [
        ['', 'go(es)'],
        ['I', 'እሄዳለሁ ihedalehu'],
        ['you (man)', 'ትሄዳለህ tihedaleh'],
        ['you (woman)', 'ትሄጃለሽ tihejalesh'],
        ['he', 'ይሄዳል yihedal'],
        ['she', 'ትሄዳለች tihedalech'],
      ],
      examples: [{ amharic: 'ወደ ፒያሳ እሄዳለሁ', transliteration: 'wede Piassa ihedalehu', english: 'I’m going to Piassa' }],
      tip: 'Spot ትሄጃለሽ: talking to a woman often softens the last sound of the verb, here ድ (d) to ጅ (j). Camp 5, Lesson 3 shows the whole pattern.',
    },
  ],
  // Camp 4, Lesson 3: Telling Time
  'amharic-beginner-4:2': [
    {
      title: 'Ethiopian time starts at sunrise',
      rule: 'Hours are counted from about 6 a.m., so the number is six off from Western time. Say the number, then ሰዓት (se’at, hour).',
      table: [
        ['', 'Ethiopian', 'Western'],
        ['one o’clock', 'አንድ ሰዓት and se’at', '7:00'],
        ['three o’clock', 'ሦስት ሰዓት sost se’at', '9:00'],
        ['six o’clock', 'ስድስት ሰዓት sidist se’at', '12:00 noon'],
        ['twelve o’clock', 'አስራ ሁለት ሰዓት asra hulet se’at', '6:00'],
      ],
      examples: [{ amharic: 'ሦስት ሰዓት ነው።', transliteration: 'sost se’at new.', english: 'It’s three o’clock (9 a.m.)' }],
      tip: 'ከሰዓት (kese’at, afternoon) is ከ- (from) + ሰዓት: the time “from the hour” of noon on.',
    },
  ],
  // Camp 4, Lesson 4: Days of the Week
  'amharic-beginner-4:3': [
    {
      title: 'In, on, at, by: በ- in front',
      rule: 'በ- (be-) joins the front of a word to mean “in”, “on”, “at” or “by”, the way ከ- means “from”.',
      table: [
        ['', ''],
        ['on Friday', 'በዓርብ be-arb'],
        ['in the morning', 'በጠዋት be-tewat'],
        ['by taxi', 'በታክሲ be-taksi'],
        ['in Ethiopia', 'በኢትዮጵያ be-Ityopya'],
      ],
      examples: [{ amharic: 'ዛሬ ምን ቀን ነው?', transliteration: 'zare min qen new?', english: 'What day is it today?' }],
    },
  ],
  // Camp 4, Lesson 5: Places in Town
  'amharic-beginner-4:4': [
    {
      title: 'Places are “houses”: … ቤት',
      rule: 'Many places are a word + ቤት (bet, house). Learn ቤት once and you can guess the rest.',
      table: [
        ['', ''],
        ['school (learning house)', 'ትምህርት ቤት timhirt bet'],
        ['restaurant (food house)', 'ምግብ ቤት migib bet'],
        ['kitchen (stew house)', 'ወጥ ቤት wet bet'],
        ['bedroom (sleeping house)', 'መኝታ ቤት megnita bet'],
        ['church', 'ቤተ ክርስቲያን bete kristiyan'],
      ],
      examples: [{ amharic: 'ወደ ትምህርት ቤት እሄዳለሁ።', transliteration: 'wede timhirt bet ihedalehu.', english: 'I’m going to school.' }],
    },
  ],
  // Camp 5, Lesson 1: My Day
  'amharic-beginner-5:0': [
    {
      title: 'The past for everyone',
      rule: 'Past-tense verbs change only their ending. “I” is -ሁ (-hu) after a vowel and -ኩ (-ku) after a consonant: በላሁ, ሄድኩ.',
      table: [
        ['', 'ate', 'went'],
        ['I', 'በላሁ belahu', 'ሄድኩ hedku'],
        ['you (man)', 'በላህ belah', 'ሄድክ hedk'],
        ['you (woman)', 'በላሽ belash', 'ሄድሽ hedsh'],
        ['he', 'በላ bela', 'ሄደ hede'],
        ['she', 'በላች belach', 'ሄደች hedech'],
        ['we', 'በላን belan', 'ሄድን hedin'],
      ],
      examples: [
        { amharic: 'ዛሬ ምን አደረግህ?', transliteration: 'zare min aderegih?', english: 'What did you do today? (to a man)' },
        { amharic: 'ቁርስ በላሁ፣ ወደ ሥራ ሄድኩ።', transliteration: 'qurs belahu, wede sira hedku.', english: 'I ate breakfast and went to work.' },
      ],
    },
  ],
  // Camp 5, Lesson 2: Feelings
  'amharic-beginner-5:1': [
    {
      title: 'Feelings that “have got” you',
      rule: 'Amharic says feelings happen to you: “tiredness has got me”. The ending says who: -ኛል (me), -ሃል (you, man), -ሻል (you, woman).',
      table: [
        ['', 'tired'],
        ['I am', 'ደክሞኛል dekmognal'],
        ['you are (man)', 'ደክሞሃል dekmohal'],
        ['you are (woman)', 'ደክሞሻል dekmoshal'],
        ['he is', 'ደክሞታል dekmotal'],
        ['she is', 'ደክሟታል dekmwatal'],
      ],
      examples: [{ amharic: 'ደክሞኛል፣ ርቦኛልም።', transliteration: 'dekmognal, rabognalim.', english: 'I’m tired, and hungry too.' }],
      tip: 'The -ም (-m) on ርቦኛልም means “too, also”.',
    },
  ],
  // Camp 5, Lesson 3: Likes & Dislikes
  'amharic-beginner-5:2': [
    {
      title: 'Talking to a woman softens the sound',
      rule: 'When a verb takes the woman’s -i, the consonant before it often softens: d → j, t → ch, s → sh, l → y, n → ñ. You’ve already met most of these.',
      table: [
        ['', 'to a man', 'to a woman'],
        ['d → j: you like', 'ትወዳለህ tiwedaleh', 'ትወጃለሽ tiwejalesh'],
        ['t → ch: sit!', 'ተቀመጥ teqemet', 'ተቀመጪ teqemechi'],
        ['s → sh: lower it for me', 'ቀንስልኝ qenisilign', 'ቀንሺልኝ qenshilign'],
        ['l → y: eat!', 'ብላ bila', 'ብዪ biyi'],
        ['n → ñ: be well', 'ሁን hun', 'ሁኚ hunyi'],
      ],
      examples: [
        { amharic: 'ኳስ ትወዳለህ?', transliteration: 'kwas tiwedaleh?', english: 'Do you like football? (to a man)' },
        { amharic: 'ሙዚቃ ትወጃለሽ?', transliteration: 'muziqa tiwejalesh?', english: 'Do you like music? (to a woman)' },
      ],
    },
  ],
  // Camp 5, Lesson 4: At Home
  'amharic-beginner-5:3': [
    {
      title: 'On and in come after the noun',
      rule: 'Where English says “on the table”, Amharic says “table on”: the place word ላይ (on) or ውስጥ (in) comes after. Often በ- goes in front too.',
      table: [
        ['', ''],
        ['on the table', '(በ)ጠረጴዛ ላይ (be)terepeza lay'],
        ['in the room', '(በ)ክፍል ውስጥ (be)kifil wist'],
        ['on the road', 'መንገድ ላይ menged lay'],
      ],
      examples: [{ amharic: 'እማማ የት ናት? ወጥ ቤት ናት።', transliteration: 'imama yet nat? wet bet nat.', english: 'Where is Mom? She’s in the kitchen.' }],
    },
  ],
  // Camp 5, Lesson 5: Phone Talk
  'amharic-beginner-5:4': [
    {
      title: '“I do” is also “I will”',
      rule: 'The present tense also covers the future: እደውላለሁ is “I call” and “I’ll call”. Words like በኋላ (later) or ነገ (tomorrow) make it clear.',
      table: [
        ['', ''],
        ['I’ll call', 'እደውላለሁ idewilalehu'],
        ['I’ll come', 'እመጣለሁ imetalehu'],
        ['I’ll wait', 'እቆያለሁ iqoyalehu'],
      ],
      examples: [{ amharic: 'መንገድ ላይ ነኝ፣ በኋላ እደውላለሁ።', transliteration: 'menged lay negn, behwala idewilalehu.', english: 'I’m on the road. I’ll call later.' }],
    },
  ],
  // Camp 6, Lesson 1: Speaking to Elders
  'amharic-beginner-6:0': [
    {
      title: 'Polite requests: “may you…”',
      rule: 'Asking an elder politely uses a “may you…” form: ይ- (yi-) or ያ- (ya-) in front and -u at the end. The same shape gives blessings: “may God…”.',
      table: [
        ['', 'to a man', 'polite'],
        ['sit down', 'ተቀመጥ teqemet', 'ይቀመጡ yiqemetu'],
        ['come in', 'ግባ giba', 'ይግቡ yigbu'],
        ['forgive me', 'ይቅርታ አድርግልኝ yiqirta adrigilliñ', 'ይቅርታ ያድርጉልኝ yiqirta yadirgulign'],
      ],
      examples: [{ amharic: 'እግዚአብሔር ይስጥልኝ', transliteration: 'igziabher yistilign', english: 'Thank you (formal): may God give it to you for me' }],
      tip: 'ጋሼ (gashe) and እትዬ (itiye) are warm, respectful ways to address an older man or woman.',
    },
  ],
  // Camp 6, Lesson 2: Holidays
  'amharic-beginner-6:1': [
    {
      title: 'Double consonants change the word',
      rule: 'Amharic can hold a consonant twice as long, and that can change the meaning. The ፊደል doesn’t show it, so listen closely.',
      table: [
        ['', 'short', 'doubled'],
        ['ገና', 'gena: still, yet', 'genna: Christmas'],
        ['ዋና', 'wana: swimming', 'wanna: main'],
        ['አለ', 'ale: he said', 'alle: there is'],
      ],
      examples: [{ amharic: 'ጥምቀት መቼ ነው?', transliteration: 'timket meche new?', english: 'When is Timket?' }],
      tip: 'Dates say the month, then the day: ጥር አስራ አንድ (Tir 11).',
    },
  ],
  // Camp 6, Lesson 3: Blessings & Wishes
  'amharic-beginner-6:2': [
    {
      title: 'One blessing, four endings',
      rule: 'እንኳን አደረሰ- means “good that (God) brought … to it”. The ending says who you’re blessing.',
      table: [
        ['', 'happy holiday'],
        ['to a man', 'እንኳን አደረሰህ inkwan adereseh'],
        ['to a woman', 'እንኳን አደረሰሽ inkwan aderesesh'],
        ['to a group', 'እንኳን አደረሳችሁ inkwan aderesachihu'],
        ['to us all (the reply)', 'እንኳን አብሮ አደረሰን inkwan abiro aderesen'],
      ],
      examples: [{ amharic: 'እንኳን ደስ አለህ', transliteration: 'inkwan des aleh', english: 'Congratulations (to a man)' }],
    },
  ],
  // Camp 6, Lesson 4: The Ethiopian Calendar
  'amharic-beginner-6:3': [
    {
      title: 'More than one: -ኦች and -ዎች',
      rule: 'Most nouns add -ኦች (-och) for “more than one”, or -ዎች (-woch) after a vowel. A few old words have their own plural, like ወራት (months).',
      table: [
        ['', 'one', 'more'],
        ['house', 'ቤት bet', 'ቤቶች betoch'],
        ['cup', 'ስኒ sini', 'ስኒዎች siniwoch'],
        ['month', 'ወር wer', 'ወራት werat'],
        ['day', 'ቀን qen', 'ቀናት qenat'],
      ],
      examples: [{ amharic: 'ዛሬ ስንት ነው?', transliteration: 'zare sint new?', english: 'What’s the date today?' }],
    },
  ],
  // Camp 6, Lesson 5: Proverbs
  'amharic-beginner-6:4': [
    {
      title: '“If” and “once”: ቢ- and ከ-',
      rule: 'Proverbs love these two. ቢ- (bi-) in front of a verb means “if”. ከ- (ke-) in front of a past verb means “once” or “after”.',
      table: [
        ['', ''],
        ['if (they) unite', 'ቢያብር biyabir'],
        ['if you (man) come', 'ብትመጣ bitimeta'],
        ['once it had gone', 'ከሄደ kehede'],
        ['once you (man) eat', 'ከበላህ kebelah'],
      ],
      examples: [
        { amharic: 'ድር ቢያብር አንበሳ ያስር', transliteration: 'dir biyabir anbesa yasir', english: 'When spider webs unite, they can tie up a lion.' },
        { amharic: 'ጅብ ከሄደ ውሻ ጮኸ', transliteration: 'jib kehede wusha chohe', english: 'The dog barked after the hyena left.' },
      ],
      tip: 'ለ- (le-) means “to, for”: ሰው ለሰው is “person to person”.',
    },
  ],
  // Camp 7, Lesson 1: The Months: Meskerem to Yekatit
  'amharic-beginner-7:0': [
    {
      title: '“Which” and “in which”',
      rule: 'የትኛው (yetignaw) means “which”. Put በ- in front for “in which”, and in front of a month for “in” that month.',
      table: [
        ['', ''],
        ['which month?', 'የትኛው ወር? yetignaw wer?'],
        ['in which month?', 'በየትኛው ወር? beyetignaw wer?'],
        ['in Meskerem', 'በመስከረም bemeskerem'],
        ['and Genna?', 'ገናስ? gennas?'],
      ],
      examples: [{ amharic: 'መስቀል በየትኛው ወር ነው?', transliteration: 'meskel beyetignaw wer new?', english: 'Which month is Meskel in?' }],
    },
  ],
  // Camp 7, Lesson 2: The Months: Megabit to Pagume
  'amharic-beginner-7:1': [
    {
      title: 'There is, there are, there isn’t',
      rule: 'አለ (alle) is “there is”; for more than one it’s አሉ (alu). The “not” forms start with የ- instead: የለም, የሉም.',
      table: [
        ['', 'yes', 'not'],
        ['one thing', 'አለ alle', 'የለም yellem'],
        ['many things', 'አሉ alu', 'የሉም yellum'],
      ],
      examples: [{ amharic: 'ስንት ወራት አሉ?', transliteration: 'sint werat alu?', english: 'How many months are there?' }],
      tip: 'የለም (yellem) also works on its own as “no, there isn’t any”.',
    },
  ],
  // Camp 7, Lesson 3: Last Week & Next Week
  'amharic-beginner-7:2': [
    {
      title: 'Last and next: “the one that passed”, “the one that follows”',
      rule: 'Amharic builds “last” and “next” from verbs: ባለፈው is “in the one that passed”, and በሚቀጥለው is “in the one that follows”.',
      table: [
        ['', 'last', 'next'],
        ['week', 'ባለፈው ሳምንት balefew samint', 'በሚቀጥለው ሳምንት bemiqetilew samint'],
        ['month', 'ባለፈው ወር balefew wer', 'በሚቀጥለው ወር bemiqetilew wer'],
        ['year', 'ባለፈው ዓመት balefew amet', 'በሚቀጥለው ዓመት bemiqetilew amet'],
      ],
      examples: [{ amharic: 'ከነገ ወዲያ እመጣለሁ', transliteration: 'kenege wediya imetalehu', english: 'I’ll come the day after tomorrow (beyond tomorrow).' }],
    },
  ],
  // Camp 7, Lesson 4: Dates & Birthdays
  'amharic-beginner-7:3': [
    {
      title: 'Mine, yours: የ- + who',
      rule: 'For “mine”, “yours” and so on, put የ- (of) in front of the word for the person.',
      table: [
        ['', ''],
        ['mine', 'የእኔ ye’ine'],
        ['yours (man)', 'ያንተ yante'],
        ['yours (woman)', 'ያንቺ yanchi'],
        ['his', 'የእሱ ye’isu'],
        ['hers', 'የእሷ ye’iswa'],
      ],
      examples: [
        { amharic: 'ልደትሽ መቼ ነው?', transliteration: 'lidetish meche new?', english: 'When is your birthday? (to a woman)' },
        { amharic: 'የእኔ ግንቦት አምስት ነው።', transliteration: 'ye’ine ginbot amist new.', english: 'Mine is Ginbot 5.' },
      ],
    },
  ],
  // Camp 7, Lesson 5: Ethiopian Time
  'amharic-beginner-7:4': [
    {
      title: 'In the morning, the day, the evening',
      rule: 'Say which part of the day with ከ- (from) + the part + -ኡ (the): ከጠዋቱ is “of the morning”. Then the hour.',
      table: [
        ['', '', 'Western'],
        ['morning', 'ከጠዋቱ አንድ ሰዓት ketewatu and se’at', '7 a.m.'],
        ['day', 'ከቀኑ ሰባት ሰዓት keqenu sebat se’at', '1 p.m.'],
        ['evening', 'ከምሽቱ አንድ ሰዓት kemshitu and se’at', '7 p.m.'],
        ['night', 'ከሌሊቱ ስድስት ሰዓት kelelitu sidist se’at', 'midnight'],
      ],
      examples: [{ amharic: 'ሁለት ሰዓት ተኩል', transliteration: 'hulet se’at tekul', english: '8:30 a.m. (half past two)' }],
      tip: 'ተኩል (tekul) after the hour means “and a half”.',
    },
  ],
  // Camp 8, Lesson 1: Who, What, Why?
  'amharic-beginner-8:0': [
    {
      title: 'All the question words',
      rule: 'Question words sit near the end, just before the verb: ስምህ ማን ነው? is “your name who is?”.',
      table: [
        ['', ''],
        ['who', 'ማን man'],
        ['what', 'ምን min'],
        ['when', 'መቼ meche'],
        ['where', 'የት yet'],
        ['why (for what)', 'ለምን lemin'],
        ['how', 'እንዴት indet'],
        ['how many / much', 'ስንት sint'],
        ['which', 'የትኛው yetignaw'],
      ],
      examples: [{ amharic: 'ይህ ምንድን ነው?', transliteration: 'yih mindin new?', english: 'What is this?' }],
      tip: 'ለምን (why) is ለ- (for) + ምን (what): “for what?”.',
    },
  ],
  // Camp 8, Lesson 2: The Whole Family
  'amharic-beginner-8:1': [
    {
      title: '“With”: ከ … ጋር',
      rule: 'To say “with”, put ከ- in front of the person and ጋር (gar) after. Join two people with -ና (-na, and).',
      table: [
        ['', ''],
        ['with my uncle', 'ከአጎቴ ጋር ke’agote gar'],
        ['with his wife', 'ከባለቤቱ ጋር kebalebetu gar'],
        ['with the children', 'ከልጆቹ ጋር kelijochu gar'],
        ['with his wife and children', 'ከባለቤቱና ከልጆቹ ጋር kebalebetuna kelijochu gar'],
      ],
      examples: [{ amharic: 'አጎቴ ነው። ከባለቤቱና ከልጆቹ ጋር።', transliteration: 'agote new. kebalebetuna kelijochu gar.', english: 'That’s my uncle, with his wife and children.' }],
      tip: 'Pieces stack in order: ልጆቼ is ልጅ (child) + -ኦች (plural) + -ኤ (my).',
    },
  ],
  // Camp 8, Lesson 3: I Missed You!
  'amharic-beginner-8:2': [
    {
      title: 'One verb, two people',
      rule: 'An Amharic verb can carry both who does it and who it happens to. ናፍቀኸኛል is “you (man) have made me long”: -ኸ is you, -ኝ is me.',
      table: [
        ['', 'I missed you'],
        ['to a man', 'ናፍቀኸኛል nafqehegnal'],
        ['to a woman', 'ናፍቀሽኛል nafqeshignal'],
        ['to an elder', 'ናፍቀውኛል nafqewignal'],
      ],
      examples: [
        { amharic: 'እኔም ናፍቀሽኛል!', transliteration: 'ineme nafqeshignal!', english: 'I missed you too!' },
        { amharic: 'መቼ ደረስክ?', transliteration: 'meche deresk?', english: 'When did you arrive? (to a man)' },
      ],
      tip: '-ም (-m) after a word means “too”: እኔም is “me too”.',
    },
  ],
  // Camp 8, Lesson 4: How's the Weather?
  'amharic-beginner-8:3': [
    {
      title: 'Happening right now: እየ- … ነው',
      rule: 'For something happening at this moment, put እየ- (iye-) in front of the verb and ነው after it.',
      table: [
        ['', ''],
        ['it’s raining', 'እየዘነበ ነው iyezenebe new'],
        ['I’m eating', 'እየበላሁ ነው iyebelahu new'],
        ['he’s coming', 'እየመጣ ነው iyemeta new'],
        ['we’re going', 'እየሄድን ነው iyehedin new'],
      ],
      examples: [{ amharic: 'ዝናብ እየዘነበ ነው።', transliteration: 'zinab iyezenebe new.', english: 'It’s raining (rain is raining).' }],
    },
  ],
  // Camp 8, Lesson 5: Feeling Better?
  'amharic-beginner-8:4': [
    {
      title: '-ን: the thing a verb acts on',
      rule: 'When a verb acts on a definite thing (“the …”, “my …”), that thing ends in -ን (-n). For pain, say the body part with “my” and -ን, then ያመኛል (it hurts me).',
      table: [
        ['', ''],
        ['my head hurts', 'ራሴን ያመኛል rasen yamegnal'],
        ['my stomach hurts', 'ሆዴን ያመኛል hoden yamegnal'],
        ['your head hurts (man)', 'ራስህን ያምሃል rasihin yamihal'],
        ['I drank the coffee', 'ቡናውን ጠጣሁ bunawn tetahu'],
      ],
      examples: [{ amharic: 'ትንሽ ተሽሎኛል፣ ግን ራሴን ያመኛል።', transliteration: 'tinish teshlognal, gin rasen yamegnal.', english: 'I’m a little better, but my head hurts.' }],
      tip: 'Just “coffee” in general has no -ን: ቡና እፈልጋለሁ (I want coffee). “The coffee” does: ቡናውን ጠጣሁ.',
    },
  ],
  // Camp 9, Lesson 1: Clothes & Colours
  'amharic-beginner-9:0': [
    {
      title: '“Shall I…?” and “let me”: ል- in front',
      rule: 'Put ል- (li-) or ላ- (la-) in front of a verb to say “let me” or ask “shall I?”. Add -ው (-w) for “it”.',
      table: [
        ['', ''],
        ['shall I try it on?', 'ልለካው? lilekaw?'],
        ['may I come in?', 'ልግባ? ligba?'],
        ['what shall I bring you? (man)', 'ምን ላምጣልህ? min lamtalih?'],
      ],
      examples: [{ amharic: 'ይህን ቀሚስ ልለካው?', transliteration: 'yihin qemis lilekaw?', english: 'Can I try on this dress?' }],
      tip: 'ሰማያዊ (blue) is ሰማይ (sky) + -ዊ: “sky-coloured”. The -ን on ይህን marks “this” as the thing being tried on.',
    },
  ],
  // Camp 9, Lesson 2: At the Shop
  'amharic-beginner-9:1': [
    {
      title: '“I can”: to-do + እችላለሁ',
      rule: 'Say what you can do with the “to …” form of the verb (it starts with መ-, me-) followed by “I can”.',
      table: [
        ['', ''],
        ['I can pay', 'መክፈል እችላለሁ mekfel ichilalehu'],
        ['I can’t come', 'መምጣት አልችልም memtat alchilim'],
        ['can you help? (man)', 'መርዳት ትችላለህ? merdat tichilaleh?'],
      ],
      examples: [{ amharic: 'በካርድ መክፈል እችላለሁ?', transliteration: 'bekard mekfel ichilalehu?', english: 'Can I pay by card?' }],
      tip: 'Asking a shop if it has something is just “is there …?”: ዳቦ አለ? The answer is አለ or የለም.',
    },
  ],
  // Camp 9, Lesson 3: At the Pharmacy
  'amharic-beginner-9:2': [
    {
      title: 'Before and after: ከ … በፊት, ከ … በኋላ',
      rule: 'Wrap the thing with ከ- in front and በፊት (before) or በኋላ (after) behind it.',
      table: [
        ['', ''],
        ['before meals', 'ከምግብ በፊት kemigib befit'],
        ['after meals', 'ከምግብ በኋላ kemigib behuala'],
        ['after work', 'ከሥራ በኋላ kesira behuala'],
      ],
      examples: [{ amharic: 'ከምግብ በፊት ወይስ በኋላ?', transliteration: 'kemigib befit weys behuala?', english: 'Before or after meals?' }],
      tip: 'ለ- (le-) means “for”: ለራስ ምታት is “for a headache”. ወይስ (weys) is “or” in a question.',
    },
  ],
  // Camp 9, Lesson 4: At the Clinic
  'amharic-beginner-9:3': [
    {
      title: 'Since: ከ … ጀምሮ',
      rule: '“Since” is ከ- (from) + the time + ጀምሮ (jemiro, starting): “starting from yesterday”.',
      table: [
        ['', ''],
        ['since when?', 'ከመቼ ጀምሮ? kemeche jemiro?'],
        ['since yesterday', 'ከትናንት ጀምሮ ketinant jemiro'],
        ['since Monday', 'ከሰኞ ጀምሮ kesegno jemiro'],
      ],
      examples: [
        { amharic: 'ምን ያምሃል?', transliteration: 'min yamihal?', english: 'What hurts? (to a man)' },
        { amharic: 'እግሬን ያመኛል።', transliteration: 'igren yamegnal.', english: 'My leg hurts.' },
      ],
    },
  ],
  // Camp 9, Lesson 5: Visiting Someone Who's Sick
  'amharic-beginner-9:4': [
    {
      title: 'Because: ስለ-',
      rule: 'ስለ- (sile-) in front of a past verb means “because”. In front of a noun it means “about”.',
      table: [
        ['', ''],
        ['because you came (man)', 'ስለመጣህ silemetah'],
        ['because you came (woman)', 'ስለመጣሽ silemetash'],
        ['about Ethiopia', 'ስለ ኢትዮጵያ sile Ityopya'],
      ],
      examples: [{ amharic: 'ስለመጣህ አመሰግናለሁ', transliteration: 'silemetah ameseginalehu', english: 'Thank you for coming (because you came)' }],
      tip: 'ልጠይቅህ መጣሁ uses ል- again: “I came so that I could ask after you”.',
    },
  ],
  // Camp 10, Lesson 1: A Wedding
  'amharic-beginner-10:0': [
    {
      title: '“You all”: -ችሁ',
      rule: 'Talking to a couple or a group, “you” becomes -ችሁ (-chihu) at the end. Weddings use it everywhere, because you’re greeting two people.',
      table: [
        ['', 'congratulations', 'God bless you'],
        ['a man', 'ደስ አለህ des aleh', 'ይባርክህ yibarkih'],
        ['a woman', 'ደስ አለሽ des alesh', 'ይባርክሽ yibarkish'],
        ['a couple, a group', 'ደስ አላችሁ des alachihu', 'ይባርካችሁ yibarkachihu'],
      ],
      examples: [{ amharic: 'እንኳን ደስ አላችሁ!', transliteration: 'inkwan des alachihu!', english: 'Congratulations to you both!' }],
      tip: '“Let’s” and “we will” differ only at the end: እንጨፍር (let’s dance), እንጨፍራለን (we’ll dance).',
    },
  ],
  // Camp 10, Lesson 2: A New Baby
  'amharic-beginner-10:1': [
    {
      title: 'His and her',
      rule: '“His” is -ኡ (-u) and “her” is -ዋ (-wa), on the end of the word, just like “my” and “your”.',
      table: [
        ['', 'his', 'her'],
        ['name', 'ስሙ simu', 'ስሟ simwa'],
        ['child', 'ልጁ liju', 'ልጇ lijwa'],
        ['house', 'ቤቱ betu', 'ቤቷ betwa'],
      ],
      examples: [
        { amharic: 'ስሟ ማን ነው?', transliteration: 'simwa man new?', english: 'What’s her name?' },
        { amharic: 'ወንድ ነው ወይስ ሴት?', transliteration: 'wend new weys set?', english: 'Is it a boy or a girl?' },
      ],
    },
  ],
  // Camp 10, Lesson 3: Comforting a Grieving Family
  'amharic-beginner-10:2': [
    {
      title: 'Wishes: “may God…”',
      rule: 'A blessing uses the “may” form of the verb: no -ል (-al) at the end. Compare ይባርካል (he blesses) with ይባርክ (may he bless).',
      table: [
        ['', ''],
        ['may God comfort you all', 'እግዚአብሔር ያጽናችሁ igziabher yatsnachihu'],
        ['may (God) have mercy on the soul', 'ነፍስ ይማር nefs yimar'],
        ['may God bless you all', 'እግዚአብሔር ይባርካችሁ igziabher yibarkachihu'],
        ['may God raise (the child) for you', 'እግዚአብሔር ያሳድግላችሁ igziabher yasadgilachihu'],
      ],
      examples: [{ amharic: 'በጣም አዝናለሁ። ነፍስ ይማር።', transliteration: 'betam aznalehu. nefs yimar.', english: 'I’m so sorry. May his soul rest in peace.' }],
    },
  ],
  // Camp 10, Lesson 4: Fasting & Feasting
  'amharic-beginner-10:3': [
    {
      title: '-ኛ: a person who… and a language',
      rule: 'Adding -ኛ (-gna) to a word can make “a person who does it”. The same ending names languages.',
      table: [
        ['', ''],
        ['someone fasting', 'ጾመኛ tsomegna (from ጾም, fast)'],
        ['a patient', 'በሽተኛ beshtegna (from በሽታ, illness)'],
        ['Amharic', 'አማርኛ amarigna'],
        ['Afaan Oromo', 'ኦሮምኛ oromigna'],
        ['English', 'እንግሊዝኛ inglizigna'],
      ],
      examples: [{ amharic: 'ዛሬ ረቡዕ ነው፤ ጾመኛ ነኝ።', transliteration: 'zare rebu new; tsomegna negn.', english: 'Today is Wednesday; I’m fasting.' }],
    },
  ],
  // Camp 10, Lesson 5: Everyday Blessings
  'amharic-beginner-10:4': [
    {
      title: 'Good wishes end with the person',
      rule: 'Everyday wishes are “may” forms too, so they end with who you’re wishing well: -ህ for a man, -ሽ for a woman, -ችሁ for a group.',
      table: [
        ['', 'man', 'woman', 'group'],
        ['good luck', 'ይቅናህ yiqnah', 'ይቅናሽ yiqnash', 'ይቅናችሁ yiqnachihu'],
        ['get home safely', 'በሰላም ግባ beselam giba', 'በሰላም ግቢ beselam gibi', 'በሰላም ግቡ beselam gibu'],
      ],
      examples: [{ amharic: 'እግዚአብሔር ቢፈቅድ፣ በሚቀጥለው ክረምት።', transliteration: 'igziabher bifeqid, bemiqetilew kiremt.', english: 'God willing, next rainy season.' }],
      tip: 'ቢፈቅድ is the ቢ- “if” from the proverbs: “if God permits”.',
    },
  ],
  // Camp 11, Lesson 1: At the Bus Station
  'amharic-beginner-11:0': [
    {
      title: 'When, how long, about',
      rule: 'Questions about a trip use the “it” verbs (ይ- … -ል). Put ገደማ (gedema) after a number for “about”.',
      table: [
        ['', ''],
        ['when does it leave?', 'መቼ ይነሳል? meche yinesal?'],
        ['how many hours does it take?', 'ስንት ሰዓት ይፈጃል? sint se’at yifejal?'],
        ['about ten hours', 'አሥር ሰዓት ገደማ asir se’at gedema'],
      ],
      examples: [{ amharic: 'ወደ ባሕር ዳር አንድ ትኬት እፈልጋለሁ።', transliteration: 'wede bahir dar and tiket ifeligalehu.', english: 'I’d like one ticket to Bahir Dar.' }],
    },
  ],
  // Camp 11, Lesson 2: At the Hotel
  'amharic-beginner-11:1': [
    {
      title: 'Asking a business: “you all”',
      rule: 'A hotel or shop is “you all”, so ask with -ችሁ: ክፍል አላችሁ? is “do you (all) have a room?”. ለ- (for) handles “for one night”.',
      table: [
        ['', ''],
        ['do you have a room?', 'ክፍል አላችሁ? kifil alachihu?'],
        ['for one night', 'ለአንድ ሌሊት le’and lelit'],
        ['for how many nights?', 'ለስንት ሌሊት? lesint lelit?'],
        ['is there hot water?', 'ሙቅ ውሃ አለ? muq wuha alle?'],
      ],
      examples: [{ amharic: 'አዎ፣ አለ። ይኸው ቁልፉ።', transliteration: 'awo, alle. yihew qulfu.', english: 'Yes, there is. Here’s the key.' }],
    },
  ],
  // Camp 11, Lesson 3: Visiting a Church
  'amharic-beginner-11:2': [
    {
      title: '“Is it allowed?”: to-do + ይቻላል',
      rule: 'ይቻላል (yichalal) means “it’s possible, it’s allowed”. Put the “to …” form of a verb before it. The “not” form is አይቻልም.',
      table: [
        ['', ''],
        ['may I take photos?', 'ፎቶ ማንሳት ይቻላል? foto mansat yichalal?'],
        ['may I go in?', 'መግባት ይቻላል? megbat yichalal?'],
        ['it’s not allowed', 'አይቻልም ayichalim'],
      ],
      examples: [{ amharic: 'ግን መጀመሪያ ጫማህን አውልቅ።', transliteration: 'gin mejemerya chamahin awliq.', english: 'But first, take off your shoes.' }],
      tip: 'ጫማህን stacks three pieces: ጫማ (shoes) + -ህ (your) + -ን (the thing acted on).',
    },
  ],
  // Camp 11, Lesson 4: Asking the Locals
  'amharic-beginner-11:3': [
    {
      title: '“It’s called”, “they say”',
      rule: 'ይባላል (yibalal) means “it is called”. For what people in general do, use the “they” form, ending in -u: ይናገራሉ (they speak).',
      table: [
        ['', ''],
        ['what is it called?', 'ምን ይባላል? min yibalal?'],
        ['it’s called Adama', 'አዳማ ይባላል adama yibalal'],
        ['they speak', 'ይናገራሉ yinageralu'],
        ['they call it', 'ይሉታል yilutal'],
      ],
      examples: [{ amharic: 'እዚህ ምን ቋንቋ ይናገራሉ?', transliteration: 'izih min qwanqwa yinageralu?', english: 'What language do people speak here?' }],
    },
  ],
  // Camp 11, Lesson 5: Telling About Your Trip
  'amharic-beginner-11:4': [
    {
      title: '“Was”: ነበር',
      rule: 'To put “is” in the past, use ነበር (neber, was). For “I was”, add -ኩ: ነበርኩ.',
      table: [
        ['', ''],
        ['it was good', 'ጥሩ ነበር tiru neber'],
        ['how was the trip?', 'ጉዞው እንዴት ነበር? guzow indet neber?'],
        ['I was there', 'እዚያ ነበርኩ iziya neberku'],
      ],
      examples: [{ amharic: 'በጣም ደስ የሚል ነበር!', transliteration: 'betam des yemil neber!', english: 'It was really lovely!' }],
      tip: 'እንደገና (indegena) means “again”: እንደገና መሄድ እፈልጋለሁ, “I want to go again”.',
    },
  ],
};

/** Word families by lesson: "<course slug>:<lesson index>". */
const FAMILIES: Record<string, WordFamily[]> = {
  'amharic-beginner-1:0': [
    {
      word: 'ሰላም',
      roman: 'selam',
      meaning: 'peace',
      root: 's · l · m',
      members: [
        { amharic: 'ሰላም', transliteration: 'selam', english: 'peace; hello' },
        { amharic: 'ሰላምታ', transliteration: 'selamta', english: 'a greeting' },
        { amharic: 'በሰላም', transliteration: 'beselam', english: 'in peace, safely' },
      ],
      tip: 'Arabic salaam and Hebrew shalom come from the same old root.',
    },
  ],
  'amharic-beginner-1:3': [
    {
      word: 'ገባ',
      roman: 'geba',
      meaning: 'he entered',
      root: 'g · b',
      members: [
        { amharic: 'ገባኝ', transliteration: 'gebagn', english: 'I understand (it entered me)' },
        { amharic: 'ግባ', transliteration: 'giba', english: 'come in! (to a man)' },
        { amharic: 'መግቢያ', transliteration: 'megbiya', english: 'entrance' },
      ],
    },
  ],
  'amharic-beginner-1:5': [
    {
      word: 'ተቀመጠ',
      roman: 'teqemete',
      meaning: 'he sat down',
      root: 'q · m · t',
      members: [
        { amharic: 'ተቀመጥ', transliteration: 'teqemet', english: 'sit down! (to a man)' },
        { amharic: 'ይቀመጡ', transliteration: 'yiqemetu', english: 'please sit (polite)' },
        { amharic: 'መቀመጫ', transliteration: 'meqemecha', english: 'a seat' },
      ],
    },
  ],
  'amharic-beginner-2:0': [
    {
      word: 'ቆጠረ',
      roman: 'qotere',
      meaning: 'he counted',
      root: 'q · t · r',
      members: [
        { amharic: 'ቁጥር', transliteration: 'qutir', english: 'number' },
        { amharic: 'መቁጠር', transliteration: 'mequter', english: 'to count' },
        { amharic: 'አቆጣጠር', transliteration: 'aqotater', english: 'calendar (way of counting)' },
      ],
    },
  ],
  'amharic-beginner-2:2': [
    {
      word: 'ተናገረ',
      roman: 'tenagere',
      meaning: 'he spoke',
      root: 'n · g · r',
      members: [
        { amharic: 'ተናገር', transliteration: 'tenager', english: 'speak! (to a man)' },
        { amharic: 'ነገረ', transliteration: 'negere', english: 'he told' },
        { amharic: 'ንግግር', transliteration: 'niggigir', english: 'a speech, a conversation' },
        { amharic: 'ነገር', transliteration: 'neger', english: 'a thing, a matter' },
      ],
    },
  ],
  'amharic-beginner-3:1': [
    {
      word: 'ፈለገ',
      roman: 'felege',
      meaning: 'he wanted, looked for',
      root: 'f · l · g',
      members: [
        { amharic: 'እፈልጋለሁ', transliteration: 'ifeligalehu', english: 'I want' },
        { amharic: 'ፍላጎት', transliteration: 'filagot', english: 'a need, a wish' },
        { amharic: 'ፍለጋ', transliteration: 'filliga', english: 'a search' },
      ],
    },
  ],
  'amharic-beginner-3:3': [
    {
      word: 'ወደደ',
      roman: 'wedede',
      meaning: 'he loved, liked',
      root: 'w · d · d',
      members: [
        { amharic: 'ውድ', transliteration: 'wid', english: 'expensive; dear' },
        { amharic: 'ወዳጅ', transliteration: 'wedaj', english: 'a close friend' },
        { amharic: 'እወዳለሁ', transliteration: 'iwedalehu', english: 'I like, I love' },
      ],
      tip: 'Something ውድ is “dear” both ways, like in English: it costs a lot, or it’s loved.',
    },
    {
      word: 'ገዛ · ሸጠ',
      roman: 'geza · shete',
      meaning: 'he bought · he sold',
      root: 'g · z  and  sh · t',
      members: [
        { amharic: 'ገዢ', transliteration: 'gezhi', english: 'a buyer' },
        { amharic: 'ግዢ', transliteration: 'gizhi', english: 'shopping, a purchase' },
        { amharic: 'ሻጭ', transliteration: 'shach', english: 'a seller' },
      ],
    },
  ],
  'amharic-beginner-4:4': [
    {
      word: 'ተማረ',
      roman: 'temare',
      meaning: 'he learned',
      root: 'm · h · r',
      members: [
        { amharic: 'ተማሪ', transliteration: 'temari', english: 'a student' },
        { amharic: 'መምህር', transliteration: 'memhir', english: 'a teacher' },
        { amharic: 'ትምህርት', transliteration: 'timhirt', english: 'a lesson, education' },
        { amharic: 'ትምህርት ቤት', transliteration: 'timhirt bet', english: 'school (learning house)' },
      ],
    },
  ],
  'amharic-beginner-5:0': [
    {
      word: 'ሠራ',
      roman: 'serra',
      meaning: 'he worked, made',
      root: 's · r',
      members: [
        { amharic: 'ሥራ', transliteration: 'sira', english: 'work, a job' },
        { amharic: 'ሠራተኛ', transliteration: 'serategna', english: 'a worker' },
        { amharic: 'መሥሪያ ቤት', transliteration: 'mesriya bet', english: 'an office (work house)' },
      ],
    },
    {
      word: 'ጠጣ',
      roman: 'tetta',
      meaning: 'he drank',
      root: 't · t',
      members: [
        { amharic: 'ጠጣሁ', transliteration: 'tetahu', english: 'I drank' },
        { amharic: 'መጠጥ', transliteration: 'metet', english: 'a drink' },
        { amharic: 'ቡና ጠጡ', transliteration: 'buna tetu', english: 'come have coffee!' },
      ],
    },
  ],
  'amharic-beginner-5:3': [
    {
      word: 'ከፈለ',
      roman: 'keffele',
      meaning: 'he divided; he paid',
      root: 'k · f · l',
      members: [
        { amharic: 'ክፍል', transliteration: 'kifil', english: 'a room, a part, a class' },
        { amharic: 'መክፈል', transliteration: 'mekfel', english: 'to pay' },
        { amharic: 'ክፍያ', transliteration: 'kiffiya', english: 'a payment' },
      ],
      tip: 'A room is a part of a house, and paying is handing over your part: both come from “divide”.',
    },
  ],
  'amharic-beginner-7:3': [
    {
      word: 'ወለደ',
      roman: 'welede',
      meaning: 'she gave birth, he fathered',
      root: 'w · l · d',
      members: [
        { amharic: 'ልደት', transliteration: 'lidet', english: 'birth; birthday' },
        { amharic: 'ልጅ', transliteration: 'lij', english: 'a child' },
        { amharic: 'ወላጅ', transliteration: 'welaj', english: 'a parent' },
      ],
      tip: 'ገና (Christmas) is also called ልደት: the Birth.',
    },
  ],
  'amharic-beginner-8:4': [
    {
      word: 'ታመመ',
      roman: 'tammeme',
      meaning: 'he got sick',
      root: 'h · m · m',
      members: [
        { amharic: 'ሕመም', transliteration: 'himem', english: 'pain, illness' },
        { amharic: 'ያመኛል', transliteration: 'yamegnal', english: 'it hurts me' },
        { amharic: 'ታማሚ', transliteration: 'tamami', english: 'a sick person, a patient' },
      ],
    },
  ],
  'amharic-beginner-9:1': [
    {
      word: 'ደረሰ',
      roman: 'derese',
      meaning: 'he arrived, reached',
      root: 'd · r · s',
      members: [
        { amharic: 'ደረሰኝ', transliteration: 'deresegn', english: 'a receipt (“it reached me”)' },
        { amharic: 'መድረሻ', transliteration: 'medresha', english: 'a destination' },
        { amharic: 'እንኳን አደረሳችሁ', transliteration: 'inkwan aderesachihu', english: 'happy holiday (glad it brought you to it)' },
      ],
    },
  ],
  'amharic-beginner-9:4': [
    {
      word: 'ጠየቀ',
      roman: 'teyyeqe',
      meaning: 'he asked',
      root: 't · y · q',
      members: [
        { amharic: 'ጥያቄ', transliteration: 'tiyaqe', english: 'a question' },
        { amharic: 'መጠየቅ', transliteration: 'meteyeq', english: 'to ask; to visit someone who’s sick' },
        { amharic: 'ልጠይቅህ', transliteration: 'litiyiqih', english: 'so I can ask after you (to a man)' },
      ],
    },
  ],
  'amharic-beginner-10:0': [
    {
      word: 'ባረከ',
      roman: 'barreke',
      meaning: 'he blessed',
      root: 'b · r · k',
      members: [
        { amharic: 'በረከት', transliteration: 'bereket', english: 'a blessing' },
        { amharic: 'ይባርካችሁ', transliteration: 'yibarkachihu', english: 'may (God) bless you all' },
        { amharic: 'በረካ', transliteration: 'bereka', english: 'the third round of coffee' },
      ],
      tip: 'The coffee ceremony’s last round, በረካ, is the round of blessing. Now you know why leaving early is rude!',
    },
  ],
  'amharic-beginner-11:4': [
    {
      word: 'ተጓዘ',
      roman: 'tegwaze',
      meaning: 'he travelled',
      root: 'g · w · z',
      members: [
        { amharic: 'ጉዞ', transliteration: 'guzo', english: 'a trip, a journey' },
        { amharic: 'ተጓዥ', transliteration: 'tegwazh', english: 'a traveller' },
      ],
    },
  ],
};

/** The pieces of words used in the lessons, by the word as it's written. */
const PARTS: Record<string, WordPart[]> = {
  // Camp 1
  ሰላም: [{ roman: 'selam', gloss: 'peace' }],
  እንዴት: [{ roman: 'endet', gloss: 'how' }],
  ነህ: [
    { roman: 'ne', gloss: 'be' },
    { roman: '-h', gloss: 'you (man)' },
  ],
  ነሽ: [
    { roman: 'ne', gloss: 'be' },
    { roman: '-sh', gloss: 'you (woman)' },
  ],
  ደህና: [{ roman: 'dehna', gloss: 'well, fine' }],
  አንተስ: [
    { roman: 'ante', gloss: 'you (man)' },
    { roman: '-s', gloss: 'and…?' },
  ],
  አንቺስ: [
    { roman: 'anchi', gloss: 'you (woman)' },
    { roman: '-s', gloss: 'and…?' },
  ],
  እግዚአብሔር: [{ roman: 'əgziabher', gloss: 'God' }],
  ይመስገን: [
    { roman: 'yi-', gloss: 'may he' },
    { roman: 'mmesgen', gloss: 'be thanked' },
  ],
  አመሰግናለሁ: [
    { roman: 'amesegen', gloss: 'thank' },
    { roman: '-allo', gloss: 'I (now)' },
  ],
  በጣም: [{ roman: 'betam', gloss: 'very' }],
  ምንም: [{ roman: 'minim', gloss: 'nothing' }],
  አይደለም: [
    { roman: 'ay-', gloss: 'not' },
    { roman: 'dele', gloss: 'is' },
    { roman: '-m', gloss: '(not)' },
  ],
  ይቅርታ: [{ roman: 'yiqirta', gloss: 'forgiveness, sorry' }],
  አድርግልኝ: [
    { roman: 'adrig', gloss: 'do (man)' },
    { roman: '-ill', gloss: 'for' },
    { roman: '-iñ', gloss: 'me' },
  ],
  አድርጊልኝ: [
    { roman: 'adrigi', gloss: 'do (woman)' },
    { roman: '-ll', gloss: 'for' },
    { roman: '-iñ', gloss: 'me' },
  ],
  አዎ: [{ roman: 'awo', gloss: 'yes' }],
  ትክክል: [{ roman: 'tikikil', gloss: 'correct' }],
  አላውቅም: [
    { roman: 'al-', gloss: 'not' },
    { roman: 'awq', gloss: 'know (I)' },
    { roman: '-im', gloss: '(not)' },
  ],
  ገባኝ: [
    { roman: 'geba', gloss: 'entered' },
    { roman: '-gn', gloss: 'me' },
  ],
  አልገባኝም: [
    { roman: 'al-', gloss: 'not' },
    { roman: 'geba', gloss: 'entered' },
    { roman: '-gn', gloss: 'me' },
    { roman: '-im', gloss: '(not)' },
  ],
  ምናልባት: [{ roman: 'minalbat', gloss: 'maybe' }],
  አማርኛ: [{ roman: 'amarigna', gloss: 'Amharic' }],
  ወይ: [{ roman: 'wey', gloss: 'turns it into a yes/no question' }],
  ትናገራለህ: [
    { roman: 'ti-', gloss: 'you (man)' },
    { roman: 'nager', gloss: 'speak' },
    { roman: '-aleh', gloss: '(now)' },
  ],
  እናገራለሁ: [
    { roman: 'i-', gloss: 'I' },
    { roman: 'nager', gloss: 'speak' },
    { roman: '-alehu', gloss: '(now)' },
  ],
  ትንሽ: [{ roman: 'tinish', gloss: 'a little' }],
  ሁን: [{ roman: 'hun', gloss: 'be! (man)' }],
  ሁኚ: [{ roman: 'hunyi', gloss: 'be! (woman)' }],
  ሁኑ: [{ roman: 'hunu', gloss: 'be! (group, polite)' }],
  እንገናኝ: [
    { roman: 'in-', gloss: 'let’s' },
    { roman: 'genagn', gloss: 'meet' },
  ],
  በኋላ: [
    { roman: 'be-', gloss: 'at' },
    { roman: 'hwala', gloss: 'after' },
  ],
  ነገ: [{ roman: 'nege', gloss: 'tomorrow' }],
  እደር: [{ roman: 'ider', gloss: 'spend the night! (man)' }],
  እደሪ: [{ roman: 'ideri', gloss: 'spend the night! (woman)' }],
  እርስዎ: [{ roman: 'ərswo', gloss: 'you (respect)' }],
  ስምዎ: [
    { roman: 'səm', gloss: 'name' },
    { roman: '-wo', gloss: 'your (respect)' },
  ],
  ጤናዎ: [
    { roman: 'tena', gloss: 'health' },
    { roman: '-wo', gloss: 'your (respect)' },
  ],
  እባክዎ: [
    { roman: 'əbak', gloss: 'please (I beg)' },
    { roman: '-wo', gloss: 'you (respect)' },
  ],
  ይቀመጡ: [
    { roman: 'yi-', gloss: 'may you (respect)' },
    { roman: 'qemet', gloss: 'sit' },
    { roman: '-u', gloss: '(respect)' },
  ],
  ይሁኑ: [
    { roman: 'yi-', gloss: 'may you (respect)' },
    { roman: 'hun', gloss: 'be' },
    { roman: '-u', gloss: '(respect)' },
  ],
  እንደምን: [{ roman: 'əndemin', gloss: 'how' }],
  አደሩ: [
    { roman: 'ader', gloss: 'spent the night' },
    { roman: '-u', gloss: 'you (respect)' },
  ],
  ልጄ: [
    { roman: 'lij', gloss: 'child' },
    { roman: '-e', gloss: 'my' },
  ],
  አያቴ: [
    { roman: 'ayat', gloss: 'grandparent' },
    { roman: '-e', gloss: 'my' },
  ],
  // Camp 2
  አባቴ: [
    { roman: 'abat', gloss: 'father' },
    { roman: '-e', gloss: 'my' },
  ],
  እናቴ: [
    { roman: 'ənnat', gloss: 'mother' },
    { roman: '-e', gloss: 'my' },
  ],
  እህቴ: [
    { roman: 'əht', gloss: 'sister' },
    { roman: '-e', gloss: 'my' },
  ],
  ወንድሜ: [
    { roman: 'wəndim', gloss: 'brother' },
    { roman: '-e', gloss: 'my' },
  ],
  ጓደኛዬ: [
    { roman: 'gwadenya', gloss: 'friend' },
    { roman: '-ye', gloss: 'my' },
  ],
  ቤተሰቦችህ: [
    { roman: 'beteseb', gloss: 'family' },
    { roman: '-och', gloss: '(plural)' },
    { roman: '-ih', gloss: 'your (man)' },
  ],
  ናቸው: [{ roman: 'nachəw', gloss: 'they are' }],
  ቁጥሮችን: [
    { roman: 'qutir', gloss: 'number' },
    { roman: '-och', gloss: '(plural)' },
    { roman: '-in', gloss: '(the thing acted on)' },
  ],
  ተናገር: [{ roman: 'tenager', gloss: 'speak! (man)' }],
  እስከ: [{ roman: 'iska', gloss: 'until' }],
  ከአንድ: [
    { roman: 'ke-', gloss: 'from' },
    { roman: 'and', gloss: 'one' },
  ],
  እሺ: [{ roman: 'əshi', gloss: 'okay' }],
  ጊዜ: [{ roman: 'gize', gloss: 'time' }],
  አለህ: [
    { roman: 'alle', gloss: 'there is' },
    { roman: '-h', gloss: 'to you (man)' },
  ],
  አለሽ: [
    { roman: 'alle', gloss: 'there is' },
    { roman: '-sh', gloss: 'to you (woman)' },
  ],
  አሁን: [{ roman: 'ahun', gloss: 'now' }],
  አልችልም: [
    { roman: 'al-', gloss: 'not' },
    { roman: 'chil', gloss: 'can (I)' },
    { roman: '-im', gloss: '(not)' },
  ],
  ድጋሚ: [{ roman: 'dɨgami', gloss: 'again' }],
  ቀስ: [{ roman: 'qes', gloss: 'slow' }],
  ብለህ: [{ roman: 'bileh', gloss: '(do it) …ly (man)' }],
  ላናግርህ: [
    { roman: 'l-', gloss: 'to (so I can)' },
    { roman: 'anagir', gloss: 'talk with' },
    { roman: '-ih', gloss: 'you (man)' },
  ],
  እፈልጋለሁ: [
    { roman: 'i-', gloss: 'I' },
    { roman: 'felig', gloss: 'want' },
    { roman: '-alehu', gloss: '(now)' },
  ],
  አስራ: [{ roman: 'asra', gloss: 'ten (in the teens)' }],
  ስንት: [{ roman: 'sint', gloss: 'how much / many' }],
  ይሄ: [{ roman: 'yihe', gloss: 'this' }],
  ወንድምህ: [
    { roman: 'wendim', gloss: 'brother' },
    { roman: '-ih', gloss: 'your (man)' },
  ],
  ምን: [{ roman: 'min', gloss: 'what' }],
  ይመስላል: [
    { roman: 'yi-', gloss: 'he' },
    { roman: 'mesl', gloss: 'seem' },
    { roman: '-al', gloss: '(now)' },
  ],
  // Camp 3
  ቡና: [{ roman: 'buna', gloss: 'coffee' }],
  ጠጡ: [{ roman: 'tetu', gloss: 'drink! (everyone, polite)' }],
  ይፈልጋሉ: [
    { roman: 'yi-', gloss: 'you (polite)' },
    { roman: 'felig', gloss: 'want' },
    { roman: '-alu', gloss: '(now, polite)' },
  ],
  የጾም: [
    { roman: 'ye-', gloss: 'of' },
    { roman: 'tsom', gloss: 'fasting' },
  ],
  ምግብ: [{ roman: 'migib', gloss: 'food' }],
  ሂሳብ: [{ roman: 'hisab', gloss: 'bill' }],
  ይጣፍጣል: [
    { roman: 'yi-', gloss: 'it' },
    { roman: 'tafit', gloss: 'taste good' },
    { roman: '-al', gloss: '(now)' },
  ],
  ያቃጥላል: [
    { roman: 'ya-', gloss: 'it' },
    { roman: 'qatil', gloss: 'burn' },
    { roman: '-al', gloss: '(now)' },
  ],
  ወጡ: [
    { roman: 'wet', gloss: 'stew' },
    { roman: '-u', gloss: 'the' },
  ],
  ጥሩ: [{ roman: 'tiru', gloss: 'good' }],
  ውድ: [{ roman: 'wid', gloss: 'expensive' }],
  ቀንስልኝ: [
    { roman: 'qenis', gloss: 'lower (man)' },
    { roman: '-ill', gloss: 'for' },
    { roman: '-iñ', gloss: 'me' },
  ],
  ገበያ: [{ roman: 'gebeya', gloss: 'market' }],
  እንኳን: [{ roman: 'inkwan', gloss: 'good that / even' }],
  መጣህ: [
    { roman: 'meta', gloss: 'came' },
    { roman: '-h', gloss: 'you (man)' },
  ],
  መጣሽ: [
    { roman: 'meta', gloss: 'came' },
    { roman: '-sh', gloss: 'you (woman)' },
  ],
  ጠገብኩ: [
    { roman: 'tegeb', gloss: 'got full' },
    { roman: '-ku', gloss: 'I' },
  ],
  በቃኝ: [
    { roman: 'beqa', gloss: 'enough' },
    { roman: '-gn', gloss: 'for me' },
  ],
  ብላ: [{ roman: 'bila', gloss: 'eat! (man)' }],
  ብዪ: [{ roman: 'biyi', gloss: 'eat! (woman)' }],
  ቤትህ: [
    { roman: 'bet', gloss: 'house' },
    { roman: '-ih', gloss: 'your (man)' },
  ],
  ያምራል: [
    { roman: 'ya-', gloss: 'it' },
    { roman: 'mr', gloss: 'be beautiful' },
    { roman: '-al', gloss: '(now)' },
  ],
  // Camp 4
  የት: [{ roman: 'yet', gloss: 'where' }],
  ሆቴሉ: [
    { roman: 'hotel', gloss: 'hotel' },
    { roman: '-u', gloss: 'the' },
  ],
  ሂድ: [{ roman: 'hid', gloss: 'go! (man)' }],
  ከዚያ: [
    { roman: 'ke-', gloss: 'from' },
    { roman: 'ziya', gloss: 'there' },
  ],
  ወደ: [{ roman: 'wede', gloss: 'to, toward' }],
  ቀኝ: [{ roman: 'qegn', gloss: 'right' }],
  ግራ: [{ roman: 'gira', gloss: 'left' }],
  ቀጥታ: [{ roman: 'qetita', gloss: 'straight' }],
  እዚህ: [{ roman: 'izih', gloss: 'here' }],
  እዚያ: [{ roman: 'iziya', gloss: 'there' }],
  ቅርብ: [{ roman: 'qirib', gloss: 'near' }],
  ሩቅ: [{ roman: 'ruq', gloss: 'far' }],
  እሄዳለሁ: [
    { roman: 'i-', gloss: 'I' },
    { roman: 'hed', gloss: 'go' },
    { roman: '-alehu', gloss: '(now)' },
  ],
  ወራጅ: [{ roman: 'werraj', gloss: 'someone getting off' }],
  አለ: [{ roman: 'alle', gloss: 'there is' }],
  አቁም: [{ roman: 'aqum', gloss: 'stop! (man)' }],
  ግባ: [{ roman: 'giba', gloss: 'come in! (man)' }],
  መንገድ: [{ roman: 'menged', gloss: 'road' }],
  ሰዓት: [{ roman: 'se’at', gloss: 'hour, clock' }],
  ከሰዓት: [
    { roman: 'ke-', gloss: 'from' },
    { roman: 'se’at', gloss: 'the hour (noon)' },
  ],
  ጠዋት: [{ roman: 'tewat', gloss: 'morning' }],
  ማታ: [{ roman: 'mata', gloss: 'evening' }],
  ዛሬ: [{ roman: 'zare', gloss: 'today' }],
  ትናንት: [{ roman: 'tinant', gloss: 'yesterday' }],
  ቀን: [{ roman: 'qen', gloss: 'day' }],
  ሳምንት: [{ roman: 'samint', gloss: 'week' }],
  የምትሄደው: [
    { roman: 'ye-', gloss: 'that' },
    { roman: 'miti-', gloss: 'you (man) are' },
    { roman: 'hed', gloss: 'going' },
    { roman: '-ew', gloss: 'the one' },
  ],
  ትምህርት: [{ roman: 'timhirt', gloss: 'learning, lesson' }],
  ቤት: [{ roman: 'bet', gloss: 'house' }],
  // Camp 5
  ተነሳሁ: [
    { roman: 'tenesa', gloss: 'got up' },
    { roman: '-hu', gloss: 'I' },
  ],
  በላሁ: [
    { roman: 'bela', gloss: 'ate' },
    { roman: '-hu', gloss: 'I' },
  ],
  ጠጣሁ: [
    { roman: 'teta', gloss: 'drank' },
    { roman: '-hu', gloss: 'I' },
  ],
  ሄድኩ: [
    { roman: 'hed', gloss: 'went' },
    { roman: '-ku', gloss: 'I' },
  ],
  ሠራሁ: [
    { roman: 'sera', gloss: 'worked' },
    { roman: '-hu', gloss: 'I' },
  ],
  ተኛሁ: [
    { roman: 'tegna', gloss: 'slept' },
    { roman: '-hu', gloss: 'I' },
  ],
  አደረግህ: [
    { roman: 'adereg', gloss: 'did' },
    { roman: '-ih', gloss: 'you (man)' },
  ],
  ሥራ: [{ roman: 'sira', gloss: 'work' }],
  ቁርስ: [{ roman: 'qurs', gloss: 'breakfast' }],
  ደክሞኛል: [
    { roman: 'dekmo', gloss: 'tiredness has' },
    { roman: '-gnal', gloss: 'got me' },
  ],
  ርቦኛል: [
    { roman: 'rabo', gloss: 'hunger has' },
    { roman: '-gnal', gloss: 'got me' },
  ],
  ጠምቶኛል: [
    { roman: 'temto', gloss: 'thirst has' },
    { roman: '-gnal', gloss: 'got me' },
  ],
  አሞኛል: [
    { roman: 'amo', gloss: 'sickness has' },
    { roman: '-gnal', gloss: 'got me' },
  ],
  ደብሮኛል: [
    { roman: 'debro', gloss: 'boredom has' },
    { roman: '-gnal', gloss: 'got me' },
  ],
  ሆንክ: [
    { roman: 'hon', gloss: 'became' },
    { roman: '-k', gloss: 'you (man)' },
  ],
  እወዳለሁ: [
    { roman: 'i-', gloss: 'I' },
    { roman: 'wed', gloss: 'like' },
    { roman: '-alehu', gloss: '(now)' },
  ],
  አልወድም: [
    { roman: 'al-', gloss: 'not' },
    { roman: 'wed', gloss: 'like (I)' },
    { roman: '-im', gloss: '(not)' },
  ],
  ትወዳለህ: [
    { roman: 'ti-', gloss: 'you (man)' },
    { roman: 'wed', gloss: 'like' },
    { roman: '-aleh', gloss: '(now)' },
  ],
  ትወጃለሽ: [
    { roman: 'ti-', gloss: 'you' },
    { roman: 'wej', gloss: 'like (softened)' },
    { roman: '-alesh', gloss: '(now), woman' },
  ],
  ሙዚቃ: [{ roman: 'muziqa', gloss: 'music' }],
  ኳስ: [{ roman: 'kwas', gloss: 'ball, football' }],
  ክፍል: [{ roman: 'kifil', gloss: 'room' }],
  በር: [{ roman: 'ber', gloss: 'door' }],
  መስኮት: [{ roman: 'meskot', gloss: 'window' }],
  ወንበር: [{ roman: 'wenber', gloss: 'chair' }],
  ጠረጴዛ: [{ roman: 'terepeza', gloss: 'table' }],
  እማማ: [{ roman: 'imama', gloss: 'Mom' }],
  ናት: [{ roman: 'nat', gloss: 'she is' }],
  ሃሎ: [{ roman: 'halo', gloss: 'hello (phone)' }],
  ይሰማሃል: [
    { roman: 'yi-', gloss: 'it' },
    { roman: 'sema', gloss: 'is heard' },
    { roman: '-hal', gloss: 'by you (man)' },
  ],
  ቆይ: [{ roman: 'qoy', gloss: 'wait! (man)' }],
  እደውላለሁ: [
    { roman: 'i-', gloss: 'I' },
    { roman: 'dewil', gloss: 'call' },
    { roman: '-alehu', gloss: '(now, later)' },
  ],
  ላይ: [{ roman: 'lay', gloss: 'on' }],
  // Camp 6
  ነዎት: [
    { roman: 'ne', gloss: 'be' },
    { roman: '-wot', gloss: 'you (respect)' },
  ],
  ጋሼ: [{ roman: 'gashe', gloss: 'sir, older brother' }],
  እትዬ: [{ roman: 'itiye', gloss: 'ma’am, older sister' }],
  ያድርጉልኝ: [
    { roman: 'ya-', gloss: 'may you' },
    { roman: 'dirg', gloss: 'do' },
    { roman: '-u', gloss: '(respect)' },
    { roman: '-lign', gloss: 'for me' },
  ],
  ይስጥልኝ: [
    { roman: 'yi-', gloss: 'may he' },
    { roman: 'sit', gloss: 'give' },
    { roman: '-lign', gloss: 'for me' },
  ],
  በዓል: [{ roman: 'beal', gloss: 'holiday' }],
  መቼ: [{ roman: 'meche', gloss: 'when' }],
  አደረሳችሁ: [
    { roman: 'aderesa', gloss: 'brought (to it)' },
    { roman: '-chihu', gloss: 'you all' },
  ],
  አደረሰህ: [
    { roman: 'aderes', gloss: 'brought (to it)' },
    { roman: '-eh', gloss: 'you (man)' },
  ],
  አደረሰን: [
    { roman: 'aderes', gloss: 'brought (to it)' },
    { roman: '-en', gloss: 'us' },
  ],
  አብሮ: [{ roman: 'abiro', gloss: 'together' }],
  መልካም: [{ roman: 'melkam', gloss: 'good, happy' }],
  አዲስ: [{ roman: 'addis', gloss: 'new' }],
  ዓመት: [{ roman: 'amet', gloss: 'year' }],
  ልደት: [{ roman: 'lidet', gloss: 'birth, birthday' }],
  ደስ: [{ roman: 'des', gloss: 'pleasant, glad' }],
  ወር: [{ roman: 'wer', gloss: 'month' }],
  ተረት: [{ roman: 'teret', gloss: 'proverb' }],
  በቀስ: [
    { roman: 'be-', gloss: 'by' },
    { roman: 'qes', gloss: 'slow' },
  ],
  እንቁላል: [{ roman: 'inqulal', gloss: 'egg' }],
  በእግሩ: [
    { roman: 'be-', gloss: 'on' },
    { roman: 'igr', gloss: 'foot, leg' },
    { roman: '-u', gloss: 'its' },
  ],
  ይሄዳል: [
    { roman: 'yi-', gloss: 'it' },
    { roman: 'hed', gloss: 'go' },
    { roman: '-al', gloss: '(now)' },
  ],
  ድር: [{ roman: 'dir', gloss: 'spider web' }],
  ቢያብር: [
    { roman: 'bi-', gloss: 'if' },
    { roman: 'yabir', gloss: 'they unite' },
  ],
  አንበሳ: [{ roman: 'anbesa', gloss: 'lion' }],
  ያስር: [
    { roman: 'ya-', gloss: 'it (can)' },
    { roman: 'sir', gloss: 'tie up' },
  ],
  ሰው: [{ roman: 'sew', gloss: 'person' }],
  ለሰው: [
    { roman: 'le-', gloss: 'to, for' },
    { roman: 'sew', gloss: 'person' },
  ],
  መድኃኒቱ: [
    { roman: 'medhanit', gloss: 'medicine' },
    { roman: '-u', gloss: 'the' },
  ],
  ጅብ: [{ roman: 'jib', gloss: 'hyena' }],
  ከሄደ: [
    { roman: 'ke-', gloss: 'once, after' },
    { roman: 'hede', gloss: 'it went' },
  ],
  ውሻ: [{ roman: 'wusha', gloss: 'dog' }],
  ጮኸ: [{ roman: 'chohe', gloss: 'barked' }],
  አገር: [{ roman: 'ager', gloss: 'country' }],
  አይናፍቅም: [
    { roman: 'ay-', gloss: 'not' },
    { roman: 'nafiq', gloss: 'miss (one)' },
    { roman: '-im', gloss: '(not)' },
  ],
  // Camp 7
  በየትኛው: [
    { roman: 'be-', gloss: 'in' },
    { roman: 'yetigna', gloss: 'which' },
    { roman: '-w', gloss: 'the' },
  ],
  በመስከረም: [
    { roman: 'be-', gloss: 'in' },
    { roman: 'meskerem', gloss: 'Meskerem' },
  ],
  በታኅሣሥ: [
    { roman: 'be-', gloss: 'in' },
    { roman: 'tahsas', gloss: 'Tahsas' },
  ],
  ገናስ: [
    { roman: 'genna', gloss: 'Christmas' },
    { roman: '-s', gloss: 'and…?' },
  ],
  ወራት: [{ roman: 'werat', gloss: 'months' }],
  አሉ: [{ roman: 'alu', gloss: 'there are' }],
  አንዳንዴ: [{ roman: 'andande', gloss: 'sometimes' }],
  ክረምት: [{ roman: 'kiremt', gloss: 'rainy season' }],
  ባለፈው: [
    { roman: 'ba-', gloss: 'in' },
    { roman: 'alef', gloss: 'passed' },
    { roman: '-ew', gloss: 'the one (that)' },
  ],
  በሚቀጥለው: [
    { roman: 'be-', gloss: 'in' },
    { roman: 'mi-', gloss: 'that' },
    { roman: 'qetil', gloss: 'follows' },
    { roman: '-ew', gloss: 'the one' },
  ],
  ከነገ: [
    { roman: 'ke-', gloss: 'from' },
    { roman: 'nege', gloss: 'tomorrow' },
  ],
  ከትናንት: [
    { roman: 'ke-', gloss: 'from' },
    { roman: 'tinant', gloss: 'yesterday' },
  ],
  ወዲያ: [{ roman: 'wediya', gloss: 'beyond' }],
  ቅዳሜና: [
    { roman: 'qidame', gloss: 'Saturday' },
    { roman: '-na', gloss: 'and' },
  ],
  ትመጣለህ: [
    { roman: 'ti-', gloss: 'you (man)' },
    { roman: 'meta', gloss: 'come' },
    { roman: '-aleh', gloss: '(now, later)' },
  ],
  እመጣለሁ: [
    { roman: 'i-', gloss: 'I' },
    { roman: 'meta', gloss: 'come' },
    { roman: '-alehu', gloss: '(now, later)' },
  ],
  ልደትህ: [
    { roman: 'lidet', gloss: 'birthday' },
    { roman: '-ih', gloss: 'your (man)' },
  ],
  ልደትሽ: [
    { roman: 'lidet', gloss: 'birthday' },
    { roman: '-ish', gloss: 'your (woman)' },
  ],
  ልደቴ: [
    { roman: 'lidet', gloss: 'birthday' },
    { roman: '-e', gloss: 'my' },
  ],
  የእኔ: [
    { roman: 'ye-', gloss: 'of' },
    { roman: 'ine', gloss: 'me' },
  ],
  በፈረንጆች: [
    { roman: 'be-', gloss: 'in' },
    { roman: 'ferenj', gloss: 'foreigner' },
    { roman: '-och', gloss: '(plural)' },
  ],
  አቆጣጠር: [{ roman: 'aqotater', gloss: 'way of counting, calendar' }],
  ከጠዋቱ: [
    { roman: 'ke-', gloss: 'of' },
    { roman: 'tewat', gloss: 'morning' },
    { roman: '-u', gloss: 'the' },
  ],
  ከቀኑ: [
    { roman: 'ke-', gloss: 'of' },
    { roman: 'qen', gloss: 'day' },
    { roman: '-u', gloss: 'the' },
  ],
  ከምሽቱ: [
    { roman: 'ke-', gloss: 'of' },
    { roman: 'mishit', gloss: 'evening' },
    { roman: '-u', gloss: 'the' },
  ],
  ከሌሊቱ: [
    { roman: 'ke-', gloss: 'of' },
    { roman: 'lelit', gloss: 'night' },
    { roman: '-u', gloss: 'the' },
  ],
  ተኩል: [{ roman: 'tekul', gloss: 'and a half' }],
  ማለት: [{ roman: 'malet', gloss: 'to mean' }],
  ልክ: [{ roman: 'lik', gloss: 'right, exact' }],
  // Camp 8
  ለምን: [
    { roman: 'le-', gloss: 'for' },
    { roman: 'min', gloss: 'what' },
  ],
  ይህ: [{ roman: 'yih', gloss: 'this' }],
  ምንድን: [{ roman: 'mindin', gloss: 'what (is it)' }],
  የምናፈላበት: [
    { roman: 'ye-', gloss: 'that' },
    { roman: 'mini-', gloss: 'we' },
    { roman: 'afela', gloss: 'boil' },
    { roman: '-bet', gloss: 'in it' },
  ],
  የሚሠራው: [
    { roman: 'yemi-', gloss: 'that' },
    { roman: 'serra', gloss: 'works' },
    { roman: '-w', gloss: 'the way' },
  ],
  ና: [{ roman: 'na', gloss: 'come! (man)' }],
  አሳይሃለሁ: [
    { roman: 'asay', gloss: 'show (I)' },
    { roman: '-ih', gloss: 'you (man)' },
    { roman: '-alehu', gloss: '(will)' },
  ],
  አክስቴ: [
    { roman: 'akist', gloss: 'aunt' },
    { roman: '-e', gloss: 'my' },
  ],
  አጎቴ: [
    { roman: 'agot', gloss: 'uncle' },
    { roman: '-e', gloss: 'my' },
  ],
  የአጎቴ: [
    { roman: 'ye-', gloss: 'of' },
    { roman: 'agot', gloss: 'uncle' },
    { roman: '-e', gloss: 'my' },
  ],
  ልጅ: [{ roman: 'lij', gloss: 'child' }],
  ባለቤቴ: [
    { roman: 'balebet', gloss: 'spouse (owner of the house)' },
    { roman: '-e', gloss: 'my' },
  ],
  ልጆቼ: [
    { roman: 'lij', gloss: 'child' },
    { roman: '-och', gloss: '(plural)' },
    { roman: '-e', gloss: 'my' },
  ],
  ልጆቹ: [
    { roman: 'lij', gloss: 'child' },
    { roman: '-och', gloss: '(plural)' },
    { roman: '-u', gloss: 'the, his' },
  ],
  ታላቅ: [{ roman: 'talaq', gloss: 'older' }],
  ታናሽ: [{ roman: 'tanash', gloss: 'younger' }],
  ጋር: [{ roman: 'gar', gloss: 'with' }],
  በሰላም: [
    { roman: 'be-', gloss: 'in' },
    { roman: 'selam', gloss: 'peace' },
  ],
  ናፍቀኸኛል: [
    { roman: 'nafqeh', gloss: 'you (man) made long' },
    { roman: '-egn', gloss: 'me' },
    { roman: '-al', gloss: '(now)' },
  ],
  ናፍቀሽኛል: [
    { roman: 'nafqesh', gloss: 'you (woman) made long' },
    { roman: '-ign', gloss: 'me' },
    { roman: '-al', gloss: '(now)' },
  ],
  ደረስክ: [
    { roman: 'deres', gloss: 'arrived' },
    { roman: '-k', gloss: 'you (man)' },
  ],
  ደረስኩ: [
    { roman: 'deres', gloss: 'arrived' },
    { roman: '-ku', gloss: 'I' },
  ],
  ነገር: [{ roman: 'neger', gloss: 'thing' }],
  ሁሉም: [{ roman: 'hulum', gloss: 'everyone' }],
  እኔም: [
    { roman: 'ine', gloss: 'I, me' },
    { roman: '-m', gloss: 'too' },
  ],
  አየሩ: [
    { roman: 'ayer', gloss: 'air, weather' },
    { roman: '-u', gloss: 'the' },
  ],
  ዝናብ: [{ roman: 'zinab', gloss: 'rain' }],
  እየዘነበ: [
    { roman: 'iye-', gloss: '(right now)' },
    { roman: 'zenebe', gloss: 'raining' },
  ],
  ይበርዳል: [
    { roman: 'yi-', gloss: 'it' },
    { roman: 'berd', gloss: 'be cold' },
    { roman: '-al', gloss: '(now)' },
  ],
  ይሞቃል: [
    { roman: 'yi-', gloss: 'it' },
    { roman: 'moq', gloss: 'be hot' },
    { roman: '-al', gloss: '(now)' },
  ],
  ፀሐይ: [{ roman: 'tsehay', gloss: 'sun' }],
  ደመና: [{ roman: 'demena', gloss: 'cloud' }],
  ጃንጥላ: [{ roman: 'jantila', gloss: 'umbrella' }],
  ያዝ: [{ roman: 'yaz', gloss: 'take, hold! (man)' }],
  ራሴን: [
    { roman: 'ras', gloss: 'head' },
    { roman: '-e', gloss: 'my' },
    { roman: '-n', gloss: '(acted on)' },
  ],
  ሆዴን: [
    { roman: 'hod', gloss: 'stomach' },
    { roman: '-e', gloss: 'my' },
    { roman: '-n', gloss: '(acted on)' },
  ],
  ያመኛል: [
    { roman: 'yam', gloss: 'it hurts' },
    { roman: '-egnal', gloss: 'me' },
  ],
  ሐኪም: [{ roman: 'hakim', gloss: 'doctor' }],
  መድኃኒት: [{ roman: 'medhanit', gloss: 'medicine' }],
  ተሻለህ: [
    { roman: 'teshal', gloss: 'got better' },
    { roman: '-eh', gloss: 'you (man)' },
  ],
  ተሽሎኛል: [
    { roman: 'teshlo', gloss: 'it has got better' },
    { roman: '-gnal', gloss: 'for me' },
  ],
  ይማርህ: [
    { roman: 'yi-', gloss: 'may (God)' },
    { roman: 'mar', gloss: 'heal' },
    { roman: '-ih', gloss: 'you (man)' },
  ],
  ግን: [{ roman: 'gin', gloss: 'but' }],
  ውሰድ: [{ roman: 'wised', gloss: 'take! (man)' }],
  // Camp 9
  ቀለም: [{ roman: 'qelem', gloss: 'colour' }],
  ቀይ: [{ roman: 'qey', gloss: 'red' }],
  ሰማያዊ: [
    { roman: 'semay', gloss: 'sky' },
    { roman: '-awi', gloss: '-coloured' },
  ],
  ጥቁር: [{ roman: 'tiqur', gloss: 'black' }],
  ነጭ: [{ roman: 'nech', gloss: 'white' }],
  ልለካው: [
    { roman: 'li-', gloss: 'shall I' },
    { roman: 'leka', gloss: 'try on' },
    { roman: '-w', gloss: 'it' },
  ],
  ትልቅ: [{ roman: 'tilliq', gloss: 'big' }],
  ይህን: [
    { roman: 'yih', gloss: 'this' },
    { roman: '-n', gloss: '(acted on)' },
  ],
  ቀሚስ: [{ roman: 'qemis', gloss: 'dress' }],
  ለኪው: [
    { roman: 'leki', gloss: 'try on! (woman)' },
    { roman: '-w', gloss: 'it' },
  ],
  ያነሰ: [{ roman: 'yanese', gloss: 'smaller' }],
  በጥቁር: [
    { roman: 'be-', gloss: 'in' },
    { roman: 'tiqur', gloss: 'black' },
  ],
  ዋጋው: [
    { roman: 'waga', gloss: 'price' },
    { roman: '-w', gloss: 'the' },
  ],
  በካርድ: [
    { roman: 'be-', gloss: 'by' },
    { roman: 'kard', gloss: 'card' },
  ],
  መክፈል: [
    { roman: 'me-', gloss: 'to' },
    { roman: 'kfel', gloss: 'pay' },
  ],
  እችላለሁ: [
    { roman: 'i-', gloss: 'I' },
    { roman: 'chil', gloss: 'can' },
    { roman: '-alehu', gloss: '(now)' },
  ],
  ጥሬ: [{ roman: 'tire', gloss: 'raw' }],
  ገንዘብ: [{ roman: 'genzeb', gloss: 'money' }],
  ደረሰኝ: [{ roman: 'deresegn', gloss: 'receipt' }],
  ብቻ: [{ roman: 'bicha', gloss: 'only' }],
  ራስ: [{ roman: 'ras', gloss: 'head' }],
  ምታት: [{ roman: 'mitat', gloss: 'pounding, ache' }],
  ጉንፋን: [{ roman: 'gunfan', gloss: 'a cold, flu' }],
  ያዘኝ: [
    { roman: 'yaze', gloss: 'caught' },
    { roman: '-gn', gloss: 'me' },
  ],
  ሳል: [{ roman: 'sal', gloss: 'cough' }],
  ትኩሳት: [{ roman: 'tikusat', gloss: 'fever' }],
  አለብኝ: [
    { roman: 'alle', gloss: 'there is' },
    { roman: '-bign', gloss: 'on me' },
  ],
  በቀን: [
    { roman: 'be-', gloss: 'per' },
    { roman: 'qen', gloss: 'day' },
  ],
  ከምግብ: [
    { roman: 'ke-', gloss: 'from' },
    { roman: 'migib', gloss: 'food' },
  ],
  ለራስ: [
    { roman: 'le-', gloss: 'for' },
    { roman: 'ras', gloss: 'head' },
  ],
  በፊት: [{ roman: 'befit', gloss: 'before' }],
  ወይስ: [{ roman: 'weys', gloss: 'or (asking)' }],
  ያምሃል: [
    { roman: 'yam', gloss: 'it hurts' },
    { roman: '-ihal', gloss: 'you (man)' },
  ],
  እግሬን: [
    { roman: 'igr', gloss: 'leg, foot' },
    { roman: '-e', gloss: 'my' },
    { roman: '-n', gloss: '(acted on)' },
  ],
  ጥርሴን: [
    { roman: 'tirs', gloss: 'tooth' },
    { roman: '-e', gloss: 'my' },
    { roman: '-n', gloss: '(acted on)' },
  ],
  ዓይኔን: [
    { roman: 'ayn', gloss: 'eye' },
    { roman: '-e', gloss: 'my' },
    { roman: '-n', gloss: '(acted on)' },
  ],
  ከመቼ: [
    { roman: 'ke-', gloss: 'from' },
    { roman: 'meche', gloss: 'when' },
  ],
  ጀምሮ: [{ roman: 'jemiro', gloss: 'starting' }],
  ቀጠሮ: [{ roman: 'qetero', gloss: 'appointment' }],
  አለኝ: [
    { roman: 'alle', gloss: 'there is' },
    { roman: '-gn', gloss: 'to me' },
  ],
  ወደቅኩ: [
    { roman: 'wedeq', gloss: 'fell' },
    { roman: '-ku', gloss: 'I' },
  ],
  ልጠይቅህ: [
    { roman: 'li-', gloss: 'so I can' },
    { roman: 'tiyiq', gloss: 'ask after' },
    { roman: '-ih', gloss: 'you (man)' },
  ],
  አይዞህ: [{ roman: 'ayzoh', gloss: 'hang in there (man)' }],
  ብዙ: [{ roman: 'bizu', gloss: 'a lot' }],
  ውሃ: [{ roman: 'wiha', gloss: 'water' }],
  ቶሎ: [{ roman: 'tolo', gloss: 'soon, quickly' }],
  ይሻልህ: [
    { roman: 'yi-', gloss: 'may it' },
    { roman: 'shal', gloss: 'get better' },
    { roman: '-ih', gloss: 'for you (man)' },
  ],
  ላምጣልህ: [
    { roman: 'la-', gloss: 'shall I' },
    { roman: 'mta', gloss: 'bring' },
    { roman: '-llih', gloss: 'for you (man)' },
  ],
  ስለመጣህ: [
    { roman: 'sile-', gloss: 'because' },
    { roman: 'meta', gloss: 'came' },
    { roman: '-h', gloss: 'you (man)' },
  ],
  መምጣትህ: [
    { roman: 'memtat', gloss: 'coming' },
    { roman: '-ih', gloss: 'your (man)' },
  ],
  ይበቃል: [
    { roman: 'yi-', gloss: 'it' },
    { roman: 'beqa', gloss: 'be enough' },
    { roman: '-al', gloss: '(now)' },
  ],
  // Camp 10
  ሠርግ: [{ roman: 'serg', gloss: 'wedding' }],
  ሠርጉ: [
    { roman: 'serg', gloss: 'wedding' },
    { roman: '-u', gloss: 'the' },
  ],
  ሙሽራ: [{ roman: 'mushira', gloss: 'groom' }],
  ሙሽሪት: [{ roman: 'mushirit', gloss: 'bride' }],
  አላችሁ: [
    { roman: 'ala', gloss: 'there is, it felt' },
    { roman: '-chihu', gloss: 'to you all' },
  ],
  ይባርካችሁ: [
    { roman: 'yi-', gloss: 'may (God)' },
    { roman: 'bark', gloss: 'bless' },
    { roman: '-achihu', gloss: 'you all' },
  ],
  እንጨፍር: [
    { roman: 'in-', gloss: 'let’s' },
    { roman: 'chefir', gloss: 'dance' },
  ],
  እንጨፍራለን: [
    { roman: 'in-', gloss: 'we' },
    { roman: 'chefir', gloss: 'dance' },
    { roman: '-alen', gloss: '(will)' },
  ],
  ሕፃን: [{ roman: 'hitsan', gloss: 'baby' }],
  ወንድ: [{ roman: 'wend', gloss: 'male, boy' }],
  ሴት: [{ roman: 'set', gloss: 'female, girl' }],
  ማረችሽ: [
    { roman: 'marech', gloss: 'she had mercy' },
    { roman: '-ish', gloss: 'on you (woman)' },
  ],
  ስሙ: [
    { roman: 'sim', gloss: 'name' },
    { roman: '-u', gloss: 'his' },
  ],
  ስሟ: [
    { roman: 'sim', gloss: 'name' },
    { roman: '-wa', gloss: 'her' },
  ],
  ያሳድግላችሁ: [
    { roman: 'ya-', gloss: 'may (God)' },
    { roman: 'sadig', gloss: 'raise' },
    { roman: '-lachihu', gloss: 'for you all' },
  ],
  ለቅሶ: [{ roman: 'leqso', gloss: 'mourning' }],
  ሐዘን: [{ roman: 'hazen', gloss: 'grief' }],
  አዝናለሁ: [
    { roman: 'azn', gloss: 'grieve (I)' },
    { roman: '-alehu', gloss: '(now)' },
  ],
  ነፍስ: [{ roman: 'nefs', gloss: 'soul' }],
  ይማር: [
    { roman: 'yi-', gloss: 'may (God)' },
    { roman: 'mar', gloss: 'have mercy on' },
  ],
  ያጽናችሁ: [
    { roman: 'ya-', gloss: 'may (God)' },
    { roman: 'tsna', gloss: 'comfort' },
    { roman: '-chihu', gloss: 'you all' },
  ],
  አይዟችሁ: [
    { roman: 'ayzwa', gloss: 'take heart' },
    { roman: '-chihu', gloss: 'you all' },
  ],
  ጾም: [{ roman: 'tsom', gloss: 'fast, fasting' }],
  ጾመኛ: [
    { roman: 'tsom', gloss: 'fast' },
    { roman: '-egna', gloss: 'one who (does it)' },
  ],
  ሥጋ: [{ roman: 'siga', gloss: 'meat' }],
  ትበላለህ: [
    { roman: 'ti-', gloss: 'you (man)' },
    { roman: 'bela', gloss: 'eat' },
    { roman: '-leh', gloss: '(now)' },
  ],
  እናዝዝ: [
    { roman: 'in-', gloss: 'let’s' },
    { roman: 'azziz', gloss: 'order' },
  ],
  ሽሮ: [{ roman: 'shiro', gloss: 'shiro (chickpea stew)' }],
  ቢፈቅድ: [
    { roman: 'bi-', gloss: 'if' },
    { roman: 'feqid', gloss: 'he permits' },
  ],
  ይቅናህ: [
    { roman: 'yi-', gloss: 'may it' },
    { roman: 'qna', gloss: 'go well' },
    { roman: '-h', gloss: 'for you (man)' },
  ],
  እመለሳለሁ: [
    { roman: 'i-', gloss: 'I' },
    { roman: 'meles', gloss: 'return' },
    { roman: '-alehu', gloss: '(now, later)' },
  ],
  // Camp 11
  መናኸሪያ: [{ roman: 'menahariya', gloss: 'bus station' }],
  አውቶቡስ: [{ roman: 'awtobus', gloss: 'bus' }],
  አውቶቡሱ: [
    { roman: 'awtobus', gloss: 'bus' },
    { roman: '-u', gloss: 'the' },
  ],
  ትኬት: [{ roman: 'tiket', gloss: 'ticket' }],
  ይነሳል: [
    { roman: 'yi-', gloss: 'it' },
    { roman: 'nesa', gloss: 'set off' },
    { roman: '-al', gloss: '(now, later)' },
  ],
  ይፈጃል: [
    { roman: 'yi-', gloss: 'it' },
    { roman: 'feja', gloss: 'take (time)' },
    { roman: '-al', gloss: '(now)' },
  ],
  ገደማ: [{ roman: 'gedema', gloss: 'about' }],
  ሌሊት: [{ roman: 'lelit', gloss: 'night' }],
  ለአንድ: [
    { roman: 'le-', gloss: 'for' },
    { roman: 'and', gloss: 'one' },
  ],
  ለስንት: [
    { roman: 'le-', gloss: 'for' },
    { roman: 'sint', gloss: 'how many' },
  ],
  ቁልፍ: [{ roman: 'qulf', gloss: 'key' }],
  ቁልፉ: [
    { roman: 'qulf', gloss: 'key' },
    { roman: '-u', gloss: 'the' },
  ],
  ሙቅ: [{ roman: 'muq', gloss: 'hot' }],
  ይኸው: [{ roman: 'yihew', gloss: 'here it is' }],
  ጫማ: [{ roman: 'chama', gloss: 'shoes' }],
  ጫማህን: [
    { roman: 'chama', gloss: 'shoes' },
    { roman: '-ih', gloss: 'your (man)' },
    { roman: '-n', gloss: '(acted on)' },
  ],
  አውልቅ: [{ roman: 'awliq', gloss: 'take off! (man)' }],
  ማንሳት: [{ roman: 'mansat', gloss: 'to take (a photo)' }],
  ይቻላል: [
    { roman: 'yi-', gloss: 'it' },
    { roman: 'chal', gloss: 'is possible' },
    { roman: '-al', gloss: '(now)' },
  ],
  ካህን: [{ roman: 'kahin', gloss: 'priest' }],
  የመግቢያ: [
    { roman: 'ye-', gloss: 'of' },
    { roman: 'megbiya', gloss: 'entrance' },
  ],
  መጀመሪያ: [{ roman: 'mejemerya', gloss: 'first' }],
  ድንጋይ: [{ roman: 'dingay', gloss: 'stone, rock' }],
  ከተማ: [{ roman: 'ketema', gloss: 'town, city' }],
  ይባላል: [
    { roman: 'yi-', gloss: 'it' },
    { roman: 'bal', gloss: 'is called' },
    { roman: '-al', gloss: '(now)' },
  ],
  ቋንቋ: [{ roman: 'qwanqwa', gloss: 'language' }],
  ይናገራሉ: [
    { roman: 'yi-', gloss: 'they' },
    { roman: 'nager', gloss: 'speak' },
    { roman: '-alu', gloss: '(now)' },
  ],
  ሰዎቹ: [
    { roman: 'sew', gloss: 'person' },
    { roman: '-och', gloss: '(plural)' },
    { roman: '-u', gloss: 'the' },
  ],
  ይሉታል: [
    { roman: 'yilu', gloss: 'they call' },
    { roman: '-tal', gloss: 'it' },
  ],
  ጉዞ: [{ roman: 'guzo', gloss: 'trip' }],
  ጉዞው: [
    { roman: 'guzo', gloss: 'trip' },
    { roman: '-w', gloss: 'the' },
  ],
  ነበር: [{ roman: 'neber', gloss: 'was' }],
  በአውሮፕላን: [
    { roman: 'be-', gloss: 'by' },
    { roman: 'awroplan', gloss: 'plane' },
  ],
  በአውቶቡስ: [
    { roman: 'be-', gloss: 'by' },
    { roman: 'awtobus', gloss: 'bus' },
  ],
  የሚል: [{ roman: 'yemil', gloss: 'that is (lit. that says)' }],
  እንደገና: [{ roman: 'indegena', gloss: 'again' }],
  መሄድ: [
    { roman: 'me-', gloss: 'to' },
    { roman: 'hed', gloss: 'go' },
  ],
  የሄድከው: [
    { roman: 'ye-', gloss: 'that' },
    { roman: 'hed', gloss: 'went' },
    { roman: '-k', gloss: 'you (man)' },
    { roman: '-ew', gloss: 'the one' },
  ],
  // Camp 1, Lesson 2
  ስሜ: [
    { roman: 'səm', gloss: 'name' },
    { roman: '-e', gloss: 'my' },
  ],
  ስምህ: [
    { roman: 'səmm', gloss: 'name' },
    { roman: '-əh', gloss: 'your (man)' },
  ],
  ስምሽ: [
    { roman: 'səmm', gloss: 'name' },
    { roman: '-əsh', gloss: 'your (woman)' },
  ],
  ነው: [{ roman: 'new', gloss: 'is' }],
  ነኝ: [
    { roman: 'ne', gloss: 'be' },
    { roman: '-ñ', gloss: 'I' },
  ],
  ማን: [{ roman: 'man', gloss: 'who' }],
  እባክህ: [
    { roman: 'əbbak', gloss: 'please (I beg)' },
    { roman: '-əh', gloss: 'you (man)' },
  ],
  እባክሽ: [
    { roman: 'əbbak', gloss: 'please (I beg)' },
    { roman: '-əsh', gloss: 'you (woman)' },
  ],
  ከአሜሪካ: [
    { roman: 'kə-', gloss: 'from' },
    { roman: 'Amerika', gloss: 'America' },
  ],
  ከኢትዮጵያ: [
    { roman: 'kə-', gloss: 'from' },
    { roman: 'Ityopya', gloss: 'Ethiopia' },
  ],
  መጣሁ: [
    { roman: 'metta', gloss: 'came' },
    { roman: '-hu', gloss: 'I' },
  ],
};

const PUNCTUATION = /[።፣፤፥፦፧?!.,…]/g;

export function grammarFor(slug: string, lessonIndex: number): GrammarCard[] {
  return CARDS[`${slug}:${lessonIndex}`] ?? [];
}

export function familiesFor(slug: string, lessonIndex: number): WordFamily[] {
  return FAMILIES[`${slug}:${lessonIndex}`] ?? [];
}

/** The pieces of one written word (punctuation ignored), if we know them. */
export function partsOf(word: string): WordPart[] | null {
  return PARTS[word.replace(PUNCTUATION, '').trim()] ?? null;
}

/** A line split into its words, each with its pieces when known. */
export function wordsOf(line: string): { word: string; parts: WordPart[] | null }[] {
  return line
    .split(/\s+/)
    .filter(Boolean)
    .map(word => ({ word, parts: partsOf(word) }));
}

/** Whether any word in the lesson's phrases can be broken down. */
export function hasBreakdowns(lesson: LessonSection) {
  return (lesson.phrases ?? []).some(p => wordsOf(p.amharic).some(w => w.parts));
}
