import AsyncStorage from '@react-native-async-storage/async-storage';
import { setStorage } from '@/lib/storage';

// The app keeps progress the same way the website does (lib/climb.ts,
// lib/mistakes.ts, lib/profile.ts, and the letters written in Write), just in
// the phone's storage instead of the browser's. Those files read and write
// synchronously, so everything is loaded into memory once at start and each
// change is saved in the background.

const KEYS = ['kwanqa-climb-v1', 'kwanqa-mistakes-v1', 'kwanqa-profile-v1', 'kwanqa-fidel-written', 'kwanqa-talk-gender'];
const memory = new Map<string, string>();

setStorage({
  getItem: key => memory.get(key) ?? null,
  setItem: (key, value) => {
    memory.set(key, value);
    AsyncStorage.setItem(key, value).catch(() => {});
  },
  removeItem: key => {
    memory.delete(key);
    AsyncStorage.removeItem(key).catch(() => {});
  },
});

/** Reads saved progress into memory; call before the first screen shows. */
export async function loadProgress() {
  try {
    for (const [key, value] of await AsyncStorage.multiGet(KEYS)) {
      if (value !== null) memory.set(key, value);
    }
  } catch {
    // nothing saved yet, or storage unavailable: start fresh
  }
}
