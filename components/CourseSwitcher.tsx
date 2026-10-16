'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Flag from '@/components/Flag';
import type { Track } from '@/lib/courses';
import { switchTrack, useProfile } from '@/lib/profile';

const COURSES: { id: Track; name: string; sub: string }[] = [
  { id: 'amharic', name: 'Amharic', sub: 'Explained in English' },
  { id: 'english', name: 'English', sub: 'Explained in Amharic' },
];

const flagFor = (track: Track) => (track === 'amharic' ? 'ethiopia' : 'usa');

// Shows the flag of the course being learned. Tapping it opens "My courses",
// where learners deliberately switch to, or add, another course.
export default function CourseSwitcher({ track }: { track: Track }) {
  const router = useRouter();
  const pathname = usePathname();
  const profile = useProfile();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const mine = profile?.tracks ?? [track];
  const myCourses = COURSES.filter(c => mine.includes(c.id));
  const others = COURSES.filter(c => !mine.includes(c.id));
  const current = COURSES.find(c => c.id === track)!;

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === 'Escape' : !ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', close);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', close);
    };
  }, [open]);

  function choose(id: Track) {
    setOpen(false);
    if (id === track) return;
    switchTrack(id);
    router.replace(`${pathname}?track=${id}`, { scroll: false });
  }

  return (
    <div className="course-switcher" ref={ref}>
      <button
        type="button"
        className="course-switcher-btn"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        title={`Learning ${current.name} · change course`}
      >
        <Flag name={flagFor(track)} className="track-flag-img" />
        <span className="sr-only">Learning {current.name}. Open my courses.</span>
      </button>

      {open && (
        <div className="course-menu" role="menu">
          <div className="course-menu-title">My courses</div>
          {myCourses.map(c => (
            <button
              key={c.id}
              type="button"
              role="menuitemradio"
              aria-checked={c.id === track}
              className={`course-menu-item${c.id === track ? ' on' : ''}`}
              onClick={() => choose(c.id)}
            >
              <Flag name={flagFor(c.id)} className="course-menu-flag" />
              <span className="course-menu-text">
                <strong>{c.name}</strong>
                <small>{c.sub}</small>
              </span>
              {c.id === track && <span className="course-menu-check">✓</span>}
            </button>
          ))}

          {others.length > 0 && (
            <>
              <div className="course-menu-title">Add a new course</div>
              {others.map(c => (
                <button key={c.id} type="button" role="menuitem" className="course-menu-item" onClick={() => choose(c.id)}>
                  <Flag name={flagFor(c.id)} className="course-menu-flag" />
                  <span className="course-menu-text">
                    <strong>{c.name}</strong>
                    <small>{c.sub}</small>
                  </span>
                  <span className="course-menu-add">+</span>
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
