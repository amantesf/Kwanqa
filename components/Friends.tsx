import { useId } from 'react';

// Two friends catching up in the street: a young man in a green shirt and a
// woman in a white netela with a tilet border, laughing together while speech
// bubbles pop up between them. For the daily-life-and-feelings camp.
// An illustration, drawn from scratch, not anyone in particular.

export default function Friends({ className, greeting = 'ሰላም!' }: { className?: string; greeting?: string }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg className={className} viewBox="0 0 140 112" aria-hidden focusable="false">
      <defs>
        <linearGradient id={`${id}-shirt`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8fb89a" />
          <stop offset="1" stopColor="#5e8a6b" />
        </linearGradient>
        <linearGradient id={`${id}-netela`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#e6e0d4" />
        </linearGradient>
        <pattern id={`${id}-tilet`} width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill="#c62f22" />
          <path d="M0 3 L3 0.6 L6 3 L3 5.4 Z" fill="#1f8a4c" />
          <circle cx="3" cy="3" r="0.9" fill="#f2b705" />
        </pattern>
      </defs>

      {/* --- him --- */}
      <g className="friend-him">
        <rect x="36" y="52" width="12" height="11" rx="4" fill="#6a3b20" />
        <ellipse cx="27.5" cy="40" rx="3" ry="4.2" fill="#7a4628" />
        <ellipse cx="56.5" cy="40" rx="3" ry="4.2" fill="#7a4628" />
        <ellipse cx="42" cy="39" rx="15" ry="17.5" fill="#83502e" />
        {/* short black hair */}
        <path d="M27 36 Q26 20 42 20 Q58 20 57 36 Q55 28 42 27.5 Q29 28 27 36 Z" fill="#1d1410" />
        {/* laughing eyes, brows, nose and a big smile */}
        <path d="M33 32.5 Q36 31 39 32.5 M45 32.5 Q48 31 51 32.5" fill="none" stroke="#1d1410" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M33.5 37.5 Q36 35.4 38.5 37.5 M45.5 37.5 Q48 35.4 50.5 37.5" fill="none" stroke="#1d1410" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M41 38 Q40 43 42 43.6 Q43.6 43.8 44.4 43" fill="none" stroke="#5e3319" strokeWidth="1" strokeLinecap="round" />
        <path d="M35.5 46.5 Q42 54 48.5 46.5 Z" fill="#3a140c" />
        <path d="M36.6 47 Q42 49.2 47.4 47 L47 48.2 Q42 50 37 48.2 Z" fill="#fff" />
        <circle cx="34" cy="44" r="2.4" fill="#a3603a" opacity="0.45" />
        <circle cx="50" cy="44" r="2.4" fill="#a3603a" opacity="0.45" />

        {/* green shirt with an open collar */}
        <path d="M8 112 Q8 74 26 66 Q32 63 36 62 L42 70 L48 62 Q52 63 58 66 Q74 74 74 112 Z" fill={`url(#${id}-shirt)`} />
        <path d="M36 62 L42 70 L48 62 L49.5 67 L42 75 L34.5 67 Z" fill="#7a4628" />
        <path d="M35 61 L42 70 L37.5 73 L32 64 Z M49 61 L42 70 L46.5 73 L52 64 Z" fill="#a6cbb0" />
        <path d="M42 75 L42 112" stroke="#4f7a5b" strokeWidth="0.8" />
        <circle cx="44" cy="84" r="1" fill="#e9f2eb" />
        <circle cx="44" cy="96" r="1" fill="#e9f2eb" />
        <path d="M20 92 Q24 84 26 78" fill="none" stroke="#4f7a5b" strokeWidth="1" strokeLinecap="round" />
      </g>

      {/* his hand, open, as he talks */}
      <g className="friend-hand">
        <path d="M58 106 Q62 94 67 88" fill="none" stroke="#5e8a6b" strokeWidth="9" strokeLinecap="round" />
        <ellipse cx="64.6" cy="82" rx="1.9" ry="3.6" fill="#7a4628" transform="rotate(-35 64.6 82)" />
        <ellipse cx="69.5" cy="79" rx="5" ry="6.8" fill="#83502e" transform="rotate(20 69.5 79)" />
        <path d="M70.2 73.6 L69.6 77.6 M73 74.8 L71.8 78.4" stroke="#6a3b20" strokeWidth="0.7" strokeLinecap="round" />
      </g>

      {/* --- her --- */}
      <g className="friend-her">
        {/* the netela behind her head and over her shoulders */}
        <path d="M84 62 Q80 40 86 30 Q92 20 104 20 Q116 20 121 32 Q125 44 121 64 Q134 72 138 112 L70 112 Q72 76 84 62 Z" fill={`url(#${id}-netela)`} />
        <rect x="97" y="55" width="11" height="10" rx="4" fill="#5e341c" />
        {/* face, with hair peeking out under the netela */}
        <ellipse cx="102.5" cy="42" rx="13" ry="15.5" fill="#6e3f24" />
        <path d="M89.6 38 Q90 27 102.5 26.5 Q115 27 115.4 38 Q112 31.5 102.5 31 Q93 31.5 89.6 38 Z" fill="#1d1410" />
        {/* smiling eyes, brows, nose and a laugh */}
        <path d="M94.5 35.4 Q97 34 99.5 35.4 M105.5 35.4 Q108 34 110.5 35.4" fill="none" stroke="#1d1410" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M95 40 Q97.2 38 99.4 40 M105.6 40 Q107.8 38 110 40" fill="none" stroke="#1d1410" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M101.6 40.5 Q100.8 44.5 102.6 45 Q104 45.2 104.6 44.5" fill="none" stroke="#4a2612" strokeWidth="0.9" strokeLinecap="round" />
        <path d="M97 48 Q102.5 54.5 108 48 Z" fill="#3a140c" />
        <path d="M98 48.4 Q102.5 50.4 107 48.4 L106.6 49.5 Q102.5 51 98.4 49.5 Z" fill="#fff" />
        <circle cx="95.5" cy="45.5" r="2.3" fill="#a3603a" opacity="0.5" />
        <circle cx="109.5" cy="45.5" r="2.3" fill="#a3603a" opacity="0.5" />
        <circle cx="89.8" cy="47" r="1.3" fill="#f2b705" />
        {/* the netela's front edges framing her face */}
        <path d="M86 30 Q92 20 104 20 Q116 20 121 32 Q116 25 104 24.5 Q92 25 87.5 34 Q86 46 88.6 58 L84 62 Q80 42 86 30 Z" fill="#f6f2ea" />
        {/* her dress, and the netela wrapped across with its tilet border */}
        <path d="M84 70 Q96 64 102.5 66 Q109 64 121 70 L126 112 L80 112 Z" fill="#fbf8f1" />
        <path d="M80 112 Q86 84 120 66 L126 70 Q96 88 92 112 Z" fill={`url(#${id}-netela)`} />
        <path d="M84.5 112 Q90 90 121.5 68.2 L124.4 70 Q94 90 89 112 Z" fill={`url(#${id}-tilet)`} />
        <path d="M108 112 Q110 96 118 84" fill="none" stroke="#d8d0c0" strokeWidth="1" strokeLinecap="round" />
      </g>

      {/* what they're saying */}
      <g className="friend-bubble friend-bubble-1">
        <path d="M44 4 H70 Q74 4 74 8 V15 Q74 19 70 19 H58 L52 24 L53 19 H48 Q44 19 44 15 V8 Q44 4 48 4 Z" fill="#fff" />
        <text x="59" y="15" textAnchor="middle" fontSize="8" fontWeight="800" fill="#241a14" className="geez-font">
          {greeting}
        </text>
      </g>
      <g className="friend-bubble friend-bubble-2">
        <path d="M80 8 H96 Q100 8 100 12 V18 Q100 22 96 22 H94 L95 27 L88 22 H84 Q80 22 80 18 V12 Q80 8 84 8 Z" fill="#fff" />
        <path d="M90 19.5 C 84 15.5, 85 11, 88 11 C 89.2 11, 90 12, 90 13 C 90 12, 90.8 11, 92 11 C 95 11, 96 15.5, 90 19.5 Z" fill="#e0457b" />
      </g>
    </svg>
  );
}
