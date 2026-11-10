import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import StoriesPage from '@/components/StoriesPage';
import { STORIES } from '@/lib/stories';

export function generateStaticParams() {
  return STORIES.map(s => ({ id: s.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const story = STORIES.find(s => s.id === id);
  return { title: story ? `${story.title} · Stories` : 'Stories' };
}

export default async function StoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!STORIES.some(s => s.id === id)) notFound();
  return <StoriesPage id={id} />;
}
