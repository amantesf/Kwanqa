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

const BYE = /\b(bye|goodbye|see you|later|take care)\b/;
const YOU_TOO = /\b(you too|same to you|bye)\b/;
const NUMBER = /\b(\d+|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\b/;

export const englishConversations: Conversation[] = [
  // ---------------------------------------------------------------- Beginner
  // Short questions with simple answers, for learners just starting English.
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
        goal: 'Say how you are, like “I’m fine, thank you.”',
        answers: [{ pattern: /\b(fine|good|great|ok|okay|well|not bad)\b/ }],
        example: en('I’m fine, thank you. And you?', 'ደህና ነኝ፣ አመሰግናለሁ። አንተስ?'),
      },
      {
        walia: enG('I’m good, thanks! What’s your name?', 'ደህና ነኝ፣ አመሰግናለሁ! ስምህ ማን ነው?', 'ደህና ነኝ፣ አመሰግናለሁ! ስምሽ ማን ነው?'),
        goal: 'Say your name, like “My name is Hana.”',
        answers: [{ pattern: NAME }],
        example: en('My name is Hana.', 'ስሜ ሃና ነው።'),
      },
      {
        walia: enG('Nice to meet you! Where are you from?', 'ስለተዋወቅን ደስ ብሎኛል! ከየት ነህ?', 'ስለተዋወቅን ደስ ብሎኛል! ከየት ነሽ?'),
        goal: 'Say where you are from, like “I’m from Ethiopia.”',
        answers: [{ pattern: /\bfrom \S+/ }],
        example: en('I’m from Ethiopia.', 'ከኢትዮጵያ ነኝ።'),
      },
      {
        walia: enG('Do you speak English?', 'እንግሊዝኛ ትናገራለህ?', 'እንግሊዝኛ ትናገሪያለሽ?'),
        goal: 'Say yes, no, or a little.',
        answers: [{ pattern: /\b(yes|no|little|bit|some)\b/ }],
        example: en('Yes, a little.', 'አዎ፣ ትንሽ።'),
      },
      {
        walia: en('Great! See you later!', 'በጣም ጥሩ! በኋላ እንገናኝ!'),
        goal: 'Say goodbye, like “Bye! See you later.”',
        answers: [{ pattern: BYE }, ...THANKS],
        example: en('Bye! See you later.', 'ደህና ሁን! በኋላ እንገናኝ።'),
      },
    ],
  },
  {
    slug: 'en-family',
    lang: 'en',
    title: 'Your family',
    amharicTitle: 'ቤተሰብ',
    level: 'beginner',
    blurb: 'Tell Walia about your brothers and sisters, your mom, and where your family lives.',
    turns: [
      {
        walia: enG('Do you have brothers or sisters?', 'ወንድም ወይም እህት አለህ?', 'ወንድም ወይም እህት አለሽ?'),
        goal: 'Say yes or no, and how many, like “Yes, I have two sisters.”',
        answers: [{ pattern: /\b(yes|no|brother|brothers|sister|sisters)\b/ }],
        example: en('Yes, I have two sisters.', 'አዎ፣ ሁለት እህቶች አሉኝ።'),
      },
      {
        walia: enG('What is your mother’s name?', 'የእናትህ ስም ማን ነው?', 'የእናትሽ ስም ማን ነው?'),
        goal: 'Say your mother’s name, like “Her name is Almaz.”',
        answers: [{ pattern: /\b(name is|name s|she is|she s|it s|its)\b \S+/ }],
        example: en('Her name is Almaz.', 'ስሟ አልማዝ ነው።'),
      },
      {
        walia: enG('Where does your family live?', 'ቤተሰብህ የት ይኖራሉ?', 'ቤተሰብሽ የት ይኖራሉ?'),
        goal: 'Say where your family lives, like “They live in Addis Ababa.”',
        answers: [{ pattern: /\b(live|lives|living|in)\b \S+/ }],
        example: en('They live in Addis Ababa.', 'አዲስ አበባ ይኖራሉ።'),
      },
      {
        walia: enG('Do you have children?', 'ልጆች አሉህ?', 'ልጆች አሉሽ?'),
        goal: 'Say yes or no, like “Yes, one son” or “No, not yet.”',
        answers: [{ pattern: /\b(yes|no|son|sons|daughter|daughters|children|kids|not yet)\b/ }],
        example: en('No, not yet.', 'የለኝም፣ ገና ነው።'),
      },
      {
        walia: enG('That’s nice! Say hello to your family!', 'ደስ ይላል! ለቤተሰብህ ሰላም በልልኝ!', 'ደስ ይላል! ለቤተሰብሽ ሰላም በይልኝ!'),
        goal: 'Say thank you, or “OK, I will!”',
        answers: [...THANKS, { pattern: /\b(ok|okay|sure|i will|will do|bye)\b/ }],
        example: en('Thank you, I will!', 'አመሰግናለሁ፣ እላለሁ!'),
      },
    ],
  },
  {
    slug: 'en-shop',
    lang: 'en',
    title: 'At the shop',
    amharicTitle: 'ሱቅ',
    level: 'beginner',
    blurb: 'Walia works at a small shop. Ask for what you want, say how many, and pay.',
    turns: [
      {
        walia: enG('Hello! Can I help you?', 'ሰላም! ልርዳህ?', 'ሰላም! ልርዳሽ?'),
        goal: 'Say what you want, like “Yes, I want bread, please.”',
        answers: [{ pattern: /\b(i want|i need|i d like|i would like|can i have|do you have|please)\b/ }],
        example: en('Yes, I want bread, please.', 'አዎ፣ ዳቦ እፈልጋለሁ፣ እባክህ።'),
      },
      {
        walia: en('How many?', 'ስንት?'),
        goal: 'Say a number, like “Two, please.”',
        answers: [{ pattern: NUMBER }],
        example: en('Two, please.', 'ሁለት፣ እባክህ።'),
      },
      {
        walia: en('Anything else?', 'ሌላ ነገር?'),
        goal: 'Say no, that’s all, or ask for one more thing.',
        answers: [{ pattern: /\b(no|yes|that s all|that s it|nothing|and|i want|please)\b/ }],
        example: en('No, that’s all. Thank you.', 'አይ፣ በቃ። አመሰግናለሁ።'),
      },
      {
        walia: en('That’s five dollars.', 'አምስት ዶላር ነው።'),
        goal: 'Pay, like “Here you go.”',
        answers: [{ pattern: /\b(here|ok|okay|card|cash)\b/ }, ...THANKS],
        example: en('Here you go.', 'እንካ።'),
      },
      {
        walia: en('Thank you! Have a nice day!', 'አመሰግናለሁ! መልካም ቀን!'),
        goal: 'Say thanks, or “You too!”',
        answers: [...THANKS, { pattern: YOU_TOO }],
        example: en('Thank you, you too!', 'አመሰግናለሁ፣ ላንተም!'),
      },
    ],
  },
  {
    slug: 'en-day',
    lang: 'en',
    title: 'Your day',
    amharicTitle: 'የዕለት ቀን',
    level: 'beginner',
    blurb: 'Good morning! Tell Walia how you slept, what time it is, and what you want for breakfast.',
    turns: [
      {
        walia: enG('Good morning! Did you sleep well?', 'እንደምን አደርክ? በደንብ ተኛህ?', 'እንደምን አደርሽ? በደንብ ተኛሽ?'),
        goal: 'Say yes or no, like “Yes, I slept well.”',
        answers: [{ pattern: /\b(yes|no|well|good|fine|ok|okay|slept)\b/ }],
        example: en('Yes, I slept well. Thank you.', 'አዎ፣ በደንብ ተኛሁ። አመሰግናለሁ።'),
      },
      {
        walia: en('What time is it?', 'ስንት ሰዓት ነው?'),
        goal: 'Say the time, like “It’s eight o’clock.”',
        answers: [{ pattern: NUMBER }, { pattern: /\b(o clock|half|quarter|morning)\b/ }],
        example: en('It’s eight o’clock.', 'ሁለት ሰዓት ነው።'),
      },
      {
        walia: enG('Do you work today?', 'ዛሬ ትሠራለህ?', 'ዛሬ ትሠሪያለሽ?'),
        goal: 'Say yes or no, like “Yes, I work today” or “No, I go to school.”',
        answers: [{ pattern: /\b(yes|no|work|school|study|day off)\b/ }],
        example: en('Yes, I work today.', 'አዎ፣ ዛሬ እሠራለሁ።'),
      },
      {
        walia: enG('What do you want for breakfast?', 'ለቁርስ ምን ትፈልጋለህ?', 'ለቁርስ ምን ትፈልጊያለሽ?'),
        goal: 'Say what you want to eat or drink, like “I want bread and tea.”',
        answers: [{ pattern: /\b(i want|i d like|i would like|eggs|egg|bread|tea|coffee|milk|fruit|nothing)\b/ }],
        example: en('I want bread and tea.', 'ዳቦና ሻይ እፈልጋለሁ።'),
      },
      {
        walia: enG('Have a good day!', 'መልካም ቀን ይሁንልህ!', 'መልካም ቀን ይሁንልሽ!'),
        goal: 'Say thanks, or “You too!”',
        answers: [...THANKS, { pattern: YOU_TOO }],
        example: en('Thanks, you too!', 'አመሰግናለሁ፣ ላንተም!'),
      },
    ],
  },

  // ------------------------------------------------------------ Intermediate
  // Real, everyday situations.
  {
    slug: 'en-meeting',
    lang: 'en',
    title: 'Meeting someone new',
    amharicTitle: 'ሰው መተዋወቅ',
    level: 'intermediate',
    blurb: 'Walia sits next to you at a community event. Talk about your work, how long you’ve lived here and what you enjoy.',
    turns: [
      {
        walia: enG(
          'Hi! I don’t think we’ve met. I’m Walia. What do you do for a living?',
          'ሰላም! የተዋወቅን አይመስለኝም። ዋሊያ እባላለሁ። ሥራህ ምንድን ነው?',
          'ሰላም! የተዋወቅን አይመስለኝም። ዋሊያ እባላለሁ። ሥራሽ ምንድን ነው?',
        ),
        goal: 'Say what you do for work or study, in a sentence.',
        answers: [{ pattern: /\b(i m|i am|i work|work as|i study|student|nurse|driver|teacher|engineer|doctor|job|work|study)\b/ }],
        example: en('I work as a nurse at a hospital. And you?', 'ሆስፒታል ውስጥ ነርስ ሆኜ እሠራለሁ። አንተስ?'),
      },
      {
        walia: enG('Interesting! How long have you lived here?', 'ደስ ይላል! እዚህ ለምን ያህል ጊዜ ኖርክ?', 'ደስ ይላል! እዚህ ለምን ያህል ጊዜ ኖርሽ?'),
        goal: 'Say how long you have lived here, like “I’ve lived here for two years.”',
        answers: [{ pattern: /\b(year|years|month|months|week|weeks|since|ago|born|all my life|whole life)\b/ }],
        example: en('I’ve lived here for two years. I moved for work.', 'እዚህ ለሁለት ዓመት ኖሬያለሁ። ለሥራ ብዬ ነው የመጣሁት።'),
      },
      {
        walia: enG('What do you like to do in your free time?', 'በትርፍ ጊዜህ ምን ማድረግ ትወዳለህ?', 'በትርፍ ጊዜሽ ምን ማድረግ ትወጃለሽ?'),
        goal: 'Say what you enjoy doing, in a sentence.',
        answers: [{ open: 3 }],
        example: en('I enjoy cooking and watching football with friends.', 'ማብሰልና ከጓደኞቼ ጋር እግር ኳስ ማየት ያስደስተኛል።'),
      },
      {
        walia: enG(
          'Me too! Would you like to get coffee sometime?',
          'እኔም! አንድ ቀን አብረን ቡና ብንጠጣ ትፈልጋለህ?',
          'እኔም! አንድ ቀን አብረን ቡና ብንጠጣ ትፈልጊያለሽ?',
        ),
        goal: 'Accept and suggest a day, or say no politely with a reason.',
        answers: [{ pattern: /\b(yes|sure|sounds|love to|i d like|would like|of course|sorry|busy|maybe|saturday|sunday|friday|tomorrow|next week|weekend)\b/ }],
        example: en('That sounds great! How about Saturday afternoon?', 'በጣም ጥሩ ሐሳብ ነው! ቅዳሜ ከሰዓትስ?'),
      },
    ],
  },
  {
    slug: 'en-restaurant',
    lang: 'en',
    title: 'At a restaurant',
    amharicTitle: 'ምግብ ቤት',
    level: 'intermediate',
    blurb: 'Walia is your waiter. Order a meal, deal with a small problem, and pay.',
    turns: [
      {
        walia: enG('Good evening! Are you ready to order?', 'እንደምን አመሸህ! ለማዘዝ ዝግጁ ነህ?', 'እንደምን አመሸሽ! ለማዘዝ ዝግጁ ነሽ?'),
        goal: 'Order a dish politely, or ask what Walia recommends.',
        answers: [
          { pattern: /\b(i ll have|i will have|i d like|i would like|can i have|could i have|recommend|chicken|fish|pasta|salad|soup|rice|burger|pizza|steak)\b/ },
        ],
        example: en('Yes, I’ll have the chicken with rice, please.', 'አዎ፣ ዶሮ በሩዝ እወስዳለሁ፣ እባክህ።'),
      },
      {
        walia: enG('Great choice. And what would you like to drink?', 'ጥሩ ምርጫ። ምን መጠጣት ትፈልጋለህ?', 'ጥሩ ምርጫ። ምን መጠጣት ትፈልጊያለሽ?'),
        goal: 'Order a drink.',
        answers: [{ pattern: /\b(water|juice|tea|coffee|soda|coke|lemonade|milk|nothing|just)\b/ }],
        example: en('Just water, please.', 'ውሃ ብቻ፣ እባክህ።'),
      },
      {
        walia: enG('Here’s your food. Is everything okay?', 'ምግብህ ይኸው። ሁሉም ነገር ደህና ነው?', 'ምግብሽ ይኸው። ሁሉም ነገር ደህና ነው?'),
        goal: 'Say politely that something is wrong (it’s cold, or it’s not what you ordered).',
        answers: [{ pattern: /\b(cold|wrong|didn t order|did not order|mistake|not what|excuse me|sorry|actually|spicy|salty)\b/ }],
        example: en('Excuse me, I think my food is a little cold.', 'ይቅርታ፣ ምግቤ ትንሽ የቀዘቀዘ ይመስለኛል።'),
      },
      {
        walia: enG(
          'I’m so sorry! I’ll bring you a new one right away.',
          'በጣም ይቅርታ! አሁኑኑ አዲስ አመጣልሃለሁ።',
          'በጣም ይቅርታ! አሁኑኑ አዲስ አመጣልሻለሁ።',
        ),
        goal: 'Thank Walia, and ask for the bill when you’re ready.',
        answers: [...THANKS, { pattern: /\b(bill|check|pay|card|cash|no problem|that s okay|that s fine)\b/ }],
        example: en('Thank you! Could we have the bill when you have a moment?', 'አመሰግናለሁ! ጊዜ ሲኖርህ ሂሳቡን ልታመጣልን ትችላለህ?'),
      },
    ],
  },
  {
    slug: 'en-landlord',
    lang: 'en',
    title: 'Calling your landlord',
    amharicTitle: 'ለአከራይ መደወል',
    level: 'intermediate',
    blurb: 'Something is broken in your apartment. Explain the problem to Walia, your landlord, and set a time for a repair.',
    turns: [
      {
        walia: enG('Hello, this is Walia. How can I help you?', 'ሃሎ፣ ዋሊያ ነኝ። ምን ልርዳህ?', 'ሃሎ፣ ዋሊያ ነኝ። ምን ልርዳሽ?'),
        goal: 'Say who you are and what the problem is, like “The heating isn’t working.”',
        answers: [
          { pattern: /\b(broken|not working|isn t working|doesn t work|leak|leaking|heating|heater|water|light|lights|door|window|toilet|shower|problem|fix)\b/ },
        ],
        example: en('Hi, this is Hana from apartment 4B. The heating isn’t working.', 'ሰላም፣ ከአፓርታማ 4B ሃና ነኝ። ማሞቂያው እየሠራ አይደለም።'),
      },
      {
        walia: enG('Oh no. When did it start?', 'ወይ። መቼ ጀመረ?', 'ወይ። መቼ ጀመረ?'),
        goal: 'Say when the problem started, using the past tense.',
        answers: [{ pattern: /\b(yesterday|last night|this morning|today|ago|since|monday|tuesday|wednesday|thursday|friday|saturday|sunday|week|days)\b/ }],
        example: en('It started last night.', 'ትናንት ማታ ነው የጀመረው።'),
      },
      {
        walia: enG(
          'I can send someone tomorrow at ten. Will you be home?',
          'ነገ በአራት ሰዓት ሰው መላክ እችላለሁ። ቤት ትኖራለህ?',
          'ነገ በአራት ሰዓት ሰው መላክ እችላለሁ። ቤት ትኖሪያለሽ?',
        ),
        goal: 'Say yes, or suggest another time that works for you.',
        answers: [{ pattern: /\b(yes|sure|okay|ok|fine|works|i ll be|i will be|no|can t|cannot|work|afternoon|morning|later|after|another)\b/ }],
        example: en('Yes, I’ll be home. Ten o’clock works for me.', 'አዎ፣ ቤት እሆናለሁ። አራት ሰዓት ይመቸኛል።'),
      },
      {
        walia: enG(
          'Perfect. Is there anything else I can help with?',
          'በጣም ጥሩ። ሌላ የምረዳህ ነገር አለ?',
          'በጣም ጥሩ። ሌላ የምረዳሽ ነገር አለ?',
        ),
        goal: 'Say there’s nothing else and thank Walia, or mention one more small problem.',
        answers: [...THANKS, { pattern: /\b(no|nothing|that s all|that s it|also|and|one more)\b/ }],
        example: en('No, that’s all. Thanks for your help!', 'አይ፣ ይኸው ነው። ስለረዳኸኝ አመሰግናለሁ!'),
      },
    ],
  },

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
