import Link from 'next/link';
import Flag from '@/components/Flag';
import GrassIcon from '@/components/GrassIcon';
import Mascot from '@/components/Mascot';
import { PageHero } from '@/components/sections';
import { courseCatalog, courseContent, type Track } from '@/lib/courses';

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
  { icon: <Mascot pose="cheer" size={44} />, title: 'Grow Walia’s horns', body: 'Walia’s horns grow a new ridge as you learn—just like a real ibex.' },
  { icon: <HoofIcon />, title: 'Keep your footing', body: 'Wrong answers cost stamina. Get three right in a row to win it back.' },
];

export default function CourseCatalog() {
  return (
    <>
      <PageHero
        kicker="Courses"
        title="Choose your climb up the Simien Mountains."
        lead="Short lessons, real phrases, and everyday dialogues. Answer a few quick questions and start climbing—no account needed to try it."
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

      {TRACKS.map(track => {
        const courses = courseCatalog.filter(c => c.track === track.id).sort((a, b) => a.part - b.part);
        return (
          <section key={track.id} className="section catalog-track">
            <div className="container">
              <div className="catalog-track-head">
                <Flag name={track.id === 'amharic' ? 'ethiopia' : 'usa'} className="course-flag" />
                <div>
                  <h2 className="h3" style={{ fontSize: 28 }}>
                    {track.title}
                  </h2>
                  <p className="muted">{track.blurb}</p>
                </div>
              </div>

              <div className="grid-2">
                {courses.map(course => {
                  const lessons = courseContent[course.slug]?.sections ?? [];
                  // Show a short sentence rather than a lone word, so the sample reads clearly.
                  const phrases = lessons.flatMap(l => l.phrases ?? []);
                  const sample = phrases.find(p => p.amharic.trim().includes(' ')) ?? phrases[0];
                  return (
                    <article key={course.slug} className="card catalog-card">
                      <div className="row" style={{ gap: 8 }}>
                        <span className={`badge ${track.id === 'amharic' ? 'badge-primary' : 'badge-blue'}`}>
                          Camp {course.part}
                        </span>
                        <span className="badge">{lessons.length} lessons</span>
                        {course.part === 1 && <span className="badge">Start here</span>}
                      </div>
                      <h3 className="h3">{course.title}</h3>
                      <p className="muted small">{course.description}</p>

                      {sample && (
                        <div className="catalog-sample">
                          <span className="catalog-sample-am">{sample.amharic}</span>
                          <span className="catalog-sample-tr">{sample.transliteration}</span>
                          <span className="catalog-sample-en">{sample.english}</span>
                        </div>
                      )}

                      <ol className="catalog-lessons">
                        {lessons.map(lesson => (
                          <li key={lesson.title}>{lesson.title.replace(/^Lesson \d+ – /, '')}</li>
                        ))}
                      </ol>

                      <Link href={startTrack(track.id)} className="btn btn-block">
                        Start this course
                      </Link>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })}

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
                An interactive chart of every Amharic letter and its seven vowel forms—tap any
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
