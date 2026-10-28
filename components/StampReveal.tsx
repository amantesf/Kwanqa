'use client';

// The big "new passport stamp" moment: the screen goes dark, light rays spin
// up in the stamp's ink colour, the stamp slams down (shake, ink ring,
// confetti in the flag's colours), and Walia flies in and circles around it,
// passing behind and in front of the stamp. Then the quick lesson is offered.

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import Mascot from '@/components/Mascot';
import PassportStamp from '@/components/PassportStamp';
import PlaceLesson, { hasPlaceLesson } from '@/components/PlaceLesson';
import type { Track } from '@/lib/courses';
import type { Stamp } from '@/lib/passport';

const MUTE_KEY = 'kwanqa-sound-off'; // shared with the lessons' mute button
const SLAM_MS = 650; // when the stamp hits the page
const WALIA_IN_MS = 1000; // when Walia flies in
const ORBIT_MS = 5200; // one lap around the stamp

const FLAG = ['#078930', '#fcdd09', '#da121a'];

/** A repeatable "random" number, so every render draws the same confetti. */
function seeded(i: number) {
  const x = Math.sin(i * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

function playSlam() {
  try {
    if (window.localStorage.getItem(MUTE_KEY) === '1') return;
  } catch {
    // no storage: play it
  }
  const audio = new Audio('/sounds/complete.mp3');
  audio.volume = 0.7;
  void audio.play().catch(() => {});
}

/** Walia circling the stamp, moved every frame so he can pass behind it and come round the front. */
function OrbitingWalia({ stageRef }: { stageRef: React.RefObject<HTMLDivElement | null> }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const stage = stageRef.current;
    if (!el || !stage) return;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (still) {
      el.style.transform = `translate(${Math.min(stage.clientWidth * 0.36, 150)}px, 30px)`;
      el.style.zIndex = '3';
      el.style.opacity = '1';
      return;
    }

    let frame = 0;
    const start = performance.now() + WALIA_IN_MS;
    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      const ms = now - start;
      if (ms < 0) return;
      const rx = Math.min(stage.clientWidth * 0.4, 200);
      const ry = rx * 0.42; // a tilted orbit: he peeks over the top when he's behind the stamp
      // fly in on a wide spiral that settles into the orbit
      const arrive = Math.min(ms / 1100, 1);
      const ease = 1 - Math.pow(1 - arrive, 3);
      const spread = 1 + (1 - ease) * 2.2;
      const angle = Math.PI * 0.15 + (ms / ORBIT_MS) * Math.PI * 2;
      const x = Math.cos(angle) * rx * spread;
      const depth = Math.sin(angle); // +1 is in front of the stamp, -1 behind it
      const bob = Math.sin(ms / 170) * 7;
      // the back of the loop rises higher, so his horns still peek over the stamp
      const lift = depth < 0 ? 1.7 : 1;
      const y = depth * ry * lift * spread + bob - (1 - ease) * 120;
      const scale = 0.86 + depth * 0.22;
      // face the way he's heading, and lean into the turn
      const facing = -Math.sin(angle) >= 0 ? 1 : -1;
      const lean = Math.cos(angle) * -10;
      el.style.transform = `translate(${x}px, ${y}px) rotate(${lean}deg) scale(${scale * facing}, ${scale})`;
      el.style.zIndex = depth > 0 ? '3' : '1';
      el.style.opacity = String(Math.min(ms / 250, 1));
      el.style.filter = depth > 0 ? 'none' : `brightness(${0.75 + (depth + 1) * 0.12})`;
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [stageRef]);

  return (
    <div ref={ref} className="reveal-walia" aria-hidden>
      <Mascot pose="cheer" size={108} animated />
    </div>
  );
}

export default function StampReveal({
  stamp,
  camp,
  track,
  onClose,
}: {
  stamp: Stamp;
  camp: number;
  track: Track;
  onClose: () => void;
}) {
  const [learning, setLearning] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const lesson = hasPlaceLesson(stamp);

  // confetti in the flag's colours and the stamp's ink, bursting out from the stamp
  const confetti = useMemo(
    () =>
      Array.from({ length: 46 }, (_, i) => {
        const a = seeded(i) * Math.PI * 2;
        const dist = 120 + seeded(i + 100) * 220;
        return {
          '--x': `${Math.cos(a) * dist}px`,
          '--y': `${Math.sin(a) * dist * 0.75 - 60}px`,
          '--fall': `${160 + seeded(i + 200) * 260}px`,
          '--r': `${(seeded(i + 300) - 0.5) * 1080}deg`,
          '--d': `${seeded(i + 400) * 0.18}s`,
          '--t': `${1.6 + seeded(i + 500) * 1.2}s`,
          '--c': i % 4 === 3 ? stamp.ink : FLAG[i % 3],
          '--w': `${6 + seeded(i + 600) * 6}px`,
        } as CSSProperties;
      }),
    [stamp.ink],
  );

  useEffect(() => {
    const t = window.setTimeout(playSlam, SLAM_MS - 60);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className={`reveal${learning ? ' reveal-learning' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="reveal-title"
      style={{ ['--ink' as string]: stamp.ink }}
    >
      <div className="reveal-glow" aria-hidden />
      <div className="reveal-rays" aria-hidden />

      {learning ? (
        <div className="reveal-lesson">
          <span id="reveal-title" className="sr-only">
            Quick lesson about {stamp.name}
          </span>
          <PlaceLesson stamp={stamp} onDone={onClose} />
        </div>
      ) : (
        <div className="reveal-content">
          <div className="reveal-stage" ref={stageRef}>
            <div className="reveal-ring" aria-hidden />
            <div className="reveal-ring reveal-ring-2" aria-hidden />
            <div className="reveal-confetti" aria-hidden>
              {confetti.map((style, i) => (
                <span key={i} style={style} className={i % 3 === 0 ? 'round' : ''} />
              ))}
            </div>
            {[
              [-150, -90, 0.9, 22],
              [140, -110, 1.25, 16],
              [175, 30, 1.6, 12],
              [-180, 50, 2.1, 14],
              [-60, -150, 2.6, 10],
              [70, 120, 3.1, 12],
            ].map(([x, y, delay, size], i) => (
              <svg
                key={i}
                className="reveal-sparkle"
                viewBox="0 0 20 20"
                width={size}
                height={size}
                style={{ ['--sx' as string]: `${x}px`, ['--sy' as string]: `${y}px`, animationDelay: `${delay}s` }}
                aria-hidden
              >
                <path d="M10 0 C11 7 13 9 20 10 C13 11 11 13 10 20 C9 13 7 11 0 10 C7 9 9 7 10 0 Z" fill="#fff" />
              </svg>
            ))}
            <div className="reveal-stamp">
              <div className="reveal-stamp-float">
                <div className="reveal-stamp-shine">
                  <PassportStamp stamp={stamp} earned size={200} tilt={-6} />
                </div>
              </div>
            </div>
            <OrbitingWalia stageRef={stageRef} />
          </div>

          <div className="reveal-text">
            <span className="reveal-kicker">Camp {camp} complete · New passport stamp</span>
            <h2 id="reveal-title" className="reveal-title">
              You collected <span>{stamp.name}</span>!
            </h2>
            <p className="reveal-am" lang="am">
              {stamp.amharic}
            </p>
            <p className="reveal-fact">{stamp.fact}</p>
          </div>

          <div className="reveal-actions">
            {lesson && (
              <button type="button" className="reveal-btn" onClick={() => setLearning(true)} autoFocus>
                Quick lesson about {stamp.name}
              </button>
            )}
            <button
              type="button"
              className={lesson ? 'reveal-btn-ghost' : 'reveal-btn'}
              onClick={onClose}
              autoFocus={!lesson}
            >
              Keep climbing
            </button>
            <Link href={`/passport?track=${track}`} className="reveal-link" onClick={onClose}>
              See my passport
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
