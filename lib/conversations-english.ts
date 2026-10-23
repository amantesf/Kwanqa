import type { Conversation, Line } from '@/lib/conversations';

// Talk with Walia for Amharic speakers learning English. Walia speaks English;
// each line's Amharic meaning is there for help, written to a man or a woman
// (the learner picks). Answers are checked in English, after lowercasing and
// dropping punctuation, so "I'm" arrives as "i m".

/** An English line with its Amharic meaning. */
const en = (english: string, amharic: string): Line => ({ english, amharic, transliteration: '' });

/** An English line whose Amharic meaning changes for a man or a woman. */
const enG = (english: string, man: string, woman: string) => ({ m: en(english, man), f: en(english, woman) });

const THANKS = [{ say: 'thank you' }, { say: 'thanks' }, { pattern: /\bthank/ }];
const NAME = /\b(my name is|my name s|i am|i m|im|call me|it s|its|this is)\b \S+/;

export const englishConversations: Conversation[] = [
  // ---------------------------------------------------------------- Beginner
  {
    slug: 'en-hello',
    lang: 'en',
    title: 'Saying hello',
    amharicTitle: 'ሰላምታ',
    level: 'beginner',
    blurb: 'Greet Walia in English, say how you are, and tell him your name and where you’re from.',
    turns: [
      {
        walia: enG('Hi! How are you?', 'ሰላም! እንዴት ነህ?', 'ሰላም! እንዴት ነሽ?'),
        goal: 'Say how you are, in English.',
        answers: [{ pattern: /\b(fine|good|great|okay|ok|well|not bad|alright|all right|so so|tired)\b/ }],
        example: en('I’m fine, thank you. And you?', 'ደህና ነኝ፣ አመሰግናለሁ። አንተስ?'),
      },
      {
        walia: enG('I’m great, thanks! What’s your name?', 'እኔ በጣም ደህና ነኝ፣ አመሰግናለሁ! ስምህ ማን ነው?', 'እኔ በጣም ደህና ነኝ፣ አመሰግናለሁ! ስምሽ ማን ነው?'),
        goal: 'Tell Walia your name in a sentence, like “My name is …”.',
        answers: [{ pattern: NAME }],
        example: en('My name is Hana.', 'ስሜ ሃና ነው።'),
      },
      {
        walia: enG('Nice to meet you! Where are you from?', 'ስለተዋወቅን ደስ ብሎኛል! ከየት ነህ?', 'ስለተዋወቅን ደስ ብሎኛል! ከየት ነሽ?'),
        goal: 'Say where you are from, like “I’m from …”.',
        answers: [{ pattern: /\b(from|live in|living in|born in)\b \S+/ }],
        example: en('I’m from Ethiopia.', 'ከኢትዮጵያ ነኝ።'),
      },
      {
        walia: enG('Do you speak English?', 'እንግሊዝኛ ትናገራለህ?', 'እንግሊዝኛ ትናገሪያለሽ?'),
        goal: 'Say yes, no, or a little.',
        answers: [{ pattern: /\b(yes|yeah|no|little|bit|learning|some|of course)\b/ }],
        example: en('A little. I’m learning.', 'ትንሽ። እየተማርኩ ነው።'),
      },
      {
        walia: enG('Great! It was nice talking to you. Goodbye!', 'በጣም ጥሩ! ካንተ ጋር ማውራት ደስ ብሎኛል። ደህና ሁን!', 'በጣም ጥሩ! ካንቺ ጋር ማውራት ደስ ብሎኛል። ደህና ሁኚ!'),
        goal: 'Say goodbye.',
        answers: [{ pattern: /\b(bye|goodbye|good bye|see you|take care|later|good night|have a)\b/ }, ...THANKS],
        example: en('Goodbye! See you soon.', 'ደህና ሁን! በቅርቡ እንገናኝ።'),
      },
    ],
  },
  {
    slug: 'en-cafe',
    lang: 'en',
    title: 'At the café',
    amharicTitle: 'ካፌ ውስጥ',
    level: 'beginner',
    blurb: 'Walia works at a café today. Order a drink, say how you like it, and pay.',
    turns: [
      {
        walia: enG('Hello! What would you like?', 'ሰላም! ምን ልታዘዝ?', 'ሰላም! ምን ልታዘዢ?'),
        goal: 'Order something to drink or eat.',
        answers: [
          { pattern: /\b(coffee|tea|juice|water|macchiato|milk|soda|cake|bread|sandwich|cappuccino|latte)\b/ },
          { pattern: /\b(i would like|i d like|can i have|could i have|i want|i ll have)\b/ },
        ],
        example: en('A coffee, please.', 'ቡና፣ እባክህ።'),
      },
      {
        walia: enG('Sure. With sugar or without sugar?', 'እሺ። በስኳር ወይስ ያለ ስኳር?', 'እሺ። በስኳር ወይስ ያለ ስኳር?'),
        goal: 'Say with sugar or without sugar.',
        answers: [{ pattern: /\b(sugar|without|with|no|plain|little|bit)\b/ }],
        example: en('With sugar, please.', 'በስኳር፣ እባክህ።'),
      },
      {
        walia: enG('Anything else?', 'ሌላ ነገር ትፈልጋለህ?', 'ሌላ ነገር ትፈልጊያለሽ?'),
        goal: 'Say no thanks, or ask for something else.',
        answers: [{ pattern: /\b(no|nothing|that s all|that s it|yes|and|also|cake|bread|water|that s everything)\b/ }],
        example: en('No, thank you. That’s all.', 'አይ፣ አመሰግናለሁ። ይበቃል።'),
      },
      {
        walia: enG('That’s fifty birr, please.', 'ሃምሳ ብር ነው፣ እባክህ።', 'ሃምሳ ብር ነው፣ እባክሽ።'),
        goal: 'Pay politely, like “Here you go”.',
        answers: [{ pattern: /\b(here you go|here you are|here it is|here|okay|ok|sure)\b/ }, ...THANKS],
        example: en('Here you go. Thank you!', 'ይኸው። አመሰግናለሁ!'),
      },
      {
        walia: enG('Thank you! Have a nice day!', 'አመሰግናለሁ! መልካም ቀን ይሁንልህ!', 'አመሰግናለሁ! መልካም ቀን ይሁንልሽ!'),
        goal: 'Wish Walia a nice day too.',
        answers: [{ pattern: /\b(you too|same to you|bye|goodbye|have a)\b/ }, ...THANKS],
        example: en('Thank you, you too!', 'አመሰግናለሁ፣ ላንተም!'),
      },
    ],
  },
  {
    slug: 'en-family',
    lang: 'en',
    title: 'Your family',
    amharicTitle: 'ቤተሰብ',
    level: 'beginner',
    blurb: 'Tell Walia about your brothers and sisters, where your family lives, and who you call most.',
    turns: [
      {
        walia: enG('Tell me about your family. Do you have brothers or sisters?', 'ስለ ቤተሰብህ ንገረኝ። ወንድም ወይም እህት አለህ?', 'ስለ ቤተሰብሽ ንገሪኝ። ወንድም ወይም እህት አለሽ?'),
        goal: 'Say whether you have brothers or sisters.',
        answers: [{ pattern: /\b(yes|no|brother|brothers|sister|sisters|i have|only child|none)\b/ }],
        example: en('Yes, I have two sisters.', 'አዎ፣ ሁለት እህቶች አሉኝ።'),
      },
      {
        walia: enG('Where does your family live?', 'ቤተሰብህ የት ነው የሚኖረው?', 'ቤተሰብሽ የት ነው የሚኖረው?'),
        goal: 'Say where your family lives.',
        answers: [{ pattern: /\b(in|live|lives|living|ethiopia|addis|america|here|there)\b/ }],
        example: en('My family lives in Addis Ababa.', 'ቤተሰቤ አዲስ አበባ ይኖራል።'),
      },
      {
        walia: enG('Who do you call the most?', 'ብዙ ጊዜ ለማን ትደውላለህ?', 'ብዙ ጊዜ ለማን ትደውያለሽ?'),
        goal: 'Name a person in your family (or a friend).',
        answers: [
          {
            pattern:
              /\b(mother|mom|mum|mama|father|dad|papa|sister|brother|grandmother|grandma|grandfather|grandpa|aunt|uncle|cousin|friend|wife|husband|son|daughter|parents)\b/,
          },
        ],
        example: en('I call my mother the most.', 'ብዙ ጊዜ ለእናቴ እደውላለሁ።'),
      },
      {
        walia: enG('That’s lovely. Say hello to them from me!', 'በጣም ደስ ይላል። ከኔ ሰላም በልልኝ!', 'በጣም ደስ ይላል። ከኔ ሰላም በይልኝ!'),
        goal: 'Say you will, or thank Walia.',
        answers: [{ pattern: /\b(i will|i ll|okay|ok|sure|of course|yes)\b/ }, ...THANKS],
        example: en('I will. Thank you!', 'እሺ፣ እላለሁ። አመሰግናለሁ!'),
      },
    ],
  },

  // ------------------------------------------------------------ Intermediate
  {
    slug: 'en-directions',
    lang: 'en',
    title: 'Finding your way',
    amharicTitle: 'አቅጣጫ',
    level: 'intermediate',
    blurb: 'You’re lost in a new city. Say where you’re going, follow Walia’s directions, and thank him.',
    turns: [
      {
        walia: enG('Excuse me, you look lost. Where are you going?', 'ይቅርታ፣ የጠፋብህ ትመስላለህ። ወዴት ነው የምትሄደው?', 'ይቅርታ፣ የጠፋብሽ ትመስያለሽ። ወዴት ነው የምትሄጂው?'),
        goal: 'Say where you are going, like “I’m going to the bank”.',
        answers: [
          { pattern: /\b(to|going|looking for)\b/ },
          { pattern: /\b(bank|hospital|school|church|mosque|airport|hotel|station|market|pharmacy|cafe|café|office|library)\b/ },
        ],
        example: en('I’m going to the bank.', 'ወደ ባንክ እየሄድኩ ነው።'),
      },
      {
        walia: enG(
          'Okay. Go straight, then turn left at the church. Did you understand?',
          'እሺ። ቀጥ ብለህ ሂድ፣ ከዚያ ቤተ ክርስቲያኑ ጋ ወደ ግራ ታጠፍ። ገባህ?',
          'እሺ። ቀጥ ብለሽ ሂጂ፣ ከዚያ ቤተ ክርስቲያኑ ጋ ወደ ግራ ታጠፊ። ገባሽ?',
        ),
        goal: 'Say you understood (you can repeat the directions), or ask Walia to say it again.',
        answers: [{ pattern: /\b(yes|understand|understood|got it|okay|ok|repeat|again|sorry|slowly|left|straight)\b/ }],
        example: en('Yes, I understand. Straight, then left.', 'አዎ፣ ገብቶኛል። ቀጥ፣ ከዚያ ወደ ግራ።'),
      },
      {
        walia: enG('Do you want to walk or take a taxi?', 'በእግር መሄድ ትፈልጋለህ ወይስ ታክሲ መያዝ?', 'በእግር መሄድ ትፈልጊያለሽ ወይስ ታክሲ መያዝ?'),
        goal: 'Choose: walk, or take a taxi or bus.',
        answers: [{ pattern: /\b(walk|walking|taxi|bus|bajaj|drive|car|on foot)\b/ }],
        example: en('I’ll walk. Is it far?', 'በእግሬ እሄዳለሁ። ሩቅ ነው?'),
      },
      {
        walia: enG('It’s about ten minutes from here.', 'ከዚህ አስር ደቂቃ ያህል ነው።', 'ከዚህ አስር ደቂቃ ያህል ነው።'),
        goal: 'Thank Walia for his help.',
        answers: [...THANKS, { pattern: /\b(appreciate|great|perfect|okay|ok)\b/ }],
        example: en('Thank you so much for your help!', 'ስለረዳኸኝ በጣም አመሰግናለሁ!'),
      },
    ],
  },
  {
    slug: 'en-market',
    lang: 'en',
    title: 'At the market',
    amharicTitle: 'ገበያ',
    level: 'intermediate',
    blurb: 'Buy vegetables from Walia’s stall: say what you need, how much, and ask for a better price.',
    turns: [
      {
        walia: enG('Good morning! What are you looking for today?', 'እንደምን አደርክ! ዛሬ ምን ትፈልጋለህ?', 'እንደምን አደርሽ! ዛሬ ምን ትፈልጊያለሽ?'),
        goal: 'Say what you want to buy.',
        answers: [
          {
            pattern:
              /\b(onion|onions|tomato|tomatoes|bread|banana|bananas|coffee|potato|potatoes|carrot|carrots|fruit|vegetables|apple|apples|orange|oranges|garlic|eggs|i need|i want|looking for)\b/,
          },
        ],
        example: en('I’m looking for tomatoes and onions.', 'ቲማቲምና ሽንኩርት እየፈለግኩ ነው።'),
      },
      {
        walia: enG('How many kilos do you need?', 'ስንት ኪሎ ትፈልጋለህ?', 'ስንት ኪሎ ትፈልጊያለሽ?'),
        goal: 'Say how much you need.',
        answers: [{ pattern: /\b(one|two|three|four|five|six|half|kilo|kilos|a few|\d+)\b/ }],
        example: en('Two kilos, please.', 'ሁለት ኪሎ፣ እባክህ።'),
      },
      {
        walia: enG('That’s two hundred birr.', 'ሁለት መቶ ብር ነው።', 'ሁለት መቶ ብር ነው።'),
        goal: 'Say it’s too expensive and ask for a lower price, politely.',
        answers: [{ pattern: /\b(expensive|cheaper|lower|discount|less|too much|how about|can you|best price|reduce)\b/ }],
        example: en('That’s expensive. Can you make it cheaper?', 'ውድ ነው። ትንሽ ቀንስልኝ?'),
      },
      {
        walia: enG('Okay, one hundred and fifty birr, just for you.', 'እሺ፣ ላንተ ብቻ መቶ ሃምሳ ብር።', 'እሺ፣ ላንቺ ብቻ መቶ ሃምሳ ብር።'),
        goal: 'Agree to the price and thank Walia.',
        answers: [{ pattern: /\b(deal|okay|ok|great|fine|perfect|agree|good)\b/ }, ...THANKS],
        example: en('Deal! Thank you very much.', 'ተስማማን! በጣም አመሰግናለሁ።'),
      },
    ],
  },
  {
    slug: 'en-phone',
    lang: 'en',
    title: 'A phone call',
    amharicTitle: 'የስልክ ጥሪ',
    level: 'intermediate',
    blurb: 'Call Walia to make plans for the weekend, even with a bad line.',
    turns: [
      {
        walia: enG('Hello? Who is this?', 'ሃሎ? ማን ልበል?', 'ሃሎ? ማን ልበል?'),
        goal: 'Say who you are, like “Hi, it’s Hana.”',
        answers: [{ pattern: NAME }],
        example: en('Hi, it’s Hana.', 'ሰላም፣ ሃና ነኝ።'),
      },
      {
        walia: enG(
          'Oh, hi! Sorry, the line is bad. Can you speak louder?',
          'ኦ፣ ሰላም! ይቅርታ፣ መስመሩ ጥሩ አይደለም። ጮክ ብለህ መናገር ትችላለህ?',
          'ኦ፣ ሰላም! ይቅርታ፣ መስመሩ ጥሩ አይደለም። ጮክ ብለሽ መናገር ትችያለሽ?',
        ),
        goal: 'Agree, and check whether he can hear you now.',
        answers: [{ pattern: /\b(yes|sure|okay|ok|of course|hear|better|louder|now)\b/ }],
        example: en('Sure! Can you hear me now?', 'እሺ! አሁን ትሰማኛለህ?'),
      },
      {
        walia: enG('Yes, much better. Why are you calling?', 'አዎ፣ አሁን በጣም ተሻለ። ለምን ደወልክ?', 'አዎ፣ አሁን በጣም ተሻለ። ለምን ደወልሽ?'),
        goal: 'Say why you are calling, in a sentence.',
        answers: [{ open: 3 }],
        example: en('I’m calling to make plans for the weekend.', 'ለቅዳሜና እሁድ ዕቅድ ለማውጣት ነው የደወልኩት።'),
      },
      {
        walia: enG('Let’s meet on Saturday. Is that okay?', 'ቅዳሜ እንገናኝ። ይመችሃል?', 'ቅዳሜ እንገናኝ። ይመችሻል?'),
        goal: 'Agree, or suggest another day.',
        answers: [
          { pattern: /\b(yes|okay|ok|sure|fine|perfect|great|saturday|sunday|friday|monday|another|can t|cannot|busy)\b/ },
        ],
        example: en('Saturday is perfect. See you then!', 'ቅዳሜ በጣም ይመቸኛል። እንገናኝ!'),
      },
    ],
  },

  // ---------------------------------------------------------------- Advanced
  {
    slug: 'en-interview',
    lang: 'en',
    title: 'A job interview',
    amharicTitle: 'የሥራ ቃለ መጠይቅ',
    level: 'advanced',
    blurb: 'Walia is interviewing you for a job. Talk about yourself, your strengths and why you want it.',
    turns: [
      {
        walia: enG(
          'Good morning. Please tell me a little about yourself.',
          'እንደምን አደርክ። እባክህ ስለራስህ ትንሽ ንገረኝ።',
          'እንደምን አደርሽ። እባክሽ ስለራስሽ ትንሽ ንገሪኝ።',
        ),
        goal: 'Introduce yourself in full sentences: your name, where you’re from, and what you do.',
        answers: [{ open: 6 }],
        example: en(
          'My name is Hana. I’m from Ethiopia, and I worked as a nurse for three years.',
          'ስሜ ሃና ነው። ከኢትዮጵያ ነኝ፣ ለሦስት ዓመት ነርስ ሆኜ ሠርቻለሁ።',
        ),
      },
      {
        walia: enG('Why do you want this job?', 'ይህን ሥራ ለምን ትፈልጋለህ?', 'ይህን ሥራ ለምን ትፈልጊያለሽ?'),
        goal: 'Give a reason in a full sentence.',
        answers: [{ open: 5 }],
        example: en('I enjoy helping people, and I want to grow in my career.', 'ሰዎችን መርዳት ያስደስተኛል፣ በሙያዬም ማደግ እፈልጋለሁ።'),
      },
      {
        walia: enG('What are your strengths?', 'ጠንካራ ጎኖችህ ምንድን ናቸው?', 'ጠንካራ ጎኖችሽ ምንድን ናቸው?'),
        goal: 'Name one or two strengths, in a sentence.',
        answers: [{ open: 4 }],
        example: en('I’m hardworking, and I learn quickly.', 'ታታሪ ነኝ፣ በፍጥነትም እማራለሁ።'),
      },
      {
        walia: enG('Do you have any questions for me?', 'ለኔ ጥያቄ አለህ?', 'ለኔ ጥያቄ አለሽ?'),
        goal: 'Ask Walia a question about the job, or say politely that you have none.',
        answers: [{ open: 3 }, { pattern: /\b(what|when|how|where|is there|can i|do you|no)\b/ }],
        example: en('Yes. When does the job start?', 'አዎ። ሥራው መቼ ይጀምራል?'),
      },
      {
        walia: enG(
          'Thank you for coming. We will call you next week.',
          'ስለመጣህ እናመሰግናለን። በሚቀጥለው ሳምንት እንደውልልሃለን።',
          'ስለመጣሽ እናመሰግናለን። በሚቀጥለው ሳምንት እንደውልልሻለን።',
        ),
        goal: 'Thank Walia politely.',
        answers: [...THANKS, { pattern: /\b(nice|pleasure|look forward|great)\b/ }],
        example: en('Thank you for your time. I look forward to hearing from you.', 'ጊዜህን ስለሰጠኸኝ አመሰግናለሁ። ከአንተ ለመስማት በጉጉት እጠብቃለሁ።'),
      },
    ],
  },
  {
    slug: 'en-new-life',
    lang: 'en',
    title: 'Life in a new country',
    amharicTitle: 'ሕይወት በአዲስ አገር',
    level: 'advanced',
    blurb: 'Walia is a curious neighbour. Talk about moving, what you miss from home, and your plans.',
    turns: [
      {
        walia: enG('How long have you lived here?', 'እዚህ ለምን ያህል ጊዜ ኖርክ?', 'እዚህ ለምን ያህል ጊዜ ኖርሽ?'),
        goal: 'Say how long you have lived here.',
        answers: [{ pattern: /\b(year|years|month|months|week|weeks|since|long|short|new|just)\b/ }, { open: 4 }],
        example: en('I’ve lived here for two years.', 'እዚህ ለሁለት ዓመት ኖሬያለሁ።'),
      },
      {
        walia: enG('What do you miss most about home?', 'ከአገር ቤት በጣም የሚናፍቅህ ምንድን ነው?', 'ከአገር ቤት በጣም የሚናፍቅሽ ምንድን ነው?'),
        goal: 'Say what you miss, in a full sentence.',
        answers: [{ open: 4 }],
        example: en('I miss my family and the coffee ceremony.', 'ቤተሰቤና የቡና ሥነ ሥርዓቱ ይናፍቁኛል።'),
      },
      {
        walia: enG('What was hard when you first arrived?', 'መጀመሪያ ስትመጣ ምን ከበደህ?', 'መጀመሪያ ስትመጪ ምን ከበደሽ?'),
        goal: 'Describe something that was difficult, in a full sentence (past tense).',
        answers: [{ open: 5 }],
        example: en('The language was hard, and I didn’t know anyone.', 'ቋንቋው ከባድ ነበር፣ ማንንም አላውቅም ነበር።'),
      },
      {
        walia: enG('What are your plans for the future?', 'የወደፊት ዕቅድህ ምንድን ነው?', 'የወደፊት ዕቅድሽ ምንድን ነው?'),
        goal: 'Talk about your plans, in a full sentence (future tense).',
        answers: [{ open: 5 }],
        example: en('I want to finish my studies and open my own business.', 'ትምህርቴን ጨርሼ የራሴን ንግድ መክፈት እፈልጋለሁ።'),
      },
    ],
  },
];
