import { useId } from 'react';

// A little parchment card of Ge'ez numerals for the numbers camp. The numerals
// are real text in the site's Ethiopic font, so they're crisp and accurate;
// they light up one after another, as if counting.

const NUMBERS = [
  ['፩', '1'],
  ['፪', '2'],
  ['፫', '3'],
  ['፬', '4'],
  ['፭', '5'],
  ['፲', '10'],
];

export default function GeezNumbers({ className }: { className?: string }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden focusable="false">
      <defs>
        <radialGradient id={`${id}-paper`} cx="0.5" cy="0.45" r="0.75">
          <stop offset="0" stopColor="#fdf3d8" />
          <stop offset="0.7" stopColor="#f3dfae" />
          <stop offset="1" stopColor="#dcbd7c" />
        </radialGradient>
      </defs>
      <g transform="rotate(-6 50 50)">
        <rect x="11" y="9" width="80" height="84" rx="3" fill="rgba(0,0,0,0.22)" transform="translate(2.4 3)" />
        <rect x="11" y="9" width="80" height="84" rx="3" fill={`url(#${id}-paper)`} />
        <rect x="14" y="12" width="74" height="78" rx="2" fill="none" stroke="#b08a48" strokeWidth="0.6" />
        <text x="51" y="25" textAnchor="middle" fontSize="11" fontWeight="800" fill="#3a2414" className="geez-font">
          ቁጥሮች
        </text>
        <line x1="22" y1="29" x2="80" y2="29" stroke="#3a2414" strokeWidth="0.6" />
        {NUMBERS.map(([geez, n], i) => {
          const x = 27 + (i % 3) * 24;
          const y = 50 + Math.floor(i / 3) * 27;
          return (
            <g key={geez} className="geez-num" style={{ animationDelay: `${0.8 + i * 0.55}s` }}>
              <text x={x} y={y} textAnchor="middle" fontSize="17" fontWeight="800" fill="#241a14" className="geez-font">
                {geez}
              </text>
              <text x={x} y={y + 9} textAnchor="middle" fontSize="6.5" fontWeight="800" fill="#7a5a2c">
                {n}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}
