import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { amharicAudio } from '@/lib/amharicAudio';
import { DECKS, putBack, shuffle, type Card } from '@/lib/flashcards';
import Speaker from '@/components/speaker';
import { play } from '@/components/sound';
import { colors, tabBarTop } from '@/theme';

// Flashcards from each Amharic camp's phrases, the same decks as the website.
// Flip a card to check yourself, then sort it: "Got it" takes it out of the
// pile, "Still learning" sends it back in to see again.

type Direction = 'am-en' | 'en-am';

const DECK_KEY = 'kwanqa-flashcards-deck';

export default function Cards() {
  const [deckIndex, setDeckIndex] = useState(0);
  const [direction, setDirection] = useState<Direction>('am-en');
  const [pile, setPile] = useState<Card[]>(() => DECKS[0]?.cards ?? []);
  const [known, setKnown] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const turn = useSharedValue(0);

  const deck = DECKS[deckIndex];
  const card = pile[0];
  const total = deck?.cards.length ?? 0;
  const audio = card ? amharicAudio(card.amharic) : null;

  const flip = useCallback(
    (to: boolean) => {
      setFlipped(to);
      turn.set(withTiming(to ? 1 : 0, { duration: 350 }));
    },
    [turn],
  );

  const start = useCallback(
    (i: number) => {
      setDeckIndex(i);
      setPile(shuffle(DECKS[i].cards));
      setKnown(0);
      flip(false);
      AsyncStorage.setItem(DECK_KEY, DECKS[i].slug).catch(() => {});
    },
    [flip],
  );

  // reopen the deck the learner was last on, shuffled
  useEffect(() => {
    AsyncStorage.getItem(DECK_KEY)
      .then(slug => start(Math.max(0, DECKS.findIndex(d => d.slug === slug))))
      .catch(() => start(0));
  }, [start]);

  function sort(gotIt: boolean) {
    if (!card) return;
    turn.set(0);
    setFlipped(false);
    if (gotIt) {
      setKnown(k => k + 1);
      setPile(p => p.slice(1));
    } else {
      setPile(putBack);
    }
  }

  const frontStyle = useAnimatedStyle(() => ({ transform: [{ perspective: 1000 }, { rotateY: `${interpolate(turn.get(), [0, 1], [0, 180])}deg` }] }));
  const backStyle = useAnimatedStyle(() => ({ transform: [{ perspective: 1000 }, { rotateY: `${interpolate(turn.get(), [0, 1], [180, 360])}deg` }] }));

  if (!deck) return null;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.page}>
        <Text style={styles.heading}>Flashcards</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.decks}>
          {DECKS.map((d, i) => (
            <Pressable key={d.slug} onPress={() => start(i)} style={[styles.deck, i === deckIndex && styles.deckOn]} accessibilityState={{ selected: i === deckIndex }}>
              <Text style={[styles.deckName, i === deckIndex && styles.deckNameOn]}>Camp {d.part}</Text>
              <Text style={styles.deckCount}>{d.cards.length} cards</Text>
            </Pressable>
          ))}
        </ScrollView>

        <Text style={styles.deckTitle}>{deck.title}</Text>

        <View style={styles.direction}>
          {(['am-en', 'en-am'] as Direction[]).map(d => (
            <Pressable
              key={d}
              onPress={() => {
                setDirection(d);
                flip(false);
              }}
              style={[styles.dirButton, direction === d && styles.dirOn]}
            >
              <Text style={[styles.dirText, direction === d && styles.dirTextOn]}>{d === 'am-en' ? 'አማርኛ → English' : 'English → አማርኛ'}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.progress}>
          <View style={[styles.progressFill, { width: `${total ? (known / total) * 100 : 0}%` }]} />
        </View>

        {card ? (
          <>
            <Pressable onPress={() => flip(!flipped)} accessibilityLabel={flipped ? 'Show the front' : 'Flip the card'} style={styles.cardWrap}>
              <Animated.View style={[styles.face, frontStyle]}>
                {direction === 'am-en' ? (
                  <>
                    <Text style={styles.big}>{card.amharic}</Text>
                    <Text style={styles.hint}>What does it mean?</Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.bigEn}>{card.english}</Text>
                    <Text style={styles.hint}>How do you say it in Amharic?</Text>
                  </>
                )}
              </Animated.View>
              <Animated.View style={[styles.face, styles.back, backStyle]}>
                {direction === 'am-en' ? (
                  <>
                    <Text style={styles.small}>{card.amharic}</Text>
                    <Text style={styles.roman}>{card.transliteration}</Text>
                    <Text style={styles.bigEn}>{card.english}</Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.big}>{card.amharic}</Text>
                    <Text style={styles.roman}>{card.transliteration}</Text>
                    <Text style={styles.hint}>{card.english}</Text>
                  </>
                )}
              </Animated.View>
            </Pressable>

            <View style={styles.actions}>
              {audio && (direction === 'am-en' || flipped) ? <Speaker onPress={() => play(audio)} /> : null}
              {flipped ? (
                <>
                  <Pressable onPress={() => sort(false)} style={[styles.button, styles.secondary]}>
                    <Text style={styles.secondaryText}>Still learning</Text>
                  </Pressable>
                  <Pressable onPress={() => sort(true)} style={styles.button}>
                    <Text style={styles.buttonText}>Got it</Text>
                  </Pressable>
                </>
              ) : (
                <Pressable onPress={() => flip(true)} style={[styles.button, styles.secondary]}>
                  <Text style={styles.secondaryText}>Show answer</Text>
                </Pressable>
              )}
            </View>
            <Text style={styles.count}>
              {pile.length} left · {known} known
            </Text>
          </>
        ) : (
          <View style={styles.done}>
            <Text style={styles.doneBig}>ጎበዝ!</Text>
            <Text style={styles.hint}>
              You know all {total} cards in Camp {deck.part}.
            </Text>
            <View style={styles.actions}>
              <Pressable onPress={() => start(deckIndex)} style={[styles.button, styles.secondary]}>
                <Text style={styles.secondaryText}>Go again</Text>
              </Pressable>
              {deckIndex + 1 < DECKS.length ? (
                <Pressable onPress={() => start(deckIndex + 1)} style={styles.button}>
                  <Text style={styles.buttonText}>Camp {DECKS[deckIndex + 1].part}</Text>
                </Pressable>
              ) : null}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg, paddingTop: tabBarTop },
  page: { padding: 16, gap: 14 },
  heading: { fontSize: 34, fontWeight: '800', color: colors.ink },
  decks: { gap: 8 },
  deck: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 12, borderWidth: 2, borderColor: colors.line },
  deckOn: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  deckName: { fontWeight: '800', color: colors.ink },
  deckNameOn: { color: colors.primary },
  deckCount: { fontSize: 12, color: colors.muted },
  deckTitle: { fontSize: 15, color: colors.muted },
  direction: { flexDirection: 'row', gap: 8 },
  dirButton: { flex: 1, paddingVertical: 8, borderRadius: 10, borderWidth: 2, borderColor: colors.line, alignItems: 'center' },
  dirOn: { borderColor: colors.blue, backgroundColor: '#e6eefb' },
  dirText: { fontWeight: '700', color: colors.muted, fontSize: 13 },
  dirTextOn: { color: colors.blue },
  progress: { height: 10, borderRadius: 5, backgroundColor: colors.bgSoft, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.green, borderRadius: 5 },
  cardWrap: { height: 280 },
  face: {
    position: 'absolute',
    inset: 0,
    borderRadius: 20,
    borderWidth: 2,
    borderBottomWidth: 5,
    borderColor: colors.line,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 10,
    backfaceVisibility: 'hidden',
  },
  back: { backgroundColor: '#fffdfb', borderColor: colors.primaryBorder },
  big: { fontSize: 34, fontWeight: '700', color: colors.ink, textAlign: 'center' },
  bigEn: { fontSize: 26, fontWeight: '700', color: colors.ink, textAlign: 'center' },
  small: { fontSize: 18, color: colors.ink, textAlign: 'center' },
  roman: { fontSize: 16, color: colors.primary, textAlign: 'center' },
  hint: { fontSize: 15, color: colors.muted, textAlign: 'center' },
  actions: { flexDirection: 'row', gap: 10, justifyContent: 'center', alignItems: 'center' },
  button: { flex: 1, paddingVertical: 14, borderRadius: 14, backgroundColor: colors.primary, borderBottomWidth: 4, borderBottomColor: colors.primaryShadow, alignItems: 'center' },
  buttonText: { color: '#ffffff', fontWeight: '800', fontSize: 16 },
  secondary: { backgroundColor: colors.bg, borderWidth: 2, borderColor: colors.line, borderBottomColor: colors.line },
  secondaryText: { color: colors.ink, fontWeight: '800', fontSize: 16 },
  count: { textAlign: 'center', color: colors.muted },
  done: { alignItems: 'center', gap: 12, paddingVertical: 30 },
  doneBig: { fontSize: 40, fontWeight: '800', color: colors.primary },
});
