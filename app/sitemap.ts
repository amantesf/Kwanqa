import type { MetadataRoute } from 'next';
import { courseContent } from '@/lib/courses';
import { holidays } from '@/lib/holidays';

// Every public page, so search engines can find the lessons and holidays.
const SITE = 'https://kwanqa.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['', '/courses', '/fidel', '/abc', '/phrasebook', '/proverbs', '/holidays', '/talk', '/passport', '/about', '/approach', '/values', '/privacy', '/signup', '/login'];
  return [
    ...pages.map(path => ({ url: `${SITE}${path}`, priority: path ? 0.7 : 1 })),
    ...Object.keys(courseContent).map(slug => ({ url: `${SITE}/courses/${slug}`, priority: 0.6 })),
    ...holidays.map(h => ({ url: `${SITE}/holidays/${h.id}`, priority: 0.5 })),
  ];
}
