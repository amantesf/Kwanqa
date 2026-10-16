'use client';

import { useAuth } from '@/components/AuthProvider';
import CourseCatalog from '@/components/CourseCatalog';
import CoursesRoadmap from '@/components/CoursesRoadmap';
import Mascot from '@/components/Mascot';

// /courses shows the course catalog to visitors and the learn dashboard to
// learners. Without Supabase keys (accounts off) the dashboard stays open.
export default function CoursesView() {
  const { enabled, loading, user } = useAuth();

  if (enabled && loading) {
    return (
      <main className="auth-page">
        <div className="gate">
          <Mascot pose="happy" size={100} />
          <p className="muted">Getting your trail ready…</p>
        </div>
      </main>
    );
  }

  if (enabled && !user) {
    return (
      <main>
        <CourseCatalog />
      </main>
    );
  }

  return (
    <main className="learn-page">
      <h1 className="sr-only">Your Simien trail</h1>
      <CoursesRoadmap />
    </main>
  );
}
