import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import type { Track } from '@/lib/courses';
import type { Stamp } from '@/lib/passport';
import PassportStamp from '@/components/passport-stamp';
import PlaceLesson, { hasPlaceLesson } from '@/components/place-lesson';
import { playEffect } from '@/components/sound';
import Walia from '@/components/walia';
import { fonts } from '@/theme';

// The big "new passport stamp" moment, like the website's (components/StampReveal.tsx):
// the screen goes dark, light rays spin in the stamp's ink, the stamp slams
// down (shake, ink ring, confetti in the flag's colours), and Walia circles
// it. Then the place's quick lesson is offered.

const SLAM_MS = 650; // when the stamp hits the page
const WALIA_IN_MS = 1000; // when Walia flies in
const ORBIT_MS = 5200; // one lap around the stamp
const FLAG = ['#078930', '#fcdd09', '#da121a'];

/** A repeatable "random" number, so the confetti is the same every time. */
function seeded(i: number) {
  const x = Math.sin(i * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

type Piece = { x: number; y: number; fall: number; spin: number; delay: number; color: string; size: number; round: boolean };

function Confetti({ piece, burst }: { piece: Piece; burst: SharedValue<number> }) {
  const style = useAnimatedStyle(() => {
    const p = Math.max(0, Math.min(1, burst.get() - piece.delay));
    return {
      opacity: p === 0 ? 0 : interpolate(p, [0, 0.75, 1], [1, 1, 0]),
      transform: [{ translateX: piece.x * p }, { translateY: piece.y * p + piece.fall * p * p }, { rotate: `${piece.spin * p}deg` }],
    };
  });
  return <Animated.View style={[styles.piece, { width: piece.size, height: piece.round ? piece.size : piece.size * 0.5, borderRadius: piece.round ? piece.size : 1, backgroundColor: piece.color }, style]} />;
}

/** Walia circling the stamp on a tilted orbit, smaller and dimmer when he's round the back. */
function OrbitingWalia({ lap, width }: { lap: SharedValue<number>; width: number }) {
  const style = useAnimatedStyle(() => {
    const t = lap.get();
    if (t <= 0) return { opacity: 0 };
    const rx = Math.min(width * 0.38, 190);
    const ry = rx * 0.42;
    const arrive = Math.min(t * 3, 1); // spirals in during the first lap
    const ease = 1 - Math.pow(1 - arrive, 3);
    const spread = 1 + (1 - ease) * 2.2;
    const angle = Math.PI * 0.15 + t * Math.PI * 2;
    const depth = Math.sin(angle); // +1 in front of the stamp, -1 behind it
    const lift = depth < 0 ? 1.7 : 1;
    const facing = -Math.sin(angle) >= 0 ? 1 : -1;
    const scale = 0.86 + depth * 0.22;
    return {
      opacity: Math.min(t * 8, 1) * (depth < 0 ? 0.75 : 1),
      transform: [
        { translateX: Math.cos(angle) * rx * spread },
        { translateY: depth * ry * lift * spread - (1 - ease) * 120 },
        { rotate: `${Math.cos(angle) * -10}deg` },
        { scaleX: scale * facing },
        { scaleY: scale },
      ],
    };
  });
  return (
    <Animated.View style={[styles.walia, style]} pointerEvents="none">
      <Walia pose="cheer" size={100} />
    </Animated.View>
  );
}

/** Light rays in the stamp's ink, slowly turning behind it. */
function Rays({ ink }: { ink: string }) {
  const turn = useSharedValue(0);
  useEffect(() => {
    turn.set(withRepeat(withTiming(360, { duration: 24000, easing: Easing.linear }), -1));
  }, [turn]);
  const style = useAnimatedStyle(() => ({ transform: [{ rotate: `${turn.get()}deg` }] }));
  return (
    <Animated.View style={[styles.rays, style]} pointerEvents="none">
      <Svg width={900} height={900} viewBox="-450 -450 900 900">
        {Array.from({ length: 12 }, (_, i) => (
          <Path key={i} d="M0 0 L-38 -440 L38 -440 Z" fill={ink} opacity={0.22} transform={`rotate(${i * 30})`} />
        ))}
      </Svg>
    </Animated.View>
  );
}

export default function StampReveal({ stamp, camp, track, onClose }: { stamp: Stamp; camp: number; track: Track; onClose: () => void }) {
  const { width } = useWindowDimensions();
  const [learning, setLearning] = useState(false);
  const lesson = hasPlaceLesson(stamp);
  const slam = useSharedValue(0);
  const shake = useSharedValue(0);
  const ring = useSharedValue(0);
  const burst = useSharedValue(0);
  const lap = useSharedValue(0);

  const confetti = useMemo<Piece[]>(
    () =>
      Array.from({ length: 40 }, (_, i) => {
        const a = seeded(i) * Math.PI * 2;
        const dist = 110 + seeded(i + 100) * 180;
        return {
          x: Math.cos(a) * dist,
          y: Math.sin(a) * dist * 0.75 - 60,
          fall: 140 + seeded(i + 200) * 220,
          spin: (seeded(i + 300) - 0.5) * 1080,
          delay: seeded(i + 400) * 0.12,
          color: i % 4 === 3 ? stamp.ink : FLAG[i % 3],
          size: 6 + seeded(i + 600) * 6,
          round: i % 3 === 0,
        };
      }),
    [stamp.ink],
  );

  useEffect(() => {
    slam.set(withDelay(SLAM_MS - 250, withSpring(1, { damping: 9, stiffness: 180 })));
    shake.set(withDelay(SLAM_MS, withSequence(withTiming(-8, { duration: 50 }), withTiming(8, { duration: 60 }), withTiming(-4, { duration: 60 }), withTiming(0, { duration: 60 }))));
    ring.set(withDelay(SLAM_MS, withTiming(1, { duration: 900, easing: Easing.out(Easing.quad) })));
    burst.set(withDelay(SLAM_MS, withTiming(1.12, { duration: 2400, easing: Easing.out(Easing.quad) })));
    lap.set(withDelay(WALIA_IN_MS, withRepeat(withTiming(1, { duration: ORBIT_MS, easing: Easing.linear }), -1, false)));
    const chime = setTimeout(() => playEffect('complete'), SLAM_MS - 60);
    return () => clearTimeout(chime);
  }, [slam, shake, ring, burst, lap]);

  const stampStyle = useAnimatedStyle(() => ({
    opacity: Math.min(slam.get() * 3, 1),
    transform: [{ translateX: shake.get() }, { scale: interpolate(slam.get(), [0, 1], [2.6, 1]) }],
  }));
  const ringStyle = useAnimatedStyle(() => ({ opacity: interpolate(ring.get(), [0, 0.1, 1], [0, 0.6, 0]), transform: [{ scale: interpolate(ring.get(), [0, 1], [0.6, 1.9]) }] }));

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.backdrop}>
        {learning ? (
          <ScrollView contentContainerStyle={styles.lessonWrap}>
            <View style={styles.lessonCard}>
              <PlaceLesson stamp={stamp} onDone={onClose} />
            </View>
          </ScrollView>
        ) : (
          <View style={styles.content}>
            <View style={styles.stage}>
              <Rays ink={stamp.ink} />
              <Animated.View style={[styles.ring, { borderColor: stamp.ink }, ringStyle]} pointerEvents="none" />
              {confetti.map((piece, i) => (
                <Confetti key={i} piece={piece} burst={burst} />
              ))}
              <Animated.View style={stampStyle}>
                <PassportStamp stamp={stamp} earned size={190} tilt={-6} />
              </Animated.View>
              <OrbitingWalia lap={lap} width={width} />
            </View>

            <View style={styles.text}>
              <Text style={styles.kicker}>Camp {camp} complete · New passport stamp</Text>
              <Text style={styles.title}>
                You collected <Text style={styles.place}>{stamp.name}</Text>!
              </Text>
              <Text style={styles.am}>{stamp.amharic}</Text>
              <Text style={styles.fact}>{stamp.fact}</Text>
            </View>

            <View style={styles.actions}>
              {lesson ? (
                <Pressable onPress={() => setLearning(true)} style={[styles.primary, { backgroundColor: stamp.ink }]}>
                  <Text style={styles.primaryText}>Quick lesson about {stamp.name}</Text>
                </Pressable>
              ) : null}
              <Pressable onPress={onClose} style={lesson ? styles.ghost : [styles.primary, { backgroundColor: stamp.ink }]}>
                <Text style={lesson ? styles.ghostText : styles.primaryText}>Keep climbing</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  onClose();
                  router.push({ pathname: '/explore/passport', params: { track } });
                }}
                hitSlop={6}
              >
                <Text style={styles.link}>See my passport</Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(22,16,12,0.94)' },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 40, gap: 18 },
  stage: { height: 300, alignItems: 'center', justifyContent: 'center' },
  rays: { position: 'absolute', width: 900, height: 900 },
  ring: { position: 'absolute', width: 190, height: 190, borderRadius: 95, borderWidth: 6 },
  piece: { position: 'absolute' },
  walia: { position: 'absolute' },
  text: { alignItems: 'center', gap: 4 },
  kicker: { fontFamily: fonts.heavy, fontSize: 12, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 0.8, textAlign: 'center' },
  title: { fontFamily: fonts.black, fontSize: 28, lineHeight: 34, color: '#ffffff', textAlign: 'center' },
  place: { color: '#ffc233' },
  am: { fontFamily: fonts.amharicBold, fontSize: 22, lineHeight: 32, color: 'rgba(255,255,255,0.9)' },
  fact: { fontFamily: fonts.bold, fontSize: 15, lineHeight: 22, color: 'rgba(255,255,255,0.8)', textAlign: 'center', maxWidth: 420 },
  actions: { gap: 10, alignItems: 'stretch', maxWidth: 420, width: '100%', alignSelf: 'center' },
  primary: { minHeight: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
  primaryText: { fontFamily: fonts.black, fontSize: 16, color: '#ffffff', textTransform: 'uppercase', letterSpacing: 0.6, textAlign: 'center' },
  ghost: { minHeight: 52, borderRadius: 16, borderWidth: 2, borderColor: 'rgba(255,255,255,0.35)', alignItems: 'center', justifyContent: 'center' },
  ghostText: { fontFamily: fonts.black, fontSize: 16, color: '#ffffff', textTransform: 'uppercase', letterSpacing: 0.6 },
  link: { fontFamily: fonts.heavy, fontSize: 15, color: 'rgba(255,255,255,0.85)', textAlign: 'center', paddingVertical: 6 },
  lessonWrap: { flexGrow: 1, justifyContent: 'center', padding: 16 },
  lessonCard: { padding: 18, borderRadius: 24, backgroundColor: '#ffffff' },
});
