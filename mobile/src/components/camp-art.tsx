import { useEffect, useId } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { Easing, interpolate, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import Svg, { Circle, ClipPath, Defs, Ellipse, G, Line, LinearGradient, Path, Pattern, RadialGradient, Rect, Stop, Text } from 'react-native-svg';
import { fonts } from '@/theme';

// The picture on each camp's banner, drawn as on the website (CoursesRoadmap's
// CAMP_ART: GeezNumbers, SiniCup, AddisTaxi, Friends, Elder, MesobBasket).
// Each one comes in when the banner switches to its camp.

export type CampArtKind = 'numbers' | 'cup' | 'taxi' | 'friends' | 'elder' | 'basket';

// Banner art for each camp, matched to what the camp is about (the website's CAMP_ART).
const CAMP_ART: Record<string, CampArtKind> = {
  'amharic-beginner-2': 'numbers', // Ge'ez numerals
  'amharic-beginner-3': 'cup', // a sini of buna
  'amharic-beginner-4': 'taxi', // a blue-and-white Addis taxi
  'amharic-beginner-5': 'friends', // two friends catching up
  'amharic-beginner-6': 'elder', // Ababa in his gabi
  'amharic-beginner-7': 'numbers', // dates written in Ge'ez numerals
  'amharic-beginner-8': 'elder', // visiting the family elders
  'english-from-amharic-1': 'friends', // getting to know people
  'english-from-amharic-3': 'cup', // restaurants and food
  'english-from-amharic-4': 'taxi', // travel and getting around
};

export const campArtFor = (slug: string): CampArtKind => CAMP_ART[slug] ?? 'basket';

const uid = (id: string) => id.replace(/[:«»]/g, '');

// --- Ge'ez numerals on parchment -------------------------------------------------

const NUMBERS = [
  ['፩', '1'],
  ['፪', '2'],
  ['፫', '3'],
  ['፬', '4'],
  ['፭', '5'],
  ['፲', '10'],
];

function GeezNumbers({ size }: { size: number }) {
  const id = uid(useId());
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <RadialGradient id={`${id}-paper`} cx="0.5" cy="0.45" r="0.75">
          <Stop offset="0" stopColor="#fdf3d8" />
          <Stop offset="0.7" stopColor="#f3dfae" />
          <Stop offset="1" stopColor="#dcbd7c" />
        </RadialGradient>
      </Defs>
      <G transform="rotate(-6 50 50)">
        <Rect x={11} y={9} width={80} height={84} rx={3} fill="rgba(0,0,0,0.22)" transform="translate(2.4 3)" />
        <Rect x={11} y={9} width={80} height={84} rx={3} fill={`url(#${id}-paper)`} />
        <Rect x={14} y={12} width={74} height={78} rx={2} fill="none" stroke="#b08a48" strokeWidth={0.6} />
        <Text x={51} y={25} textAnchor="middle" fontSize={11} fontFamily={fonts.amharicBold} fill="#3a2414">
          ቁጥሮች
        </Text>
        <Line x1={22} y1={29} x2={80} y2={29} stroke="#3a2414" strokeWidth={0.6} />
        {NUMBERS.map(([geez, n], i) => {
          const x = 27 + (i % 3) * 24;
          const y = 50 + Math.floor(i / 3) * 27;
          return (
            <G key={geez}>
              <Text x={x} y={y} textAnchor="middle" fontSize={17} fontFamily={fonts.amharicBold} fill="#241a14">
                {geez}
              </Text>
              <Text x={x} y={y + 9} textAnchor="middle" fontSize={6.5} fontFamily={fonts.heavy} fill="#7a5a2c">
                {n}
              </Text>
            </G>
          );
        })}
      </G>
    </Svg>
  );
}

// --- A sini of buna ---------------------------------------------------------------

const PANELS = ['#f2b705', '#c62f22', '#2457c5', '#1f8a4c', '#f2b705', '#7b3fa0', '#c62f22', '#3fb0e8', '#1f8a4c'];

