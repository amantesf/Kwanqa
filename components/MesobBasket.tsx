// A woven basket lid (mesob / sefed), drawn the way real ones are made: a coil
// of grass wrapped in coloured thread, ring after ring from the centre out.
// Each ring is drawn as tiny stitches; the star pattern comes from which colour
// each stitch is, so the rays get the stepped edges of real weaving.
// Each camp gets its own basket, like no two baskets at the market are alike.

type Basket = {
  rays: string[]; // colours of the star rays, in turn
  ground: string[]; // background colours, from the centre out in bands
  accent: string; // little stitch diamonds dotted on the ground
  rim: string;
  knot: string;
  points: number; // how many rays
};

const BASKETS: Basket[] = [
  // Camp 1: market colours
  { rays: ['#f2b705', '#1f8a4c', '#e0457b', '#2457c5'], ground: ['#d93b2b', '#f6efe1', '#d93b2b'], accent: '#1d1d1b', rim: '#c62f22', knot: '#7b3fa0', points: 12 },
  // Camp 2: sky and sun
  { rays: ['#3fb0e8', '#f2b705'], ground: ['#e0457b', '#f6efe1', '#1f8a4c'], accent: '#ffffff', rim: '#c62f22', knot: '#f2b705', points: 10 },
  // Camp 3: coffee and green leaves
  { rays: ['#1f8a4c', '#7ccf5a'], ground: ['#6b3a1f', '#f2b705', '#b8321f'], accent: '#ffffff', rim: '#5a2d16', knot: '#f2b705', points: 8 },
  // Camp 4: heather
  { rays: ['#7b3fa0', '#e0457b', '#3fb0e8'], ground: ['#f2b705', '#f6efe1', '#7b3fa0'], accent: '#1d1d1b', rim: '#c62f22', knot: '#e0457b', points: 12 },
  // Camp 5: alpine lakes
  { rays: ['#2457c5', '#3fb0e8', '#1f8a4c'], ground: ['#f6efe1', '#f2b705', '#2457c5'], accent: '#e0457b', rim: '#c62f22', knot: '#e0457b', points: 9 },
  // Camp 6: summit gold
  { rays: ['#1d1d1b', '#c62f22'], ground: ['#f2b705', '#f6efe1', '#f2b705'], accent: '#c62f22', rim: '#7d1f16', knot: '#1d1d1b', points: 8 },
];

const R = 44; // outer edge of the pattern, inside the rim coil
const COIL = 3.4; // width of one coil
const SAMPLES = 240; // colour samples around each ring

/** The thread colour at a point on the basket. */
function colourAt(b: Basket, angle: number, r: number, ring: number) {
  const t = r / R;
  const sector = (angle / (Math.PI * 2)) * b.points;
  const k = Math.floor(sector);
  const f = sector - k;
  // Star rays: thin at the centre, wide at the rim.
  const half = 0.03 + 0.27 * t;
  if (t > 0.2 && Math.abs(f - 0.5) < half) {
    // a stripe of ground colour down the middle of each ray, like the stitched veins
    if (t > 0.45 && Math.abs(f - 0.5) < 0.03) return b.ground[1];
    return b.rays[k % b.rays.length];
  }
  // Little stitch diamonds dotted between the rays.
  const between = Math.abs(f - 0.5) - half;
  if (ring % 3 === 1 && between > 0.05 && Math.abs(f < 0.5 ? f : 1 - f) < 0.035 + 0.02 * t) return b.accent;
  // Ground colour in bands from the centre out.
  return b.ground[Math.min(b.ground.length - 1, Math.floor(t * b.ground.length))];
}

function arc(r: number, a0: number, a1: number) {
  const x0 = Math.cos(a0) * r;
  const y0 = Math.sin(a0) * r;
  const x1 = Math.cos(a1) * r;
  const y1 = Math.sin(a1) * r;
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M${x0.toFixed(2)} ${y0.toFixed(2)}A${r} ${r} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
}

type Segment = { r: number; a0: number; a1: number; colour: string };

/** Each coil, split into runs of the same thread colour. */
function weave(b: Basket): Segment[] {
  const out: Segment[] = [];
  const step = (Math.PI * 2) / SAMPLES;
  for (let ring = 0, r = 6 + COIL / 2; r < R; ring++, r += COIL) {
    let start = 0;
    let colour = colourAt(b, step / 2, r, ring);
    for (let i = 1; i <= SAMPLES; i++) {
      const next = i < SAMPLES ? colourAt(b, (i + 0.5) * step, r, ring) : null;
      if (next !== colour) {
        out.push({ r, a0: start * step, a1: i * step, colour });
        start = i;
        colour = next ?? colour;
      }
    }
  }
  return out;
}

const cache = new Map<number, Segment[]>();

export default function MesobBasket({ camp, className }: { camp: number; className?: string }) {
  const index = ((camp % BASKETS.length) + BASKETS.length) % BASKETS.length;
  const b = BASKETS[index];
  if (!cache.has(index)) cache.set(index, weave(b));
  const segments = cache.get(index)!;
  const id = `mesob-${index}`;

  return (
    <svg className={className} viewBox="-50 -50 100 100" aria-hidden focusable="false">
      <defs>
        {/* light from the top left, so the lid looks round */}
        <radialGradient id={`${id}-light`} cx="0.35" cy="0.3" r="0.75">
          <stop offset="0" stopColor="#fff" stopOpacity="0.28" />
          <stop offset="0.55" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.28" />
        </radialGradient>
      </defs>

      {/* the gaps between coils show as thin dark lines */}
      <circle r={R + 1} fill="#3a2414" />

      {/* every coil, stitch by stitch */}
      <g fill="none" strokeWidth={COIL * 0.86} strokeDasharray="1.7 0.5">
        {segments.map((s, i) => (
          <path key={i} d={arc(s.r, s.a0, s.a1)} stroke={s.colour} />
        ))}
      </g>

      {/* the knot in the middle, wound in a tight spiral */}
      <circle r="6.2" fill="#3a2414" />
      <circle r="4.6" fill="none" stroke={b.knot} strokeWidth="2.6" strokeDasharray="0.8 0.3" />
      <circle r="1.8" fill={b.knot} />

      {/* the thick rim coil, wrapped in red */}
      <circle r={R + 3} fill="none" stroke="#3a2414" strokeWidth="6.4" />
      <circle r={R + 3} fill="none" stroke={b.rim} strokeWidth="5.4" strokeDasharray="1.8 0.5" />
      <circle r={R + 5.4} fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="0.5" />

      <circle r={R + 6} fill={`url(#${id}-light)`} />
    </svg>
  );
}
