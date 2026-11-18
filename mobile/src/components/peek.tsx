import { useState, useSyncExternalStore, type ReactNode } from 'react';
import { Pressable, Switch, Text, View } from 'react-native';
import type { Track } from '@/lib/courses';
import { storage } from '@/lib/storage';
import { feel } from '@/haptics';
import { fonts, makeStyles, useColors } from '@/theme';

// The lesson screen's "Hide English" switch, like the website's (Peek.tsx).
// With it on, every meaning on a lesson (phrases, grammar examples, word
// families, the conversation) becomes a small "Show English" button, so you
// read the Amharic first and only peek when you need to. Remembered on this
// phone from lesson to lesson.

const KEY = 'kwanqa-hide-meaning';
const listeners = new Set<() => void>();

function read() {
  try {
    return storage().getItem(KEY) === '1';
  } catch {
    return false;
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useHideMeaning() {
  return useSyncExternalStore(subscribe, read, () => false);
}

function setHideMeaning(hide: boolean) {
  try {
    storage().setItem(KEY, hide ? '1' : '0');
  } catch {
    // not saved: it lasts until the app closes
  }
  listeners.forEach(l => l());
}

/** What the meaning is called: English for the Amharic course, Amharic for the English one. */
const meaningName = (track: Track) => (track === 'english' ? 'Amharic' : 'English');

/** The switch, at the top of a lesson. */
export function HideMeaningSwitch({ track }: { track: Track }) {
  const styles = useStyles();
  const colors = useColors();
  const hide = useHideMeaning();
  return (
    <View style={styles.switchRow}>
      <View style={styles.flex}>
        <Text style={styles.switchTitle}>Hide {meaningName(track)}</Text>
        <Text style={styles.switchText}>Read it first; tap to peek at the meaning.</Text>
      </View>
      <Switch
        value={hide}
        onValueChange={on => {
          feel('pick');
          setHideMeaning(on);
        }}
        trackColor={{ true: colors.primary, false: colors.line }}
        thumbColor="#ffffff"
        accessibilityLabel={`Hide ${meaningName(track)}`}
      />
    </View>
  );
}

/** A meaning that hides behind a "Show English" button while the switch is on. */
export default function Peek({ children, track }: { children: ReactNode; track: Track }) {
  const styles = useStyles();
  const hide = useHideMeaning();
  const [shown, setShown] = useState(false);
  if (!hide || shown) return <>{children}</>;
  return (
    <Pressable
      onPress={() => {
        feel('pick');
        setShown(true);
      }}
      accessibilityRole="button"
      hitSlop={6}
      style={({ pressed }) => [styles.peek, pressed && styles.peekDown]}
    >
      <Text style={styles.peekText}>Show {meaningName(track)}</Text>
    </Pressable>
  );
}

const useStyles = makeStyles(c => ({
  flex: { flex: 1 },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 16, borderWidth: 2, borderColor: c.line, backgroundColor: c.bg },
  switchTitle: { fontFamily: fonts.heavy, fontSize: 15, color: c.ink },
  switchText: { fontFamily: fonts.bold, fontSize: 13, lineHeight: 18, color: c.muted },
  peek: { alignSelf: 'flex-start', marginTop: 2, paddingVertical: 3, paddingHorizontal: 10, borderRadius: 999, borderWidth: 2, borderStyle: 'dashed', borderColor: c.line },
  peekDown: { opacity: 0.6 },
  peekText: { fontFamily: fonts.bold, fontSize: 13, color: c.muted },
}));
