import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import JsonLd from '@/components/JsonLd';
import StoriesPage from '@/components/StoriesPage';
import { LIBRARY, libraryBook } from '@/lib/library';
import { SITE, breadcrumbs, sharePreview } from '@/lib/seo';

export function generateStaticParams() {
  return LIBRARY.map(b => ({ id: b.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const book = libraryBook(id);
  if (!book) return { title: 'Library' };
  const description = `${book.title} (${book.titleEn}): a free illustrated Amharic storybook for learners, with an English translation on every page and tap-to-translate words.`;
  return { title: `${book.titleEn} · Library`, description, openGraph: sharePreview(`${book.title} · ${book.titleEn}`, description) };
}

export default async function LibraryBookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const book = libraryBook(id);
  if (!book) notFound();
  const person = (name?: string) => (name ? { '@type': 'Person', name } : undefined);
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Book',
          name: book.title,
          alternateName: book.titleEn,
          inLanguage: 'am',
          url: `${SITE}/stories/library/${book.id}`,
          author: person(book.by.written),
          illustrator: person(book.by.illustrated),
          translator: person(book.by.translated),
          image: book.cover ? `${SITE}/library/${book.cover}` : undefined,
          isAccessibleForFree: true,
          license: `https://creativecommons.org/licenses/by/${book.license}/`,
          audience: { '@type': 'EducationalAudience', educationalRole: 'student' },
        }}
      />
      <JsonLd data={breadcrumbs([['Home', '/'], ['Stories', '/stories'], [book.titleEn, `/stories/library/${book.id}`]])} />
      <StoriesPage view="library" id={id} />
    </>
  );
}
