'use client';

import Link from 'next/link';
import GrassIcon from '@/components/GrassIcon';
import Mascot from '@/components/Mascot';

export type StoneState = 'done' | 'current' | 'todo' | 'locked';

export type TrailStop = {
  title: string;
  state: StoneState;
  /** 'reward' draws a mesob basket instead of a lesson stone. */
  kind?: 'lesson' | 'reward' | 'trophy';
  /** Lesson number shown on the stone (defaults to its position). */
  number?: number;
  href?: string;
  onSelect?: () => void;
};

const WIDTH = 340;
const ROW = 124;
const STONE_Y = 44; // stone centre within its row
// Horizontal offsets that make the trail wind back and forth up the mountain.
const WIND = [0, 70, 96, 70, 0, -70, -96, -70];

function offsetAt(i: number) {
  return WIND[i % WIND.length];
}

function StarIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.6l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z" />
    </svg>
  );
}

function TrophyIcon({ won }: { won: boolean }) {
  const cup = won ? '#ffc233' : 'currentColor';
  return (
    <svg width="34" height="34" viewBox="0 0 32 32" aria-hidden>
      <path d="M9 4h14v7a7 7 0 0 1-14 0z" fill={cup} />
      <path d="M9 7H4.5a4.5 4.5 0 0 0 4.8 5.6M23 7h4.5a4.5 4.5 0 0 1-4.8 5.6" fill="none" stroke={cup} strokeWidth="2.6" strokeLinecap="round" />
      <rect x="14" y="17" width="4" height="6" fill={cup} />
      <rect x="9.5" y="23" width="13" height="5" rx="2" fill={cup} />
      {won && <path d="M13 7.5h2.5v6" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none" opacity=".7" />}
    </svg>
  );
}

/** A woven mesob basket, full of grass once you reach it. */
function MesobIcon({ open }: { open: boolean }) {
  return (
    <svg width="58" height="58" viewBox="0 0 64 64" aria-hidden>
      {open && (
        <>
          <path d="M18 30 C 19 20, 22 15, 21 8 C 25 15, 26 22, 26 30 Z" fill="#5fb84a" />
          <path d="M26 30 C 28 19, 30 12, 32 5 C 34 12, 36 19, 38 30 Z" fill="#4fa83c" />
          <path d="M38 30 C 38 22, 40 15, 45 9 C 43 17, 44 23, 46 30 Z" fill="#6cc455" />
        </>
      )}
      <path d="M10 30 H54 L48 52 Q32 58 16 52 Z" fill={open ? '#e0a000' : '#d4d4d4'} />
      <path d="M12 36 H52 M14 43 H50" stroke={open ? '#ffc233' : '#e5e5e5'} strokeWidth="4" strokeLinecap="round" />
      <path d="M20 31 L23 52 M32 31 V56 M44 31 L41 52" stroke={open ? '#b07c00' : '#bdbdbd'} strokeWidth="2.5" strokeLinecap="round" />
      <rect x="7" y="25" width="50" height="8" rx="4" fill={open ? '#ffc233' : '#e5e5e5'} />
      {!open && <path d="M9 27 Q32 18 55 27" stroke="#bdbdbd" strokeWidth="3" fill="none" />}
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

/**
 * A winding trail of lesson stones. The trail climbs bottom-up: the first stop
 * sits at the bottom and later stops rise above it.
 */
export default function Trail({
  stops,
  hornScale = 1,
  waliaSize = 74,
}: {
  stops: TrailStop[];
  hornScale?: number;
  waliaSize?: number;
}) {
  const height = stops.length * ROW;
  const rowOf = (i: number) => stops.length - 1 - i;
  const point = (i: number) => ({
    x: WIDTH / 2 + offsetAt(i),
    y: rowOf(i) * ROW + STONE_Y,
  });

  let path = '';
  stops.forEach((_, i) => {
    const { x, y } = point(i);
    if (i === 0) {
      path = `M ${x} ${y}`;
    } else {
      const prev = point(i - 1);
      path += ` C ${prev.x} ${prev.y - ROW / 2}, ${x} ${y + ROW / 2}, ${x} ${y}`;
    }
  });

  return (
    <div className="trail" style={{ width: WIDTH, height }}>
      <svg className="trail-line" width={WIDTH} height={height} aria-hidden>
        <path d={path} />
      </svg>

      {stops.map((stop, i) => {
        const offset = offsetAt(i);
        const side = offset >= 0 ? 'left' : 'right'; // Walia's side; grass goes opposite
        const label = stop.title.replace(/^Lesson \d+ – /, '');
        const reward = stop.kind === 'reward';

        if (stop.kind === 'trophy') {
          const won = stop.state === 'done';
          return (
            <div key={stop.title} className="trail-stop" style={{ top: rowOf(i) * ROW, left: WIDTH / 2 + offset }}>
              <span
                className={`stone trophy ${won ? 'done' : 'locked'}`}
                role="img"
                aria-label={won ? `${label} (earned)` : `${label} (finish the camp to earn it)`}
                title={won ? 'Camp complete!' : 'Finish every lesson in this camp to win the trophy'}
              >
                <TrophyIcon won={won} />
              </span>
            </div>
          );
        }
        const content =
          stop.state === 'done' ? <CheckIcon /> : <StarIcon />;
        const className = `stone ${stop.state}`;

        if (reward) {
          return (
            <div key={stop.title} className="trail-stop" style={{ top: rowOf(i) * ROW, left: WIDTH / 2 + offset }}>
              <span
                className={`mesob ${stop.state === 'done' ? 'open' : 'closed'}`}
                role="img"
                aria-label={stop.state === 'done' ? `${label} (reached)` : `${label} (keep climbing to reach it)`}
                title={stop.state === 'done' ? 'You reached the halfway mesob!' : 'Keep climbing to reach the halfway mesob'}
              >
                <MesobIcon open={stop.state === 'done'} />
              </span>
            </div>
          );
        }
        const aria = `${label}${stop.state === 'done' ? ' (completed)' : stop.state === 'locked' ? ' (locked)' : ''}`;

        return (
          <div
            key={stop.title}
            className="trail-stop"
            style={{ top: rowOf(i) * ROW, left: WIDTH / 2 + offset }}
            data-current-stone={stop.state === 'current' ? '' : undefined}
          >
            {stop.state === 'current' && (
              <span className="start-bubble" aria-hidden>
                Start
              </span>
            )}
            {stop.state === 'locked' ? (
              <span className={className} role="img" aria-label={aria} title={label}>
                {content}
              </span>
            ) : stop.href ? (
              <Link href={stop.href} className={className} aria-label={aria} title={label}>
                {content}
              </Link>
            ) : (
              <button
                type="button"
                className={className}
                onClick={stop.onSelect}
                aria-label={aria}
                aria-current={stop.state === 'current' ? 'step' : undefined}
              >
                {content}
              </button>
            )}
            <span className="stone-label">{label}</span>

            {stop.state !== 'done' && (
              <span
                className={`trail-grass ${side === 'left' ? 'right' : 'left'}`}
                title="Finish this lesson to earn grass"
              >
                <GrassIcon size={30} />
              </span>
            )}

            {stop.state === 'current' && (
              <div className={`trail-walia ${side}`} style={{ width: waliaSize }} aria-hidden>
                <Mascot pose="wave" size={waliaSize} hornScale={hornScale} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
