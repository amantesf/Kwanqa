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
  | { pattern: RegExp }
  /** Any Amharic answer of at least this many words, for open questions in harder calls. */
  | { open: number };

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

export type Level = 'beginner' | 'intermediate' | 'advanced';

export const LEVELS: { id: Level; label: string; blurb: string }[] = [
  { id: 'beginner', label: 'Beginner', blurb: 'Short questions with one right kind of answer. Start here.' },
  { id: 'intermediate', label: 'Intermediate', blurb: 'Everyday errands and the past tense. Walia says a little more.' },
  { id: 'advanced', label: 'Advanced', blurb: 'Open questions about your life and roots. Answer in full sentences.' },
];

export type Conversation = {
  slug: string;
  title: string;
  amharicTitle: string;
  level: Level;
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
  {
    slug: 'directions',
    title: 'Finding your way',
    amharicTitle: 'አቅጣጫ',
    level: 'intermediate',
    blurb: 'You’re lost in Addis. Ask Walia where a place is, follow his directions, and thank him.',
    turns: [
      {
        walia: {
          m: { amharic: 'ሰላም! ምን ልርዳህ?', transliteration: 'selam! min lirdah?', english: 'Hi! How can I help you?' },
          f: { amharic: 'ሰላም! ምን ልርዳሽ?', transliteration: 'selam! min lirdash?', english: 'Hi! How can I help you?' },
        },
        goal: 'Ask where a place is, like "ይቅርታ፣ ፖስታ ቤት የት ነው?" (Excuse me, where is the post office?). Any place is fine.',
        answers: [{ pattern: /የት ነው/ }],
        example: { amharic: 'ይቅርታ፣ ፖስታ ቤት የት ነው?', transliteration: 'yikirta, posta bet yet new?', english: 'Excuse me, where is the post office?' },
      },
      {
        walia: {
          m: { amharic: 'ቀጥታ ሂድ፣ ከዚያ ወደ ቀኝ ታጠፍ።', transliteration: 'ket’ita hid, kezia wede kegn tatef.', english: 'Go straight, then turn right.' },
          f: { amharic: 'ቀጥታ ሂጂ፣ ከዚያ ወደ ቀኝ ታጠፊ።', transliteration: 'ket’ita hiji, kezia wede kegn tatefi.', english: 'Go straight, then turn right.' },
        },
        goal: 'Repeat the directions back to check they understood: straight (ቀጥታ), then right (ወደ ቀኝ).',
        answers: [{ pattern: /ቀኝ/ }],
        example: { amharic: 'ቀጥታ፣ ከዚያ ወደ ቀኝ። እሺ።', transliteration: 'ket’ita, kezia wede kegn. ishi.', english: 'Straight, then right. Okay.' },
        mistakes: [{ say: 'ግራ', tip: 'ግራ (gra) is left. Walia said ወደ ቀኝ (wede kegn), to the right.' }],
      },
      {
        walia: {
          m: { amharic: 'በእግር ትሄዳለህ ወይስ በታክሲ?', transliteration: 'be’igir tihedaleh weyis betaksi?', english: 'Are you walking or taking a taxi?' },
          f: { amharic: 'በእግር ትሄጃለሽ ወይስ በታክሲ?', transliteration: 'be’igir tihejalesh weyis betaksi?', english: 'Are you walking or taking a taxi?' },
        },
        goal: 'Say how they’ll get there: on foot (በእግር), by taxi (በታክሲ) or bajaj (በባጃጅ).',
        answers: [{ say: 'በእግር' }, { say: 'በታክሲ' }, { say: 'በባጃጅ' }],
        example: { amharic: 'በእግር እሄዳለሁ።', transliteration: 'be’igir ihedalehu.', english: 'I’ll walk.' },
      },
      {
        walia: {
          m: { amharic: 'ጥሩ። አስር ደቂቃ ብቻ ነው። ሌላ ጥያቄ አለህ?', transliteration: 'tiru. asir dekika bicha new. lela t’iyake aleh?', english: 'Good. It’s only ten minutes. Any other questions?' },
          f: { amharic: 'ጥሩ። አስር ደቂቃ ብቻ ነው። ሌላ ጥያቄ አለሽ?', transliteration: 'tiru. asir dekika bicha new. lela t’iyake alesh?', english: 'Good. It’s only ten minutes. Any other questions?' },
        },
        goal: 'Say they have no more questions and thank him, or ask one more question.',
        answers: [{ say: 'የለኝም' }, { say: 'አመሰግናለሁ' }, { pattern: /የት ነው|ሩቅ ነው/ }, { say: 'አይ' }],
        example: { amharic: 'የለኝም፣ በጣም አመሰግናለሁ።', transliteration: 'yelegnim, betam ameseginalehu.', english: 'No, thank you very much.' },
      },
      {
        walia: {
          m: { amharic: 'ምንም አይደለም! መንገድ ላይ ተጠንቀቅ።', transliteration: 'minim aydelem! menged lay tetenkek.', english: 'No problem! Be careful on the road.' },
          f: { amharic: 'ምንም አይደለም! መንገድ ላይ ተጠንቀቂ።', transliteration: 'minim aydelem! menged lay tetenkeki.', english: 'No problem! Be careful on the road.' },
        },
        goal: 'Say okay or thanks, and goodbye (male form ደህና ሁን).',
        answers: [{ say: 'እሺ' }, { say: 'አመሰግናለሁ' }, { say: 'ደህና ሁን' }, { say: 'ቻው' }],
        example: { amharic: 'እሺ፣ አመሰግናለሁ። ደህና ሁን!', transliteration: 'ishi, ameseginalehu. dehna hun!', english: 'Okay, thanks. Goodbye!' },
        mistakes: [{ say: 'ደህና ሁኚ', tip: 'Walia is a he, so say ደህና ሁን (dehna hun). ደህና ሁኚ is for a woman.' }],
      },
    ],
  },
  {
    slug: 'weekend',
    title: 'Your weekend',
    amharicTitle: 'ቅዳሜና እሁድ',
    level: 'intermediate',
    blurb: 'Tell Walia what you did on the weekend and who with, then what you’re doing today. Practice the past tense.',
    turns: [
      {
        walia: {
          m: { amharic: 'ቅዳሜና እሁድ ምን አደረግህ?', transliteration: 'kidamena ihud min aderegih?', english: 'What did you do on the weekend?' },
          f: { amharic: 'ቅዳሜና እሁድ ምን አደረግሽ?', transliteration: 'kidamena ihud min aderegish?', english: 'What did you do on the weekend?' },
        },
        goal: 'Say one thing they did, in the past tense (like ቡና ጠጣሁ, I had coffee).',
        answers: [{ open: 2 }],
        example: { amharic: 'ከቤተሰቤ ጋር ቡና ጠጣሁ።', transliteration: 'kebeteseb-e gar buna tetahu.', english: 'I had coffee with my family.' },
      },
      {
        walia: { amharic: 'ከማን ጋር?', transliteration: 'keman gar?', english: 'With whom?' },
        goal: 'Say who they were with (ከ… ጋር), or that they were alone (ብቻዬን).',
        answers: [{ pattern: /ጋር/ }, { say: 'ብቻዬን' }],
        example: { amharic: 'ከጓደኞቼ ጋር።', transliteration: 'kegwadegnoch-e gar.', english: 'With my friends.' },
      },
      {
        walia: {
          m: { amharic: 'ደስ አለህ?', transliteration: 'des aleh?', english: 'Did you have a good time?' },
          f: { amharic: 'ደስ አለሽ?', transliteration: 'des alesh?', english: 'Did you have a good time?' },
        },
        goal: 'Say whether they enjoyed it (ደስ አለኝ).',
        answers: [{ say: 'አዎ፣ በጣም ደስ አለኝ' }, { say: 'ደስ አለኝ' }, { say: 'አዎ' }, { say: 'አይ' }],
        example: { amharic: 'አዎ፣ በጣም ደስ አለኝ።', transliteration: 'awo, betam des alegn.', english: 'Yes, I really enjoyed it.' },
      },
      {
        walia: {
          m: { amharic: 'ዛሬስ ምን ትሰራለህ?', transliteration: 'zares min tiseraleh?', english: 'And what are you doing today?' },
          f: { amharic: 'ዛሬስ ምን ትሰሪያለሽ?', transliteration: 'zares min tiseriyalesh?', english: 'And what are you doing today?' },
        },
        goal: 'Say what they are doing today, in the present or future tense.',
        answers: [{ open: 2 }],
        example: { amharic: 'ዛሬ እሰራለሁ፣ ከዚያ አማርኛ እማራለሁ።', transliteration: 'zare iseralehu, kezia amarigna imaralehu.', english: 'Today I work, then I study Amharic.' },
      },
      {
        walia: {
          m: { amharic: 'ጎበዝ! መልካም ቀን ይሁንልህ!', transliteration: 'gobez! melkam ken yihunilih!', english: 'Nice! Have a good day!' },
          f: { amharic: 'ጎበዝ! መልካም ቀን ይሁንልሽ!', transliteration: 'gobez! melkam ken yihunilish!', english: 'Nice! Have a good day!' },
        },
        goal: 'Thank him and wish him the same (to Walia: ላንተም, "you too").',
        answers: [{ say: 'አመሰግናለሁ፣ ላንተም' }, { say: 'ላንተም' }, { say: 'አመሰግናለሁ' }, { say: 'ደህና ሁን' }],
        example: { amharic: 'አመሰግናለሁ፣ ላንተም!', transliteration: 'ameseginalehu, lantem!', english: 'Thank you, you too!' },
        mistakes: [
          { say: 'ላንቺም', tip: 'Walia is a he, so say ላንተም (lantem). ላንቺም is for a woman.' },
          { say: 'ደህና ሁኚ', tip: 'Walia is a he, so say ደህና ሁን (dehna hun). ደህና ሁኚ is for a woman.' },
        ],
      },
    ],
  },
  {
    slug: 'restaurant',
    title: 'At the restaurant',
    amharicTitle: 'ምግብ ቤት',
    level: 'intermediate',
    blurb: 'Walia is your waiter. Order a dish and a drink, say how the food is, and ask for the bill.',
    turns: [
      {
        walia: {
          m: { amharic: 'እንኳን ደህና መጣህ! ምን ልታዘዝ?', transliteration: 'inkwan dehna metah! min litazez?', english: 'Welcome! What can I bring you?' },
          f: { amharic: 'እንኳን ደህና መጣሽ! ምን ልታዘዝ?', transliteration: 'inkwan dehna metash! min litazez?', english: 'Welcome! What can I bring you?' },
        },
        goal: 'Order a dish, like ሽሮ እፈልጋለሁ (I’d like shiro) or ዶሮ ወጥ፣ እባክህ.',
        answers: [{ pattern: /(እፈልጋለሁ|ስጠኝ|አምጣልኝ|እባክህ)/ }],
        example: { amharic: 'ሽሮ እፈልጋለሁ።', transliteration: 'shiro ifeligalehu.', english: 'I’d like shiro.' },
        mistakes: [{ say: 'እባክሽ', tip: 'Walia is a he, so say እባክህ (ibakih). እባክሽ is for a woman.' }],
      },
      {
        walia: { amharic: 'በእንጀራ ወይስ በዳቦ?', transliteration: 'be’injera weyis bedabo?', english: 'With injera or with bread?' },
        goal: 'Choose injera (በእንጀራ) or bread (በዳቦ).',
        answers: [{ say: 'በእንጀራ' }, { say: 'በዳቦ' }],
        example: { amharic: 'በእንጀራ፣ እባክህ።', transliteration: 'be’injera, ibakih.', english: 'With injera, please.' },
        mistakes: [{ say: 'እባክሽ', tip: 'Walia is a he, so say እባክህ (ibakih). እባክሽ is for a woman.' }],
      },
      {
        walia: {
          m: { amharic: 'ምን ትጠጣለህ?', transliteration: 'min titetaleh?', english: 'What will you drink?' },
          f: { amharic: 'ምን ትጠጫለሽ?', transliteration: 'min titechalesh?', english: 'What will you drink?' },
        },
        goal: 'Order a drink: water (ውሃ), tea (ሻይ), coffee (ቡና), a soda (ለስላሳ) or juice (ጭማቂ).',
        answers: [{ pattern: /(ውሃ|ሻይ|ቡና|ለስላሳ|ጭማቂ|ኮካ)/ }],
        example: { amharic: 'ውሃ፣ እባክህ።', transliteration: 'wuha, ibakih.', english: 'Water, please.' },
        mistakes: [{ say: 'እባክሽ', tip: 'Walia is a he, so say እባክህ (ibakih). እባክሽ is for a woman.' }],
      },
      {
        walia: { amharic: 'ምግቡ እንዴት ነው?', transliteration: 'migibu indet new?', english: 'How’s the food?' },
        goal: 'Say how the food is (delicious, very tasty, a bit spicy…).',
        answers: [{ say: 'በጣም ይጣፍጣል' }, { say: 'ጣፋጭ ነው' }, { say: 'ጥሩ ነው' }, { pattern: /ያቃጥላል|ቅመም/ }],
        example: { amharic: 'በጣም ይጣፍጣል!', transliteration: 'betam yitafital!', english: 'It’s really tasty!' },
      },
      {
        walia: {
          m: { amharic: 'ሌላ ነገር ልጨምርልህ?', transliteration: 'lela neger lichemirlih?', english: 'Can I get you anything else?' },
          f: { amharic: 'ሌላ ነገር ልጨምርልሽ?', transliteration: 'lela neger lichemirlish?', english: 'Can I get you anything else?' },
        },
        goal: 'Say that’s enough and ask for the bill (ሂሳብ፣ እባክህ).',
        answers: [{ pattern: /ሂሳብ/ }, { say: 'በቃኝ' }, { say: 'አይ፣ አመሰግናለሁ' }],
        example: { amharic: 'አይ፣ በቃኝ። ሂሳብ፣ እባክህ።', transliteration: 'ay, bekagn. hisab, ibakih.', english: 'No, I’m full. The bill, please.' },
        mistakes: [{ say: 'እባክሽ', tip: 'Walia is a he, so say እባክህ (ibakih). እባክሽ is for a woman.' }],
      },
    ],
  },
  {
    slug: 'roots',
    title: 'Your roots',
    amharicTitle: 'ትውልድ',
    level: 'advanced',
    blurb: 'Walia asks about your family’s story, why you’re learning Amharic, and what an old proverb means. Answer in full sentences.',
    turns: [
      {
        walia: {
          m: { amharic: 'ስለ ቤተሰብህ ታሪክ ንገረኝ። ወላጆችህ ከየት ናቸው?', transliteration: 'sile beteseb-ih tarik negeregn. welajochih keyet nachew?', english: 'Tell me about your family’s story. Where are your parents from?' },
          f: { amharic: 'ስለ ቤተሰብሽ ታሪክ ንገሪኝ። ወላጆችሽ ከየት ናቸው?', transliteration: 'sile beteseb-ish tarik negerign. welajochish keyet nachew?', english: 'Tell me about your family’s story. Where are your parents from?' },
        },
        goal: 'Say where their parents (or one parent) are from, in a full sentence.',
        answers: [{ open: 3 }],
        example: { amharic: 'አባቴ ከጎንደር ነው፣ እናቴ ደግሞ ከአዲስ አበባ ናት።', transliteration: 'abate kegondar new, inate degmo ke-addis abeba nat.', english: 'My dad is from Gondar, and my mom is from Addis Ababa.' },
      },
      {
        walia: {
          m: { amharic: 'ኢትዮጵያ ሄደህ ታውቃለህ?', transliteration: 'ityopya hedeh tawkaleh?', english: 'Have you ever been to Ethiopia?' },
          f: { amharic: 'ኢትዮጵያ ሄደሽ ታውቂያለሽ?', transliteration: 'ityopya hedesh tawkiyalesh?', english: 'Have you ever been to Ethiopia?' },
        },
        goal: 'Say whether they have been to Ethiopia, and ideally when or for what.',
        answers: [{ open: 2 }, { pattern: /ሄጄ/ }],
        example: { amharic: 'አዎ፣ ባለፈው ዓመት ሄጄ ነበር።', transliteration: 'awo, balefew amet heje neber.', english: 'Yes, I went last year.' },
      },
      {
        walia: {
          m: { amharic: 'አማርኛ ለምን መማር ፈለግህ?', transliteration: 'amarigna lemin memar felegih?', english: 'Why did you want to learn Amharic?' },
          f: { amharic: 'አማርኛ ለምን መማር ፈለግሽ?', transliteration: 'amarigna lemin memar felegish?', english: 'Why did you want to learn Amharic?' },
        },
        goal: 'Give a reason in a full sentence (for example, to talk with grandparents).',
        answers: [{ open: 3 }],
        example: { amharic: 'ከአያቶቼ ጋር ማውራት ስለምፈልግ ነው።', transliteration: 'ke-ayatoch-e gar mawrat silemifelig new.', english: 'Because I want to talk with my grandparents.' },
      },
      {
        walia: {
          m: { amharic: 'የምትወደው የኢትዮጵያ ምግብ ምንድን ነው?', transliteration: 'yemitiwedew ye’ityopya migib mindin new?', english: 'What’s your favorite Ethiopian food?' },
          f: { amharic: 'የምትወጂው የኢትዮጵያ ምግብ ምንድን ነው?', transliteration: 'yemitiwejiw ye’ityopya migib mindin new?', english: 'What’s your favorite Ethiopian food?' },
        },
        goal: 'Name their favorite Ethiopian food, ideally with a reason.',
        answers: [{ open: 2 }],
        example: { amharic: 'የምወደው ምግብ ዶሮ ወጥ ነው።', transliteration: 'yemiwedew migib doro wet new.', english: 'My favorite food is doro wat.' },
      },
      {
        walia: {
          m: { amharic: 'አንድ ምሳሌ ልንገርህ፦ ቀስ በቀስ እንቁላል በእግሩ ይሄዳል። ምን ማለት ይመስልሃል?', transliteration: 'and misale linigerih: kes bekes inkulal be’igru yihedal. min malet yimesilihal?', english: 'Here’s a proverb: little by little, an egg walks on its own legs. What do you think it means?' },
          f: { amharic: 'አንድ ምሳሌ ልንገርሽ፦ ቀስ በቀስ እንቁላል በእግሩ ይሄዳል። ምን ማለት ይመስልሻል?', transliteration: 'and misale linigerish: kes bekes inkulal be’igru yihedal. min malet yimesilishal?', english: 'Here’s a proverb: little by little, an egg walks on its own legs. What do you think it means?' },
        },
        goal: 'Explain what the proverb means (patience, step by step, things grow with time), in simple Amharic.',
        answers: [{ open: 2 }, { pattern: /ትዕግስት|ቀስ በቀስ/ }],
        example: { amharic: 'በትዕግስት ሁሉም ነገር ይቻላል።', transliteration: 'bet’igist hulum neger yichalal.', english: 'With patience, everything is possible.' },
      },
      {
        walia: {
          m: { amharic: 'በጣም ጎበዝ ነህ! በቅርቡ እንደገና እናውራ።', transliteration: 'betam gobez neh! bekirbu indegena inawra.', english: 'You’re really good! Let’s talk again soon.' },
          f: { amharic: 'በጣም ጎበዝ ነሽ! በቅርቡ እንደገና እናውራ።', transliteration: 'betam gobez nesh! bekirbu indegena inawra.', english: 'You’re really good! Let’s talk again soon.' },
        },
        goal: 'Agree, thank him, and say goodbye (male form ደህና ሁን).',
        answers: [{ say: 'እሺ' }, { say: 'አመሰግናለሁ' }, { say: 'በቅርቡ እንገናኝ' }, { say: 'ደህና ሁን' }],
        example: { amharic: 'እሺ፣ በቅርቡ እንገናኝ። ደህና ሁን!', transliteration: 'ishi, bekirbu inigenagn. dehna hun!', english: 'Okay, see you soon. Goodbye!' },
        mistakes: [{ say: 'ደህና ሁኚ', tip: 'Walia is a he, so say ደህና ሁን (dehna hun). ደህና ሁኚ is for a woman.' }],
      },
    ],
  },
  {
    slug: 'daily-life',
    title: 'A day in your life',
    amharicTitle: 'የዕለት ኑሮ',
    level: 'advanced',
    blurb: 'Talk about your work, your mornings (on the Ethiopian clock), your evenings, and how life abroad compares with Ethiopia.',
    turns: [
      {
        walia: {
          m: { amharic: 'ምን ትሰራለህ?', transliteration: 'min tiseraleh?', english: 'What do you do (for work or school)?' },
          f: { amharic: 'ምን ትሰሪያለሽ?', transliteration: 'min tiseriyalesh?', english: 'What do you do (for work or school)?' },
        },
        goal: 'Say what they do: their job, or that they are a student.',
        answers: [{ open: 2 }, { pattern: /ነኝ$/ }],
        example: { amharic: 'ተማሪ ነኝ።', transliteration: 'temari negn.', english: 'I’m a student.' },
      },
      {
        walia: {
          m: { amharic: 'ስራህን ትወደዋለህ?', transliteration: 'sirahin tiwedewaleh?', english: 'Do you like your work?' },
          f: { amharic: 'ስራሽን ትወጂዋለሽ?', transliteration: 'sirashin tiwejiwalesh?', english: 'Do you like your work?' },
        },
        goal: 'Say whether they like it, with a reason or a "but" (ግን).',
        answers: [{ open: 2 }],
        example: { amharic: 'አዎ፣ እወደዋለሁ፣ ግን ብዙ ስራ አለ።', transliteration: 'awo, iwedewalehu, gin bizu sira alle.', english: 'Yes, I like it, but there’s a lot of work.' },
      },
      {
        walia: {
          m: { amharic: 'ጠዋት ስንት ሰዓት ትነሳለህ?', transliteration: 't’ewat sint se’at tinesaleh?', english: 'What time do you get up in the morning?' },
          f: { amharic: 'ጠዋት ስንት ሰዓት ትነሻለሽ?', transliteration: 't’ewat sint se’at tineshalesh?', english: 'What time do you get up in the morning?' },
        },
        goal: 'Say what time they get up. Bonus for the Ethiopian clock, where 7 am is አንድ ሰዓት (one o’clock).',
        answers: [{ pattern: /ሰዓት/ }],
        example: { amharic: 'በአንድ ሰዓት እነሳለሁ።', transliteration: 'be’and se’at inesalehu.', english: 'I get up at one o’clock (7 am).' },
      },
      {
        walia: {
          m: { amharic: 'ከስራ በኋላ ምን ታደርጋለህ?', transliteration: 'kesira behwala min tadergaleh?', english: 'What do you do after work?' },
          f: { amharic: 'ከስራ በኋላ ምን ታደርጊያለሽ?', transliteration: 'kesira behwala min tadergiyalesh?', english: 'What do you do after work?' },
        },
        goal: 'Describe their evening, ideally two things joined with ከዚያ (then).',
        answers: [{ open: 3 }],
        example: { amharic: 'ቤተሰቤን እደውላለሁ፣ ከዚያ ፊልም አያለሁ።', transliteration: 'beteseben-e idewilalehu, kezia film ayalehu.', english: 'I call my family, then I watch a movie.' },
      },
      {
        walia: { amharic: 'ኑሮ በውጭ አገርና በኢትዮጵያ እንዴት ይለያያል?', transliteration: 'nuro bewich agerna be’ityopya indet yilayayal?', english: 'How is life abroad different from life in Ethiopia?' },
        goal: 'Give an opinion comparing life abroad and in Ethiopia, in a full sentence (ግን, "but", helps).',
        answers: [{ open: 4 }],
        example: { amharic: 'እዚህ ሁሉም ይቸኩላል፣ በኢትዮጵያ ግን ለሰው ጊዜ አለ።', transliteration: 'izih hulum yichekulal, be’ityopya gin lesew gize alle.', english: 'Here everyone rushes, but in Ethiopia there’s time for people.' },
      },
      {
        walia: {
          m: { amharic: 'ጥሩ ውይይት ነበር! ደህና ሁን።', transliteration: 'tiru wuyiyit neber! dehna hun.', english: 'That was a great conversation! Goodbye.' },
          f: { amharic: 'ጥሩ ውይይት ነበር! ደህና ሁኚ።', transliteration: 'tiru wuyiyit neber! dehna hugn.', english: 'That was a great conversation! Goodbye.' },
        },
        goal: 'Thank him and say goodbye (male form ደህና ሁን).',
        answers: [{ say: 'አመሰግናለሁ' }, { say: 'ደህና ሁን' }, { say: 'ቻው' }, { say: 'እኔም' }],
        example: { amharic: 'እኔም ደስ ብሎኛል። ደህና ሁን!', transliteration: 'inem des bilognal. dehna hun!', english: 'I enjoyed it too. Goodbye!' },
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
    'open' in a
      ? said.split(' ').filter(w => /[\u1200-\u137F]/.test(w)).length >= a.open
      : 'pattern' in a
        ? a.pattern.test(said)
        : squash(said).includes(squash(a.say)) || distance(a.say, said) <= 0.34,
  );
  return ok ? { kind: 'right' } : { kind: 'unclear' };
}
