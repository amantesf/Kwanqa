import { useId } from 'react';

// A sini: the small handleless cup of the coffee ceremony, white porcelain
// with a band painted in the bright colours of Ethiopian church art, full of
// buna with a little steam rising. Drawn from scratch for the coffee camp.

// Colours of the painted band, panel by panel.
const PANELS = ['#f2b705', '#c62f22', '#2457c5', '#1f8a4c', '#f2b705', '#7b3fa0', '#c62f22', '#3fb0e8', '#1f8a4c'];

export default function SiniCup({ className }: { className?: string }) {
  const id = useId().replace(/:/g, '');
  // The cup: wide at the rim, sides tapering in, then rounding onto a small foot.
  const body = 'M-30 -14 C -29.5 2, -25 18, -14 25 L 14 25 C 25 18, 29.5 2, 30 -14 Z';
  const panelW = 60 / PANELS.length;

  return (
    <svg className={className} viewBox="-50 -50 100 100" aria-hidden focusable="false">
      <defs>
        <clipPath id={`${id}-body`}>
          <path d={body} />
        </clipPath>
        {/* porcelain: bright where the light hits, cooler round the side */}
        <linearGradient id={`${id}-glaze`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#e4e6ea" />
          <stop offset="0.35" stopColor="#ffffff" />
          <stop offset="0.75" stopColor="#f3f4f6" />
          <stop offset="1" stopColor="#c9ccd3" />
        </linearGradient>
        <radialGradient id={`${id}-buna`} cx="0.45" cy="0.4" r="0.6">
          <stop offset="0" stopColor="#5a3018" />
          <stop offset="0.8" stopColor="#2a140a" />
        </radialGradient>
        <linearGradient id={`${id}-shade`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.18" />
          <stop offset="0.3" stopColor="#000" stopOpacity="0" />
          <stop offset="0.8" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.28" />
        </linearGradient>
      </defs>

      {/* shadow on the table */}
      <ellipse cx="2" cy="30.5" rx="22" ry="3.4" fill="rgba(0,0,0,0.22)" />

      {/* steam */}
      <g className="sini-steam" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" opacity="0.85">
        <path d="M-10 -22 c -4 -6, 4 -10, 0 -16 s 4 -10, 0 -14" />
        <path d="M2 -22 c -4 -6, 4 -10, 0 -16 s 4 -10, 0 -14" />
        <path d="M14 -22 c -4 -6, 4 -10, 0 -16 s 4 -10, 0 -14" />
      </g>

      {/* the foot it stands on */}
      <path d="M-13 24 L 13 24 L 11.5 28.5 C 6 29.6, -6 29.6, -11.5 28.5 Z" fill="#dfe1e6" />
      {/* the cup */}
      <path d={body} fill={`url(#${id}-glaze)`} />
      <g clipPath={`url(#${id}-body)`}>
        {/* the painted band: panels of colour with little figures in the church-art style */}
        <rect x="-30" y="-13" width="60" height="17" fill="#1d1d1b" />
        {PANELS.map((c, i) => {
          const x = -30 + i * panelW;
          const cx = x + panelW / 2;
          return (
            <g key={i}>
              <rect x={x + 0.4} y="-12.4" width={panelW - 0.8} height="15.8" fill={c} />
              {/* a robed figure: head, halo and gown, just a few strokes */}
              <circle cx={cx} cy="-8" r="2.6" fill="#f2b705" opacity={c === '#f2b705' ? 0 : 0.9} />
              <circle cx={cx} cy="-7.6" r="1.5" fill="#7a4a2a" />
              <path d={`M${cx - 2.4} 3.4 L${cx - 1.6} -5.6 L${cx + 1.6} -5.6 L${cx + 2.4} 3.4 Z`} fill={PANELS[(i + 3) % PANELS.length]} />
              <path d={`M${cx - 1.6} -5.6 L${cx + 1.6} -5.6`} stroke="#1d1d1b" strokeWidth="0.5" />
            </g>
          );
        })}
        {/* gold lines above and below the band */}
        <rect x="-30" y="-13.6" width="60" height="1.2" fill="#d4a017" />
        <rect x="-30" y="4" width="60" height="1.2" fill="#d4a017" />
        {/* the round of the cup, so the band wraps instead of sitting flat */}
        <rect x="-30" y="-16" width="60" height="44" fill={`url(#${id}-shade)`} />
        {/* a shine down the left of the cup */}
        <path d="M-24 6 C -22 14, -18 19, -12 22" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" opacity="0.85" />
      </g>

      {/* the rim and the coffee inside */}
      <ellipse cx="0" cy="-14" rx="30" ry="5.8" fill="#f7f8fa" />
      <ellipse cx="0" cy="-14" rx="27.6" ry="4.7" fill={`url(#${id}-buna)`} />
      <ellipse cx="-5" cy="-15.3" rx="10" ry="1.4" fill="#b07a4a" opacity="0.45" />
      <ellipse cx="0" cy="-14" rx="30" ry="5.8" fill="none" stroke="#d9dbe0" strokeWidth="0.6" />

    </svg>
  );
}
