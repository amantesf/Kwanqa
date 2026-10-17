'use client';

// The climb streak: how many days in a row the learner has finished a lesson.
// Shown as a mountain in the top bar; opens a weekly view like a streak calendar.

import Image from 'next/image';
import Link from 'next/link';
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

/** The big mountain in the popover header: sun, snowy peak and a waving flag once you've climbed. */
function PeakScene({ lit, started }: { lit: boolean; started: boolean }) {
  return (
    <svg className="streak-peak" width="104" height="92" viewBox="0 0 104 92" aria-hidden>
      <circle className="streak-peak-sun" cx="76" cy="26" r="16" fill={lit ? '#ffd166' : '#ffffff'} opacity={lit ? 1 : 0.35} />
      <path d="M44 88 L72 46 L102 88 Z" fill={lit ? '#f0a27c' : 'rgba(255,255,255,0.35)'} />
      <path d="M2 88 L40 26 L80 88 Z" fill={lit ? '#fff3ea' : 'rgba(255,255,255,0.7)'} />
      <path d="M40 26 L80 88 L52 88 L44 60 Z" fill={lit ? '#f6d5c2' : 'rgba(255,255,255,0.45)'} />
      <path d="M40 26 L50 42 L45 40 L40 46 L35 40 L30 42 Z" fill="#fff" />
      {started && (
        <g>
          <line x1="40" y1="27" x2="40" y2="6" stroke={lit ? '#5c3a24' : '#fff'} strokeWidth="2.6" strokeLinecap="round" />
          <path className="streak-peak-flag" d="M41 6 L58 11 L41 17 Z" fill={lit ? '#ffc233' : '#fff'} />
        </g>
      )}
    </svg>
  );
}

function Lock() {
  return (
    <svg width="44" height="44" viewBox="0 0 24 24" aria-hidden>
      <path d="M7.5 10V7.5a4.5 4.5 0 0 1 9 0V10" fill="none" stroke="#c4bbb3" strokeWidth="2.6" strokeLinecap="round" />
      <rect x="4.5" y="10" width="15" height="11" rx="3" fill="#c4bbb3" />
      <circle cx="12" cy="15.5" r="1.8" fill="#fff" />
    </svg>
  );
}

function Medal() {
  return (
    <svg width="44" height="44" viewBox="0 0 24 24" aria-hidden>
      <path d="M8 2 L11 9 L7 9 L4 2 Z" fill="#d2582e" />
      <path d="M16 2 L13 9 L17 9 L20 2 Z" fill="#1f5bd0" />
      <circle cx="12" cy="15" r="7" fill="#ffc233" stroke="#e0a000" strokeWidth="1.6" />
      <path d="M8.5 17.5 L11 13 L12.5 15.3 L13.6 14 L15.5 17.5 Z" fill="#fff" />
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
  const [copied, setCopied] = useState(false);
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
  const inClub = count >= GOAL;

  async function invite() {
    const url = 'https://kwanqa.vercel.app';
    const text = 'Climb the Simien Mountains with me and learn Amharic on Kwanqa!';
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Kwanqa', text, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // the learner closed the share sheet; nothing to do
    }
  }

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
        <div
          className={`streak-pop${doneToday ? ' lit' : ''}`}
          role="dialog"
          aria-label="Your climb streak"
        >
          <div className="streak-hero">
            <div className="streak-head">
              <div>
                <p className="streak-title">{count} day climb</p>
                <p className="streak-sub">{subtitle}</p>
              </div>
              <PeakScene lit={doneToday} started={count > 0} />
            </div>

            <ol className="streak-week">
              {week.map((d, i) => (
                <li
                  key={d.key}
                  className={`streak-day${d.active ? ' active' : ''}${d.today ? ' today' : ''}${d.future ? ' future' : ''}${i === selectedIndex ? ' picked' : ''}`}
                  style={{ animationDelay: `${0.05 + i * 0.04}s` }}
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
          </div>

          <div className="streak-body">
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

            <div className="streak-friends">
              <div className="streak-friends-walia">
                <Image src="/brand/walia.png" alt="" width={435} height={581} />
              </div>
              <div className="streak-friends-text">
                <p className="streak-card-title">Climb together</p>
                <p className="streak-card-sub">Bring a friend up the mountain with you.</p>
                <button type="button" className="streak-friends-btn" onClick={invite}>
                  {copied ? 'Link copied!' : 'Invite a friend'}
                </button>
              </div>
            </div>

            <div className={`streak-club${inClub ? ' unlocked' : ''}`}>
              <div className="streak-club-icon">{inClub ? <Medal /> : <Lock />}</div>
              <div className="streak-club-text">
                <p className="streak-card-title">Summit Club</p>
                <p className="streak-card-sub">
                  {inClub
                    ? 'You made it! Keep climbing every day to stay in the club.'
                    : `Reach a ${GOAL} day climb to join the Summit Club.`}
                </p>
                <div className="streak-goal-row">
                  <div className="streak-bar">
                    <span style={{ width: `${(goalDone / GOAL) * 100}%` }} />
                  </div>
                  <span>
                    {goalDone}/{GOAL}
                  </span>
                </div>
              </div>
            </div>

            <Link href="/profile" className="streak-more" onClick={() => setOpen(false)}>
              View profile
            </Link>

            <p className="streak-alt">
              Trail altitude: <strong>{altitude.toLocaleString()} m</strong>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
