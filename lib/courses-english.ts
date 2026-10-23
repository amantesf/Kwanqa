import type { Course, CourseSummary } from '@/lib/courses';

// The English course, for Amharic speakers. Most already know the basics
// ("Hello, how are you?") from school and the phone, so this starts at a
// medium level: real situations at work, school, the doctor, the bank and on
// the phone, with polite requests, past and future, and longer answers.
// English is what's being learned, so it's shown big with the Amharic meaning
// underneath, and practice quizzes the English. Each camp builds on the last.
// Amharic uses the masculine "you" (አንተ) unless a line says otherwise.

type Line = { amharic: string; transliteration: string; english: string };

/** A phrase: English first, then its Amharic meaning. */
const p = (english: string, amharic: string): Line => ({ english, amharic, transliteration: '' });

/** A dialogue line. */
const d = (speaker: 'A' | 'B', english: string, amharic: string) => ({ speaker, ...p(english, amharic) });

export const englishCourses: Record<string, Course> = {
  'english-from-amharic-1': {
    title: 'English Camp 1 – Everyday Conversations',
    intro: 'Go beyond hello: talk about yourself, your routine and your plans, and keep a conversation going.',
    sections: [
      {
        title: 'Lesson 1 – Getting to Know Someone',
        description: 'Say more than your name: what you do, how long you’ve been here, and what you like.',
        phrases: [
          p('What do you do for a living?', 'ሥራህ ምንድን ነው?'),
          p('I work as a nurse at a hospital.', 'ሆስፒታል ውስጥ ነርስ ሆኜ እሠራለሁ።'),
          p('How long have you lived here?', 'እዚህ ለምን ያህል ጊዜ ኖርክ?'),
          p('I moved here two years ago.', 'ከሁለት ዓመት በፊት ነው ወደዚህ የመጣሁት።'),
          p('What do you like to do in your free time?', 'በትርፍ ጊዜህ ምን ማድረግ ትወዳለህ?'),
          p('I enjoy playing football with my friends.', 'ከጓደኞቼ ጋር እግር ኳስ መጫወት ያስደስተኛል።'),
        ],
        dialogue: [
          d('A', 'So, what do you do for a living?', 'እና፣ ሥራህ ምንድን ነው?'),
          d('B', 'I’m a student. I study computer science.', 'ተማሪ ነኝ። ኮምፒውተር ሳይንስ እማራለሁ።'),
          d('A', 'Really? How long have you lived here?', 'እውነት? እዚህ ለምን ያህል ጊዜ ኖርክ?'),
          d('B', 'About two years. I moved here for university.', 'ሁለት ዓመት ያህል። ለዩኒቨርሲቲ ብዬ ነው የመጣሁት።'),
        ],
        note: 'To keep a conversation going, answer and then ask back: “I’m a student. And you, what do you do?” A one-word answer can sound unfriendly in English.',
      },
      {
        title: 'Lesson 2 – Your Daily Routine',
        description: 'Describe a normal day and say how often you do things.',
        phrases: [
          p('I usually wake up at six.', 'ብዙውን ጊዜ በአሥራ ሁለት ሰዓት እነሳለሁ።'),
          p('I take the bus to work every morning.', 'በየጠዋቱ ወደ ሥራ በአውቶቡስ እሄዳለሁ።'),
          p('I always have coffee before work.', 'ሁልጊዜ ከሥራ በፊት ቡና እጠጣለሁ።'),
          p('I sometimes cook dinner for my family.', 'አንዳንድ ጊዜ ለቤተሰቤ እራት አበስላለሁ።'),
          p('I rarely go to bed before midnight.', 'ከእኩለ ሌሊት በፊት የምተኛው አልፎ አልፎ ነው።'),
          p('On weekends, I visit my relatives.', 'ቅዳሜና እሁድ ዘመዶቼን እጠይቃለሁ።'),
        ],
        dialogue: [
          d('A', 'What does a normal day look like for you?', 'የተለመደው ቀንህ ምን ይመስላል?'),
          d('B', 'I wake up early and take the bus to work.', 'ማልጄ እነሳና በአውቶቡስ ወደ ሥራ እሄዳለሁ።'),
          d('A', 'Do you cook in the evening?', 'ማታ ምግብ ታበስላለህ?'),
          d('B', 'Sometimes. But on weekends I always cook.', 'አንዳንድ ጊዜ። ቅዳሜና እሁድ ግን ሁልጊዜ አበስላለሁ።'),
        ],
        note: 'English time starts at midnight, so 6 a.m. is “six”, while Ethiopian time calls it 12 (ሥራ ሁለት ሰዓት). Words like always, usually, sometimes and rarely go before the verb: “I always have coffee.”',
      },
      {
        title: 'Lesson 3 – Making Plans',
        description: 'Invite someone, accept or say no politely, and agree on a time.',
        phrases: [
          p('Are you free on Saturday?', 'ቅዳሜ ነፃ ነህ?'),
          p('Would you like to have lunch together?', 'አብረን ምሳ ብንበላ ትፈልጋለህ?'),
          p('That sounds great!', 'በጣም ጥሩ ሐሳብ ነው!'),
          p('Sorry, I can’t. I have to work.', 'ይቅርታ፣ አልችልም። መሥራት አለብኝ።'),
          p('How about next week instead?', 'በምትኩ በሚቀጥለው ሳምንትስ?'),
          p('Let’s meet at the café at one.', 'በሰባት ሰዓት ካፌው ጋ እንገናኝ።'),
        ],
        dialogue: [
          d('A', 'Are you free on Saturday? Would you like to have lunch?', 'ቅዳሜ ነፃ ነህ? ምሳ አብረን ብንበላ?'),
          d('B', 'Sorry, I can’t. I have to work. How about Sunday?', 'ይቅርታ፣ አልችልም። መሥራት አለብኝ። እሁድስ?'),
          d('A', 'Sunday works for me. Let’s meet at one.', 'እሁድ ይመቸኛል። በሰባት ሰዓት እንገናኝ።'),
          d('B', 'That sounds great. See you then!', 'በጣም ጥሩ። እንገናኝ!'),
        ],
        note: 'In English it’s polite to give a short reason when you say no: “Sorry, I can’t. I have to work.” Then offer another time.',
      },
      {
        title: 'Lesson 4 – Asking Politely',
        description: 'Ask for things and favors the polite way: could you, would you mind, I was wondering.',
        phrases: [
          p('Could you help me with this?', 'በዚህ ልትረዳኝ ትችላለህ?'),
          p('Would you mind opening the window?', 'መስኮቱን ብትከፍተው ቅር ይልሃል?'),
          p('Do you know where the station is?', 'ጣቢያው የት እንዳለ ታውቃለህ?'),
          p('I was wondering if you could call me later.', 'በኋላ ልትደውልልኝ ትችል እንደሆነ እያሰብኩ ነበር።'),
          p('Sorry to bother you.', 'ስላስቸገርኩህ ይቅርታ።'),
          p('Thanks, I really appreciate it.', 'አመሰግናለሁ፣ በጣም ደስ ብሎኛል።'),
        ],
        dialogue: [
          d('A', 'Sorry to bother you. Could you help me with this form?', 'ስላስቸገርኩህ ይቅርታ። በዚህ ቅጽ ልትረዳኝ ትችላለህ?'),
          d('B', 'Of course. What do you need?', 'በእርግጥ። ምን ትፈልጋለህ?'),
          d('A', 'I don’t know what to write here.', 'እዚህ ምን እንደምጽፍ አላውቅም።'),
          d('B', 'Just write your address. That’s all.', 'አድራሻህን ብቻ ጻፍ። ያ ነው።'),
          d('A', 'Thanks, I really appreciate it.', 'አመሰግናለሁ፣ በጣም ደስ ብሎኛል።'),
        ],
        note: '“Can you…?” is fine with friends. With strangers, at work or in shops, “Could you…?” or “Would you mind…?” sounds more polite. Careful: “Would you mind…?” means “Is it a problem?”, so “No, not at all” means yes, I’ll help.',
      },
    ],
  },

  'english-from-amharic-2': {
    title: 'English Camp 2 – Work & School',
    intro: 'Talk about your job and studies, write simple messages, and ask for help without fear.',
    sections: [
      {
        title: 'Lesson 1 – At Work',
        description: 'Talk about your tasks, your schedule and your coworkers.',
        phrases: [
          p('I’m responsible for customer service.', 'የደንበኞች አገልግሎት ኃላፊ ነኝ።'),
          p('I work from nine to five.', 'ከሦስት እስከ አሥራ አንድ ሰዓት እሠራለሁ።'),
          p('We have a meeting this afternoon.', 'ዛሬ ከሰዓት በኋላ ስብሰባ አለን።'),
          p('My manager asked me to finish the report.', 'አለቃዬ ሪፖርቱን እንድጨርስ ጠይቆኛል።'),
          p('I’ll get it done by Friday.', 'እስከ ዓርብ እጨርሰዋለሁ።'),
          p('Can I take a day off next week?', 'በሚቀጥለው ሳምንት አንድ ቀን ዕረፍት መውሰድ እችላለሁ?'),
        ],
        dialogue: [
          d('A', 'Did you finish the report?', 'ሪፖርቱን ጨረስክ?'),
          d('B', 'Not yet, but I’ll get it done by Friday.', 'ገና ነው፣ ግን እስከ ዓርብ እጨርሰዋለሁ።'),
          d('A', 'Good. Don’t forget the meeting this afternoon.', 'ጥሩ። የዛሬ ከሰዓቱን ስብሰባ እንዳትረሳ።'),
          d('B', 'Thanks for the reminder. I’ll be there.', 'ስላስታወስከኝ አመሰግናለሁ። እመጣለሁ።'),
        ],
        note: '“Nine to five” is 9 a.m. to 5 p.m., a normal office day in English-speaking countries. “I’ll” (I will) is how you promise something: “I’ll get it done.”',
      },
      {
        title: 'Lesson 2 – Emails & Messages',
        description: 'Write short, clear messages to a teacher, a boss or an office.',
        phrases: [
          p('Dear Mr. Smith,', 'ውድ አቶ ስሚዝ፣'),
          p('I’m writing to ask about the job.', 'የምጽፈው ስለ ሥራው ለመጠየቅ ነው።'),
          p('Please find my CV attached.', 'የሥራ ልምድ ማስረጃዬን አያይዤ ልኬያለሁ።'),
          p('I look forward to hearing from you.', 'ምላሽዎን በጉጉት እጠብቃለሁ።'),
          p('Sorry for the late reply.', 'ዘግይቼ ስለመለስኩ ይቅርታ።'),
          p('Best regards,', 'ከሰላምታ ጋር፣'),
        ],
        dialogue: [
          d('A', 'How should I start an email to my teacher?', 'ለመምህሬ ኢሜይል እንዴት ልጀምር?'),
          d('B', 'Start with “Dear” and her name.', 'በ“Dear” እና በስሟ ጀምር።'),
          d('A', 'And how do I finish it?', 'እንዴትስ ልጨርሰው?'),
          d('B', 'Write “Best regards” and then your name.', '“Best regards” ብለህ ስምህን ጻፍ።'),
        ],
        note: 'Work emails in English are short and polite: a greeting, one or two sentences that say why you’re writing, a thank-you, and your name. Use Mr. for men and Ms. for women, with their family name.',
      },
      {
        title: 'Lesson 3 – At School',
        description: 'Talk with teachers and classmates about classes, homework and exams.',
        phrases: [
          p('When is the homework due?', 'የቤት ሥራው እስከ መቼ ነው?'),
          p('I missed the class yesterday.', 'ትናንት ክፍለ ጊዜውን አመለጠኝ።'),
          p('Could you explain that again?', 'ያንን እንደገና ልታብራራልኝ ትችላለህ?'),
          p('I need more time for the assignment.', 'ለምድብ ሥራው ተጨማሪ ጊዜ ያስፈልገኛል።'),
          p('Let’s study together for the exam.', 'ለፈተናው አብረን እናጥና።'),
          p('I passed the test!', 'ፈተናውን አለፍኩ!'),
        ],
        dialogue: [
          d('A', 'Excuse me, I missed the class yesterday.', 'ይቅርታ፣ ትናንት ክፍለ ጊዜውን አመለጠኝ።'),
          d('B', 'That’s okay. We talked about chapter three.', 'ችግር የለም። ስለ ምዕራፍ ሦስት ተነጋገርን።'),
          d('A', 'When is the homework due?', 'የቤት ሥራው እስከ መቼ ነው?'),
          d('B', 'Next Monday. Ask me if you have questions.', 'እስከሚቀጥለው ሰኞ። ጥያቄ ካለህ ጠይቀኝ።'),
        ],
        note: 'Teachers in many English-speaking schools expect students to ask questions in class. Saying “Could you explain that again?” is a sign of a good student, not a weak one.',
      },
      {
        title: 'Lesson 4 – Talking About Your Experience',
        description: 'Say what you have done and how long you’ve done it, with the present perfect.',
        phrases: [
          p('I have worked in sales for five years.', 'ለአምስት ዓመት በሽያጭ ሥራ ሠርቻለሁ።'),
          p('I’ve never been to London.', 'ለንደን ሄጄ አላውቅም።'),
          p('Have you ever used this program?', 'ይህን ፕሮግራም ተጠቅመህ ታውቃለህ?'),
          p('I’ve just finished my degree.', 'ዲግሪዬን አሁን ጨረስኩ።'),
          p('I have learned a lot from this job.', 'ከዚህ ሥራ ብዙ ተምሬያለሁ።'),
          p('I’ve been studying English since last year.', 'ካለፈው ዓመት ጀምሮ እንግሊዝኛ እየተማርኩ ነው።'),
        ],
        dialogue: [
          d('A', 'Have you ever worked in a hotel?', 'ሆቴል ውስጥ ሠርተህ ታውቃለህ?'),
          d('B', 'Yes, I have. I worked at a hotel in Addis for three years.', 'አዎ። አዲስ አበባ ሆቴል ውስጥ ለሦስት ዓመት ሠርቻለሁ።'),
          d('A', 'Great. Have you used a booking system before?', 'በጣም ጥሩ። ከዚህ በፊት የቦታ ማስያዣ ሥርዓት ተጠቅመሃል?'),
          d('B', 'Yes, I’ve used one every day.', 'አዎ፣ በየቀኑ ተጠቅሜያለሁ።'),
        ],
        note: 'Use “have + done” for experience with no exact time: “I have worked in sales.” Once you say when, use the simple past: “I worked in sales in 2020.”',
      },
    ],
  },

  'english-from-amharic-3': {
    title: 'English Camp 3 – Food, Shopping & Money',
    intro: 'Order at a restaurant, fix problems, return things, and handle money at the bank.',
    sections: [
      {
        title: 'Lesson 1 – At a Restaurant',
        description: 'Book a table, order, ask about dishes, and pay the bill.',
        phrases: [
          p('A table for two, please.', 'ለሁለት ሰው ጠረጴዛ፣ እባክህ።'),
          p('Could we see the menu?', 'ምናሌውን ማየት እንችላለን?'),
          p('What do you recommend?', 'ምን ትመክረኛለህ?'),
          p('I’ll have the chicken with rice.', 'ዶሮ በሩዝ እወስዳለሁ።'),
          p('Is this dish spicy?', 'ይህ ምግብ ያቃጥላል?'),
          p('Could we have the bill, please?', 'ሂሳቡን ልታመጣልን ትችላለህ?'),
        ],
        dialogue: [
          d('A', 'Good evening. Are you ready to order?', 'እንደምን አመሸህ። ለማዘዝ ዝግጁ ነህ?'),
          d('B', 'Yes. What do you recommend?', 'አዎ። ምን ትመክረኛለህ?'),
          d('A', 'The chicken is very popular today.', 'ዶሮው ዛሬ በጣም ተፈላጊ ነው።'),
          d('B', 'Then I’ll have the chicken, and a coffee, please.', 'እንግዲያው ዶሮውን፣ እና አንድ ቡና፣ እባክህ።'),
        ],
        note: 'In many countries you leave a tip for the waiter, often 10 to 20 percent of the bill. Ask “Is service included?” if you’re not sure.',
      },
      {
        title: 'Lesson 2 – When Something Is Wrong',
        description: 'Complain politely when your order or a product isn’t right.',
        phrases: [
          p('Excuse me, I didn’t order this.', 'ይቅርታ፣ ይህን አላዘዝኩም።'),
          p('My food is cold.', 'ምግቤ ቀዝቅዟል።'),
          p('There seems to be a mistake on the bill.', 'ሂሳቡ ላይ ስህተት ያለ ይመስላል።'),
          p('Could you check it, please?', 'እባክህ ልታረጋግጠው ትችላለህ?'),
          p('This doesn’t work.', 'ይሄ አይሠራም።'),
          p('I’d like to speak to the manager.', 'ከሥራ አስኪያጁ ጋር መነጋገር እፈልጋለሁ።'),
        ],
        dialogue: [
          d('A', 'Excuse me, there seems to be a mistake on the bill.', 'ይቅርታ፣ ሂሳቡ ላይ ስህተት ያለ ይመስላል።'),
          d('B', 'Oh, I’m sorry. Let me check.', 'ኦ፣ ይቅርታ። ላረጋግጥ።'),
          d('A', 'We only had two coffees, not three.', 'የጠጣነው ሁለት ቡና ብቻ ነው፣ ሦስት አይደለም።'),
          d('B', 'You’re right. I’ll fix it right away.', 'ልክ ነህ። አሁኑኑ አስተካክለዋለሁ።'),
        ],
        note: 'Start a complaint with “Excuse me” and use “seems to be”: it sounds calm and polite, and people are happier to help.',
      },
      {
        title: 'Lesson 3 – Shopping & Returns',
        description: 'Ask for sizes and prices, try things on, and return what doesn’t fit.',
        phrases: [
          p('Do you have this in a bigger size?', 'ከዚህ የሚበልጥ መጠን አላችሁ?'),
          p('Can I try it on?', 'ልለካው እችላለሁ?'),
          p('How much does this cost?', 'ይሄ ስንት ያወጣል?'),
          p('Is it on sale?', 'ቅናሽ ላይ ነው?'),
          p('I’d like to return this. It’s too small.', 'ይሄን መመለስ እፈልጋለሁ። በጣም ያንሰኛል።'),
          p('Here is the receipt.', 'ደረሰኙ ይኸው።'),
        ],
        dialogue: [
          d('A', 'Hi, I’d like to return this shirt. It’s too small.', 'ሰላም፣ ይሄን ሸሚዝ መመለስ እፈልጋለሁ። ያንሰኛል።'),
          d('B', 'Do you have the receipt?', 'ደረሰኙ አለህ?'),
          d('A', 'Yes, here it is.', 'አዎ፣ ይኸው።'),
          d('B', 'Would you like a bigger size or your money back?', 'የሚበልጥ መጠን ትፈልጋለህ ወይስ ገንዘብህን?'),
        ],
        note: 'In many shops abroad you can return things within 14 or 30 days if you keep the receipt. Prices are usually fixed, so bargaining is rare except at markets.',
      },
      {
        title: 'Lesson 4 – At the Bank',
        description: 'Open an account, send money, and ask about fees.',
        phrases: [
          p('I’d like to open a bank account.', 'የባንክ ሂሳብ መክፈት እፈልጋለሁ።'),
          p('What documents do I need?', 'ምን ዓይነት ሰነዶች ያስፈልጉኛል?'),
          p('I want to send money to my family.', 'ለቤተሰቤ ገንዘብ መላክ እፈልጋለሁ።'),
          p('Is there a fee for this?', 'ለዚህ ክፍያ አለው?'),
          p('My card isn’t working.', 'ካርዴ እየሠራ አይደለም።'),
          p('Could you write that down for me?', 'ያንን ጽፈህ ልትሰጠኝ ትችላለህ?'),
        ],
        dialogue: [
          d('A', 'Good morning. I’d like to send money to Ethiopia.', 'እንደምን አደርክ። ወደ ኢትዮጵያ ገንዘብ መላክ እፈልጋለሁ።'),
          d('B', 'Sure. How much would you like to send?', 'እሺ። ምን ያህል መላክ ትፈልጋለህ?'),
          d('A', 'Two hundred dollars. Is there a fee?', 'ሁለት መቶ ዶላር። ክፍያ አለው?'),
          d('B', 'Yes, the fee is five dollars.', 'አዎ፣ ክፍያው አምስት ዶላር ነው።'),
        ],
        note: 'When a number matters, ask “Could you write that down?” It’s normal at banks and offices, and it avoids mistakes with fifteen and fifty.',
      },
    ],
  },

  'english-from-amharic-4': {
    title: 'English Camp 4 – Travel & Getting Around',
    intro: 'Find your way, take public transport, check in at the airport, and book a place to stay.',
    sections: [
      {
        title: 'Lesson 1 – Directions & Transport',
        description: 'Ask the way, understand directions, and take buses and taxis.',
        phrases: [
          p('Excuse me, how do I get to the train station?', 'ይቅርታ፣ ወደ ባቡር ጣቢያው እንዴት ልሂድ?'),
          p('Go straight and turn left at the lights.', 'ቀጥ ብለህ ሂድና መብራቱ ጋ ወደ ግራ ታጠፍ።'),
          p('It’s across from the bank.', 'ከባንኩ ትይዩ ነው።'),
          p('Which bus goes to the city center?', 'ወደ መሃል ከተማ የሚሄደው የትኛው አውቶቡስ ነው?'),
          p('How long does it take by taxi?', 'በታክሲ ምን ያህል ጊዜ ይወስዳል?'),
          p('Could you tell me when to get off?', 'መቼ መውረድ እንዳለብኝ ልትነግረኝ ትችላለህ?'),
        ],
        dialogue: [
          d('A', 'Excuse me, which bus goes to the city center?', 'ይቅርታ፣ ወደ መሃል ከተማ የሚሄደው የትኛው አውቶቡስ ነው?'),
          d('B', 'Number twelve. It stops right here.', 'ቁጥር አሥራ ሁለት። እዚሁ ይቆማል።'),
          d('A', 'How long does it take?', 'ምን ያህል ጊዜ ይወስዳል?'),
          d('B', 'About twenty minutes, if there’s no traffic.', 'መንገድ ካልተጨናነቀ ሃያ ደቂቃ ያህል።'),
        ],
        note: 'Directions in English use “at” for points (at the lights, at the corner) and “on” for streets (on Main Street). “Across from” means on the other side of the street.',
      },
      {
        title: 'Lesson 2 – At the Airport',
        description: 'Check in, go through security, and find your gate.',
        phrases: [
          p('I’d like to check in for my flight.', 'ለበረራዬ መመዝገብ እፈልጋለሁ።'),
          p('Here is my passport and ticket.', 'ፓስፖርቴና ትኬቴ ይኸው።'),
          p('Can I take this bag on the plane?', 'ይሄን ቦርሳ ይዤ መግባት እችላለሁ?'),
          p('Where is gate fourteen?', 'በር አሥራ አራት የት ነው?'),
          p('My flight has been delayed.', 'በረራዬ ዘግይቷል።'),
          p('I’m here to visit my family.', 'የመጣሁት ቤተሰቤን ለመጠየቅ ነው።'),
        ],
        dialogue: [
          d('A', 'What is the purpose of your visit?', 'የጉብኝትህ ዓላማ ምንድን ነው?'),
          d('B', 'I’m here to visit my family.', 'የመጣሁት ቤተሰቤን ለመጠየቅ ነው።'),
          d('A', 'How long will you stay?', 'ለምን ያህል ጊዜ ትቆያለህ?'),
          d('B', 'Three weeks. I have a return ticket.', 'ሦስት ሳምንት። የመመለሻ ትኬት አለኝ።'),
        ],
        note: 'At passport control, answer short and clear: why you came, how long you’ll stay, and where you’ll stay. Have the address ready on your phone.',
      },
      {
        title: 'Lesson 3 – Booking a Place to Stay',
        description: 'Book a hotel room, ask what’s included, and report a problem.',
        phrases: [
          p('I have a reservation under the name Hana.', 'በሃና ስም ቦታ ተይዟል።'),
          p('Is breakfast included?', 'ቁርስ ይጨምራል?'),
          p('What time is check-out?', 'የመውጫ ሰዓቱ ስንት ነው?'),
          p('The air conditioning isn’t working.', 'ማቀዝቀዣው እየሠራ አይደለም።'),
          p('Could I have another towel?', 'ሌላ ፎጣ ማግኘት እችላለሁ?'),
          p('What’s the Wi-Fi password?', 'የዋይፋይ የይለፍ ቃሉ ምንድን ነው?'),
        ],
        dialogue: [
          d('A', 'Hi, I have a reservation under the name Hana.', 'ሰላም፣ በሃና ስም ቦታ ተይዟል።'),
          d('B', 'Welcome. You’re in room 305.', 'እንኳን ደህና መጣሽ። ክፍል 305 ነሽ።'),
          d('A', 'Thank you. Is breakfast included?', 'አመሰግናለሁ። ቁርስ ይጨምራል?'),
          d('B', 'Yes, from seven to ten in the restaurant.', 'አዎ፣ ከጠዋቱ አንድ እስከ አራት ሰዓት ምግብ ቤቱ ውስጥ።'),
        ],
        note: '“Under the name” is how you say whose name a booking is in. English says room numbers digit by digit: 305 is “three-oh-five”.',
      },
      {
        title: 'Lesson 4 – Asking for Help',
        description: 'Get help when you’re lost, lose something, or something goes wrong.',
        phrases: [
          p('I think I’m lost.', 'የጠፋሁ ይመስለኛል።'),
          p('I lost my phone.', 'ስልኬ ጠፋብኝ።'),
          p('Can you call the police, please?', 'እባክህ ፖሊስ ልትጠራ ትችላለህ?'),
          p('Is there a pharmacy near here?', 'እዚህ አቅራቢያ ፋርማሲ አለ?'),
          p('I need to charge my phone.', 'ስልኬን ቻርጅ ማድረግ አለብኝ።'),
          p('Can I use your phone for a minute?', 'ስልክህን ለአንድ ደቂቃ ልጠቀም?'),
        ],
        dialogue: [
          d('A', 'Excuse me, I think I’m lost. Where is Park Street?', 'ይቅርታ፣ የጠፋሁ ይመስለኛል። ፓርክ ጎዳና የት ነው?'),
          d('B', 'You’re close. It’s the next street on the right.', 'ቅርብ ነህ። በቀኝ በኩል ያለው ቀጣዩ መንገድ ነው።'),
          d('A', 'Thank you so much. My phone died.', 'በጣም አመሰግናለሁ። ስልኬ ቻርጅ ጨርሷል።'),
          d('B', 'No problem. There’s a café there where you can charge it.', 'ችግር የለም። እዚያ ቻርጅ የምታደርግበት ካፌ አለ።'),
        ],
        note: '“My phone died” means its battery is empty, not that it’s broken. In an emergency, the number is 911 in the US and Canada and 999 in the UK.',
      },
    ],
  },

  'english-from-amharic-5': {
    title: 'English Camp 5 – Health, Home & Services',
    intro: 'See a doctor, talk to a landlord, make appointments by phone, and deal with offices.',
    sections: [
      {
        title: 'Lesson 1 – At the Doctor',
        description: 'Explain how you feel, how long it’s been, and understand the doctor’s advice.',
        phrases: [
          p('I’ve had a headache for three days.', 'ለሦስት ቀን ራስ ምታት አሞኛል።'),
          p('It hurts when I swallow.', 'ስውጥ ያመኛል።'),
          p('I feel dizzy in the morning.', 'ጠዋት ጠዋት ያዞረኛል።'),
          p('I’m allergic to penicillin.', 'ፔኒሲሊን አይስማማኝም።'),
          p('How often should I take this medicine?', 'ይህን መድኃኒት በምን ያህል ጊዜ ልውሰደው?'),
          p('Do I need to come back?', 'ተመልሼ መምጣት አለብኝ?'),
        ],
        dialogue: [
          d('A', 'What seems to be the problem?', 'ችግሩ ምንድን ነው?'),
          d('B', 'I’ve had a sore throat for three days, and it hurts when I swallow.', 'ለሦስት ቀን ጉሮሮዬን አሞኛል፣ ስውጥም ያመኛል።'),
          d('A', 'Take this twice a day after meals.', 'ይህን በቀን ሁለት ጊዜ ከምግብ በኋላ ውሰድ።'),
          d('B', 'Do I need to come back?', 'ተመልሼ መምጣት አለብኝ?'),
          d('A', 'Only if you don’t feel better in a week.', 'በሳምንት ውስጥ ካልተሻለህ ብቻ።'),
        ],
        note: '“For” + a length of time tells the doctor how long: “for three days.” “Since” + a starting point does the same: “since Monday.”',
      },
      {
        title: 'Lesson 2 – Renting a Home',
        description: 'Ask about an apartment and tell the landlord when something is broken.',
        phrases: [
          p('Is the apartment still available?', 'አፓርታማው አሁንም አለ?'),
          p('How much is the rent per month?', 'የወር ኪራዩ ስንት ነው?'),
          p('Are the bills included?', 'የአገልግሎት ክፍያዎቹ ይጨምራሉ?'),
          p('The heating isn’t working.', 'ማሞቂያው እየሠራ አይደለም።'),
          p('There’s a leak in the bathroom.', 'መታጠቢያ ቤቱ ውስጥ ውሃ ያፈሳል።'),
          p('When can someone come to fix it?', 'የሚያስተካክለው ሰው መቼ ሊመጣ ይችላል?'),
        ],
        dialogue: [
          d('A', 'Hi, this is Dawit from apartment 4B.', 'ሰላም፣ ከአፓርታማ 4B ዳዊት ነኝ።'),
          d('B', 'Hi Dawit. How can I help?', 'ሰላም ዳዊት። ምን ልርዳህ?'),
          d('A', 'There’s a leak in the bathroom. It started last night.', 'መታጠቢያ ቤቱ ውስጥ ውሃ ያፈሳል። ትናንት ማታ ጀመረ።'),
          d('B', 'I’m sorry. I’ll send someone tomorrow morning.', 'አዝናለሁ። ነገ ጠዋት ሰው እልካለሁ።'),
        ],
        note: 'Before you rent, ask whether “bills” (water, electricity, gas, internet) are included. Tell your landlord about problems quickly, in writing if you can.',
      },
      {
        title: 'Lesson 3 – Phone Calls & Appointments',
        description: 'Make an appointment by phone, spell your name, and check the details.',
        phrases: [
          p('I’d like to make an appointment.', 'ቀጠሮ መያዝ እፈልጋለሁ።'),
          p('Do you have anything on Tuesday?', 'ማክሰኞ ክፍት ጊዜ አላችሁ?'),
          p('Could you spell that, please?', 'እባክህ ፊደል በፊደል ልትነግረኝ ትችላለህ?'),
          p('My name is spelled D-A-W-I-T.', 'ስሜ የሚጻፈው D-A-W-I-T ተብሎ ነው።'),
          p('Sorry, the line is bad. Could you repeat that?', 'ይቅርታ፣ መስመሩ ጥሩ አይደለም። ልትደግመው ትችላለህ?'),
          p('I need to cancel my appointment.', 'ቀጠሮዬን መሰረዝ አለብኝ።'),
        ],
        dialogue: [
          d('A', 'Good morning, City Clinic. How can I help you?', 'እንደምን አደርክ፣ ሲቲ ክሊኒክ። ምን ልርዳህ?'),
          d('B', 'Hi, I’d like to make an appointment. Do you have anything on Tuesday?', 'ሰላም፣ ቀጠሮ መያዝ እፈልጋለሁ። ማክሰኞ ክፍት ጊዜ አላችሁ?'),
          d('A', 'Yes, at ten thirty. Can I have your name?', 'አዎ፣ በአራት ሰዓት ተኩል። ስምህን ልውሰድ?'),
          d('B', 'Dawit Bekele. That’s D-A-W-I-T.', 'ዳዊት በቀለ። D-A-W-I-T ነው።'),
        ],
        note: 'Ethiopian names are new to many English speakers, so offer to spell yours. Practice saying the English alphabet quickly: it’s one of the most useful phone skills.',
      },
      {
        title: 'Lesson 4 – At an Office',
        description: 'Fill in forms and deal with government or school offices.',
        phrases: [
          p('Where do I fill out this form?', 'ይህን ቅጽ የት ልሙላው?'),
          p('What is your date of birth?', 'የትውልድ ቀንህ መቼ ነው?'),
          p('I need a copy of my documents.', 'የሰነዶቼ ቅጂ ያስፈልገኛል።'),
          p('How long will it take?', 'ምን ያህል ጊዜ ይወስዳል?'),
          p('Do I need to sign here?', 'እዚህ መፈረም አለብኝ?'),
          p('Who should I talk to about this?', 'ስለዚህ ጉዳይ ማንን ላነጋግር?'),
        ],
        dialogue: [
          d('A', 'Please fill out this form and sign at the bottom.', 'እባክህ ይህን ቅጽ ሙላና ከታች ፈርም።'),
          d('B', 'Should I write my date of birth in numbers?', 'የትውልድ ቀኔን በቁጥር ልጻፍ?'),
          d('A', 'Yes: month, day, then year.', 'አዎ፦ ወር፣ ቀን፣ ከዚያ ዓመት።'),
          d('B', 'Okay. How long will it take to process?', 'እሺ። ለማስኬድ ምን ያህል ጊዜ ይወስዳል?'),
        ],
        note: 'Forms use the Western calendar, not the Ethiopian one, so convert your birthday first. In the US dates are month/day/year (03/15/1995); in the UK they’re day/month/year (15/03/1995).',
      },
    ],
  },

  'english-from-amharic-6': {
    title: 'English Camp 6 – The Summit: Real Conversations',
    intro: 'Share opinions, tell stories, talk about the future, and sound natural with everyday expressions.',
    sections: [
      {
        title: 'Lesson 1 – Opinions',
        description: 'Give your opinion, agree, and disagree politely.',
        phrases: [
          p('In my opinion, it’s too expensive.', 'በእኔ አስተያየት በጣም ውድ ነው።'),
          p('I see your point, but I disagree.', 'ሐሳብህ ገብቶኛል፣ ግን አልስማማም።'),
          p('That’s a good point.', 'ጥሩ ነጥብ ነው።'),
          p('I totally agree with you.', 'ሙሉ በሙሉ እስማማለሁ።'),
          p('I’m not sure about that.', 'በዚያ ላይ እርግጠኛ አይደለሁም።'),
          p('What do you think?', 'አንተ ምን ታስባለህ?'),
        ],
        dialogue: [
          d('A', 'I think living in a big city is better.', 'በትልቅ ከተማ መኖር የተሻለ ይመስለኛል።'),
          d('B', 'I see your point, but I disagree. It’s too expensive.', 'ሐሳብህ ገብቶኛል፣ ግን አልስማማም። በጣም ውድ ነው።'),
          d('A', 'That’s true. But there are more jobs.', 'እውነት ነው። ግን ብዙ ሥራ አለ።'),
          d('B', 'That’s a good point.', 'ጥሩ ነጥብ ነው።'),
        ],
        note: 'English speakers often soften disagreement: “I see your point, but…” or “I’m not sure about that.” A direct “You are wrong” can sound rude.',
      },
      {
        title: 'Lesson 2 – Telling a Story',
        description: 'Tell what happened, in order, using the past tense.',
        phrases: [
          p('Last year, I traveled to Kenya.', 'ባለፈው ዓመት ወደ ኬንያ ተጓዝኩ።'),
          p('At first, I was nervous.', 'መጀመሪያ ላይ ፈርቼ ነበር።'),
          p('Then I met some friendly people.', 'ከዚያ ጥሩ ሰዎችን አገኘሁ።'),
          p('While I was waiting, it started to rain.', 'እየጠበቅኩ እያለ ዝናብ መዝነብ ጀመረ።'),
          p('In the end, everything was fine.', 'በመጨረሻ ሁሉም ነገር ጥሩ ሆነ።'),
          p('You won’t believe what happened!', 'የሆነውን አታምንም!'),
        ],
        dialogue: [
          d('A', 'You won’t believe what happened yesterday!', 'ትናንት የሆነውን አታምንም!'),
          d('B', 'What happened?', 'ምን ሆነ?'),
          d('A', 'While I was waiting for the bus, I found a wallet.', 'አውቶቡስ እየጠበቅኩ እያለ የኪስ ቦርሳ አገኘሁ።'),
          d('B', 'Really? What did you do?', 'እውነት? ምን አደረግክ?'),
          d('A', 'I called the owner, and in the end he gave me a reward.', 'ለባለቤቱ ደወልኩ፣ በመጨረሻም ሽልማት ሰጠኝ።'),
        ],
        note: 'Words like first, then, while and in the end help people follow your story. Most past verbs add -ed (traveled, called), but many common ones don’t: go → went, meet → met, find → found.',
      },
      {
        title: 'Lesson 3 – Plans & Dreams',
        description: 'Talk about the future: plans, hopes and predictions.',
        phrases: [
          p('I’m going to start a new job next month.', 'በሚቀጥለው ወር አዲስ ሥራ ልጀምር ነው።'),
          p('I hope to finish my degree.', 'ዲግሪዬን እንደምጨርስ ተስፋ አደርጋለሁ።'),
          p('One day, I want to open my own business.', 'አንድ ቀን የራሴን ንግድ መክፈት እፈልጋለሁ።'),
          p('I think it will be difficult, but worth it.', 'ከባድ ይሆናል ብዬ አስባለሁ፣ ግን ዋጋ አለው።'),
          p('What are your plans for next year?', 'የሚቀጥለው ዓመት ዕቅድህ ምንድን ነው?'),
          p('If I save enough money, I’ll visit Ethiopia.', 'በቂ ገንዘብ ካጠራቀምኩ ኢትዮጵያን እጎበኛለሁ።'),
        ],
        dialogue: [
          d('A', 'What are your plans for next year?', 'የሚቀጥለው ዓመት ዕቅድህ ምንድን ነው?'),
          d('B', 'I’m going to study nursing. I hope to work in a hospital.', 'ነርሲንግ ልማር ነው። ሆስፒታል ውስጥ እንደምሠራ ተስፋ አደርጋለሁ።'),
          d('A', 'That’s great. Will it be difficult?', 'በጣም ጥሩ። ከባድ ይሆናል?'),
          d('B', 'I think so, but it will be worth it.', 'እንደዚያ ይመስለኛል፣ ግን ዋጋ ይኖረዋል።'),
        ],
        note: 'Use “going to” for plans you’ve already decided: “I’m going to study nursing.” Use “will” for predictions and quick decisions: “It will be difficult.”',
      },
      {
        title: 'Lesson 4 – Sounding Natural',
        description: 'Everyday expressions that make your English sound relaxed and friendly.',
        phrases: [
          p('No worries.', 'ችግር የለም።'),
          p('It’s up to you.', 'የአንተ ምርጫ ነው።'),
          p('I’m running late.', 'እየዘገየሁ ነው።'),
          p('Let me think about it.', 'ላስብበት።'),
          p('That makes sense.', 'ትርጉም ይሰጣል።'),
          p('Keep in touch!', 'እንደተገናኘን እንቆይ!'),
        ],
        dialogue: [
          d('A', 'Sorry, I’m running late. I’ll be there in ten minutes.', 'ይቅርታ፣ እየዘገየሁ ነው። በአሥር ደቂቃ እደርሳለሁ።'),
          d('B', 'No worries. Do you want to meet at the café instead?', 'ችግር የለም። በምትኩ ካፌው ጋ እንገናኝ?'),
          d('A', 'It’s up to you.', 'የአንተ ምርጫ ነው።'),
          d('B', 'Okay, the café then. That makes more sense.', 'እሺ፣ እንግዲያው ካፌው። የበለጠ ትርጉም ይሰጣል።'),
        ],
        note: 'These short expressions are everywhere in texts and conversations. You can’t translate them word by word: “I’m running late” has nothing to do with running.',
      },
      {
        title: 'Lesson 5 – Celebrations & Kind Words',
        description: 'Congratulate, comfort, and celebrate with friends and coworkers.',
        phrases: [
          p('Congratulations on your new job!', 'በአዲሱ ሥራህ እንኳን ደስ አለህ!'),
          p('I’m so happy for you.', 'ስለአንተ በጣም ደስ ብሎኛል።'),
          p('I’m sorry for your loss.', 'በደረሰብህ ሐዘን አዝናለሁ።'),
          p('Let me know if you need anything.', 'የምትፈልገው ነገር ካለ ንገረኝ።'),
          p('Happy holidays!', 'መልካም በዓል!'),
          p('Thank you for everything.', 'ስለሁሉም ነገር አመሰግናለሁ።'),
        ],
        dialogue: [
          d('A', 'I passed my exam and got the job!', 'ፈተናዬን አልፌ ሥራውን አገኘሁ!'),
          d('B', 'Congratulations! I’m so happy for you.', 'እንኳን ደስ አለህ! ስለአንተ በጣም ደስ ብሎኛል።'),
          d('A', 'Thank you for everything. You helped me a lot.', 'ስለሁሉም ነገር አመሰግናለሁ። ብዙ ረድተኸኛል።'),
          d('B', 'Let’s celebrate this weekend!', 'በዚህ ቅዳሜና እሁድ እናክብረው!'),
        ],
        note: '“I’m sorry for your loss” is what English speakers say when someone has died; it’s like ነፍስ ይማር. “Happy holidays” works for any holiday season.',
      },
    ],
  },
};

const AUDIENCE = 'Amharic speakers learning English';

export const englishCatalog: CourseSummary[] = [
  { slug: 'english-from-amharic-1', description: 'Getting to know people, your routine, making plans, and asking politely.' },
  { slug: 'english-from-amharic-2', description: 'Work, emails, school, and talking about your experience.' },
  { slug: 'english-from-amharic-3', description: 'Restaurants, complaints, shopping and returns, and the bank.' },
  { slug: 'english-from-amharic-4', description: 'Directions and transport, the airport, hotels, and asking for help.' },
  { slug: 'english-from-amharic-5', description: 'The doctor, renting a home, phone appointments, and offices.' },
  { slug: 'english-from-amharic-6', description: 'Opinions, stories, plans, natural expressions, and kind words.' },
].map((course, i) => ({
  ...course,
  title: englishCourses[course.slug].title,
  audience: AUDIENCE,
  track: 'english',
  part: i + 1,
}));
