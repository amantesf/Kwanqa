import type { LessonSection, Track } from '@/lib/courses';
import { fromEthiopian } from '@/lib/ethiopianCalendar';

// Ethiopian holidays: their dates, a greeting to send family, and a special
// lesson for each course. The Amharic course teaches the greetings and words;
// the English course teaches how to talk about the holiday in English.

export type HolidayId = 'enkutatash' | 'meskel' | 'genna' | 'timket' | 'fasika';

export type Holiday = {
  id: HolidayId;
  name: string;
  amharic: string;
  /** What it is, in a few words. */
  about: string;
  /** Accent colour for the themed banner and trail. */
  color: string;
  /** When it falls in a given Gregorian year (local midnight). */
  date: (year: number) => Date;
  greeting: { amharic: string; english: string };
  lessons: Record<Track, LessonSection>;
};

/** Orthodox Easter (Fasika): Julian-calendar Easter moved to the Gregorian calendar (valid 1900–2099). */
function orthodoxEaster(year: number) {
  const a = year % 4;
  const b = year % 7;
  const c = year % 19;
  const d = (19 * c + 15) % 30;
  const e = (2 * a + 4 * b - d + 34) % 7;
  const month = Math.floor((d + e + 114) / 31);
  const day = ((d + e + 114) % 31) + 1;
  return new Date(year, month - 1, day + 13);
}

/** The Ethiopian year that starts in September of a Gregorian year. */
const ethiopianYearStarting = (year: number) => year - 7;
/** The Ethiopian year that is running in January of a Gregorian year. */
const ethiopianYearInJanuary = (year: number) => year - 8;

type Line = { amharic: string; transliteration: string; english: string };
const w = (amharic: string, transliteration: string, english: string): Line => ({ amharic, transliteration, english });
const say = (speaker: 'A' | 'B', amharic: string, transliteration: string, english: string) => ({ speaker, ...w(amharic, transliteration, english) });

