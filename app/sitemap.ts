import type { MetadataRoute } from 'next';
import { courseContent } from '@/lib/courses';
import { holidays } from '@/lib/holidays';
import { LIBRARY } from '@/lib/library';
import { STORIES } from '@/lib/stories';

// Every public page, so search engines can find the lessons, stories and holidays.
const SITE = 'https://kwanqa.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['', '/courses', '/fidel', '/abc', '/phrasebook', '/proverbs', '/holidays', '/talk', '/stories', '/merkato', '/family', '/passport', '/about', '/approach', '/values', '/privacy', '/signup', '/login'];
  return [
    ...pages.map(path => ({ url: `${SITE}${path}`, priority: path ? 0.7 : 1 })),
    ...Object.keys(courseContent).map(slug => ({ url: `${SITE}/courses/${slug}`, priority: 0.6 })),
    ...holidays.map(h => ({ url: `${SITE}/holidays/${h.id}`, priority: 0.5 })),
    ...STORIES.map(story => ({ url: `${SITE}/stories/${story.id}`, priority: 0.5 })),
    ...LIBRARY.map(book => ({ url: `${SITE}/stories/library/${book.id}`, priority: 0.5 })),
  ];
}
