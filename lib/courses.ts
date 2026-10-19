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
};

export type Course = {
  title: string;
  intro?: string;
  sections: LessonSection[];
};

export const courseContent: Record<string, Course> = {
  // Amharic part 1
  'amharic-beginner-1': {
    title: 'Amharic for Absolute Beginners – Part 1',
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
            amharic: 'ደህና ነኝ፣ አንተ?',
            transliteration: 'dehna neñ, ante?',
            english: 'I am fine, and you? (to a man)',
          },
          {
            amharic: 'ደህና ነኝ፣ አንቺ?',
            transliteration: 'dehna neñ, anchi?',
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
            amharic: 'ደህና ነኝ፣ አንተ?',
            transliteration: 'dehna neñ, ante?',
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
            english: 'Please, your name? (to a man, polite)',
          },
          {
            amharic: 'እባክሽ ስምሽ?',
            transliteration: 'əbbakish, səmməsh?',
            english: 'Please, your name? (to a woman, polite)',
          },
          {
            amharic: 'ከአሜሪካ መጣሁ።',
            transliteration: 'kə Amerika metahu.',
            english: 'I came from America / I am from America.',
          },
          {
            amharic: 'ከኢትዮጵያ መጣሁ።',
            transliteration: 'kə Ityopya metahu.',
            english: 'I came from Ethiopia / I am from Ethiopia.',
          },
        ],
        dialogue: [
          {
            speaker: 'A',
            amharic: 'ሰላም፣ ስሜ ዳዊት ነው።',
            transliteration: 'selam, səme Dawit new.',
            english: 'Hello, my name is Dawit.',
          },
          {
            speaker: 'B',
            amharic: 'እባክህ ስምህ?',
            transliteration: 'əbbakih, səmməh?',
            english: 'Please, your name? (to a man, polite)',
          },
          {
            speaker: 'A',
            amharic: 'ስሜ አሌክስ ነው። ከአሜሪካ መጣሁ።',
            transliteration: 'səme Alex new. kə Amerika metahu.',
            english: 'My name is Alex. I am from America.',
          },
          {
            speaker: 'B',
            amharic: 'ደህና መጣህ፣ አሌክስ።',
            transliteration: 'dehna metah, Alex.',
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
            amharic: 'እጅግ አመሰግናለሁ',
            transliteration: 'əjjəg amesegenallo',
            english: 'Thank you very much.',
          },
          {
            amharic: 'የለም፣ በደህና',
            transliteration: 'yelem, bedehna',
            english: 'You’re welcome / It’s nothing, be well.',
          },
          {
            amharic: 'ይቅርታ',
            transliteration: 'yiqirta',
            english: 'Sorry / Excuse me',
          },
          {
            amharic: 'እባክህ ይቅርታ',
            transliteration: 'əbbakih, yiqirta',
            english: 'Please, forgive me (to a man, polite)',
          },
          {
            amharic: 'እባክሽ ይቅርታ',
            transliteration: 'əbbakish, yiqirta',
            english: 'Please, forgive me (to a woman, polite)',
          },
        ],
        dialogue: [
          {
            speaker: 'A',
            amharic: 'ይቅርታ፣ በመንገድህ ቆመሁ።',
            transliteration: 'yiqirta, be-mengedih qomehu.',
            english: 'Sorry, I stood in your way.',
          },
          {
            speaker: 'B',
            amharic: 'የለም፣ በደህና።',
            transliteration: 'yelem, bedehna.',
            english: 'No problem, be well.',
          },
          {
            speaker: 'A',
            amharic: 'እጅግ አመሰግናለሁ።',
            transliteration: 'əjjəg amesegenallo.',
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
          { amharic: 'ደህና ሁኚ', transliteration: 'dehna hugn', english: 'goodbye / stay well (to a woman)' },
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
    ],
  },

  // Amharic part 2
  'amharic-beginner-2': {
    title: 'Amharic for Absolute Beginners – Part 2',
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
              'አንድ፣ ሁለት፣ ሶስት፣ አራት፣ አምስት፣ ስድስት፣ ሰባት፣ ስምንት፣ ዘጠኝ፣ አስር።',
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
              'አባቴና እናቴ በደህና ናቸው፣ እህቴም በደህና ናት።',
            transliteration: 'abate-na ənnate bedehna nachəw, əhtem bedehna nat.',
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
            transliteration: 'ahun alchilem',
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
            english: 'Speak slowly, please. (to a man)',
          },
        ],
        dialogue: [
          {
            speaker: 'A',
            amharic: 'ጊዜ አለህ? ትንሽ ማነጋገር እፈልጋለሁ።',
            transliteration: 'gize alleh? tɨnɨsh manəgager əfelləgaləhu.',
            english: 'Do you have time? I would like to talk a little.',
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
          { amharic: 'ረቡዕ', transliteration: 'rob', english: 'Wednesday' },
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

  // Amharic Camp 6 – The Summit: Culture & Respect
  'amharic-beginner-6': {
    title: 'Amharic Camp 6 – The Summit: Culture & Respect',
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
          'Reach the summit with five famous ተረት (proverbs) that elders love to hear.',
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
          'Elders love it when young people finish their proverbs. ቀስ በቀስ... is the perfect way to end the climb!',
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
    title: 'Amharic for Absolute Beginners – Part 1',
    description: 'Greetings, introductions, and basic polite phrases.',
    audience: 'Non‑Amharic speakers learning Amharic',
    track: 'amharic',
    part: 1,
  },
  {
    slug: 'amharic-beginner-2',
    title: 'Amharic for Absolute Beginners – Part 2',
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
    title: 'Amharic Camp 6 – The Summit: Culture & Respect',
    description: 'Elders, holidays, blessings, the calendar, and proverbs.',
    audience: 'Non‑Amharic speakers learning Amharic',
    track: 'amharic',
    part: 6,
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
