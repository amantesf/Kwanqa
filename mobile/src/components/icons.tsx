import Svg, { Path, Rect } from 'react-native-svg';
import { colors } from '@/theme';

// Small icons from the website (components/GrassIcon.tsx, ClimbStreak.tsx).

/** A tuft of Simien grass (ሳር), the currency Walia grazes on. */
export function Grass({ size = 24 }: { size?: number }) {
  return (
    <Svg viewBox="0 0 32 32" width={size} height={size}>
      <Path d="M4 29 C 6 20, 8 15, 6 6 C 10 13, 12 20, 12 29 Z" fill="#5fb84a" />
      <Path d="M10 29 C 12 18, 14 11, 16 3 C 18 11, 20 18, 22 29 Z" fill="#4fa83c" />
      <Path d="M20 29 C 20 20, 22 13, 27 7 C 25 15, 26 21, 28 29 Z" fill="#6cc455" />
      <Rect x={3} y={27} width={26} height={4} rx={2} fill="#8a6a48" />
    </Svg>
  );
}

/** The climb streak's peak: lit once the learner has practised today. */
export function Peak({ lit, size = 24 }: { lit: boolean; size?: number }) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size}>
      <Path d="M2 20 L9 8 L13 14 L16 10 L22 20 Z" fill={lit ? colors.primary : '#d6d0ca'} />
      <Path d="M9 8 L11 11.5 L9.8 11 L8.3 12 Z" fill="rgba(0,0,0,0.22)" />
      <Path d="M16 10 L17.6 12.7 L16.5 12.3 L15.4 13.2 Z" fill="rgba(0,0,0,0.22)" />
    </Svg>
  );
}
