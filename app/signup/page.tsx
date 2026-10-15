import type { Metadata } from 'next';
import AuthForm from '@/components/AuthForm';

export const metadata: Metadata = { title: 'Create your account' };

export default function SignupPage() {
  return (
    <main className="auth-page">
      <AuthForm mode="signup" />
    </main>
  );
}
