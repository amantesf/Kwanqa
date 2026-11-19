import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import StoriesPage from '@/components/StoriesPage';
import { LIBRARY, libraryBook } from '@/lib/library';

export function generateStaticParams() {
  return LIBRARY.map(b => ({ id: b.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const book = libraryBook(id);
  if (!book) return { title: 'Library' };
  const description = `${book.title} (${book.titleEn}): a free illustrated Amharic storybook for learners, with an English translation on every page and tap-to-translate words.`;
  return { title: `${book.titleEn} · Library`, description, openGraph: { title: `${book.title} · ${book.titleEn}`, description } };
}

export default async function LibraryBookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!libraryBook(id)) notFound();
  return <StoriesPage view="library" id={id} />;
}
