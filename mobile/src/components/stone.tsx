import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { colors } from '@/theme';

// A trail stone, like the website's (components/Trail.tsx): round and chunky
// with a thick bottom edge that presses down when tapped.

export type StoneState = 'done' | 'current' | 'todo' | 'locked';
export type StoneKind = 'lesson' | 'reward' | 'trophy';

const SIZE = 72;
const EDGE = 9;

const LOOK: Record<StoneState, { face: string; edge: string; fg: string }> = {
  done: { face: colors.gold, edge: colors.goldShadow, fg: '#ffffff' },
  current: { face: colors.primary, edge: colors.primaryShadow, fg: '#ffffff' },
  todo: { face: colors.stone, edge: colors.stoneEdge, fg: colors.stoneText },
  locked: { face: colors.stone, edge: colors.stoneEdge, fg: '#b3a998' },
};

function Star({ color }: { color: string }) {
  return (
    <Svg width={30} height={30} viewBox="0 0 24 24">
      <Path d="M12 2.6l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z" fill={color} />
    </Svg>
  );
}

function Check({ color }: { color: string }) {
  return (
    <Svg width={28} height={28} viewBox="0 0 24 24">
      <Path d="M5 12.5l4.5 4.5L19 7.5" stroke={color} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  );
}

function Trophy({ won }: { won: boolean }) {
  const cup = won ? colors.gold : '#b3a998';
  return (
    <Svg width={34} height={34} viewBox="0 0 32 32">
      <Path d="M9 4h14v7a7 7 0 0 1-14 0z" fill={cup} />
      <Path d="M9 7H4.5a4.5 4.5 0 0 0 4.8 5.6M23 7h4.5a4.5 4.5 0 0 1-4.8 5.6" fill="none" stroke={cup} strokeWidth={2.6} strokeLinecap="round" />
      <Rect x={14} y={17} width={4} height={6} fill={cup} />
      <Rect x={9.5} y={23} width={13} height={5} rx={2} fill={cup} />
    </Svg>
  );
}

/** A woven mesob basket, full of grass once you reach it. */
export function Mesob({ open }: { open: boolean }) {
  return (
    <Svg width={58} height={58} viewBox="0 0 64 64">
      {open && (
        <>
          <Path d="M18 30 C 19 20, 22 15, 21 8 C 25 15, 26 22, 26 30 Z" fill="#5fb84a" />
          <Path d="M26 30 C 28 19, 30 12, 32 5 C 34 12, 36 19, 38 30 Z" fill="#4fa83c" />
          <Path d="M38 30 C 38 22, 40 15, 45 9 C 43 17, 44 23, 46 30 Z" fill="#6cc455" />
        </>
      )}
      <Path d="M10 30 H54 L48 52 Q32 58 16 52 Z" fill={open ? '#e0a000' : '#d4d4d4'} />
      <Path d="M12 36 H52 M14 43 H50" stroke={open ? '#ffc233' : '#e5e5e5'} strokeWidth={4} strokeLinecap="round" />
      <Path d="M20 31 L23 52 M32 31 V56 M44 31 L41 52" stroke={open ? '#b07c00' : '#bdbdbd'} strokeWidth={2.5} strokeLinecap="round" />
      <Rect x={7} y={25} width={50} height={8} rx={4} fill={open ? '#ffc233' : '#e5e5e5'} />
    </Svg>
  );
}

type Props = { state: StoneState; kind?: StoneKind; label: string; onPress?: () => void };

export default function Stone({ state, kind = 'lesson', label, onPress }: Props) {
  const [down, setDown] = useState(false);
  const look = LOOK[state];
  const pressable = !!onPress && state !== 'locked';

  if (kind === 'reward') {
    return (
      <View style={styles.reward} accessibilityLabel={label}>
        <Mesob open={state === 'done'} />
      </View>
    );
  }

  return (
    <View style={state === 'current' && styles.ring}>
      <Pressable
        onPress={pressable ? onPress : undefined}
        onPressIn={() => pressable && setDown(true)}
        onPressOut={() => setDown(false)}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled: !pressable }}
        style={styles.stone}
      >
        <View style={[styles.edge, { backgroundColor: look.edge }]} />
        <View style={[styles.face, { backgroundColor: look.face, top: down ? EDGE : 0 }]}>
          <View style={styles.shine} />
          {kind === 'trophy' ? <Trophy won={state === 'done'} /> : state === 'done' ? <Check color={look.fg} /> : <Star color={look.fg} />}
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  ring: { padding: 6, borderRadius: SIZE, borderWidth: 6, borderColor: colors.primarySoft, margin: -12 },
  stone: { width: SIZE, height: SIZE + EDGE },
  edge: { position: 'absolute', top: EDGE, width: SIZE, height: SIZE, borderRadius: SIZE / 2 },
  face: { position: 'absolute', width: SIZE, height: SIZE, borderRadius: SIZE / 2, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  shine: { position: 'absolute', top: 6, left: 10, width: 26, height: 14, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.25)', transform: [{ rotate: '-30deg' }] },
  reward: { width: SIZE, height: SIZE + EDGE, alignItems: 'center', justifyContent: 'center' },
});