export const holidays: Holiday[] = [
  {
    id: 'enkutatash',
    name: 'Enkutatash',
    amharic: 'እንቁጣጣሽ',
    about: 'Ethiopian New Year',
    color: '#e8a317',
    date: year => fromEthiopian({ year: ethiopianYearStarting(year), month: 1, day: 1 }),
    greeting: {
      amharic: 'እንኳን ለአዲሱ ዓመት በሰላም አደረሳችሁ! ዓመቱ የሰላምና የጤና ይሁንላችሁ።',
      english: 'Happy Ethiopian New Year! Wishing you a year of peace and health.',
    },
    lessons: {
      amharic: {
        title: 'Enkutatash – Ethiopian New Year',
        description: 'Wish everyone a happy new year and learn the words of the season.',
        phrases: [
          w('እንኳን አደረሳችሁ!', 'enkwan aderesachihu!', 'Happy holiday! (to a group; lit. “glad you reached it”)'),
          w('መልካም አዲስ ዓመት!', 'melkam addis amet!', 'Happy New Year!'),
          w('እንቁጣጣሽ', 'enkutatash', 'Ethiopian New Year'),
          w('አደይ አበባ', 'adey abeba', 'the yellow Meskel daisy that blooms at New Year'),
          w('አዲስ ዓመት', 'addis amet', 'new year'),
          w('ዓመቱ የሰላም ይሁን!', 'ametu ye-selam yihun!', 'May the year be peaceful!'),
        ],
        dialogue: [
          say('A', 'እንኳን ለአዲሱ ዓመት በሰላም አደረሰህ!', 'enkwan le-addisu amet be-selam aderesek!', 'Happy New Year! (to a man)'),
          say('B', 'እንኳን አብሮ አደረሰን!', 'enkwan abro aderesen!', 'Same to you! (lit. “glad we reached it together”)'),
          say('A', 'ዓመቱ የሰላምና የጤና ይሁንልን።', 'ametu ye-selamna ye-tena yihunilin.', 'May the year bring us peace and health.'),
        ],
        note: 'Enkutatash falls on Meskerem 1 (September 11, or 12 before a leap year), as the rainy season ends and fields turn yellow with adey abeba. Girls go door to door singing “Abebayehosh”.',
      },
      english: {
        title: 'Enkutatash – Ethiopian New Year',
        description: 'Explain the Ethiopian New Year to English-speaking friends.',
        phrases: [
          w('መልካም አዲስ ዓመት!', '', 'Happy New Year!'),
          w('የኢትዮጵያ አዲስ ዓመት በመስከረም ነው።', '', 'Ethiopian New Year is in September.'),
          w('የኢትዮጵያ ዘመን አቆጣጠር አስራ ሦስት ወራት አሉት።', '', 'The Ethiopian calendar has thirteen months.'),
          w('ከቤተሰብ ጋር እናከብራለን።', '', 'We celebrate with family.'),
          w('ክረምቱ ያበቃል።', '', 'The rainy season ends.'),
          w('ሜዳዎቹ በቢጫ አበቦች ይሞላሉ።', '', 'The fields fill with yellow flowers.'),
        ],
        dialogue: [
          say('A', 'አዲስ ዓመታችሁ ለምን በመስከረም ሆነ?', '', 'Why is your New Year in September?'),
          say('B', 'የኢትዮጵያ ዘመን አቆጣጠር የተለየ ስለሆነ ነው። አስራ ሦስት ወራት አሉት።', '', 'Because the Ethiopian calendar is different. It has thirteen months.'),
          say('A', 'በጣም ደስ የሚል ነው!', '', 'That’s really interesting!'),
        ],
        note: '“Thirteen months of sunshine” is a famous English phrase about Ethiopia, because of its calendar.',
      },
    },
  },
  {
    id: 'meskel',
    name: 'Meskel',
    amharic: 'መስቀል',
    about: 'The Finding of the True Cross',
    color: '#d2582e',
    date: year => fromEthiopian({ year: ethiopianYearStarting(year), month: 1, day: 17 }),
    greeting: {
      amharic: 'እንኳን ለብርሃነ መስቀሉ በዓል በሰላም አደረሳችሁ!',
      english: 'Happy Meskel! Wishing you and your family a blessed holiday.',
    },
    lessons: {
      amharic: {
        title: 'Meskel – The Bonfire Holiday',
        description: 'Greetings and words for Meskel and the Demera bonfire.',
        phrases: [
          w('እንኳን ለመስቀል በዓል አደረሳችሁ!', 'enkwan le-meskel beal aderesachihu!', 'Happy Meskel!'),
          w('መስቀል', 'meskel', 'the Cross; the Meskel holiday'),
          w('ደመራ', 'demera', 'the bonfire lit on Meskel eve'),
          w('ችቦ', 'chibo', 'a torch made of bundled sticks'),
          w('እሳት', 'isat', 'fire'),
          w('በዓል', 'beal', 'holiday, festival'),
        ],
        dialogue: [
          say('A', 'ዛሬ ማታ ደመራ እንሄዳለን?', 'zare mata demera enhedalen?', 'Are we going to the Demera tonight?'),
          say('B', 'አዎ፣ ችቦ ይዘን እንሄዳለን።', 'awo, chibo yizen enhedalen.', 'Yes, we’ll bring torches.'),
          say('A', 'እንኳን አደረሰህ!', 'enkwan aderesek!', 'Happy holiday! (to a man)'),
        ],
        note: 'Meskel (Meskerem 17, September 27) remembers the finding of the True Cross. On the eve, people light a huge Demera bonfire and sing around it. UNESCO lists it as world heritage.',
      },
      english: {
        title: 'Meskel – The Bonfire Holiday',
        description: 'Tell English speakers what Meskel is and invite them along.',
        phrases: [
          w('እንኳን ለመስቀል በዓል አደረሳችሁ!', '', 'Happy Meskel!'),
          w('መስቀል በመስከረም የሚከበር በዓል ነው።', '', 'Meskel is a holiday in September.'),
          w('ትልቅ ደመራ እናበራለን።', '', 'We light a big bonfire.'),
          w('የእውነተኛውን መስቀል መገኘት ያከብራል።', '', 'It celebrates the finding of the True Cross.'),
          w('ሁሉም ሰው ይዘምራል፣ ይጨፍራል።', '', 'Everyone sings and dances.'),
          w('በጣም የቆየ ባህል ነው።', '', 'It’s a very old tradition.'),
        ],
        dialogue: [
          say('A', 'መስቀል ምንድን ነው?', '', 'What is Meskel?'),
          say('B', 'የኢትዮጵያ በዓል ነው። ትልቅ ደመራ እናበራለን።', '', 'It’s an Ethiopian holiday. We light a big bonfire.'),
          say('A', 'እኔም መምጣት እችላለሁ?', '', 'Can I come too?'),
          say('B', 'በእርግጥ! ማንኛውም ሰው መምጣት ይችላል።', '', 'Of course! Everyone is welcome.'),
        ],
        note: '“Everyone is welcome” is a warm way to invite people in English, perfect for a Meskel celebration.',
      },
    },
  },
  {
    id: 'genna',
    name: 'Genna',
    amharic: 'ገና',
    about: 'Ethiopian Christmas',
    color: '#2f6f4f',
    date: year => new Date(year, 0, 7), // Tahsas 29 (Tahsas 28 after a leap year): always January 7
    greeting: {
      amharic: 'እንኳን ለጌታችን ለመድኃኒታችን ለኢየሱስ ክርስቶስ የልደት በዓል በሰላም አደረሳችሁ! መልካም ገና!',
      english: 'Merry Christmas! Wishing you a joyful Genna with your family.',
    },
    lessons: {
      amharic: {
        title: 'Genna – Ethiopian Christmas',
        description: 'Christmas greetings and the words of the Genna feast.',
        phrases: [
          w('መልካም ገና!', 'melkam genna!', 'Merry Christmas!'),
          w('እንኳን ለልደቱ አደረሳችሁ!', 'enkwan le-lidetu aderesachihu!', 'Merry Christmas! (formal; “for His birth”)'),
          w('ገና', 'genna', 'Ethiopian Christmas'),
          w('ቤተ ክርስቲያን', 'bete kristiyan', 'church'),
          w('ጾም', 'tsom', 'fast, fasting'),
          w('ዶሮ ወጥ', 'doro wet', 'chicken stew, the holiday dish'),
        ],
        dialogue: [
          say('A', 'መልካም ገና!', 'melkam genna!', 'Merry Christmas!'),
          say('B', 'መልካም ገና! ዶሮ ወጥ ደርሷል?', 'melkam genna! doro wet dersual?', 'Merry Christmas! Is the doro wet ready?'),
          say('A', 'አዎ፣ ኑ እንብላ!', 'awo, nu enbila!', 'Yes, come, let’s eat!'),
        ],
        note: 'Genna is on January 7, after a 43-day fast. Many people go to church through the night dressed in white netela, then share doro wet with family at dawn.',
      },
      english: {
        title: 'Genna – Ethiopian Christmas',
        description: 'Explain why Ethiopian Christmas is in January.',
        phrases: [
          w('መልካም ገና!', '', 'Merry Christmas!'),
          w('የኢትዮጵያ ገና ታኅሣሥ 29 (ጃንዋሪ 7) ነው።', '', 'Ethiopian Christmas is on January 7.'),
          w('ማታ ወደ ቤተ ክርስቲያን እንሄዳለን።', '', 'We go to church at night.'),
          w('ነጭ ልብስ እንለብሳለን።', '', 'We wear white clothes.'),
          w('ከቤተሰብ ጋር ዶሮ ወጥ እንበላለን።', '', 'We eat doro wat with family.'),
          w('ከገና በፊት እንጾማለን።', '', 'We fast before Christmas.'),
        ],
        dialogue: [
          say('A', 'ገናን ዲሴምበር 25 ታከብራለህ?', '', 'Do you celebrate Christmas on December 25?'),
          say('B', 'አይ፣ የኢትዮጵያ ገና ጃንዋሪ 7 ነው።', '', 'No, Ethiopian Christmas is on January 7.'),
          say('A', 'እንግዲያውስ መልካም ገና!', '', 'Merry Christmas, then!'),
        ],
        note: 'In English, “Merry Christmas” is for Christmas only. “Happy holidays” works for any holiday season.',
      },
    },
  },
  {
    id: 'timket',
    name: 'Timket',
    amharic: 'ጥምቀት',
    about: 'Epiphany',
    color: '#2b6cb0',
    date: year => fromEthiopian({ year: ethiopianYearInJanuary(year), month: 5, day: 11 }),
    greeting: {
      amharic: 'እንኳን ለብርሃነ ጥምቀቱ በሰላም አደረሳችሁ!',
      english: 'Happy Timket! Wishing you a joyful and blessed Epiphany.',
    },
    lessons: {
      amharic: {
        title: 'Timket – Epiphany',
        description: 'Greetings and words for the great Timket procession.',
        phrases: [
          w('እንኳን ለጥምቀት በዓል አደረሳችሁ!', 'enkwan le-timket beal aderesachihu!', 'Happy Timket!'),
          w('ጥምቀት', 'timket', 'Epiphany (baptism)'),
          w('ታቦት', 'tabot', 'the holy tablet carried in the procession'),
          w('ውሃ', 'wiha', 'water'),
          w('ነጭ ልብስ', 'nech libs', 'white clothes'),
          w('ሰልፍ', 'self', 'procession, parade'),
        ],
        dialogue: [
          say('A', 'ነገ ጥምቀት ለማየት እንሄዳለን?', 'nege timket lemayet enhedalen?', 'Are we going to see Timket tomorrow?'),
          say('B', 'አዎ፣ ነጭ ልብስ እለብሳለሁ።', 'awo, nech libs elebsalehu.', 'Yes, I’ll wear white.'),
          say('A', 'እንኳን አደረሰን!', 'enkwan aderesen!', 'Happy holiday to us all!'),
        ],
        note: 'Timket (Tir 11, January 19, or 20 in a leap year) celebrates the baptism of Jesus. Priests carry the tabot to water in colourful processions, and the crowd is sprinkled with blessed water.',
      },
      english: {
        title: 'Timket – Epiphany',
        description: 'Describe Timket to English-speaking friends.',
        phrases: [
          w('ጥምቀት በጥር ወር ነው።', '', 'Timket is in January.'),
          w('የኢየሱስን ጥምቀት ያከብራል።', '', 'It celebrates the baptism of Jesus.'),
          w('ትልቅ ሰልፍ አለ።', '', 'There is a big procession.'),
          w('ሰዎች ነጭ ይለብሳሉ።', '', 'People wear white.'),
          w('በሕዝቡ ላይ ውሃ ይረጫሉ።', '', 'They sprinkle water on the crowd.'),
          w('የምወደው በዓል ነው።', '', 'It’s my favorite holiday.'),
        ],
        dialogue: [
          say('A', 'በጥምቀት ሰዎች ምን ያደርጋሉ?', '', 'What do people do at Timket?'),
          say('B', 'በሰልፍ ይሄዳሉ፣ ይዘምራሉም።', '', 'They walk in a procession and sing.'),
          say('A', 'በጣም የሚያምር ይመስላል።', '', 'It sounds beautiful.'),
        ],
        note: '“It sounds …” is how English reacts to something you describe: it sounds beautiful, it sounds fun.',
      },
    },
  },
  {
    id: 'fasika',
    name: 'Fasika',
    amharic: 'ፋሲካ',
    about: 'Ethiopian Easter',
    color: '#7b4fa0',
    date: orthodoxEaster,
    greeting: {
      amharic: 'እንኳን ለብርሃነ ትንሣኤው በሰላም አደረሳችሁ! መልካም ፋሲካ!',
      english: 'Happy Easter! Wishing you a blessed Fasika with your family.',
    },
    lessons: {
      amharic: {
        title: 'Fasika – Ethiopian Easter',
        description: 'Easter greetings and the words of the feast.',
        phrases: [
          w('መልካም ፋሲካ!', 'melkam fasika!', 'Happy Easter!'),
          w('እንኳን ለትንሣኤው አደረሳችሁ!', 'enkwan le-tinsaew aderesachihu!', 'Happy Easter! (formal; “for the Resurrection”)'),
          w('ፋሲካ', 'fasika', 'Easter'),
          w('ትንሣኤ', 'tinsae', 'resurrection'),
          w('ሁዳዴ', 'hudade', 'the long fast before Easter'),
          w('ድግስ', 'digis', 'feast'),
        ],
        dialogue: [
          say('A', 'መልካም ፋሲካ!', 'melkam fasika!', 'Happy Easter!'),
          say('B', 'እንኳን አደረሰህ! ጾሙ አለቀ!', 'enkwan aderesek! tsomu allek’e!', 'Happy Easter to you! The fast is over!'),
          say('A', 'አሁን የድግስ ጊዜ ነው!', 'ahun ye-digis gize new!', 'Now it’s time to feast!'),
        ],
        note: 'Fasika follows the 55-day Hudade fast. The church service ends around 3 a.m., and families break the fast together, often with doro wet.',
      },
      english: {
        title: 'Fasika – Ethiopian Easter',
        description: 'Talk about Ethiopian Easter and the fast before it.',
        phrases: [
          w('መልካም ፋሲካ!', '', 'Happy Easter!'),
          w('ለሃምሳ አምስት ቀናት እንጾማለን።', '', 'We fast for fifty-five days.'),
          w('የቤተ ክርስቲያን ሥርዓቱ ሌሊት ያበቃል።', '', 'The church service ends at night.'),
          w('ከዚያ ጾሙን እንፈታለን።', '', 'Then we break the fast.'),
          w('መላው ቤተሰብ አብሮ ይበላል።', '', 'The whole family eats together.'),
          w('ለፋሲካ ምን ታደርጋለህ?', '', 'What are you doing for Easter?'),
        ],
        dialogue: [
          say('A', 'ለፋሲካ ምን ታደርጋለህ?', '', 'What are you doing for Easter?'),
          say('B', 'ወደ ቤተ ክርስቲያን እሄዳለሁ፣ ከዚያ ከቤተሰብ ጋር ጾሙን እንፈታለን።', '', 'I’m going to church, then we break the fast with family.'),
          say('A', 'መልካም ፋሲካ!', '', 'Happy Easter!'),
        ],
        note: 'Ethiopian Easter is often a week or more after Easter in the West, because it follows the old Julian calendar.',
      },
    },
  },
];

const DAY = 86_400_000;

/** Days from `from` to `to`, counting calendar days. */
export function daysBetween(from: Date, to: Date) {
  const a = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const b = new Date(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.round((b.getTime() - a.getTime()) / DAY);
}

/** The next time each holiday happens (today counts), soonest first. */
export function upcomingHolidays(now: Date) {
  return holidays
    .map(holiday => {
      const thisYear = holiday.date(now.getFullYear());
      const date = daysBetween(now, thisYear) >= 0 ? thisYear : holiday.date(now.getFullYear() + 1);
      return { holiday, date, days: daysBetween(now, date) };
    })
    .sort((a, b) => a.days - b.days);
}

/** Holiday season: from a week before a holiday to the day after it. */
export const SEASON_BEFORE = 7;

/** The holiday whose season it is right now, if any. */
export function currentHoliday(now: Date) {
  for (const holiday of holidays) {
    for (const year of [now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1]) {
      const date = holiday.date(year);
      const days = daysBetween(now, date);
      if (days <= SEASON_BEFORE && days >= -1) return { holiday, date, days };
    }
  }
  return null;
}

export function holidayById(id: string) {
  return holidays.find(h => h.id === id) ?? null;
}
