'use client';

import { useRef, useState, useSyncExternalStore } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Mascot from '@/components/Mascot';
import Practice from '@/components/Practice';
import Trail from '@/components/Trail';
import { hornLevel, isDone, useClimb } from '@/lib/climb';
import type { LessonSection, Track } from '@/lib/courses';

type Props = {
  slug: string;
  track: Track;
  lessons: LessonSection[];
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
        return quiz ? (
          <button key={idx} type="button" className="phrase-card" onClick={() => reveal(idx)}>
            {body}
          </button>
        ) : (
          <div key={idx} className="phrase-card">
            {body}
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

export default function LessonViewer({ slug, track, lessons }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const requested = Number(params.get('lesson'));
  const initial =
    Number.isInteger(requested) && requested >= 0 && requested < lessons.length ? requested : 0;

  const [active, setActive] = useState(initial);
  // Opened from a trail stone (?practice=1): go straight into practice, and
  // return to the trail when the learner exits or finishes, like Duolingo.
  const [fromTrail, setFromTrail] = useState(params.get('practice') === '1');
  const [mode, setMode] = useState<'learn' | 'practice'>(fromTrail ? 'practice' : 'learn');
  const [quiz, setQuiz] = useState(false);
  const [session, setSession] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const hydrated = useHydrated();
  const climb = useClimb();
  const horns = hornLevel(climb.grass);
  const lesson = lessons[active];
  const isLast = active === lessons.length - 1;

  const trailHref = `/courses?track=${track}`;

  function goTo(index: number) {
    setFromTrail(false);
    setActive(index);
    setMode('learn');
    router.replace(`/courses/${slug}?lesson=${index}`, { scroll: false });
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
        {mode === 'practice' ? (
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
            finishLabel={isLast || fromTrail ? 'Back to the trail' : 'Next lesson'}
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
                        <span className="am">{sides(line, track).learn}</span>
                        {sides(line, track).say && <span className="tr">{sides(line, track).say}</span>}
                        <span className="en">{sides(line, track).meaning}</span>
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
