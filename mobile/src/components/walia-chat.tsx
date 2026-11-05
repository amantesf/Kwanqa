import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View, type ScrollViewInstance } from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { type ChatExercise } from '@/lib/interactive';
import Walia from '@/components/walia';
import { feel } from '@/haptics';
import { fonts, makeStyles } from '@/theme';

// "Chat with Walia", like the website's ChatRound (components/InteractiveQuestions.tsx):
// Walia types for a moment, says a line, and you tap your reply. A wrong reply
// costs stamina but the chat carries on; after the last turn it's solved.

const ETHIOPIC = /[ሀ-፿]/;

type Props = {
  exercise: ChatExercise;
  onSay: (text: string) => void;
  onMistake: () => void;
  onDone: () => void;
};

export default function WaliaChat({ exercise, onSay, onMistake, onDone }: Props) {
  const styles = useStyles();
  const [turn, setTurn] = useState(0);
  const [wrong, setWrong] = useState<string | null>(null);
  const [typing, setTyping] = useState(true);
  const log = useRef<ScrollViewInstance>(null);
  const current = exercise.turns[turn];
  const finished = turn >= exercise.turns.length;

  // Walia "types" for a moment, then says the line out loud
  useEffect(() => {
    if (finished) return;
    setTyping(true);
    const timer = setTimeout(
      () => {
        setTyping(false);
        onSay(exercise.turns[turn].walia);
      },
      turn === 0 ? 300 : 900,
    );
    return () => clearTimeout(timer);
  }, [turn]); // eslint-disable-line react-hooks/exhaustive-deps

  function pick(option: string) {
    if (!current || typing) return;
    onSay(option);
    if (option !== current.answer) {
      setWrong(option);
      onMistake();
      setTimeout(() => setWrong(null), 600);
      return;
    }
    feel('pick');
    setWrong(null);
    const next = turn + 1;
    setTurn(next);
    if (next >= exercise.turns.length) setTimeout(onDone, 700);
  }

  return (
    <View style={styles.chat}>
      <ScrollView ref={log} style={styles.log} contentContainerStyle={styles.logInner} onContentSizeChange={() => log.current?.scrollToEnd({ animated: true })}>
        {exercise.turns.slice(0, Math.min(turn + 1, exercise.turns.length)).map((t, i) => (
          <View key={i} style={styles.pair}>
            {i < turn || !typing ? (
              <Animated.View entering={FadeInDown.duration(220)} style={styles.rowWalia}>
                <View style={styles.avatar}>
                  <Walia size={40} />
                </View>
                <Pressable onPress={() => onSay(t.walia)} accessibilityRole="button" accessibilityLabel={`Walia: ${t.walia}. Hear it again`} style={[styles.bubble, styles.bubbleWalia]}>
                  <Text style={[styles.line, ETHIOPIC.test(t.walia) && styles.amharic]}>{t.walia}</Text>
                  {t.waliaHint ? <Text style={styles.hint}>{t.waliaHint}</Text> : null}
                </Pressable>
              </Animated.View>
            ) : null}
            {i < turn ? (
              <Animated.View entering={FadeInDown.duration(220)} style={styles.rowYou}>
                <Pressable onPress={() => onSay(t.answer)} accessibilityRole="button" accessibilityLabel={`You: ${t.answer}. Hear it again`} style={[styles.bubble, styles.bubbleYou]}>
                  <Text style={[styles.line, ETHIOPIC.test(t.answer) && styles.amharic]}>{t.answer}</Text>
                  {t.hints?.[t.answer] ? <Text style={styles.hint}>{t.hints[t.answer]}</Text> : null}
                </Pressable>
              </Animated.View>
            ) : null}
          </View>
        ))}
        {typing && !finished ? (
          <View style={styles.rowWalia} accessibilityLabel="Walia is typing">
            <View style={styles.avatar}>
              <Walia size={40} />
            </View>
            <View style={[styles.bubble, styles.bubbleWalia, styles.typing]}>
              {[0, 1, 2].map(i => (
                <Dot key={i} delay={i * 150} />
              ))}
            </View>
          </View>
        ) : null}
      </ScrollView>

      {!finished ? (
        <View style={styles.options} accessibilityLabel="Your reply">
          {current.options.map(option => (
            <Pressable
              key={option}
              disabled={typing}
              onPress={() => pick(option)}
              accessibilityRole="button"
              style={({ pressed }) => [styles.option, typing && styles.optionWaiting, wrong === option && styles.optionWrong, pressed && styles.down]}
            >
              <Text style={[styles.optionText, ETHIOPIC.test(option) && styles.amharic]}>{option}</Text>
              {current.hints?.[option] ? <Text style={styles.hint}>{current.hints[option]}</Text> : null}
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

/** One of the three bouncing "typing" dots. */
function Dot({ delay }: { delay: number }) {
  const styles = useStyles();
  const y = useSharedValue(0);
  useEffect(() => {
    y.set(withDelay(delay, withRepeat(withSequence(withTiming(-5, { duration: 300 }), withTiming(0, { duration: 300 }), withTiming(0, { duration: 400 })), -1)));
  }, [delay, y]);
  const style = useAnimatedStyle(() => ({ transform: [{ translateY: y.get() }] }));
  return <Animated.View style={[styles.dot, style]} />;
}

const useStyles = makeStyles(c => ({
  chat: { gap: 18 },
  log: { maxHeight: 340 },
  logInner: { gap: 10, paddingVertical: 4 },
  pair: { gap: 10 },
  rowWalia: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  rowYou: { flexDirection: 'row', justifyContent: 'flex-end' },
  avatar: { width: 40, height: 40 },
  bubble: { maxWidth: '80%', gap: 2, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 18, borderWidth: 2, borderColor: c.line, backgroundColor: '#ffffff' },
  bubbleWalia: { borderBottomLeftRadius: 4 },
  bubbleYou: { borderBottomRightRadius: 4, borderColor: '#b6e3a8', backgroundColor: '#e9f8e4' },
  line: { fontFamily: fonts.heavy, fontSize: 18, color: c.ink },
  amharic: { fontFamily: fonts.amharic },
  hint: { fontFamily: fonts.bold, fontSize: 13, color: c.muted },
  typing: { flexDirection: 'row', gap: 5, paddingVertical: 16, paddingHorizontal: 18 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: c.muted },
  options: { gap: 10 },
  option: { minHeight: 60, justifyContent: 'center', gap: 1, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 16, borderWidth: 2, borderBottomWidth: 4, borderColor: c.line, backgroundColor: '#ffffff' },
  optionWaiting: { opacity: 0.55 },
  optionWrong: { borderColor: '#ffb3ad', backgroundColor: '#ffe9e7' },
  optionText: { fontFamily: fonts.bold, fontSize: 17, color: c.ink },
  down: { borderBottomWidth: 2, marginTop: 2 },
}));