function SiniCup({ size }: { size: number }) {
  const id = uid(useId());
  const body = 'M-30 -14 C -29.5 2, -25 18, -14 25 L 14 25 C 25 18, 29.5 2, 30 -14 Z';
  const panelW = 60 / PANELS.length;
  return (
    <Svg width={size} height={size} viewBox="-50 -50 100 100">
      <Defs>
        <ClipPath id={`${id}-body`}>
          <Path d={body} />
        </ClipPath>
        <LinearGradient id={`${id}-glaze`} x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#e4e6ea" />
          <Stop offset="0.35" stopColor="#ffffff" />
          <Stop offset="0.75" stopColor="#f3f4f6" />
          <Stop offset="1" stopColor="#c9ccd3" />
        </LinearGradient>
        <RadialGradient id={`${id}-buna`} cx="0.45" cy="0.4" r="0.6">
          <Stop offset="0" stopColor="#5a3018" />
          <Stop offset="0.8" stopColor="#2a140a" />
        </RadialGradient>
        <LinearGradient id={`${id}-shade`} x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#000" stopOpacity={0.18} />
          <Stop offset="0.3" stopColor="#000" stopOpacity={0} />
          <Stop offset="0.8" stopColor="#000" stopOpacity={0} />
          <Stop offset="1" stopColor="#000" stopOpacity={0.28} />
        </LinearGradient>
      </Defs>
      <Ellipse cx={2} cy={30.5} rx={22} ry={3.4} fill="rgba(0,0,0,0.22)" />
      {/* steam */}
      <G fill="none" stroke="#fff" strokeWidth={2.4} strokeLinecap="round" opacity={0.85}>
        <Path d="M-10 -22 c -4 -6, 4 -10, 0 -16 s 4 -10, 0 -14" />
        <Path d="M2 -22 c -4 -6, 4 -10, 0 -16 s 4 -10, 0 -14" />
        <Path d="M14 -22 c -4 -6, 4 -10, 0 -16 s 4 -10, 0 -14" />
      </G>
      <Path d="M-13 24 L 13 24 L 11.5 28.5 C 6 29.6, -6 29.6, -11.5 28.5 Z" fill="#dfe1e6" />
      <Path d={body} fill={`url(#${id}-glaze)`} />
      <G clipPath={`url(#${id}-body)`}>
        <Rect x={-30} y={-13} width={60} height={17} fill="#1d1d1b" />
        {PANELS.map((c, i) => {
          const x = -30 + i * panelW;
          const cx = x + panelW / 2;
          return (
            <G key={i}>
              <Rect x={x + 0.4} y={-12.4} width={panelW - 0.8} height={15.8} fill={c} />
              <Circle cx={cx} cy={-8} r={2.6} fill="#f2b705" opacity={c === '#f2b705' ? 0 : 0.9} />
              <Circle cx={cx} cy={-7.6} r={1.5} fill="#7a4a2a" />
              <Path d={`M${cx - 2.4} 3.4 L${cx - 1.6} -5.6 L${cx + 1.6} -5.6 L${cx + 2.4} 3.4 Z`} fill={PANELS[(i + 3) % PANELS.length]} />
            </G>
          );
        })}
        <Rect x={-30} y={-13.6} width={60} height={1.2} fill="#d4a017" />
        <Rect x={-30} y={4} width={60} height={1.2} fill="#d4a017" />
        <Rect x={-30} y={-16} width={60} height={44} fill={`url(#${id}-shade)`} />
        <Path d="M-24 6 C -22 14, -18 19, -12 22" fill="none" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" opacity={0.85} />
      </G>
      <Ellipse cx={0} cy={-14} rx={30} ry={5.8} fill="#f7f8fa" />
      <Ellipse cx={0} cy={-14} rx={27.6} ry={4.7} fill={`url(#${id}-buna)`} />
      <Ellipse cx={-5} cy={-15.3} rx={10} ry={1.4} fill="#b07a4a" opacity={0.45} />
      <Ellipse cx={0} cy={-14} rx={30} ry={5.8} fill="none" stroke="#d9dbe0" strokeWidth={0.6} />
    </Svg>
  );
}

// --- The Addis taxi ---------------------------------------------------------------

