// Talk with Walia: short spoken conversations. Walia says a line, the learner
// answers out loud, and we check what they said against the answers that fit.
// Walia is a he, so learners address him with the male forms (አንተስ, ደህና ሁን).
// Walia's own lines change with the learner: ነህ to a man, ነሽ to a woman.

export type Gender = 'm' | 'f';

export type Line = { amharic: string; transliteration: string; english: string };

type Gendered<T> = T | { m: T; f: T };

export type Answer =
  /** A phrase; close-enough matches count, so small slips don't fail the learner. */
  | { say: string }
  /** A shape with a blank, like ስሜ … ነው, for answers that include their own name or town. */
  | { pattern: RegExp };

export type Turn = {
  walia: Gendered<Line>;
  /** What the learner's answer should do, in plain English; guides Walia's brain. */
  goal: string;
  answers: Answer[];
  /** Shown when the learner asks for help, and after two misses. */
  example: Line;
  /** Common slips worth a specific tip instead of "try again". */
  mistakes?: { say: string; tip: string }[];
};

export type Conversation = {
  slug: string;
  title: string;
  amharicTitle: string;
  level: 'beginner';
  blurb: string;
  turns: Turn[];
};

export const conversations: Conversation[] = [
  {
    slug: 'hello',
    title: 'Saying hello',
    amharicTitle: 'ሰላምታ',
    level: 'beginner',
    blurb: 'Greet Walia, say how you are, and tell him your name and where you’re from.',
    turns: [
      {
        walia: { amharic: 'ሰላም!', transliteration: 'selam!', english: 'Hello!' },
        goal: 'Greet Walia back.',
        answers: [{ say: 'ሰላም' }, { say: 'ጤና ይስጥልኝ' }],
        example: { amharic: 'ሰላም!', transliteration: 'selam!', english: 'Hello!' },
      },
      {
        walia: {
          m: { amharic: 'እንዴት ነህ?', transliteration: 'indet neh?', english: 'How are you?' },
          f: { amharic: 'እንዴት ነሽ?', transliteration: 'indet nesh?', english: 'How are you?' },
        },
        goal: 'Say how they are. Asking Walia back (አንተስ?) is a bonus.',
        answers: [{ say: 'ደህና ነኝ' }, { say: 'ደህና ነኝ፣ አንተስ?' }, { say: 'ደህና ነኝ፣ እግዚአብሔር ይመስገን' }],
        example: { amharic: 'ደህና ነኝ፣ አንተስ?', transliteration: 'dehna negn, antes?', english: 'I’m fine, and you?' },
        mistakes: [{ say: 'አንቺስ', tip: 'Walia is a he, so ask አንተስ? (antes). አንቺስ? is for asking a woman.' }],
      },
      {
        walia: {
          m: { amharic: 'እኔም ደህና ነኝ። ስምህ ማን ነው?', transliteration: 'inem dehna negn. simih man new?', english: 'I’m fine too. What’s your name?' },
          f: { amharic: 'እኔም ደህና ነኝ። ስምሽ ማን ነው?', transliteration: 'inem dehna negn. simish man new?', english: 'I’m fine too. What’s your name?' },
        },
        goal: 'Tell Walia their name.',
        answers: [{ pattern: /^ስሜ.+ነው$/ }, { pattern: /^.+እባላለሁ$/ }],
        example: { amharic: 'ስሜ … ነው።', transliteration: 'sime … new.', english: 'My name is …' },
      },
      {
        walia: {
          m: { amharic: 'ደስ ብሎኛል! ከየት ነህ?', transliteration: 'des bilognal! keyet neh?', english: 'Nice to meet you! Where are you from?' },
          f: { amharic: 'ደስ ብሎኛል! ከየት ነሽ?', transliteration: 'des bilognal! keyet nesh?', english: 'Nice to meet you! Where are you from?' },
        },
        goal: 'Say where they are from (a country, city or town).',
        answers: [{ pattern: /^ከ.+(ነኝ|መጣሁ)$/ }],
        example: { amharic: 'ከአሜሪካ ነኝ።', transliteration: 'ke-america negn.', english: 'I’m from America.' },
      },
      {
        walia: {
          m: { amharic: 'አማርኛ ትናገራለህ?', transliteration: 'amarigna tinageraleh?', english: 'Do you speak Amharic?' },
          f: { amharic: 'አማርኛ ትናገሪያለሽ?', transliteration: 'amarigna tinageriyalesh?', english: 'Do you speak Amharic?' },
        },
        goal: 'Say whether they speak Amharic (yes, a little, or no are all fine).',
        answers: [
          { say: 'ትንሽ ትንሽ እናገራለሁ' },
          { say: 'አዎ፣ እናገራለሁ' },
          { say: 'ትንሽ ትንሽ' },
          { say: 'አዎ' },
          { say: 'አይ' },
          { say: 'አልናገርም' },
        ],
        example: { amharic: 'ትንሽ ትንሽ እናገራለሁ።', transliteration: 'tinish tinish inageralehu.', english: 'I speak a little.' },
      },
      {
        walia: {
          m: { amharic: 'በጣም ጥሩ! ደህና ሁን!', transliteration: 'betam tiru! dehna hun!', english: 'Very good! Goodbye!' },
          f: { amharic: 'በጣም ጥሩ! ደህና ሁኚ!', transliteration: 'betam tiru! dehna hugn!', english: 'Very good! Goodbye!' },
        },
        goal: 'Say goodbye to Walia, using the male form ደህና ሁን if they use that phrase.',
        answers: [{ say: 'ደህና ሁን' }, { say: 'ቻው' }, { say: 'በኋላ እንገናኝ' }, { say: 'ነገ እንገናኝ' }],
        example: { amharic: 'ደህና ሁን! ነገ እንገናኝ።', transliteration: 'dehna hun! nege inigenagn.', english: 'Goodbye! See you tomorrow.' },
        mistakes: [{ say: 'ደህና ሁኚ', tip: 'Walia is a he, so say ደህና ሁን (dehna hun). ደህና ሁኚ is for a woman.' }],
      },
    ],
  },
  {
    slug: 'family',
    title: 'Your family',
    amharicTitle: 'ቤተሰብ',
    level: 'beginner',
    blurb: 'Tell Walia about your brothers and sisters, your mom, and where your grandparents live.',
    turns: [
      {
        walia: {
          m: { amharic: 'ወንድም አለህ?', transliteration: 'wendim aleh?', english: 'Do you have a brother?' },
          f: { amharic: 'ወንድም አለሽ?', transliteration: 'wendim alesh?', english: 'Do you have a brother?' },
        },
        goal: 'Say whether they have a brother (or brothers).',
        answers: [
          { say: 'አዎ፣ ወንድም አለኝ' },
          { say: 'ወንድም የለኝም' },
          { pattern: /ወንድሞች.*አሉኝ/ },
          { say: 'አዎ' },
          { say: 'የለኝም' },
        ],
        example: { amharic: 'አዎ፣ አንድ ወንድም አለኝ።', transliteration: 'awo, and wendim alegn.', english: 'Yes, I have one brother.' },
      },
      {
        walia: { amharic: 'እህትስ?', transliteration: 'ihitis?', english: 'And a sister?' },
        goal: 'Say whether they have a sister (or sisters).',
        answers: [{ say: 'እህት አለኝ' }, { say: 'እህት የለኝም' }, { pattern: /እህቶች.*አሉኝ/ }, { say: 'አዎ' }, { say: 'የለኝም' }],
        example: { amharic: 'ሁለት እህቶች አሉኝ።', transliteration: 'hulet ihitoch alugn.', english: 'I have two sisters.' },
      },
      {
        walia: {
          m: { amharic: 'የእናትህ ስም ማን ነው?', transliteration: 'ye-inatih sim man new?', english: 'What’s your mom’s name?' },
          f: { amharic: 'የእናትሽ ስም ማን ነው?', transliteration: 'ye-inatish sim man new?', english: 'What’s your mom’s name?' },
        },
        goal: 'Say their mother’s name.',
        answers: [{ pattern: /^(የእናቴ ስም|ስሟ|እናቴ).+ነው$/ }],
        example: { amharic: 'የእናቴ ስም ማርታ ነው።', transliteration: 'ye-inate sim Marta new.', english: 'My mom’s name is Marta.' },
      },
      {
        walia: {
          m: { amharic: 'አያቶችህ የት ይኖራሉ?', transliteration: 'ayatochih yet yinoralu?', english: 'Where do your grandparents live?' },
          f: { amharic: 'አያቶችሽ የት ይኖራሉ?', transliteration: 'ayatochish yet yinoralu?', english: 'Where do your grandparents live?' },
        },
        goal: 'Say where their grandparents live (a city or country).',
        answers: [{ pattern: /.+(ይኖራሉ|ናቸው)$/ }],
        example: { amharic: 'አዲስ አበባ ይኖራሉ።', transliteration: 'addis abeba yinoralu.', english: 'They live in Addis Ababa.' },
      },
      {
        walia: {
          m: { amharic: 'ቤተሰብህን ትወዳለህ?', transliteration: 'beteseb-ihin tiwedaleh?', english: 'Do you love your family?' },
          f: { amharic: 'ቤተሰብሽን ትወጃለሽ?', transliteration: 'beteseb-ishin tiwejalesh?', english: 'Do you love your family?' },
        },
        goal: 'Say that they love their family.',
        answers: [{ say: 'አዎ፣ በጣም እወዳቸዋለሁ' }, { say: 'እወዳቸዋለሁ' }, { say: 'አዎ' }],
        example: { amharic: 'አዎ፣ በጣም እወዳቸዋለሁ።', transliteration: 'awo, betam iwedachewalehu.', english: 'Yes, I love them very much.' },
      },
      {
        walia: {
          m: { amharic: 'ደስ ይላል! ቤተሰብህን ሰላም በልልኝ።', transliteration: 'des yilal! beteseb-ihin selam belilign.', english: 'How lovely! Say hi to your family for me.' },
          f: { amharic: 'ደስ ይላል! ቤተሰብሽን ሰላም በይልኝ።', transliteration: 'des yilal! beteseb-ishin selam beyilign.', english: 'How lovely! Say hi to your family for me.' },
        },
        goal: 'Agree (እሺ) and say goodbye, using the male form ደህና ሁን if they use that phrase.',
        answers: [{ say: 'እሺ' }, { say: 'አመሰግናለሁ' }, { say: 'ደህና ሁን' }, { say: 'ቻው' }],
        example: { amharic: 'እሺ፣ አመሰግናለሁ! ደህና ሁን።', transliteration: 'ishi, ameseginalehu! dehna hun.', english: 'Okay, thank you! Goodbye.' },
        mistakes: [{ say: 'ደህና ሁኚ', tip: 'Walia is a he, so say ደህና ሁን (dehna hun). ደህና ሁኚ is for a woman.' }],
      },
    ],
  },
  {
    slug: 'coffee',
    title: 'Coffee with Walia',
    amharicTitle: 'ቡና',
    level: 'beginner',
    blurb: 'Walia invites you in for buna. Say thanks, take your coffee how you like it, and tell him it’s delicious.',
    turns: [
      {
        walia: {
          m: { amharic: 'እንኳን ደህና መጣህ! ግባ።', transliteration: 'inkwan dehna metah! giba.', english: 'Welcome! Come in.' },
          f: { amharic: 'እንኳን ደህና መጣሽ! ግቢ።', transliteration: 'inkwan dehna metash! gibi.', english: 'Welcome! Come in.' },
        },
        goal: 'Thank Walia for the welcome (አመሰግናለሁ, or እንኳን ደህና ቆየህ).',
        answers: [{ say: 'አመሰግናለሁ' }, { say: 'እንኳን ደህና ቆየህ' }],
        example: { amharic: 'አመሰግናለሁ!', transliteration: 'ameseginalehu!', english: 'Thank you!' },
        mistakes: [{ say: 'ቆየሽ', tip: 'Walia is a he, so say እንኳን ደህና ቆየህ (koyeh). ቆየሽ is for a woman.' }],
      },
      {
        walia: {
          m: { amharic: 'ቡና ትጠጣለህ?', transliteration: 'buna titetaleh?', english: 'Do you drink coffee?' },
          f: { amharic: 'ቡና ትጠጫለሽ?', transliteration: 'buna titechalesh?', english: 'Do you drink coffee?' },
        },
        goal: 'Say whether they drink coffee.',
        answers: [{ say: 'አዎ፣ እጠጣለሁ' }, { say: 'እጠጣለሁ' }, { say: 'አልጠጣም' }, { say: 'አዎ' }, { say: 'ትንሽ' }],
        example: { amharic: 'አዎ፣ እጠጣለሁ።', transliteration: 'awo, itetalehu.', english: 'Yes, I drink it.' },
      },
      {
        walia: {
          m: { amharic: 'ስኳር ትፈልጋለህ?', transliteration: 'sikwar tifeligaleh?', english: 'Would you like sugar?' },
          f: { amharic: 'ስኳር ትፈልጊያለሽ?', transliteration: 'sikwar tifeligiyalesh?', english: 'Would you like sugar?' },
        },
        goal: 'Say yes please (to Walia: እባክህ) or no thank you.',
        answers: [{ say: 'አዎ፣ እባክህ' }, { say: 'አይ፣ አመሰግናለሁ' }, { say: 'ትንሽ' }, { say: 'አዎ' }, { say: 'አይ' }],
        example: { amharic: 'አዎ፣ እባክህ።', transliteration: 'awo, ibakih.', english: 'Yes, please.' },
        mistakes: [{ say: 'እባክሽ', tip: 'Walia is a he, so say እባክህ (ibakih). እባክሽ is for a woman.' }],
      },
      {
        walia: { amharic: 'ቡናው እንዴት ነው?', transliteration: 'bunaw indet new?', english: 'How’s the coffee?' },
        goal: 'Say how the coffee is (delicious, good, very good).',
        answers: [{ say: 'ጣፋጭ ነው' }, { say: 'በጣም ጥሩ ነው' }, { say: 'ጥሩ ነው' }],
        example: { amharic: 'በጣም ጣፋጭ ነው!', transliteration: 'betam tafach new!', english: 'It’s delicious!' },
      },
      {
        walia: {
          m: { amharic: 'ሌላ ሲኒ ትፈልጋለህ?', transliteration: 'lela sini tifeligaleh?', english: 'Would you like another cup?' },
          f: { amharic: 'ሌላ ሲኒ ትፈልጊያለሽ?', transliteration: 'lela sini tifeligiyalesh?', english: 'Would you like another cup?' },
        },
        goal: 'Say yes, or that they’ve had enough (በቃኝ), politely.',
        answers: [{ say: 'በቃኝ፣ አመሰግናለሁ' }, { say: 'በቃኝ' }, { say: 'አዎ፣ እባክህ' }, { say: 'አዎ' }, { say: 'አይ፣ አመሰግናለሁ' }],
        example: { amharic: 'በቃኝ፣ አመሰግናለሁ።', transliteration: 'bekagn, ameseginalehu.', english: 'I’ve had enough, thank you.' },
        mistakes: [{ say: 'እባክሽ', tip: 'Walia is a he, so say እባክህ (ibakih). እባክሽ is for a woman.' }],
      },
      {
        walia: {
          m: { amharic: 'ስለመጣህ ደስ ብሎኛል!', transliteration: 'silemetah des bilognal!', english: 'I’m so glad you came!' },
          f: { amharic: 'ስለመጣሽ ደስ ብሎኛል!', transliteration: 'silemetash des bilognal!', english: 'I’m so glad you came!' },
        },
        goal: 'Thank Walia or say you’re glad too, and say goodbye (male form ደህና ሁን).',
        answers: [{ say: 'እኔም ደስ ብሎኛል' }, { say: 'አመሰግናለሁ' }, { say: 'ደህና ሁን' }, { say: 'ቻው' }],
        example: { amharic: 'እኔም ደስ ብሎኛል። ደህና ሁን!', transliteration: 'inem des bilognal. dehna hun!', english: 'I’m glad too. Goodbye!' },
        mistakes: [{ say: 'ደህና ሁኚ', tip: 'Walia is a he, so say ደህና ሁን (dehna hun). ደህና ሁኚ is for a woman.' }],
      },
    ],
  },
  {
    slug: 'market',
    title: 'At the market',
    amharicTitle: 'ገበያ',
    level: 'beginner',
    blurb: 'Walia runs a stall at the market. Ask for what you need, say how much, and haggle the price down.',
    turns: [
      {
        walia: {
          m: { amharic: 'እንኳን ደህና መጣህ! ምን ልስጥህ?', transliteration: 'inkwan dehna metah! min lisitih?', english: 'Welcome! What can I get you?' },
          f: { amharic: 'እንኳን ደህና መጣሽ! ምን ልስጥሽ?', transliteration: 'inkwan dehna metash! min lisitish?', english: 'Welcome! What can I get you?' },
        },
        goal: 'Say what they want to buy, like ሽንኩርት እፈልጋለሁ (I want onions). Any food or item is fine.',
        answers: [{ pattern: /.+እፈልጋለሁ$/ }],
        example: { amharic: 'ሽንኩርት እፈልጋለሁ።', transliteration: 'shinkurt ifeligalehu.', english: 'I want onions.' },
      },
      {
        walia: { amharic: 'ስንት ኪሎ?', transliteration: 'sint kilo?', english: 'How many kilos?' },
        goal: 'Say an amount, like ሁለት ኪሎ (two kilos).',
        answers: [{ pattern: /(አንድ|ሁለት|ሶስት|ሦስት|አራት|አምስት|ግማሽ|\d+)\s*ኪሎ/ }],
        example: { amharic: 'ሁለት ኪሎ፣ እባክህ።', transliteration: 'hulet kilo, ibakih.', english: 'Two kilos, please.' },
        mistakes: [{ say: 'እባክሽ', tip: 'Walia is a he, so say እባክህ (ibakih). እባክሽ is for a woman.' }],
      },
      {
        walia: { amharic: 'ጥሩ። ሌላ ነገር?', transliteration: 'tiru. lela neger?', english: 'Good. Anything else?' },
        goal: 'Say no, that’s all (አይ፣ በቃ), or ask for one more thing.',
        answers: [{ say: 'አይ፣ በቃ' }, { say: 'በቃ' }, { say: 'የለም' }, { pattern: /.+እፈልጋለሁ$/ }, { say: 'አይ' }],
        example: { amharic: 'አይ፣ በቃ። አመሰግናለሁ።', transliteration: 'ay, beka. ameseginalehu.', english: 'No, that’s all. Thank you.' },
      },
      {
        walia: { amharic: 'ሃምሳ ብር ነው።', transliteration: 'hamsa birr new.', english: 'That’s fifty birr.' },
        goal: 'React to the price: accept it (እሺ), or say it’s expensive and ask him to lower it (ቀንስልኝ). Haggling is normal at the market.',
        answers: [{ say: 'ውድ ነው' }, { say: 'ቀንስልኝ' }, { say: 'እሺ' }],
        example: { amharic: 'ውድ ነው! ቀንስልኝ።', transliteration: 'wid new! kenislign.', english: 'That’s expensive! Lower it for me.' },
        mistakes: [{ say: 'ቀንሺልኝ', tip: 'Walia is a he, so say ቀንስልኝ (kenislign). ቀንሺልኝ is for a woman.' }],
      },
      {
        walia: { amharic: 'እሺ፣ አርባ ብር።', transliteration: 'ishi, arba birr.', english: 'Okay, forty birr.' },
        goal: 'Agree and hand over the money (to Walia: እሺ፣ እንካ).',
        answers: [{ say: 'እሺ፣ እንካ' }, { say: 'እንካ' }, { say: 'እሺ' }, { say: 'ጥሩ' }],
        example: { amharic: 'እሺ፣ እንካ።', transliteration: 'ishi, inka.', english: 'Okay, here you go.' },
        mistakes: [{ say: 'እንኪ', tip: 'Walia is a he, so say እንካ (inka). እንኪ is for handing something to a woman.' }],
      },
      {
        walia: {
          m: { amharic: 'አመሰግናለሁ! በደህና ሂድ።', transliteration: 'ameseginalehu! bedehna hid.', english: 'Thank you! Go safely.' },
          f: { amharic: 'አመሰግናለሁ! በደህና ሂጂ።', transliteration: 'ameseginalehu! bedehna hiji.', english: 'Thank you! Go safely.' },
        },
        goal: 'Thank Walia and say goodbye (male form ደህና ሁን).',
        answers: [{ say: 'አመሰግናለሁ' }, { say: 'ደህና ሁን' }, { say: 'ቻው' }],
        example: { amharic: 'እኔም አመሰግናለሁ። ደህና ሁን!', transliteration: 'inem ameseginalehu. dehna hun!', english: 'Thank you too. Goodbye!' },
        mistakes: [{ say: 'ደህና ሁኚ', tip: 'Walia is a he, so say ደህና ሁን (dehna hun). ደህና ሁኚ is for a woman.' }],
      },
    ],
  },
];

