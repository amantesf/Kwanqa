import { SymbolView } from 'expo-symbols';
import { Pressable, Text, View } from 'react-native';
import { type OrderExercise } from '@/lib/interactive';
import { feel } from '@/haptics';
import { fonts, makeStyles, useColors } from '@/theme';

// "Put the conversation in order", like the website's (components/InteractiveQuestions.tsx):
// tap the lines of a short dialogue in the order they're said. Placed lines
// sit above as chat bubbles (the first speaker on the left, the second on the
// right) and tapping one puts it back.

const ETHIOPIC = /[ሀ-፿]/;

type Props = {
  exercise: OrderExercise;
  /** Lines placed so far, as indices into exercise.lines. */
  picked: number[];
  onPick: (line: number) => void;
  onUnpick: (line: number) => void;
  onSay: (text: string) => void;
  disabled: boolean;
  state: '' | 'good' | 'bad';
};

export default function OrderLines({ exercise, picked, onPick, onUnpick, onSay, disabled, state }: Props) {
  const styles = useStyles();
  const colors = useColors();
  return (
    <View style={styles.order}>
      <View style={styles.answer} accessibilityLabel="The conversation so far">
        {picked.map((i, n) => {
          const line = exercise.lines[i];
          const b = line.speaker === 'B';
          return (
            <View key={i} style={[styles.row, b && styles.rowB]}>
              <Pressable
                disabled={disabled}
                onPress={() => {
                  feel('pick');
                  onUnpick(i);
                }}
                accessibilityRole="button"
                accessibilityLabel={`${n + 1}. ${line.text}. Tap to take it back`}
                style={[styles.bubble, b ? styles.bubbleB : styles.bubbleA, state === 'good' && styles.good, state === 'bad' && styles.bad]}
              >
                <View style={styles.num}>
                  <Text style={styles.numText}>{n + 1}</Text>
                </View>
                <LineText text={line.text} hint={line.hint} />
              </Pressable>
            </View>
          );
        })}
        {picked.length < exercise.lines.length ? (
          <View style={styles.slot}>
            <Text style={styles.slotText}>{picked.length + 1}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.bank}>
        {exercise.offered.map(i => {
          const line = exercise.lines[i];
          const used = picked.includes(i);
          return (
            // a used line keeps its space, so the others don't jump around
            <View key={i} style={[styles.card, used && styles.used]} pointerEvents={used ? 'none' : 'auto'} accessibilityElementsHidden={used}>
              <Pressable
                disabled={used || disabled}
                onPress={() => {
                  feel('pick');
                  onPick(i);
                  onSay(line.text);
                }}
                accessibilityRole="button"
                style={({ pressed }) => [styles.pick, pressed && styles.down]}
              >
                <LineText text={line.text} hint={line.hint} />
              </Pressable>
              <Pressable onPress={() => onSay(line.text)} accessibilityRole="button" accessibilityLabel="Hear this line" style={({ pressed }) => [styles.say, pressed && styles.down]}>
                <SymbolView name={{ ios: 'speaker.wave.2.fill', android: 'volume_up', web: 'volume_up' }} tintColor={colors.blue} size={20} />
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function LineText({ text, hint }: { text: string; hint?: string }) {
  const styles = useStyles();
  return (
    <View style={styles.text}>
      <Text style={[styles.line, ETHIOPIC.test(text) && styles.amharic]}>{text}</Text>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const useStyles = makeStyles(c => ({
  order: { gap: 18 },
  answer: { gap: 8, minHeight: 70, paddingVertical: 12, borderTopWidth: 2, borderBottomWidth: 2, borderColor: c.line },
  row: { flexDirection: 'row' },
  rowB: { justifyContent: 'flex-end' },
  bubble: { flexDirection: 'row', alignItems: 'center', gap: 10, maxWidth: '88%', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 16, borderWidth: 2, borderBottomWidth: 4, borderColor: c.line },
  bubbleA: { backgroundColor: '#ffffff', borderBottomLeftRadius: 4 },
  bubbleB: { backgroundColor: '#e8effb', borderColor: '#bcd0f0', borderBottomRightRadius: 4 },
  good: { borderColor: c.green },
  bad: { borderColor: '#ffb3ad' },
  num: { width: 26, height: 26, borderRadius: 13, backgroundColor: c.primary, alignItems: 'center', justifyContent: 'center' },
  numText: { fontFamily: fonts.black, fontSize: 13, color: '#ffffff' },
  slot: { width: 40, height: 40, borderRadius: 12, borderWidth: 2, borderStyle: 'dashed', borderColor: c.line, alignItems: 'center', justifyContent: 'center' },
  slotText: { fontFamily: fonts.black, fontSize: 15, color: c.muted },
  bank: { gap: 10 },
  card: { flexDirection: 'row', alignItems: 'stretch', gap: 8 },
  used: { opacity: 0 },
  pick: { flex: 1, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 16, borderWidth: 2, borderBottomWidth: 4, borderColor: c.line, backgroundColor: '#ffffff' },
  say: { width: 46, borderRadius: 14, borderWidth: 2, borderBottomWidth: 4, borderColor: c.line, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center' },
  down: { borderBottomWidth: 2, marginTop: 2 },
  text: { flexShrink: 1, gap: 2 },
  line: { fontFamily: fonts.heavy, fontSize: 17, color: c.ink },
  amharic: { fontFamily: fonts.amharic },
  hint: { fontFamily: fonts.bold, fontSize: 13, color: c.muted },
}));
