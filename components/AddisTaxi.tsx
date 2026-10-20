import { useId } from 'react';

// The blue-and-white Addis Ababa taxi: an old boxy sedan, blue below and white
// on top. Drawn from scratch for the directions-and-taxis camp; it drives in
// from the side with its wheels turning.

function Wheel({ x }: { x: number }) {
  return (
    <g transform={`translate(${x} 47)`}>
      <circle r="8.6" fill="#1b1b1b" />
      <g className="taxi-wheel">
        <circle r="5.4" fill="#c9ced6" />
        <circle r="5.4" fill="none" stroke="#9aa1ab" strokeWidth="0.8" />
        {[0, 72, 144, 216, 288].map(a => (
          <circle
            key={a}
            cx={Math.cos((a * Math.PI) / 180) * 3.2}
            cy={Math.sin((a * Math.PI) / 180) * 3.2}
            r="0.9"
            fill="#6b727c"
          />
        ))}
        <circle r="1.5" fill="#8a919b" />
      </g>
    </g>
  );
}

export default function AddisTaxi({ className }: { className?: string }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg className={className} viewBox="0 0 124 64" aria-hidden focusable="false">
      <defs>
        <linearGradient id={`${id}-paint`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a8cf0" />
          <stop offset="0.55" stopColor="#1f6fd6" />
          <stop offset="1" stopColor="#1757ad" />
        </linearGradient>
        <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5d7186" />
          <stop offset="1" stopColor="#2b3a4a" />
        </linearGradient>
      </defs>

      {/* shadow on the road */}
      <ellipse cx="62" cy="56" rx="54" ry="3.4" fill="rgba(0,0,0,0.25)" />

      {/* exhaust puffs from the back */}
      <g className="taxi-puff" fill="rgba(255,255,255,0.75)">
        <circle cx="5" cy="47" r="2.6" />
        <circle cx="0.5" cy="44" r="1.8" />
      </g>

      <g className="taxi-body">
        {/* the white top: roof and pillars */}
        <path d="M31 30 L41 15.5 Q42 14.5 44 14.5 L77 14.5 Q79 14.5 80.5 15.5 L93 30 Z" fill="#f4f5f7" />
        {/* windows */}
        <path d="M36.5 29 L44.5 17.5 L58 17.5 L58 29 Z" fill={`url(#${id}-glass)`} />
        <path d="M61 29 L61 17.5 L77 17.5 L87.5 29 Z" fill={`url(#${id}-glass)`} />
        <path d="M48 18.5 L42.5 27.5" stroke="#fff" strokeWidth="1.4" opacity="0.3" strokeLinecap="round" />
        <path d="M69 18.5 L63.5 27.5" stroke="#fff" strokeWidth="1.4" opacity="0.3" strokeLinecap="round" />

        {/* the blue body: boxy trunk at the back, long hood at the front */}
        <path
          d="M9 33 Q9 30 12 30 L31 29.5 L93 29.5 L112 32 Q116 32.6 116.4 36 L117 44 Q117 47 114 47 L10 47 Q7.4 47 7.4 44.4 Z"
          fill={`url(#${id}-paint)`}
        />
        {/* wheel arches */}
        <path d="M19 47 A 11 11 0 0 1 41 47 Z" fill="#14315c" />
        <path d="M81 47 A 11 11 0 0 1 103 47 Z" fill="#14315c" />

        {/* door lines, trim and handles */}
        <path d="M59.5 30 L59.5 46.5 M33 30.5 L33 46.5 M86 30.5 L86.5 46.5" stroke="#14478e" strokeWidth="0.7" />
        <rect x="10" y="38" width="105" height="1.6" rx="0.8" fill="#1d1d1b" />
        <rect x="47" y="33.4" width="5" height="1.3" rx="0.6" fill="#d6dae0" />
        <rect x="73" y="33.4" width="5" height="1.3" rx="0.6" fill="#d6dae0" />
        {/* side mirror */}
        <path d="M88 27 L92 26 L92.6 29 L88.6 29.6 Z" fill="#1d1d1b" />

        {/* lights and bumpers */}
        <rect x="113.2" y="34.2" width="3.4" height="3.4" rx="0.8" fill="#fff6c9" />
        <rect x="112.6" y="38.6" width="2.4" height="1.6" rx="0.5" fill="#f2a516" />
        <rect x="7.6" y="34" width="2.6" height="3.6" rx="0.6" fill="#d9302a" />
        <rect x="111" y="42.4" width="8" height="3.2" rx="1.4" fill="#1d1d1b" />
        <rect x="5" y="42.4" width="8.4" height="3.2" rx="1.4" fill="#1d1d1b" />

        {/* a shine along the top of the body */}
        <path d="M14 32 L108 33" stroke="#fff" strokeWidth="0.9" opacity="0.4" strokeLinecap="round" />
      </g>

      <Wheel x={30} />
      <Wheel x={92} />
    </svg>
  );
}
