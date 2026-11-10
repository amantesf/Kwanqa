// Learners' own books: Amharic they bring themselves (a PDF, a text file or
// pasted text), read with the same tap-a-word reader as the stories. Books
// stay on the device in the browser's IndexedDB; nothing is uploaded, except
// the single word or sentence someone asks Walia to explain (lib/gloss.ts).

import { useEffect, useState } from 'react';

export type MyBook = {
  id: string;
  title: string;
  /** The whole text, with blank lines between paragraphs. */
  text: string;
  added: number;
  /** Which page the learner was on. */
  page?: number;
};

const DB = 'kwanqa-books';
const STORE = 'books';
const listeners = new Set<() => void>();

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: 'id' });
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function run<T>(mode: IDBTransactionMode, work: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await open();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, mode);
    const req = work(tx.objectStore(STORE));
    tx.oncomplete = () => {
      db.close();
      resolve(req.result);
    };
    tx.onerror = () => reject(tx.error);
  });
}

export async function listBooks(): Promise<MyBook[]> {
  const all = await run('readonly', s => s.getAll() as IDBRequest<MyBook[]>);
  return all.sort((a, b) => b.added - a.added);
}

export function getBook(id: string): Promise<MyBook | undefined> {
  return run('readonly', s => s.get(id) as IDBRequest<MyBook | undefined>);
}

export async function saveBook(book: MyBook) {
  await run('readwrite', s => s.put(book));
  listeners.forEach(l => l());
}

export async function deleteBook(id: string) {
  await run('readwrite', s => s.delete(id));
  listeners.forEach(l => l());
}

export function newBookId() {
  return `b${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

/** The learner's books, newest first; null while loading, [] if storage is blocked. */
export function useMyBooks(): MyBook[] | null {
  const [books, setBooks] = useState<MyBook[] | null>(null);
  useEffect(() => {
    let alive = true;
    const load = () =>
      listBooks()
        .then(b => alive && setBooks(b))
        .catch(() => alive && setBooks([]));
    load();
    listeners.add(load);
    return () => {
      alive = false;
      listeners.delete(load);
    };
  }, []);
  return books;
}

const ETHIOPIC = /[ሀ-፼]/g;

/** How much of a text is Amharic letters (0 to 1), to catch PDFs whose text can't be read. */
export function amharicShare(text: string) {
  const letters = text.replace(/[\s\d\p{P}\p{S}]/gu, '');
  if (!letters) return 0;
  return (letters.match(ETHIOPIC)?.length ?? 0) / letters.length;
}

/** Breaks a book into pages of about `size` characters, at sentence ends. */
export function bookPages(text: string, size = 900): string[] {
  const paragraphs = text
    .split(/\n\s*\n/)
    .map(p => p.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
  const pages: string[] = [];
  let page = '';
  for (const para of paragraphs) {
    // a very long paragraph is split at sentence ends
    const pieces = para.length > size ? (para.match(/[^።?!፧]+[።?!፧]*/g) ?? [para]) : [para];
    for (const piece of pieces) {
      if (page && page.length + piece.length > size) {
        pages.push(page.trim());
        page = '';
      }
      page += (page ? (pieces.length > 1 ? ' ' : '\n\n') : '') + piece.trim();
    }
  }
  if (page.trim()) pages.push(page.trim());
  return pages;
}
