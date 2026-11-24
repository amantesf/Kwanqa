import type { MetadataRoute } from 'next';

// "Add to Home Screen" on a phone: kwanqa opens like an app, with Walia's icon.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'kwanqa',
    short_name: 'kwanqa',
    description: 'The fun way to learn Amharic and English.',
    lang: 'en',
    dir: 'ltr',
    categories: ['education', 'kids'],
    id: '/',
    start_url: '/courses',
    scope: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    shortcuts: [
      { name: 'Lessons', short_name: 'Lessons', url: '/courses', icons: [{ src: '/icon.png', sizes: '512x512' }] },
      { name: 'Talk with Walia', short_name: 'Talk', url: '/talk', icons: [{ src: '/icon.png', sizes: '512x512' }] },
      { name: 'Stories', short_name: 'Stories', url: '/stories', icons: [{ src: '/icon.png', sizes: '512x512' }] },
      { name: 'ፊደል', short_name: 'ፊደል', url: '/fidel', icons: [{ src: '/icon.png', sizes: '512x512' }] },
    ],
    icons: [
      { src: '/icon.png', sizes: '512x512', type: 'image/png' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  };
}
