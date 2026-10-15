import './globals.css';
import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Noto_Sans_Ethiopic, Nunito } from 'next/font/google';
import AuthProvider from '@/components/AuthProvider';
import Header from '@/components/Header';
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
        </AuthProvider>
      </body>
    </html>
  );
}
