export type Feature = {
  title: string;
  body: string;
};

// What's inside the app, for the About page.
export const features: Feature[] = [
  {
    title: 'The climb',
    body: '12 Amharic camps and 9 English camps, from first greetings to the Summit. Short, game-like lessons with listening, speaking, matching and picture questions, and Walia climbing the Simien Mountains with you.',
  },
  {
    title: 'ፊደል, the alphabet',
    body: 'An interactive fidel chart with audio for every letter, stroke-by-stroke writing practice, and the Ge’ez numerals ፩ ፪ ፫ with their Amharic names.',
  },
  {
    title: 'Talk with Walia',
    body: 'Practise real conversations out loud. Walia listens, checks whether your answer fits, and answers back, with hints and an example when you get stuck.',
  },
  {
    title: 'Stories',
    body: 'Read Amharic stories and 29 illustrated storybooks, or add your own book as a PDF. Tap any word for its meaning, and watch your known words grow.',
  },
  {
    title: 'Merkato and culture',
    body: 'Bargain your way through the market, learn proverbs and everyday phrases, and follow the Ethiopian calendar and holidays: Meskel, Genna, Fasika, Eid and Ramadan.',
  },
  {
    title: 'Family mode',
    body: 'Parents and kids each learn on their own account and join one family with a code. The family streak only grows on days when everyone practises.',
  },
];

export const values: Feature[] = [
  {
    title: 'Language belongs to everyone',
    body: 'Access to learning shouldn’t depend on where you’re born or what tools you have. Every learner deserves a path to English, Amharic, and other Ethiopian languages.',
  },
  {
    title: 'Culture matters',
    body: 'We honor heritage languages (Amharic, Afaan Oromo, Tigrinya, and more) because language is identity, history, and connection, not just vocabulary.',
  },
  {
    title: 'Learning made simple',
    body: 'No confusion. No extra noise. Just clear, intuitive tools that help you learn at your own pace, with small steps that fit into real life.',
  },
  {
    title: 'Community first',
    body: 'We build with and for the Ethiopian community, at home and across the diaspora. Feedback from learners, teachers, and families shapes our roadmap.',
  },
  {
    title: 'Empowerment through education',
    body: 'Whether you’re learning English to unlock opportunities or Amharic to reconnect with family, our goal is to lift you higher, not just help you memorize words.',
  },
  {
    title: 'Technology with a heart',
    body: 'Our tools support teachers and learners. They never replace the human connection that real language is built on. Technology is the tool; people are the purpose.',
  },
];

export const approach: Feature[] = [
  {
    title: 'Personalized learning paths',
    body: 'Lessons adapt to each learner’s skill level, pace, and goals, ensuring steady progress and real‑world fluency, whether you’re learning Amharic or English.',
  },
  {
    title: 'Tutors & practice partners',
    body: 'We connect learners with the right teachers, conversation partners, and peer groups for the most effective, engaging learning experience.',
  },
  {
    title: 'Culturally grounded curriculum',
    body: 'Our courses honor heritage languages like Amharic, Afaan Oromo, and Tigrinya, while teaching English in ways that respect culture and identity.',
  },
  {
    title: 'Progress tracking & feedback',
    body: 'Assessments, milestones, and feedback loops keep learners accountable and motivated. You can see your growth, not just your streak.',
  },
  {
    title: 'Flexible access',
    body: 'Study anytime, anywhere, on devices you already use, with options that fit your schedule and lifestyle.',
  },
  {
    title: 'Real conversations first',
    body: 'Every lesson pairs core phrases with short dialogues, transliteration, and translations so you can speak from day one.',
  },
];

export type Testimonial = {
  name: string;
  quote: string;
};

export const testimonials: Testimonial[] = [
  {
    name: 'Yafiet Bereket',
    quote:
      'I’ve tried several language apps before, but Kwanqa is different. The lessons are engaging, the instructors are knowledgeable, and the personalized approach really helps me progress. I feel more confident speaking both English and Amharic every day.',
  },
  {
    name: 'Ruth Nuguse',
    quote:
      'The platform is extremely user-friendly, and the quality of both lessons and instructors is outstanding. I’ve used Kwanqa to improve my English and reconnect with my Amharic roots. I highly recommend it!',
  },
  {
    name: 'Dawit Kebede',
    quote:
      'Kwanqa እንግሊዘኛን ለመማር መጠቀም በሚያስደንቅ ሁኔታ ምቹ ነበር። ለግል የተበጁ የመማሪያ መንገዶች ከትክክለኛዎቹ ትምህርቶች እና የተግባር እድሎች ጋር በቅጽበት ያገናኙኛል፣ እና መድረኩን ማወቄ እውነተኛ መምህራንን እና ተወላጆችን ይደግፋል በራስ መተማመን ይሰጠኛል። የመማር ልምዱ ጥራት እና አስተማማኝነት ወደር የለሽ ነው።',
  },
];
