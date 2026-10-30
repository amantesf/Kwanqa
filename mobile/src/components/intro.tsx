import { Image } from 'expo-image';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withSequence, withSpring, withTiming } from 'react-native-reanimated';

// When the app opens: the splash screen's Walia (same picture, size and white
// background, so the hand-off can't be seen) gives one little hop, then the
// app fades in underneath. About a second. A stand-in until the Rive Walia.

const WIDTH = 150; // app.json's splash imageWidth
const HEIGHT = (WIDTH * 581) / 435; // splash-icon.png keeps its shape

export default function Intro() {
  const [done, setDone] = useState(false);
  const hop = useSharedValue(0); // how high he is, in points
  const squash = useSharedValue(1);
  const fade = useSharedValue(1);
  const started = useRef(false);

  function start() {
    if (started.current) return;
    started.current = true;
    // the native splash comes down only once this exact copy of it is showing
    SplashScreen.hideAsync();
    // crouch, spring up, land with a little squash
    squash.set(withSequence(withTiming(0.9, { duration: 140 }), withTiming(1.05, { duration: 160 }), withDelay(220, withTiming(0.94, { duration: 90 })), withSpring(1, { damping: 8 })));
    hop.set(withDelay(140, withSequence(withTiming(-46, { duration: 230, easing: Easing.out(Easing.quad) }), withTiming(0, { duration: 210, easing: Easing.in(Easing.quad) }))));
    fade.set(withDelay(820, withTiming(0, { duration: 260 })));
    setTimeout(() => setDone(true), 1100);
  }

  // if the picture never reports in, hop anyway rather than leave the splash stuck
  useEffect(() => {
    const timer = setTimeout(start, 1000);
    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const screen = useAnimatedStyle(() => ({ opacity: fade.get() }));
  const walia = useAnimatedStyle(() => ({
    transform: [{ translateY: hop.get() + (1 - squash.get()) * HEIGHT * 0.5 }, { scaleY: squash.get() }, { scaleX: 2 - squash.get() }],
  }));

  if (done) return null;
  return (
    <Animated.View style={[styles.screen, screen]} pointerEvents="none">
      <Animated.View style={walia}>
        <Image source={require('@/assets/images/splash-icon.png')} style={styles.walia} contentFit="contain" onDisplay={start} />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  screen: { ...StyleSheet.absoluteFill, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center', zIndex: 10 },
  walia: { width: WIDTH, height: HEIGHT },
});
