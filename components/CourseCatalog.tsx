'use client';

import { useState } from 'react';
import Link from 'next/link';
import Flag from '@/components/Flag';
import SayButton from '@/components/SayButton';
import GrassIcon from '@/components/GrassIcon';
import Mascot from '@/components/Mascot';
import { PageHero } from '@/components/sections';
import { courseCatalog, courseContent, type Track } from '@/lib/courses';
import { zoneForCamp } from '@/lib/climb';

// What logged-out visitors see at /courses: what kwanqa offers, and a way in.
// Once they log in, /courses shows the learn dashboard instead.

const TRACKS: { id: Track; title: string; blurb: string }[] = [
  {
    id: 'amharic',
    title: 'Learn Amharic',
    blurb: 'For heritage learners and newcomers. Explanations in English.',
  },
  {
    id: 'english',
    title: 'Learn English',
    blurb: 'For Amharic speakers. Explanations in Amharic.',
  },
];

const startTrack = (track: Track) => `/welcome?track=${track}`;

/** "Amharic Camp 3 – Buna & Food" → "Buna & Food"; the summit camp is marked separately. */
function campName(title: string) {
  return title
    .replace(/^(Amharic|English) Camp \d+ – /, '')
    .replace(/^Amharic for Absolute Beginners – Part (\d)/, 'Absolute Beginners, Part $1')
    .replace(/^The Summit: /, '');
}

/** One course as a climb: a stone per camp up the trail, from the foothills to the summit. */
function TrackTrail({ track }: { track: Track }) {
  const courses = courseCatalog.filter(c => c.track === track).sort((a, b) => a.part - b.part);
  return (
    <ol className="climb-list">
      {courses.map((course, idx) => {
        const lessons = courseContent[course.slug]?.sections ?? [];
        // A short sentence reads better than a lone word as the camp's taste.
        const phrases = lessons.flatMap(l => l.phrases ?? []).filter(p => !p.amharic.includes('...'));
        const sample = phrases.find(p => p.amharic.trim().includes(' ')) ?? phrases[0];
        const zone = zoneForCamp(idx, courses.length);
        const summit = idx === courses.length - 1;
        const said = sample ? (track === 'english' ? sample.english : sample.amharic) : '';
        return (
          <li key={course.slug} className={`climb-camp tone-${zone.tone}${summit ? ' is-summit' : ''}`}>
            <span className="climb-stone" aria-hidden>
              {summit ? (
                <svg width="22" height="22" viewBox="0 0 24 24">
                  <path d="M6 21V3" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                  <path d="M7 4h11l-3 4 3 4H7z" fill="currentColor" />
                </svg>
              ) : (
                course.part
              )}
            </span>
            <article className="climb-card">
              <div className="climb-card-top">
                <span className="climb-zone">
                  Camp {course.part} · {zone.name} · {zone.from.toLocaleString()}–{zone.to.toLocaleString()} m
                </span>
                {course.part === 1 && <span className="badge badge-primary">Start here</span>}
                {summit && <span className="badge climb-summit-badge">Summit</span>}
              </div>
              <h3 className="climb-title">{campName(course.title)}</h3>
              <p className="muted small">{course.description}</p>

              {sample && (
                <div className="climb-sample">
                  <SayButton text={said} track={track} className="climb-say" />
                  <div>
                    <span className="climb-sample-line" lang={track === 'english' ? 'en' : 'am'}>
                      {said}
                    </span>
                    {track === 'amharic' && <span className="climb-sample-tr">{sample.transliteration}</span>}
                    <span className="climb-sample-meaning">{track === 'english' ? sample.amharic : sample.english}</span>
                  </div>
                </div>
              )}

              <ul className="climb-lessons" aria-label={`${lessons.length} lessons`}>
                {lessons.map((lesson, i) => (
                  <li key={lesson.title}>
                    <span>{i + 1}</span>
                    {lesson.title.replace(/^Lesson \d+ – /, '')}
                  </li>
                ))}
              </ul>
            </article>
          </li>
        );
      })}
    </ol>
  );
}

function StoneIcon() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden>
      <ellipse cx="22" cy="27" rx="18" ry="12" fill="var(--primary-shadow)" />
      <ellipse cx="22" cy="23" rx="18" ry="12" fill="var(--primary)" />
      <path d="M22 16 L24 21 L29 21 L25 24 L26.5 29 L22 26 L17.5 29 L19 24 L15 21 L20 21 Z" fill="#fff" />
    </svg>
  );
}

