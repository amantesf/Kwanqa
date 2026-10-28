import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { amharicAudio } from '@/lib/amharicAudio';
import type { Stamp } from '@/lib/passport';
import { PLACE_LESSONS, type PlaceWord } from '@/lib/placeLessons';
import Button from '@/components/button';
import PassportStamp from '@/components/passport-stamp';
import { play } from '@/components/sound';
import Speaker from '@/components/speaker';
import { colors, fonts } from '@/theme';

// The one-minute lesson about a passport stamp's place, like the website's
// (components/PlaceLesson.tsx): a few short cards, each with an Amharic word
// Walia says, then one quick question.

export const hasPlaceLesson = (stamp: Stamp) => Boolean(PLACE_LESSONS[stamp.id]);

function say(text: string) {
  const audio = amharicAudio(text);
  if (audio) play(audio);
}

/** The Amharic word on a card: said once as it appears, and again when tapped. */
function WordChip({ word }: { word: PlaceWord }) {
  useEffect(() => {
    const timer = setTimeout(() => say(word.am), 300);
    return () => clearTimeout(timer);
  }, [word.am]);

  return (
    <View style={styles.word}>
      <Speaker onPress={() => say(word.am)} label={`Hear ${word.en}`} />
      <View style={styles.flex}>
        <Text style={styles.wordAm}>{word.am}</Text>
        <Text style={styles.wordTr}>{word.tr}</Text>
        <Text style={styles.wordEn}>{word.en}</Text>
      </View>
    </View>
  );
}

export default function PlaceLesson({ stamp, onDone }: { stamp: Stamp; onDone: () => void }) {
  const lesson = PLACE_LESSONS[stamp.id];
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  if (!lesson) return null;

  const total = lesson.cards.length + 1;
  const card = lesson.cards[step];
  const { question } = lesson;

  return (
    <View style={styles.wrap}>
      <View style={styles.head}>
        <PassportStamp stamp={stamp} earned size={56} tilt={-6} />
        <View style={styles.flex}>
          <Text style={[styles.kicker, { color: stamp.ink }]}>Quick lesson</Text>
          <Text style={styles.title}>
            {stamp.name} <Text style={[styles.titleAm, { color: stamp.ink }]}>{stamp.amharic}</Text>
          </Text>
        </View>
      </View>

      <View style={styles.dots}>
        {Array.from({ length: total }, (_, i) => (
          <View key={i} style={[styles.dot, i <= step && { backgroundColor: stamp.ink }]} />
        ))}
      </View>

      {card ? (
        <View style={styles.card} key={step}>
          <Text style={styles.text}>{card.text}</Text>
          <WordChip word={card.word} />
          <Button label={step === lesson.cards.length - 1 ? 'Quiz me' : 'Next'} onPress={() => setStep(step + 1)} />
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.question}>{question.q}</Text>
          {question.options.map((o, i) => {
            const state = picked === null ? null : i === question.answer ? 'right' : i === picked ? 'wrong' : 'dim';
            return (
              <Pressable
                key={o}
                disabled={picked !== null}
                onPress={() => setPicked(i)}
                style={[styles.option, state === 'right' && styles.right, state === 'wrong' && styles.wrong, state === 'dim' && styles.dim]}
              >
                <Text style={styles.optionText}>{o}</Text>
              </Pressable>
            );
          })}
          {picked !== null ? (
            <>
              <Text style={[styles.why, picked === question.answer && styles.whyRight]}>
                <Text style={styles.whyLead}>{picked === question.answer ? 'ጎበዝ! That’s right. ' : 'Not quite. '}</Text>
                {question.why}
              </Text>
              <Button label="Done" onPress={onDone} />
            </>
          ) : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  wrap: { gap: 14 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  kicker: { fontFamily: fonts.heavy, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.6 },
  title: { fontFamily: fonts.black, fontSize: 22, color: colors.ink },
  titleAm: { fontFamily: fonts.amharicBold },
  dots: { flexDirection: 'row', gap: 6 },
  dot: { flex: 1, height: 6, borderRadius: 3, backgroundColor: colors.line },
  card: { gap: 12 },
  text: { fontFamily: fonts.bold, fontSize: 17, lineHeight: 25, color: colors.ink },
  word: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 16, backgroundColor: colors.bgSoft },
  wordAm: { fontFamily: fonts.amharicBold, fontSize: 22, lineHeight: 32, color: colors.ink },
  wordTr: { fontFamily: fonts.heavy, fontSize: 14, color: colors.primary },
  wordEn: { fontFamily: fonts.bold, fontSize: 14, color: colors.muted },
  question: { fontFamily: fonts.black, fontSize: 19, lineHeight: 25, color: colors.ink },
  option: { padding: 14, borderRadius: 16, borderWidth: 2, borderBottomWidth: 4, borderColor: colors.line, backgroundColor: '#ffffff' },
  right: { borderColor: '#a5ed6e', backgroundColor: '#e9f8e4' },
  wrong: { borderColor: '#ffb3ad', backgroundColor: '#ffe9e7' },
  dim: { opacity: 0.5 },
  optionText: { fontFamily: fonts.bold, fontSize: 16, color: colors.ink },
  why: { fontFamily: fonts.bold, fontSize: 15, lineHeight: 21, color: '#d9443a' },
  whyRight: { color: '#3a9a28' },
  whyLead: { fontFamily: fonts.black },
});
