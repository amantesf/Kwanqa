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
  return { title: book ? `${book.titleEn} · Library` : 'Library' };
}

export default async function LibraryBookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!libraryBook(id)) notFound();
  return <StoriesPage view="library" id={id} />;
}
