import type { Metadata } from 'next';
import ProfileView from '@/components/ProfileView';

export const metadata: Metadata = { title: 'Your profile' };

export default function ProfilePage() {
  return <ProfileView />;
}
