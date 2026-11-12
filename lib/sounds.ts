'use client';

// Kwanqa's sound effects, with one on/off setting for the whole site: the
// switch in Profile and the speaker in the lesson top bar change the same
// thing. The choice is remembered in this browser.
//
// The answer sounds are recordings in public/sounds. The small extras (a pop
// when you open a lesson stone, a chime for a new camp, a tick as grass is
// counted) are made on the spot with the Web Audio API, so there's nothing
// extra to download.

import { useSyncExternalStore } from 'react';

const MUTE_KEY = 'kwanqa-sound-off';

// Reading the setting through a store keeps the server render (always "on")
// and the browser in sync without a hydration mismatch.
const listeners = new Set<() => void>();
let fallback = false; // used when storage is unavailable

function readMuted() {
  try {
    return window.localStorage.getItem(MUTE_KEY) === '1';
  } catch {
    return fallback;
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function soundsMuted() {
  return typeof window === 'undefined' ? true : readMuted() || fallback;
}

export function setSoundsMuted(muted: boolean) {
  fallback = muted;
  try {
    window.localStorage.setItem(MUTE_KEY, muted ? '1' : '0');
  } catch {
    // storage unavailable; the setting lasts for this visit only
  }
  listeners.forEach(l => l());
}

/** Whether sounds are off, kept up to date when either switch changes. */
export function useSoundsMuted() {
  return useSyncExternalStore(subscribe, () => readMuted() || fallback, () => false);
}

// ---------------------------------------------------------------------------
// Little synthesized effects

let ctx: AudioContext | null = null;

function audio() {
  if (typeof window === 'undefined') return null;
  try {
    ctx ??= new AudioContext();
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

/** One soft note: a sine wave that starts at `from` Hz and fades out. */
function note(ac: AudioContext, from: number, to: number, start: number, length: number, volume: number) {
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(from, start);
  osc.frequency.exponentialRampToValueAtTime(to, start + length);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + length);
  osc.connect(gain).connect(ac.destination);
  osc.start(start);
  osc.stop(start + length + 0.02);
}

export type Effect = 'pop' | 'tick' | 'chime';

/** Play a small effect, unless sounds are off. */
export function playEffect(effect: Effect) {
  if (soundsMuted()) return;
  const ac = audio();
  if (!ac) return;
  const t = ac.currentTime;
  if (effect === 'pop') {
    // opening a lesson stone
    note(ac, 520, 880, t, 0.09, 0.12);
  } else if (effect === 'tick') {
    // one blade of grass counted
    note(ac, 1300, 1500, t, 0.05, 0.05);
  } else {
    // a new camp: three rising notes, like a little bell
    [659, 831, 988].forEach((f, i) => note(ac, f, f, t + i * 0.11, 0.5, 0.1));
  }
}
