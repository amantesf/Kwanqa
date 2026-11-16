// Merkato: a bargaining game after Camp 3's market lesson. At three stalls in
// Addis Ababa's big open market you ask the price, catch the number the seller
// says, say it's too expensive (to a man or a woman: ቀንስልኝ / ቀንሺልኝ), make an
// offer and say thank you. It uses the words from Camp 2 (numbers) and Camp 3
// (At the Market). A native speaker should check the lines.

export type Line = { am: string; tr: string; en: string };

export type Choice = Line & { right: boolean; /** why a wrong answer is wrong */ why?: string };

export type Offer = Line & { value: number; kind: 'low' | 'fair' | 'high' };

export type Stall = {
  seller: string;
  woman: boolean;
  item: Line & { picture: string };
  price: number;
  /** what the seller says when you ask */
  priceLine: Line;
  /** the seller's first step down after you push back */
  counter: number;
  counterLine: Line;
  /** the numbers to pick from when you hear the price */
  hear: number[];
  ask: Choice[];
  push: Choice[];
  offers: Offer[];
};

const GREETING: Line = { am: 'ሰላም! ምን ይፈልጋሉ?', tr: 'selam! min yifeligalu?', en: 'Hello! What would you like?' };
const ACCEPT: Line = { am: 'እሺ፣ ይሁን!', tr: 'ishi, yihun!', en: 'Okay, deal!' };
const REFUSE: Line = { am: 'አይ፣ አይሆንም!', tr: 'ay, ayhonim!', en: 'No, that won’t do!' };
const THANKS: Choice[] = [
  { am: 'አመሰግናለሁ!', tr: 'amesegnalehu!', en: 'Thank you!', right: true },
  { am: 'ይቅርታ!', tr: 'yiqirta!', en: 'Sorry!', right: false, why: 'ይቅርታ means sorry. You got a good price: say thank you, አመሰግናለሁ.' },
  { am: 'ውድ ነው!', tr: 'wid new!', en: 'It’s expensive!', right: false, why: 'The haggling is over! Now thank the seller: አመሰግናለሁ.' },
];
const SELLER_THANKS: Line = { am: 'እኔም አመሰግናለሁ!', tr: 'inem amesegnalehu!', en: 'Thank you too!' };

export const MERKATO = { greeting: GREETING, accept: ACCEPT, refuse: REFUSE, thanks: THANKS, sellerThanks: SELLER_THANKS };

const lower = (woman: boolean): Line =>
  woman
    ? { am: 'ውድ ነው! ቀንሺልኝ።', tr: 'wid new! qenshilign.', en: 'That’s expensive! Lower it for me.' }
    : { am: 'ውድ ነው! ቀንስልኝ።', tr: 'wid new! qenisilign.', en: 'That’s expensive! Lower it for me.' };

const offer = (value: number, word: string, tr: string, kind: Offer['kind']): Offer => ({
  value,
  kind,
  am: `${word} ብር ይሁን?`,
  tr: `${tr} birr yihun?`,
  en: `Make it ${value} birr?`,
});

