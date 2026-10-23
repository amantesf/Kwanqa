// Walia — Kwanqa's mascot, a Walia ibex from the Simien Mountains.
// Drawn as inline SVG so it stays crisp at any size and needs no image files:
// a big round head with tall ridged horns, big bright eyes, a cream muzzle
// with an open smile, a little goatee and a cream belly (public/brand/walia.png).

import { useId } from 'react';

type Pose = 'wave' | 'happy' | 'cheer';

/**
 * How Walia feels during practice: puzzling over the question, celebrating a
 * right answer, or disappointed by a wrong one. Changes his face and adds a
 * little prop ("?" bubble, sparkles, sweat drop); the CSS animates it.
 */
export type Mood = 'thinking' | 'cheer' | 'sad';

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
  mood?: Mood;
  /**
   * Walia is speaking: his mouth opens as wide as the CSS variable `--mouth`
   * (0 closed to 1 wide open) on him or any parent, and his head moves a little.
   * Talk with Walia sets `--mouth` from the loudness of his voice.
   */
  talking?: boolean;
  /** Walia is listening: ears perked up, leaning in. */
  listening?: boolean;
};

// Colors sampled from the Walia illustration.
const C = {
  horn: '#843a18',
  hornRidge: '#b55a2a',
  hornShade: '#662d16',
  fur: '#a84f23',
  furShade: '#8e4019',
  cream: '#f7e3b0',
  earInner: '#f3e4b6',
  brow: '#733518',
  nose: '#612c16',
  mouth: '#6e2416',
  tongue: '#f46a4d',
  beard: '#5f2e19',
  hoof: '#523224',
  pupil: '#3f3835',
  white: '#ffffff',
};

// Eye centres and size.
const EYE_L = { x: 87, y: 118 };
const EYE_R = { x: 153, y: 118 };
const EYE_RX = 21;
const EYE_RY = 24;

