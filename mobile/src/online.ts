import { useEffect, useSyncExternalStore } from 'react';
import { AppState } from 'react-native';
import { SITE } from '@/site';

// Whether the phone can reach kwanqa.com. Lessons work offline, but sounds,
// pictures, Talk and saving to an account need the internet, so screens say
// so instead of failing quietly. Checked when the app opens or comes back to
// the front, and every half minute while it's open (a tiny request).

let online = true;
const listeners = new Set<() => void>();

function set(next: boolean) {
  if (next === online) return;
  online = next;
  listeners.forEach(fn => fn());
}

export async function checkOnline() {
  const abort = new AbortController();
  const timer = setTimeout(() => abort.abort(), 6000);
  try {
    const res = await fetch(`${SITE}/robots.txt`, { method: 'HEAD', cache: 'no-store', signal: abort.signal });
    set(res.ok || res.status < 500);
  } catch {
    set(false);
  } finally {
    clearTimeout(timer);
  }
}

let watchers = 0;
let stop: (() => void) | null = null;

function watch() {
  if (watchers++ > 0) return;
  void checkOnline();
  const timer = setInterval(() => AppState.currentState === 'active' && void checkOnline(), 30000);
  const sub = AppState.addEventListener('change', state => state === 'active' && void checkOnline());
  stop = () => {
    clearInterval(timer);
    sub.remove();
  };
}

function unwatch() {
  if (--watchers > 0) return;
  stop?.();
  stop = null;
}

/** True while kwanqa.com can be reached. */
export function useOnline() {
  useEffect(() => {
    watch();
    return unwatch;
  }, []);
  return useSyncExternalStore(
    cb => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => online,
  );
}
