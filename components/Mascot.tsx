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
  /**
   * Brings Walia to life while the learner is on the page: breathing, blinking,
   * and a loop of little emotes (wave, look around, ear twitch, hop, head tilt).
   * The drawing itself never changes; only its parts move.
   */
  animated?: boolean;
};

// Colors sampled from the Walia brand illustration (public/brand/walia-scene.jpg).
const C = {
  horn: '#4a1f0e',
  hornRidge: '#874421',
  fur: '#8c3d17',
  furShade: '#612b17',
  cream: '#f6dfb9',
  earInner: '#fddeb7',
  beard: '#5c2610',
  dark: '#3d1a0a',
  hoof: '#2e2119',
  blush: '#d9825f',
  white: '#ffffff',
};

// A tapered, ridged horn: a filled crescent with ridges clipped inside it.
function Horn({ id, flip, scale = 1 }: { id: string; flip?: boolean; scale?: number }) {
  const shape = 'M86 80 C 82 34, 62 4, 36 10 C 16 15, 8 40, 18 74 C 22 52, 30 34, 46 30 C 66 26, 92 48, 114 76 Z';
  const spine = 'M100 78 C 84 38, 62 16, 42 20 C 24 24, 16 46, 18 74';
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
  animated = false,
}: Props) {
  const leftArmUp = pose === 'cheer';
  const rightArmUp = pose === 'wave' || pose === 'cheer';

  return (
    <svg
      viewBox="0 -24 240 304"
      width={size}
      height={(size * 304) / 240}
      className={[className, animated ? 'walia-live' : ''].filter(Boolean).join(' ') || undefined}
      role="img"
      aria-label={title}
    >
      {/* ground shadow */}
      <ellipse className="w-shadow" cx="120" cy="268" rx="70" ry="9" fill="#000" opacity="0.08" />

      <g className="w-hop">
      <g className="w-breathe">
      <g className="w-head">
      {/* horns sweep back over the head */}
      <Horn id="walia-horn-l" scale={hornScale} />
      <Horn id="walia-horn-r" flip scale={hornScale} />
      </g>

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
        <g className="w-arm-l">
          <path d="M70 196 C 52 180, 44 160, 46 144" stroke={C.furShade} strokeWidth="18" strokeLinecap="round" fill="none" />
          <circle cx="46" cy="140" r="10" fill={C.hoof} />
        </g>
      ) : (
        <path d="M68 196 C 60 210, 60 222, 66 232" stroke={C.furShade} strokeWidth="18" strokeLinecap="round" fill="none" />
      )}
      {rightArmUp ? (
        <g className="w-arm-r">
          <path d="M170 196 C 188 180, 196 160, 194 144" stroke={C.furShade} strokeWidth="18" strokeLinecap="round" fill="none" />
          <circle cx="194" cy="140" r="10" fill={C.hoof} />
        </g>
      ) : (
        <path d="M172 196 C 180 210, 180 222, 174 232" stroke={C.furShade} strokeWidth="18" strokeLinecap="round" fill="none" />
      )}

      <g className="w-head">
      {/* ears */}
      <g className="w-ear-l">
        <ellipse cx="62" cy="104" rx="22" ry="11" transform="rotate(-20 62 104)" fill={C.furShade} />
        <ellipse cx="64" cy="104" rx="13" ry="6" transform="rotate(-20 64 104)" fill={C.earInner} />
      </g>
      <g className="w-ear-r">
        <ellipse cx="178" cy="104" rx="22" ry="11" transform="rotate(20 178 104)" fill={C.furShade} />
        <ellipse cx="176" cy="104" rx="13" ry="6" transform="rotate(20 176 104)" fill={C.earInner} />
      </g>

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
      <path d="M100 160 Q 104 180 112 186 Q 120 206 128 186 Q 136 180 140 160 Q 120 174 100 160 Z" fill={C.beard} />

      {/* eyes */}
      <g className="w-eyes">
        <circle cx="96" cy="110" r="17" fill={C.white} />
        <circle cx="144" cy="110" r="17" fill={C.white} />
        <g className="w-pupils">
          <circle cx="99" cy="112" r="9" fill={C.dark} />
          <circle cx="141" cy="112" r="9" fill={C.dark} />
          <circle cx="102" cy="108" r="3.2" fill={C.white} />
          <circle cx="144" cy="108" r="3.2" fill={C.white} />
        </g>
      </g>

      {/* brows */}
      <path d="M82 88 Q 94 82 106 88" stroke={C.dark} strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M134 88 Q 146 82 158 88" stroke={C.dark} strokeWidth="4" strokeLinecap="round" fill="none" />

      {/* cheeks */}
      <ellipse cx="78" cy="134" rx="9" ry="5.5" fill={C.blush} opacity="0.7" />
      <ellipse cx="162" cy="134" rx="9" ry="5.5" fill={C.blush} opacity="0.7" />
      </g>
      </g>
      </g>
    </svg>
  );
}