// A tall horn that arches up from the head and curls down past the ear,
// with lighter raised ridges across it.
function Horn({ id, flip, scale = 1 }: { id: string; flip?: boolean; scale?: number }) {
  // Longer horns grow mostly upward, so they stay inside the drawing.
  const sx = 1 + (scale - 1) * 0.4;
  const shape =
    'M107 66 C 99 30, 73 2, 46 3 C 19 4, 5 34, 11 68 C 13 80, 17 88, 21 93 Q 27 97, 30 90 C 25 66, 25 32, 46 27 C 66 23, 80 46, 86 76 Z';
  const spine = 'M97 70 C 89 36, 70 14, 46 15 C 23 16, 13 48, 24 92';
  return (
    <g transform={flip ? 'translate(240 0) scale(-1 1)' : undefined}>
      <g transform={`translate(94 70) scale(${sx} ${scale}) translate(-94 -70)`}>
        <clipPath id={id}>
          <path d={shape} />
        </clipPath>
        <path d={shape} fill={C.horn} />
        <g clipPath={`url(#${id})`}>
          {/* shade along the inside of the curve */}
          <path d="M88 80 C 80 46, 64 26, 46 29 C 28 32, 24 62, 30 92" stroke={C.hornShade} strokeWidth="7" fill="none" />
          {/* the raised ridges */}
          <path d={spine} stroke={C.hornRidge} strokeWidth="44" strokeDasharray="6.5 19" strokeDashoffset="-6" fill="none" />
        </g>
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
  mood,
  talking = false,
  listening = false,
}: Props) {
  const uid = useId().replace(/:/g, '');
  const leftArmUp = mood ? mood === 'cheer' : pose === 'cheer';
  const rightArmUp = mood ? mood === 'cheer' : pose === 'wave' || pose === 'cheer';
  const chinHoof = mood === 'thinking'; // hoof on chin, hmm…
  // where the pupils look: up and away while thinking, down when sad
  const look = mood === 'thinking' ? [5, -6] : mood === 'sad' ? [-1, 6] : [0, 0];

  return (
    <svg
      viewBox="0 -24 240 304"
      width={size}
      height={(size * 304) / 240}
      className={
        [
          className,
          animated ? 'walia-live' : '',
          mood ? `walia-mood mood-${mood}` : '',
          talking ? 'walia-talking' : '',
          listening ? 'walia-listening' : '',
        ]
          .filter(Boolean)
          .join(' ') || undefined
      }
      role="img"
      aria-label={title}
    >
      <defs>
        <clipPath id={`${uid}-eye-l`}>
          <ellipse cx={EYE_L.x} cy={EYE_L.y} rx={EYE_RX} ry={EYE_RY} />
        </clipPath>
        <clipPath id={`${uid}-eye-r`}>
          <ellipse cx={EYE_R.x} cy={EYE_R.y} rx={EYE_RX} ry={EYE_RY} />
        </clipPath>
      </defs>

      {/* ground shadow */}
      <ellipse className="w-shadow" cx="120" cy="272" rx="58" ry="7" fill="#000" opacity="0.08" />

      <g className="w-hop">
        <g className="w-breathe">
          <g className="w-head">
            {/* horns arch up over the head */}
            <Horn id={`${uid}-horn-l`} scale={hornScale} />
            <Horn id={`${uid}-horn-r`} flip scale={hornScale} />
          </g>

          {/* legs with dark hooves */}
          {[82, 134].map(x => (
            <g key={x}>
              <rect x={x} y="238" width="24" height="30" rx="10" fill={C.fur} />
              <path d={`M${x} 258 h24 v6 a8 8 0 0 1 -8 8 h-8 a8 8 0 0 1 -8 -8 z`} fill={C.hoof} />
              <path d={`M${x + 12} 261 v11`} stroke={C.furShade} strokeWidth="2" strokeLinecap="round" />
            </g>
          ))}

          {/* body and cream belly */}
          <path d="M120 164 C 151 164 171 186 172 214 C 173 242 156 260 120 260 C 84 260 67 242 68 214 C 69 186 89 164 120 164 Z" fill={C.fur} />
          <ellipse cx="120" cy="217" rx="36" ry="36" fill={C.cream} />

          {/* arms */}
          {leftArmUp ? (
            <g className="w-arm-l">
              <path d="M82 186 C 62 186, 46 174, 44 156" stroke={C.fur} strokeWidth="21" strokeLinecap="round" fill="none" />
              <circle cx="44" cy="151" r="11" fill={C.hoof} />
            </g>
          ) : (
            <g className="w-arm-l">
              <path d="M78 184 C 64 196, 58 210, 58 224" stroke={C.fur} strokeWidth="21" strokeLinecap="round" fill="none" />
              <circle cx="58" cy="229" r="11" fill={C.hoof} />
            </g>
          )}
          {chinHoof ? null : rightArmUp ? (
            <g className="w-arm-r">
              <path d="M158 186 C 178 186, 194 174, 196 156" stroke={C.fur} strokeWidth="21" strokeLinecap="round" fill="none" />
              <circle cx="196" cy="151" r="11" fill={C.hoof} />
            </g>
          ) : (
            <g className="w-arm-r">
              <path d="M162 184 C 176 196, 182 210, 182 224" stroke={C.fur} strokeWidth="21" strokeLinecap="round" fill="none" />
              <circle cx="182" cy="229" r="11" fill={C.hoof} />
            </g>
          )}

          <g className="w-head">
            {/* ears stick out sideways */}
            <g className="w-ear-l">
              <path d="M62 102 C 46 92, 28 96, 24 112 C 34 121, 50 122, 64 118 Z" fill={C.fur} />
              <path d="M61 107 C 48 101, 35 104, 30 113 C 39 118, 51 118, 61 116 Z" fill={C.earInner} />
            </g>
            <g className="w-ear-r">
              <path d="M178 102 C 194 92, 212 96, 216 112 C 206 121, 190 122, 176 118 Z" fill={C.fur} />
              <path d="M179 107 C 192 101, 205 104, 210 113 C 201 118, 189 118, 179 116 Z" fill={C.earInner} />
            </g>

            {/* head */}
            <path d="M120 60 C 162 60 187 86 187 121 C 187 156 159 178 120 178 C 81 178 53 156 53 121 C 53 86 78 60 120 60 Z" fill={C.fur} />

            {/* eyes */}
            {mood === 'cheer' ? (
              // eyes squeezed shut with joy: ^ ^
              <g className="w-eyes">
                <path d="M72 122 Q 87 100 102 122" stroke={C.pupil} strokeWidth="7" strokeLinecap="round" fill="none" />
                <path d="M138 122 Q 153 100 168 122" stroke={C.pupil} strokeWidth="7" strokeLinecap="round" fill="none" />
              </g>
            ) : (
              <g className="w-eyes">
                <ellipse cx={EYE_L.x} cy={EYE_L.y} rx={EYE_RX} ry={EYE_RY} fill={C.white} />
                <ellipse cx={EYE_R.x} cy={EYE_R.y} rx={EYE_RX} ry={EYE_RY} fill={C.white} />
                <g className="w-pupils" transform={`translate(${look[0]} ${look[1]})`}>
                  <ellipse cx="91" cy="120" rx="11" ry="14" fill={C.pupil} />
                  <ellipse cx="149" cy="120" rx="11" ry="14" fill={C.pupil} />
                  <circle cx="87" cy="113" r="4.5" fill={C.white} />
                  <circle cx="145" cy="113" r="4.5" fill={C.white} />
                </g>
                {mood === 'sad' && (
                  // heavy, droopy lids
                  <>
                    <g clipPath={`url(#${uid}-eye-l)`}>
                      <path d="M60 90 H114 V108 Q 87 100 60 112 Z" fill={C.furShade} />
                    </g>
                    <g clipPath={`url(#${uid}-eye-r)`}>
                      <path d="M126 90 H180 V112 Q 153 100 126 108 Z" fill={C.furShade} />
                    </g>
                  </>
                )}
              </g>
            )}

            {/* brows */}
            {mood === 'thinking' ? (
              // one brow way up, one flat: hmm?
              <>
                <path d="M77 82 Q 88 70 99 80" stroke={C.brow} strokeWidth="5" strokeLinecap="round" fill="none" />
                <path d="M143 88 Q 154 86 165 89" stroke={C.brow} strokeWidth="5" strokeLinecap="round" fill="none" />
              </>
            ) : mood === 'sad' ? (
              // inner ends up: worried
              <>
                <path d="M77 88 Q 90 88 99 78" stroke={C.brow} strokeWidth="5" strokeLinecap="round" fill="none" />
                <path d="M141 78 Q 150 88 163 88" stroke={C.brow} strokeWidth="5" strokeLinecap="round" fill="none" />
              </>
            ) : (
              <>
                <path d="M79 84 Q 88 78 98 83" stroke={C.brow} strokeWidth="5" strokeLinecap="round" fill="none" />
                <path d="M142 83 Q 152 78 161 84" stroke={C.brow} strokeWidth="5" strokeLinecap="round" fill="none" />
              </>
            )}

            {/* muzzle, nose and mouth */}
            <path d="M120 124 C 137 124 147 134 147 147 C 147 161 135 170 120 170 C 105 170 93 161 93 147 C 93 134 103 124 120 124 Z" fill={C.cream} />
            <path d="M108 134 C 111 129 129 129 132 134 C 130 139 125 141 120 141 C 115 141 110 139 108 134 Z" fill={C.nose} />
            <path d="M120 140 V147" stroke={C.nose} strokeWidth="2.6" strokeLinecap="round" />
            {talking ? (
              // talking: a closed smile, with the open mouth growing over it as he speaks
              <g className="w-mouth">
                <path d="M108 149 Q 120 155 132 149" stroke={C.mouth} strokeWidth="4" strokeLinecap="round" fill="none" />
                <g className="w-mouth-open">
                  <path d="M107 148 Q 120 153 133 148 Q 130 167 120 167 Q 110 167 107 148 Z" fill={C.mouth} />
                  <path d="M112 160 Q 120 155 128 160 Q 125 167 120 167 Q 115 167 112 160 Z" fill={C.tongue} />
                </g>
              </g>
            ) : mood === 'cheer' ? (
              // a big open laugh
              <g>
                <path d="M104 147 Q 120 153 136 147 Q 133 168 120 168 Q 107 168 104 147 Z" fill={C.mouth} />
                <path d="M110 160 Q 120 154 130 160 Q 126 168 120 168 Q 114 168 110 160 Z" fill={C.tongue} />
              </g>
            ) : mood === 'sad' ? (
              <path d="M110 160 Q 120 151 130 160" stroke={C.mouth} strokeWidth="4" strokeLinecap="round" fill="none" />
            ) : mood === 'thinking' ? (
              // a little sideways "hmm"
              <path d="M111 157 Q 119 154 130 158" stroke={C.mouth} strokeWidth="4" strokeLinecap="round" fill="none" />
            ) : (
              // his usual happy open smile
              <g>
                <path d="M107 148 Q 120 153 133 148 Q 130 163 120 163 Q 110 163 107 148 Z" fill={C.mouth} />
                <path d="M112 157 Q 120 152 128 157 Q 125 163 120 163 Q 115 163 112 157 Z" fill={C.tongue} />
              </g>
            )}

            {/* goatee */}
            <path d="M105 168 Q 120 175 135 168 Q 136 182 130 188 L 125 186 L 120 202 L 115 186 L 110 188 Q 104 182 105 168 Z" fill={C.beard} />

            {mood === 'sad' && (
              // a worried sweat drop
              <path className="w-sweat" d="M184 70 C 178 80, 176 86, 180 90 C 184 94, 190 92, 190 86 C 190 82, 188 76, 184 70 Z" fill="#7cc4f2" stroke="#4a9bd1" strokeWidth="1.5" />
            )}
          </g>
          {chinHoof && (
            // arm up, hoof on the chin
            <g className="w-arm-r">
              <path d="M162 190 C 170 172, 158 164, 144 166" stroke={C.fur} strokeWidth="21" strokeLinecap="round" fill="none" />
              <circle cx="138" cy="167" r="11" fill={C.hoof} />
            </g>
          )}
        </g>
      </g>

      {mood === 'thinking' && (
        // a "?" thought bubble
        <g className="w-question">
          <circle cx="214" cy="-2" r="20" fill={C.white} stroke="#e5e5e5" strokeWidth="3" />
          <circle cx="196" cy="24" r="5.5" fill={C.white} stroke="#e5e5e5" strokeWidth="2.5" />
          <circle cx="188" cy="37" r="3.2" fill={C.white} stroke="#e5e5e5" strokeWidth="2" />
          <text x="214" y="9" textAnchor="middle" fontSize="31" fontWeight="900" fill="#1f5bd0" fontFamily="inherit">
            ?
          </text>
        </g>
      )}
      {mood === 'cheer' && (
        // sparkles
        <g className="w-sparkles" fill="#ffc233">
          <path d="M14 112 l5 12 l12 5 l-12 5 l-5 12 l-5 -12 l-12 -5 l12 -5 z" />
          <path d="M120 -14 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 l10 -4 z" />
          <path d="M20 196 l3 7 l7 3 l-7 3 l-3 7 l-3 -7 l-7 -3 l7 -3 z" />
          <path d="M222 190 l4 9 l9 4 l-9 4 l-4 9 l-4 -9 l-9 -4 l9 -4 z" />
        </g>
      )}
    </svg>
  );
}
