import { useState } from 'react';
import { Pressable, ScrollView, Share, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';
import { THEMES, meaningChoices, proverbOfTheDay, proverbs, themeOf, type Proverb, type Theme } from '@/lib/proverbs';
import Button from '@/components/button';
import { playEffect } from '@/components/sound';
import Walia from '@/components/walia';
import { colors, fonts } from '@/theme';

// ተረትና ምሳሌ, like the website's Proverbs page (components/ProverbsPage.tsx):
// Walia hosts "crack the proverb" (tap words for hints, pick the meaning), then
// every proverb as a flip card, sorted into five colourful themes.

/** A small icon for each theme (the website's). */
function ThemeIcon({ theme, size = 22 }: { theme: Theme; size?: number }) {
  const c = THEMES[theme].color;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {theme === 'patience' && (
        <>
          <Ellipse cx={12} cy={13} rx={7} ry={9} fill={c} />
          <Path d="M8 18 L10 20 M16 18 L14 20" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" />
          <Ellipse cx={10} cy={9} rx={2} ry={3} fill="#fff" opacity={0.55} />
        </>
      )}
      {theme === 'together' && (
        <>
          <Circle cx={7} cy={12} r={5} fill="none" stroke={c} strokeWidth={2.6} />
          <Circle cx={17} cy={12} r={5} fill="none" stroke={c} strokeWidth={2.6} />
          <Circle cx={12} cy={12} r={2.2} fill={c} />
        </>
      )}
      {theme === 'careful' && (
        <>
          <Path d="M2 12 C 6 5, 18 5, 22 12 C 18 19, 6 19, 2 12 Z" fill={c} />
          <Circle cx={12} cy={12} r={4} fill="#fff" />
          <Circle cx={12} cy={12} r={2} fill="#241a14" />
        </>
      )}
      {theme === 'wisdom' && (
        <>
          <Path d="M12 2 L15 9 L22 12 L15 15 L12 22 L9 15 L2 12 L9 9 Z" fill={c} />
          <Path d="M12 8 L13.5 12 L12 16 L10.5 12 Z" fill="#fff" />
        </>
      )}
      {theme === 'worth' && (
        <>
          <Rect x={3} y={8} width={18} height={9} rx={2} fill={c} transform="rotate(-8 12 12)" />
          <Rect x={6} y={10.5} width={12} height={2} rx={1} fill="#fff" opacity={0.6} transform="rotate(-8 12 12)" />
        </>
      )}
    </Svg>
  );
}

