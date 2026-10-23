'use client';

// One tall mountain drawn behind the whole learn trail, from the meadow at the
// trailhead (Camp 1) up through every camp to the flag on the summit. Green
// ledges, pines and grey cliffs low down; bare rock and snow near the top;
// clouds drifting past, distant blue ranges and lakes off to the sides.
// Camps you haven't reached yet sit under a layer of cloud.
//
// It measures the climb it sits in (and where each camp starts and ends), so
// the mountain always fits the trail, however many lessons there are.

import { useEffect, useRef, useState } from 'react';

type Camp = { top: number; bottom: number; locked: boolean };
type Layout = { w: number; h: number; peakY: number; camps: Camp[] };
type Pt = [number, number];

const C = {
  skyTop: '#9fd2f1',
  skyBottom: '#e3f3fb',
  far: '#c5dbee',
  farer: '#dbe9f5',
  farSnow: '#f4f8fc',
  lake: '#9fd3ee',
  rock: '#cfcbc6',
  rockShade: '#ada9a5',
  rockLine: '#bcb7b1',
  grass: '#86c64c',
  grassTop: '#a4d964',
  grassShade: '#5f9c39',
  pine: '#2f7d4f',
  pineLight: '#3f9a5f',
  snow: '#f7fafd',
  snowShade: '#dde6f0',
  meadow: '#93cf58',
  meadowFront: '#7cbf45',
  path: '#efe1bb',
};

/** Same picture every time: a small seeded random. */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const poly = (pts: Pt[]) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ') + ' Z';

function Pine({ x, y, s }: { x: number; y: number; s: number }) {
  const h = 46 * s;
  const w = 17 * s;
  return (
    <g>
      <rect x={x - 2.5 * s} y={y - 6 * s} width={5 * s} height={8 * s} fill="#6b4a2e" />
      <path d={`M${x} ${y - h} L${x + w * 0.62} ${y - h * 0.55} L${x - w * 0.62} ${y - h * 0.55} Z`} fill={C.pine} />
      <path d={`M${x} ${y - h * 0.78} L${x + w * 0.85} ${y - h * 0.28} L${x - w * 0.85} ${y - h * 0.28} Z`} fill={C.pine} />
      <path d={`M${x} ${y - h * 0.52} L${x + w} ${y - 4 * s} L${x - w} ${y - 4 * s} Z`} fill={C.pine} />
      <path d={`M${x} ${y - h} L${x - w * 0.62} ${y - h * 0.55} L${x - w * 0.2} ${y - h * 0.58} Z`} fill={C.pineLight} />
      <path d={`M${x} ${y - h * 0.78} L${x - w * 0.85} ${y - h * 0.28} L${x - w * 0.3} ${y - h * 0.32} Z`} fill={C.pineLight} />
      <path d={`M${x} ${y - h * 0.52} L${x - w} ${y - 4 * s} L${x - w * 0.35} ${y - 6 * s} Z`} fill={C.pineLight} />
    </g>
  );
}

function Cloud({ x, y, s, opacity = 0.95 }: { x: number; y: number; s: number; opacity?: number }) {
  return (
    <g opacity={opacity}>
      <ellipse cx={x} cy={y} rx={70 * s} ry={22 * s} fill="#fff" />
      <circle cx={x - 34 * s} cy={y - 12 * s} r={24 * s} fill="#fff" />
      <circle cx={x + 2 * s} cy={y - 26 * s} r={34 * s} fill="#fff" />
      <circle cx={x + 38 * s} cy={y - 10 * s} r={22 * s} fill="#fff" />
      <ellipse cx={x + 6 * s} cy={y + 8 * s} rx={64 * s} ry={10 * s} fill="#e9f2f9" />
    </g>
  );
}

