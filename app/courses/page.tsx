import type { Metadata } from 'next';
import { Suspense } from 'react';
import CoursesRoadmap from '@/components/CoursesRoadmap';
import { PageHero } from '@/components/sections';

export const metadata: Metadata = { title: 'Courses' };

export default function CoursesPage() {
  return (
    <main>
      <PageHero
        kicker="The Simien trail"
        title="Climb the mountain, one lesson at a time."
        lead="Pick a track and follow the trail. Each camp is a course, each stone is a lesson—Walia waits at your next step."
        pose="happy"
      />
      <section className="section roadmap-section">
        <div className="container">
          <Suspense fallback={null}>
            <CoursesRoadmap />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
