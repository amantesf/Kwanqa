'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * A number that counts up to `target` instead of jumping there, like grass
 * being added one blade at a time. `onStep` runs on each new value (for a
 * tick sound). Learners who prefer less motion see the final number at once.
 *
 * `quietFor` skips the animation for that many ms after mounting, so a saved
 * number loading in on page load doesn't count up every visit.
 */
export function useCountUp(
  target: number,
  {
    from = target,
    delay = 0,
    duration = 700,
    quietFor = 0,
    onStep,
  }: { from?: number; delay?: number; duration?: number; quietFor?: number; onStep?: () => void } = {},
) {
  const [shown, setShown] = useState(from);
  const current = useRef(from);
  const step = useRef(onStep);
  const mounted = useRef(0);
  useEffect(() => {
    step.current = onStep;
  });
  useEffect(() => {
    mounted.current = performance.now();
  }, []);

  useEffect(() => {
    const start = current.current;
    if (target === start) return;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Counting down (or a big jump, like progress loading) just shows the number.
    const settling = performance.now() - mounted.current < quietFor;
    if (still || settling || target < start || target - start > 200) {
      current.current = target;
      setShown(target);
      return;
    }
    let frame = 0;
    let began = 0;
    const timer = window.setTimeout(() => {
      const tick = (now: number) => {
        began ||= now;
        const t = Math.min(1, (now - began) / duration);
        const value = Math.round(start + (target - start) * (1 - (1 - t) ** 2));
        if (value !== current.current) {
          current.current = value;
          setShown(value);
          step.current?.();
        }
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, delay);
    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
  }, [target, delay, duration, quietFor]);

  return shown;
}
