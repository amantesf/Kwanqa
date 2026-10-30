import type { MetadataRoute } from 'next';

// Search engines can read the public pages; account and email-link pages stay out.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/auth/', '/app-captcha', '/profile', '/delete-account', '/reset-password', '/unsubscribe'],
    },
    sitemap: 'https://kwanqa.com/sitemap.xml',
  };
}
