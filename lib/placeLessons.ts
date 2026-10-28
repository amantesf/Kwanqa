// A one-minute lesson about each passport stamp's place: a few short cards,
// each with an Amharic word to hear, then one quick question. It's offered
// when the stamp is earned, and can be replayed from the passport.
//
// Facts were checked against UNESCO, Britannica and Wikipedia.

export type PlaceWord = { am: string; tr: string; en: string };
export type PlaceCard = { text: string; word: PlaceWord };
export type PlaceQuestion = { q: string; options: string[]; answer: number; why: string };
export type PlaceLesson = { cards: PlaceCard[]; question: PlaceQuestion };

export const PLACE_LESSONS: Record<string, PlaceLesson> = {
  lalibela: {
    cards: [
      {
        text: 'Lalibela is a small town high in the mountains of northern Ethiopia. People come from all over the world to see its churches.',
        word: { am: 'ቤተ ክርስቲያን', tr: 'bete kristiyan', en: 'church' },
      },
      {
        text: 'The 11 churches weren’t built up from bricks. Workers carved them down into solid volcanic rock, then hollowed out the inside.',
        word: { am: 'ድንጋይ', tr: 'dingay', en: 'stone, rock' },
      },
      {
        text: 'The most famous one, Bete Giyorgis (the Church of St George), is shaped like a giant cross when you look down on it.',
        word: { am: 'መስቀል', tr: 'mesqel', en: 'cross' },
      },
      {
        text: 'Every January, thousands of pilgrims dressed in white come to Lalibela to celebrate Ethiopian Christmas.',
        word: { am: 'ገና', tr: 'genna', en: 'Christmas' },
      },
    ],
    question: {
      q: 'How were Lalibela’s churches made?',
      options: ['Built from clay bricks', 'Carved down into solid rock', 'Made from wood and straw'],
      answer: 1,
      why: 'Workers cut them out of one piece of rock, from the top down.',
    },
  },
  gondar: {
    cards: [
      {
        text: 'In 1636 Emperor Fasilides made Gondar his capital. It stayed Ethiopia’s capital for about 200 years.',
        word: { am: 'ቤተ መንግሥት', tr: 'bete mengist', en: 'palace' },
      },
      {
        text: 'Inside a stone wall called Fasil Ghebbi, emperors built castles, palaces, churches and even a library.',
        word: { am: 'ግንብ', tr: 'ginb', en: 'castle, tower' },
      },
      {
        text: 'Fasilides’ Bath is a big stone pool. It’s filled once a year for Timket, when crowds jump into the blessed water.',
        word: { am: 'ጥምቀት', tr: 'timqet', en: 'Timket (Epiphany)' },
      },
    ],
    question: {
      q: 'What happens at Fasilides’ Bath during Timket?',
      options: ['People jump into the blessed water', 'A king is crowned', 'Horses race around it'],
      answer: 0,
      why: 'The pool is filled for Timket, and people jump in to be blessed.',
    },
  },
  axum: {
    cards: [
      {
        text: 'About 2,000 years ago, Axum was the heart of a powerful kingdom that traded with Rome, Egypt, Arabia and India.',
        word: { am: 'መንግሥት', tr: 'mengist', en: 'kingdom, government' },
      },
      {
        text: 'Axum made its own coins out of gold, silver and bronze. It was one of the first kingdoms in Africa to do that.',
        word: { am: 'ወርቅ', tr: 'werq', en: 'gold' },
      },
      {
        text: 'Its tall carved stone towers, called stelae, marked the graves of kings. The biggest still standing is about 24 m tall.',
        word: { am: 'ሐውልት', tr: 'hawilt', en: 'monument, obelisk' },
      },
      {
        text: 'Ge’ez, the old language of Axum, gave us the ፊደል. You read Amharic today with letters that grew from Axum’s writing.',
        word: { am: 'ፊደል', tr: 'fidel', en: 'alphabet, letter' },
      },
    ],
    question: {
      q: 'What did Axum make long before most kingdoms in Africa did?',
      options: ['Paper money', 'Its own gold, silver and bronze coins', 'Glass windows'],
      answer: 1,
      why: 'Axum minted its own coins, one of the first kingdoms in Africa to do it.',
    },
  },
  tana: {
    cards: [
      {
        text: 'Lake Tana is the biggest lake in Ethiopia. The city of Bahir Dar sits on its southern shore.',
        word: { am: 'ሐይቅ', tr: 'hayq', en: 'lake' },
      },
      {
        text: 'The Blue Nile, ዓባይ, flows out of Lake Tana. Not far downstream it drops over a waterfall called ጢስ ዓባይ, “smoking Nile”.',
        word: { am: 'ዓባይ', tr: 'abay', en: 'the Blue Nile' },
      },
      {
        text: 'Old monasteries sit on the lake’s islands and shores, with painted churches and very old handwritten books.',
        word: { am: 'ገዳም', tr: 'gedam', en: 'monastery' },
      },
      {
        text: 'Fishermen still paddle tankwa, light boats made of papyrus reeds tied together.',
        word: { am: 'ታንኳ', tr: 'tankwa', en: 'reed boat' },
      },
    ],
    question: {
      q: 'Which river flows out of Lake Tana?',
      options: ['The Awash', 'The Omo', 'The Blue Nile'],
      answer: 2,
      why: 'The Blue Nile, ዓባይ, starts its journey to Sudan and Egypt at Lake Tana.',
    },
  },
  harar: {
    cards: [
      {
        text: 'Harar is an old city in eastern Ethiopia, surrounded by a wall called the Jugol, with five main gates.',
        word: { am: 'በር', tr: 'ber', en: 'door, gate' },
      },
      {
        text: 'Inside the wall is a maze of narrow lanes, with more than 80 mosques and over 100 shrines.',
        word: { am: 'ከተማ', tr: 'ketema', en: 'city, town' },
      },
      {
        text: 'At night, Harar’s “hyena men” call wild hyenas by name and feed them by hand, a tradition since the 1960s.',
        word: { am: 'ጅብ', tr: 'jib', en: 'hyena' },
      },
      {
        text: 'The hills around Harar grow a famous coffee, named after the city.',
        word: { am: 'ቡና', tr: 'buna', en: 'coffee' },
      },
    ],
    question: {
      q: 'What do Harar’s “hyena men” do?',
      options: ['Feed wild hyenas by hand at night', 'Chase hyenas out of town', 'Train hyenas to guard the gates'],
      answer: 0,
      why: 'They call the hyenas and feed them by hand, often to amazed visitors.',
    },
  },
  danakil: {
    cards: [
      {
        text: 'The Danakil Depression, in the Afar region, is one of the lowest, hottest places on Earth, about 125 m below sea level.',
        word: { am: 'ሙቀት', tr: 'muqet', en: 'heat' },
      },
      {
        text: 'At Dallol, hot springs paint the ground bright yellow, green and orange. It looks like another planet.',
        word: { am: 'ምንጭ', tr: 'minch', en: 'spring (of water)' },
      },
      {
        text: 'Erta Ale is an active volcano. Its name means “smoking mountain” in the Afar language.',
        word: { am: 'እሳተ ገሞራ', tr: 'isate gemora', en: 'volcano' },
      },
      {
        text: 'Miners still cut salt into bars, and camel caravans carry them up to the highlands. Salt bars were once used as money.',
        word: { am: 'ጨው', tr: 'chew', en: 'salt' },
      },
    ],
    question: {
      q: 'What do camel caravans carry out of the Danakil?',
      options: ['Coffee beans', 'Bars of salt', 'Gold'],
      answer: 1,
      why: 'Salt is cut by hand into bars, called amole, and carried by camel.',
    },
  },
  bale: {
    cards: [
      {
        text: 'Bale Mountains National Park, in Oromia, has the largest area of high, cold Afroalpine land in all of Africa.',
        word: { am: 'ተራራ', tr: 'terara', en: 'mountain' },
      },
      {
        text: 'It’s home to more than half of the world’s Ethiopian wolves. In Amharic they’re called ቀይ ቀበሮ, “red fox”.',
        word: { am: 'ቀይ ቀበሮ', tr: 'qey qebero', en: 'Ethiopian wolf' },
      },
      {
        text: 'On its southern side is the Harenna Forest, where coffee plants grow wild.',
        word: { am: 'ጫካ', tr: 'chaka', en: 'forest' },
      },
      {
        text: 'Bale is also where most mountain nyala live, a big spiral-horned antelope found only in Ethiopia.',
        word: { am: 'እንስሳ', tr: 'insisa', en: 'animal' },
      },
    ],
    question: {
      q: 'Which rare animal lives mostly in the Bale Mountains?',
      options: ['The Ethiopian wolf', 'The polar bear', 'The tiger'],
      answer: 0,
      why: 'More than half of all Ethiopian wolves live in Bale.',
    },
  },
  'ras-dashen': {
    cards: [
      {
        text: 'Ras Dashen is Ethiopia’s highest mountain, at 4,550 m, in the Simien Mountains. You made it to the top!',
        word: { am: 'ተራራ', tr: 'terara', en: 'mountain' },
      },
      {
        text: 'Simien Mountains National Park was one of the very first places named a UNESCO World Heritage Site, in 1978.',
        word: { am: 'ብሔራዊ ፓርክ', tr: 'biherawi park', en: 'national park' },
      },
      {
        text: 'The walia ibex lives here and nowhere else in the world. That’s Walia, your guide on this climb.',
        word: { am: 'ዋልያ', tr: 'walya', en: 'walia ibex' },
      },
      {
        text: 'Big groups of gelada monkeys graze on the grass here. They have a bright red patch of skin on their chest.',
        word: { am: 'ጭላዳ', tr: 'chilada', en: 'gelada monkey' },
      },
    ],
    question: {
      q: 'Which animal lives only in the Simien Mountains?',
      options: ['The lion', 'The walia ibex', 'The giraffe'],
      answer: 1,
      why: 'The walia ibex is found nowhere else on Earth.',
    },
  },
};

/** Every Amharic word in the place lessons, so Walia can say them. */
export function placeLessonWords(): string[] {
  return Object.values(PLACE_LESSONS).flatMap(l => l.cards.map(c => c.word.am));
}
