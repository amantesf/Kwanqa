// Where progress is kept on this device: the browser's localStorage on the
// website, or the phone app's own storage, which it plugs in with setStorage.

export type KeyValueStore = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
};

let custom: KeyValueStore | null = null;

export function setStorage(store: KeyValueStore) {
  custom = store;
}

/** May throw in the browser when storage is blocked, so callers wrap it in try. */
export function storage(): KeyValueStore {
  return custom ?? window.localStorage;
}

/** Calls back when another tab changes storage (browsers only; a no-op in the app). */
export function onOtherTab(callback: (key: string | null) => void) {
  if (custom || typeof window === 'undefined' || typeof window.addEventListener !== 'function') return () => {};
  const listener = (e: StorageEvent) => callback(e.key);
  window.addEventListener('storage', listener);
  return () => window.removeEventListener('storage', listener);
}
