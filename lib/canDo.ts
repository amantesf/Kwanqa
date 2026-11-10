// What a learner can do after each camp: "I can …" statements in the spirit of
// the CEFR can-do lists, shown in the camp's recap when it's finished (after
// the passport stamp, and from the trophy stone), with a count of what the
// camp taught. Shared by the website and the phone app.
//
// Amharic camps are written for English speakers. English camps lead with the
// Amharic, for Amharic speakers; "… እችላለሁ" (I can …) reads the same for a man
// or a woman. A native speaker should check the Amharic.

import { courseContent } from '@/lib/courses';
import { familiesFor, grammarFor } from '@/lib/grammar';

export type CanDo = { en: string; am?: string };

const CAN_DO: Record<string, CanDo[]> = {
  'amharic-beginner-1': [
    { en: 'greet people and ask how they are' },
    { en: 'say my name and where I’m from' },
    { en: 'say thank you, sorry and you’re welcome' },
    { en: 'answer yes or no, and say “I don’t understand”' },
    { en: 'say goodbye to a man, a woman or a group' },
    { en: 'speak respectfully to elders' },
  ],
  'amharic-beginner-2': [
    { en: 'count and say prices' },
    { en: 'talk about my family' },
    { en: 'ask someone to repeat or slow down' },
    { en: 'describe what people are like' },
  ],
  'amharic-beginner-3': [
    { en: 'join a coffee ceremony' },
    { en: 'order food and ask for the bill' },
    { en: 'say what I think of the food' },
    { en: 'ask prices and bargain at the market' },
    { en: 'be a good guest, and say I’m full' },
  ],
  'amharic-beginner-4': [
    { en: 'ask the way and follow directions' },
    { en: 'take a minibus taxi or a bajaj' },
    { en: 'tell the time, Ethiopian time too' },
    { en: 'name the days of the week' },
    { en: 'find the places I need in town' },
  ],
  'amharic-beginner-5': [
    { en: 'say what I did today' },
    { en: 'say how I feel' },
    { en: 'talk about what I like and don’t like' },
    { en: 'talk about my home' },
    { en: 'handle a phone call' },
  ],
  'amharic-beginner-6': [
    { en: 'speak politely to elders and strangers' },
    { en: 'name the big Ethiopian holidays' },
    { en: 'give holiday and birthday wishes, and answer them' },
    { en: 'talk about the Ethiopian calendar' },
    { en: 'finish five famous proverbs' },
  ],
  'amharic-beginner-7': [
    { en: 'name all 13 Ethiopian months' },
    { en: 'talk about last week and next week' },
    { en: 'say dates and ask about birthdays' },
    { en: 'read the Ethiopian clock' },
  ],
  'amharic-beginner-8': [
    { en: 'ask who, what, when, where and why' },
    { en: 'introduce my whole family' },
    { en: 'welcome someone and say I missed them' },
    { en: 'talk about the weather' },
    { en: 'say what hurts, and wish someone well' },
  ],
  'amharic-beginner-9': [
    { en: 'talk about colours and try on clothes' },
    { en: 'ask a shop if it has something, and pay' },
    { en: 'get medicine at a pharmacy' },
    { en: 'tell a doctor what hurts and since when' },
    { en: 'visit someone who’s sick' },
  ],
  'amharic-beginner-10': [
    { en: 'congratulate a couple at their wedding' },
    { en: 'congratulate new parents' },
    { en: 'comfort a grieving family' },
    { en: 'talk about fasting, Ramadan and Eid' },
    { en: 'give everyday blessings and wish someone a good trip' },
  ],
  'amharic-beginner-11': [
    { en: 'buy a bus ticket' },
    { en: 'book a hotel room' },
    { en: 'visit a church respectfully' },
    { en: 'ask what a place is called and what people speak there' },
    { en: 'tell someone about my trip' },
  ],
  'amharic-beginner-12': [
    { en: 'use little words like እኮ and -ማ to sound natural' },
    { en: 'react with ወይኔ!, እሰይ! and እንዴ!' },
    { en: 'read shop names and street signs' },
    { en: 'read a café or restaurant menu' },
    { en: 'read a ticket, a receipt and a holiday card' },
  ],
  'english-from-amharic-1': [
    { en: 'introduce myself and get to know someone', am: 'ራሴን ማስተዋወቅና ሰዎችን መተዋወቅ እችላለሁ' },
    { en: 'describe my daily routine', am: 'የዕለት ተዕለት ተግባሬን መግለጽ እችላለሁ' },
    { en: 'make plans with friends', am: 'ከጓደኞቼ ጋር ቀጠሮ መያዝ እችላለሁ' },
    { en: 'ask for things politely', am: 'ነገሮችን በትሕትና መጠየቅ እችላለሁ' },
  ],
  'english-from-amharic-2': [
    { en: 'talk about my job', am: 'ስለ ሥራዬ ማውራት እችላለሁ' },
    { en: 'write short emails and messages', am: 'አጭር ኢሜይልና መልዕክት መጻፍ እችላለሁ' },
    { en: 'talk with teachers and classmates', am: 'ከአስተማሪዎችና ከክፍል ጓደኞች ጋር ማውራት እችላለሁ' },
    { en: 'talk about my experience', am: 'ስለ ልምዴ መናገር እችላለሁ' },
  ],
  'english-from-amharic-3': [
    { en: 'order at a restaurant', am: 'ምግብ ቤት ውስጥ ማዘዝ እችላለሁ' },
    { en: 'say politely when something is wrong', am: 'አንድ ነገር ሲበላሽ በትሕትና መናገር እችላለሁ' },
    { en: 'shop and return things', am: 'መግዛትና ዕቃ መመለስ እችላለሁ' },
    { en: 'do simple things at the bank', am: 'ባንክ ውስጥ ቀላል ጉዳዮችን መፈጸም እችላለሁ' },
  ],
  'english-from-amharic-4': [
    { en: 'ask for directions and use transport', am: 'አቅጣጫ መጠየቅና ትራንስፖርት መጠቀም እችላለሁ' },
    { en: 'get through the airport', am: 'በአውሮፕላን ማረፊያ ጉዳዬን መፈጸም እችላለሁ' },
    { en: 'book a place to stay', am: 'የማረፊያ ቦታ መያዝ እችላለሁ' },
    { en: 'ask for help', am: 'እርዳታ መጠየቅ እችላለሁ' },
  ],
  'english-from-amharic-5': [
    { en: 'tell a doctor how I feel', am: 'ለሐኪም ስሜቴን ማስረዳት እችላለሁ' },
    { en: 'rent a home', am: 'ቤት መከራየት እችላለሁ' },
    { en: 'make appointments by phone', am: 'በስልክ ቀጠሮ መያዝ እችላለሁ' },
    { en: 'get things done at an office', am: 'ቢሮ ውስጥ ጉዳዮቼን መፈጸም እችላለሁ' },
  ],
  'english-from-amharic-6': [
    { en: 'give my opinion', am: 'ሐሳቤን መግለጽ እችላለሁ' },
    { en: 'tell a story', am: 'ታሪክ መናገር እችላለሁ' },
    { en: 'talk about my plans and dreams', am: 'ስለ ዕቅዶቼና ሕልሞቼ ማውራት እችላለሁ' },
    { en: 'sound more natural', am: 'ይበልጥ በተፈጥሮ መናገር እችላለሁ' },
    { en: 'say kind words at celebrations', am: 'በበዓላት ላይ መልካም ቃላትን መናገር እችላለሁ' },
  ],
  'english-from-amharic-7': [
    { en: 'talk about myself in a job interview', am: 'በሥራ ቃለ መጠይቅ ስለ ራሴ መናገር እችላለሁ' },
    { en: 'describe my strengths and skills', am: 'ጥንካሬዎቼንና ችሎታዎቼን መግለጽ እችላለሁ' },
    { en: 'ask about pay and accept an offer', am: 'ስለ ደመወዝ መጠየቅና የሥራ ዕድልን መቀበል እችላለሁ' },
    { en: 'get through my first day at work', am: 'የመጀመሪያ የሥራ ቀኔን በደንብ ማሳለፍ እችላለሁ' },
    { en: 'join video calls and meetings', am: 'በቪዲዮ ጥሪዎችና ስብሰባዎች መሳተፍ እችላለሁ' },
  ],
  'english-from-amharic-8': [
    { en: 'talk with my child’s school', am: 'ከልጄ ትምህርት ቤት ጋር መነጋገር እችላለሁ' },
    { en: 'make small talk with neighbours', am: 'ከጎረቤቶቼ ጋር መጨዋወት እችላለሁ' },
    { en: 'get help in an emergency', am: 'በአደጋ ጊዜ እርዳታ መጠየቅ እችላለሁ' },
    { en: 'get gas and talk about my car', am: 'ነዳጅ መቅዳትና ስለ መኪናዬ ማውራት እችላለሁ' },
    { en: 'order online and get deliveries', am: 'በኦንላይን ማዘዝና ዕቃ መቀበል እችላለሁ' },
  ],
  'english-from-amharic-9': [
    { en: 'pay bills', am: 'ሂሳቦችን መክፈል እችላለሁ' },
    { en: 'choose a phone and internet plan', am: 'የስልክና የኢንተርኔት ጥቅል መምረጥ እችላለሁ' },
    { en: 'send money home', am: 'ለቤተሰብ ገንዘብ መላክ እችላለሁ' },
    { en: 'save money and keep a budget', am: 'ገንዘብ መቆጠብና በጀት ማውጣት እችላለሁ' },
    { en: 'spot a scam', am: 'ማጭበርበርን ለይቶ ማወቅ እችላለሁ' },
  ],
};

export type CampRecap = {
  canDo: CanDo[];
  phrases: number;
  /** Grammar cards and word families (the Amharic course has them). */
  rules: number;
  families: number;
};

/** What a camp taught: its can-do statements and how much it covered. */
export function campRecap(slug: string): CampRecap {
  const lessons = courseContent[slug]?.sections ?? [];
  return {
    canDo: CAN_DO[slug] ?? [],
    phrases: lessons.reduce((n, l) => n + (l.phrases?.length ?? 0), 0),
    rules: lessons.reduce((n, _, i) => n + grammarFor(slug, i).length, 0),
    families: lessons.reduce((n, _, i) => n + familiesFor(slug, i).length, 0),
  };
}
