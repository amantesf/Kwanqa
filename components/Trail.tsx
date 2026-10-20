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
  /** Stable name for the stop (e.g. "amharic-beginner-1:0"), used to animate progress. */
  id?: string;
};

export type Scenery = 'foothills' | 'forest' | 'heather' | 'alpine' | 'locked';

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

// Each camp is drawn as its own mountain: Simien rock cliffs crowned with bare
// summit rock (the Simien has no permanent snow), distant peaks behind, and
// hills at the base tinted by altitude zone.
type Palette = {
  sky: string | null;
  far: string;
  rock: string;
  rockShade: string;
  ledge: string;
  summit: string;
  summitShade: string;
  hill: string;
  hillFront: string;
  decor: string;
};
const ROCK = { rock: '#efcfb8', rockShade: '#dfae90', ledge: '#c98b68', summit: '#c98b68', summitShade: '#a8684c' };
const SCENERY: Record<Scenery, Palette> = {
  foothills: { sky: '#e9f5fc', far: '#dfe8f2', ...ROCK, hill: '#d3e7ad', hillFront: '#bcd98f', decor: '#86b35c' },
  forest: { sky: '#e9f5fc', far: '#dfe8f2', ...ROCK, hill: '#b5d8ae', hillFront: '#98c693', decor: '#5a9a5e' },
  heather: { sky: '#eef1fb', far: '#e3e4f2', ...ROCK, hill: '#dccbe6', hillFront: '#c9b0d8', decor: '#a27dbd' },
  alpine: { sky: '#eef3f8', far: '#e4dfd6', ...ROCK, hill: '#e8d9a4', hillFront: '#d8c47f', decor: '#a8915a' },
  locked: {
    sky: null,
    far: '#f4f4f4',
    rock: '#efefef',
    rockShade: '#e3e3e3',
    ledge: '#d6d6d6',
    summit: '#e0e0e0',
    summitShade: '#d4d4d4',
    hill: '#f2f2f2',
    hillFront: '#eaeaea',
    decor: '#dcdcdc',
  },
};
const MOUNTAIN_WIDTH = 620;

type Pt = [number, number];
const toPath = (pts: Pt[], close = true) =>
  pts.map(([x, y], i) => `${i ? 'L' : 'M'}${Math.round(x)} ${Math.round(y)}`).join(' ') + (close ? ' Z' : '');