function HoofIcon() {
  return (
    <svg width="44" height="44" viewBox="0 0 24 24" aria-hidden>
      <path d="M11 4 C 6 4, 4 9, 4.5 15 C 5 19, 7.5 21, 10 20 C 11.2 19.5, 11.2 17, 11 14 Z" fill="#6b4a2b" />
      <path d="M13 4 C 18 4, 20 9, 19.5 15 C 19 19, 16.5 21, 14 20 C 12.8 19.5, 12.8 17, 13 14 Z" fill="#6b4a2b" />
    </svg>
  );
}

const HOW_IT_WORKS = [
  { icon: <StoneIcon />, title: 'Climb stone by stone', body: 'Each stone on the trail is a bite-sized lesson. Each camp is a course.' },
  { icon: <GrassIcon size={44} />, title: 'Earn grass', body: 'Finish lessons to collect ሳር (grass) and keep Walia well fed.' },
  { icon: <Mascot pose="cheer" size={44} />, title: 'Grow Walia’s horns', body: 'Walia’s horns grow a new ridge as you learn, just like a real ibex.' },
  { icon: <HoofIcon />, title: 'Keep your footing', body: 'Wrong answers cost stamina. Get three right in a row to win it back.' },
];

export default function CourseCatalog() {
  const [track, setTrack] = useState<Track>('amharic');
  return (
    <>
      <PageHero
        kicker="Courses"
        title="Choose your climb up the Simien Mountains."
        lead="Short lessons, real phrases, and everyday dialogues. Answer a few quick questions and start climbing. No account needed to try it."
        pose="wave"
      >
        <div className="row">
          <Link href="/welcome" className="btn">
            Get started
          </Link>
          <Link href="/login?next=%2Fcourses" className="btn btn-secondary">
            Log in
          </Link>
        </div>
      </PageHero>

      <section className="section catalog-climb">
        <div className="container">
          <div className="section-head center">
            <span className="kicker">Pick your language</span>
            <h2 className="h2">Every camp is a course. Every stone is a lesson.</h2>
          </div>
          <div className="climb-tabs" role="tablist" aria-label="Courses">
            {TRACKS.map(t => {
              const camps = courseCatalog.filter(c => c.track === t.id);
              const lessons = camps.reduce((n, c) => n + (courseContent[c.slug]?.sections.length ?? 0), 0);
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={track === t.id}
                  className={`climb-tab${track === t.id ? ' active' : ''}`}
                  onClick={() => setTrack(t.id)}
                >
                  <Flag name={t.id === 'amharic' ? 'ethiopia' : 'usa'} className="climb-tab-flag" />
                  <span>
                    <strong>{t.title}</strong>
                    <small>
                      {camps.length} camps · {lessons} lessons
                    </small>
                  </span>
                </button>
              );
            })}
          </div>
          <p className="muted climb-blurb">{TRACKS.find(t => t.id === track)?.blurb}</p>

          <TrackTrail key={track} track={track} />

          <div className="climb-cta">
            <Mascot pose="cheer" size={72} />
            <div>
              <strong>Start at Camp 1, or skip ahead.</strong>
              <span className="muted small">
                Tell us what you already know and we’ll start you at the right camp, with lessons
                as easy or as challenging as you need.
              </span>
            </div>
            <Link href={startTrack(track)} className="btn">
              {track === 'english' ? 'Start learning English' : 'Start learning Amharic'}
            </Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <Link href="/fidel" className="card card-link fidel-promo">
            <div className="fidel-promo-letters" aria-hidden>
              <span>ሀ</span>
              <span>ለ</span>
              <span>መ</span>
              <span>ሰ</span>
            </div>
            <div>
              <span className="kicker">Free resource</span>
              <h2 className="h3" style={{ fontSize: 24 }}>
                Learn to read ፊደል, the Ge’ez alphabet
              </h2>
              <p className="muted small">
                An interactive chart of every Amharic letter and its seven vowel forms. Tap any
                letter to see how it’s built.
              </p>
            </div>
            <span className="link">Open the alphabet →</span>
          </Link>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <div className="section-head center">
            <span className="kicker">How the climb works</span>
            <h2 className="h2">Learning that feels like a game</h2>
          </div>
          <div className="grid-3 catalog-how">
            {HOW_IT_WORKS.map(item => (
              <div key={item.title} className="card catalog-how-card">
                <div className="catalog-how-icon">{item.icon}</div>
                <h3 className="h3">{item.title}</h3>
                <p className="muted small">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container catalog-soon">
          <span className="kicker">Coming soon</span>
          <div className="row" style={{ justifyContent: 'center' }}>
            <span className="badge">Afaan Oromo</span>
            <span className="badge">Tigrinya</span>
          </div>
          <h2 className="h2">Ready to start the climb?</h2>
          <div className="row" style={{ justifyContent: 'center' }}>
            <Link href="/welcome" className="btn">
              Get started
            </Link>
            <Link href="/login?next=%2Fcourses" className="btn btn-secondary">
              I already have an account
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
