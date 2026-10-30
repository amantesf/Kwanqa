import type { MetadataRoute } from 'next';

// "Add to Home Screen" on a phone: kwanqa opens like an app, with Walia's icon.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'kwanqa',
    short_name: 'kwanqa',
    description: 'The fun way to learn Amharic and English.',
    start_url: '/courses',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    icons: [
      { src: '/icon.png', sizes: '512x512', type: 'image/png' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  };
}
