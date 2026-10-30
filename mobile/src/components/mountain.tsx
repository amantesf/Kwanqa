import { memo } from 'react';
import Svg, { Circle, ClipPath, Defs, Ellipse, G, LinearGradient, Path, RadialGradient, Rect, Stop } from 'react-native-svg';

// The mountain behind the trail, drawn the same way as on the website
// (components/ClimbMountain.tsx): from the meadow at the trailhead (Camp 1) up
// through every camp to Ras Dashen's bare summit rock and Ethiopia's flag, with
// green ledges, pines, cliffs, distant ranges, lakes and drifting clouds.
// Camps not reached yet sit under a layer of cloud. The trail measures itself
// and passes in where the summit and each camp are, so the mountain always fits.

export type MountainCamp = { top: number; bottom: number; locked: boolean };
export type MountainLayout = { w: number; h: number; peakY: number; camps: MountainCamp[] };
type Pt = [number, number];

const C = {
  skyTop: '#9fd2f1',
  skyBottom: '#e3f3fb',
  far: '#c5dbee',
  farer: '#dbe9f5',
  farRock: '#aebfd2',
  lake: '#9fd3ee',
  rock: '#cfcbc6',
  rockShade: '#ada9a5',
  rockLine: '#bcb7b1',
  grass: '#86c64c',
  grassTop: '#a4d964',
  grassShade: '#5f9c39',
  pine: '#2f7d4f',
  pineLight: '#3f9a5f',
  summit: '#a68d79',
  summitShade: '#8a7260',
  summitLine: '#755e4e',
  meadow: '#93cf58',
  meadowFront: '#7cbf45',
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
    <G>
      <Rect x={x - 2.5 * s} y={y - 6 * s} width={5 * s} height={8 * s} fill="#6b4a2e" />
      <Path d={`M${x} ${y - h} L${x + w * 0.62} ${y - h * 0.55} L${x - w * 0.62} ${y - h * 0.55} Z`} fill={C.pine} />
      <Path d={`M${x} ${y - h * 0.78} L${x + w * 0.85} ${y - h * 0.28} L${x - w * 0.85} ${y - h * 0.28} Z`} fill={C.pine} />
      <Path d={`M${x} ${y - h * 0.52} L${x + w} ${y - 4 * s} L${x - w} ${y - 4 * s} Z`} fill={C.pine} />
      <Path d={`M${x} ${y - h} L${x - w * 0.62} ${y - h * 0.55} L${x - w * 0.2} ${y - h * 0.58} Z`} fill={C.pineLight} />
      <Path d={`M${x} ${y - h * 0.78} L${x - w * 0.85} ${y - h * 0.28} L${x - w * 0.3} ${y - h * 0.32} Z`} fill={C.pineLight} />
      <Path d={`M${x} ${y - h * 0.52} L${x - w} ${y - 4 * s} L${x - w * 0.35} ${y - 6 * s} Z`} fill={C.pineLight} />
    </G>
  );
}

function Cloud({ x, y, s, opacity = 0.95 }: { x: number; y: number; s: number; opacity?: number }) {
  return (
    <G opacity={opacity}>
      <Ellipse cx={x} cy={y} rx={70 * s} ry={22 * s} fill="#fff" />
      <Circle cx={x - 34 * s} cy={y - 12 * s} r={24 * s} fill="#fff" />
      <Circle cx={x + 2 * s} cy={y - 26 * s} r={34 * s} fill="#fff" />
      <Circle cx={x + 38 * s} cy={y - 10 * s} r={22 * s} fill="#fff" />
      <Ellipse cx={x + 6 * s} cy={y + 8 * s} rx={64 * s} ry={10 * s} fill="#e9f2f9" />
    </G>
  );
}

/**
 * How wide the mountain is, each side of the middle, at height y: a sharp peak
 * that broadens quickly. (Lower down it spreads out into the meadow too.)
 * The trail uses this to start its top camp low enough to stand on rock.
 */
