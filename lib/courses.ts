import { englishCatalog, englishCourses } from '@/lib/courses-english';

export type LessonSection = {
  title: string;
  description: string;
  phrases?: {
    amharic: string;
    transliteration: string;
    english: string;
  }[];
  dialogue?: {
    speaker: 'A' | 'B';
    amharic: string;
    transliteration: string;
    english: string;
  }[];
  /** A short culture or grammar tip shown with the lesson. */
  note?: string;
  /**
   * The same sentence said to a man, a woman and an elder, for
   * "Who are you talking to?" practice questions.
   */
  respect?: { english: string; man: string; woman: string; elder: string }[];
};

export type Course = {
  title: string;
  intro?: string;
  sections: LessonSection[];
};

export const courseContent: Record<string, Course> = {
  // Amharic part 1
  'amharic-beginner-1': {
    title: 'Amharic Camp 1 – Greetings & First Words',
    intro:
      'Start speaking from day one with simple greetings, introductions, and polite phrases.',
    sections: [
      {
        title: 'Lesson 1 – Greetings',
        description:
          'Learn how to say hello, ask “How are you?”, and respond politely.',
        phrases: [
          { amharic: 'ሰላም', transliteration: 'selam', english: 'Hello / Peace' },
          {
            amharic: 'ሰላም እንዴት ነህ?',
            transliteration: 'selam, endet neh?',
            english: 'Hello, how are you? (to a man)',
          },
          {
            amharic: 'ሰላም እንዴት ነሽ?',
            transliteration: 'selam, endet nesh?',
            english: 'Hello, how are you? (to a woman)',
          },
          {
            amharic: 'ደህና ነኝ፣ አንተስ?',
            transliteration: 'dehna neñ, antes?',
            english: 'I am fine, and you? (to a man)',
          },
          {
            amharic: 'ደህና ነኝ፣ አንቺስ?',
            transliteration: 'dehna neñ, anchis?',
            english: 'I am fine, and you? (to a woman)',
          },
          {
            amharic: 'እግዚአብሔር ይመስገን',
            transliteration: 'əgziabher yimmesgen',
            english: 'Thanks be to God (common polite response)',
          },
        ],
        dialogue: [
          {
            speaker: 'A',
            amharic: 'ሰላም እንዴት ነህ?',
            transliteration: 'selam, endet neh?',
            english: 'Hello, how are you? (to a man)',
          },
          {
            speaker: 'B',
            amharic: 'ደህና ነኝ፣ አንተስ?',
            transliteration: 'dehna neñ, antes?',
            english: 'I am fine, and you?',
          },
          {
            speaker: 'A',
            amharic: 'ደህና ነኝ፣ እግዚአብሔር ይመስገን።',
            transliteration: 'dehna neñ, əgziabher yimmesgen.',
            english: 'I am fine, thanks be to God.',
          },
        ],
      },
      {
        title: 'Lesson 2 – Introducing Yourself',
        description:
          'Learn to say your name, ask for someone else’s name, and say where you are from.',
        phrases: [
          {
            amharic: 'ስሜ ... ነው።',
            transliteration: 'səme ... new.',
            english: 'My name is ....',
          },
          {
            amharic: 'ስምህ ማን ነው?',
            transliteration: 'səmməh man new?',
            english: 'What is your name? (to a man)',
          },
          {
            amharic: 'ስምሽ ማን ነው?',
            transliteration: 'səmməsh man new?',
            english: 'What is your name? (to a woman)',
          },
          {
            amharic: 'እባክህ ስምህ?',
            transliteration: 'əbbakih, səmməh?',
            english: 'Your name, please? (to a man)',
          },
          {
            amharic: 'እባክሽ ስምሽ?',
            transliteration: 'əbbakish, səmməsh?',
            english: 'Your name, please? (to a woman)',
          },
          {
            amharic: 'ከአሜሪካ ነኝ።',
            transliteration: 'kə Amerika neñ.',
            english: 'I am from America.',
          },
          {
            amharic: 'ከአሜሪካ መጣሁ።',
            transliteration: 'kə Amerika metahu.',
            english: 'I came from America.',
          },
          {
            amharic: 'ከኢትዮጵያ መጣሁ።',
            transliteration: 'kə Ityopya metahu.',
            english: 'I came from Ethiopia.',
          },
        ],
        dialogue: [
          {
            speaker: 'A',
            amharic: 'ሰላም፣ ስሜ ዳዊት ነው። ስምህ ማን ነው?',
            transliteration: 'selam, səme Dawit new. səmməh man new?',
            english: 'Hello, my name is Dawit. What is your name?',
          },
          {
            speaker: 'B',
            amharic: 'ስሜ አሌክስ ነው። ከአሜሪካ መጣሁ።',
            transliteration: 'səme Alex new. kə Amerika metahu.',
            english: 'My name is Alex. I came from America.',
          },
          {
            speaker: 'A',
            amharic: 'እንኳን ደህና መጣህ፣ አሌክስ።',
            transliteration: 'ənkwan dehna metah, Alex.',
            english: 'Welcome, Alex.',
          },
        ],
      },
      {
        title: 'Lesson 3 – Thank You & Sorry',
        description:
          'Practice አመሰግናለሁ (amesegenallo) and ይቅርታ (yiqirta) in simple situations.',
        phrases: [
          {
            amharic: 'አመሰግናለሁ',
            transliteration: 'amesegenallo',
            english: 'Thank you (formal / general)',
          },
          {
            amharic: 'በጣም አመሰግናለሁ',
            transliteration: 'betam amesegenallo',
            english: 'Thank you very much.',
          },
          {
            amharic: 'ምንም አይደለም',
            transliteration: 'minim aydelem',
            english: 'You’re welcome / It’s nothing.',
          },
          {
            amharic: 'ይቅርታ',
            transliteration: 'yiqirta',
            english: 'Sorry / Excuse me',
          },
          {
            amharic: 'ይቅርታ አድርግልኝ',
            transliteration: 'yiqirta adrigilliñ',
            english: 'Please forgive me (to a man)',
          },
          {
            amharic: 'ይቅርታ አድርጊልኝ',
            transliteration: 'yiqirta adrigiilliñ',
            english: 'Please forgive me (to a woman)',
          },
        ],
        dialogue: [
          {
            speaker: 'A',
            amharic: 'ይቅርታ፣ መንገድህን ዘጋሁ።',
            transliteration: 'yiqirta, mengedihin zegahu.',
            english: 'Sorry, I was blocking your way.',
          },
          {
            speaker: 'B',
            amharic: 'ምንም አይደለም።',
            transliteration: 'minim aydelem.',
            english: 'It’s nothing / no problem.',
          },
          {
            speaker: 'A',
            amharic: 'በጣም አመሰግናለሁ።',
            transliteration: 'betam amesegenallo.',
            english: 'Thank you very much.',
          },
        ],
      },
      {
        title: 'Lesson 4 – Yes, No & Simple Answers',
        description:
          'Answer questions with yes, no, maybe, and the most useful beginner phrase: a little bit.',
        phrases: [
          { amharic: 'አዎ', transliteration: 'awo', english: 'yes' },
          { amharic: 'አይ', transliteration: 'ay', english: 'no' },
          { amharic: 'አይደለም', transliteration: 'aydelem', english: 'it is not / no, that\'s not it' },
          { amharic: 'ትክክል', transliteration: 'tikikil', english: 'correct / right' },
          { amharic: 'አላውቅም', transliteration: 'alawqim', english: 'I don\'t know' },
          { amharic: 'ገባኝ', transliteration: 'gebagn', english: 'I understand' },
          { amharic: 'አልገባኝም', transliteration: 'algebagnim', english: 'I don\'t understand' },
          { amharic: 'ምናልባት', transliteration: 'minalbat', english: 'maybe' },
        ],
        dialogue: [
          {
            speaker: 'A',
            amharic: 'አማርኛ ትናገራለህ?',
            transliteration: 'amarigna tinageraleh?',
            english: 'Do you speak Amharic? (to a man)',
          },
          {
            speaker: 'B',
            amharic: 'ትንሽ ትንሽ እናገራለሁ።',
            transliteration: 'tinish tinish inageralehu.',
            english: 'I speak a little bit.',
          },
        ],
        note:
          'ትንሽ ትንሽ (tinish tinish, “a little bit”) is the perfect beginner answer. People light up when you try.',
      },
      {
        title: 'Lesson 5 – Goodbye & See You',
        description:
          'Say goodbye the right way to a man, a woman, or a group, and make plans to meet again.',
        phrases: [
          { amharic: 'ቻው', transliteration: 'chaw', english: 'bye (casual)' },
          { amharic: 'ደህና ሁን', transliteration: 'dehna hun', english: 'goodbye / stay well (to a man)' },
          { amharic: 'ደህና ሁኚ', transliteration: 'dehna hunyi', english: 'goodbye / stay well (to a woman)' },
          { amharic: 'ደህና ሁኑ', transliteration: 'dehna hunu', english: 'goodbye (to a group, or politely)' },
          { amharic: 'በኋላ እንገናኝ', transliteration: 'behwala inigenagn', english: 'see you later' },
          { amharic: 'ነገ እንገናኝ', transliteration: 'nege inigenagn', english: 'see you tomorrow' },
          { amharic: 'ደህና እደር', transliteration: 'dehna ider', english: 'good night (to a man)' },
          { amharic: 'ደህና እደሪ', transliteration: 'dehna ideri', english: 'good night (to a woman)' },
        ],
        dialogue: [
          {
            speaker: 'A',
            amharic: 'እሺ፣ መሄድ አለብኝ።',
            transliteration: 'ishi, mehed alebign.',
            english: 'Okay, I have to go.',
          },
          {
            speaker: 'B',
            amharic: 'እሺ፣ ደህና ሁን! ነገ እንገናኝ።',
            transliteration: 'ishi, dehna hun! nege inigenagn.',
            english: 'Okay, goodbye! See you tomorrow.',
          },
        ],
        note:
          'Goodbyes change with who you\'re talking to: ሁን to a man, ሁኚ to a woman, ሁኑ to a group or an elder.',
      },
      {
        title: 'Lesson 6 – Talking to Elders',
        description:
          'Show respect the Ethiopian way: talk to grandparents, elders and strangers with እርስዎ (ərswo).',
        phrases: [
          { amharic: 'እርስዎ', transliteration: 'ərswo', english: 'you (respectful, for elders and people you don’t know)' },
          { amharic: 'እንዴት ኖት?', transliteration: 'endet not?', english: 'How are you? (to an elder)' },
          { amharic: 'እንደምን አደሩ?', transliteration: 'əndemin aderu?', english: 'Good morning (to an elder)' },
          { amharic: 'ስምዎ ማን ነው?', transliteration: 'səmwo man new?', english: 'What is your name? (to an elder)' },
          { amharic: 'ጤናዎ እንዴት ነው?', transliteration: 'tenawo endet new?', english: 'How is your health? (to an elder)' },
          { amharic: 'እባክዎ', transliteration: 'əbakwo', english: 'please (to an elder)' },
          { amharic: 'ይቀመጡ', transliteration: 'yiqemetu', english: 'please sit down (to an elder)' },
          { amharic: 'ደህና ይሁኑ', transliteration: 'dehna yihunu', english: 'goodbye / stay well (to an elder)' },
        ],
        dialogue: [
          {
            speaker: 'A',
            amharic: 'እንደምን አደሩ፣ አያቴ?',
            transliteration: 'əndemin aderu, ayate?',
            english: 'Good morning, Grandma! (respectful)',
          },
          {
            speaker: 'B',
            amharic: 'ደህና ነኝ ልጄ፣ እግዚአብሔር ይመስገን። ግባ፣ ተቀመጥ።',
            transliteration: 'dehna neñ lije, əgziabher yimmesgen. giba, teqemet.',
            english: 'I’m fine, my child, thank God. Come in, sit down.',
          },
          {
            speaker: 'A',
            amharic: 'አመሰግናለሁ። ጤናዎ እንዴት ነው?',
            transliteration: 'amesegenallo. tenawo endet new?',
            english: 'Thank you. How is your health? (respectful)',
          },
          {
            speaker: 'B',
            amharic: 'ደህና ነው፣ እግዚአብሔር ይመስገን።',
            transliteration: 'dehna new, əgziabher yimmesgen.',
            english: 'It’s good, thank God.',
          },
        ],
        respect: [
          { english: 'How are you?', man: 'እንዴት ነህ?', woman: 'እንዴት ነሽ?', elder: 'እንዴት ኖት?' },
          { english: 'What is your name?', man: 'ስምህ ማን ነው?', woman: 'ስምሽ ማን ነው?', elder: 'ስምዎ ማን ነው?' },
          { english: 'Please', man: 'እባክህ', woman: 'እባክሽ', elder: 'እባክዎ' },
          { english: 'Please sit down', man: 'ተቀመጥ', woman: 'ተቀመጪ', elder: 'ይቀመጡ' },
          { english: 'Come in', man: 'ግባ', woman: 'ግቢ', elder: 'ይግቡ' },
          { english: 'Goodbye, stay well', man: 'ደህና ሁን', woman: 'ደህና ሁኚ', elder: 'ደህና ይሁኑ' },
        ],
        note:
          'In Ethiopia, how you say “you” shows respect. Use እርስዎ with grandparents, elders, teachers and people you don’t know, and the endings change too: ስምህ → ስምዎ, እባክህ → እባክዎ. Elders will still talk to you casually (ግባ, ተቀመጥ), and that’s normal. You’ll also hear እንዴት ነዎት?, which means the same as እንዴት ኖት?',
      },
    ],
  },

  // Amharic part 2
  'amharic-beginner-2': {
    title: 'Amharic Camp 2 – Numbers, Family & People',
    intro:
      'Build on the basics with numbers, family vocabulary, and high‑frequency everyday expressions.',
    sections: [
      {
        title: 'Lesson 1 – Numbers & Counting',
        description:
          'Count from one to ten: the building blocks for prices, time, and quantities.',
        phrases: [
          { amharic: 'አንድ', transliteration: 'and', english: 'one' },
          { amharic: 'ሁለት', transliteration: 'hulet', english: 'two' },
          { amharic: 'ሦስት', transliteration: 'sost', english: 'three' },
          { amharic: 'አራት', transliteration: 'arat', english: 'four' },
          { amharic: 'አምስት', transliteration: 'amist', english: 'five' },
          { amharic: 'ስድስት', transliteration: 'sidist', english: 'six' },
          { amharic: 'ሰባት', transliteration: 'sebat', english: 'seven' },
          { amharic: 'ስምንት', transliteration: 'siminit', english: 'eight' },
          { amharic: 'ዘጠኝ', transliteration: 'zetegn', english: 'nine' },
          { amharic: 'አስር', transliteration: 'asir', english: 'ten' },
        ],
        dialogue: [
          {
            speaker: 'A',
            amharic: 'እባክህ ከአንድ እስከ አስር ቁጥሮችን ተናገር።',
            transliteration: 'əbbakih, ke-and ɨska asir qutər-wotchin tenager.',
            english: 'Please say the numbers from one to ten.',
          },
          {
            speaker: 'B',
            amharic:
              'አንድ፣ ሁለት፣ ሦስት፣ አራት፣ አምስት፣ ስድስት፣ ሰባት፣ ስምንት፣ ዘጠኝ፣ አስር።',
            transliteration:
              'and, hulət, sost, arat, aməst, sɨdɨst, sebāt, səmənt, zäteny, asir.',
            english: 'One, two, three, four, five, six, seven, eight, nine, ten.',
          },
        ],
      },
      {
        title: 'Lesson 2 – Family & People',
        description:
          'Learn common words for family members and how to talk about people around you.',
        phrases: [
          { amharic: 'አባቴ', transliteration: 'abate', english: 'my father' },
          { amharic: 'እናቴ', transliteration: 'ənnate', english: 'my mother' },
          { amharic: 'እህቴ', transliteration: 'əhtē', english: 'my sister' },
          { amharic: 'ወንድሜ', transliteration: 'wəndime', english: 'my brother' },
          {
            amharic: 'አያቴ',
            transliteration: 'ayyate',
            english: 'my grandfather / grandmother (depending on context)',
          },
          { amharic: 'ጓደኛዬ', transliteration: 'gwadenyaye', english: 'my friend' },
        ],
        dialogue: [
          {
            speaker: 'A',
            amharic: 'ቤተሰቦችህ እንዴት ናቸው?',
            transliteration: 'betesebotchih endet nachəw?',
            english: 'How is your family?',
          },
          {
            speaker: 'B',
            amharic:
              'አባቴና እናቴ ደህና ናቸው፣ እህቴም ደህና ናት።',
            transliteration: 'abate-na ənnate dehna nachəw, əhtem dehna nat.',
            english: 'My father and mother are well, my sister is also well.',
          },
        ],
      },
      {
        title: 'Lesson 3 – Everyday Expressions',
        description:
          'Short, high‑frequency phrases you can plug into real life immediately.',
        phrases: [
          { amharic: 'እሺ', transliteration: 'əshi', english: 'Okay / alright' },
          {
            amharic: 'ጊዜ አለህ?',
            transliteration: 'gize alleh?',
            english: 'Do you have time? (to a man)',
          },
          {
            amharic: 'ጊዜ አለሽ?',
            transliteration: 'gize allesh?',
            english: 'Do you have time? (to a woman)',
          },
          {
            amharic: 'አሁን አልችልም',
            transliteration: 'ahun alchilim',
            english: 'I can’t right now.',
          },
          {
            amharic: 'ድጋሚ ተናገር እባክህ',
            transliteration: 'dɨgami tenager əbbakih',
            english: 'Please say it again (to a man).',
          },
          {
            amharic: 'ቀስ ብለህ ተናገር',
            transliteration: 'qes bileh tenager',
            english: 'Speak slowly. (to a man)',
          },
        ],
        dialogue: [
          {
            speaker: 'A',
            amharic: 'ጊዜ አለህ? ትንሽ ላናግርህ እፈልጋለሁ።',
            transliteration: 'gize alleh? tɨnɨsh lanagrih əfelləgalləhu.',
            english: 'Do you have time? I’d like to talk with you a little.',
          },
          {
            speaker: 'B',
            amharic: 'እሺ፣ ነገ እንነጋገር።',
            transliteration: 'əshi, nege ənnəgager.',
            english: 'Okay, let’s talk tomorrow.',
          },
        ],
      },
      {
        title: 'Lesson 4 – Bigger Numbers & Prices',
        description:
          'Count past ten and ask what things cost, so you can handle money at shops and markets.',
        phrases: [
          { amharic: 'አስራ አምስት', transliteration: 'asra amist', english: 'fifteen' },
          { amharic: 'ሃያ', transliteration: 'haya', english: 'twenty' },
          { amharic: 'ሰላሳ', transliteration: 'selasa', english: 'thirty' },
          { amharic: 'ሃምሳ', transliteration: 'hamsa', english: 'fifty' },
          { amharic: 'መቶ', transliteration: 'meto', english: 'one hundred' },
          { amharic: 'ሺህ', transliteration: 'shih', english: 'one thousand' },
          { amharic: 'ብር', transliteration: 'birr', english: 'birr (Ethiopian money)' },
          { amharic: 'ስንት ነው?', transliteration: 'sint new?', english: 'How much is it?' },
        ],
        dialogue: [
          {
            speaker: 'A',
            amharic: 'ይሄ ስንት ነው?',
            transliteration: 'yihe sint new?',
            english: 'How much is this?',
          },
          {
            speaker: 'B',
            amharic: 'ሃምሳ ብር ነው።',
            transliteration: 'hamsa birr new.',
            english: 'It\'s fifty birr.',
          },
        ],
        note:
          'The teens are አስራ + a number: አስራ አንድ is 11, አስራ ሁለት is 12, and so on.',
      },
      {
        title: 'Lesson 5 – Describing People',
        description:
          'Describe what people are like: tall or short, young or old, kind and clever.',
        phrases: [
          { amharic: 'ረጅም', transliteration: 'rejim', english: 'tall' },
          { amharic: 'አጭር', transliteration: 'achir', english: 'short' },
          { amharic: 'ወጣት', transliteration: 'wetat', english: 'young / a young person' },
          { amharic: 'ሽማግሌ', transliteration: 'shimagile', english: 'old man / elder' },
          { amharic: 'ደግ', transliteration: 'deg', english: 'kind' },
          { amharic: 'ቆንጆ', transliteration: 'qonjo', english: 'beautiful / good-looking' },
          { amharic: 'ጎበዝ', transliteration: 'gobez', english: 'clever / hardworking' },
          { amharic: 'በጣም', transliteration: 'betam', english: 'very' },
        ],
        dialogue: [
          {
            speaker: 'A',
            amharic: 'ወንድምህ ምን ይመስላል?',
            transliteration: 'wendimih min yimeslal?',
            english: 'What is your brother like? (to a man)',
          },
          {
            speaker: 'B',
            amharic: 'ረጅም ነው፣ በጣም ደግ ነው።',
            transliteration: 'rejim new, betam deg new.',
            english: 'He\'s tall, and he\'s very kind.',
          },
        ],
        note:
          'ጎበዝ! (gobez!) is how Ethiopians say “well done!” You\'ll hear it a lot from teachers and parents.',
      },
    ],
  },

  // Amharic Camp 3 – Buna & Food
  'amharic-beginner-3': {
    title: 'Amharic Camp 3 – Buna & Food',
    intro:
      'Coffee, food, tastes, the market, and Ethiopian hospitality.',
    sections: [
      {
        title: 'Lesson 1 – The Coffee Ceremony',
        description:
          'Join a buna ceremony: the words for coffee, the pot, the cups, and how to be invited.',
        phrases: [
          { amharic: 'ቡና', transliteration: 'buna', english: 'coffee' },
          { amharic: 'ቡና ጠጡ', transliteration: 'buna tetu', english: 'come have coffee (to everyone / politely)' },
          { amharic: 'ጀበና', transliteration: 'jebena', english: 'clay coffee pot' },
          { amharic: 'ስኒ', transliteration: 'sini', english: 'small coffee cup' },
          { amharic: 'አቦል', transliteration: 'abol', english: 'the first round of coffee' },
          { amharic: 'ስኳር', transliteration: 'sikwar', english: 'sugar' },
          { amharic: 'ዕጣን', transliteration: 'itan', english: 'incense' },
        ],
        dialogue: [
          {
            speaker: 'A',
            amharic: 'ቡና ጠጡ!',
            transliteration: 'buna tetu!',
            english: 'Come have coffee!',
          },
          {
            speaker: 'B',
            amharic: 'አመሰግናለሁ፣ በስኳር እባክሽ።',
            transliteration: 'ameseginalehu, besikwar ibakish.',
            english: 'Thank you, with sugar please. (to a woman)',
          },
        ],
        note:
          'A coffee ceremony has three rounds: abol, tona, and bereka. Leaving before the third round is a little rude!',
      },
      {
        title: 'Lesson 2 – Ordering Food',
        description:
          'Order a meal: injera, wat, shiro, water, and asking for the bill.',
        phrases: [
          { amharic: 'ምግብ', transliteration: 'migib', english: 'food' },
          { amharic: 'እንጀራ', transliteration: 'injera', english: 'injera (sourdough flatbread)' },
          { amharic: 'ዳቦ', transliteration: 'dabo', english: 'bread' },
          { amharic: 'ወጥ', transliteration: 'wet', english: 'stew (wat)' },
          { amharic: 'ሽሮ', transliteration: 'shiro', english: 'shiro (chickpea stew)' },
          { amharic: 'ውሃ', transliteration: 'wiha', english: 'water' },
          { amharic: '... እፈልጋለሁ', transliteration: '... ifeligalehu', english: 'I want ...' },
          { amharic: 'የጾም ምግብ', transliteration: 'ye-tsom migib', english: 'fasting food (no meat or dairy)' },
          { amharic: 'ሂሳብ እባክህ', transliteration: 'hisab ibakih', english: 'the bill, please (to a man)' },
        ],
        dialogue: [
          {
            speaker: 'A',
            amharic: 'ምን ይፈልጋሉ?',
            transliteration: 'min yifeligalu?',
            english: 'What would you like? (polite)',
          },
          {
            speaker: 'B',
            amharic: 'ሽሮና ውሃ እፈልጋለሁ።',
            transliteration: 'shiro-na wiha ifeligalehu.',
            english: 'I\'d like shiro and water.',
          },
        ],
        note:
          'On Wednesdays and Fridays many Ethiopians eat fasting food, with no meat or dairy. Restaurants always have it.',
      },
      {
        title: 'Lesson 3 – Tastes',
        description:
          'Say what you think of the food: delicious, spicy, salty, hot, or cold.',
        phrases: [
          { amharic: 'ይጣፍጣል', transliteration: 'yitafital', english: 'it\'s delicious' },
          { amharic: 'ጣፋጭ', transliteration: 'tafach', english: 'sweet / tasty' },
          { amharic: 'ያቃጥላል', transliteration: 'yaqatilal', english: 'it\'s spicy hot (literally: it burns)' },
          { amharic: 'በርበሬ', transliteration: 'berbere', english: 'berbere (chili spice mix)' },
          { amharic: 'ጨው', transliteration: 'chew', english: 'salt' },
          { amharic: 'ትኩስ', transliteration: 'tikus', english: 'hot / fresh' },
          { amharic: 'ቀዝቃዛ', transliteration: 'qezqaza', english: 'cold' },
          { amharic: 'በጣም ጥሩ ነው', transliteration: 'betam tiru new', english: 'it\'s very good' },
        ],
        dialogue: [
          {
            speaker: 'A',
            amharic: 'ወጡ እንዴት ነው?',
            transliteration: 'wetu indet new?',
            english: 'How is the stew?',
          },
          {
            speaker: 'B',
            amharic: 'በጣም ይጣፍጣል፣ ግን ያቃጥላል!',
            transliteration: 'betam yitafital, gin yaqatilal!',
            english: 'Very delicious, but spicy hot!',
          },
        ],
        note:
          'Berbere is a red mix of chili and many spices. It\'s in almost every wat.',
      },
      {
        title: 'Lesson 4 – At the Market',
        description:
          'Shop at the open market: fruit and vegetables, prices, and asking for a better deal.',
        phrases: [
          { amharic: 'ገበያ', transliteration: 'gebeya', english: 'market' },
          { amharic: 'ይሄ ስንት ነው?', transliteration: 'yihe sint new?', english: 'How much is this?' },
          { amharic: 'ውድ ነው', transliteration: 'wid new', english: 'it\'s expensive' },
          { amharic: 'ቀንስልኝ', transliteration: 'qenisilign', english: 'lower the price for me (to a man)' },
          { amharic: 'ኪሎ', transliteration: 'kilo', english: 'kilo' },
          { amharic: 'ሙዝ', transliteration: 'muz', english: 'banana' },
          { amharic: 'ቲማቲም', transliteration: 'timatim', english: 'tomato' },
          { amharic: 'ሽንኩርት', transliteration: 'shinkurt', english: 'onion' },
        ],
        dialogue: [
          {
            speaker: 'A',
            amharic: 'ሙዝ ስንት ነው?',
            transliteration: 'muz sint new?',
            english: 'How much are the bananas?',
          },
          {
            speaker: 'B',
            amharic: 'አንድ ኪሎ ስልሳ ብር።',
            transliteration: 'and kilo silsa birr.',
            english: 'One kilo is sixty birr.',
          },
          {
            speaker: 'A',
            amharic: 'ውድ ነው! ቀንስልኝ።',
            transliteration: 'wid new! qenisilign.',
            english: 'That\'s expensive! Give me a better price.',
          },
        ],
        note:
          'Bargaining is normal at open markets like Merkato in Addis Ababa, but not in supermarkets.',
      },
      {
        title: 'Lesson 5 – Being a Guest',
        description:
          'Visit someone\'s home: being welcomed, being told to eat, gursha, and saying you\'re full.',
        phrases: [
          { amharic: 'እንኳን ደህና መጣህ', transliteration: 'inkwan dehna metah', english: 'welcome (to a man)' },
          { amharic: 'እንኳን ደህና መጣሽ', transliteration: 'inkwan dehna metash', english: 'welcome (to a woman)' },
          { amharic: 'ብላ', transliteration: 'bila', english: 'eat! (to a man)' },
          { amharic: 'ብዪ', transliteration: 'biyi', english: 'eat! (to a woman)' },
          { amharic: 'ጉርሻ', transliteration: 'gursha', english: 'gursha (feeding someone a bite by hand)' },
          { amharic: 'ጠገብኩ', transliteration: 'tegebku', english: 'I\'m full' },
          { amharic: 'በቃኝ', transliteration: 'beqagn', english: 'that\'s enough for me' },
          { amharic: 'ቤትህ ያምራል', transliteration: 'betih yamral', english: 'your home is beautiful (to a man)' },
        ],
        dialogue: [
          {
            speaker: 'A',
            amharic: 'ብላ፣ ብላ!',
            transliteration: 'bila, bila!',
            english: 'Eat, eat!',
          },
          {
            speaker: 'B',
            amharic: 'አመሰግናለሁ፣ ጠገብኩ!',
            transliteration: 'ameseginalehu, tegebku!',
            english: 'Thank you, I\'m full!',
          },
        ],
        note:
          'Hosts keep offering food. Saying ጠገብኩ a few times is part of the ritual, and a gursha is a sign of love and respect.',
      },
    ],
  },

  // Amharic Camp 4 – Getting Around
  'amharic-beginner-4': {
    title: 'Amharic Camp 4 – Getting Around',
    intro:
      'Directions, taxis and bajajs, Ethiopian time, the days of the week, and places in town.',
    sections: [
      {
        title: 'Lesson 1 – Directions',
        description:
          'Ask where something is and understand left, right, straight, near, and far.',
        phrases: [
          { amharic: '... የት ነው?', transliteration: '... yet new?', english: 'Where is ...?' },
          { amharic: 'ቀኝ', transliteration: 'qegn', english: 'right' },
          { amharic: 'ግራ', transliteration: 'gira', english: 'left' },
          { amharic: 'ቀጥታ', transliteration: 'qetita', english: 'straight ahead' },
          { amharic: 'እዚህ', transliteration: 'izih', english: 'here' },
          { amharic: 'እዚያ', transliteration: 'iziya', english: 'there' },
          { amharic: 'ቅርብ ነው', transliteration: 'qirib new', english: 'it\'s near' },
          { amharic: 'ሩቅ ነው', transliteration: 'ruq new', english: 'it\'s far' },
        ],
        dialogue: [
          {
            speaker: 'A',
            amharic: 'ይቅርታ፣ ሆቴሉ የት ነው?',
            transliteration: 'yiqirta, hotelu yet new?',
            english: 'Excuse me, where is the hotel?',
          },
          {
            speaker: 'B',
            amharic: 'ቀጥታ ሂድ፣ ከዚያ ወደ ቀኝ።',
            transliteration: 'qetita hid, keziya wede qegn.',
            english: 'Go straight, then turn right. (to a man)',
          },
        ],
        note:
          'People often give directions with landmarks, like “past the church,” instead of street names.',
      },
      {
        title: 'Lesson 2 – Taxi & Bajaj',
        description:
          'Ride a minibus taxi or a bajaj: where it\'s going, getting in, and getting off.',
        phrases: [
          { amharic: 'ታክሲ', transliteration: 'taksi', english: 'taxi / minibus' },
          { amharic: 'ባጃጅ', transliteration: 'bajaj', english: 'bajaj (three-wheeled taxi)' },
          { amharic: 'ወደ ... እሄዳለሁ', transliteration: 'wede ... ihedalehu', english: 'I\'m going to ...' },
          { amharic: 'ወራጅ አለ', transliteration: 'werraj alle', english: 'someone\'s getting off! (stop, please)' },
          { amharic: 'እዚህ አቁም', transliteration: 'izih aqum', english: 'stop here (to a man)' },
          { amharic: 'ረዳት', transliteration: 'redat', english: 'minibus conductor' },
          { amharic: 'መንገድ', transliteration: 'menged', english: 'road / street' },
          { amharic: 'ግባ', transliteration: 'giba', english: 'get in / come in (to a man)' },
        ],
        dialogue: [
          {
            speaker: 'A',
            amharic: 'ወደ ፒያሳ ነው?',
            transliteration: 'wede Piassa new?',
            english: 'Is this going to Piassa?',
          },
          {
            speaker: 'B',
            amharic: 'አዎ፣ ግባ!',
            transliteration: 'awo, giba!',
            english: 'Yes, get in! (to a man)',
          },
        ],
        note:
          'In a minibus taxi, call out ወራጅ አለ! (werraj alle!) when you want to get off.',
      },
      {
        title: 'Lesson 3 – Telling Time',
        description:
          'Ask the time and talk about parts of the day, including Ethiopian time.',
        phrases: [
          { amharic: 'ሰዓት', transliteration: 'se\'at', english: 'hour / clock / watch' },
          { amharic: 'ሰዓት ስንት ነው?', transliteration: 'se\'at sint new?', english: 'What time is it?' },
          { amharic: 'ጠዋት', transliteration: 'tewat', english: 'morning' },
          { amharic: 'ከሰዓት', transliteration: 'kese\'at', english: 'afternoon' },
          { amharic: 'ማታ', transliteration: 'mata', english: 'evening' },
          { amharic: 'ዛሬ', transliteration: 'zare', english: 'today' },
          { amharic: 'ነገ', transliteration: 'nege', english: 'tomorrow' },
          { amharic: 'ትናንት', transliteration: 'tinant', english: 'yesterday' },
        ],
        dialogue: [
          {
            speaker: 'A',
            amharic: 'ሰዓት ስንት ነው?',
            transliteration: 'se\'at sint new?',
            english: 'What time is it?',
          },
          {
            speaker: 'B',
            amharic: 'ሦስት ሰዓት ነው።',
            transliteration: 'sost se\'at new.',
            english: 'It\'s three o\'clock (9 a.m. in Western time).',
          },
        ],
        note:
          'Ethiopian time starts at sunrise: 1 o\'clock (አንድ ሰዓት) is 7 a.m. Add or subtract 6 hours to switch.',
      },
      {
        title: 'Lesson 4 – Days of the Week',
        description:
          'Learn the seven days so you can make plans.',
        phrases: [
          { amharic: 'እሁድ', transliteration: 'ihud', english: 'Sunday' },
          { amharic: 'ሰኞ', transliteration: 'segno', english: 'Monday' },
          { amharic: 'ማክሰኞ', transliteration: 'maksegno', english: 'Tuesday' },
          { amharic: 'ረቡዕ', transliteration: 'rebu', english: 'Wednesday' },
          { amharic: 'ሐሙስ', transliteration: 'hamus', english: 'Thursday' },
          { amharic: 'ዓርብ', transliteration: 'arb', english: 'Friday' },
          { amharic: 'ቅዳሜ', transliteration: 'qidame', english: 'Saturday' },
          { amharic: 'ሳምንት', transliteration: 'samint', english: 'week' },
        ],
        dialogue: [
          {
            speaker: 'A',
            amharic: 'ዛሬ ምን ቀን ነው?',
            transliteration: 'zare min qen new?',
            english: 'What day is it today?',
          },
          {
            speaker: 'B',
            amharic: 'ዛሬ ዓርብ ነው።',
            transliteration: 'zare arb new.',
            english: 'Today is Friday.',
          },
        ],
        note:
          'The Ethiopian week starts on እሁድ (Sunday).',
      },
      {
        title: 'Lesson 5 – Places in Town',
        description:
          'Name the places you\'ll visit: church, mosque, school, hospital, bank, and shops.',
        phrases: [
          { amharic: 'ቤተ ክርስቲያን', transliteration: 'bete kristiyan', english: 'church' },
          { amharic: 'መስጊድ', transliteration: 'mesgid', english: 'mosque' },
          { amharic: 'ትምህርት ቤት', transliteration: 'timhirt bet', english: 'school' },
          { amharic: 'ሆስፒታል', transliteration: 'hospital', english: 'hospital' },
          { amharic: 'ባንክ', transliteration: 'bank', english: 'bank' },
          { amharic: 'ሱቅ', transliteration: 'suq', english: 'shop' },
          { amharic: 'ቤት', transliteration: 'bet', english: 'house / home' },
          { amharic: 'ካፌ', transliteration: 'kafe', english: 'café' },
        ],
        dialogue: [
          {
            speaker: 'A',
            amharic: 'የት ነው የምትሄደው?',
            transliteration: 'yet new yemitihedew?',
            english: 'Where are you going? (to a man)',
          },
          {
            speaker: 'B',
            amharic: 'ወደ ትምህርት ቤት እሄዳለሁ።',
            transliteration: 'wede timhirt bet ihedalehu.',
            english: 'I\'m going to school.',
          },
        ],
        note:
          'ቤት means house, so ትምህርት ቤት is literally a “learning house,” which is a school.',
      },
    ],
  },

  // Amharic Camp 5 – Daily Life & Feelings
  'amharic-beginner-5': {
    title: 'Amharic Camp 5 – Daily Life & Feelings',
    intro:
      'Talk about your day, your feelings, what you like, your home, and phone calls.',
    sections: [
      {
        title: 'Lesson 1 – My Day',
        description:
          'Say what you did today: got up, ate, drank, went, came, worked, slept.',
        phrases: [
          { amharic: 'ተነሳሁ', transliteration: 'tenesahu', english: 'I got up' },
          { amharic: 'በላሁ', transliteration: 'belahu', english: 'I ate' },
          { amharic: 'ጠጣሁ', transliteration: 'tetahu', english: 'I drank' },
          { amharic: 'ሄድኩ', transliteration: 'hedku', english: 'I went' },
          { amharic: 'መጣሁ', transliteration: 'metahu', english: 'I came' },
          { amharic: 'ሠራሁ', transliteration: 'serahu', english: 'I worked' },
          { amharic: 'ተኛሁ', transliteration: 'tegnahu', english: 'I slept' },
          { amharic: 'ቁርስ', transliteration: 'qurs', english: 'breakfast' },
        ],
        dialogue: [
          {
            speaker: 'A',
            amharic: 'ዛሬ ምን አደረግህ?',
            transliteration: 'zare min aderegih?',
            english: 'What did you do today? (to a man)',
          },
          {
            speaker: 'B',
            amharic: 'ቁርስ በላሁ፣ ወደ ሥራ ሄድኩ።',
            transliteration: 'qurs belahu, wede sira hedku.',
            english: 'I ate breakfast and went to work.',
          },
        ],
        note:
          'Past-tense “I” verbs usually end in -ሁ (-hu) or -ኩ (-ku): በላሁ, ሄድኩ.',
      },
      {
        title: 'Lesson 2 – Feelings',
        description:
          'Say how you feel: tired, hungry, thirsty, happy, sick, or bored.',
        phrases: [
          { amharic: 'ደክሞኛል', transliteration: 'dekmognal', english: 'I\'m tired' },
          { amharic: 'ርቦኛል', transliteration: 'rabognal', english: 'I\'m hungry' },
          { amharic: 'ጠምቶኛል', transliteration: 'temtognal', english: 'I\'m thirsty' },
          { amharic: 'ደስ ብሎኛል', transliteration: 'des bilognal', english: 'I\'m happy' },
          { amharic: 'አሞኛል', transliteration: 'amognal', english: 'I\'m sick' },
          { amharic: 'ደብሮኛል', transliteration: 'debrognal', english: 'I\'m bored' },
          { amharic: 'ምን ሆንክ?', transliteration: 'min honk?', english: 'What\'s wrong? (to a man)' },
        ],
        dialogue: [
          {
            speaker: 'A',
            amharic: 'ምን ሆንክ?',
            transliteration: 'min honk?',
            english: 'What\'s wrong? (to a man)',
          },
          {
            speaker: 'B',
            amharic: 'ደክሞኛል፣ ርቦኛልም።',
            transliteration: 'dekmognal, rabognalim.',
            english: 'I\'m tired, and hungry too.',
          },
        ],
        note:
          'Many feelings end in -ኛል (-gnal), meaning the feeling “has got me”: ርቦኛል is “hunger has got me.”',
      },
      {
        title: 'Lesson 3 – Likes & Dislikes',
        description:
          'Say what you love and what you don\'t, and ask others.',
        phrases: [
          { amharic: 'እወዳለሁ', transliteration: 'iwedalehu', english: 'I like / I love' },
          { amharic: 'አልወድም', transliteration: 'alwedim', english: 'I don\'t like' },
          { amharic: 'በጣም እወዳለሁ', transliteration: 'betam iwedalehu', english: 'I like it a lot' },
          { amharic: 'ትወዳለህ?', transliteration: 'tiwedaleh?', english: 'Do you like ...? (to a man)' },
          { amharic: 'ትወጃለሽ?', transliteration: 'tiwejalesh?', english: 'Do you like ...? (to a woman)' },
          { amharic: 'ሙዚቃ', transliteration: 'muziqa', english: 'music' },
          { amharic: 'ኳስ', transliteration: 'kwas', english: 'football / ball' },
        ],
        dialogue: [
          {
            speaker: 'A',
            amharic: 'ኳስ ትወዳለህ?',
            transliteration: 'kwas tiwedaleh?',
            english: 'Do you like football? (to a man)',
          },
          {
            speaker: 'B',
            amharic: 'አዎ፣ በጣም እወዳለሁ!',
            transliteration: 'awo, betam iwedalehu!',
            english: 'Yes, I love it!',
          },
        ],
        note:
          '“Not” wraps around the verb: እወዳለሁ (I like) becomes አልወድም (I don\'t like). This አል...ም pattern works for most verbs.',
      },
      {
        title: 'Lesson 4 – At Home',
        description:
          'Name the rooms and things around the house.',
        phrases: [
          { amharic: 'ክፍል', transliteration: 'kifil', english: 'room' },
          { amharic: 'ወጥ ቤት', transliteration: 'wet bet', english: 'kitchen' },
          { amharic: 'መኝታ ቤት', transliteration: 'megnita bet', english: 'bedroom' },
          { amharic: 'በር', transliteration: 'ber', english: 'door' },
          { amharic: 'መስኮት', transliteration: 'meskot', english: 'window' },
          { amharic: 'ወንበር', transliteration: 'wenber', english: 'chair' },
          { amharic: 'ጠረጴዛ', transliteration: 'terepeza', english: 'table' },
        ],
        dialogue: [
          {
            speaker: 'A',
            amharic: 'እማማ የት ናት?',
            transliteration: 'imama yet nat?',
            english: 'Where is Mom?',
          },
          {
            speaker: 'B',
            amharic: 'ወጥ ቤት ናት።',
            transliteration: 'wet bet nat.',
            english: 'She\'s in the kitchen.',
          },
        ],
        note:
          'ወጥ ቤት is literally the “stew house,” which is the kitchen!',
      },
      {
        title: 'Lesson 5 – Phone Talk',
        description:
          'Handle a phone call: hello, where are you, hold on, and I\'ll call you later.',
        phrases: [
          { amharic: 'ሃሎ', transliteration: 'halo', english: 'hello (on the phone)' },
          { amharic: 'የት ነህ?', transliteration: 'yet neh?', english: 'Where are you? (to a man)' },
          { amharic: 'የት ነሽ?', transliteration: 'yet nesh?', english: 'Where are you? (to a woman)' },
          { amharic: 'ይሰማሃል?', transliteration: 'yisemahal?', english: 'Can you hear me? (to a man)' },
          { amharic: 'ቆይ', transliteration: 'qoy', english: 'wait / hold on (to a man)' },
          { amharic: 'በኋላ እደውላለሁ', transliteration: 'behwala idewilalehu', english: 'I\'ll call later' },
          { amharic: 'መንገድ ላይ ነኝ', transliteration: 'menged lay negn', english: 'I\'m on the road' },
        ],
        dialogue: [
          {
            speaker: 'A',
            amharic: 'ሃሎ? የት ነህ?',
            transliteration: 'halo? yet neh?',
            english: 'Hello? Where are you? (to a man)',
          },
          {
            speaker: 'B',
            amharic: 'መንገድ ላይ ነኝ፣ በኋላ እደውላለሁ።',
            transliteration: 'menged lay negn, behwala idewilalehu.',
            english: 'I\'m on the road. I\'ll call later.',
          },
        ],
        note:
          'ቆይ ቆይ (qoy qoy, “wait, wait”) is one of the most-heard phrases on any Ethiopian phone call.',
      },
    ],
  },

  // Amharic Camp 6 – Culture & Respect
  'amharic-beginner-6': {
    title: 'Amharic Camp 6 – Culture & Respect',
    intro:
      'Speak respectfully to elders, celebrate the holidays, give blessings, read the Ethiopian calendar, and finish a proverb.',
    sections: [
      {
        title: 'Lesson 1 – Speaking to Elders',
        description:
          'Use the polite forms that show respect to elders and people you don\'t know.',
        phrases: [
          { amharic: 'እንዴት ነዎት?', transliteration: 'indet newot?', english: 'How are you? (polite)' },
          { amharic: 'እርስዎ', transliteration: 'irswo', english: 'you (polite)' },
          { amharic: 'ጋሼ', transliteration: 'gashe', english: 'sir / older brother (respectful)' },
          { amharic: 'እትዬ', transliteration: 'itiye', english: 'ma\'am / older sister (respectful)' },
          { amharic: 'ይቀመጡ', transliteration: 'yiqemetu', english: 'please sit down (polite)' },
          { amharic: 'ይቅርታ ያድርጉልኝ', transliteration: 'yiqirta yadirgulign', english: 'please forgive me (polite)' },
          { amharic: 'እግዚአብሔር ይስጥልኝ', transliteration: 'igziabher yistilign', english: 'thank you (formal; may God reward you for me)' },
        ],
        dialogue: [
          {
            speaker: 'A',
            amharic: 'እንደምን አደሩ?',
            transliteration: 'indemin aderu?',
            english: 'Good morning. (polite)',
          },
          {
            speaker: 'B',
            amharic: 'እግዚአብሔር ይመስገን፣ ደህና ነኝ።',
            transliteration: 'igziabher yimesgen, dehna negn.',
            english: 'Thanks be to God, I\'m well.',
          },
        ],
        note:
          'With elders, verbs take a polite form ending in -u, like ይቀመጡ and እንደምን አደሩ. It shows respect.',
      },
      {
        title: 'Lesson 2 – Holidays',
        description:
          'Learn the names of the big Ethiopian holidays.',
        phrases: [
          { amharic: 'በዓል', transliteration: 'beal', english: 'holiday / celebration' },
          { amharic: 'እንቁጣጣሽ', transliteration: 'inkutatash', english: 'Ethiopian New Year' },
          { amharic: 'መስቀል', transliteration: 'meskel', english: 'Meskel (Finding of the True Cross)' },
          { amharic: 'ገና', transliteration: 'genna', english: 'Ethiopian Christmas' },
          { amharic: 'ጥምቀት', transliteration: 'timket', english: 'Timket (Epiphany)' },
          { amharic: 'ፋሲካ', transliteration: 'fasika', english: 'Easter' },
          { amharic: 'ኢድ', transliteration: 'id', english: 'Eid' },
        ],
        dialogue: [
          {
            speaker: 'A',
            amharic: 'ጥምቀት መቼ ነው?',
            transliteration: 'timket meche new?',
            english: 'When is Timket?',
          },
          {
            speaker: 'B',
            amharic: 'ጥር አስራ አንድ ነው።',
            transliteration: 'tir asra and new.',
            english: 'It\'s on Tir 11 (January 19).',
          },
        ],
        note:
          'Ethiopian Christmas (Genna) is on January 7, and the New Year (Enkutatash) is in September.',
      },
      {
        title: 'Lesson 3 – Blessings & Wishes',
        description:
          'Wish people happy holidays, happy birthdays, and congratulations, and answer back.',
        phrases: [
          { amharic: 'እንኳን አደረሳችሁ', transliteration: 'inkwan aderesachihu', english: 'happy holiday (to a group)' },
          { amharic: 'እንኳን አደረሰህ', transliteration: 'inkwan adereseh', english: 'happy holiday (to a man)' },
          { amharic: 'እንኳን አብሮ አደረሰን', transliteration: 'inkwan abiro aderesen', english: 'happy holiday to us all (the reply)' },
          { amharic: 'መልካም አዲስ ዓመት', transliteration: 'melkam addis amet', english: 'happy new year' },
          { amharic: 'መልካም ልደት', transliteration: 'melkam lidet', english: 'happy birthday' },
          { amharic: 'እንኳን ደስ አለህ', transliteration: 'inkwan des aleh', english: 'congratulations (to a man)' },
          { amharic: 'እንኳን ደስ አለሽ', transliteration: 'inkwan des alesh', english: 'congratulations (to a woman)' },
        ],
        dialogue: [
          {
            speaker: 'A',
            amharic: 'እንኳን አደረሳችሁ!',
            transliteration: 'inkwan aderesachihu!',
            english: 'Happy holiday, everyone!',
          },
          {
            speaker: 'B',
            amharic: 'እንኳን አብሮ አደረሰን!',
            transliteration: 'inkwan abiro aderesen!',
            english: 'Happy holiday to us all!',
          },
        ],
        note:
          'The reply to እንኳን አደረሳችሁ is እንኳን አብሮ አደረሰን, meaning “glad we reached it together.”',
      },
      {
        title: 'Lesson 4 – The Ethiopian Calendar',
        description:
          'Talk about years, months, and dates, including the famous 13th month.',
        phrases: [
          { amharic: 'ዓመት', transliteration: 'amet', english: 'year' },
          { amharic: 'ወር', transliteration: 'wer', english: 'month' },
          { amharic: 'ቀን', transliteration: 'qen', english: 'day / date' },
          { amharic: 'መስከረም', transliteration: 'meskerem', english: 'Meskerem (the first month)' },
          { amharic: 'ጳጉሜ', transliteration: 'pagume', english: 'Pagume (the 13th month)' },
          { amharic: 'ዛሬ ስንት ነው?', transliteration: 'zare sint new?', english: 'What\'s the date today?' },
          { amharic: 'አሁን', transliteration: 'ahun', english: 'now' },
        ],
        dialogue: [
          {
            speaker: 'A',
            amharic: 'ዛሬ ስንት ነው?',
            transliteration: 'zare sint new?',
            english: 'What\'s the date today?',
          },
          {
            speaker: 'B',
            amharic: 'መስከረም አንድ ነው! መልካም አዲስ ዓመት!',
            transliteration: 'meskerem and new! melkam addis amet!',
            english: 'It\'s Meskerem 1. Happy New Year!',
          },
        ],
        note:
          'The Ethiopian calendar has 13 months: twelve of 30 days, plus Pagume with 5 or 6 days. It runs about 7–8 years behind the Western calendar.',
      },
      {
        title: 'Lesson 5 – Proverbs',
        description:
          'Finish the camp with five famous ተረት (proverbs) that elders love to hear.',
        phrases: [
          { amharic: 'ተረት', transliteration: 'teret', english: 'proverb / saying' },
          { amharic: 'ቀስ በቀስ እንቁላል በእግሩ ይሄዳል', transliteration: 'qes beqes inqulal be\'igru yihedal', english: 'Little by little, an egg walks on its own legs. (be patient)' },
          { amharic: 'ድር ቢያብር አንበሳ ያስር', transliteration: 'dir biyabir anbesa yasir', english: 'When spider webs unite, they can tie up a lion. (teamwork)' },
          { amharic: 'ሰው ለሰው መድኃኒቱ ነው', transliteration: 'sew lesew medhanitu new', english: 'People are each other\'s medicine.' },
          { amharic: 'ጅብ ከሄደ ውሻ ጮኸ', transliteration: 'jib kehede wusha chohe', english: 'The dog barked after the hyena left. (too late)' },
          { amharic: 'የማያውቁት አገር አይናፍቅም', transliteration: 'yemayawqut ager aynafiqim', english: 'You don\'t miss a country you\'ve never known.' },
        ],
        dialogue: [
          {
            speaker: 'A',
            amharic: 'ቀስ በቀስ...',
            transliteration: 'qes beqes...',
            english: 'Little by little...',
          },
          {
            speaker: 'B',
            amharic: '...እንቁላል በእግሩ ይሄዳል!',
            transliteration: '...inqulal be\'igru yihedal!',
            english: '...an egg walks on its own legs!',
          },
        ],
        note:
          'Elders love it when young people finish their proverbs. ቀስ በቀስ... is the perfect way to finish a camp!',
      },
    ],
  },

  // Amharic Camp 7 – Dates & Time
  'amharic-beginner-7': {
    title: 'Amharic Camp 7 – Dates & Time',
    intro:
      'Learn all thirteen Ethiopian months, talk about last week and next week, say dates and birthdays, and read the Ethiopian clock.',
    sections: [
      {
        title: 'Lesson 1 – The Months: Meskerem to Yekatit',
        description:
          'The first six months of the Ethiopian year, and the holidays that fall in them.',
        phrases: [
          { amharic: 'መስከረም', transliteration: 'meskerem', english: 'Meskerem (Sep–Oct)' },
          { amharic: 'ጥቅምት', transliteration: 'tiqimt', english: 'Tikimt (Oct–Nov)' },
          { amharic: 'ኅዳር', transliteration: 'hidar', english: 'Hidar (Nov–Dec)' },
          { amharic: 'ታኅሣሥ', transliteration: 'tahsas', english: 'Tahsas (Dec–Jan)' },
          { amharic: 'ጥር', transliteration: 'tir', english: 'Tir (Jan–Feb)' },
          { amharic: 'የካቲት', transliteration: 'yekatit', english: 'Yekatit (Feb–Mar)' },
          { amharic: 'በየትኛው ወር?', transliteration: 'beyetignaw wer?', english: 'In which month?' },
        ],
        dialogue: [
          {
            speaker: 'A',
            amharic: 'መስቀል በየትኛው ወር ነው?',
            transliteration: 'meskel beyetignaw wer new?',
            english: 'Which month is Meskel in?',
          },
          {
            speaker: 'B',
            amharic: 'በመስከረም ነው።',
            transliteration: 'bemeskerem new.',
            english: 'It\'s in Meskerem.',
          },
          {
            speaker: 'A',
            amharic: 'ገናስ?',
            transliteration: 'gennas?',
            english: 'And Genna?',
          },
          {
            speaker: 'B',
            amharic: 'ገና በታኅሣሥ ነው።',
            transliteration: 'genna betahsas new.',
            english: 'Genna is in Tahsas.',
          },
        ],
        note:
          'To say “in Meskerem,” add በ- to the month: በመስከረም. Each month starts around the 10th of a Western month, so Meskerem runs from September 11 to October 10.',
      },
      {
        title: 'Lesson 2 – The Months: Megabit to Pagume',
        description:
          'The last seven months, the rainy season, and why there are thirteen.',
        phrases: [
          { amharic: 'መጋቢት', transliteration: 'megabit', english: 'Megabit (Mar–Apr)' },
          { amharic: 'ሚያዝያ', transliteration: 'miyazya', english: 'Miyazya (Apr–May)' },
          { amharic: 'ግንቦት', transliteration: 'ginbot', english: 'Ginbot (May–Jun)' },
          { amharic: 'ሰኔ', transliteration: 'sene', english: 'Sene (Jun–Jul)' },
          { amharic: 'ሐምሌ', transliteration: 'hamle', english: 'Hamle (Jul–Aug)' },
          { amharic: 'ነሐሴ', transliteration: 'nehase', english: 'Nehase (Aug–Sep)' },
          { amharic: 'ጳጉሜ', transliteration: 'pagume', english: 'Pagume (the 13th month)' },
          { amharic: 'ክረምት', transliteration: 'kiremt', english: 'the rainy season (Jun–Aug)' },
        ],
        dialogue: [
          {
            speaker: 'A',
            amharic: 'ስንት ወራት አሉ?',
            transliteration: 'sint werat alu?',
            english: 'How many months are there?',
          },
          {
            speaker: 'B',
            amharic: 'አስራ ሦስት ወራት።',
            transliteration: 'asra sost werat.',
            english: 'Thirteen months.',
          },
          {
            speaker: 'A',
            amharic: 'ጳጉሜ ስንት ቀን ነው?',
            transliteration: 'pagume sint qen new?',
            english: 'How many days is Pagume?',
          },
          {
            speaker: 'B',
            amharic: 'አምስት ቀን፣ አንዳንዴ ስድስት።',
            transliteration: 'amist qen, andande sidist.',
            english: 'Five days, sometimes six.',
          },
        ],
        note:
          'Twelve months have 30 days each. Pagume has 5, or 6 in a leap year, and comes just before the New Year. That’s why Ethiopia is called the land of “thirteen months of sunshine.”',
      },
      {
        title: 'Lesson 3 – Last Week & Next Week',
        description:
          'Look back and look ahead: the day after tomorrow, last week, next month, and the weekend.',
        phrases: [
          { amharic: 'ከነገ ወዲያ', transliteration: 'kenege wediya', english: 'the day after tomorrow' },
          { amharic: 'ከትናንት ወዲያ', transliteration: 'ketinant wediya', english: 'the day before yesterday' },
          { amharic: 'ባለፈው ሳምንት', transliteration: 'balefew samint', english: 'last week' },
          { amharic: 'በሚቀጥለው ሳምንት', transliteration: 'bemiqetilew samint', english: 'next week' },
          { amharic: 'በሚቀጥለው ወር', transliteration: 'bemiqetilew wer', english: 'next month' },
          { amharic: 'ቅዳሜና እሁድ', transliteration: 'qidamena ihud', english: 'the weekend (Saturday and Sunday)' },
          { amharic: 'ዓርብ እንገናኝ', transliteration: 'arb ingenagn', english: 'See you on Friday.' },
        ],
        dialogue: [
          {
            speaker: 'A',
            amharic: 'ነገ ትመጣለህ?',
            transliteration: 'nege timetaleh?',
            english: 'Will you come tomorrow?',
          },
          {
            speaker: 'B',
            amharic: 'ነገ አልችልም። ከነገ ወዲያ እመጣለሁ።',
            transliteration: 'nege alchilim. kenege wediya imetalehu.',
            english: 'I can\'t tomorrow. I\'ll come the day after tomorrow.',
          },
          {
            speaker: 'A',
            amharic: 'እሺ፣ ከነገ ወዲያ እንገናኝ!',
            transliteration: 'ishi, kenege wediya ingenagn!',
            english: 'Okay, see you the day after tomorrow!',
          },
        ],
        respect: [
          { english: 'Will you come tomorrow?', man: 'ነገ ትመጣለህ?', woman: 'ነገ ትመጫለሽ?', elder: 'ነገ ይመጣሉ?' },
        ],
        note:
          'To say “on Friday,” just use the day: ዓርብ እመጣለሁ means “I’ll come on Friday.” ወዲያ means “beyond,” so ከነገ ወዲያ is literally “beyond tomorrow.”',
      },
      {
        title: 'Lesson 4 – Dates & Birthdays',
        description:
          'Say today’s date, ask about birthdays, and talk about the Ethiopian year.',
        phrases: [
          { amharic: 'ዛሬ ጥቅምት አስራ ሦስት ነው።', transliteration: 'zare tiqimt asra sost new.', english: 'Today is Tikimt 13.' },
          { amharic: 'ልደት', transliteration: 'lidet', english: 'birthday / birth' },
          { amharic: 'ልደትህ መቼ ነው?', transliteration: 'lidetih meche new?', english: 'When is your birthday? (to a man)' },
          { amharic: 'ልደትሽ መቼ ነው?', transliteration: 'lidetish meche new?', english: 'When is your birthday? (to a woman)' },
          { amharic: 'ልደቴ ግንቦት አምስት ነው።', transliteration: 'lidete ginbot amist new.', english: 'My birthday is Ginbot 5.' },
          { amharic: 'ሁለት ሺህ አስራ ዘጠኝ', transliteration: 'hulet shih asra zetegn', english: '2019 (the Ethiopian year that began in September 2026)' },
          { amharic: 'በፈረንጆች አቆጣጠር', transliteration: 'beferenjoch aqotater', english: 'in the Western calendar' },
        ],
        dialogue: [
          {
            speaker: 'A',
            amharic: 'ልደትሽ መቼ ነው?',
            transliteration: 'lidetish meche new?',
            english: 'When is your birthday?',
          },
          {
            speaker: 'B',
            amharic: 'የእኔ ግንቦት አምስት ነው። አንተስ?',
            transliteration: 'ye\'ine ginbot amist new. antes?',
            english: 'Mine is Ginbot 5. And you?',
          },
          {
            speaker: 'A',
            amharic: 'የእኔ መስከረም ሃያ ነው።',
            transliteration: 'ye\'ine meskerem haya new.',
            english: 'Mine is Meskerem 20.',
          },
        ],
        respect: [
          { english: 'When is your birthday?', man: 'ልደትህ መቼ ነው?', woman: 'ልደትሽ መቼ ነው?', elder: 'ልደትዎ መቼ ነው?' },
        ],
        note:
          'Say the month first, then the day: ጥቅምት አስራ ሦስት. The Ethiopian year is 7 years behind the Western year from September to December, and 8 years behind from January to early September.',
      },
      {
        title: 'Lesson 5 – Ethiopian Time',
        description:
          'Read the Ethiopian clock, morning to night, and never miss a meeting.',
        phrases: [
          { amharic: 'ከጠዋቱ አንድ ሰዓት', transliteration: 'ketewatu and se\'at', english: '7 a.m. (1 o\'clock in the morning)' },
          { amharic: 'ከቀኑ ስድስት ሰዓት', transliteration: 'keqenu sidist se\'at', english: '12 noon (6 o\'clock in the day)' },
          { amharic: 'ከቀኑ ሰባት ሰዓት', transliteration: 'keqenu sebat se\'at', english: '1 p.m. (7 o\'clock in the day)' },
          { amharic: 'ከምሽቱ አንድ ሰዓት', transliteration: 'kemshitu and se\'at', english: '7 p.m. (1 o\'clock in the evening)' },
          { amharic: 'ከሌሊቱ ስድስት ሰዓት', transliteration: 'kelelitu sidist se\'at', english: 'midnight (6 o\'clock at night)' },
          { amharic: 'ሁለት ሰዓት ተኩል', transliteration: 'hulet se\'at tekul', english: '8:30 a.m. (half past two)' },
          { amharic: 'በኢትዮጵያ ሰዓት', transliteration: 'be\'ityopya se\'at', english: 'in Ethiopian time' },
        ],
        dialogue: [
          {
            speaker: 'A',
            amharic: 'ነገ ስንት ሰዓት እንገናኝ?',
            transliteration: 'nege sint se\'at ingenagn?',
            english: 'What time shall we meet tomorrow?',
          },
          {
            speaker: 'B',
            amharic: 'ከጠዋቱ ሦስት ሰዓት።',
            transliteration: 'ketewatu sost se\'at.',
            english: 'Three o\'clock in the morning.',
          },
          {
            speaker: 'A',
            amharic: 'በኢትዮጵያ ሰዓት? ዘጠኝ ሰዓት ማለት ነው?',
            transliteration: 'be\'ityopya se\'at? zetegn se\'at malet new?',
            english: 'In Ethiopian time? You mean nine o\'clock?',
          },
          {
            speaker: 'B',
            amharic: 'አዎ፣ ልክ ነህ!',
            transliteration: 'awo, lik neh!',
            english: 'Yes, you\'re right!',
          },
        ],
        note:
          'The Ethiopian day starts at sunrise, so 6 a.m. is 12 o\'clock and 7 a.m. is 1 o\'clock. Add six hours to get Western time. When you make plans, ask: በኢትዮጵያ ሰዓት?',
      },
    ],
  },

  // Amharic Camp 8 – Visiting Family
  'amharic-beginner-8': {
    title: 'Amharic Camp 8 – Visiting Family',
    intro:
      'Visit family in Addis: ask who, what and why, meet the whole family, say how much you missed them, talk about the weather, and look after someone who’s sick.',
    sections: [
      {
        title: 'Lesson 1 – Who, What, Why?',
        description:
          'The question words you need in every conversation.',
        phrases: [
          { amharic: 'ማን?', transliteration: 'man?', english: 'Who?' },
          { amharic: 'ምን?', transliteration: 'min?', english: 'What?' },
          { amharic: 'መቼ?', transliteration: 'meche?', english: 'When?' },
          { amharic: 'ለምን?', transliteration: 'lemin?', english: 'Why?' },
          { amharic: 'እንዴት?', transliteration: 'indet?', english: 'How?' },
          { amharic: 'የትኛው?', transliteration: 'yetignaw?', english: 'Which one?' },
          { amharic: 'ይህ ምንድን ነው?', transliteration: 'yih mindin new?', english: 'What is this?' },
        ],
        dialogue: [
          {
            speaker: 'A',
            amharic: 'ይህ ምንድን ነው?',
            transliteration: 'yih mindin new?',
            english: 'What is this?',
          },
          {
            speaker: 'B',
            amharic: 'ይህ ጀበና ነው። ቡና የምናፈላበት ነው።',
            transliteration: 'yih jebena new. buna yeminafelabet new.',
            english: 'This is a jebena. It’s what we make coffee in.',
          },
          {
            speaker: 'A',
            amharic: 'እንዴት ነው የሚሠራው?',
            transliteration: 'indet new yemiserraw?',
            english: 'How does it work?',
          },
          {
            speaker: 'B',
            amharic: 'ና፣ አሳይሃለሁ!',
            transliteration: 'na, asayihalehu!',
            english: 'Come, I’ll show you!',
          },
        ],
        note:
          'Question words usually sit near the end, just before the verb: ስምህ ማን ነው? is literally “your name who is?” You already know two more: የት (where) and ስንት (how many).',
      },
      {
        title: 'Lesson 2 – The Whole Family',
        description:
          'Aunts, uncles, cousins, husbands, wives and children: meet everyone at the family table.',
        phrases: [
          { amharic: 'አክስቴ', transliteration: 'akiste', english: 'my aunt' },
          { amharic: 'አጎቴ', transliteration: 'agote', english: 'my uncle' },
          { amharic: 'የአጎቴ ልጅ', transliteration: 'ye\'agote lij', english: 'my cousin (my uncle’s child)' },
          { amharic: 'ባለቤቴ', transliteration: 'balebete', english: 'my husband / my wife (polite)' },
          { amharic: 'ልጆቼ', transliteration: 'lijoche', english: 'my children' },
          { amharic: 'ታላቅ ወንድሜ', transliteration: 'talaq wendime', english: 'my older brother' },
          { amharic: 'ታናሽ እህቴ', transliteration: 'tanash ihite', english: 'my younger sister' },
        ],
        dialogue: [
          {
            speaker: 'A',
            amharic: 'ይህ ማን ነው?',
            transliteration: 'yih man new?',
            english: 'Who is this?',
          },
          {
            speaker: 'B',
            amharic: 'አጎቴ ነው። ከባለቤቱና ከልጆቹ ጋር።',
            transliteration: 'agote new. kebalebetuna kelijochu gar.',
            english: 'That’s my uncle, with his wife and children.',
          },
          {
            speaker: 'A',
            amharic: 'ልጆቹ ስንት ናቸው?',
            transliteration: 'lijochu sint nachew?',
            english: 'How many children are there?',
          },
          {
            speaker: 'B',
            amharic: 'ሦስት ናቸው።',
            transliteration: 'sost nachew.',
            english: 'There are three.',
          },
        ],
        note:
          'ባለቤቴ (literally “the owner of my house”) is the polite way to say “my husband” or “my wife.” Many Ethiopians call their cousins “brother” or “sister,” because family is close.',
      },
      {
        title: 'Lesson 3 – I Missed You!',
        description:
          'Arrive, hug, and catch up: say how much you missed someone and ask what’s new.',
        phrases: [
          { amharic: 'እንኳን በሰላም መጣህ', transliteration: 'inkwan beselam metah', english: 'Welcome, glad you arrived safely (to a man)' },
          { amharic: 'ናፍቀኸኛል', transliteration: 'nafqehegnal', english: 'I missed you (to a man)' },
          { amharic: 'ናፍቀሽኛል', transliteration: 'nafqeshignal', english: 'I missed you (to a woman)' },
          { amharic: 'መቼ ደረስክ?', transliteration: 'meche deresk?', english: 'When did you arrive? (to a man)' },
          { amharic: 'ትናንት ማታ ደረስኩ', transliteration: 'tinant mata deresku', english: 'I arrived last night' },
          { amharic: 'ምን አዲስ ነገር አለ?', transliteration: 'min addis neger alle?', english: 'What’s new?' },
          { amharic: 'ሁሉም ደህና ናቸው', transliteration: 'hulum dehna nachew', english: 'Everyone is well' },
        ],
        dialogue: [
          {
            speaker: 'A',
            amharic: 'እንኳን በሰላም መጣህ! በጣም ናፍቀኸኛል።',
            transliteration: 'inkwan beselam metah! betam nafqehegnal.',
            english: 'Welcome! I missed you so much.',
          },
          {
            speaker: 'B',
            amharic: 'እኔም ናፍቀሽኛል!',
            transliteration: 'ineme nafqeshignal!',
            english: 'I missed you too!',
          },
          {
            speaker: 'A',
            amharic: 'መቼ ደረስክ?',
            transliteration: 'meche deresk?',
            english: 'When did you arrive?',
          },
          {
            speaker: 'B',
            amharic: 'ትናንት ማታ ደረስኩ።',
            transliteration: 'tinant mata deresku.',
            english: 'I arrived last night.',
          },
        ],
        respect: [
          { english: 'I missed you', man: 'ናፍቀኸኛል', woman: 'ናፍቀሽኛል', elder: 'ናፍቀውኛል' },
        ],
        note:
          'ናፍቀኸኛል is literally “you have made me long for you.” To an elder, say ናፍቀውኛል. The reply is እኔም ናፍቀኸኛል / ናፍቀሽኛል: “I missed you too.”',
      },
      {
        title: 'Lesson 4 – How’s the Weather?',
        description:
          'Rain, sun and cold: the small talk of every family phone call.',
        phrases: [
          { amharic: 'አየሩ እንዴት ነው?', transliteration: 'ayeru indet new?', english: 'How’s the weather?' },
          { amharic: 'ዝናብ እየዘነበ ነው', transliteration: 'zinab iyezenebe new', english: 'It’s raining' },
          { amharic: 'ዛሬ ይበርዳል', transliteration: 'zare yiberdal', english: 'It’s cold today' },
          { amharic: 'ዛሬ ይሞቃል', transliteration: 'zare yimoqal', english: 'It’s hot today' },
          { amharic: 'ፀሐይ', transliteration: 'tsehay', english: 'sun' },
          { amharic: 'ደመና', transliteration: 'demena', english: 'cloud' },
          { amharic: 'ጃንጥላ', transliteration: 'jantila', english: 'umbrella' },
          { amharic: 'በጋ', transliteration: 'bega', english: 'the dry season (Dec–Feb)' },
        ],
        dialogue: [
          {
            speaker: 'A',
            amharic: 'አየሩ እንዴት ነው?',
            transliteration: 'ayeru indet new?',
            english: 'How’s the weather?',
          },
          {
            speaker: 'B',
            amharic: 'ዝናብ እየዘነበ ነው። ጃንጥላ ያዝ!',
            transliteration: 'zinab iyezenebe new. jantila yaz!',
            english: 'It’s raining. Take an umbrella! (to a man)',
          },
        ],
        note:
          'Addis Ababa sits at about 2,350 m, so mornings and evenings are cool even when the sun is strong. In ክረምት, the rainy season (June to August), afternoon rain is almost daily.',
      },
      {
        title: 'Lesson 5 – Feeling Better?',
        description:
          'Say what hurts, ask if someone is better, and wish them well.',
        phrases: [
          { amharic: 'ራሴን ያመኛል', transliteration: 'rasen yamegnal', english: 'My head hurts' },
          { amharic: 'ሆዴን ያመኛል', transliteration: 'hoden yamegnal', english: 'My stomach hurts' },
          { amharic: 'ሐኪም', transliteration: 'hakim', english: 'doctor' },
          { amharic: 'መድኃኒት', transliteration: 'medhanit', english: 'medicine' },
          { amharic: 'ተሻለህ?', transliteration: 'teshaleh?', english: 'Are you feeling better? (to a man)' },
          { amharic: 'ትንሽ ተሽሎኛል', transliteration: 'tinish teshlognal', english: 'I’m a little better' },
          { amharic: 'እግዚአብሔር ይማርህ', transliteration: 'igziabher yimarih', english: 'Get well soon (to a man; literally “may God heal you”)' },
        ],
        dialogue: [
          {
            speaker: 'A',
            amharic: 'ተሻለህ?',
            transliteration: 'teshaleh?',
            english: 'Are you feeling better?',
          },
          {
            speaker: 'B',
            amharic: 'ትንሽ ተሽሎኛል፣ ግን ራሴን ያመኛል።',
            transliteration: 'tinish teshlognal, gin rasen yamegnal.',
            english: 'I’m a little better, but my head hurts.',
          },
          {
            speaker: 'A',
            amharic: 'መድኃኒት ውሰድ። እግዚአብሔር ይማርህ!',
            transliteration: 'medhanit wised. igziabher yimarih!',
            english: 'Take some medicine. Get well soon!',
          },
        ],
        respect: [
          { english: 'Get well soon', man: 'እግዚአብሔር ይማርህ', woman: 'እግዚአብሔር ይማርሽ', elder: 'እግዚአብሔር ይማርዎት' },
        ],
        note:
          'Like the feelings in Camp 5, these end in -ኛል: ያመኛል is “it hurts me,” ተሽሎኛል is “it has got better for me.”',
      },
    ],
  },

  // Amharic part 9
  'amharic-beginner-9': {
    title: 'Amharic Camp 9 – Shopping & Health',
    intro:
      'Shop for clothes, ask a shop what it has, pay, get medicine at the pharmacy, tell a doctor what hurts, and visit a friend who’s sick.',
    sections: [
      {
        title: 'Lesson 1 – Clothes & Colours',
        description:
          'Name the colours, try things on, and ask for another size.',
        phrases: [
          { amharic: 'ቀለም', transliteration: 'qelem', english: 'colour' },
          { amharic: 'ቀይ', transliteration: 'qey', english: 'red' },
          { amharic: 'ሰማያዊ', transliteration: 'semayawi', english: 'blue' },
          { amharic: 'ጥቁር', transliteration: 'tiqur', english: 'black' },
          { amharic: 'ነጭ', transliteration: 'nech', english: 'white' },
          { amharic: 'ልለካው?', transliteration: 'lilekaw?', english: 'Can I try it on?' },
          { amharic: 'ትልቅ ነው', transliteration: 'tilliq new', english: 'It’s big' },
        ],
        dialogue: [
          {
            speaker: 'A',
            amharic: 'ይህን ቀሚስ ልለካው?',
            transliteration: 'yihin qemis lilekaw?',
            english: 'Can I try on this dress?',
          },
          {
            speaker: 'B',
            amharic: 'አዎ፣ ለኪው።',
            transliteration: 'awo, lekiw.',
            english: 'Yes, try it on. (to a woman)',
          },
          {
            speaker: 'A',
            amharic: 'ትልቅ ነው። ያነሰ አለ?',
            transliteration: 'tilliq new. yanese alle?',
            english: 'It’s big. Is there a smaller one?',
          },
          {
            speaker: 'B',
            amharic: 'አለ፣ በጥቁር ቀለም።',
            transliteration: 'alle, betiqur qelem.',
            english: 'Yes, in black.',
          },
        ],
        note:
          'ሰማያዊ (blue) comes from ሰማይ, “sky”: blue is the sky’s colour. A ቀሚስ is a dress; the white dress with a woven border worn on holidays is a ሀበሻ ቀሚስ (habesha qemis).',
      },
      {
        title: 'Lesson 2 – At the Shop',
        description:
          'Ask if a shop has something, the price, and how to pay.',
        phrases: [
          { amharic: 'ዳቦ አለ?', transliteration: 'dabo alle?', english: 'Do you have bread?' },
          { amharic: 'አለ', transliteration: 'alle', english: 'Yes, we have it' },
          { amharic: 'የለም', transliteration: 'yelem', english: 'No, we don’t have it' },
          { amharic: 'ዋጋው ስንት ነው?', transliteration: 'wagaw sint new?', english: 'What’s the price?' },
          { amharic: 'በካርድ መክፈል እችላለሁ?', transliteration: 'bekard mekfel ichilalehu?', english: 'Can I pay by card?' },
          { amharic: 'ጥሬ ገንዘብ', transliteration: 'tire genzeb', english: 'cash' },
          { amharic: 'ደረሰኝ', transliteration: 'deresegn', english: 'receipt' },
        ],
        dialogue: [
          {
            speaker: 'A',
            amharic: 'ስኳር አለ?',
            transliteration: 'sikwar alle?',
            english: 'Do you have sugar?',
          },
          {
            speaker: 'B',
            amharic: 'አዎ፣ አለ። ስንት ኪሎ?',
            transliteration: 'awo, alle. sint kilo?',
            english: 'Yes, we do. How many kilos?',
          },
          {
            speaker: 'A',
            amharic: 'ሁለት ኪሎ። በካርድ መክፈል እችላለሁ?',
            transliteration: 'hulet kilo. bekard mekfel ichilalehu?',
            english: 'Two kilos. Can I pay by card?',
          },
          {
            speaker: 'B',
            amharic: 'ይቅርታ፣ ጥሬ ገንዘብ ብቻ ነው።',
            transliteration: 'yiqirta, tire genzeb bicha new.',
            english: 'Sorry, cash only.',
          },
        ],
        note:
          'አለ means “there is,” so ዳቦ አለ? is literally “Is there bread?”: that’s how you ask a shop if it has something. The answer is አለ (yes) or የለም (no). Small shops often take cash or a phone payment like telebirr more than cards.',
      },
      {
        title: 'Lesson 3 – At the Pharmacy',
        description:
          'Say what’s wrong, ask for medicine, and ask how to take it.',
        phrases: [
          { amharic: 'ፋርማሲ', transliteration: 'farmasi', english: 'pharmacy' },
          { amharic: 'ራስ ምታት', transliteration: 'ras mitat', english: 'headache' },
          { amharic: 'ጉንፋን ያዘኝ', transliteration: 'gunfan yazegn', english: 'I’ve caught a cold' },
          { amharic: 'ሳል', transliteration: 'sal', english: 'cough' },
          { amharic: 'ትኩሳት አለብኝ', transliteration: 'tikusat alebign', english: 'I have a fever' },
          { amharic: 'በቀን ስንት ጊዜ?', transliteration: 'beqen sint gize?', english: 'How many times a day?' },
          { amharic: 'ከምግብ በኋላ', transliteration: 'kemigib behuala', english: 'after meals' },
        ],
        dialogue: [
          {
            speaker: 'A',
            amharic: 'ለራስ ምታት መድኃኒት አለ?',
            transliteration: 'leras mitat medhanit alle?',
            english: 'Do you have medicine for a headache?',
          },
          {
            speaker: 'B',
            amharic: 'አለ። በቀን ሁለት ጊዜ ውሰድ።',
            transliteration: 'alle. beqen hulet gize wised.',
            english: 'Yes. Take it twice a day.',
          },
          {
            speaker: 'A',
            amharic: 'ከምግብ በፊት ወይስ በኋላ?',
            transliteration: 'kemigib befit weys behuala?',
            english: 'Before or after meals?',
          },
          {
            speaker: 'B',
            amharic: 'ከምግብ በኋላ።',
            transliteration: 'kemigib behuala.',
            english: 'After meals.',
          },
        ],
        note:
          'A pharmacy is also called መድኃኒት ቤት, “medicine house.” Pharmacists are used to explaining how to take medicine, so don’t be shy to ask: በቀን ስንት ጊዜ?',
      },
      {
        title: 'Lesson 4 – At the Clinic',
        description:
          'Tell a doctor what hurts and since when.',
        phrases: [
          { amharic: 'ምን ያምሃል?', transliteration: 'min yamihal?', english: 'What hurts? (to a man)' },
          { amharic: 'እግሬን ያመኛል', transliteration: 'igren yamegnal', english: 'My leg hurts' },
          { amharic: 'ጥርሴን ያመኛል', transliteration: 'tirsen yamegnal', english: 'My tooth hurts' },
          { amharic: 'ዓይኔን ያመኛል', transliteration: 'aynen yamegnal', english: 'My eye hurts' },
          { amharic: 'ከመቼ ጀምሮ?', transliteration: 'kemeche jemiro?', english: 'Since when?' },
          { amharic: 'ከትናንት ጀምሮ', transliteration: 'ketinant jemiro', english: 'Since yesterday' },
          { amharic: 'ቀጠሮ አለኝ', transliteration: 'qetero alegn', english: 'I have an appointment' },
        ],
        dialogue: [
          {
            speaker: 'A',
            amharic: 'ምን ያምሃል?',
            transliteration: 'min yamihal?',
            english: 'What hurts?',
          },
          {
            speaker: 'B',
            amharic: 'እግሬን ያመኛል።',
            transliteration: 'igren yamegnal.',
            english: 'My leg hurts.',
          },
          {
            speaker: 'A',
            amharic: 'ከመቼ ጀምሮ?',
            transliteration: 'kemeche jemiro?',
            english: 'Since when?',
          },
          {
            speaker: 'B',
            amharic: 'ከትናንት ጀምሮ። ወደቅኩ።',
            transliteration: 'ketinant jemiro. wedeqku.',
            english: 'Since yesterday. I fell.',
          },
        ],
        respect: [
          { english: 'What hurts?', man: 'ምን ያምሃል?', woman: 'ምን ያምሻል?', elder: 'ምን ያምዎታል?' },
        ],
        note:
          'The pattern from Camp 8: the body part with -ን, then ያመኛል, “it hurts me”: እግሬን ያመኛል, ጥርሴን ያመኛል. እግር means both leg and foot, and እጅ both hand and arm.',
      },
      {
        title: 'Lesson 5 – Visiting Someone Who’s Sick',
        description:
          'Visit a sick friend: ask how they are, cheer them up, and offer help.',
        phrases: [
          { amharic: 'ልጠይቅህ መጣሁ', transliteration: 'litiyiqih metahu', english: 'I came to visit you (to a man)' },
          { amharic: 'አሁን እንዴት ነህ?', transliteration: 'ahun indet neh?', english: 'How are you now? (to a man)' },
          { amharic: 'አይዞህ', transliteration: 'ayzoh', english: 'Hang in there (to a man)' },
          { amharic: 'ብዙ ውሃ ጠጣ', transliteration: 'bizu wiha tetta', english: 'Drink lots of water (to a man)' },
          { amharic: 'ቶሎ ይሻልህ', transliteration: 'tolo yishalih', english: 'Get better soon (to a man)' },
          { amharic: 'ምን ላምጣልህ?', transliteration: 'min lamtalih?', english: 'What can I bring you? (to a man)' },
          { amharic: 'ስለመጣህ አመሰግናለሁ', transliteration: 'silemetah ameseginalehu', english: 'Thank you for coming (to a man)' },
        ],
        dialogue: [
          {
            speaker: 'A',
            amharic: 'ልጠይቅህ መጣሁ። አሁን እንዴት ነህ?',
            transliteration: 'litiyiqih metahu. ahun indet neh?',
            english: 'I came to visit you. How are you now?',
          },
          {
            speaker: 'B',
            amharic: 'ትንሽ ተሽሎኛል። ስለመጣህ አመሰግናለሁ።',
            transliteration: 'tinish teshlognal. silemetah ameseginalehu.',
            english: 'I’m a little better. Thank you for coming.',
          },
          {
            speaker: 'A',
            amharic: 'አይዞህ! ምን ላምጣልህ?',
            transliteration: 'ayzoh! min lamtalih?',
            english: 'Hang in there! What can I bring you?',
          },
          {
            speaker: 'B',
            amharic: 'ምንም፣ መምጣትህ ይበቃል።',
            transliteration: 'minim, memtatih yibeqal.',
            english: 'Nothing, you coming is enough.',
          },
        ],
        respect: [
          { english: 'Hang in there', man: 'አይዞህ', woman: 'አይዞሽ', elder: 'አይዞዎት' },
        ],
        note:
          'Visiting the sick matters a lot in Ethiopian culture. Amharic calls it መጠየቅ, literally “asking”: ልጠይቅህ መጣሁ is “I came to ask after you.” People often bring food or something to drink, and even a short visit means a lot.',
      },
    ],
  },

  // Amharic part 10
  'amharic-beginner-10': {
    title: 'Amharic Camp 10 – Life’s Big Moments',
    intro:
      'The words for life’s big moments: celebrate a wedding and a new baby, comfort a family in mourning, talk about fasting and feasting, and bless people the Ethiopian way.',
    sections: [
      {
        title: 'Lesson 1 – A Wedding',
        description:
          'Congratulate the couple, and get ready to dance.',
        phrases: [
          { amharic: 'ሠርግ', transliteration: 'serg', english: 'wedding' },
          { amharic: 'ሙሽራ', transliteration: 'mushira', english: 'groom' },
          { amharic: 'ሙሽሪት', transliteration: 'mushirit', english: 'bride' },
          { amharic: 'እንኳን ደስ አላችሁ', transliteration: 'inkwan des alachihu', english: 'congratulations (to a couple or a group)' },
          { amharic: 'እግዚአብሔር ይባርካችሁ', transliteration: 'igziabher yibarkachihu', english: 'God bless you (to a couple or a group)' },
          { amharic: 'እንጨፍር!', transliteration: 'inchefir!', english: 'Let’s dance!' },
        ],
        dialogue: [
          {
            speaker: 'A',
            amharic: 'ሠርጉ መቼ ነው?',
            transliteration: 'sergu meche new?',
            english: 'When is the wedding?',
          },
          {
            speaker: 'B',
            amharic: 'ቅዳሜ ነው። ትመጣለህ?',
            transliteration: 'qidame new. timetaleh?',
            english: 'It’s on Saturday. Will you come?',
          },
          {
            speaker: 'A',
            amharic: 'አዎ! እንኳን ደስ አላችሁ!',
            transliteration: 'awo! inkwan des alachihu!',
            english: 'Yes! Congratulations to you both!',
          },
          {
            speaker: 'B',
            amharic: 'አመሰግናለሁ! እዚያ እንጨፍራለን።',
            transliteration: 'ameseginalehu! iziya inchefiralen.',
            english: 'Thank you! We’ll dance there.',
          },
        ],
        note:
          'At Ethiopian weddings the groom’s best men (ሚዜዎች, mizewoch) sing and dance with the couple. Guests say እንኳን ደስ አላችሁ, with the plural “you,” for both of them.',
      },
      {
        title: 'Lesson 2 – A New Baby',
        description:
          'Congratulate new parents, and ask about the baby.',
        phrases: [
          { amharic: 'ሕፃን', transliteration: 'hitsan', english: 'baby' },
          { amharic: 'ወንድ ልጅ', transliteration: 'wend lij', english: 'a boy' },
          { amharic: 'ሴት ልጅ', transliteration: 'set lij', english: 'a girl' },
          { amharic: 'እንኳን ማርያም ማረችሽ', transliteration: 'inkwan maryam marechish', english: 'congratulations (to a new mother)' },
          { amharic: 'ስሙ ማን ነው?', transliteration: 'simu man new?', english: 'What’s his name?' },
          { amharic: 'ስሟ ማን ነው?', transliteration: 'simwa man new?', english: 'What’s her name?' },
          { amharic: 'እግዚአብሔር ያሳድግላችሁ', transliteration: 'igziabher yasadgilachihu', english: 'May God raise the child for you' },
        ],
        dialogue: [
          {
            speaker: 'A',
            amharic: 'እንኳን ማርያም ማረችሽ! ወንድ ነው ወይስ ሴት?',
            transliteration: 'inkwan maryam marechish! wend new weys set?',
            english: 'Congratulations! Is it a boy or a girl?',
          },
          {
            speaker: 'B',
            amharic: 'ሴት ልጅ ናት።',
            transliteration: 'set lij nat.',
            english: 'It’s a girl.',
          },
          {
            speaker: 'A',
            amharic: 'ስሟ ማን ነው?',
            transliteration: 'simwa man new?',
            english: 'What’s her name?',
          },
          {
            speaker: 'B',
            amharic: 'ስሟ ሔራን ነው።',
            transliteration: 'simwa heran new.',
            english: 'Her name is Heran.',
          },
        ],
        note:
          'Orthodox Christians greet a new mother with እንኳን ማርያም ማረችሽ, literally “glad Mary had mercy on you,” thanking Mary for a safe birth. Anyone can simply say እንኳን ደስ አለሽ, “congratulations.”',
      },
      {
        title: 'Lesson 3 – Comforting a Grieving Family',
        description:
          'What to say when someone has died, and how to show you care.',
        phrases: [
          { amharic: 'ለቅሶ', transliteration: 'leqso', english: 'mourning; visiting a grieving family' },
          { amharic: 'ሐዘን', transliteration: 'hazen', english: 'grief, sorrow' },
          { amharic: 'በጣም አዝናለሁ', transliteration: 'betam aznalehu', english: 'I’m so sorry' },
          { amharic: 'ነፍስ ይማር', transliteration: 'nefs yimar', english: 'May his or her soul rest in peace' },
          { amharic: 'እግዚአብሔር ያጽናችሁ', transliteration: 'igziabher yatsnachihu', english: 'May God comfort you (to the family)' },
          { amharic: 'አይዟችሁ', transliteration: 'ayzwachihu', english: 'Take heart (to a group)' },
        ],
        dialogue: [
          {
            speaker: 'A',
            amharic: 'በጣም አዝናለሁ። ነፍስ ይማር።',
            transliteration: 'betam aznalehu. nefs yimar.',
            english: 'I’m so sorry. May his soul rest in peace.',
          },
          {
            speaker: 'B',
            amharic: 'አሜን። ስለመጣህ አመሰግናለሁ።',
            transliteration: 'amen. silemetah ameseginalehu.',
            english: 'Amen. Thank you for coming.',
          },
          {
            speaker: 'A',
            amharic: 'እግዚአብሔር ያጽናችሁ። አይዟችሁ።',
            transliteration: 'igziabher yatsnachihu. ayzwachihu.',
            english: 'May God comfort you all. Take heart.',
          },
          {
            speaker: 'B',
            amharic: 'አሜን፣ አመሰግናለሁ።',
            transliteration: 'amen, ameseginalehu.',
            english: 'Amen, thank you.',
          },
        ],
        note:
          'When someone dies, friends and neighbours visit the family at home for several days. They sit with them, and close friends bring food and drinks so the family doesn’t have to cook. You don’t need many words: ነፍስ ይማር, and being there, are what count.',
      },
      {
        title: 'Lesson 4 – Fasting & Feasting',
        description:
          'Talk about fasting, Ramadan and Eid, and what you can eat.',
        phrases: [
          { amharic: 'ጾም', transliteration: 'tsom', english: 'fasting; a fast' },
          { amharic: 'ጾመኛ ነኝ', transliteration: 'tsomegna negn', english: 'I’m fasting' },
          { amharic: 'ሥጋ', transliteration: 'siga', english: 'meat' },
          { amharic: 'ሁዳዴ', transliteration: 'hudade', english: 'Great Lent, the long fast before Easter' },
          { amharic: 'ረመዳን', transliteration: 'remedan', english: 'Ramadan' },
          { amharic: 'ኢፍጣር', transliteration: 'iftar', english: 'iftar, the meal that breaks the Ramadan fast' },
          { amharic: 'ኢድ ሙባረክ', transliteration: 'id mubarek', english: 'Eid Mubarak (blessed Eid)' },
        ],
        dialogue: [
          {
            speaker: 'A',
            amharic: 'ሥጋ ትበላለህ?',
            transliteration: 'siga tibelaleh?',
            english: 'Do you eat meat?',
          },
          {
            speaker: 'B',
            amharic: 'ዛሬ ረቡዕ ነው፤ ጾመኛ ነኝ።',
            transliteration: 'zare rebu new; tsomegna negn.',
            english: 'Today is Wednesday; I’m fasting.',
          },
          {
            speaker: 'A',
            amharic: 'እሺ፣ የጾም ምግብ እናዝዝ።',
            transliteration: 'ishi, yetsom migib inazziz.',
            english: 'OK, let’s order fasting food.',
          },
          {
            speaker: 'B',
            amharic: 'ሽሮ ጥሩ ነው!',
            transliteration: 'shiro tiru new!',
            english: 'Shiro is great!',
          },
        ],
        note:
          'Orthodox Christians fast on most Wednesdays and Fridays and for 55 days before Easter (ሁዳዴ): no meat, milk or eggs, so fasting food is vegan. Ethiopian Muslims fast from dawn to sunset in ረመዳን and break the fast together at ኢፍጣር.',
      },
      {
        title: 'Lesson 5 – Everyday Blessings',
        description:
          'Thank people, wish them luck, and say goodbye the Ethiopian way.',
        phrases: [
          { amharic: 'እግዚአብሔር ይስጥልኝ', transliteration: 'igziabher yistilign', english: 'Thank you (literally “may God give it to you for me”)' },
          { amharic: 'እግዚአብሔር ቢፈቅድ', transliteration: 'igziabher bifeqid', english: 'God willing (said by Christians)' },
          { amharic: 'ኢንሻአላህ', transliteration: 'inshallah', english: 'God willing (said by Muslims)' },
          { amharic: 'ይቅናህ', transliteration: 'yiqnah', english: 'Good luck (to a man)' },
          { amharic: 'መልካም መንገድ', transliteration: 'melkam menged', english: 'Have a good trip' },
          { amharic: 'በሰላም ግባ', transliteration: 'beselam giba', english: 'Get home safely (to a man)' },
        ],
        dialogue: [
          {
            speaker: 'A',
            amharic: 'ነገ ወደ አሜሪካ እመለሳለሁ።',
            transliteration: 'nege wede amerika imelesalehu.',
            english: 'Tomorrow I go back to America.',
          },
          {
            speaker: 'B',
            amharic: 'መልካም መንገድ! መቼ ትመጣለህ?',
            transliteration: 'melkam menged! meche timetaleh?',
            english: 'Have a good trip! When will you come back?',
          },
          {
            speaker: 'A',
            amharic: 'እግዚአብሔር ቢፈቅድ፣ በሚቀጥለው ክረምት።',
            transliteration: 'igziabher bifeqid, bemiqetilew kiremt.',
            english: 'God willing, next rainy season.',
          },
          {
            speaker: 'B',
            amharic: 'እሺ፣ በሰላም ግባ!',
            transliteration: 'ishi, beselam giba!',
            english: 'OK, get home safely!',
          },
        ],
        respect: [
          { english: 'Good luck', man: 'ይቅናህ', woman: 'ይቅናሽ', elder: 'ይቅናዎት' },
        ],
        note:
          'You’ll hear God in many everyday phrases: እግዚአብሔር ይስጥልኝ is a warm “thank you,” and Christians say እግዚአብሔር ቢፈቅድ where Muslims say ኢንሻአላህ, both “God willing.” ክረምት, the rainy season, is when many in the diaspora visit home.',
      },
    ],
  },

  // Amharic part 11
  'amharic-beginner-11': {
    title: 'Amharic Camp 11 – The Summit: Travel in Ethiopia',
    sections: [
      {
        title: 'Lesson 1 – At the Bus Station',
        description:
          'Buy a ticket, and find out when the bus leaves.',
        phrases: [
          { amharic: 'መናኸሪያ', transliteration: 'menahariya', english: 'bus station' },
          { amharic: 'አውቶቡስ', transliteration: 'awtobus', english: 'bus' },
          { amharic: 'ትኬት', transliteration: 'tiket', english: 'ticket' },
          { amharic: 'ወደ ባሕር ዳር', transliteration: 'wede bahir dar', english: 'to Bahir Dar' },
          { amharic: 'መቼ ይነሳል?', transliteration: 'meche yinesal?', english: 'When does it leave?' },
          { amharic: 'ስንት ሰዓት ይፈጃል?', transliteration: 'sint se\'at yifejal?', english: 'How many hours does it take?' },
        ],
        dialogue: [
          {
            speaker: 'A',
            amharic: 'ወደ ባሕር ዳር አንድ ትኬት እፈልጋለሁ።',
            transliteration: 'wede bahir dar and tiket ifeligalehu.',
            english: 'I’d like one ticket to Bahir Dar.',
          },
          {
            speaker: 'B',
            amharic: 'እሺ። አውቶቡሱ ከሌሊቱ አሥራ አንድ ሰዓት ይነሳል።',
            transliteration: 'eshi. awtobusu kelelitu asra and se\'at yinesal.',
            english: 'Okay. The bus leaves at 5 a.m. (11 o’clock, Ethiopian time).',
          },
          {
            speaker: 'A',
            amharic: 'ስንት ሰዓት ይፈጃል?',
            transliteration: 'sint se\'at yifejal?',
            english: 'How many hours does it take?',
          },
          {
            speaker: 'B',
            amharic: 'አሥር ሰዓት ገደማ። መልካም መንገድ!',
            transliteration: 'asir se\'at gedema. melkam menged!',
            english: 'About ten hours. Have a good trip!',
          },
        ],
        note:
          'Long-distance buses leave early, around 5 or 6 a.m., so get to the መናኸሪያ before dawn. Times are often said in Ethiopian time: ከሌሊቱ አሥራ አንድ ሰዓት is 5 a.m. Seats on the big buses can be booked the day before.',
      },
      {
        title: 'Lesson 2 – At the Hotel',
        description:
          'Ask for a room, and check what comes with it.',
        phrases: [
          { amharic: 'ሆቴል', transliteration: 'hotel', english: 'hotel' },
          { amharic: 'ክፍል አላችሁ?', transliteration: 'kifil alachihu?', english: 'Do you have a room?' },
          { amharic: 'ለአንድ ሌሊት', transliteration: 'le\'and lelit', english: 'for one night' },
        ],
      },
    ],
  },

  // The English course lives in its own file.
  ...englishCourses,
};