/** "Crack the proverb": tap words for hints, pick the meaning, Walia reacts. */
function Game({ first }: { first: Proverb }) {
  const [proverb, setProverb] = useState(first);
  const [seen, setSeen] = useState<string[]>([first.id]);
  const [word, setWord] = useState<number | null>(null);
  const [guess, setGuess] = useState<string | null>(null);
  const [score, setScore] = useState({ right: 0, played: 0 });
  const theme = themeOf(proverb);
  const t = THEMES[theme];
  const answered = guess !== null;
  const right = guess === proverb.meaning;

  function answer(choice: string) {
    if (answered) return;
    const correct = choice === proverb.meaning;
    setGuess(choice);
    setScore(s => ({ right: s.right + (correct ? 1 : 0), played: s.played + 1 }));
    playEffect(correct ? 'correct' : 'wrong');
  }

  function another() {
    const pool = proverbs.filter(p => !seen.includes(p.id));
    const list = pool.length ? pool : proverbs.filter(p => p.id !== proverb.id);
    const next = list[Math.floor(Math.random() * list.length)];
    setSeen(pool.length ? [...seen, next.id] : [next.id]);
    setProverb(next);
    setWord(null);
    setGuess(null);
  }

  function share() {
    void Share.share({ message: `${proverb.amharic}\n“${proverb.literal}”\n${proverb.meaning}\n\nAmharic proverbs on kwanqa.com` }).catch(() => {});
  }

  return (
    <View style={[styles.game, { borderTopColor: t.color }]}>
      <View style={styles.gameTop}>
        <View style={[styles.chip, { backgroundColor: t.soft }]}>
          <ThemeIcon theme={theme} size={18} />
          <Text style={[styles.chipLabel, { color: t.color }]}>{proverb.id === first.id ? 'Today’s proverb' : t.label}</Text>
        </View>
        {score.played > 0 ? (
          <Text style={styles.score}>
            {score.right}/{score.played} cracked
          </Text>
        ) : null}
      </View>

      <View style={styles.words}>
        {proverb.words.map((w, i) => (
          <Pressable key={`${proverb.id}-${i}`} onPress={() => setWord(word === i ? null : i)} style={[styles.word, word === i && { borderColor: t.color, backgroundColor: t.soft }]}>
            <Text style={styles.wordText}>{w.am}</Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.translit}>{proverb.transliteration}</Text>
      <Text style={styles.hint}>
        {word !== null ? (
          <>
            <Text style={styles.hintAm}>{proverb.words[word].am}</Text> means “{proverb.words[word].en}”
          </>
        ) : (
          'Stuck? Tap any word for a hint.'
        )}
      </Text>

      <View style={styles.ask}>
        <Walia mood={answered ? (right ? 'cheer' : 'sad') : 'thinking'} size={80} />
        <View style={styles.bubble}>
          <Text style={styles.bubbleText}>{!answered ? 'What’s Grandma really trying to say?' : right ? 'ጎበዝ! You cracked it!' : 'Ahh, so close! Here’s the real meaning.'}</Text>
        </View>
      </View>

      <View style={styles.options}>
        {meaningChoices(proverb).map((c, i) => {
          const state = !answered ? null : c === proverb.meaning ? 'correct' : c === guess ? 'wrong' : 'dim';
          return (
            <Pressable
              key={c}
              disabled={answered}
              onPress={() => answer(c)}
              style={[styles.option, state === 'correct' && styles.optionRight, state === 'wrong' && styles.optionWrong, state === 'dim' && styles.optionDim]}
            >
              <View style={styles.key}>
                <Text style={styles.keyText}>{i + 1}</Text>
              </View>
              <Text style={styles.optionText}>{c}</Text>
            </Pressable>
          );
        })}
      </View>

      {answered ? (
        <View style={styles.reveal}>
          <Text style={styles.literal}>Word for word: “{proverb.literal}”</Text>
          <Button label="Another one!" onPress={another} />
          <Button label="Share" tone="plain" onPress={share} />
        </View>
      ) : null}
    </View>
  );
}

/** Tap to flip: the Amharic on the front, what it means on the back. */
function FlipCard({ proverb }: { proverb: Proverb }) {
  const [flipped, setFlipped] = useState(false);
  const turn = useSharedValue(0);
  const theme = themeOf(proverb);
  const t = THEMES[theme];
  const front = useAnimatedStyle(() => ({ transform: [{ perspective: 1000 }, { rotateY: `${interpolate(turn.get(), [0, 1], [0, 180])}deg` }] }));
  const back = useAnimatedStyle(() => ({ transform: [{ perspective: 1000 }, { rotateY: `${interpolate(turn.get(), [0, 1], [180, 360])}deg` }] }));

  return (
    <Pressable
      onPress={() => {
        turn.set(withTiming(flipped ? 0 : 1, { duration: 350 }));
        setFlipped(!flipped);
      }}
      accessibilityLabel={flipped ? `${proverb.amharic}: ${proverb.meaning}` : `${proverb.amharic}. Tap to see what it means.`}
      style={styles.flip}
    >
      <Animated.View style={[styles.face, { borderTopColor: t.color }, front]}>
        <ThemeIcon theme={theme} />
        <Text style={styles.faceAm}>{proverb.amharic}</Text>
        <Text style={styles.faceTr}>{proverb.transliteration}</Text>
        <Text style={styles.faceTap}>Tap to flip</Text>
      </Animated.View>
      <Animated.View style={[styles.face, { borderTopColor: t.color, backgroundColor: t.soft }, back]}>
        <Text style={styles.faceLit}>“{proverb.literal}”</Text>
        <Text style={styles.faceMean}>{proverb.meaning}</Text>
      </Animated.View>
    </Pressable>
  );
}

export default function Proverbs() {
  const [theme, setTheme] = useState<Theme | 'all'>('all');
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const shown = proverbs.filter(p => (theme === 'all' || themeOf(p) === theme) && (!q || [p.amharic, p.transliteration, p.literal, p.meaning].some(x => x.toLowerCase().includes(q))));

  return (
    <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
      <View style={styles.hero}>
        <Walia pose="wave" size={84} />
        <View style={styles.heroBubble}>
          <Text style={styles.heroText}>Ethiopian grandmas have a proverb for everything. Let’s see if you can crack a few!</Text>
        </View>
      </View>

      <Game first={proverbOfTheDay(new Date())} />

      <Text style={styles.heading}>The whole collection</Text>
      <TextInput value={query} onChangeText={setQuery} placeholder="Search: lion, water, hyena…" placeholderTextColor="#afafaf" style={styles.search} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.themes}>
        <Pressable onPress={() => setTheme('all')} style={[styles.themeChip, theme === 'all' && styles.themeChipOn]}>
          <Text style={[styles.themeText, theme === 'all' && { color: colors.primary }]}>All {proverbs.length}</Text>
        </Pressable>
        {(Object.keys(THEMES) as Theme[]).map(k => (
          <Pressable key={k} onPress={() => setTheme(theme === k ? 'all' : k)} style={[styles.themeChip, theme === k && { borderColor: THEMES[k].color, backgroundColor: THEMES[k].soft }]}>
            <ThemeIcon theme={k} size={18} />
            <Text style={[styles.themeText, theme === k && { color: THEMES[k].color }]}>{THEMES[k].label}</Text>
          </Pressable>
        ))}
      </ScrollView>
      {shown.length ? shown.map(p => <FlipCard key={p.id} proverb={p} />) : <Text style={styles.empty}>No proverbs match that. Try “water” or “lion”.</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: 16, gap: 14, paddingBottom: 48 },
  hero: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  heroBubble: { flex: 1, padding: 12, borderRadius: 16, borderWidth: 2, borderBottomWidth: 4, borderColor: colors.line, marginBottom: 22 },
  heroText: { fontFamily: fonts.heavy, fontSize: 15, lineHeight: 20, color: colors.ink },
  heading: { fontFamily: fonts.black, fontSize: 24, color: colors.ink, marginTop: 10 },
  game: { gap: 12, padding: 18, borderRadius: 24, borderWidth: 2, borderTopWidth: 8, borderBottomWidth: 5, borderColor: colors.line, backgroundColor: '#ffffff' },
  gameTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 999 },
  chipLabel: { fontFamily: fonts.heavy, fontSize: 13 },
  score: { fontFamily: fonts.heavy, fontSize: 13, color: colors.muted },
  words: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  word: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 14, borderWidth: 2, borderBottomWidth: 4, borderColor: colors.line, backgroundColor: '#ffffff' },
  wordText: { fontFamily: fonts.amharicBold, fontSize: 22, lineHeight: 32, color: colors.ink },
  translit: { fontFamily: fonts.bold, fontSize: 15, color: colors.primary },
  hint: { fontFamily: fonts.bold, fontSize: 15, color: colors.muted },
  hintAm: { fontFamily: fonts.amharicBold, color: colors.ink },
  ask: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  bubble: { flex: 1, padding: 12, borderRadius: 16, borderWidth: 2, borderBottomWidth: 4, borderColor: colors.line, marginBottom: 20 },
  bubbleText: { fontFamily: fonts.heavy, fontSize: 16, lineHeight: 21, color: colors.ink },
  options: { gap: 10 },
  option: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 16, borderWidth: 2, borderBottomWidth: 4, borderColor: colors.line, backgroundColor: '#ffffff' },
  optionRight: { borderColor: '#a5ed6e', backgroundColor: '#e9f8e4' },
  optionWrong: { borderColor: '#ffb3ad', backgroundColor: '#ffe9e7' },
  optionDim: { opacity: 0.5 },
  key: { width: 28, height: 28, borderRadius: 8, borderWidth: 2, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  keyText: { fontFamily: fonts.heavy, fontSize: 13, color: colors.muted },
  optionText: { flex: 1, fontFamily: fonts.bold, fontSize: 16, lineHeight: 21, color: colors.ink },
  reveal: { gap: 10 },
  literal: { fontFamily: fonts.bold, fontSize: 15, lineHeight: 21, color: colors.muted, fontStyle: 'italic' },
  search: { minHeight: 48, paddingHorizontal: 16, borderRadius: 14, borderWidth: 2, borderColor: colors.line, backgroundColor: colors.bgSoft, fontFamily: fonts.bold, fontSize: 16, color: colors.ink },
  themes: { gap: 8 },
  themeChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12, borderWidth: 2, borderBottomWidth: 4, borderColor: colors.line },
  themeChipOn: { borderColor: colors.primaryBorder, backgroundColor: colors.primarySoft },
  themeText: { fontFamily: fonts.heavy, fontSize: 14, color: colors.muted },
  flip: { height: 190 },
  face: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 18,
    borderRadius: 20,
    borderWidth: 2,
    borderTopWidth: 6,
    borderBottomWidth: 5,
    borderColor: colors.line,
    backgroundColor: '#ffffff',
    backfaceVisibility: 'hidden',
  },
  faceAm: { fontFamily: fonts.amharicBold, fontSize: 21, lineHeight: 31, color: colors.ink, textAlign: 'center' },
  faceTr: { fontFamily: fonts.bold, fontSize: 14, color: colors.primary, textAlign: 'center' },
  faceTap: { fontFamily: fonts.heavy, fontSize: 12, color: '#afafaf', textTransform: 'uppercase', letterSpacing: 0.6 },
  faceLit: { fontFamily: fonts.bold, fontSize: 15, lineHeight: 21, color: colors.muted, textAlign: 'center', fontStyle: 'italic' },
  faceMean: { fontFamily: fonts.black, fontSize: 18, lineHeight: 24, color: colors.ink, textAlign: 'center' },
  empty: { fontFamily: fonts.bold, fontSize: 15, color: colors.muted, textAlign: 'center', paddingVertical: 20 },
});
