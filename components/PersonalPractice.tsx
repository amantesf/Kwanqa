'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useSyncExternalStore } from 'react';
import Mascot from '@/components/Mascot';
import Practice from '@/components/Practice';
import { trackCourses } from '@/lib/climb';
import type { LessonSection, Track } from '@/lib/courses';
import { practiceSession, readMistakes } from '@/lib/mistakes';
import { useProfile } from '@/lib/profile';

// Your own practice: the questions you got wrong, from every camp of your
// course, brought back on a spaced schedule (1, 3, 7, then 16 days) until
// you've got them for good (lib/mistakes.ts). Opened from the trail's
// "Practise your mistakes" card.

const noopSubscribe = () => () => {};
/** False during the server render and hydration: the session is shuffled, so it's made in the browser. */
function useHydrated() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

export default function PersonalPractice({ requestedTrack }: { requestedTrack?: Track }) {
  const hydrated = useHydrated();
  const profile = useProfile();
  const track: Track = requestedTrack ?? profile?.track ?? 'amharic';
  if (!hydrated) return null;
  return <Session key={track} track={track} />;
}

function Session({ track }: { track: Track }) {
  const router = useRouter();
  // picked once: finishing a question moves it on, and the session shouldn't change under the learner
  const [session] = useState(() => practiceSession(readMistakes(), trackCourses(track).map(c => c.slug)));
  const trailHref = `/courses?track=${track}`;

  if (session.exercises.length === 0) {
    return (
      <div className="practice-empty">
        <Mascot pose="cheer" size={140} />
        <h2 className="h2">Nothing to practise right now</h2>
        <p className="muted">Questions you get wrong come back here a day later, then after 3, 7 and 16 days, until you’ve got them for good.</p>
        <Link href={trailHref} className="btn">
          Back to the trail
        </Link>
      </div>
    );
  }

  const lesson: LessonSection = {
    title: 'Practise your mistakes',
    description: '',
    note:
      track === 'english'
        ? 'ጎበዝ! እነዚህ ጥያቄዎች ቆይተው እንደገና ይመጣሉ። · Nice work! These will come back again in a few days.'
        : 'Nice work! These will come back again in a few days, a little further apart each time.',
  };
  return (
    <Practice
      slug="practice"
      lessonIndex={0}
      lesson={lesson}
      courseLessons={[]}
      onExit={() => router.push(trailHref)}
      onFinish={() => router.push(trailHref)}
      finishLabel={track === 'english' ? 'ወደ መንገዱ ተመለስ · Back to the trail' : 'Back to the trail'}
      track={track}
      review={{ ...session, practice: true }}
    />
  );
}