export function mountainHalfWidth(w: number, peakY: number, y: number) {
  const d = y - peakY;
  if (d <= 0) return 0;
  // a little wider than the website's on a phone, where the trail fills more of the width
  const maxHW = Math.min(215, w / 2 - 12);
  return maxHW * (1 - Math.exp(-d / 260)) * (1 + 0.07 * Math.sin(y / 380));
}

function Mountain({ w, h, peakY, camps }: MountainLayout) {
  const r = rng(7);
  const cx = w / 2;
  const baseY = h - 230; // where the mountain meets the meadow
  const STEP = 36;

  const halfWidth = (y: number) => {
    let hw = mountainHalfWidth(w, peakY, y);
    if (hw && y > baseY - 260) hw += ((y - (baseY - 260)) / 260) ** 2 * (w / 2 - hw + 60);
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
  for (let y = peakY; y <= baseY + 40; y += STEP * 2) spine.push([cx + halfWidth(y) * 0.32 + Math.sin(y / 170) * 18, y]);
  const shade = poly([[cx, peakY], ...right, [w + 80, baseY + 40], ...spine.slice().reverse()]);

  // Bare brown summit rock with a stepped lower edge, like layered basalt.
  const rockLine: Pt[] = [];
  for (let x = cx - 260; x <= cx + 260; x += 22) {
    const dist = Math.abs(x - cx);
    rockLine.push([x, peakY + 150 + dist * 0.25 + (r() < 0.5 ? 0 : 22) + (x > cx ? 16 : 0)]);
  }
  const summitRock = poly([[cx - 300, peakY - 40], [cx + 300, peakY - 40], ...rockLine.slice().reverse()]);
  const summitShade = poly([[cx, peakY], [cx + 300, peakY + 40], [cx + 300, peakY + 260], ...spine.filter(p => p[1] < peakY + 260).reverse()]);
  const cracks: string[] = [];
  for (let k = 0; k < 7; k++) {
    const y = peakY + 40 + k * 22 + r() * 10;
    const hw = halfWidth(y);
    if (hw < 30) continue;
    const x0 = cx - hw * (0.2 + r() * 0.7);
    const len = 20 + r() * hw * 0.6;
    cracks.push(`M${x0.toFixed(1)} ${y.toFixed(1)} l${(len * 0.5).toFixed(1)} ${(r() * 6 - 3).toFixed(1)} l${(len * 0.5).toFixed(1)} ${(r() * 8).toFixed(1)}`);
  }
  const boulders = rockLine.filter((_, i) => i % 3 === 1).map(([x, y]) => ({ x, y: y - 4, rx: 9 + r() * 8, ry: 6 + r() * 4 }));

  // Grassy ledges draping over the cliffs in rounded lobes.
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
    const topAt = (x: number) => y0 + (tilt * (x - cx)) / hw - bulge * Math.sin((Math.PI * (x - x0)) / span) + Math.sin(x / 23 + k) * 2.5;

    const top: Pt[] = [];
    for (let x = x0; x <= x1 + 0.1; x += 14) top.push([x, topAt(x)]);
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
    const topShadow = top.map(([px, py], i) => `${i ? 'L' : 'M'}${(px + 4).toFixed(1)} ${(py + 8).toFixed(1)}`).join(' ');
    ledges.push({ band: `${topPath}${under} Z`, shadow: `${topShadow}${shadow} Z`, top, light: r() < 0.5 });
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

  // Distant ranges at the sides, repeating up the page.
  const ranges: { d: string; snow: string; color: string }[] = [];
  for (let y = baseY - 120, k = 0; y > peakY + 200; y -= 640, k++) {
    for (const side of [-1, 1]) {
      const edge = side < 0 ? 0 : w;
      const px = edge + side * -(60 + r() * 60);
      const ph = 220 + r() * 140;
      ranges.push({
        d: poly([[edge + side * 40, h], [edge + side * 40, y + 60 - ph * 0.4], [px - 120, y + 60], [px, y + 60 - ph], [px + 120, y + 60], [px + 160, h]]),
        snow: poly([[px, y + 60 - ph], [px + 26, y + 60 - ph + 34], [px + 8, y + 60 - ph + 28], [px - 6, y + 60 - ph + 40], [px - 24, y + 60 - ph + 30]]),
        color: k % 2 ? C.farer : C.far,
      });
    }
  }

  const clouds: { x: number; y: number; s: number }[] = [];
  for (let y = baseY - 300, k = 0; y > peakY + 120; y -= 380 + r() * 200, k++) {
    clouds.push({ x: k % 2 ? w - 30 + r() * 30 : 30 - r() * 30, y, s: 0.8 + r() * 0.5 });
  }

  // Camps you haven't reached wait above the clouds.
  const lockedCamps = camps.filter(c => c.locked);
  const lockLine = lockedCamps.length ? Math.max(...lockedCamps.map(c => c.bottom)) : null;
  const flag = `M${cx + 2} ${peakY - 71} Q ${cx + 15} ${peakY - 76} ${cx + 27} ${peakY - 71} T ${cx + 52} ${peakY - 71} L ${cx + 52} ${peakY - 41} Q ${cx + 39} ${peakY - 46} ${cx + 27} ${peakY - 41} T ${cx + 2} ${peakY - 41} Z`;

  return (
    <Svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <Defs>
        <LinearGradient id="climb-sky" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={C.skyTop} />
          <Stop offset="0.5" stopColor="#c4e5f7" />
          <Stop offset="1" stopColor={C.skyBottom} />
        </LinearGradient>
        <LinearGradient id="climb-lock" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#fff" stopOpacity="0.32" />
          <Stop offset="1" stopColor="#fff" stopOpacity="0.22" />
        </LinearGradient>
        <RadialGradient id="climb-sun">
          <Stop offset="0" stopColor="#fffbe0" />
          <Stop offset="0.45" stopColor="#fff3b8" stopOpacity="0.9" />
          <Stop offset="1" stopColor="#fff3b8" stopOpacity="0" />
        </RadialGradient>
        <ClipPath id="climb-body">
          <Path d={body} />
        </ClipPath>
        <ClipPath id="climb-flag-cloth">
          <Path d={flag} />
        </ClipPath>
      </Defs>

      <Rect width={w} height={h} fill="url(#climb-sky)" />
      <Circle cx={w - 70} cy={peakY + 260} r={120} fill="url(#climb-sun)" />
      {[...ranges].reverse().map((m, i) => (
        <G key={i}>
          <Path d={m.d} fill={m.color} />
          <Path d={m.snow} fill={C.farRock} />
        </G>
      ))}
      <Ellipse cx={-20} cy={baseY - 40} rx={180} ry={26} fill={C.lake} />
      <Ellipse cx={w + 30} cy={baseY - 10} rx={200} ry={30} fill={C.lake} />
      {/* birds near the top */}
      <Path
        d={`M${cx - 190} ${peakY + 80} q8 -8 16 0 q8 -8 16 0 M${cx + 150} ${peakY + 30} q6 -6 12 0 q6 -6 12 0`}
        stroke="#fff"
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
      />

      <Path d={body} fill={C.rock} />
      <G clipPath="url(#climb-body)">
        <Path d={shade} fill={C.rockShade} />
        {streaks.map((d, i) => (
          <Path key={i} d={d} stroke={C.rockLine} strokeWidth={5} strokeLinecap="round" opacity={0.7} />
        ))}
        <Path d={summitRock} fill={C.summit} />
        <Path d={summitShade} fill={C.summitShade} opacity={0.75} />
        {cracks.map((d, i) => (
          <Path key={i} d={d} stroke={C.summitLine} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.55} />
        ))}
        {boulders.map((b, i) => (
          <G key={i}>
            <Ellipse cx={b.x} cy={b.y + 3} rx={b.rx} ry={b.ry} fill={C.summitLine} opacity={0.5} />
            <Ellipse cx={b.x} cy={b.y} rx={b.rx} ry={b.ry} fill={C.summit} />
          </G>
        ))}
        {ledges.map((l, i) => (
          <G key={i}>
            <Path d={l.shadow} fill={C.grassShade} opacity={0.55} />
            <Path d={l.band} fill={l.light ? C.grassTop : C.grass} />
            <Path
              d={l.top.map(([x, y], j) => `${j ? 'L' : 'M'}${x.toFixed(1)} ${(y + 3).toFixed(1)}`).join(' ')}
              stroke={l.light ? '#bde57f' : C.grassTop}
              strokeWidth={6}
              fill="none"
              strokeLinecap="round"
            />
          </G>
        ))}
      </G>
      {pines.map((p, i) => (
        <Pine key={i} {...p} />
      ))}

      {/* Ethiopia's flag on the summit: green, yellow and red with the blue emblem */}
      <Rect x={cx - 2} y={peakY - 74} width={4} height={78} rx={2} fill="#6b4a2e" />
      <Circle cx={cx} cy={peakY - 75} r={3.5} fill="#f2c94c" />
      <G clipPath="url(#climb-flag-cloth)">
        <Rect x={cx + 2} y={peakY - 78} width={50} height={17} fill="#078930" />
        <Rect x={cx + 2} y={peakY - 61} width={50} height={10} fill="#fcdd09" />
        <Rect x={cx + 2} y={peakY - 51} width={50} height={14} fill="#da121a" />
        <Circle cx={cx + 27} cy={peakY - 56} r={7.5} fill="#0f47af" />
        <Path
          d={`M${cx + 27} ${peakY - 62} L${cx + 30.5} ${peakY - 51.2} L${cx + 21.3} ${peakY - 57.9} L${cx + 32.7} ${peakY - 57.9} L${cx + 23.5} ${peakY - 51.2} Z`}
          fill="none"
          stroke="#fcdd09"
          strokeWidth={1.2}
          strokeLinejoin="round"
        />
      </G>

      {/* the meadow at the trailhead */}
      <Path d={`M-20 ${baseY + 10} Q ${w * 0.25} ${baseY - 30} ${w * 0.5} ${baseY + 6} T ${w + 20} ${baseY - 10} L ${w + 20} ${h} L -20 ${h} Z`} fill={C.meadow} />
      <Path d={`M-20 ${baseY + 90} Q ${w * 0.3} ${baseY + 50} ${w * 0.6} ${baseY + 92} T ${w + 20} ${baseY + 70} L ${w + 20} ${h} L -20 ${h} Z`} fill={C.meadowFront} />
      <Pine x={34} y={baseY + 70} s={1.3} />
      <Pine x={70} y={baseY + 96} s={1} />
      <Pine x={w - 40} y={baseY + 60} s={1.25} />
      <Pine x={w - 78} y={baseY + 86} s={0.95} />
      {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
        <Circle key={i} cx={(w / 9) * (i + 1) + ((i * 37) % 23)} cy={baseY + 120 + ((i * 53) % 70)} r={3.5} fill={i % 2 ? '#fff' : '#ffe27a'} />
      ))}

      {clouds.map((c, i) => (
        <Cloud key={i} {...c} />
      ))}

      {lockLine !== null && (
        <G>
          <Rect x={0} y={0} width={w} height={lockLine} fill="url(#climb-lock)" />
          {Array.from({ length: Math.ceil(w / 120) + 1 }, (_, i) => (
            <Cloud key={i} x={i * 120 + (i % 2 ? 20 : -10)} y={lockLine + 6} s={0.75 + (i % 3) * 0.12} opacity={0.97} />
          ))}
        </G>
      )}
    </Svg>
  );
}

// Redrawing a whole mountain is costly, so only when the layout really changes.
export default memo(Mountain, (a, b) => JSON.stringify(a) === JSON.stringify(b));
