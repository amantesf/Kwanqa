import { initialWindowMetrics, useSafeAreaInsets } from 'react-native-safe-area-context';

// How far down a screen's top bar has to sit to clear the clock and the
// Dynamic Island. Full-screen modals (practice, calls) can report a top inset
// of 0, which slid their close buttons under the status bar where taps don't
// land, so the window's own inset from launch is the floor.
export function useTopInset() {
  const insets = useSafeAreaInsets();
  return Math.max(insets.top, initialWindowMetrics?.insets.top ?? 0);
}
