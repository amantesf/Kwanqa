'use client';

import SayButton from '@/components/SayButton';
import { useRef, useState, useSyncExternalStore } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Mascot from '@/components/Mascot';
import Practice from '@/components/Practice';
import Trail from '@/components/Trail';
import { hornLevel, isDone, useClimb } from '@/lib/climb';
import { reviewSession, useMistakes } from '@/lib/mistakes';
import type { LessonSection, Track } from '@/lib/courses';

type Props = {
  slug: string;
  track: Track;
  lessons: LessonSection[];
  /** Where this lesson lives and where "back" goes; defaults to the course trail. */
  basePath?: string;
  backHref?: string;
  backLabel?: string;
};

type Phrase = NonNullable<LessonSection['phrases']>[number];

// The English course shows the English big (it's what's being learned) with the
// Amharic meaning underneath; the Amharic course does the opposite.
function sides(phrase: Phrase, track: Track) {
  return track === 'english'
    ? { learn: phrase.english, say: '', meaning: phrase.amharic }
    : { learn: phrase.amharic, say: phrase.transliteration, meaning: phrase.english };
}

function PhraseCards({ phrases, quiz, track }: { phrases: Phrase[]; quiz: boolean; track: Track }) {
  const [revealed, setRevealed] = useState<Set<number>>(new Set());

  function reveal(idx: number) {
    setRevealed(prev => new Set(prev).add(idx));
  }

  return (
    <div className="phrase-grid">
      {phrases.map((phrase, idx) => {
        const hidden = quiz && !revealed.has(idx);
        const side = sides(phrase, track);
        const body = (
          <>
            <span className="phrase-am">{side.learn}</span>
            {side.say && <span className="phrase-tr">{side.say}</span>}
            <span className={`phrase-en${hidden ? ' hidden' : ''}`}>
              {hidden ? 'Tap to reveal' : side.meaning}
            </span>
          </>
        );
        // The speaker sits beside the card, not inside it: a quiz card is itself a button.
        return (
          <div key={idx} className="phrase-card-wrap">
            {quiz ? (
              <button type="button" className="phrase-card" onClick={() => reveal(idx)}>
                {body}
              </button>
            ) : (
              <div className="phrase-card">{body}</div>
            )}
            <SayButton text={side.learn} track={track} className="say-corner" />
            {/* English course: the Amharic meaning can be heard too */}
            {track === 'english' && !hidden && (
              <SayButton text={phrase.amharic} track="amharic" className="say-corner say-am" size={15} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// True only in the browser. Practice shuffles its questions randomly, so it
// must not render on the server (the two shuffles would never match).
const noopSubscribe = () => () => {};
function useHydrated() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

export default function LessonViewer({ slug, track, lessons, basePath, backHref, backLabel = 'Back to the trail' }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const requested = Number(params.get('lesson'));
  const initial =
    Number.isInteger(requested) && requested >= 0 && requested < lessons.length ? requested : 0;

  const [active, setActive] = useState(initial);
  // Opened from a trail stone (?practice=1): go straight into practice, and
  // return to the trail when the learner exits or finishes.
  const [fromTrail, setFromTrail] = useState(params.get('practice') === '1');
  const [mode, setMode] = useState<'learn' | 'practice'>(fromTrail ? 'practice' : 'learn');
  // Opened from the review stone (?review=1): ask the camp's missed questions again.
  const wantsReview = params.get('review') === '1';
  const mistakes = useMistakes()[slug] ?? [];
  const [review, setReview] = useState<ReturnType<typeof reviewSession> | null>(null);
  // Pick the questions once, when the saved mistakes first load, and keep them
  // for the whole session (finishing clears them from storage).
  if (wantsReview && !review && mistakes.length > 0) setReview(reviewSession(mistakes));
  const [quiz, setQuiz] = useState(false);
  const [session, setSession] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const hydrated = useHydrated();
  const climb = useClimb();
  const horns = hornLevel(climb.grass);
  const lesson = lessons[active];
  const isLast = active === lessons.length - 1;

  const trailHref = backHref ?? `/courses?track=${track}`;
  const lessonPath = basePath ?? `/courses/${slug}`;

  function goTo(index: number) {
    setFromTrail(false);
    setActive(index);
    setMode('learn');
    router.replace(`${lessonPath}?lesson=${index}`, { scroll: false });
    panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function startPractice() {
    setSession(s => s + 1);
    setMode('practice');
    panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function finishLesson() {
    if (isLast || fromTrail) {
      router.push(trailHref);
    } else {
      goTo(active + 1);
    }
  }

  return (
    <div className="learn-layout">
      <nav aria-label="Lessons" className="learn-trail">
        <Trail
          hornScale={horns.scale}
          stops={lessons.map((item, i) => ({
            title: item.title,
            state: i === active ? 'current' : isDone(climb, slug, i) ? 'done' : 'todo',
            onSelect: () => goTo(i),
          }))}
        />
      </nav>

      <div ref={panelRef} className="lesson-panel">
        {wantsReview && hydrated && (review || mistakes.length > 0) ? (
          <ReviewPractice
            slug={slug}
            track={track}
            lessons={lessons}
            review={review ?? reviewSession(mistakes)}
            onDone={() => router.push(trailHref)}
          />
        ) : mode === 'practice' ? (
          !hydrated ? (
            <div className="practice practice-screen" aria-busy="true" />
          ) : (
          <Practice
            key={`${active}-${session}`}
            slug={slug}
            lessonIndex={active}
            lesson={lesson}
            courseLessons={lessons}
            onExit={() => (fromTrail ? router.push(trailHref) : setMode('learn'))}
            onFinish={finishLesson}
            finishLabel={
              track === 'english'
                ? isLast || fromTrail
                  ? backLabel === 'Back to the trail'
                    ? 'ወደ መንገዱ ተመለስ · Back to the trail'
                    : backLabel
                  : 'ቀጣዩ ትምህርት · Next lesson'
                : isLast || fromTrail
                  ? backLabel
                  : 'Next lesson'
            }
            track={track}
          />
          )
        ) : (
          <>
            <div className="lesson-head">
              <span className="kicker">
                Lesson {active + 1} of {lessons.length}
                {isDone(climb, slug, active) ? ' · Completed' : ''}
              </span>
              <h2 className="h2">{lesson.title.replace(/^Lesson \d+ – /, '')}</h2>
              <p className="lead">{lesson.description}</p>
            </div>

            {lesson.phrases && (
              <div className="stack">
                <div className="panel-title">
                  <h3 className="h3">Core phrases</h3>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={quiz}
                      onChange={e => setQuiz(e.target.checked)}
                    />
                    Quiz me
                  </label>
                </div>
                <PhraseCards key={`${active}-${quiz}`} phrases={lesson.phrases} quiz={quiz} track={track} />
              </div>
            )}

            {lesson.dialogue && (
              <div className="stack">
                <h3 className="h3">Mini‑dialogue</h3>
                <div className="dialogue">
                  {lesson.dialogue.map((line, idx) => (
                    <div key={idx} className={`dialogue-line${line.speaker === 'B' ? ' b' : ''}`}>
                      {line.speaker === 'A' ? (
                        <Mascot pose="happy" size={48} title="Walia" hornScale={horns.scale} />
                      ) : (
                        <span className="person-dot">B</span>
                      )}
                      <div className="bubble">
                        <SayButton text={sides(line, track).learn} track={track} className="say-corner" />
                        <span className="am">{sides(line, track).learn}</span>
                        {sides(line, track).say && <span className="tr">{sides(line, track).say}</span>}
                        <span className="en">
                          {sides(line, track).meaning}
                          {track === 'english' && (
                            <SayButton text={line.amharic} track="amharic" className="say-inline say-am" size={14} />
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="lesson-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => goTo(active - 1)}
                disabled={active === 0}
              >
                Back
              </button>
              <div className="row">
                <span className="faint small">Pass the practice to climb this stone</span>
                <button type="button" className="btn" onClick={startPractice}>
                  {isDone(climb, slug, active) ? 'Practice again' : 'Start practice'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/** A mistakes review: the camp's missed questions, asked again in one session. */
function ReviewPractice({
  slug,
  track,
  lessons,
  review,
  onDone,
}: {
  slug: string;
  track: Track;
  lessons: LessonSection[];
  review: ReturnType<typeof reviewSession>;
  onDone: () => void;
}) {
  const reviewLesson: LessonSection = {
    title: 'Review your mistakes',
    description: '',
    note:
      track === 'english'
        ? 'ስህተቶችህን አስተካከልክ! · You fixed your mistakes. Keep climbing!'
        : 'You fixed your mistakes. ጎበዝ! Keep climbing.',
  };
  return (
    <Practice
      key={review.keys.join('|')}
      slug={slug}
      lessonIndex={0}
      lesson={reviewLesson}
      courseLessons={lessons}
      onExit={onDone}
      onFinish={onDone}
      finishLabel={track === 'english' ? 'ወደ መንገዱ ተመለስ · Back to the trail' : 'Back to the trail'}
      track={track}
      review={review}
    />
  );
}
