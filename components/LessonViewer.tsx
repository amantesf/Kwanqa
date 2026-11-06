'use client';

import SayButton from '@/components/SayButton';
import { Fragment, useRef, useState, useSyncExternalStore } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Mascot from '@/components/Mascot';
import Practice from '@/components/Practice';
import Trail from '@/components/Trail';
import { hornLevel, isDone, useClimb } from '@/lib/climb';
import { reviewSession, useMistakes } from '@/lib/mistakes';
import type { LessonSection, Track } from '@/lib/courses';
import { familiesFor, grammarFor, wordsOf, type GrammarCard, type WordFamily } from '@/lib/grammar';
import { pictureFor } from '@/lib/pictures';

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

/**
 * An Amharic line with its words tappable: a word we know the pieces of shows
 * them underneath (ስምህ → səmm-əh, name-your).
 */
function BrokenDownLine({ text }: { text: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const words = wordsOf(text);
  const shown = open !== null ? words[open]?.parts : null;
  return (
    <>
      <span className="phrase-am">
        {words.map((w, i) => (
          <Fragment key={i}>
            {i > 0 && ' '}
            {w.parts ? (
              <button
                type="button"
                className={`word-tap${open === i ? ' open' : ''}`}
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                aria-label={`${w.word}: show its parts`}
              >
                {w.word}
              </button>
            ) : (
              w.word
            )}
          </Fragment>
        ))}
      </span>
      {shown && (
        <span className="word-parts" aria-live="polite">
          {shown.map((part, i) => (
            <span key={i} className="word-part">
              <b>{part.roman}</b>
              <small>{part.gloss}</small>
            </span>
          ))}
        </span>
      )}
    </>
  );
}

/** Splits "መንገድ ላይ menged lay" into its Amharic words and how they're said. */
function splitCell(text: string) {
  const words = text.split(' ');
  const amharic = words.findIndex(w => !/[ሀ-፿]/.test(w));
  const cut = amharic === -1 ? words.length : amharic;
  return { amharic: words.slice(0, cut).join(' '), roman: words.slice(cut).join(' ') };
}

/** A table cell like "ስሜ səme": the Amharic, with how it's said underneath. */
function TableCell({ text }: { text: string }) {
  const { amharic, roman } = splitCell(text);
  if (!amharic || !roman) return <>{text}</>;
  return (
    <>
      <span lang="am">{amharic}</span>
      <small>{roman}</small>
    </>
  );
}

/** Words built from the same consonants: learn one, guess the rest. */
function FamilyCard({ family }: { family: WordFamily }) {
  return (
    <section className="grammar-card family-card">
      <h4>
        Word family: <span lang="am">{family.word}</span> <small>{family.roman}</small>
      </h4>
      <p>
        These words share the consonants <b>{family.root}</b>, from “{family.meaning}”. Know one, and you can guess the others.
      </p>
      <ul className="family-members">
        {family.members.map(m => (
          <li key={m.amharic}>
            <span lang="am">{m.amharic}</span>
            <small>{m.transliteration}</small>
            <em>{m.english}</em>
          </li>
        ))}
      </ul>
      {family.tip && <p className="grammar-tip">{family.tip}</p>}
    </section>
  );
}

/** "How it works": the lesson's grammar rules, then its word families. */
function GrammarCards({ cards, families }: { cards: GrammarCard[]; families: WordFamily[] }) {
  return (
    <div className="stack">
      <h3 className="h3">How it works</h3>
      {cards.map(card => (
        <section key={card.title} className="grammar-card">
          <h4>{card.title}</h4>
          <p>{card.rule}</p>
          {card.table && (
            <table className="grammar-table">
              <thead>
                <tr>
                  {card.table[0].map((cell, i) => (
                    <th key={i}>
                      <TableCell text={cell} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {card.table.slice(1).map((row, r) => (
                  <tr key={r}>
                    {row.map((cell, i) =>
                      i === 0 ? (
                        <th key={i}>{cell}</th>
                      ) : (
                        <td key={i}>
                          <TableCell text={cell} />
                        </td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <ul className="grammar-examples">
            {card.examples.map(ex => (
              <li key={ex.amharic}>
                <span lang="am">{ex.amharic}</span>
                <small>
                  {ex.transliteration} · {ex.english}
                </small>
              </li>
            ))}
          </ul>
          {card.tip && <p className="grammar-tip">{card.tip}</p>}
        </section>
      ))}
      {families.map(family => (
        <FamilyCard key={family.word} family={family} />
      ))}
    </div>
  );
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
        const picture = pictureFor(phrase.amharic.replace(/[።፣፤፥፦፧?!.,]/g, '').trim());
        const body = (
          <>
            {picture && (
              // in the quiz the picture would give the meaning away, so it's blurred until revealed
              // eslint-disable-next-line @next/next/no-img-element -- small local pictures
              <img className={`phrase-picture${hidden ? ' hidden' : ''}`} src={picture.src} alt="" />
            )}
            {/* Amharic words can be tapped to see their parts (not in the quiz: the card is one button) */}
            {track === 'amharic' && !quiz ? <BrokenDownLine text={side.learn} /> : <span className="phrase-am">{side.learn}</span>}
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

            {track === 'amharic' && grammarFor(slug, active).length + familiesFor(slug, active).length > 0 && (
              <GrammarCards cards={grammarFor(slug, active)} families={familiesFor(slug, active)} />
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
