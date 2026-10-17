import type { Metadata } from 'next';
import DeleteAccount from '@/components/DeleteAccount';

export const metadata: Metadata = { title: 'Delete your account' };

export default function DeleteAccountPage() {
  return (
    <main className="auth-page">
      <DeleteAccount />
    </main>
  );
}