export const STALLS: Stall[] = [
  {
    seller: 'Almaz',
    woman: true,
    item: { am: 'ቲማቲም', tr: 'timatim', en: 'tomatoes', picture: '/pictures/timatim.png' },
    price: 80,
    priceLine: { am: 'አንድ ኪሎ ሰማንያ ብር።', tr: 'and kilo semanya birr.', en: 'One kilo is eighty birr.' },
    counter: 70,
    counterLine: { am: 'እሺ፣ ሰባ ብር።', tr: 'ishi, seba birr.', en: 'Okay, seventy birr.' },
    hear: [80, 70, 90],
    ask: [
      { am: 'ቲማቲም ስንት ነው?', tr: 'timatim sint new?', en: 'How much are the tomatoes?', right: true },
      { am: 'ሙዝ ስንት ነው?', tr: 'muz sint new?', en: 'How much are the bananas?', right: false, why: 'ሙዝ is bananas. You want ቲማቲም, tomatoes.' },
      { am: 'ቲማቲም ውድ ነው።', tr: 'timatim wid new.', en: 'The tomatoes are expensive.', right: false, why: 'You don’t know the price yet! Ask first: ስንት ነው? means “how much is it?”' },
    ],
    push: [
      { ...lower(true), right: true },
      { ...lower(false), right: false, why: 'ቀንስልኝ is how you ask a man. Almaz is a woman, so it’s ቀንሺልኝ.' },
      { am: 'ርካሽ ነው!', tr: 'rikash new!', en: 'It’s cheap!', right: false, why: 'ርካሽ means cheap. You want to say it’s expensive: ውድ ነው.' },
    ],
    offers: [
      offer(20, 'ሃያ', 'haya', 'low'),
      offer(60, 'ስልሳ', 'silsa', 'fair'),
      offer(90, 'ዘጠና', 'zetena', 'high'),
    ],
  },
  {
    seller: 'Kebede',
    woman: false,
    item: { am: 'ሙዝ', tr: 'muz', en: 'bananas', picture: '/pictures/muz.png' },
    price: 60,
    priceLine: { am: 'አንድ ኪሎ ስልሳ ብር።', tr: 'and kilo silsa birr.', en: 'One kilo is sixty birr.' },
    counter: 50,
    counterLine: { am: 'እሺ፣ ሃምሳ ብር።', tr: 'ishi, hamsa birr.', en: 'Okay, fifty birr.' },
    hear: [16, 60, 6],
    ask: [
      { am: 'ሽንኩርት ስንት ነው?', tr: 'shinkurt sint new?', en: 'How much are the onions?', right: false, why: 'ሽንኩርት is onions. You want ሙዝ, bananas.' },
      { am: 'ሙዝ ስንት ነው?', tr: 'muz sint new?', en: 'How much are the bananas?', right: true },
      { am: 'ሙዝ ጣፋጭ ነው።', tr: 'muz tafach new.', en: 'The bananas are sweet.', right: false, why: 'Nice, but that says the bananas are sweet. Ask the price: ስንት ነው?' },
    ],
    push: [
      { ...lower(true), right: false, why: 'ቀንሺልኝ is how you ask a woman. Kebede is a man, so it’s ቀንስልኝ.' },
      { am: 'ርካሽ ነው!', tr: 'rikash new!', en: 'It’s cheap!', right: false, why: 'ርካሽ means cheap. You want to say it’s expensive: ውድ ነው.' },
      { ...lower(false), right: true },
    ],
    offers: [
      offer(40, 'አርባ', 'arba', 'fair'),
      offer(70, 'ሰባ', 'seba', 'high'),
      offer(10, 'አስር', 'asir', 'low'),
    ],
  },
  {
    seller: 'Tigist',
    woman: true,
    item: { am: 'ሽንኩርት', tr: 'shinkurt', en: 'onions', picture: '/pictures/shinkurt.png' },
    price: 50,
    priceLine: { am: 'አንድ ኪሎ ሃምሳ ብር።', tr: 'and kilo hamsa birr.', en: 'One kilo is fifty birr.' },
    counter: 45,
    counterLine: { am: 'እሺ፣ አርባ አምስት ብር።', tr: 'ishi, arba amist birr.', en: 'Okay, forty-five birr.' },
    hear: [15, 40, 50],
    ask: [
      { am: 'ሽንኩርት ስንት ነው?', tr: 'shinkurt sint new?', en: 'How much are the onions?', right: true },
      { am: 'ሽንኩርት አለ?', tr: 'shinkurt alle?', en: 'Are there onions?', right: false, why: 'The onions are right there! Ask the price: ስንት ነው?' },
      { am: 'ቲማቲም ስንት ነው?', tr: 'timatim sint new?', en: 'How much are the tomatoes?', right: false, why: 'ቲማቲም is tomatoes. You want ሽንኩርት, onions.' },
    ],
    push: [
      { am: 'ርካሽ ነው!', tr: 'rikash new!', en: 'It’s cheap!', right: false, why: 'ርካሽ means cheap. You want to say it’s expensive: ውድ ነው.' },
      { ...lower(true), right: true },
      { ...lower(false), right: false, why: 'ቀንስልኝ is how you ask a man. Tigist is a woman, so it’s ቀንሺልኝ.' },
    ],
    offers: [
      offer(5, 'አምስት', 'amist', 'low'),
      offer(60, 'ስልሳ', 'silsa', 'high'),
      offer(40, 'አርባ', 'arba', 'fair'),
    ],
  },
];

/** Every Amharic line in the game, so Walia's voice may read them (lib/amharicAudio.ts). */
export function merkatoLines(): string[] {
  const fixed = [GREETING, ACCEPT, REFUSE, SELLER_THANKS, ...THANKS];
  return [
    ...fixed.map(l => l.am),
    ...STALLS.flatMap(s => [s.item.am, s.priceLine.am, s.counterLine.am, ...s.ask.map(c => c.am), ...s.push.map(c => c.am), ...s.offers.map(o => o.am)]),
  ];
}
