import { Image } from 'expo-image';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, type ReactNode } from 'react';
import { Text, View, type ViewStyle } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Ellipse, Path, Rect } from 'react-native-svg';
import Button from '@/components/button';
import { Grass } from '@/components/icons';
import { readProfile } from '@/lib/profile';
import { useAuth } from '@/auth';
import { accountsEnabled } from '@/supabase';
import { fonts, makeStyles, useColors } from '@/theme';

// The first screen a new learner sees, like the website's home page hero
// (app/page.tsx): Walia with ሰላም!, Hello! and a few fidel letters floating
// round him, the pitch, and two ways in. "Get started" goes to the survey;
// "Log in" brings back an account's answers and progress, so it skips it.

/** Bobs gently up and down, each one on its own beat (the website's floaty). */
function Floaty({ children, style, delay = 0 }: { children: ReactNode; style: ViewStyle; delay?: number }) {
  const styles = useStyles();
  const y = useSharedValue(0);
  useEffect(() => {
    y.set(withDelay(delay, withRepeat(withSequence(withTiming(-8, { duration: 2100, easing: Easing.inOut(Easing.sin) }), withTiming(0, { duration: 2100, easing: Easing.inOut(Easing.sin) })), -1)));
  }, [y, delay]);
  const animated = useAnimatedStyle(() => ({ transform: [{ translateY: y.get() }] }));
  return <Animated.View style={[styles.floaty, style, animated]}>{children}</Animated.View>;
}

function Bubble({ text, sub, color, size = 20 }: { text: string; sub?: string; color: string; size?: number }) {
  const styles = useStyles();
  return (
    <View style={styles.bubble}>
      <Text style={[styles.bubbleText, { color, fontSize: size }]}>{text}</Text>
      {sub ? <Text style={styles.bubbleSub}>{sub}</Text> : null}
    </View>
  );
}

function Letter({ char, bg, color = '#ffffff' }: { char: string; bg: string; color?: string }) {
  const styles = useStyles();
  return (
    <View style={[styles.letter, { backgroundColor: bg }]}>
      <Text style={[styles.letterText, { color }]}>{char}</Text>
    </View>
  );
}

function Buna() {
  const colors = useColors();
  return (
    <Svg viewBox="0 0 48 48" width={50} height={50}>
      <Path d="M17 6c-2 3 2 5 0 8M24 4c-2 3 2 5 0 8M31 6c-2 3 2 5 0 8" stroke="#c9a27a" strokeWidth={2.6} strokeLinecap="round" fill="none" />
      <Path d="M9 19h30v6a15 15 0 0 1-30 0z" fill={colors.primary} />
      <Path d="M39 22h3a5 5 0 0 1 0 10h-4" stroke={colors.primary} strokeWidth={3.4} fill="none" />
      <Rect x={10} y={19} width={28} height={4} rx={2} fill="#6b3216" />
      <Ellipse cx={24} cy={44} rx={17} ry={3} fill="#e5d3c2" />
    </Svg>
  );
}

export default function Start() {
  const styles = useStyles();
  const colors = useColors();
  // Back here while signed in (say, after closing the sign-in sheet): go on
  // in, to the trail or, with no survey answers yet, the survey.
  const { user } = useAuth();
  useFocusEffect(
    useCallback(() => {
      if (user) router.replace(readProfile() ? '/' : '/welcome');
    }, [user]),
  );
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.art}>
        <View style={styles.blob} />
        <Floaty style={{ top: '4%', left: '4%' }}>
          <Bubble text="ሰላም!" sub="selam" color={colors.primary} />
        </Floaty>
        <Floaty style={{ top: '2%', right: '6%' }} delay={700}>
          <Bubble text="Hello!" color={colors.blue} />
        </Floaty>
        <Floaty style={{ top: '40%', left: '0%' }} delay={1300}>
          <Bubble text="እንዴት ነህ?" sub="how are you?" color={colors.ink} size={16} />
        </Floaty>
        <Floaty style={{ top: '26%', right: '2%' }} delay={400}>
          <Letter char="ሀ" bg={colors.gold} color="#7a5200" />
        </Floaty>
        <Floaty style={{ bottom: '30%', right: '0%' }} delay={1550}>
          <Letter char="ለ" bg={colors.blue} />
        </Floaty>
        <Floaty style={{ bottom: '16%', left: '4%' }} delay={1000}>
          <Letter char="መ" bg={colors.green} />
        </Floaty>
        <Floaty style={{ bottom: '2%', left: '20%' }} delay={550}>
          <Buna />
        </Floaty>
        <Floaty style={{ bottom: '4%', right: '14%' }} delay={1100}>
          <Grass size={46} />
        </Floaty>
        <Floaty style={{ top: '18%', left: '32%' }} delay={1700}>
          <Text style={styles.star}>★</Text>
        </Floaty>
        <Image source={require('@/assets/images/splash-icon.png')} style={styles.walia} contentFit="contain" accessibilityLabel="Walia the ibex" />
      </View>

      <View style={styles.copy}>
        <Text style={styles.wordmark}>kwanqa</Text>
        <Text style={styles.title}>The fun, free way to learn Amharic and English!</Text>
        <View style={styles.actions}>
          <Button label="Get started" onPress={() => router.push('/welcome')} />
          {accountsEnabled ? <Button label="Log in" tone="plain" onPress={() => router.push({ pathname: '/account', params: { mode: 'login' } })} /> : null}
        </View>
      </View>
    </SafeAreaView>
  );
}

const useStyles = makeStyles(c => ({
  safe: { flex: 1, backgroundColor: c.bg },
  art: { flex: 1, marginHorizontal: 20, marginTop: 8 },
  blob: { position: 'absolute', top: '12%', left: '8%', right: '8%', bottom: '6%', borderTopLeftRadius: 180, borderTopRightRadius: 200, borderBottomLeftRadius: 170, borderBottomRightRadius: 190, backgroundColor: c.primarySoft },
  walia: { position: 'absolute', left: '19%', right: '15%', bottom: '4%', top: '22%' },
  floaty: { position: 'absolute', zIndex: 2 },
  bubble: { paddingVertical: 7, paddingHorizontal: 14, borderRadius: 18, borderWidth: 2, borderBottomWidth: 4, borderColor: c.line, backgroundColor: '#ffffff', alignItems: 'center' },
  bubbleText: { fontFamily: fonts.amharicBold, lineHeight: 28 },
  bubbleSub: { fontFamily: fonts.bold, fontSize: 12, color: '#afafaf' },
  letter: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 4, borderBottomColor: 'rgba(0,0,0,0.15)' },
  letterText: { fontFamily: fonts.amharicBold, fontSize: 24, lineHeight: 34 },
  star: { fontSize: 26, color: c.gold },
  copy: { paddingHorizontal: 24, paddingBottom: 16, gap: 10 },
  wordmark: { fontFamily: fonts.black, fontSize: 22, color: c.primary, textAlign: 'center', letterSpacing: 0.5 },
  title: { fontFamily: fonts.black, fontSize: 26, lineHeight: 32, color: c.ink, textAlign: 'center' },
  actions: { gap: 10, marginTop: 8 },
}));