export type Track = 'amharic' | 'english';

export type CourseSummary = {
  slug: string;
  title: string;
  description: string;
  audience: string;
  track: Track;
  part: number; // camp number on the track, starting at 1
};

export const courseCatalog: CourseSummary[] = [
  {
    slug: 'amharic-beginner-1',
    title: 'Amharic Camp 1 – Greetings & First Words',
    description: 'Greetings, introductions, and basic polite phrases.',
    audience: 'Non‑Amharic speakers learning Amharic',
    track: 'amharic',
    part: 1,
  },
  {
    slug: 'amharic-beginner-2',
    title: 'Amharic Camp 2 – Numbers, Family & People',
    description: 'Numbers, family, and everyday expressions.',
    audience: 'Non‑Amharic speakers learning Amharic',
    track: 'amharic',
    part: 2,
  },
  {
    slug: 'amharic-beginner-3',
    title: 'Amharic Camp 3 – Buna & Food',
    description: 'Coffee, food, the market, and being a good guest.',
    audience: 'Non‑Amharic speakers learning Amharic',
    track: 'amharic',
    part: 3,
  },
  {
    slug: 'amharic-beginner-4',
    title: 'Amharic Camp 4 – Getting Around',
    description: 'Directions, taxis, telling time, and places in town.',
    audience: 'Non‑Amharic speakers learning Amharic',
    track: 'amharic',
    part: 4,
  },
  {
    slug: 'amharic-beginner-5',
    title: 'Amharic Camp 5 – Daily Life & Feelings',
    description: 'Your day, how you feel, what you like, home, and phone talk.',
    audience: 'Non‑Amharic speakers learning Amharic',
    track: 'amharic',
    part: 5,
  },
  {
    slug: 'amharic-beginner-6',
    title: 'Amharic Camp 6 – Culture & Respect',
    description: 'Elders, holidays, blessings, the calendar, and proverbs.',
    audience: 'Non‑Amharic speakers learning Amharic',
    track: 'amharic',
    part: 6,
  },
  {
    slug: 'amharic-beginner-7',
    title: 'Amharic Camp 7 – Dates & Time',
    description: 'All 13 months, last week and next week, dates, birthdays, and Ethiopian time.',
    audience: 'Non‑Amharic speakers learning Amharic',
    track: 'amharic',
    part: 7,
  },
  {
    slug: 'amharic-beginner-8',
    title: 'Amharic Camp 8 – Visiting Family',
    description: 'Question words, the whole family, “I missed you,” the weather, and getting well.',
    audience: 'Non‑Amharic speakers learning Amharic',
    track: 'amharic',
    part: 8,
  },
  {
    slug: 'amharic-beginner-9',
    title: 'Amharic Camp 9 – Shopping & Health',
    description: 'Colours and clothes, “do you have…?”, the pharmacy, the clinic, and visiting someone who’s sick.',
    audience: 'Non‑Amharic speakers learning Amharic',
    track: 'amharic',
    part: 9,
  },
  {
    slug: 'amharic-beginner-10',
    title: 'Amharic Camp 10 – Life’s Big Moments',
    description: 'Weddings, a new baby, comforting a grieving family, fasting and feasting, and everyday blessings.',
    audience: 'Non‑Amharic speakers learning Amharic',
    track: 'amharic',
    part: 10,
  },
  ...englishCatalog,
];

export function lessonCount(slug: string) {
  return courseContent[slug]?.sections.length ?? 0;
}

export function catalogStats() {
  const courses = Object.values(courseContent);
  const lessons = courses.flatMap(course => course.sections);
  const phrases = lessons.reduce(
    (total, lesson) => total + (lesson.phrases?.length ?? 0) + (lesson.dialogue?.length ?? 0),
    0,
  );
  return { courses: courses.length, lessons: lessons.length, phrases };
}
