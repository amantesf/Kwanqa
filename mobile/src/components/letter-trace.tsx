import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { TraceExercise } from '@/lib/letterLessons';
import Writer, { type WriterEvent } from '@/components/writer';
import { colors, fonts } from '@/theme';

// "Trace the new letter" in a lesson, like the website's (components/LetterTrace.tsx):
// Walia says the letter and shows how it's written once, then you trace it
// stroke by stroke. Finishing the trace answers the question; a letter whose
// strokes can't load is skipped.

export default function LetterTrace({
  exercise,
  onSay,
  onMistake,
  onDone,
}: {
  exercise: TraceExercise;
  onSay: (text: string) => void;
  onMistake: () => void;
  /** Traced it (or the strokes couldn't load, so there's nothing to trace). */
  onDone: () => void;
}) {
  const [message, setMessage] = useState('Watch first, then trace stroke 1.');
  const [finished, setFinished] = useState(false);
  // the latest callbacks, without restarting the trace when the lesson re-renders
  const calls = useRef({ onSay, onMistake, onDone });
  useEffect(() => {
    calls.current = { onSay, onMistake, onDone };
  });

  useEffect(() => {
    calls.current.onSay(exercise.char);
  }, [exercise.char]);

  const onEvent = useCallback((e: WriterEvent) => {
    if (e.t === 'message') setMessage(e.text);
    else if (e.t === 'wrong') calls.current.onMistake();
    else if (e.t === 'missing') calls.current.onDone();
    else if (e.t === 'done') {
      setFinished(true);
      calls.current.onDone();
    }
  }, []);

  return (
    <View style={styles.wrap}>
      <View style={styles.side}>
        <Text style={styles.char}>{exercise.char}</Text>
        <View style={styles.about}>
          <Text style={styles.sound}>“{exercise.sound}”</Text>
          {exercise.word ? (
            <Text style={styles.word}>
              as in <Text style={styles.amharic}>{exercise.word}</Text>
              {exercise.meaning ? ` · ${exercise.meaning}` : ''}
            </Text>
          ) : null}
        </View>
        <Pressable onPress={() => onSay(exercise.char)} style={({ pressed }) => [styles.hear, pressed && styles.hearDown]}>
          <Text style={styles.hearText}>Hear it</Text>
        </Pressable>
      </View>
      <View style={styles.paper}>
        <Writer char={exercise.char} mode="lesson" round={0} onEvent={onEvent} />
      </View>
      <Text style={styles.message}>{finished ? 'Nicely written!' : message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 12 },
  side: { flexDirection: 'row', alignItems: 'center', gap: 14, alignSelf: 'stretch' },
  char: { fontFamily: fonts.amharicBold, fontSize: 52, lineHeight: 68, color: colors.ink },
  about: { flex: 1, gap: 2 },
  sound: { fontFamily: fonts.black, fontSize: 20, color: colors.primary },
  word: { fontFamily: fonts.bold, fontSize: 14, color: colors.muted },
  amharic: { fontFamily: fonts.amharicBold },
  hear: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 12, borderWidth: 2, borderBottomWidth: 4, borderColor: colors.line },
  hearDown: { borderBottomWidth: 2, marginTop: 2 },
  hearText: { fontFamily: fonts.black, fontSize: 13, color: colors.blue, textTransform: 'uppercase', letterSpacing: 0.5 },
  paper: { width: '100%', maxWidth: 300 },
  message: { fontFamily: fonts.bold, fontSize: 15, color: colors.muted, textAlign: 'center', minHeight: 21 },
});
