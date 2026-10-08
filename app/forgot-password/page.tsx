import type { Metadata } from 'next';
import ForgotPassword from '@/components/ForgotPassword';

export const metadata: Metadata = { title: 'Reset your password', robots: { index: false } };

export default function ForgotPasswordPage() {
  return (
    <main className="auth-page auth-sky">
      <ForgotPassword />
    </main>
  );
}
