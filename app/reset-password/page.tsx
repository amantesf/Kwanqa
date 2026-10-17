import type { Metadata } from 'next';
import ResetPassword from '@/components/ResetPassword';

export const metadata: Metadata = { title: 'Choose a new password' };

export default function ResetPasswordPage() {
  return (
    <main className="auth-page">
      <ResetPassword />
    </main>
  );
}
