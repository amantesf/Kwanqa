import { useId } from 'react';

// Ababa: a kind Ethiopian grandfather for the elders-and-blessings camp.
// Wrapped in a white gabi with a green-and-gold tilet border, a little blue
// checked shirt peeking out, white beard and a wooden walking stick.
// An illustration, drawn from scratch, not anyone in particular.

export default function Elder({ className }: { className?: string }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg className={className} viewBox="0 0 100 110" aria-hidden focusable="false">
      <defs>
        <linearGradient id={`${id}-gabi`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fbf8f1" />
          <stop offset="1" stopColor="#e4dccd" />
        </linearGradient>
        <linearGradient id={`${id}-stick`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#c98a45" />
          <stop offset="1" stopColor="#8a5526" />
        </linearGradient>
        <pattern id={`${id}-check`} width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="4" height="4" fill="#1f7fa8" />
          <rect width="2" height="2" fill="#155f80" />
          <rect x="2" y="2" width="2" height="2" fill="#3aa6d0" />
        </pattern>
        <pattern id={`${id}-tilet`} width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill="#2f6b2a" />
          <path d="M0 3 L3 0.6 L6 3 L3 5.4 Z" fill="#d9b23a" />
          <circle cx="3" cy="3" r="0.8" fill="#2f6b2a" />
        </pattern>
      </defs>

      <g className="elder-head">
        {/* neck */}
        <rect x="44" y="52" width="12" height="10" rx="4" fill="#6e3f24" />
        {/* ears */}
        <ellipse cx="31.5" cy="38" rx="3.2" ry="4.4" fill="#7a4628" />
        <ellipse cx="68.5" cy="38" rx="3.2" ry="4.4" fill="#7a4628" />
        {/* head */}
        <ellipse cx="50" cy="36" rx="18.5" ry="21" fill="#83502e" />
        {/* short grey hair */}
        <path d="M32.2 31 Q33 17 50 16 Q67 17 67.8 31 Q64 24.5 50 24 Q36 24.5 32.2 31 Z" fill="#a8a29a" />
        {/* tight grey curls */}
        <g fill="#d8d3cb">
          {[
            [37, 25], [41, 21.5], [45.5, 19.5], [50, 18.8], [54.5, 19.5], [59, 21.5], [63, 25],
            [39, 24.6], [43.4, 22.4], [48, 21.4], [52, 21.4], [56.6, 22.4], [61, 24.6], [35, 28.6], [65, 28.6],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="1.15" />
          ))}
        </g>
        {/* forehead lines */}
        <path d="M41 27.5 Q50 25.5 59 27.5 M43 30.5 Q50 29 57 30.5" fill="none" stroke="#5e3319" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
        {/* eyebrows and kind, smiling eyes */}
        <path d="M38.5 33 Q42.5 31 46 33 M54 33 Q57.5 31 61.5 33" fill="none" stroke="#e6e1d8" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M39.5 38 Q42.5 35.6 45.5 38 M54.5 38 Q57.5 35.6 60.5 38" fill="none" stroke="#2a160b" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M38 40.5 L36.5 41.6 M62 40.5 L63.5 41.6" stroke="#5e3319" strokeWidth="0.7" strokeLinecap="round" opacity="0.7" />
        {/* cheeks and nose */}
        <circle cx="41" cy="44" r="3" fill="#a3603a" opacity="0.5" />
        <circle cx="59" cy="44" r="3" fill="#a3603a" opacity="0.5" />
        <path d="M48 39.5 Q47 45 49 46 Q51 46.6 52.6 45.4" fill="none" stroke="#5e3319" strokeWidth="1.1" strokeLinecap="round" />
        {/* white beard and moustache, with a smile */}
        <path d="M33.5 42 Q34 58 50 61 Q66 58 66.5 42 Q62 50 58 50 L42 50 Q38 50 33.5 42 Z" fill="#f1eee8" />
        <path d="M41.5 49.5 Q46 46.6 50 48.2 Q54 46.6 58.5 49.5 Q55 51.8 50 50.6 Q45 51.8 41.5 49.5 Z" fill="#e3ded5" />
        <path d="M46 52.6 Q50 55 54 52.6" fill="none" stroke="#6e3f24" strokeWidth="1.2" strokeLinecap="round" />
        <g stroke="#d6d0c6" strokeWidth="0.6" strokeLinecap="round">
          <path d="M40 54 L41 57 M45 57 L45.6 59.6 M55 57 L54.4 59.6 M60 54 L59 57" />
        </g>
      </g>

      {/* shirt collar peeking out */}
      <path d="M40 60 L50 70 L60 60 L60 66 L50 74 L40 66 Z" fill={`url(#${id}-check)`} />

      {/* the gabi wrapped round his shoulders */}
      <path d="M8 110 Q8 74 26 64 Q36 58 42 62 L50 72 L58 62 Q64 58 74 64 Q92 74 92 110 Z" fill={`url(#${id}-gabi)`} />
      {/* folds */}
      <path d="M22 86 Q34 78 46 84 M18 98 Q32 90 48 96 M62 74 Q70 82 82 86" fill="none" stroke="#cfc5b3" strokeWidth="1.2" strokeLinecap="round" />
      {/* the end thrown over his shoulder, with its tilet border and fringe */}
      <path d="M56 66 Q66 63 76 70 L86 110 L66 110 Z" fill={`url(#${id}-gabi)`} />
      <path d="M58.5 67 Q66 64.6 73.6 69 L82.5 110 L77 110 L69.6 72.4 Q64 69.6 59.6 71 Z" fill={`url(#${id}-tilet)`} />
      <path d="M66 110 L67 106 M70 110 L70.6 106 M74 110 L74.4 106 M84 110 L83.6 106" stroke="#e4dccd" strokeWidth="1" strokeLinecap="round" />

      {/* the walking stick he leans on, crook by his ear */}
      <path d="M88 110 L88 40 Q88 29 80.5 29 Q74 29 74 35.5" fill="none" stroke={`url(#${id}-stick)`} strokeWidth="4.2" strokeLinecap="round" />

      {/* his hand on the stick */}
      <ellipse cx="88" cy="80" rx="5" ry="4.2" fill="#7a4628" />
      <path d="M84.5 78.5 Q88 77.2 91.5 78.5" fill="none" stroke="#5e3319" strokeWidth="0.7" />
    </svg>
  );
}
