import type { Metadata } from 'next';
import { Suspense } from 'react';
import AuthForm from '@/components/AuthForm';

export const metadata: Metadata = {
  title: 'Create your account',
  description: 'Create a free kwanqa account to save your progress, keep your streak and learn Amharic or English on any device.',
};

export default function SignupPage() {
  return (
    <main className="auth-page auth-sky">
      <Suspense fallback={null}>
        <AuthForm mode="signup" />
      </Suspense>
    </main>
  );
}
