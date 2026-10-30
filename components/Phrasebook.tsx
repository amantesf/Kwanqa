'use client';

import SayButton from '@/components/SayButton';
import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Mascot from '@/components/Mascot';
import MountainScene from '@/components/MountainScene';
import { nextLesson, startCamp, trackCourses, useClimb } from '@/lib/climb';
import { courseContent, type Track } from '@/lib/courses';
import { useProfile } from '@/lib/profile';

// A guide to a whole camp: every lesson's key
// phrases and dialogue on one page. It opens on the camp the learner is
// currently climbing (or the camp named in ?camp=, from a camp banner).
export default function Phrasebook() {
  const params = useSearchParams();
  const climb = useClimb();
  const profile = useProfile();
  const [quiz, setQuiz] = useState(false);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  const param = params.get('track');
  const track: Track = profile?.track ?? (param === 'english' || param === 'amharic' ? param : 'amharic');
  const english = track === 'english'; // English first, with the Amharic meaning underneath
  const courses = trackCourses(track);
  const next = nextLesson(climb, track, startCamp(track, profile?.levels[track]));
  const asked = params.get('camp');
  const camp =
    courses.find(c => c.slug === asked) ??
    courses.find(c => c.slug === next?.slug) ??
    courses[courses.length - 1];
  const campIdx = courses.indexOf(camp);
  const course = courseContent[camp.slug];

  function toggleQuiz(on: boolean) {
    setQuiz(on);
    setRevealed(new Set());
  }

  function reveal(key: string) {
    setRevealed(prev => new Set(prev).add(key));
  }

  return (
    <div className="phrasebook">
      <Link href={`/courses?track=${track}`} className="back-link">
        ← Back to the trail
      </Link>

      <div className={`camp-banner${campIdx % 2 === 1 ? ' alt' : ''}`}>
        <MountainScene className="camp-art" variant="light" />
        <div className="camp-banner-text">
          <span className="kicker">
            Phrasebook · Camp {campIdx + 1} · Part {camp.part}
          </span>
          <h2>{course.title}</h2>
          <p>{camp.description}</p>
        </div>
      </div>

      <div className="phrasebook-bar">
        <div className="phrasebook-intro">
          <Mascot pose="happy" size={56} />
          <p className="small">
            {english
              ? 'Every phrase from this camp in one place. Say each one out loud in English, then check the Amharic meaning.'
              : 'Every phrase from this camp in one place. Say each one out loud, and use the transliteration as a bridge, not a crutch.'}
          </p>
        </div>
        <label className="toggle">
          <input type="checkbox" checked={quiz} onChange={e => toggleQuiz(e.target.checked)} />
          Quiz me
        </label>
      </div>

      {course.sections.map((lesson, li) => (
        <section key={lesson.title} className="phrasebook-lesson">
          <div className="phrasebook-lesson-head">
            <span className="phrasebook-num">{li + 1}</span>
            <div>
              <h3 className="h3">{lesson.title.replace(/^Lesson \d+ – /, '')}</h3>
              <p className="muted small">{lesson.description}</p>
              {lesson.note && <p className="lesson-note-inline small">💡 {lesson.note}</p>}
            </div>
          </div>

          {lesson.phrases && (
            <div className="phrasebook-list">
              {lesson.phrases.map((phrase, pi) => {
                const key = `${li}-${pi}`;
                const hidden = quiz && !revealed.has(key);
                return (
                  <div key={key} className="phrasebook-row-wrap">
                  <button
                    type="button"
                    className="phrasebook-row"
                    onClick={() => reveal(key)}
                    disabled={!quiz}
                  >
                    <span className="phrasebook-am">{english ? phrase.english : phrase.amharic}</span>
                    {!english && <span className="phrasebook-tr">{phrase.transliteration}</span>}
                    <span className={`phrasebook-en${hidden ? ' hidden' : ''}`}>
                      {hidden ? 'Tap to reveal' : english ? phrase.amharic : phrase.english}
                    </span>
                  </button>
                  <SayButton text={english ? phrase.english : phrase.amharic} track={track} className="say-corner" />
                  {english && !hidden && (
                    <SayButton text={phrase.amharic} track="amharic" className="say-corner say-am say-am-row" size={15} />
                  )}
                  </div>
                );
              })}
            </div>
          )}

          {lesson.dialogue && (
            <div className="phrasebook-dialogue">
              <span className="phrasebook-label">Dialogue</span>
              {lesson.dialogue.map((line, di) => (
                <div key={di} className={`phrasebook-line${line.speaker === 'B' ? ' b' : ''}`}>
                  <span className="phrasebook-speaker">{line.speaker}</span>
                  <div className="phrasebook-line-text">
                    <SayButton text={english ? line.english : line.amharic} track={track} className="say-corner" />
                    <div className="phrasebook-am small-am">{english ? line.english : line.amharic}</div>
                    {!english && <div className="phrasebook-tr">{line.transliteration}</div>}
                    <div className="phrasebook-en">
                      {english ? line.amharic : line.english}
                      {english && <SayButton text={line.amharic} track="amharic" className="say-inline say-am" size={14} />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Link href={`/courses/${camp.slug}?lesson=${li}`} className="link">
            Practice this lesson →
          </Link>
        </section>
      ))}
    </div>
  );
}
