import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { amharicAudio } from '@/lib/amharicAudio';
import { DECKS, putBack, shuffle, type Card } from '@/lib/flashcards';
import Speaker from '@/components/speaker';
import { play } from '@/components/sound';
import Walia from '@/components/walia';
import { fonts, makeStyles } from '@/theme';

// Flashcards from each Amharic camp's phrases, the same decks as the website.
// Flip a card to check yourself, then sort it: "Got it" takes it out of the
// pile, "Still learning" sends it back in to see again.

type Direction = 'am-en' | 'en-am';

const DECK_KEY = 'kwanqa-flashcards-deck';

export default function Cards() {
  const styles = useStyles();
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
    <View style={styles.safe}>
      <ScrollView contentContainerStyle={styles.page}>

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
            <Walia mood="cheer" size={130} />
            <Text style={styles.doneBig}>ጎበዝ!</Text>
            <Text style={styles.hint}>
              You know all {total} cards in Camp {deck.part}.
            </Text>
            <View style={[styles.actions, styles.doneActions]}>
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
    </View>
  );
}

const useStyles = makeStyles(c => ({
  safe: { flex: 1, backgroundColor: c.bg },
  page: { padding: 16, gap: 14 },
  decks: { gap: 8, paddingBottom: 4 },
  deck: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 14, borderWidth: 2, borderBottomWidth: 4, borderColor: c.line },
  deckOn: { borderColor: c.primaryBorder, backgroundColor: c.primarySoft },
  deckName: { fontFamily: fonts.heavy, fontSize: 15, color: c.ink },
  deckNameOn: { color: c.primary },
  deckCount: { fontFamily: fonts.bold, fontSize: 12, color: c.muted },
  deckTitle: { fontFamily: fonts.bold, fontSize: 15, color: c.muted },
  direction: { flexDirection: 'row', gap: 8 },
  dirButton: { flex: 1, paddingVertical: 9, borderRadius: 14, borderWidth: 2, borderBottomWidth: 4, borderColor: c.line, alignItems: 'center' },
  dirOn: { borderColor: '#b9cdf2', backgroundColor: '#e6eefb' },
  dirText: { fontFamily: fonts.heavy, color: c.muted, fontSize: 14 },
  dirTextOn: { color: c.blue },
  progress: { height: 14, borderRadius: 7, backgroundColor: c.line, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: c.green, borderRadius: 7 },
  cardWrap: { height: 290 },
  face: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: 22,
    borderWidth: 2,
    borderBottomWidth: 6,
    borderColor: c.line,
    backgroundColor: c.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 10,
    backfaceVisibility: 'hidden',
  },
  back: { backgroundColor: '#fffaf7', borderColor: c.primaryBorder },
  big: { fontFamily: fonts.amharicBold, fontSize: 34, lineHeight: 50, color: c.ink, textAlign: 'center' },
  bigEn: { fontFamily: fonts.black, fontSize: 26, lineHeight: 32, color: c.ink, textAlign: 'center' },
  small: { fontFamily: fonts.amharic, fontSize: 18, lineHeight: 26, color: c.ink, textAlign: 'center' },
  roman: { fontFamily: fonts.heavy, fontSize: 17, color: c.primary, textAlign: 'center' },
  hint: { fontFamily: fonts.bold, fontSize: 15, color: c.muted, textAlign: 'center' },
  actions: { flexDirection: 'row', gap: 10, justifyContent: 'center', alignItems: 'center' },
  button: { flex: 1, paddingVertical: 14, borderRadius: 16, backgroundColor: c.primary, borderBottomWidth: 5, borderBottomColor: c.primaryShadow, alignItems: 'center' },
  buttonText: { fontFamily: fonts.black, color: '#ffffff', fontSize: 16, textTransform: 'uppercase', letterSpacing: 0.5 },
  secondary: { backgroundColor: c.bg, borderWidth: 2, borderBottomWidth: 5, borderColor: c.line, borderBottomColor: c.line },
  secondaryText: { fontFamily: fonts.black, color: c.muted, fontSize: 16, textTransform: 'uppercase', letterSpacing: 0.5 },
  count: { fontFamily: fonts.bold, textAlign: 'center', color: c.muted },
  done: { alignItems: 'center', gap: 12, paddingVertical: 20 },
  doneActions: { alignSelf: 'stretch' },
  doneBig: { fontFamily: fonts.amharicBold, fontSize: 40, lineHeight: 56, color: c.primary },
}));