export function waliaLine(turn: Turn, gender: Gender): Line {
  return 'm' in turn.walia ? turn.walia[gender] : turn.walia;
}

/** Every Amharic line the app may ask the speech service to read out. */
export function speakableLines(): Set<string> {
  const lines = new Set<string>();
  for (const c of conversations) {
    for (const t of c.turns) {
      for (const g of ['m', 'f'] as const) lines.add(waliaLine(t, g).amharic);
      if (!t.example.amharic.includes('…')) lines.add(t.example.amharic);
    }
  }
  return lines;
}

// --- Checking what the learner said ---------------------------------------

/** Drop punctuation and extra spaces so speech-to-text output compares cleanly. */
export function normalize(text: string) {
  return text
    .normalize('NFC')
    .replace(/[።፣፤፥፦፧፨?!.,;:'"“”‘’()\-…]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const squash = (text: string) => normalize(text).replace(/ /g, '');

/** Share of letters that would have to change to turn `heard` into `target`. */
function distance(target: string, heard: string) {
  const a = squash(target);
  const b = squash(heard);
  if (!a) return 1;
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) {
      cur.push(Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)));
    }
    prev = cur;
  }
  return prev[b.length] / a.length;
}

export type Verdict = { kind: 'right' } | { kind: 'tip'; tip: string } | { kind: 'unclear' } | { kind: 'silent' };

export function check(turn: Turn, heard: string): Verdict {
  const said = normalize(heard);
  if (!said) return { kind: 'silent' };

  // Specific slips first: "ደህና ነኝ፣ አንቺስ?" contains a right answer, but the tip matters more.
  const slip = turn.mistakes?.find(m => squash(said).includes(squash(m.say)));
  if (slip) return { kind: 'tip', tip: slip.tip };

  const ok = turn.answers.some(a =>
    'pattern' in a
      ? a.pattern.test(said)
      : squash(said).includes(squash(a.say)) || distance(a.say, said) <= 0.34,
  );
  return ok ? { kind: 'right' } : { kind: 'unclear' };
}
