import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import JsonLd from '@/components/JsonLd';
import StoriesPage from '@/components/StoriesPage';
import { ORGANIZATION, SITE, breadcrumbs, sharePreview } from '@/lib/seo';
import { STORIES } from '@/lib/stories';

export function generateStaticParams() {
  return STORIES.map(s => ({ id: s.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const story = STORIES.find(s => s.id === id);
  if (!story) return { title: 'Stories' };
  const description = `${story.amharicTitle} (${story.title}): ${story.blurb} A short Amharic story with the meaning and transliteration of every word.`;
  return { title: `${story.title} · Stories`, description, openGraph: sharePreview(`${story.amharicTitle} · ${story.title}`, description) };
}

export default async function StoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const story = STORIES.find(s => s.id === id);
  if (!story) notFound();
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ShortStory',
          name: story.amharicTitle,
          alternateName: story.title,
          description: story.blurb,
          inLanguage: 'am',
          url: `${SITE}/stories/${story.id}`,
          isAccessibleForFree: true,
          author: ORGANIZATION,
        }}
      />
      <JsonLd data={breadcrumbs([['Home', '/'], ['Stories', '/stories'], [story.title, `/stories/${story.id}`]])} />
      <StoriesPage view="story" id={id} />
    </>
  );
}
