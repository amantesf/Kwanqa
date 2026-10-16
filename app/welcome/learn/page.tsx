import type { Metadata } from 'next';
import Link from 'next/link';
import LanguagePicker from '@/components/LanguagePicker';
import Logo from '@/components/Logo';

export const metadata: Metadata = { title: 'I want to learn…' };

// Step two of getting started: pick a language course.
export default function ChooseLanguagePage() {
  return (
    <main className="welcome-page">
      <header className="welcome-top">
        <Logo />
      </header>

      <section className="choose">
        <h1>I want to learn…</h1>
        <LanguagePicker />
        <Link href="/welcome" className="choose-back">
          ← Back
        </Link>
      </section>
    </main>
  );
}