function draw({ w, h, peakY, camps }: Layout) {
  const r = rng(7);
  const cx = w / 2;
  const maxHW = Math.min(215, w / 2 - 22);
  const baseY = h - 230; // where the mountain meets the meadow
  const STEP = 36;

  // How wide the mountain is at height y: a sharp peak that broadens quickly.
  const halfWidth = (y: number) => {
    const d = y - peakY;
    if (d <= 0) return 0;
    let hw = maxHW * (1 - Math.exp(-d / 260)) * (1 + 0.07 * Math.sin(y / 380));
    if (y > baseY - 260) hw += ((y - (baseY - 260)) / 260) ** 2 * (w / 2 - hw + 60);
    return hw;
  };

  // Rough, rocky edges.
  const left: Pt[] = [];
  const right: Pt[] = [];
  for (let y = peakY + STEP; y <= baseY + 40; y += STEP) {
    const hw = halfWidth(y);
    const j = Math.min(1, (y - peakY) / 200);
    left.push([cx - hw - (r() * 22 - 6) * j, y]);
    right.push([cx + hw + (r() * 22 - 6) * j, y]);
  }
  const body = poly([[cx, peakY], ...right, [w + 80, baseY + 40], [w + 80, h], [-80, h], [-80, baseY + 40], ...left.reverse()]);

  // The ridge spine splits the sunlit left face from the shaded right face.
  const spine: Pt[] = [];
  for (let y = peakY; y <= baseY + 40; y += STEP * 2) {
    spine.push([cx + halfWidth(y) * 0.32 + Math.sin(y / 170) * 18, y]);
  }
  const shade = poly([[cx, peakY], ...right, [w + 80, baseY + 40], ...spine.slice().reverse()]);

  // Snow on the summit, with a ragged lower edge.
  const snowLine: Pt[] = [];
  for (let x = cx - 260; x <= cx + 260; x += 26) {
    const dist = Math.abs(x - cx);
    snowLine.push([x, peakY + 150 + dist * 0.25 + (r() * 40 - 10) + (x > cx ? 20 : 0)]);
  }
  const snow = poly([[cx - 300, peakY - 40], [cx + 300, peakY - 40], ...snowLine.reverse()]);
  const snowShade = poly([[cx, peakY], [cx + 300, peakY + 40], [cx + 300, peakY + 260], ...spine.filter(p => p[1] < peakY + 260).reverse()]);

  // Grassy ledges: soft mounds of grass that drape over the cliffs in rounded
  // lobes, some sweeping right across the mountain, some only partway.
  const ledges: { band: string; shadow: string; top: Pt[]; light: boolean }[] = [];
  const grassFrom = peakY + 330;
  for (let y0 = baseY - 60, k = 0; y0 > grassFrom; y0 -= 200 + r() * 110, k++) {
    const hw = halfWidth(y0) + 30;
    const wide = r() < 0.3;
    const a = wide ? -1.15 : -1.15 + r() * 0.5;
    const b = wide ? 1.15 : 0.15 + r() * 1;
    const flip = k % 2 ? 1 : -1;
    const xa = cx + flip * a * hw;
    const xb = cx + flip * b * hw;
    const [x0, x1] = xa < xb ? [xa, xb] : [xb, xa];
    const tilt = flip * (10 + r() * 22);
    const bulge = 8 + r() * 16;
    const thick = 30 + r() * 26;
    const span = x1 - x0;
    const topAt = (x: number) =>
      y0 + (tilt * (x - cx)) / hw - bulge * Math.sin((Math.PI * (x - x0)) / span) + Math.sin(x / 23 + k) * 2.5;

    const top: Pt[] = [];
    for (let x = x0; x <= x1 + 0.1; x += 14) top.push([x, topAt(x)]);
    // Rounded lobes hang under the top edge, shallow at the two ends.
    let under = '';
    let shadow = '';
    let x = x1;
    while (x > x0 + 1) {
      const lobe = Math.min(34 + r() * 40, x - x0);
      const nx = x - lobe;
      const mid = (x + nx) / 2;
      const ends = Math.sin((Math.PI * (mid - x0)) / span) ** 0.6;
      const depth = thick * (0.45 + r() * 0.75) * ends;
      const ya = topAt(nx) + thick * 0.35 * Math.sin((Math.PI * (nx - x0)) / span) ** 0.6;
      under += ` Q ${mid.toFixed(1)} ${(topAt(mid) + depth * 1.9).toFixed(1)} ${nx.toFixed(1)} ${ya.toFixed(1)}`;
      shadow += ` Q ${(mid + 4).toFixed(1)} ${(topAt(mid) + depth * 1.9 + 16).toFixed(1)} ${(nx + 4).toFixed(1)} ${(ya + 12).toFixed(1)}`;
      x = nx;
    }
    const topPath = top.map(([px, py], i) => `${i ? 'L' : 'M'}${px.toFixed(1)} ${py.toFixed(1)}`).join(' ');
    const topShadow = top
      .map(([px, py], i) => `${i ? 'L' : 'M'}${(px + 4).toFixed(1)} ${(py + 8).toFixed(1)}`)
      .join(' ');
    ledges.push({
      band: `${topPath}${under} Z`,
      shadow: `${topShadow}${shadow} Z`,
      top,
      light: r() < 0.5,
    });
  }

  // Pines on the ledges, out to the sides so the trail stays clear.
  const pines: { x: number; y: number; s: number }[] = [];
  for (const { top } of ledges) {
    for (const [x, y] of top) {
      const off = Math.abs(x - cx);
      const hw = halfWidth(y);
      if (off > 170 && off < hw - 6 && r() < 0.32) pines.push({ x, y: y + 6, s: 0.7 + r() * 0.5 });
    }
  }

  // Cliff streaks on the rock faces.
  const streaks: string[] = [];
  for (let y = peakY + 200; y < baseY; y += 46) {
    const hw = halfWidth(y);
    const x = cx + (r() * 2 - 1) * hw * 0.9;
    if (Math.abs(x - cx) < 140) continue;
    const len = 30 + r() * 50;
    streaks.push(`M${x.toFixed(1)} ${y.toFixed(1)} l${(r() * 8 - 4).toFixed(1)} ${len.toFixed(1)}`);
  }

  // Distant ranges and lakes at the sides, repeating up the page.
  const ranges: { d: string; snow: string; color: string }[] = [];
  for (let y = baseY - 120, k = 0; y > peakY + 200; y -= 640, k++) {
    for (const side of [-1, 1]) {
      const edge = side < 0 ? 0 : w;
      const px = edge + side * -(60 + r() * 60);
      const ph = 220 + r() * 140;
      const color = k % 2 ? C.farer : C.far;
      ranges.push({
        d: poly([[edge + side * 40, h], [edge + side * 40, y + 60 - ph * 0.4], [px - 120, y + 60], [px, y + 60 - ph], [px + 120, y + 60], [px + 160, h]]),
        snow: poly([[px, y + 60 - ph], [px + 26, y + 60 - ph + 34], [px + 8, y + 60 - ph + 28], [px - 6, y + 60 - ph + 40], [px - 24, y + 60 - ph + 30]]),
        color,
      });
    }
  }

  // Clouds drifting past the sides.
  const clouds: { x: number; y: number; s: number }[] = [];
  for (let y = baseY - 300, k = 0; y > peakY + 120; y -= 380 + r() * 200, k++) {
    clouds.push({ x: k % 2 ? w - 30 + r() * 30 : 30 - r() * 30, y, s: 0.8 + r() * 0.5 });
  }

  // Camps you haven't reached wait above the clouds.
  const lockedCamps = camps.filter(c => c.locked);
  const lockLine = lockedCamps.length ? Math.max(...lockedCamps.map(c => c.bottom)) : null;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden>
      <defs>
        <linearGradient id="climb-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.skyTop} />
          <stop offset="0.5" stopColor="#c4e5f7" />
          <stop offset="1" stopColor={C.skyBottom} />
        </linearGradient>
        <linearGradient id="climb-lock" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.32" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.22" />
        </linearGradient>
        <radialGradient id="climb-sun">
          <stop offset="0" stopColor="#fffbe0" />
          <stop offset="0.45" stopColor="#fff3b8" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fff3b8" stopOpacity="0" />
        </radialGradient>
        <clipPath id="climb-body">
          <path d={body} />
        </clipPath>
      </defs>

      <rect width={w} height={h} fill="url(#climb-sky)" />
      <circle cx={w - 70} cy={peakY + 260} r={120} fill="url(#climb-sun)" />
      {[...ranges].reverse().map((m, i) => (
        <g key={i}>
          <path d={m.d} fill={m.color} />
          <path d={m.snow} fill={C.farSnow} />
        </g>
      ))}
      <ellipse cx={-20} cy={baseY - 40} rx={180} ry={26} fill={C.lake} />
      <ellipse cx={w + 30} cy={baseY - 10} rx={200} ry={30} fill={C.lake} />
      {/* birds near the top */}
      <path
        d={`M${cx - 190} ${peakY + 80} q8 -8 16 0 q8 -8 16 0 M${cx + 150} ${peakY + 30} q6 -6 12 0 q6 -6 12 0`}
        stroke="#fff"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />

      <path d={body} fill={C.rock} />
      <g clipPath="url(#climb-body)">
        <path d={shade} fill={C.rockShade} />
        {streaks.map((d, i) => (
          <path key={i} d={d} stroke={C.rockLine} strokeWidth="5" strokeLinecap="round" opacity="0.7" />
        ))}
        <path d={snow} fill={C.snow} />
        <path d={snowShade} fill={C.snowShade} opacity="0.7" clipPath="url(#climb-body)" />
        {ledges.map((l, i) => (
          <g key={i}>
            <path d={l.shadow} fill={C.grassShade} opacity="0.55" />
            <path d={l.band} fill={l.light ? C.grassTop : C.grass} />
            <path
              d={l.top.map(([x, y], j) => `${j ? 'L' : 'M'}${x.toFixed(1)} ${(y + 3).toFixed(1)}`).join(' ')}
              stroke={l.light ? '#bde57f' : C.grassTop}
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
            />
          </g>
        ))}
      </g>
      {pines.map((p, i) => (
        <Pine key={i} {...p} />
      ))}

      {/* the flag on the summit */}
      <g>
        <rect x={cx - 2} y={peakY - 62} width="4" height="66" rx="2" fill="#7a5233" />
        <path d={`M${cx + 2} ${peakY - 60} L${cx + 44} ${peakY - 50} L${cx + 2} ${peakY - 38} Z`} fill="#e8483b" />
        <path
          d={`M${cx + 16} ${peakY - 55} l2 4.2 4.6.5-3.4 3.1 1 4.6-4.2-2.4-4.2 2.4 1-4.6-3.4-3.1 4.6-.5z`}
          fill="#ffd34d"
        />
      </g>

      {/* the meadow at the trailhead */}
      <path
        d={`M-20 ${baseY + 10} Q ${w * 0.25} ${baseY - 30} ${w * 0.5} ${baseY + 6} T ${w + 20} ${baseY - 10} L ${w + 20} ${h} L -20 ${h} Z`}
        fill={C.meadow}
      />
      <path
        d={`M-20 ${baseY + 90} Q ${w * 0.3} ${baseY + 50} ${w * 0.6} ${baseY + 92} T ${w + 20} ${baseY + 70} L ${w + 20} ${h} L -20 ${h} Z`}
        fill={C.meadowFront}
      />
      <Pine x={34} y={baseY + 70} s={1.3} />
      <Pine x={70} y={baseY + 96} s={1} />
      <Pine x={w - 40} y={baseY + 60} s={1.25} />
      <Pine x={w - 78} y={baseY + 86} s={0.95} />
      {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
        <circle
          key={i}
          cx={(w / 9) * (i + 1) + ((i * 37) % 23)}
          cy={baseY + 120 + ((i * 53) % 70)}
          r={3.5}
          fill={i % 2 ? '#fff' : '#ffe27a'}
        />
      ))}

      {clouds.map((c, i) => (
        <Cloud key={i} {...c} />
      ))}

      {lockLine !== null && (
        <g>
          <rect x="0" y="0" width={w} height={lockLine} fill="url(#climb-lock)" />
          {Array.from({ length: Math.ceil(w / 120) + 1 }, (_, i) => (
            <Cloud key={i} x={i * 120 + (i % 2 ? 20 : -10)} y={lockLine + 6} s={0.75 + (i % 3) * 0.12} opacity={0.97} />
          ))}
        </g>
      )}
    </svg>
  );
}

export default function ClimbMountain() {
  const ref = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<Layout | null>(null);

  useEffect(() => {
    const host = ref.current?.parentElement;
    if (!host) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const summit = host.querySelector<HTMLElement>('.summit-text');
      const camps = Array.from(host.querySelectorAll<HTMLElement>('[data-camp]')).map(el => ({
        top: el.offsetTop,
        bottom: el.offsetTop + el.offsetHeight,
        locked: el.dataset.locked === 'true',
      }));
      const peakY = summit ? summit.offsetTop + summit.offsetHeight + 110 : 160;
      const next = { w: host.clientWidth, h: host.scrollHeight, peakY, camps };
      setLayout(prev =>
        prev && JSON.stringify(prev) === JSON.stringify(next) ? prev : next,
      );
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    const observer = new ResizeObserver(schedule);
    observer.observe(host);
    host.querySelectorAll('[data-camp]').forEach(el => observer.observe(el));
    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className="climb-art" aria-hidden>
      {layout && draw(layout)}
    </div>
  );
}
