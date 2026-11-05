import { requestRecordingPermissionsAsync, setAudioModeAsync, useAudioRecorder, useAudioRecorderState } from 'expo-audio';
import { SymbolView } from 'expo-symbols';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { spokenRight, type SpeakExercise } from '@/lib/interactive';
import Speaker from '@/components/speaker';
import { stopVoice } from '@/components/sound';
import Walia from '@/components/walia';
import { feel } from '@/haptics';
import { listenTo, WAV, withTimeout } from '@/listen';
import { fonts, makeStyles } from '@/theme';

// "Speak this", like the website's SpeakQuestion (components/InteractiveQuestions.tsx):
// say the phrase, and Walia checks what he heard (/api/listen). Two tries that
// don't match move on without losing stamina; no microphone (or no account)
// skips speaking for a while.

const TRIES = 2;
const ETHIOPIC = /[ሀ-፿]/;

type Props = {
  exercise: SpeakExercise;
  /** English course: Amharic first in the labels. */
  english: boolean;
  onSay: (text: string) => void;
  onCorrect: () => void;
  /** Two tries that didn't match. */
  onGiveUp: () => void;
  /** No microphone, no permission, or listening isn't available. */
  onUnavailable: () => void;
};

export default function SpeakQuestion({ exercise, english, onSay, onCorrect, onGiveUp, onUnavailable }: Props) {
  const styles = useStyles();
  const [state, setState] = useState<'ready' | 'recording' | 'checking'>('ready');
  const [heard, setHeard] = useState<string | null>(null);
  const [tries, setTries] = useState(0);
  const recorder = useAudioRecorder(WAV);
  const recorderState = useAudioRecorderState(recorder, 80);
  const t = (en: string, am: string) => (english ? `${am} · ${en}` : en);

  // metering is in decibels (about -60 quiet to 0 loud): the bars follow the voice
  const level = state === 'recording' ? Math.max(0, Math.min(1, ((recorderState.metering ?? -60) + 60) / 60)) : 0;
  const bars = [0.5, 0.8, 1, 0.8, 0.5].map(k => Math.max(0.15, Math.min(1, level * 1.6 * k)));

  // stop listening if the learner leaves the question mid-recording
  useEffect(
    () => () => {
      void recorder.stop().catch(() => {});
      void setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true }).catch(() => {});
    },
    [recorder],
  );

  async function start() {
    setHeard(null);
    stopVoice();
    try {
      const { granted } = await requestRecordingPermissionsAsync();
      if (!granted) throw new Error('no microphone');
      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
      await recorder.prepareToRecordAsync();
      recorder.record();
      feel('pick');
      setState('recording');
    } catch {
      onUnavailable();
    }
  }

  async function stop() {
    setState('checking');
    try {
      await withTimeout(recorder.stop(), 5000, 'The recording didn’t finish.');
      // back to the loudspeaker for Walia's voice
      await setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true }).catch(() => {});
      const uri = recorder.uri;
      if (!uri) throw new Error('no recording');
      const { status, text } = await listenTo(uri, exercise.lang);
      if (status === 401 || status === 503) {
        onUnavailable();
        return;
      }
      if (status !== 200) throw new Error(`listen failed (${status})`);
      if (spokenRight(exercise, text)) {
        setState('ready');
        setHeard(null);
        onCorrect();
        return;
      }
      const used = tries + 1;
      setTries(used);
      setHeard(text);
      setState('ready');
      if (used >= TRIES) onGiveUp();
    } catch (error) {
      console.warn('Kwanqa: speaking check failed', error);
      setHeard('');
      setState('ready');
    }
  }

  const label =
    state === 'recording'
      ? t('Tap when you’re done', 'ሲጨርሱ ይንኩ')
      : state === 'checking'
        ? t('Walia is listening…', 'ዋሊያ እያዳመጠ ነው…')
        : tries > 0 || heard !== null
          ? t('Try again', 'እንደገና ይሞክሩ')
          : t('Tap and speak', 'ይንኩና ይናገሩ');

  return (
    <View style={styles.speak}>
      <View style={styles.ask}>
        <Walia mood={state === 'recording' ? 'thinking' : undefined} size={96} />
        <View style={styles.bubble}>
          <Speaker onPress={() => onSay(exercise.prompt)} label="Hear it" />
          <View style={styles.bubbleText}>
            <Text style={[styles.prompt, ETHIOPIC.test(exercise.prompt) && styles.amharic]}>{exercise.prompt}</Text>
            {exercise.promptHint ? <Text style={styles.hint}>{exercise.promptHint}</Text> : null}
          </View>
        </View>
      </View>

      <Pressable
        onPress={() => (state === 'recording' ? void stop() : state === 'ready' ? void start() : undefined)}
        disabled={state === 'checking'}
        accessibilityRole="button"
        accessibilityLabel={state === 'recording' ? 'Stop recording' : 'Start speaking'}
        style={({ pressed }) => [styles.mic, state === 'recording' && styles.micOn, state === 'checking' && styles.micBusy, pressed && styles.down]}
      >
        {state === 'recording' ? (
          <View style={styles.bars}>
            {bars.map((h, i) => (
              <View key={i} style={[styles.bar, { transform: [{ scaleY: h }] }]} />
            ))}
          </View>
        ) : (
          <SymbolView name={{ ios: 'mic.fill', android: 'mic', web: 'mic' }} tintColor="#ffffff" size={28} />
        )}
        <Text style={styles.micText}>{label}</Text>
      </Pressable>

      <Text style={styles.heard} accessibilityLiveRegion="polite">
        {heard === ''
          ? t('Walia didn’t catch that. Speak a little louder?', 'ዋሊያ አልሰማም። ትንሽ ጮክ ብለው ይናገሩ?')
          : heard
            ? t(`Walia heard “${heard}”. Listen again and give it another go!`, `ዋሊያ “${heard}” ሰማ። እንደገና ያዳምጡና ይሞክሩ!`)
            : ' '}
      </Text>
    </View>
  );
}

const useStyles = makeStyles(c => ({
  speak: { gap: 22 },
  ask: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  bubble: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 18, borderWidth: 2, borderColor: c.line, backgroundColor: '#ffffff' },
  bubbleText: { flex: 1, gap: 3 },
  prompt: { fontFamily: fonts.heavy, fontSize: 20, lineHeight: 27, color: c.ink },
  amharic: { fontFamily: fonts.amharic, fontSize: 22, lineHeight: 32 },
  hint: { fontFamily: fonts.bold, fontSize: 14, color: c.muted },
  mic: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    minHeight: 84,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderBottomWidth: 6,
    borderBottomColor: '#16449c',
    backgroundColor: c.blue,
  },
  micOn: { backgroundColor: '#ff5a4e', borderBottomColor: '#d9443a' },
  micBusy: { opacity: 0.7 },
  down: { borderBottomWidth: 0, marginTop: 6 },
  micText: { fontFamily: fonts.black, fontSize: 17, color: '#ffffff' },
  bars: { flexDirection: 'row', alignItems: 'center', gap: 4, height: 30 },
  bar: { width: 5, height: 30, borderRadius: 3, backgroundColor: '#ffffff' },
  heard: { minHeight: 40, fontFamily: fonts.bold, fontSize: 15, lineHeight: 21, color: c.muted, textAlign: 'center' },
}));
