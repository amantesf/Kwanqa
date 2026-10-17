'use client';

// The "Lesson complete!" screen, like Duolingo's: Walia hops up the mountain
// to the flag at the top, celebrates, and the lesson's results sit below.

import Image from 'next/image';
import GrassIcon from '@/components/GrassIcon';

type Props = {
  earned: number;
  accuracy: number; // 0–100
  altitude: number;
  altitudeGain: number;
  hornsGrew: boolean;
  note?: string;
  finishLabel: string;
  onFinish: () => void;
};

function accuracyLabel(accuracy: number) {
  if (accuracy === 100) return 'Amazing';
  if (accuracy >= 80) return 'Great';
  if (accuracy >= 60) return 'Good';
  return 'Keep going';
}

/** The little mountain Walia climbs: three stones on a footpath up to a flag. */
function Scene() {
  return (
    <svg className="lc-scene" viewBox="0 0 560 280" aria-hidden>
      <defs>
        <radialGradient id="lc-sun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffe3bd" />
          <stop offset="1" stopColor="#ffe3bd" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="lc-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e3f2fc" />
          <stop offset="1" stopColor="#fdf6ee" />
        </linearGradient>
        {/* a rounded postcard; Walia hops out over its top edge */}
        <clipPath id="lc-card">
          <rect width="560" height="280" rx="28" />
        </clipPath>
      </defs>
      <g clipPath="url(#lc-card)">
        <rect width="560" height="280" fill="url(#lc-sky)" />
        <circle cx="470" cy="70" r="90" fill="url(#lc-sun)" />
        {/* distant peaks */}
        <path d="M180 280 L300 120 L345 165 L400 95 L470 160 L560 110 L560 280 Z" fill="#e3eaf2" />
        <path d="M400 95 L420 122 L408 118 L398 128 L388 117 Z" fill="#fff" />
        {/* the mountain, sunlit and shaded faces */}
        <path d="M0 280 L0 170 L95 102 L150 64 L205 100 L320 150 L440 205 L560 236 L560 280 Z" fill="#efcfb8" />
        <path d="M150 64 L205 100 L320 150 L440 205 L560 236 L560 280 L300 280 L230 190 L172 120 Z" fill="#dfae90" />
        <path d="M150 64 L175 82 L163 88 L152 80 L140 92 L128 80 L116 86 Z" fill="#fff" />
        {/* rock ledges */}
        <path d="M60 150 L80 146 L98 151 L116 147 L112 155 L64 156 Z" fill="#c98b68" opacity="0.45" />
        <path d="M250 150 L272 146 L292 152 L284 158 L254 157 Z" fill="#c98b68" opacity="0.45" />
        {/* green slope at the bottom */}
        <path d="M0 250 Q 140 222 280 248 T 560 246 L560 280 L0 280 Z" fill="#cfe6a7" />
        {/* footpath and the three stones Walia hops between */}
        <path
          d="M440 222 C 400 205, 360 178, 320 162 C 290 148, 265 128, 240 112"
          fill="none"
          stroke="#fff"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray="1 15"
        />
        {[
          [440, 222],
          [320, 162],
          [240, 112],
        ].map(([x, y]) => (
          <g key={x}>
            <ellipse cx={x} cy={y + 4} rx="22" ry="8" fill="#e0a000" />
            <ellipse cx={x} cy={y} rx="22" ry="8" fill="#ffc233" />
          </g>
        ))}
      </g>
      {/* flag at the peak */}
      <line x1="150" y1="66" x2="150" y2="10" stroke="#5c3a24" strokeWidth="4" strokeLinecap="round" />
      <path className="lc-flag" d="M152 12 L186 22 L152 34 Z" fill="var(--primary)" />
      {/* celebration burst around Walia at the top */}
      <g className="lc-burst" transform="translate(240 20)">
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i * Math.PI) / 4;
          const c = i % 2 ? '#ff7a8a' : '#ffc233';
          return (
            <line
              key={i}
              x1={Math.cos(a) * 34}
              y1={Math.sin(a) * 34}
              x2={Math.cos(a) * 48}
              y2={Math.sin(a) * 48}
              stroke={c}
              strokeWidth="5"
              strokeLinecap="round"
            />
          );
        })}
      </g>
    </svg>
  );
}

const CONFETTI = ['#ffc233', '#d2582e', '#4fc23a', '#1f5bd0', '#b06cf2', '#ff7a8a'];

export default function LessonComplete({
  earned,
  accuracy,
  altitude,
  altitudeGain,
  hornsGrew,
  note,
  finishLabel,
  onFinish,
}: Props) {
  return (
    <div className="practice practice-screen lesson-complete">
      <div className="lc-body">
        <div className="lc-stage">
          <Scene />
          <div className="lc-walia">
            <Image src="/brand/walia.png" alt="Walia celebrating at the top" width={435} height={581} priority />
          </div>
          <div className="lc-confetti" aria-hidden>
            {Array.from({ length: 14 }, (_, i) => (
              <span
                key={i}
                style={{
                  left: `${8 + ((i * 37) % 84)}%`,
                  background: CONFETTI[i % CONFETTI.length],
                  animationDelay: `${1.1 + (i % 7) * 0.12}s`,
                  transform: `rotate(${i * 29}deg)`,
                }}
              />
            ))}
          </div>
        </div>

        <h2 className="lc-title">Lesson complete!</h2>

        <div className="lc-stats">
          <div className="lc-stat gold">
            <span className="lc-stat-label">Grass</span>
            <span className="lc-stat-value">
              <GrassIcon size={30} /> +{earned}
            </span>
          </div>
          <div className="lc-stat green">
            <span className="lc-stat-label">{accuracyLabel(accuracy)}</span>
            <span className="lc-stat-value">
              <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden>
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="3" />
                <circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" strokeWidth="3" />
                <circle cx="12" cy="12" r="1.6" fill="currentColor" />
              </svg>
              {accuracy}%
            </span>
          </div>
          <div className="lc-stat terracotta">
            <span className="lc-stat-label">Altitude</span>
            <span className="lc-stat-value">
              <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden>
                <path d="M2 20 L9 8 L13 14 L16 10 L22 20 Z" fill="currentColor" />
                <path d="M9 8 L11 11.5 L9.8 11 L8.3 12 Z" fill="#fff" />
              </svg>
              {altitude.toLocaleString()} m
            </span>
            {altitudeGain > 0 && <span className="lc-stat-sub">+{altitudeGain} m today</span>}
          </div>
        </div>

        {hornsGrew && <p className="grew">Walia’s horns grew a new ridge!</p>}
        {note && (
          <div className="lesson-note">
            <span className="lesson-note-label">Did you know?</span>
            <p>{note}</p>
          </div>
        )}
      </div>

      <div className="practice-footer">
        <div className="practice-footer-inner">
          <span />
          <button type="button" className="btn" onClick={onFinish} autoFocus>
            {finishLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
