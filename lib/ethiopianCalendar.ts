// The Ethiopian calendar: 12 months of 30 days, then Pagume (5 days, or 6 in a
// leap year). The year starts on Meskerem 1 (September 11 or 12) and is 7–8
// years behind the Gregorian year. Dates convert through the Julian Day Number.

export type EthiopianDate = { year: number; month: number; day: number };

const EPOCH = 1723856; // Julian Day Number offset of the Ethiopian (Amete Mihret) era

export const MONTHS: { amharic: string; name: string }[] = [
  { amharic: 'መስከረም', name: 'Meskerem' },
  { amharic: 'ጥቅምት', name: 'Tikimt' },
  { amharic: 'ኅዳር', name: 'Hidar' },
  { amharic: 'ታኅሣሥ', name: 'Tahsas' },
  { amharic: 'ጥር', name: 'Tir' },
  { amharic: 'የካቲት', name: 'Yekatit' },
  { amharic: 'መጋቢት', name: 'Megabit' },
  { amharic: 'ሚያዝያ', name: 'Miyazya' },
  { amharic: 'ግንቦት', name: 'Ginbot' },
  { amharic: 'ሰኔ', name: 'Sene' },
  { amharic: 'ሐምሌ', name: 'Hamle' },
  { amharic: 'ነሐሴ', name: 'Nehase' },
  { amharic: 'ጳጉሜ', name: 'Pagume' },
];

export const WEEKDAYS = ['እሑድ', 'ሰኞ', 'ማክሰኞ', 'ረቡዕ', 'ሐሙስ', 'ዓርብ', 'ቅዳሜ'];

function gregorianToJdn(year: number, month: number, day: number) {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

function jdnToGregorian(jdn: number) {
  const a = jdn + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor((146097 * b) / 4);
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);
  const day = e - Math.floor((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * Math.floor(m / 10);
  const year = 100 * b + d - 4800 + Math.floor(m / 10);
  return { year, month, day };
}

function jdnToEthiopian(jdn: number): EthiopianDate {
  const r = (jdn - EPOCH) % 1461;
  const n = (r % 365) + 365 * Math.floor(r / 1460);
  return {
    year: 4 * Math.floor((jdn - EPOCH) / 1461) + Math.floor(r / 365) - Math.floor(r / 1460),
    month: Math.floor(n / 30) + 1,
    day: (n % 30) + 1,
  };
}

function ethiopianToJdn({ year, month, day }: EthiopianDate) {
  return EPOCH + 365 + 365 * (year - 1) + Math.floor(year / 4) + 30 * month + day - 31;
}

/** The Ethiopian date of a calendar day (uses the date's local year, month and day). */
export function toEthiopian(date: Date): EthiopianDate {
  return jdnToEthiopian(gregorianToJdn(date.getFullYear(), date.getMonth() + 1, date.getDate()));
}

/** The calendar day (local midnight) for an Ethiopian date. */
export function fromEthiopian(date: EthiopianDate): Date {
  const g = jdnToGregorian(ethiopianToJdn(date));
  return new Date(g.year, g.month - 1, g.day);
}

const ONES = ['', '፩', '፪', '፫', '፬', '፭', '፮', '፯', '፰', '፱'];
const TENS = ['', '፲', '፳', '፴', '፵', '፶', '፷', '፸', '፹', '፺'];

/** A number in Ge'ez numerals, e.g. 2019 → ፳፻፲፱. */
export function geezNumber(value: number): string {
  if (!Number.isInteger(value) || value <= 0) return String(value);
  // Split into pairs of digits from the right; ፻ (100) and ፼ (10,000) join them.
  const pairs: number[] = [];
  for (let n = value; n > 0; n = Math.floor(n / 100)) pairs.push(n % 100);
  let out = '';
  for (let i = pairs.length - 1; i >= 0; i--) {
    const pair = pairs[i];
    const separator = i === 0 ? '' : i % 2 === 1 ? '፻' : '፼';
    // A lone 1 before ፻ or ፼ is left out (100 is ፻, not ፩፻).
    const digits = pair === 1 && separator && i === pairs.length - 1 ? '' : TENS[Math.floor(pair / 10)] + ONES[pair % 10];
    if (pair === 0 && separator === '፻') continue;
    out += digits + separator;
  }
  return out;
}

/** e.g. { amharic: 'ጥቅምት ፰ ፳፻፲፱', latin: 'Tikimt 8, 2019' } */
export function formatEthiopian(date: EthiopianDate) {
  const month = MONTHS[date.month - 1];
  return {
    amharic: `${month.amharic} ${geezNumber(date.day)} ${geezNumber(date.year)}`,
    latin: `${month.name} ${date.day}, ${date.year}`,
  };
}
