import type { Metadata } from 'next';
import ForgotPassword from '@/components/ForgotPassword';

export const metadata: Metadata = { title: 'Reset your password' };

export default function ForgotPasswordPage() {
  return (
    <main className="auth-page">
      <ForgotPassword />
    </main>
  );
}
