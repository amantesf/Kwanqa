// A woven basket lid (mesob / sefed), drawn from scratch: a red rim, coloured
// wedges with white stitch diamonds, a zigzag ring and a knot in the middle.
// Each camp gets its own basket, like no two baskets at the market are alike.

type Basket = { colors: string[]; wedges: number; rim: string; knot: string; zigzag: string };

const BASKETS: Basket[] = [
  // Camp 1: market colours
  { colors: ['#ffc233', '#1f8a4c', '#e0457b', '#2457c5'], wedges: 12, rim: '#c62f22', knot: '#7b3fa0', zigzag: '#ffffff' },
  // Camp 2: sky and sun
  { colors: ['#ffc233', '#e0457b', '#ffffff', '#3fb0e8'], wedges: 8, rim: '#c62f22', knot: '#1f8a4c', zigzag: '#1f8a4c' },
  // Camp 3: coffee, green leaves
  { colors: ['#1f8a4c', '#ffc233', '#b8321f', '#7ccf5a'], wedges: 10, rim: '#6b3a1f', knot: '#ffc233', zigzag: '#ffffff' },
  // Camp 4: heather
  { colors: ['#7b3fa0', '#e0457b', '#ffc233', '#3fb0e8'], wedges: 16, rim: '#c62f22', knot: '#ffffff', zigzag: '#ffc233' },
  // Camp 5: alpine lakes
  { colors: ['#3fb0e8', '#ffffff', '#1f8a4c', '#ffc233'], wedges: 12, rim: '#c62f22', knot: '#e0457b', zigzag: '#e0457b' },
  // Camp 6: summit gold
  { colors: ['#ffc233', '#c62f22', '#1d1d1b', '#ffffff'], wedges: 8, rim: '#7d1f16', knot: '#ffc233', zigzag: '#ffffff' },
];

const R = 45; // inner radius (inside the rim)

function point(angle: number, radius: number) {
  return [Math.cos(angle) * radius, Math.sin(angle) * radius] as const;
}

function wedgePath(a0: number, a1: number) {
  const [x0, y0] = point(a0, R);
  const [x1, y1] = point(a1, R);
  return `M0 0 L${x0.toFixed(2)} ${y0.toFixed(2)} A${R} ${R} 0 0 1 ${x1.toFixed(2)} ${y1.toFixed(2)} Z`;
}

function diamond(cx: number, cy: number, r: number, angle: number) {
  const pts = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((t, i) => {
    const rr = i % 2 ? r * 0.55 : r; // long along the radius, narrow across it
    return `${(cx + Math.cos(angle + t) * rr).toFixed(2)},${(cy + Math.sin(angle + t) * rr).toFixed(2)}`;
  });
  return pts.join(' ');
}

export default function MesobBasket({ camp, className }: { camp: number; className?: string }) {
  const b = BASKETS[((camp % BASKETS.length) + BASKETS.length) % BASKETS.length];
  const step = (Math.PI * 2) / b.wedges;
  const zig = Array.from({ length: b.wedges * 4 + 1 }, (_, i) => {
    const [x, y] = point(i * (step / 4), i % 2 ? 31 : 27);
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(' ');

  return (
    <svg className={className} viewBox="-50 -50 100 100" aria-hidden focusable="false">
      <circle r="50" fill={b.rim} />
      <circle r="47.5" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" strokeDasharray="1.6 1.6" />
      {Array.from({ length: b.wedges }, (_, i) => (
        <path key={`w${i}`} d={wedgePath(i * step, (i + 1) * step)} fill={b.colors[i % b.colors.length]} />
      ))}
      {/* white stitch diamonds running out along each wedge */}
      {Array.from({ length: b.wedges }, (_, i) => {
        const a = (i + 0.5) * step;
        return [14, 21, 37, 42].map(r => {
          const [x, y] = point(a, r);
          return (
            <polygon
              key={`d${i}-${r}`}
              points={diamond(x, y, r > 30 ? 2.6 : 2.2, a)}
              fill={b.colors[i % b.colors.length] === '#ffffff' ? '#e0457b' : '#ffffff'}
              opacity="0.92"
            />
          );
        });
      })}
      <polyline points={zig} fill="none" stroke={b.zigzag} strokeWidth="2.2" strokeLinejoin="round" />
      {/* the coils of the weave */}
      {Array.from({ length: 14 }, (_, i) => (
        <circle key={`c${i}`} r={4 + i * 3} fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
      ))}
      <circle r="8" fill={b.rim} />
      <circle r="5.5" fill={b.knot} />
      <circle r="2.2" fill={b.rim} />
    </svg>
  );
}
