'use client';

import Link from 'next/link';
import GrassIcon from '@/components/GrassIcon';
import Mascot from '@/components/Mascot';

export type StoneState = 'done' | 'current' | 'todo' | 'locked';

export type TrailStop = {
  title: string;
  state: StoneState;
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

function LockIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M7 10V8a5 5 0 0 1 10 0v2h.5A1.5 1.5 0 0 1 19 11.5v8a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19.5v-8A1.5 1.5 0 0 1 6.5 10H7zm2.5 0h5V8a2.5 2.5 0 0 0-5 0v2z" />
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
}: {
  stops: TrailStop[];
  hornScale?: number;
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
        const content =
          stop.state === 'done' ? <CheckIcon /> : stop.state === 'locked' ? <LockIcon /> : <span>{i + 1}</span>;
        const className = `stone ${stop.state}`;
        const aria = `${label}${stop.state === 'done' ? ' (completed)' : stop.state === 'locked' ? ' (locked)' : ''}`;

        return (
          <div
            key={stop.title}
            className="trail-stop"
            style={{ top: rowOf(i) * ROW, left: WIDTH / 2 + offset }}
            data-current-stone={stop.state === 'current' ? '' : undefined}
          >
            {stop.state === 'locked' ? (
              <span className={className} role="img" aria-label={aria}>
                {content}
              </span>
            ) : stop.href ? (
              <Link href={stop.href} className={className} aria-label={aria}>
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
              <div className={`trail-walia ${side}`} aria-hidden>
                <Mascot pose="wave" size={74} hornScale={hornScale} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
