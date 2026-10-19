import type { Course, CourseSummary } from '@/lib/courses';

// The English course, for Amharic speakers. English is what's being learned, so
// it's shown big with the Amharic meaning underneath, and practice quizzes the
// English. Each camp builds on the last: Camp 1 is for complete beginners and
// Camp 6 for learners who can already hold a conversation.
// Amharic uses the masculine "you" (አንተ) unless a line says otherwise.

type Line = { amharic: string; transliteration: string; english: string };

/** A phrase: English first, then its Amharic meaning. */
const p = (english: string, amharic: string): Line => ({ english, amharic, transliteration: '' });

/** A dialogue line. */
const d = (speaker: 'A' | 'B', english: string, amharic: string) => ({ speaker, ...p(english, amharic) });

export const englishCourses: Record<string, Course> = {
  'english-from-amharic-1': {
    title: 'English Camp 1 – Hello & Basics',
    intro: 'Your first English words: greetings, introductions, and polite phrases for every day.',
    sections: [
      {
        title: 'Lesson 1 – Greetings',
        description: 'Say hello at any time of day and ask how someone is.',
        phrases: [
          p('Hello.', 'ሰላም።'),
          p('Good morning.', 'እንደምን አደርክ? (የጠዋት ሰላምታ)'),
          p('Good afternoon.', 'እንደምን ዋልክ? (የከሰዓት ሰላምታ)'),
          p('Good evening.', 'እንደምን አመሸህ? (የምሽት ሰላምታ)'),
          p('How are you?', 'እንዴት ነህ?'),
          p('I’m fine, thank you. And you?', 'ደህና ነኝ፣ አመሰግናለሁ። አንተስ?'),
        ],
        dialogue: [
          d('A', 'Good morning! How are you?', 'እንደምን አደርክ! እንዴት ነህ?'),
          d('B', 'I’m fine, thank you. And you?', 'ደህና ነኝ፣ አመሰግናለሁ። አንተስ?'),
          d('A', 'I’m fine too.', 'እኔም ደህና ነኝ።'),
        ],
        note: 'In English, “How are you?” is the same for a man, a woman, or a group. Amharic changes it: እንዴት ነህ / ነሽ / ናችሁ.',
      },
      {
        title: 'Lesson 2 – Introducing Yourself',
        description: 'Tell people your name and where you’re from, and ask about them.',
        phrases: [
          p('My name is Hana.', 'ስሜ ሃና ነው።'),
          p('What is your name?', 'ስምህ ማን ነው?'),
          p('Nice to meet you.', 'ስለተዋወቅን ደስ ብሎኛል።'),
          p('Where are you from?', 'ከየት ነህ?'),
          p('I am from Ethiopia.', 'ከኢትዮጵያ ነኝ።'),
          p('I live in Addis Ababa.', 'የምኖረው አዲስ አበባ ነው።'),
        ],
        dialogue: [
          d('A', 'Hello, my name is Hana. What is your name?', 'ሰላም፣ ስሜ ሃና ነው። ስምህ ማን ነው?'),
          d('B', 'My name is Dawit. Nice to meet you.', 'ስሜ ዳዊት ነው። ስለተዋወቅን ደስ ብሎኛል።'),
          d('A', 'Where are you from?', 'ከየት ነህ?'),
          d('B', 'I am from Ethiopia. I live in Addis Ababa.', 'ከኢትዮጵያ ነኝ። የምኖረው አዲስ አበባ ነው።'),
        ],
        note: 'Use “I am” (or “I’m”) to talk about yourself. English puts it near the start: “I am from Ethiopia.” Amharic puts it at the end: ከኢትዮጵያ ነኝ።',
      },
      {
        title: 'Lesson 3 – Polite Words',
        description: 'Please, thank you, sorry, and asking for help.',
        phrases: [
          p('Please.', 'እባክህ።'),
          p('Thank you.', 'አመሰግናለሁ።'),
          p('You’re welcome.', 'ምንም አይደለም።'),
          p('Excuse me.', 'ይቅርታ። (ትኩረት ለመሳብ)'),
          p('I’m sorry.', 'አዝናለሁ።'),
          p('Can you help me?', 'ልትረዳኝ ትችላለህ?'),
        ],
        dialogue: [
          d('A', 'Excuse me, can you help me?', 'ይቅርታ፣ ልትረዳኝ ትችላለህ?'),
          d('B', 'Yes, no problem.', 'አዎ፣ ችግር የለም።'),
          d('A', 'Thank you very much!', 'በጣም አመሰግናለሁ!'),
          d('B', 'You’re welcome.', 'ምንም አይደለም።'),
        ],
        note: 'English speakers say “please” and “thank you” a lot, even in shops and with family. Adding “please” makes any request polite.',
      },
      {
        title: 'Lesson 4 – Yes, No & Understanding',
        description: 'Say when you understand, and ask people to slow down or repeat.',
        phrases: [
          p('Yes.', 'አዎ።'),
          p('No.', 'አይ።'),
          p('I understand.', 'ገባኝ።'),
          p('I don’t understand.', 'አልገባኝም።'),
          p('Please speak slowly.', 'እባክህ ቀስ ብለህ ተናገር።'),
          p('Can you repeat that?', 'እንደገና ልትደግመው ትችላለህ?'),
        ],
        dialogue: [
          d('A', 'Do you understand?', 'ገባህ?'),
          d('B', 'No, I don’t understand. Please speak slowly.', 'አይ፣ አልገባኝም። እባክህ ቀስ ብለህ ተናገር።'),
          d('A', 'OK. I will say it again.', 'እሺ። እንደገና እደግመዋለሁ።'),
        ],
        note: '“Don’t” is short for “do not”. Put it before the verb to make it negative: I understand → I don’t understand.',
      },
      {
        title: 'Lesson 5 – Saying Goodbye',
        description: 'End a conversation warmly, in the day or at night.',
        phrases: [
          p('Goodbye.', 'ደህና ሁን።'),
          p('See you tomorrow.', 'ነገ እንገናኝ።'),
          p('See you later.', 'በኋላ እንገናኝ።'),
          p('Have a nice day.', 'መልካም ቀን ይሁንልህ።'),
          p('Good night.', 'ደህና እደር።'),
          p('Take care.', 'ራስህን ጠብቅ።'),
        ],
        dialogue: [
          d('A', 'I have to go. See you tomorrow!', 'መሄድ አለብኝ። ነገ እንገናኝ!'),
          d('B', 'OK, have a nice day!', 'እሺ፣ መልካም ቀን ይሁንልህ!'),
          d('A', 'Thank you. Goodbye!', 'አመሰግናለሁ። ደህና ሁን!'),
        ],
        note: '“Good night” is only for saying goodbye at night or before bed. To greet someone in the evening, say “Good evening”.',
      },
    ],
  },

  'english-from-amharic-2': {
    title: 'English Camp 2 – Family, Work & Your Day',
    intro: 'Talk about the people in your life, what you do, and your daily routine.',
    sections: [
      {
        title: 'Lesson 1 – Family',
        description: 'Introduce your family and ask about someone else’s.',
        phrases: [
          p('This is my mother.', 'ይህች እናቴ ናት።'),
          p('This is my father.', 'ይህ አባቴ ነው።'),
          p('I have two brothers.', 'ሁለት ወንድሞች አሉኝ።'),
          p('I have one sister.', 'አንድ እህት አለችኝ።'),
          p('My grandmother lives with us.', 'አያቴ ከእኛ ጋር ትኖራለች።'),
          p('Do you have children?', 'ልጆች አሉህ?'),
        ],
        dialogue: [
          d('A', 'Do you have brothers or sisters?', 'ወንድሞች ወይም እህቶች አሉህ?'),
          d('B', 'Yes, I have two brothers and one sister.', 'አዎ፣ ሁለት ወንድሞችና አንድ እህት አሉኝ።'),
          d('A', 'My father lives in Europe.', 'አባቴ አውሮፓ ይኖራል።'),
        ],
        note: 'For more than one, English usually adds -s: brother → brothers, sister → sisters. Amharic changes the ending too: ወንድም → ወንድሞች.',
      },
      {
        title: 'Lesson 2 – Work & Study',
        description: 'Say what you do for work or school.',
        phrases: [
          p('What do you do?', 'ሥራህ ምንድን ነው?'),
          p('I am a student.', 'ተማሪ ነኝ።'),
          p('I am a nurse.', 'ነርስ ነኝ።'),
          p('I work in an office.', 'ቢሮ ውስጥ እሠራለሁ።'),
          p('I study English.', 'እንግሊዝኛ እማራለሁ።'),
          p('I work from home.', 'ከቤት ሆኜ እሠራለሁ።'),
        ],
        dialogue: [
          d('A', 'What do you do?', 'ሥራህ ምንድን ነው?'),
          d('B', 'I am a student. I study English. And you?', 'ተማሪ ነኝ። እንግሊዝኛ እማራለሁ። አንተስ?'),
          d('A', 'I work in an office.', 'ቢሮ ውስጥ እሠራለሁ።'),
        ],
        note: 'Put “a” before a job: I am a student, I am a nurse. Use “an” before a vowel sound: an engineer, an office.',
      },
      {
        title: 'Lesson 3 – Your Day',
        description: 'Describe your routine, from waking up to going to bed.',
        phrases: [
          p('I wake up at six in the morning.', 'ጠዋት አስራ ሁለት ሰዓት እነሳለሁ።'),
          p('I eat breakfast.', 'ቁርስ እበላለሁ።'),
          p('I go to work at eight.', 'ሁለት ሰዓት ወደ ሥራ እሄዳለሁ።'),
          p('I come home in the evening.', 'ምሽት ወደ ቤት እመለሳለሁ።'),
          p('I go to bed at ten.', 'አራት ሰዓት እተኛለሁ።'),
          p('every day', 'በየቀኑ'),
        ],
        dialogue: [
          d('A', 'What time do you wake up?', 'ስንት ሰዓት ትነሳለህ?'),
          d('B', 'I wake up at six in the morning, every day.', 'በየቀኑ ጠዋት አስራ ሁለት ሰዓት እነሳለሁ።'),
          d('A', 'That’s early!', 'በጣም ማለዳ ነው!'),
        ],
        note: 'English uses the international clock. To change Ethiopian time to English time, add 6 hours: 12 o’clock in the morning (Ethiopian) is 6 a.m. in English.',
      },
      {
        title: 'Lesson 4 – Numbers & Age',
        description: 'Count to ten, and say your age and phone number.',
        phrases: [
          p('one, two, three', 'አንድ፣ ሁለት፣ ሦስት'),
          p('four, five, six', 'አራት፣ አምስት፣ ስድስት'),
          p('seven, eight, nine, ten', 'ሰባት፣ ስምንት፣ ዘጠኝ፣ አስር'),
          p('How old are you?', 'ዕድሜህ ስንት ነው?'),
          p('I am twenty years old.', 'ዕድሜዬ ሃያ ነው።'),
          p('My phone number is …', 'ስልክ ቁጥሬ … ነው።'),
        ],
        dialogue: [
          d('A', 'How old are you?', 'ዕድሜህ ስንት ነው?'),
          d('B', 'I am twenty years old. And you?', 'ዕድሜዬ ሃያ ነው። አንተስ?'),
          d('A', 'I am twenty-five.', 'ዕድሜዬ ሃያ አምስት ነው።'),
        ],
        note: 'Say your age with “I am … years old”, never “I have … years”.',
      },
      {
        title: 'Lesson 5 – Days of the Week',
        description: 'Name the days and make plans.',
        phrases: [
          p('Monday, Tuesday, Wednesday', 'ሰኞ፣ ማክሰኞ፣ ረቡዕ'),
          p('Thursday, Friday', 'ሐሙስ፣ ዓርብ'),
          p('Saturday, Sunday', 'ቅዳሜ፣ እሑድ'),
          p('What day is it today?', 'ዛሬ ምን ቀን ነው?'),
          p('Today is Monday.', 'ዛሬ ሰኞ ነው።'),
          p('See you on Friday.', 'ዓርብ እንገናኝ።'),
        ],
        dialogue: [
          d('A', 'What day is it today?', 'ዛሬ ምን ቀን ነው?'),
          d('B', 'Today is Thursday.', 'ዛሬ ሐሙስ ነው።'),
          d('A', 'Great! Tomorrow is Friday.', 'ጥሩ! ነገ ዓርብ ነው።'),
        ],
        note: 'Days of the week always start with a capital letter in English: Monday, not monday.',
      },
    ],
  },

  'english-from-amharic-3': {
    title: 'English Camp 3 – Food & Shopping',
    intro: 'Order at a café, talk about food, and shop for what you need.',
    sections: [
      {
        title: 'Lesson 1 – At a Café',
        description: 'Order a drink politely and ask for the bill.',
        phrases: [
          p('A coffee, please.', 'አንድ ቡና፣ እባክህ።'),
          p('Tea with milk, please.', 'ሻይ በወተት፣ እባክህ።'),
          p('I’d like some water.', 'ውሃ እፈልጋለሁ።'),
          p('How much is it?', 'ስንት ነው?'),
          p('The bill, please.', 'ሂሳብ፣ እባክህ።'),
          p('It’s delicious!', 'በጣም ይጣፍጣል!'),
        ],
        dialogue: [
          d('A', 'Hello! What would you like?', 'ሰላም! ምን ልታዘዝ?'),
          d('B', 'A coffee, please.', 'አንድ ቡና፣ እባክህ።'),
          d('A', 'Anything else?', 'ሌላ ነገር?'),
          d('B', 'No, thank you. How much is it?', 'አይ፣ አመሰግናለሁ። ስንት ነው?'),
        ],
        note: '“I’d like” (I would like) is a polite way to order. It sounds softer than “I want”.',
      },
      {
        title: 'Lesson 2 – Meals',
        description: 'Talk about meals, hunger, and what you like to eat.',
        phrases: [
          p('breakfast, lunch, dinner', 'ቁርስ፣ ምሳ፣ እራት'),
          p('I’m hungry.', 'ርቦኛል።'),
          p('I’m thirsty.', 'ጠምቶኛል።'),
          p('I like injera.', 'እንጀራ እወዳለሁ።'),
          p('I don’t eat meat.', 'ሥጋ አልበላም።'),
          p('Let’s eat together.', 'አብረን እንብላ።'),
        ],
        dialogue: [
          d('A', 'I’m hungry. Let’s eat lunch.', 'ርቦኛል። ምሳ እንብላ።'),
          d('B', 'Good idea! Do you like injera?', 'ጥሩ ሀሳብ! እንጀራ ትወዳለህ?'),
          d('A', 'Yes, I love it.', 'አዎ፣ በጣም እወደዋለሁ።'),
        ],
        note: 'English says “I am hungry” with three words. Amharic says it in one: ርቦኛል።',
      },
      {
        title: 'Lesson 3 – Shopping',
        description: 'Ask prices, decide, and pay.',
        phrases: [
          p('How much is this?', 'ይህ ስንት ነው?'),
          p('It’s too expensive.', 'በጣም ውድ ነው።'),
          p('Do you have bread?', 'ዳቦ አለህ?'),
          p('I’ll take it.', 'እወስደዋለሁ።'),
          p('Can I pay by card?', 'በካርድ መክፈል እችላለሁ?'),
          p('Here is your change.', 'መልስህ ይኸው።'),
        ],
        dialogue: [
          d('A', 'How much is this shirt?', 'ይህ ሸሚዝ ስንት ነው?'),
          d('B', 'It’s twenty dollars.', 'ሃያ ዶላር ነው።'),
          d('A', 'OK, I’ll take it. Can I pay by card?', 'እሺ፣ እወስደዋለሁ። በካርድ መክፈል እችላለሁ?'),
          d('B', 'Yes, of course.', 'አዎ፣ በእርግጥ።'),
        ],
        note: '“This” is for one thing near you; “these” is for more than one: this shirt, these shoes.',
      },
      {
        title: 'Lesson 4 – Colors & Sizes',
        description: 'Describe what you want to buy.',
        phrases: [
          p('big, small', 'ትልቅ፣ ትንሽ'),
          p('red, blue, green', 'ቀይ፣ ሰማያዊ፣ አረንጓዴ'),
          p('black, white', 'ጥቁር፣ ነጭ'),
          p('Do you have a bigger size?', 'ትልቅ መጠን አለህ?'),
          p('It’s too small.', 'በጣም ትንሽ ነው።'),
          p('I like the blue one.', 'ሰማያዊውን ወድጄዋለሁ።'),
        ],
        dialogue: [
          d('A', 'Do you like this dress?', 'ይህን ቀሚስ ወደድሽው? (ለሴት)'),
          d('B', 'Yes, but it’s too small. Do you have a bigger size?', 'አዎ፣ ግን በጣም ትንሽ ነው። ትልቅ መጠን አለህ?'),
          d('A', 'Yes, here is a bigger one.', 'አዎ፣ ትልቁ ይኸው።'),
        ],
        note: 'In English the color comes before the thing: a blue dress. That’s the same order as Amharic: ሰማያዊ ቀሚስ.',
      },
    ],
  },

  'english-from-amharic-4': {
    title: 'English Camp 4 – Getting Around',
    intro: 'Ask for directions, take the bus or a taxi, and tell the time.',
    sections: [
      {
        title: 'Lesson 1 – Directions',
        description: 'Ask where things are and understand the answer.',
        phrases: [
          p('Where is the bus station?', 'የአውቶቡስ መናኸሪያው የት ነው?'),
          p('Turn left.', 'ወደ ግራ ታጠፍ።'),
          p('Turn right.', 'ወደ ቀኝ ታጠፍ።'),
          p('Go straight.', 'ቀጥ ብለህ ሂድ።'),
          p('It’s near here.', 'እዚህ አጠገብ ነው።'),
          p('It’s far from here.', 'ከዚህ ሩቅ ነው።'),
        ],
        dialogue: [
          d('A', 'Excuse me, where is the bank?', 'ይቅርታ፣ ባንኩ የት ነው?'),
          d('B', 'Go straight and turn left.', 'ቀጥ ብለህ ሂድና ወደ ግራ ታጠፍ።'),
          d('A', 'Is it far?', 'ሩቅ ነው?'),
          d('B', 'No, it’s near here.', 'አይ፣ እዚህ አጠገብ ነው።'),
        ],
        note: 'Directions start with the action: “Turn left”, “Go straight”. This is how English gives instructions.',
      },
      {
        title: 'Lesson 2 – Buses & Taxis',
        description: 'Buy a ticket, ask about times, and tell the driver where to stop.',
        phrases: [
          p('I take the bus to work.', 'ወደ ሥራ በአውቶቡስ እሄዳለሁ።'),
          p('Can you call a taxi for me?', 'ታክሲ ልትጠራልኝ ትችላለህ?'),
          p('One ticket, please.', 'አንድ ትኬት፣ እባክህ።'),
          p('What time does the bus leave?', 'አውቶቡሱ ስንት ሰዓት ይነሳል?'),
          p('Stop here, please.', 'እባክህ እዚህ አቁም።'),
          p('How long does it take?', 'ምን ያህል ጊዜ ይወስዳል?'),
        ],
        dialogue: [
          d('A', 'One ticket to Bahir Dar, please.', 'ወደ ባሕር ዳር አንድ ትኬት፣ እባክህ።'),
          d('B', 'Here you are.', 'ይኸውልህ።'),
          d('A', 'What time does the bus leave?', 'አውቶቡሱ ስንት ሰዓት ይነሳል?'),
          d('B', 'At seven in the morning.', 'ጠዋት አንድ ሰዓት።'),
        ],
        note: 'Questions about he, she, or it use “does”: “What time does the bus leave?” With I or you, use “do”: “Do you take the bus?”',
      },
      {
        title: 'Lesson 3 – Telling the Time',
        description: 'Ask the time, say it, and say if you’re late.',
        phrases: [
          p('What time is it?', 'ስንት ሰዓት ነው?'),
          p('It’s three o’clock.', 'ዘጠኝ ሰዓት ነው። (ከሰዓት በኋላ)'),
          p('It’s half past four.', 'አስር ሰዓት ተኩል ነው። (ከሰዓት በኋላ)'),
          p('in the morning, in the evening', 'ጠዋት፣ ምሽት'),
          p('I’m late.', 'አረፈድኩ።'),
          p('I’m on time.', 'በሰዓቱ ደርሻለሁ።'),
        ],
        dialogue: [
          d('A', 'What time is it?', 'ስንት ሰዓት ነው?'),
          d('B', 'It’s nine o’clock in the morning.', 'ጠዋት ሦስት ሰዓት ነው።'),
          d('A', 'Oh no, I’m late!', 'ወይኔ፣ አረፈድኩ!'),
        ],
        note: '“O’clock” is only for full hours: three o’clock. For 3:30, say “half past three”. Remember: add 6 hours to Ethiopian time.',
      },
      {
        title: 'Lesson 4 – Places in Town',
        description: 'Name the places you need and ask if they’re nearby.',
        phrases: [
          p('the hospital', 'ሆስፒታሉ'),
          p('the bank', 'ባንኩ'),
          p('the pharmacy', 'መድኃኒት ቤቱ'),
          p('the airport', 'አየር ማረፊያው'),
          p('I need to go to the bank.', 'ወደ ባንክ መሄድ አለብኝ።'),
          p('Is there a pharmacy near here?', 'እዚህ አካባቢ መድኃኒት ቤት አለ?'),
        ],
        dialogue: [
          d('A', 'Is there a pharmacy near here?', 'እዚህ አካባቢ መድኃኒት ቤት አለ?'),
          d('B', 'Yes, next to the hospital.', 'አዎ፣ ከሆስፒታሉ አጠገብ።'),
          d('A', 'Thank you!', 'አመሰግናለሁ!'),
        ],
        note: 'English puts “the” before a specific place: the bank. Amharic adds an ending instead: ባንኩ.',
      },
    ],
  },

  'english-from-amharic-5': {
    title: 'English Camp 5 – Health, Phone & Work',
    intro: 'The English you need for the doctor, phone calls, job interviews, and forms.',
    sections: [
      {
        title: 'Lesson 1 – At the Doctor',
        description: 'Say how you feel and understand simple instructions.',
        phrases: [
          p('I feel sick.', 'አሞኛል።'),
          p('I have a headache.', 'ራሴን ያመኛል።'),
          p('My stomach hurts.', 'ሆዴን ያመኛል።'),
          p('I need a doctor.', 'ሐኪም ያስፈልገኛል።'),
          p('I have an appointment at ten.', 'አራት ሰዓት ቀጠሮ አለኝ።'),
          p('Take this medicine twice a day.', 'ይህን መድኃኒት በቀን ሁለት ጊዜ ውሰድ።'),
        ],
        dialogue: [
          d('A', 'What’s wrong?', 'ምን ሆንክ?'),
          d('B', 'I feel sick. I have a headache.', 'አሞኛል። ራሴን ያመኛል።'),
          d('A', 'Take this medicine twice a day.', 'ይህን መድኃኒት በቀን ሁለት ጊዜ ውሰድ።'),
          d('B', 'Thank you, doctor.', 'አመሰግናለሁ፣ ዶክተር።'),
        ],
        note: 'Use “I have a …” for many health problems: I have a headache, I have a cold, I have a fever.',
      },
      {
        title: 'Lesson 2 – On the Phone',
        description: 'Start a call, ask for someone, and leave a message.',
        phrases: [
          p('Hello, this is Hana.', 'ሄሎ፣ ሃና ነኝ።'),
          p('Can I speak to Dawit?', 'ዳዊትን ማነጋገር እችላለሁ?'),
          p('Please call me back.', 'እባክህ መልሰህ ደውልልኝ።'),
          p('I’ll call you later.', 'በኋላ እደውልልሃለሁ።'),
          p('Can you hear me?', 'ይሰማሃል?'),
          p('Sorry, wrong number.', 'ይቅርታ፣ የተሳሳተ ቁጥር ነው።'),
        ],
        dialogue: [
          d('A', 'Hello, this is Hana. Can I speak to Dawit?', 'ሄሎ፣ ሃና ነኝ። ዳዊትን ማነጋገር እችላለሁ?'),
          d('B', 'Sorry, he isn’t here.', 'ይቅርታ፣ እሱ እዚህ የለም።'),
          d('A', 'OK. Please ask him to call me back.', 'እሺ። መልሶ እንዲደውልልኝ ንገረው።'),
        ],
        note: 'On the phone, English speakers say “This is Hana”, not “I am Hana”.',
      },
      {
        title: 'Lesson 3 – A Job Interview',
        description: 'Talk about your experience and when you can start.',
        phrases: [
          p('Tell me about yourself.', 'ስለ ራስህ ንገረኝ።'),
          p('I have three years of experience.', 'የሦስት ዓመት ልምድ አለኝ።'),
          p('I can start on Monday.', 'ሰኞ መጀመር እችላለሁ።'),
          p('What are the working hours?', 'የሥራ ሰዓቱ ከስንት እስከ ስንት ነው?'),
          p('I work well in a team.', 'ከቡድን ጋር በደንብ እሠራለሁ።'),
          p('Thank you for your time.', 'ጊዜህን ስለሰጠኸኝ አመሰግናለሁ።'),
        ],
        dialogue: [
          d('A', 'Tell me about yourself.', 'ስለ ራስህ ንገረኝ።'),
          d('B', 'I am a nurse. I have three years of experience.', 'ነርስ ነኝ። የሦስት ዓመት ልምድ አለኝ።'),
          d('A', 'When can you start?', 'መቼ መጀመር ትችላለህ?'),
          d('B', 'I can start on Monday.', 'ሰኞ መጀመር እችላለሁ።'),
        ],
        note: '“Can” shows you are able to do something. The verb after it never changes: I can start, she can start (not “she can starts”).',
      },
      {
        title: 'Lesson 4 – Filling Out Forms',
        description: 'Understand the words on applications and official forms.',
        phrases: [
          p('first name', 'የመጀመሪያ ስም'),
          p('last name', 'የአባት ስም'),
          p('date of birth', 'የትውልድ ቀን'),
          p('address', 'አድራሻ'),
          p('signature', 'ፊርማ'),
          p('Please fill out this form.', 'እባክህ ይህን ቅጽ ሙላ።'),
        ],
        dialogue: [
          d('A', 'Please fill out this form.', 'እባክህ ይህን ቅጽ ሙላ።'),
          d('B', 'What do I write for “last name”?', '“Last name” ላይ ምን ልጻፍ?'),
          d('A', 'Write your father’s name.', 'የአባትህን ስም ጻፍ።'),
        ],
        note: 'Ethiopian names don’t have a family surname. On English forms, most Ethiopians write their father’s name as their “last name”.',
      },
    ],
  },

  'english-from-amharic-6': {
    title: 'English Camp 6 – The Summit: Real Conversations',
    intro: 'For confident speakers: share opinions, make small talk, talk about past and future, and use everyday expressions.',
    sections: [
      {
        title: 'Lesson 1 – Sharing Opinions',
        description: 'Say what you think, agree, and disagree politely.',
        phrases: [
          p('I think it’s a good idea.', 'ጥሩ ሀሳብ ይመስለኛል።'),
          p('In my opinion, …', 'በእኔ አስተያየት፣ …'),
          p('I agree.', 'እስማማለሁ።'),
          p('I don’t agree.', 'አልስማማም።'),
          p('I’m not sure.', 'እርግጠኛ አይደለሁም።'),
          p('What do you think?', 'አንተ ምን ይመስልሃል?'),
        ],
        dialogue: [
          d('A', 'Let’s visit Lalibela next year.', 'በሚቀጥለው ዓመት ላሊበላን እንጎብኝ።'),
          d('B', 'I think it’s a good idea. What do you think?', 'ጥሩ ሀሳብ ይመስለኛል። አንተ ምን ይመስልሃል?'),
          d('A', 'I agree!', 'እስማማለሁ!'),
        ],
        note: 'Start with “I think…” to share an opinion. It sounds friendlier than stating it as a fact.',
      },
      {
        title: 'Lesson 2 – Small Talk & Feelings',
        description: 'Chat about the weekend, the weather, and how you feel.',
        phrases: [
          p('How was your weekend?', 'የሳምንቱ መጨረሻ እንዴት ነበር?'),
          p('It was great.', 'በጣም ጥሩ ነበር።'),
          p('I’m tired.', 'ደክሞኛል።'),
          p('I’m so happy for you!', 'ስለ አንተ በጣም ደስ ብሎኛል!'),
          p('The weather is nice today.', 'ዛሬ አየሩ ጥሩ ነው።'),
          p('What are you doing this weekend?', 'በዚህ የሳምንቱ መጨረሻ ምን ታደርጋለህ?'),
        ],
        dialogue: [
          d('A', 'How was your weekend?', 'የሳምንቱ መጨረሻ እንዴት ነበር?'),
          d('B', 'It was great! I visited my family.', 'በጣም ጥሩ ነበር! ቤተሰቤን ጎበኘሁ።'),
          d('A', 'That’s nice.', 'ደስ ይላል።'),
        ],
        note: 'Small talk about the weekend or the weather is very common in English: at work, in shops, and with neighbors.',
      },
      {
        title: 'Lesson 3 – Past & Future',
        description: 'Talk about what you did and what you will do.',
        phrases: [
          p('Yesterday I went to church.', 'ትናንት ቤተ ክርስቲያን ሄድኩ።'),
          p('I visited my grandmother last week.', 'ባለፈው ሳምንት አያቴን ጎበኘሁ።'),
          p('I will visit Ethiopia next year.', 'በሚቀጥለው ዓመት ኢትዮጵያን እጎበኛለሁ።'),
          p('I’m going to cook dinner tonight.', 'ዛሬ ማታ እራት አበስላለሁ።'),
          p('I have lived here for five years.', 'እዚህ ለአምስት ዓመት ኖሬያለሁ።'),
          p('When did you arrive?', 'መቼ ደረስክ?'),
        ],
        dialogue: [
          d('A', 'When did you arrive in America?', 'አሜሪካ መቼ ደረስክ?'),
          d('B', 'I arrived five years ago.', 'ከአምስት ዓመት በፊት ደረስኩ።'),
          d('A', 'Will you visit Ethiopia?', 'ኢትዮጵያን ትጎበኛለህ?'),
          d('B', 'Yes, I will visit next year.', 'አዎ፣ በሚቀጥለው ዓመት እጎበኛለሁ።'),
        ],
        note: 'Many past verbs end in -ed (visit → visited), but common ones are irregular: go → went, eat → ate, come → came.',
      },
      {
        title: 'Lesson 4 – Everyday Expressions',
        description: 'Common phrases whose meaning isn’t in the words.',
        phrases: [
          p('It’s a piece of cake.', 'በጣም ቀላል ነው።'),
          p('Long time no see!', 'ከተገናኘን ቆየን!'),
          p('I’m on my way.', 'እየመጣሁ ነው።'),
          p('Take it easy.', 'ቀስ በል፣ አትጨነቅ።'),
          p('Never mind.', 'ተወው፣ ችግር የለም።'),
          p('It’s up to you.', 'ምርጫው የአንተ ነው።'),
        ],
        dialogue: [
          d('A', 'Long time no see! How are you?', 'ከተገናኘን ቆየን! እንዴት ነህ?'),
          d('B', 'I’m great! Where should we eat?', 'ደህና ነኝ! የት እንብላ?'),
          d('A', 'It’s up to you.', 'ምርጫው የአንተ ነው።'),
        ],
        note: 'These expressions don’t mean what the words say. “A piece of cake” means “very easy”, like saying ቀላል ነው.',
      },
      {
        title: 'Lesson 5 – Celebrations & Kind Words',
        description: 'Congratulate, celebrate, and comfort people in English.',
        phrases: [
          p('Congratulations!', 'እንኳን ደስ አለህ!'),
          p('Happy birthday!', 'መልካም ልደት!'),
          p('Happy New Year!', 'መልካም አዲስ ዓመት!'),
          p('Thank you for inviting me.', 'ስለጋበዝከኝ አመሰግናለሁ።'),
          p('Get well soon.', 'እግዚአብሔር ይማርህ።'),
          p('I’m sorry for your loss.', 'ነፍስ ይማር።'),
        ],
        dialogue: [
          d('A', 'Happy birthday!', 'መልካም ልደት!'),
          d('B', 'Thank you! Thank you for coming.', 'አመሰግናለሁ! ስለመጣህ አመሰግናለሁ።'),
          d('A', 'Congratulations on your new job, too!', 'ለአዲሱ ሥራህም እንኳን ደስ አለህ!'),
        ],
        note: 'Ethiopian New Year (እንቁጣጣሽ) is in September. In English-speaking countries, “Happy New Year” is said on January 1.',
      },
    ],
  },
};

const AUDIENCE = 'Amharic speakers learning English';

export const englishCatalog: CourseSummary[] = [
  { slug: 'english-from-amharic-1', description: 'Greetings, introductions, polite words, and goodbyes.' },
  { slug: 'english-from-amharic-2', description: 'Family, work, your daily routine, numbers, and days.' },
  { slug: 'english-from-amharic-3', description: 'Cafés, meals, shopping, colors, and sizes.' },
  { slug: 'english-from-amharic-4', description: 'Directions, buses and taxis, time, and places in town.' },
  { slug: 'english-from-amharic-5', description: 'The doctor, phone calls, job interviews, and forms.' },
  { slug: 'english-from-amharic-6', description: 'Opinions, small talk, past and future, and expressions.' },
].map((course, i) => ({
  ...course,
  title: englishCourses[course.slug].title,
  audience: AUDIENCE,
  track: 'english',
  part: i + 1,
}));
