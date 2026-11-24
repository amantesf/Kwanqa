import type { Metadata } from 'next';

export const SITE = 'https://kwanqa.com';

// A page's link preview (WhatsApp, iMessage, Facebook, LinkedIn …).
// Setting openGraph on a page replaces the whole default from app/layout.tsx,
// so this keeps the site name and Walia's picture on every page's preview.
/** The organization behind every page, for structured data. */
export const ORGANIZATION = {
  '@type': 'Organization',
  name: 'kwanqa',
  url: SITE,
  logo: `${SITE}/icon.png`,
  email: 'kwanqa.team@gmail.com',
};

/** A "Home › Section › Page" trail for search results. */
export function breadcrumbs(trail: [name: string, path: string][]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map(([name, path], i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
      item: `${SITE}${path}`,
    })),
  };
}

export function sharePreview(title: string, description: string): Metadata['openGraph'] {
  return {
    type: 'website',
    siteName: 'kwanqa',
    title,
    description,
    images: [{ url: '/brand/walia-og.jpg', width: 1200, height: 630, alt: 'Walia the ibex on a mountain peak' }],
  };
}
