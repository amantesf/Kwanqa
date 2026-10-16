'use client';

// The climb streak: how many days in a row the learner has finished a lesson.
// Shown as a mountain in the top bar; opens a weekly view like a streak calendar.

import { useEffect, useRef, useState } from 'react';
import { climbStreak, type DayWork } from '@/lib/climb';

function MountainIcon({ size, lit }: { size: number; lit: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path d="M2 20 L9 8 L13 14 L16 10 L22 20 Z" fill={lit ? 'var(--primary)' : '#d6d0ca'} />
      <path d="M9 8 L11 11.5 L9.8 11 L8.3 12 Z" fill="#fff" />
      <path d="M16 10 L17.6 12.7 L16.5 12.3 L15.4 13.2 Z" fill="#fff" opacity={lit ? 1 : 0.8} />
    </svg>
  );
}

function Check() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path d="M5 12.5 L10 17 L19 7.5" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

const GOAL = 7;
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function minutes(seconds: number) {
  if (seconds <= 0) return '0';
  return seconds < 60 ? '<1' : String(Math.round(seconds / 60));
}

export default function ClimbStreak({
  days,
  log,
  altitude,
}: {
  days: string[];
  log: Record<string, DayWork>;
  altitude: number;
}) {
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const { count, doneToday, week } = climbStreak(days);
  const today = week.find((d) => d.today);
  const selectedIndex = Math.max(0, week.findIndex((d) => d.key === (picked ?? today?.key)));
  const selected = week[selectedIndex];
  const work = log[selected.key];
  const dayName = selected.today ? 'Today' : DAY_NAMES[selectedIndex];
  const accuracy = work && work.answers > 0 ? Math.round((work.correct / work.answers) * 100) : 0;

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const subtitle =
    count === 0
      ? 'Finish a lesson today to start a new climb!'
      : doneToday
        ? 'You climbed today. Come back tomorrow to keep going!'
        : 'Finish a lesson today to keep your climb going!';
  const goalDone = Math.min(count, GOAL);

  return (
    <div className="climb-streak" ref={ref}>
      <button
        type="button"
        className={`top-stat streak-btn${doneToday ? ' lit' : ''}`}
        aria-expanded={open}
        aria-label={`${count} day climb streak`}
        onClick={() => {
          setOpen((o) => !o);
          setPicked(null);
        }}
      >
        <MountainIcon size={26} lit={doneToday} />
        {count}
      </button>

      {open && (
        <div className="streak-pop" role="dialog" aria-label="Your climb streak">
          <div className="streak-head">
            <div>
              <p className="streak-title">
                {count} day climb
              </p>
              <p className="streak-sub">{subtitle}</p>
            </div>
            <MountainIcon size={84} lit={doneToday} />
          </div>

          <ol className="streak-week">
            {week.map((d, i) => (
              <li
                key={d.key}
                className={`streak-day${d.active ? ' active' : ''}${d.today ? ' today' : ''}${d.future ? ' future' : ''}${i === selectedIndex ? ' picked' : ''}`}
              >
                <button
                  type="button"
                  disabled={d.future}
                  aria-pressed={i === selectedIndex}
                  aria-label={`${d.today ? 'Today' : DAY_NAMES[i]}${d.active ? ', climbed' : ''}`}
                  onClick={() => setPicked(d.key)}
                >
                  <span className="streak-day-label">{d.label}</span>
                  <span className="streak-dot">{d.active && <Check />}</span>
                </button>
              </li>
            ))}
          </ol>

          <div className="streak-log" aria-live="polite">
            <p className="streak-log-title">{dayName}</p>
            {work && work.lessons > 0 ? (
              <dl className="streak-log-stats">
                <div>
                  <dt>Lessons</dt>
                  <dd>{work.lessons}</dd>
                </div>
                <div>
                  <dt>Answers</dt>
                  <dd>{work.answers}</dd>
                </div>
                <div>
                  <dt>Correct</dt>
                  <dd>{accuracy}%</dd>
                </div>
                <div>
                  <dt>Minutes</dt>
                  <dd>{minutes(work.seconds)}</dd>
                </div>
              </dl>
            ) : (
              <p className="streak-log-empty">
                {selected.today ? 'No lessons finished yet today.' : 'No lessons finished this day.'}
              </p>
            )}
          </div>

          <div className="streak-goal">
            <div className="streak-goal-row">
              <span>7 day climb</span>
              <span>
                {goalDone}/{GOAL}
              </span>
            </div>
            <div className="streak-bar">
              <span style={{ width: `${(goalDone / GOAL) * 100}%` }} />
            </div>
          </div>

          <p className="streak-alt">
            Trail altitude: <strong>{altitude.toLocaleString()} m</strong>
          </p>
        </div>
      )}
    </div>
  );
}
