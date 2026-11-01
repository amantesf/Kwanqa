import * as Haptics from 'expo-haptics';

// Small taps under the fingers: a tick when picking an answer, and a buzz
// with each answer chime. They follow the phone's own System Haptics switch,
// and quietly do nothing on a build without the haptics module.

export type Feel = 'pick' | 'correct' | 'wrong' | 'complete';

export function feel(kind: Feel) {
  const done =
    kind === 'pick'
      ? Haptics.selectionAsync()
      : kind === 'correct'
        ? Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        : kind === 'wrong'
          ? Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
          : Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  done.catch(() => {});
}
