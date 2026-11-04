import { Modal, Pressable, Text, useWindowDimensions, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { LESSON_GRASS, REPLAY_GRASS } from '@/lib/climb';
import { type LessonSection, type Track } from '@/lib/courses';
import { Grass, Peak } from '@/components/icons';
import { fonts, makeStyles, useColors } from '@/theme';

// What a lesson teaches, shown over its stone on the trail before you start:
// its name, the first few phrases, and the grass it earns.

/** Where the tapped stone is on screen. */
export type StoneSpot = { x: number; y: number; width: number; height: number };

const SHOWN = 3;
const GAP = 10;

type Props = {
  spot: StoneSpot | null;
  lesson: LessonSection | null;
  track: Track;
  done: boolean;
  /** Not reached yet: says to keep climbing instead of offering Start. */
  locked: boolean;
  onStart: () => void;
  /** Scrolls the trail back to where Walia is. */
  onJump: () => void;
  onPhrases: () => void;
  onClose: () => void;
};

export default function StoneCard({ spot, lesson, track, done, locked, onStart, onJump, onPhrases, onClose }: Props) {
  const styles = useStyles();
  const colors = useColors();
  const { width: screenW, height: screenH } = useWindowDimensions();
  if (!spot || !lesson) return null;

  const cardW = Math.min(screenW - 32, 340);
  const centre = spot.x + spot.width / 2;
  const left = Math.min(Math.max(centre - cardW / 2, 16), screenW - 16 - cardW);
  // above the stone, unless it's too near the top of the screen
  const below = spot.y < screenH * 0.45;
  const place = below ? { top: spot.y + spot.height + GAP } : { bottom: screenH - spot.y + GAP };

  const phrases = lesson.phrases ?? [];
  const more = phrases.length - SHOWN;
  const grass = done ? REPLAY_GRASS : LESSON_GRASS;

  return (
    <Modal visible transparent animationType="none" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close" />
      <Animated.View entering={ZoomIn.duration(160)} style={[styles.card, { width: cardW, left }, place]}>
        <View style={[styles.arrow, below ? styles.arrowUp : styles.arrowDown, { left: centre - left - 9 }]} />
        <View style={styles.head}>
          <Text style={styles.title}>{lesson.title.replace(/^Lesson \d+ – /, '')}</Text>
          {done ? (
            <View style={styles.done}>
              <Svg width={14} height={14} viewBox="0 0 24 24">
                <Path d="M5 12.5l4.5 4.5L19 7.5" stroke={colors.goldShadow} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </Svg>
              <Text style={styles.doneText}>Done</Text>
            </View>
          ) : null}
        </View>
        {lesson.description ? <Text style={styles.description}>{lesson.description}</Text> : null}

        {phrases.length > 0 ? (
          <View style={styles.phrases}>
            {phrases.slice(0, SHOWN).map(p => (
              <Text key={p.amharic + p.english} style={styles.phrase} numberOfLines={1}>
                {track === 'english' ? (
                  <>
                    <Text style={styles.word}>{p.english}</Text>
                    <Text style={styles.meaning}> · </Text>
                    <Text style={[styles.meaning, styles.amharic]}>{p.amharic}</Text>
                  </>
                ) : (
                  <>
                    <Text style={[styles.word, styles.amharic]}>{p.amharic}</Text>
                    {p.transliteration ? <Text style={styles.roman}> {p.transliteration}</Text> : null}
                    <Text style={styles.meaning}> · {p.english}</Text>
                  </>
                )}
              </Text>
            ))}
            {more > 0 ? <Text style={styles.more}>+ {more} more</Text> : null}
          </View>
        ) : null}

        {locked ? (
          <>
            <View style={styles.locked}>
              <Peak lit={false} size={22} />
              <Text style={styles.lockedText}>Walia hasn’t climbed this high yet. Finish the stones below to reach this ledge.</Text>
            </View>
            <Pressable onPress={onJump} accessibilityRole="button" hitSlop={6} style={styles.link}>
              <Text style={styles.linkText}>Jump to Walia</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Pressable onPress={onStart} accessibilityRole="button" accessibilityLabel={`${done ? 'Practice again' : 'Start'}, earns ${grass} grass`} style={({ pressed }) => [styles.start, pressed && styles.startDown]}>
              <Text style={styles.startText}>{done ? 'Practice again' : 'Start'}</Text>
              <View style={styles.reward}>
                <Grass size={18} />
                <Text style={styles.rewardText}>+{grass}</Text>
              </View>
            </Pressable>
            {phrases.length > 0 || lesson.dialogue?.length ? (
              <Pressable onPress={onPhrases} accessibilityRole="button" hitSlop={6} style={styles.link}>
                <Text style={styles.linkText}>See all the phrases</Text>
              </Pressable>
            ) : null}
          </>
        )}
      </Animated.View>
    </Modal>
  );
}

const useStyles = makeStyles(c => ({
  backdrop: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 },
  card: {
    position: 'absolute',
    gap: 10,
    padding: 16,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderBottomWidth: 5,
    borderColor: c.line,
    shadowColor: '#000000',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
  },
  arrow: { position: 'absolute', width: 18, height: 18, backgroundColor: '#ffffff', borderColor: c.line, transform: [{ rotate: '45deg' }] },
  arrowDown: { bottom: -12, borderRightWidth: 2, borderBottomWidth: 2 },
  arrowUp: { top: -11, borderLeftWidth: 2, borderTopWidth: 2 },
  head: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  title: { flex: 1, fontFamily: fonts.black, fontSize: 19, lineHeight: 24, color: c.ink },
  done: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 3 },
  doneText: { fontFamily: fonts.heavy, fontSize: 13, color: c.goldShadow },
  description: { fontFamily: fonts.bold, fontSize: 14, lineHeight: 19, color: c.muted, marginTop: -6 },
  phrases: { gap: 6, paddingVertical: 2 },
  phrase: { fontSize: 15 },
  word: { fontFamily: fonts.heavy, fontSize: 16, color: c.ink },
  amharic: { fontFamily: fonts.amharic },
  roman: { fontFamily: fonts.bold, fontSize: 14, color: c.ink },
  meaning: { fontFamily: fonts.bold, fontSize: 14, color: c.muted },
  more: { fontFamily: fonts.heavy, fontSize: 13, color: c.muted },
  start: {
    flexDirection: 'row',
    gap: 10,
    minHeight: 50,
    marginTop: 4,
    borderRadius: 16,
    borderBottomWidth: 5,
    borderBottomColor: c.primaryShadow,
    backgroundColor: c.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startDown: { borderBottomWidth: 0, marginTop: 9 },
  startText: { fontFamily: fonts.black, fontSize: 16, color: '#ffffff', textTransform: 'uppercase', letterSpacing: 0.8 },
  reward: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingVertical: 2, paddingHorizontal: 8, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.9)' },
  rewardText: { fontFamily: fonts.black, fontSize: 14, color: '#3a9a28' },
  link: { alignSelf: 'center', paddingVertical: 2 },
  locked: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginTop: 4, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 14, backgroundColor: c.bgSoft },
  lockedText: { flex: 1, fontFamily: fonts.bold, fontSize: 14, lineHeight: 20, color: c.muted },
  linkText: { fontFamily: fonts.heavy, fontSize: 14, color: c.blue },
}));
