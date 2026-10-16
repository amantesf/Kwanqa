import type { Metadata } from 'next';
import ProfileView from '@/components/ProfileView';

export const metadata: Metadata = { title: 'Your profile' };

export default function ProfilePage() {
  return (
    <main className="section" style={{ paddingTop: 40 }}>
      <div className="container">
        <ProfileView />
      </div>
    </main>
  );
}
