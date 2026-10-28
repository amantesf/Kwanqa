import { useId, type ReactNode } from 'react';
import type { Stamp, StampId } from '@/lib/passport';

// A round rubber-stamp drawing for each place in the Kwanqa passport: the
// place's name around the top, its Amharic name around the bottom, and a
// little picture of what it's famous for in the middle. Locked stamps are a
// faint grey outline waiting to be collected.

/** Each picture is drawn in a 60×60 box centred on (80, 80), in the stamp's ink. */
const ICONS: Record<StampId, (ink: string) => ReactNode> = {
  // Bete Giyorgis from above: a cross-shaped church in its rock-cut pit
  lalibela: ink => (
    <g>
      <rect x="54" y="54" width="52" height="52" rx="4" fill="none" stroke={ink} strokeWidth="3" strokeDasharray="5 3" />
      <path
        d="M73 58 h14 v8 h7 v7 h8 v14 h-8 v7 h-7 v8 h-14 v-8 h-7 v-7 h-8 v-14 h8 v-7 h7 z"
        fill={ink}
      />
      <path d="M80 66 v28 M66 80 h28" stroke="#fff" strokeWidth="2.4" opacity="0.7" />
    </g>
  ),
  // Fasilides' castle: a square keep between two domed round towers
  gondar: ink => (
    <g fill={ink}>
      <path d="M66 106 V74 h4 v-5 h4 v5 h4 v-5 h4 v5 h4 v-5 h4 v5 h4 V106 z" />
      <path d="M52 106 V72 a7 7 0 0 1 14 0 V106 z" />
      <path d="M94 106 V72 a7 7 0 0 1 14 0 V106 z" />
      <path d="M52 66 a7 7 0 0 1 14 0 z M94 66 a7 7 0 0 1 14 0 z" opacity="0.8" />
      <rect x="75" y="92" width="10" height="14" rx="5" fill="#fff" />
      <rect x="71" y="80" width="5" height="6" fill="#fff" />
      <rect x="84" y="80" width="5" height="6" fill="#fff" />
    </g>
  ),
  // the Obelisk of Axum, with its carved false windows
  axum: ink => (
    <g>
      <path d="M71 108 L74 58 Q80 48 86 58 L89 108 Z" fill={ink} />
      {[66, 76, 86, 96].map(y => (
        <g key={y}>
          <rect x="76" y={y} width="3" height="5" fill="#fff" />
          <rect x="81" y={y} width="3" height="5" fill="#fff" />
        </g>
      ))}
      <rect x="64" y="106" width="32" height="4" rx="2" fill={ink} />
    </g>
  ),
  // a papyrus tankwa on the lake's waves
  tana: ink => (
    <g>
      <path d="M54 86 Q80 102 106 86 Q100 96 80 97 Q60 96 54 86 Z" fill={ink} />
      <path d="M60 87 l4 -2 M68 90 l4 -2 M76 91 l4 -2 M84 91 l4 -2 M92 89 l4 -2" stroke="#fff" strokeWidth="1.6" />
      <circle cx="82" cy="70" r="4" fill={ink} />
      <path d="M82 74 v12 M82 78 l9 -9 M91 69 l4 18" stroke={ink} strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M52 104 q7 -5 14 0 t14 0 t14 0 t14 0" stroke={ink} strokeWidth="3" fill="none" strokeLinecap="round" />
    </g>
  ),
  // one of Harar's gates in the old town wall
  harar: ink => (
    <g fill={ink}>
      <path d="M52 108 V76 h6 v-6 h6 v6 h6 v-6 h20 v6 h6 v-6 h6 v6 h6 V108 z" />
      <path d="M68 108 V88 a12 12 0 0 1 24 0 V108 z" fill="#fff" />
      <path d="M72 108 V89 a8 8 0 0 1 16 0 V108 z" />
      <rect x="77" y="56" width="6" height="14" rx="3" />
      <circle cx="80" cy="54" r="3" />
    </g>
  ),
  // the desert sun over a stack of salt bars
  danakil: ink => (
    <g>
      <circle cx="80" cy="64" r="9" fill={ink} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map(a => (
        <path
          key={a}
          d="M80 50 v-4"
          stroke={ink}
          strokeWidth="3"
          strokeLinecap="round"
          transform={`rotate(${a} 80 64)`}
        />
      ))}
      <rect x="58" y="96" width="44" height="10" rx="2" fill={ink} />
      <rect x="62" y="86" width="36" height="10" rx="2" fill={ink} opacity="0.75" />
      <rect x="66" y="78" width="28" height="8" rx="2" fill={ink} opacity="0.55" />
      <path d="M58 101 h44 M62 91 h36" stroke="#fff" strokeWidth="1.4" />
    </g>
  ),
  // an Ethiopian wolf's head: tall ears, long red snout
  bale: ink => (
    <g>
      <path
        d="M62 58 L70 74 L80 70 L90 74 L98 58 L100 80 L92 92 L84 106 Q80 110 76 106 L68 92 L60 80 Z"
        fill={ink}
      />
      <path d="M66 64 L71 74 M94 64 L89 74" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      <circle cx="73" cy="83" r="2.6" fill="#fff" />
      <circle cx="87" cy="83" r="2.6" fill="#fff" />
      <path d="M72 94 Q80 100 88 94 L84 104 Q80 107 76 104 Z" fill="#fff" opacity="0.85" />
      <circle cx="80" cy="104" r="2.6" fill={ink} />
    </g>
  ),
  // the summit, with Ethiopia's flag on top
  'ras-dashen': ink => (
    <g>
      <path d="M50 108 L74 70 L82 80 L90 66 L110 108 Z" fill={ink} />
      <path d="M74 70 L82 80 L90 66 L86 78 L80 84 Z" fill="#fff" opacity="0.35" />
      <path d="M90 66 V48" stroke={ink} strokeWidth="2.5" strokeLinecap="round" />
      <rect x="91" y="48" width="14" height="3.4" fill="#078930" />
      <rect x="91" y="51.4" width="14" height="3.4" fill="#fcdd09" />
      <rect x="91" y="54.8" width="14" height="3.4" fill="#da121a" />
      <circle cx="98" cy="53.1" r="2.2" fill="#0f47af" />
    </g>
  ),
};

