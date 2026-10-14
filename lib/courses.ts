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
            amharic: 'ሰላም፣ ስሜ አማኑኤል ነው።',
            transliteration: 'selam, səme Amanuel new.',
            english: 'Hello, my name is Amanuel.',
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
          'Get familiar with basic numbers so you can handle prices, time, and quantities.',
        phrases: [
          { amharic: 'አንድ', transliteration: 'and', english: 'one' },
          { amharic: 'ሁለት', transliteration: 'hulət', english: 'two' },
          { amharic: 'ሶስት', transliteration: 'sost', english: 'three' },
          { amharic: 'አምስት', transliteration: 'aməst', english: 'five' },
          { amharic: 'አስር', transliteration: 'asir', english: 'ten' },
          { amharic: 'አምሳ', transliteration: 'amsa', english: 'fifty' },
          { amharic: 'መቶ', transliteration: 'meto', english: 'hundred' },
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
            amharic: 'ትንሽ ቀርበህ ተናገር',
            transliteration: 'tɨnɨsh qerbeh tenager',
            english: 'Speak a little slower.',
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
            amharic: 'እሺ፣ ነግ እንነጋገር።',
            transliteration: 'əshi, nəg ənnəgager.',
            english: 'Okay, let’s talk tomorrow.',
          },
        ],
      },
    ],
  },

  // English from Amharic – Part 1
  'english-from-amharic-1': {
    title: 'English from Amharic – Part 1',
    intro:
      'Designed for Amharic speakers who want to build everyday English, with explanations in Amharic and English side‑by‑side.',
    sections: [
      {
        title: 'Lesson 1 – Greetings in English',
        description:
          'Practice simple English greetings and polite expressions, explained in Amharic.',
        phrases: [
          {
            amharic: 'ሰላም',
            transliteration: 'selam',
            english: 'Hello.',
          },
          {
            amharic: 'እንዴት ነህ?',
            transliteration: 'endet neh?',
            english: 'How are you?',
          },
          {
            amharic: 'ደህና ነኝ፣ አንተ?',
            transliteration: 'dehna neñ, ante?',
            english: 'I’m fine, and you?',
          },
          {
            amharic: 'እጅግ አመሰግናለሁ',
            transliteration: 'əjjəg amesegenallo',
            english: 'Thank you very much.',
          },
        ],
        dialogue: [
          {
            speaker: 'A',
            amharic: 'ሰላም እንዴት ነህ?',
            transliteration: 'selam, endet neh?',
            english: 'Hello, how are you?',
          },
          {
            speaker: 'B',
            amharic: 'ደህና ነኝ፣ አንተ?',
            transliteration: 'dehna neñ, ante?',
            english: 'I’m fine, and you?',
          },
        ],
      },
      {
        title: 'Lesson 2 – Introducing Yourself in English',
        description:
          'Learn to talk about your name and where you are from, starting from Amharic.',
        phrases: [
          {
            amharic: 'ስሜ ... ነው።',
            transliteration: 'səme ... new.',
            english: 'My name is ....',
          },
          {
            amharic: 'ከኢትዮጵያ መጣሁ።',
            transliteration: 'kə Ityopya metahu.',
            english: 'I am from Ethiopia.',
          },
          {
            amharic: 'እባክህ ስምህ?',
            transliteration: 'əbbakih, səmməh?',
            english: 'What is your name?',
          },
        ],
        dialogue: [
          {
            speaker: 'A',
            amharic: 'ስሜ አማኑኤል ነው። ከኢትዮጵያ መጣሁ።',
            transliteration: 'səme Amanuel new. kə Ityopya metahu.',
            english: 'My name is Amanuel. I am from Ethiopia.',
          },
          {
            speaker: 'B',
            amharic: 'ደህና መጣህ፣ አማኑኤል።',
            transliteration: 'dehna metah, Amanuel.',
            english: 'Welcome, Amanuel.',
          },
        ],
      },
      {
        title: 'Lesson 3 – Everyday English Responses',
        description:
          'Short English replies to common questions, starting from Amharic prompts.',
        phrases: [
          {
            amharic: 'ጊዜ አለህ?',
            transliteration: 'gize alleh?',
            english: 'Do you have time?',
          },
          {
            amharic: 'አሁን አልችልም።',
            transliteration: 'ahun alchilem.',
            english: 'I can’t right now.',
          },
          {
            amharic: 'ድጋሚ ተናገር እባክህ።',
            transliteration: 'dɨgami tenager əbbakih.',
            english: 'Please say it again.',
          },
        ],
        dialogue: [
          {
            speaker: 'A',
            amharic: 'ጊዜ አለህ?',
            transliteration: 'gize alleh?',
            english: 'Do you have time?',
          },
          {
            speaker: 'B',
            amharic: 'አሁን አልችልም፣ ነግ እችላለሁ።',
            transliteration: 'ahun alchilem, nəg əchəlalhu.',
            english: 'I can’t right now, but I can tomorrow.',
          },
        ],
      },
    ],
  },

  // English from Amharic – Part 2
  'english-from-amharic-2': {
    title: 'English from Amharic – Part 2',
    intro:
      'Continue building everyday English as an Amharic speaker, focusing on family, work, and daily routines.',
    sections: [
      {
        title: 'Lesson 1 – Family & People in English',
        description:
          'Talk about your family members and people around you in English, starting from Amharic.',
        phrases: [
          {
            amharic: 'አባቴ በአውሮፓ ይኖራል።',
            transliteration: 'abate be-Europa yinoral.',
            english: 'My father lives in Europe.',
          },
          {
            amharic: 'እናቴ በቤት ትሰራለች።',
            transliteration: 'ənnate be-bet tɨseralech.',
            english: 'My mother works at home.',
          },
        ],
      },
      {
        title: 'Lesson 2 – Work & Study in English',
        description:
          'Build English sentences about your job, school, or what you do every day.',
        phrases: [
          {
            amharic: 'እኔ ተማሪ ነኝ።',
            transliteration: 'ene temari neñ.',
            english: 'I am a student.',
          },
          {
            amharic: 'በቢሮ እሰራለሁ።',
            transliteration: 'be-biro əsəralehu.',
            english: 'I work in an office.',
          },
        ],
      },
      {
        title: 'Lesson 3 – Daily Routine in English',
        description:
          'Talk about your typical day—waking up, eating, working or studying—in English.',
        phrases: [
          {
            amharic: 'ጠዋት ስድስት ሰዓት እነሳለሁ።',
            transliteration: 'ṯewat sɨdɨst se-at ənəsalehu.',
            english: 'I wake up at six in the morning.',
          },
          {
            amharic: 'ስራ በኋላ ወደ ቤት እመለሳለሁ።',
            transliteration: 'səra behwala wede bet əmelesalehu.',
            english: 'I go back home after work.',
          },
        ],
      },
    ],
  },
};

export type Track = 'amharic' | 'english';

export type CourseSummary = {
  slug: string;
  title: string;
  description: string;
  audience: string;
  track: Track;
  part: 1 | 2;
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
    slug: 'english-from-amharic-1',
    title: 'English from Amharic – Part 1',
    description: 'Everyday English greetings and basics explained in Amharic.',
    audience: 'Amharic speakers learning English',
    track: 'english',
    part: 1,
  },
  {
    slug: 'english-from-amharic-2',
    title: 'English from Amharic – Part 2',
    description: 'Family, work, and simple daily English phrases.',
    audience: 'Amharic speakers learning English',
    track: 'english',
    part: 2,
  },
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