/** A mountain whose peak sits at the top stop, so finishing a camp means reaching its summit. */
function Mountain({ scenery, peakX, height }: { scenery: Scenery; peakX: number; height: number }) {
  const c = SCENERY[scenery];
  const W = MOUNTAIN_WIDTH;
  const top = -44; // a little above the top stop, so the trophy sits on the summit rocks
  const H = height + 24;
  const h = H - top;
  const px = Math.min(Math.max(peakX + (W - WIDTH) / 2, 210), W - 210);
  const X = (x: number) => Math.min(Math.max(x, 0), W);
  const at = (f: number) => top + h * f;
  const pts = (list: Pt[]) => list.map(([x, y]) => [X(x), y] as Pt);

  const leftRidge = pts([
    [px - 30, top + 50],
    [px - 48, top + 62],
    [px - 66, top + 108],
    [px - 56, top + 120],
    [px - 112, at(0.25)],
    [px - 152, at(0.33)],
    [px - 140, at(0.37)],
    [px - 204, at(0.52)],
    [px - 244, at(0.62)],
    [px - 232, at(0.66)],
    [px - 300, at(0.8)],
    [0, at(0.86)],
  ]);
  const rightRidge = pts([
    [px + 26, top + 44],
    [px + 60, top + 96],
    [px + 50, top + 108],
    [px + 104, at(0.22)],
    [px + 150, at(0.3)],
    [px + 140, at(0.34)],
    [px + 212, at(0.5)],
    [px + 252, at(0.6)],
    [px + 300, at(0.78)],
    [W, at(0.82)],
  ]);
  // The ridge spine running down the middle splits the sunlit and shaded faces.
  const spine = pts([
    [px + 6, top + 70],
    [px + 4, at(0.2)],
    [px + 26, at(0.36)],
    [px + 16, at(0.52)],
    [px + 40, at(0.7)],
    [px + 56, H],
  ]);

  const body = toPath([[px, top], ...rightRidge, [W, H], [0, H], ...[...leftRidge].reverse()]);
  const shade = toPath([[px, top], ...rightRidge, [W, H], ...[...spine].reverse()]);
  // The bare summit rock at the top of the climb.
  const summit = toPath([
    [px, top],
    [px + 26, top + 44],
    [px + 60, top + 96],
    [px + 40, top + 104],
    [px + 22, top + 88],
    [px + 6, top + 112],
    [px - 12, top + 86],
    [px - 30, top + 106],
    [px - 44, top + 88],
    [px - 66, top + 108],
    [px - 48, top + 62],
    [px - 30, top + 50],
  ]);
  const summitShade = toPath([
    [px, top],
    [px + 26, top + 44],
    [px + 60, top + 96],
    [px + 40, top + 104],
    [px + 22, top + 88],
    [px + 6, top + 104],
    [px + 6, top + 60],
  ]);
  // Rock ledges across both faces, like the layered Simien escarpment:
  // thin wedge-shaped bands that catch a shadow underneath.
  const ledge = (x: number, y: number, w: number): string =>
    toPath(
      pts([
        [x, y],
        [x + w * 0.3, y - 4],
        [x + w * 0.6, y + 1],
        [x + w, y - 3],
        [x + w * 0.92, y + 7],
        [x + w * 0.5, y + 9],
        [x + w * 0.12, y + 6],
      ]),
    );
  const ledges = [
    ledge(px - 92, at(0.27), 64),
    ledge(px + 44, at(0.31), 58),
    ledge(px - 170, at(0.45), 82),
    ledge(px - 60, at(0.5), 46),
    ledge(px + 70, at(0.47), 76),
    ledge(px - 230, at(0.63), 70),
    ledge(px + 150, at(0.62), 64),
  ];
  const far = toPath([
    [0, at(0.42)],
    [44, at(0.26)],
    [96, at(0.12)],
    [136, at(0.22)],
    [180, at(0.34)],
    [W - 200, at(0.32)],
    [W - 140, at(0.18)],
    [W - 92, at(0.06)],
    [W - 50, at(0.18)],
    [W, at(0.26)],
    [W, H],
    [0, H],
  ]);
  const hill = `M0 ${at(0.8)} Q 110 ${at(0.73)} 220 ${at(0.82)} T 420 ${at(0.8)} T ${W} ${at(0.76)} L ${W} ${H} L 0 ${H} Z`;
  const hillFront = `M0 ${at(0.9)} Q 150 ${at(0.83)} 300 ${at(0.91)} T ${W} ${at(0.88)} L ${W} ${H} L 0 ${H} Z`;

  // Trees on the green slopes, little rocks higher up.
  const decor: Pt[] = [
    [40, at(0.83)],
    [70, at(0.86)],
    [130, at(0.92)],
    [W - 50, at(0.81)],
    [W - 86, at(0.85)],
    [W - 140, at(0.93)],
  ];
  const trees = scenery === 'foothills' || scenery === 'forest' || scenery === 'locked';
  const fadeId = `mtn-fade-${scenery}`;
  const skyId = `mtn-sky-${scenery}`;

  return (
    <svg
      className="trail-mountain"
      width={W}
      height={h}
      viewBox={`0 ${top} ${W} ${h}`}
      style={{ left: (WIDTH - W) / 2, top }}
      aria-hidden
    >
      <defs>
        <linearGradient id={fadeId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#fff" stopOpacity="1" />
        </linearGradient>
        {c.sky && (
          <linearGradient id={skyId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" />
            <stop offset="0.15" stopColor={c.sky} />
            <stop offset="0.7" stopColor="#fff" />
          </linearGradient>
        )}
      </defs>
      {c.sky && <rect x="0" y={top} width={W} height={h} fill={`url(#${skyId})`} />}
      <path d={far} fill={c.far} />
      <path d={body} fill={c.rock} />
      <path d={shade} fill={c.rockShade} />
      {ledges.map((d, i) => (
        <path key={i} d={d} fill={c.ledge} opacity="0.45" />
      ))}
      <path d={summit} fill={c.summit} />
      <path d={summitShade} fill={c.summitShade} />
      <path d={hill} fill={c.hill} />
      <path d={hillFront} fill={c.hillFront} />
      {decor.map(([x, y], i) =>
        trees ? (
          <g key={i}>
            <rect x={x - 2} y={y - 6} width="4" height="8" rx="1" fill={c.decor} opacity="0.8" />
            <path d={`M${x} ${y - 34} L${x + 13} ${y - 4} L${x - 13} ${y - 4} Z`} fill={c.decor} />
          </g>
        ) : (
          <path
            key={i}
            d={`M${x - 14} ${y} Q${x - 10} ${y - 14} ${x} ${y - 16} Q${x + 12} ${y - 12} ${x + 15} ${y} Z`}
            fill={c.decor}
          />
        ),
      )}
      <rect x="0" y={H - 70} width={W} height="70" fill={`url(#${fadeId})`} />
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
  scenery,
}: {
  stops: TrailStop[];
  hornScale?: number;
  waliaSize?: number;
  /** Draws the camp as a mountain behind the trail. */
  scenery?: Scenery;
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
    <div className={`trail${scenery ? ' trail-scenic' : ''}`} style={{ width: WIDTH, height }}>
      {scenery && stops.length > 0 && (
        <Mountain scenery={scenery} peakX={point(stops.length - 1).x} height={height} />
      )}
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
            data-stop={stop.id}
          >
            {stop.state === 'current' && (
              <span className="start-bubble" aria-hidden>
                Start
              </span>
            )}
            {stop.state === 'locked' && !stop.href ? (
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
                <Mascot pose="wave" size={waliaSize} hornScale={hornScale} animated />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
