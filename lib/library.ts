// The Library: 29 illustrated Amharic storybooks from Global Storybooks
// (globalstorybooks.net), first published by the African Storybook
// (africanstorybook.org). Each is licensed CC BY 3.0 or 4.0, which lets
// kwanqa share and adapt them, also commercially, as long as the authors,
// illustrators and translators are credited and the licence is linked (the
// reader shows that on every story). Books licensed "NonCommercial" were left
// out on purpose, since kwanqa will charge.
//
// lib/library.json holds the Amharic text of each page, its English from the
// same storybook in English, and the page's picture (public/library/<id>/).
// A native speaker should still check the texts.

import data from '@/lib/library.json';

export type LibraryPage = { text: string; en: string; img: string | null };

export type LibraryBook = {
  id: string;
  title: string;
  titleEn: string;
  /** Global Storybooks level, 1 (first words) to 5 (longer stories). */
  level: number;
  by: { written?: string; illustrated?: string; translated?: string };
  /** CC BY version: "3.0" or "4.0". */
  license: string;
  /** The book on African Storybook. */
  source: string | null;
  cover: string | null;
  pages: LibraryPage[];
};

export const LIBRARY = data as LibraryBook[];

export const LEVEL_NAMES = ['', 'First words', 'First sentences', 'Short stories', 'Longer stories', 'Big stories'];

export function libraryBook(id: string) {
  return LIBRARY.find(b => b.id === id);
}

export function licenseUrl(book: LibraryBook) {
  return `https://creativecommons.org/licenses/by/${book.license}/`;
}

/** Splits Amharic text into sentences, keeping each one's ending (። ? ! ፧). */
export function splitSentences(text: string): string[] {
  const parts = (text.match(/[^።?!፧]+[።?!፧]*/g) ?? []).map(s => s.trim()).filter(Boolean);
  // a closing quote mark (›› ” ») left on its own belongs to the sentence before it
  const out: string[] = [];
  for (const part of parts) {
    const tail = part.match(/^[›»”"’]+/)?.[0];
    if (tail && out.length) {
      out[out.length - 1] += tail;
      const rest = part.slice(tail.length).trim();
      if (rest) out.push(rest);
    } else out.push(part);
  }
  return out.filter(s => /[ሀ-፼]/.test(s));
}

/** Every sentence and word in the library, for the speak route's list of lines anyone may hear. */
export function libraryLines(): string[] {
  const lines: string[] = [];
  for (const book of LIBRARY) {
    lines.push(book.title);
    for (const page of book.pages) {
      for (const sentence of splitSentences(page.text)) {
        lines.push(sentence);
        for (const w of sentence.split(/\s+/)) {
          const word = cleanWord(w);
          if (word) lines.push(word);
        }
      }
    }
  }
  return lines;
}

const EDGE = /^[\s“”"'‘’«»‹›().,:;!?።፣፤፥፦፧፡-]+|[\s“”"'‘’«»‹›().,:;!?።፣፤፥፦፧፡-]+$/g;

/** A word without the punctuation and quote marks around it. */
export function cleanWord(token: string) {
  return token.replace(EDGE, '');
}
