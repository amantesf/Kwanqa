import type { Metadata } from 'next';

// A page's link preview (WhatsApp, iMessage, Facebook, LinkedIn …).
// Setting openGraph on a page replaces the whole default from app/layout.tsx,
// so this keeps the site name and Walia's picture on every page's preview.
export function sharePreview(title: string, description: string): Metadata['openGraph'] {
  return {
    type: 'website',
    siteName: 'kwanqa',
    title,
    description,
    images: [{ url: '/brand/walia-og.jpg', width: 1200, height: 630, alt: 'Walia the ibex on a mountain peak' }],
  };
}
