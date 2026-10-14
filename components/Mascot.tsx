// Walia — Kwanqa's mascot, a Walia ibex from the Simien Mountains.
// Drawn as inline SVG so it stays crisp at any size and needs no image files.

type Pose = 'wave' | 'happy' | 'cheer';

type Props = {
  pose?: Pose;
  size?: number;
  className?: string;
  title?: string;
  /** Horn length; grows as the learner collects grass. */
  hornScale?: number;
};

const C = {
  horn: '#8c6a48',
  hornRidge: '#a9875f',
  fur: '#c4843f',
  furShade: '#a96c2f',
  cream: '#f6e3c0',
  dark: '#4a3020',
  hoof: '#33231a',
  blush: '#f0a07a',
  white: '#ffffff',
};

// A tapered, ridged horn: a filled crescent with ridges clipped inside it.
function Horn({ id, flip, scale = 1 }: { id: string; flip?: boolean; scale?: number }) {
  const shape = 'M84 80 C 72 40, 60 16, 40 20 C 28 22, 22 34, 26 48 C 34 40, 44 37, 54 40 C 74 48, 92 62, 112 76 Z';
  const spine = 'M98 78 C 80 44, 64 28, 44 30 C 34 31, 28 40, 26 48';
  return (
    <g transform={flip ? 'translate(240 0) scale(-1 1)' : undefined}>
      <g transform={`translate(98 78) scale(${scale}) translate(-98 -78)`}>
        <clipPath id={id}>
          <path d={shape} />
        </clipPath>
        <path d={shape} fill={C.horn} />
        <path
          d={spine}
          clipPath={`url(#${id})`}
          stroke={C.hornRidge}
          strokeWidth="40"
          strokeDasharray="3 8"
          fill="none"
        />
      </g>
    </g>
  );
}

export default function Mascot({
  pose = 'happy',
  size = 240,
  className,
  title = 'Walia the ibex',
  hornScale = 1,
}: Props) {
  const leftArmUp = pose === 'cheer';
  const rightArmUp = pose === 'wave' || pose === 'cheer';

  return (
    <svg
      viewBox="0 0 240 280"
      width={size}
      height={(size * 280) / 240}
      className={className}
      role="img"
      aria-label={title}
    >
      {/* ground shadow */}
      <ellipse cx="120" cy="268" rx="70" ry="9" fill="#000" opacity="0.08" />

      {/* horns sweep back over the head */}
      <Horn id="walia-horn-l" scale={hornScale} />
      <Horn id="walia-horn-r" flip scale={hornScale} />

      {/* legs */}
      <rect x="86" y="222" width="22" height="40" rx="10" fill={C.furShade} />
      <rect x="132" y="222" width="22" height="40" rx="10" fill={C.furShade} />
      <rect x="86" y="248" width="22" height="14" rx="7" fill={C.hoof} />
      <rect x="132" y="248" width="22" height="14" rx="7" fill={C.hoof} />

      {/* body */}
      <ellipse cx="120" cy="206" rx="58" ry="46" fill={C.fur} />
      <ellipse cx="120" cy="214" rx="34" ry="32" fill={C.cream} />

      {/* arms */}
      {leftArmUp ? (
        <path d="M70 196 C 52 180, 44 160, 46 144" stroke={C.furShade} strokeWidth="18" strokeLinecap="round" fill="none" />
      ) : (
        <path d="M68 196 C 60 210, 60 222, 66 232" stroke={C.furShade} strokeWidth="18" strokeLinecap="round" fill="none" />
      )}
      {rightArmUp ? (
        <path d="M170 196 C 188 180, 196 160, 194 144" stroke={C.furShade} strokeWidth="18" strokeLinecap="round" fill="none" />
      ) : (
        <path d="M172 196 C 180 210, 180 222, 174 232" stroke={C.furShade} strokeWidth="18" strokeLinecap="round" fill="none" />
      )}
      {leftArmUp && <circle cx="46" cy="140" r="10" fill={C.hoof} />}
      {rightArmUp && <circle cx="194" cy="140" r="10" fill={C.hoof} />}

      {/* ears */}
      <ellipse cx="62" cy="104" rx="22" ry="11" transform="rotate(-20 62 104)" fill={C.furShade} />
      <ellipse cx="64" cy="104" rx="13" ry="6" transform="rotate(-20 64 104)" fill={C.blush} />
      <ellipse cx="178" cy="104" rx="22" ry="11" transform="rotate(20 178 104)" fill={C.furShade} />
      <ellipse cx="176" cy="104" rx="13" ry="6" transform="rotate(20 176 104)" fill={C.blush} />

      {/* head */}
      <ellipse cx="120" cy="116" rx="58" ry="54" fill={C.fur} />
      {/* forehead stripe */}
      <path d="M112 66 Q 120 62 128 66 L 124 100 Q 120 104 116 100 Z" fill={C.furShade} />

      {/* muzzle */}
      <ellipse cx="120" cy="146" rx="36" ry="26" fill={C.cream} />
      <ellipse cx="120" cy="136" rx="11" ry="7" fill={C.dark} />
      <ellipse cx="116" cy="134" rx="3" ry="2" fill={C.white} opacity="0.7" />
      <path d="M108 152 Q 120 163 132 152" stroke={C.dark} strokeWidth="4" strokeLinecap="round" fill="none" />

      {/* beard */}
      <path d="M112 168 Q 120 190 128 168 Z" fill={C.dark} />

      {/* eyes */}
      <circle cx="96" cy="110" r="17" fill={C.white} />
      <circle cx="144" cy="110" r="17" fill={C.white} />
      <circle cx="99" cy="112" r="9" fill={C.dark} />
      <circle cx="141" cy="112" r="9" fill={C.dark} />
      <circle cx="102" cy="108" r="3.2" fill={C.white} />
      <circle cx="144" cy="108" r="3.2" fill={C.white} />

      {/* brows */}
      <path d="M82 88 Q 94 82 106 88" stroke={C.dark} strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M134 88 Q 146 82 158 88" stroke={C.dark} strokeWidth="4" strokeLinecap="round" fill="none" />

      {/* cheeks */}
      <ellipse cx="78" cy="134" rx="9" ry="5.5" fill={C.blush} opacity="0.7" />
      <ellipse cx="162" cy="134" rx="9" ry="5.5" fill={C.blush} opacity="0.7" />
    </svg>
  );
}
