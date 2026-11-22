import type { Metadata } from 'next';
import { Suspense } from 'react';
import AuthForm from '@/components/AuthForm';

export const metadata: Metadata = {
  title: 'Log in',
  description: 'Log in to kwanqa to pick up your Amharic or English lessons, streak and progress on any device.',
};

export default function LoginPage() {
  return (
    <main className="auth-page auth-sky">
      <Suspense fallback={null}>
        <AuthForm mode="login" />
      </Suspense>
    </main>
  );
}