function Wheel({ x }: { x: number }) {
  return (
    <G transform={`translate(${x} 47)`}>
      <Circle r={8.6} fill="#1b1b1b" />
      <Circle r={5.4} fill="#c9ced6" />
      <Circle r={5.4} fill="none" stroke="#9aa1ab" strokeWidth={0.8} />
      {[0, 72, 144, 216, 288].map(a => (
        <Circle key={a} cx={Math.cos((a * Math.PI) / 180) * 3.2} cy={Math.sin((a * Math.PI) / 180) * 3.2} r={0.9} fill="#6b727c" />
      ))}
      <Circle r={1.5} fill="#8a919b" />
    </G>
  );
}

function AddisTaxi({ size }: { size: number }) {
  const id = uid(useId());
  return (
    <Svg width={size} height={(size * 64) / 124} viewBox="0 0 124 64">
      <Defs>
        <LinearGradient id={`${id}-paint`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#3a8cf0" />
          <Stop offset="0.55" stopColor="#1f6fd6" />
          <Stop offset="1" stopColor="#1757ad" />
        </LinearGradient>
        <LinearGradient id={`${id}-glass`} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#5d7186" />
          <Stop offset="1" stopColor="#2b3a4a" />
        </LinearGradient>
      </Defs>
      <Ellipse cx={62} cy={56} rx={54} ry={3.4} fill="rgba(0,0,0,0.25)" />
      <Path d="M31 30 L41 15.5 Q42 14.5 44 14.5 L77 14.5 Q79 14.5 80.5 15.5 L93 30 Z" fill="#f4f5f7" />
      <Path d="M36.5 29 L44.5 17.5 L58 17.5 L58 29 Z" fill={`url(#${id}-glass)`} />
      <Path d="M61 29 L61 17.5 L77 17.5 L87.5 29 Z" fill={`url(#${id}-glass)`} />
      <Path d="M48 18.5 L42.5 27.5" stroke="#fff" strokeWidth={1.4} opacity={0.3} strokeLinecap="round" />
      <Path d="M69 18.5 L63.5 27.5" stroke="#fff" strokeWidth={1.4} opacity={0.3} strokeLinecap="round" />
      <Path d="M9 33 Q9 30 12 30 L31 29.5 L93 29.5 L112 32 Q116 32.6 116.4 36 L117 44 Q117 47 114 47 L10 47 Q7.4 47 7.4 44.4 Z" fill={`url(#${id}-paint)`} />
      <Path d="M19 47 A 11 11 0 0 1 41 47 Z" fill="#14315c" />
      <Path d="M81 47 A 11 11 0 0 1 103 47 Z" fill="#14315c" />
      <Path d="M59.5 30 L59.5 46.5 M33 30.5 L33 46.5 M86 30.5 L86.5 46.5" stroke="#14478e" strokeWidth={0.7} />
      <Rect x={10} y={38} width={105} height={1.6} rx={0.8} fill="#1d1d1b" />
      <Rect x={47} y={33.4} width={5} height={1.3} rx={0.6} fill="#d6dae0" />
      <Rect x={73} y={33.4} width={5} height={1.3} rx={0.6} fill="#d6dae0" />
      <Path d="M88 27 L92 26 L92.6 29 L88.6 29.6 Z" fill="#1d1d1b" />
      <Rect x={113.2} y={34.2} width={3.4} height={3.4} rx={0.8} fill="#fff6c9" />
      <Rect x={112.6} y={38.6} width={2.4} height={1.6} rx={0.5} fill="#f2a516" />
      <Rect x={7.6} y={34} width={2.6} height={3.6} rx={0.6} fill="#d9302a" />
      <Rect x={111} y={42.4} width={8} height={3.2} rx={1.4} fill="#1d1d1b" />
      <Rect x={5} y={42.4} width={8.4} height={3.2} rx={1.4} fill="#1d1d1b" />
      <Path d="M14 32 L108 33" stroke="#fff" strokeWidth={0.9} opacity={0.4} strokeLinecap="round" />
      <Wheel x={30} />
      <Wheel x={92} />
    </Svg>
  );
}

// --- Two friends catching up ------------------------------------------------------

function Friends({ size, greeting = 'ሰላም!' }: { size: number; greeting?: string }) {
  const id = uid(useId());
  return (
    <Svg width={size} height={(size * 112) / 140} viewBox="0 0 140 112">
      <Defs>
        <LinearGradient id={`${id}-shirt`} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#8fb89a" />
          <Stop offset="1" stopColor="#5e8a6b" />
        </LinearGradient>
        <LinearGradient id={`${id}-netela`} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#ffffff" />
          <Stop offset="1" stopColor="#e6e0d4" />
        </LinearGradient>
        <Pattern id={`${id}-tilet`} width={6} height={6} patternUnits="userSpaceOnUse">
          <Rect width={6} height={6} fill="#c62f22" />
          <Path d="M0 3 L3 0.6 L6 3 L3 5.4 Z" fill="#1f8a4c" />
          <Circle cx={3} cy={3} r={0.9} fill="#f2b705" />
        </Pattern>
      </Defs>
      {/* him */}
      <Rect x={36} y={52} width={12} height={11} rx={4} fill="#6a3b20" />
      <Ellipse cx={27.5} cy={40} rx={3} ry={4.2} fill="#7a4628" />
      <Ellipse cx={56.5} cy={40} rx={3} ry={4.2} fill="#7a4628" />
      <Ellipse cx={42} cy={39} rx={15} ry={17.5} fill="#83502e" />
      <Path d="M27 36 Q26 20 42 20 Q58 20 57 36 Q55 28 42 27.5 Q29 28 27 36 Z" fill="#1d1410" />
      <Path d="M33 32.5 Q36 31 39 32.5 M45 32.5 Q48 31 51 32.5" fill="none" stroke="#1d1410" strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M33.5 37.5 Q36 35.4 38.5 37.5 M45.5 37.5 Q48 35.4 50.5 37.5" fill="none" stroke="#1d1410" strokeWidth={1.6} strokeLinecap="round" />
      <Path d="M41 38 Q40 43 42 43.6 Q43.6 43.8 44.4 43" fill="none" stroke="#5e3319" strokeWidth={1} strokeLinecap="round" />
      <Path d="M35.5 46.5 Q42 54 48.5 46.5 Z" fill="#3a140c" />
      <Path d="M36.6 47 Q42 49.2 47.4 47 L47 48.2 Q42 50 37 48.2 Z" fill="#fff" />
      <Circle cx={34} cy={44} r={2.4} fill="#a3603a" opacity={0.45} />
      <Circle cx={50} cy={44} r={2.4} fill="#a3603a" opacity={0.45} />
      <Path d="M8 112 Q8 74 26 66 Q32 63 36 62 L42 70 L48 62 Q52 63 58 66 Q74 74 74 112 Z" fill={`url(#${id}-shirt)`} />
      <Path d="M36 62 L42 70 L48 62 L49.5 67 L42 75 L34.5 67 Z" fill="#7a4628" />
      <Path d="M35 61 L42 70 L37.5 73 L32 64 Z M49 61 L42 70 L46.5 73 L52 64 Z" fill="#a6cbb0" />
      <Path d="M42 75 L42 112" stroke="#4f7a5b" strokeWidth={0.8} />
      <Circle cx={44} cy={84} r={1} fill="#e9f2eb" />
      <Circle cx={44} cy={96} r={1} fill="#e9f2eb" />
      {/* his hand, open, as he talks */}
      <Path d="M58 106 Q62 94 67 88" fill="none" stroke="#5e8a6b" strokeWidth={9} strokeLinecap="round" />
      <Ellipse cx={64.6} cy={82} rx={1.9} ry={3.6} fill="#7a4628" transform="rotate(-35 64.6 82)" />
      <Ellipse cx={69.5} cy={79} rx={5} ry={6.8} fill="#83502e" transform="rotate(20 69.5 79)" />
      {/* her */}
      <Path d="M84 62 Q80 40 86 30 Q92 20 104 20 Q116 20 121 32 Q125 44 121 64 Q134 72 138 112 L70 112 Q72 76 84 62 Z" fill={`url(#${id}-netela)`} />
      <Rect x={97} y={55} width={11} height={10} rx={4} fill="#5e341c" />
      <Ellipse cx={102.5} cy={42} rx={13} ry={15.5} fill="#6e3f24" />
      <Path d="M89.6 38 Q90 27 102.5 26.5 Q115 27 115.4 38 Q112 31.5 102.5 31 Q93 31.5 89.6 38 Z" fill="#1d1410" />
      <Path d="M94.5 35.4 Q97 34 99.5 35.4 M105.5 35.4 Q108 34 110.5 35.4" fill="none" stroke="#1d1410" strokeWidth={1.3} strokeLinecap="round" />
      <Path d="M95 40 Q97.2 38 99.4 40 M105.6 40 Q107.8 38 110 40" fill="none" stroke="#1d1410" strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M101.6 40.5 Q100.8 44.5 102.6 45 Q104 45.2 104.6 44.5" fill="none" stroke="#4a2612" strokeWidth={0.9} strokeLinecap="round" />
      <Path d="M97 48 Q102.5 54.5 108 48 Z" fill="#3a140c" />
      <Path d="M98 48.4 Q102.5 50.4 107 48.4 L106.6 49.5 Q102.5 51 98.4 49.5 Z" fill="#fff" />
      <Circle cx={95.5} cy={45.5} r={2.3} fill="#a3603a" opacity={0.5} />
      <Circle cx={109.5} cy={45.5} r={2.3} fill="#a3603a" opacity={0.5} />
      <Circle cx={89.8} cy={47} r={1.3} fill="#f2b705" />
      <Path d="M86 30 Q92 20 104 20 Q116 20 121 32 Q116 25 104 24.5 Q92 25 87.5 34 Q86 46 88.6 58 L84 62 Q80 42 86 30 Z" fill="#f6f2ea" />
      <Path d="M84 70 Q96 64 102.5 66 Q109 64 121 70 L126 112 L80 112 Z" fill="#fbf8f1" />
      <Path d="M80 112 Q86 84 120 66 L126 70 Q96 88 92 112 Z" fill={`url(#${id}-netela)`} />
      <Path d="M84.5 112 Q90 90 121.5 68.2 L124.4 70 Q94 90 89 112 Z" fill={`url(#${id}-tilet)`} />
      {/* what they're saying */}
      <Path d="M44 4 H70 Q74 4 74 8 V15 Q74 19 70 19 H58 L52 24 L53 19 H48 Q44 19 44 15 V8 Q44 4 48 4 Z" fill="#fff" />
      <Text x={59} y={15} textAnchor="middle" fontSize={8} fontFamily={fonts.amharicBold} fill="#241a14">
        {greeting}
      </Text>
      <Path d="M80 8 H96 Q100 8 100 12 V18 Q100 22 96 22 H94 L95 27 L88 22 H84 Q80 22 80 18 V12 Q80 8 84 8 Z" fill="#fff" />
      <Path d="M90 19.5 C 84 15.5, 85 11, 88 11 C 89.2 11, 90 12, 90 13 C 90 12, 90.8 11, 92 11 C 95 11, 96 15.5, 90 19.5 Z" fill="#e0457b" />
    </Svg>
  );
}

// --- Ababa, the elder ------------------------------------------------------------

const CURLS = [
  [37, 25], [41, 21.5], [45.5, 19.5], [50, 18.8], [54.5, 19.5], [59, 21.5], [63, 25],
  [39, 24.6], [43.4, 22.4], [48, 21.4], [52, 21.4], [56.6, 22.4], [61, 24.6], [35, 28.6], [65, 28.6],
];

function Elder({ size }: { size: number }) {
  const id = uid(useId());
  return (
    <Svg width={size} height={(size * 110) / 100} viewBox="0 0 100 110">
      <Defs>
        <LinearGradient id={`${id}-gabi`} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#fbf8f1" />
          <Stop offset="1" stopColor="#e4dccd" />
        </LinearGradient>
        <LinearGradient id={`${id}-stick`} x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#c98a45" />
          <Stop offset="1" stopColor="#8a5526" />
        </LinearGradient>
        <Pattern id={`${id}-check`} width={4} height={4} patternUnits="userSpaceOnUse">
          <Rect width={4} height={4} fill="#1f7fa8" />
          <Rect width={2} height={2} fill="#155f80" />
          <Rect x={2} y={2} width={2} height={2} fill="#3aa6d0" />
        </Pattern>
        <Pattern id={`${id}-tilet`} width={6} height={6} patternUnits="userSpaceOnUse">
          <Rect width={6} height={6} fill="#2f6b2a" />
          <Path d="M0 3 L3 0.6 L6 3 L3 5.4 Z" fill="#d9b23a" />
          <Circle cx={3} cy={3} r={0.8} fill="#2f6b2a" />
        </Pattern>
      </Defs>
      <Rect x={44} y={52} width={12} height={10} rx={4} fill="#6e3f24" />
      <Ellipse cx={31.5} cy={38} rx={3.2} ry={4.4} fill="#7a4628" />
      <Ellipse cx={68.5} cy={38} rx={3.2} ry={4.4} fill="#7a4628" />
      <Ellipse cx={50} cy={36} rx={18.5} ry={21} fill="#83502e" />
      <Path d="M32.2 31 Q33 17 50 16 Q67 17 67.8 31 Q64 24.5 50 24 Q36 24.5 32.2 31 Z" fill="#a8a29a" />
      <G fill="#d8d3cb">
        {CURLS.map(([cx, cy], i) => (
          <Circle key={i} cx={cx} cy={cy} r={1.15} />
        ))}
      </G>
      <Path d="M41 27.5 Q50 25.5 59 27.5 M43 30.5 Q50 29 57 30.5" fill="none" stroke="#5e3319" strokeWidth={0.8} strokeLinecap="round" opacity={0.6} />
      <Path d="M38.5 33 Q42.5 31 46 33 M54 33 Q57.5 31 61.5 33" fill="none" stroke="#e6e1d8" strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M39.5 38 Q42.5 35.6 45.5 38 M54.5 38 Q57.5 35.6 60.5 38" fill="none" stroke="#2a160b" strokeWidth={1.7} strokeLinecap="round" />
      <Circle cx={41} cy={44} r={3} fill="#a3603a" opacity={0.5} />
      <Circle cx={59} cy={44} r={3} fill="#a3603a" opacity={0.5} />
      <Path d="M48 39.5 Q47 45 49 46 Q51 46.6 52.6 45.4" fill="none" stroke="#5e3319" strokeWidth={1.1} strokeLinecap="round" />
      <Path d="M33.5 42 Q34 58 50 61 Q66 58 66.5 42 Q62 50 58 50 L42 50 Q38 50 33.5 42 Z" fill="#f1eee8" />
      <Path d="M41.5 49.5 Q46 46.6 50 48.2 Q54 46.6 58.5 49.5 Q55 51.8 50 50.6 Q45 51.8 41.5 49.5 Z" fill="#e3ded5" />
      <Path d="M46 52.6 Q50 55 54 52.6" fill="none" stroke="#6e3f24" strokeWidth={1.2} strokeLinecap="round" />
      <Path d="M40 60 L50 70 L60 60 L60 66 L50 74 L40 66 Z" fill={`url(#${id}-check)`} />
      <Path d="M8 110 Q8 74 26 64 Q36 58 42 62 L50 72 L58 62 Q64 58 74 64 Q92 74 92 110 Z" fill={`url(#${id}-gabi)`} />
      <Path d="M22 86 Q34 78 46 84 M18 98 Q32 90 48 96 M62 74 Q70 82 82 86" fill="none" stroke="#cfc5b3" strokeWidth={1.2} strokeLinecap="round" />
      <Path d="M56 66 Q66 63 76 70 L86 110 L66 110 Z" fill={`url(#${id}-gabi)`} />
      <Path d="M58.5 67 Q66 64.6 73.6 69 L82.5 110 L77 110 L69.6 72.4 Q64 69.6 59.6 71 Z" fill={`url(#${id}-tilet)`} />
      <Path d="M88 110 L88 40 Q88 29 80.5 29 Q74 29 74 35.5" fill="none" stroke={`url(#${id}-stick)`} strokeWidth={4.2} strokeLinecap="round" />
      <Ellipse cx={88} cy={80} rx={5} ry={4.2} fill="#7a4628" />
    </Svg>
  );
}

// --- A woven mesob basket lid ----------------------------------------------------

type Basket = { rays: string[]; ground: string[]; accent: string; rim: string; knot: string; points: number };

const BASKETS: Basket[] = [
  { rays: ['#f2b705', '#1f8a4c', '#e0457b', '#2457c5'], ground: ['#d93b2b', '#f6efe1', '#d93b2b'], accent: '#1d1d1b', rim: '#c62f22', knot: '#7b3fa0', points: 12 },
  { rays: ['#3fb0e8', '#f2b705'], ground: ['#e0457b', '#f6efe1', '#1f8a4c'], accent: '#ffffff', rim: '#c62f22', knot: '#f2b705', points: 10 },
  { rays: ['#1f8a4c', '#7ccf5a'], ground: ['#6b3a1f', '#f2b705', '#b8321f'], accent: '#ffffff', rim: '#5a2d16', knot: '#f2b705', points: 8 },
  { rays: ['#7b3fa0', '#e0457b', '#3fb0e8'], ground: ['#f2b705', '#f6efe1', '#7b3fa0'], accent: '#1d1d1b', rim: '#c62f22', knot: '#e0457b', points: 12 },
  { rays: ['#2457c5', '#3fb0e8', '#1f8a4c'], ground: ['#f6efe1', '#f2b705', '#2457c5'], accent: '#e0457b', rim: '#c62f22', knot: '#e0457b', points: 9 },
  { rays: ['#1d1d1b', '#c62f22'], ground: ['#f2b705', '#f6efe1', '#f2b705'], accent: '#c62f22', rim: '#7d1f16', knot: '#1d1d1b', points: 8 },
];

const R = 44;
const COIL = 3.4;
const SAMPLES = 240;

/** The thread colour at a point on the basket: star rays, stitch diamonds, then bands of ground colour. */
function colourAt(b: Basket, angle: number, r: number, ring: number) {
  const t = r / R;
  const sector = (angle / (Math.PI * 2)) * b.points;
  const f = sector - Math.floor(sector);
  const half = 0.03 + 0.27 * t;
  if (t > 0.2 && Math.abs(f - 0.5) < half) {
    if (t > 0.45 && Math.abs(f - 0.5) < 0.03) return b.ground[1];
    return b.rays[Math.floor(sector) % b.rays.length];
  }
  const between = Math.abs(f - 0.5) - half;
  if (ring % 3 === 1 && between > 0.05 && Math.abs(f < 0.5 ? f : 1 - f) < 0.035 + 0.02 * t) return b.accent;
  return b.ground[Math.min(b.ground.length - 1, Math.floor(t * b.ground.length))];
}

function arc(r: number, a0: number, a1: number) {
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M${(Math.cos(a0) * r).toFixed(2)} ${(Math.sin(a0) * r).toFixed(2)}A${r} ${r} 0 ${large} 1 ${(Math.cos(a1) * r).toFixed(2)} ${(Math.sin(a1) * r).toFixed(2)}`;
}

/** Each coil, split into runs of the same thread colour (worked out once per basket). */
const woven = new Map<number, { d: string; colour: string }[]>();
function weave(index: number) {
  const cached = woven.get(index);
  if (cached) return cached;
  const b = BASKETS[index];
  const out: { d: string; colour: string }[] = [];
  const step = (Math.PI * 2) / SAMPLES;
  for (let ring = 0, r = 6 + COIL / 2; r < R; ring++, r += COIL) {
    let start = 0;
    let colour = colourAt(b, step / 2, r, ring);
    for (let i = 1; i <= SAMPLES; i++) {
      const next = i < SAMPLES ? colourAt(b, (i + 0.5) * step, r, ring) : null;
      if (next !== colour) {
        out.push({ d: arc(r, start * step, i * step), colour });
        start = i;
        colour = next ?? colour;
      }
    }
  }
  woven.set(index, out);
  return out;
}

function MesobBasket({ size, camp }: { size: number; camp: number }) {
  const index = ((camp % BASKETS.length) + BASKETS.length) % BASKETS.length;
  const b = BASKETS[index];
  const id = `mesob-${index}`;
  return (
    <Svg width={size} height={size} viewBox="-50 -50 100 100">
      <Defs>
        <RadialGradient id={`${id}-light`} cx="0.35" cy="0.3" r="0.75">
          <Stop offset="0" stopColor="#fff" stopOpacity={0.28} />
          <Stop offset="0.55" stopColor="#fff" stopOpacity={0} />
          <Stop offset="1" stopColor="#000" stopOpacity={0.28} />
        </RadialGradient>
      </Defs>
      <Circle r={R + 1} fill="#3a2414" />
      <G fill="none" strokeWidth={COIL * 0.86} strokeDasharray="1.7 0.5">
        {weave(index).map((s, i) => (
          <Path key={i} d={s.d} stroke={s.colour} />
        ))}
      </G>
      <Circle r={6.2} fill="#3a2414" />
      <Circle r={4.6} fill="none" stroke={b.knot} strokeWidth={2.6} strokeDasharray="0.8 0.3" />
      <Circle r={1.8} fill={b.knot} />
      <Circle r={R + 3} fill="none" stroke="#3a2414" strokeWidth={6.4} />
      <Circle r={R + 3} fill="none" stroke={b.rim} strokeWidth={5.4} strokeDasharray="1.8 0.5" />
      <Circle r={R + 6} fill={`url(#${id}-light)`} />
    </Svg>
  );
}

// --- On the banner ---------------------------------------------------------------

// where each picture sits on the right of the banner, peeking in from the edge (the website's .camp-*)
const PLACE: Record<CampArtKind, { size: number; right: number; bottom?: number }> = {
  basket: { size: 150, right: -44 },
  cup: { size: 112, right: -12 },
  taxi: { size: 124, right: -30 },
  friends: { size: 112, right: -4, bottom: -6 },
  elder: { size: 92, right: 2, bottom: -10 },
  numbers: { size: 96, right: 4 },
};

/** The camp's picture on the right of its banner; comes in fresh each time the camp changes. */
export default function CampArt({ slug, camp, english }: { slug: string; camp: number; english: boolean }) {
  const kind = campArtFor(slug);
  const place = PLACE[kind];
  const t = useSharedValue(0);

  useEffect(() => {
    t.set(0);
    t.set(kind === 'taxi' ? withTiming(1, { duration: 900, easing: Easing.out(Easing.back(1.2)) }) : withSpring(1, { damping: 11, stiffness: 140 }));
  }, [slug, kind, t]);

  // each one arrives its own way: the basket spins in, the taxi drives in, people rise up
  const style = useAnimatedStyle(() => {
    const p = t.get();
    if (kind === 'basket') return { opacity: Math.min(p * 2, 1), transform: [{ rotate: `${interpolate(p, [0, 1], [-120, 0])}deg` }, { scale: interpolate(p, [0, 1], [0.6, 1]) }] };
    if (kind === 'taxi') return { opacity: Math.min(p * 3, 1), transform: [{ translateX: interpolate(p, [0, 1], [150, 0]) }] };
    if (kind === 'cup') return { opacity: Math.min(p * 3, 1), transform: [{ translateY: interpolate(p, [0, 1], [-40, 0]) }, { rotate: `${interpolate(p, [0, 1], [-8, 0])}deg` }] };
    if (kind === 'numbers') return { opacity: Math.min(p * 2, 1), transform: [{ rotate: `${interpolate(p, [0, 1], [14, 0])}deg` }, { scale: interpolate(p, [0, 1], [0.7, 1]) }] };
    return { opacity: Math.min(p * 3, 1), transform: [{ translateY: interpolate(p, [0, 1], [60, 0]) }] };
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.art, { right: place.right }, place.bottom !== undefined ? { bottom: place.bottom } : styles.middle, style]}
    >
      {kind === 'numbers' ? <GeezNumbers size={place.size} /> : null}
      {kind === 'cup' ? <SiniCup size={place.size} /> : null}
      {kind === 'taxi' ? <AddisTaxi size={place.size} /> : null}
      {kind === 'friends' ? <Friends size={place.size} greeting={english ? 'Hello!' : undefined} /> : null}
      {kind === 'elder' ? <Elder size={place.size} /> : null}
      {kind === 'basket' ? <MesobBasket size={place.size} camp={camp} /> : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  art: { position: 'absolute' },
  middle: { top: 0, bottom: 0, justifyContent: 'center' },
});
