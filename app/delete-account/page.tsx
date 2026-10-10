import type { Metadata } from 'next';
import DeleteAccount from '@/components/DeleteAccount';

export const metadata: Metadata = {
  title: 'Delete your account',
  description: 'How to delete your kwanqa account and everything saved with it, from the app or the website.',
};

export default function DeleteAccountPage() {
  return (
    <main className="auth-page">
      <DeleteAccount />
    </main>
  );
}