export default function PassportStamp({
  stamp,
  earned,
  size = 160,
  tilt = 0,
  className,
}: {
  stamp: Stamp;
  earned: boolean;
  size?: number;
  /** A small rotation, so a page of stamps looks hand-stamped. */
  tilt?: number;
  className?: string;
}) {
  const id = useId().replace(/:/g, '');
  const ink = earned ? stamp.ink : '#c9c4bd';
  return (
    <svg
      viewBox="0 0 160 160"
      width={size}
      height={size}
      className={className}
      style={{ transform: `rotate(${tilt}deg)` }}
      role="img"
      aria-label={earned ? `${stamp.name} stamp` : `${stamp.name} stamp, not collected yet`}
    >
      <defs>
        <path id={`${id}-top`} d="M26 80 A54 54 0 0 1 134 80" />
        <path id={`${id}-bottom`} d="M30 82 A50 50 0 0 0 130 82" />
      </defs>
      <circle cx="80" cy="80" r="74" fill={earned ? '#fff' : 'none'} stroke={ink} strokeWidth="4" />
      <circle cx="80" cy="80" r="66" fill="none" stroke={ink} strokeWidth="1.6" strokeDasharray={earned ? '0' : '4 4'} />
      <circle cx="80" cy="80" r="40" fill="none" stroke={ink} strokeWidth="1.6" opacity="0.5" />
      <text fill={ink} fontSize="13" fontWeight="900" letterSpacing="2.4">
        <textPath href={`#${id}-top`} startOffset="50%" textAnchor="middle">
          {stamp.name.toUpperCase()}
        </textPath>
      </text>
      <text fill={ink} fontSize="13" fontWeight="800" letterSpacing="1">
        <textPath href={`#${id}-bottom`} startOffset="50%" textAnchor="middle" lang="am">
          {stamp.amharic}
        </textPath>
      </text>
      <path d="M17 80 l3 -3 l3 3 l-3 3 z M137 80 l3 -3 l3 3 l-3 3 z" fill={ink} />
      <g opacity={earned ? 1 : 0.55}>{ICONS[stamp.id](ink)}</g>
    </svg>
  );
}
