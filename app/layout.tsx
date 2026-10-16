import './globals.css';
import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Noto_Sans_Ethiopic, Nunito } from 'next/font/google';
import AuthProvider from '@/components/AuthProvider';
import Header from '@/components/Header';
import Toaster from '@/components/Toaster';
import Footer from '@/components/Footer';

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['600', '700', '800', '900'],
  variable: '--font-nunito',
  display: 'swap',
});

const ethiopic = Noto_Sans_Ethiopic({
  subsets: ['ethiopic'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-ethiopic',
  display: 'swap',
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: 'kwanqa — The fun way to learn Amharic & English',
    template: '%s · kwanqa',
  },
  description:
    'Learn Amharic and English with bite-sized lessons, real phrases, and everyday dialogues—built for Ethiopian families and the diaspora.',
  icons: { icon: '/favicon.ico' },
  metadataBase: new URL('https://kwanqa.com'),
  openGraph: {
    type: 'website',
    siteName: 'kwanqa',
    title: 'kwanqa — The fun way to learn Amharic & English',
    description:
      'Bite-sized lessons, real phrases, and everyday dialogues—built for Ethiopian families and the diaspora.',
    images: [{ url: '/brand/walia-og.jpg', width: 1200, height: 630, alt: 'Walia the ibex on a mountain peak' }],
  },
  twitter: { card: 'summary_large_image', images: ['/brand/walia-og.jpg'] },
};

export const viewport: Viewport = {
  colorScheme: 'only light',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${nunito.variable} ${ethiopic.variable}`}>
      <body>
        <AuthProvider>
          <Header />
          {children}
          <Footer />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
