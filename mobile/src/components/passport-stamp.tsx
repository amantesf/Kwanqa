import { useId, type ReactNode } from 'react';
import Svg, { Circle, Defs, Ellipse, G, Path, Rect, Text, TextPath } from 'react-native-svg';
import type { Stamp, StampId } from '@/lib/passport';
import { fonts } from '@/theme';

// A round rubber stamp for each place in the Kwanqa passport, drawn as on the
// website (components/PassportStamp.tsx): the place's name around the top, its
// Amharic name around the bottom, and a little picture of what it's famous for
// in the middle. Locked stamps are a faint grey outline waiting to be collected.

/** Each picture is drawn in a 60×60 box centred on (80, 80), in the stamp's ink. */
const ICONS: Record<StampId, (ink: string) => ReactNode> = {
  // Bete Giyorgis from above: a cross-shaped church in its rock-cut pit
  lalibela: ink => (
    <G>
      <Rect x={54} y={54} width={52} height={52} rx={4} fill="none" stroke={ink} strokeWidth={3} strokeDasharray="5 3" />
      <Path d="M73 58 h14 v8 h7 v7 h8 v14 h-8 v7 h-7 v8 h-14 v-8 h-7 v-7 h-8 v-14 h8 v-7 h7 z" fill={ink} />
      <Path d="M80 66 v28 M66 80 h28" stroke="#fff" strokeWidth={2.4} opacity={0.7} />
    </G>
  ),
  // Fasilides' castle: a square keep between two domed round towers
  gondar: ink => (
    <G fill={ink}>
      <Path d="M66 106 V74 h4 v-5 h4 v5 h4 v-5 h4 v5 h4 v-5 h4 v5 h4 V106 z" />
      <Path d="M52 106 V72 a7 7 0 0 1 14 0 V106 z" />
      <Path d="M94 106 V72 a7 7 0 0 1 14 0 V106 z" />
      <Path d="M52 66 a7 7 0 0 1 14 0 z M94 66 a7 7 0 0 1 14 0 z" opacity={0.8} />
      <Rect x={75} y={92} width={10} height={14} rx={5} fill="#fff" />
      <Rect x={71} y={80} width={5} height={6} fill="#fff" />
      <Rect x={84} y={80} width={5} height={6} fill="#fff" />
    </G>
  ),
  // the Obelisk of Axum, with its carved false windows
  axum: ink => (
    <G>
      <Path d="M71 108 L74 58 Q80 48 86 58 L89 108 Z" fill={ink} />
      {[66, 76, 86, 96].map(y => (
        <G key={y}>
          <Rect x={76} y={y} width={3} height={5} fill="#fff" />
          <Rect x={81} y={y} width={3} height={5} fill="#fff" />
        </G>
      ))}
      <Rect x={64} y={106} width={32} height={4} rx={2} fill={ink} />
    </G>
  ),
  // a papyrus tankwa on the lake's waves
  tana: ink => (
    <G>
      <Path d="M54 86 Q80 102 106 86 Q100 96 80 97 Q60 96 54 86 Z" fill={ink} />
      <Path d="M60 87 l4 -2 M68 90 l4 -2 M76 91 l4 -2 M84 91 l4 -2 M92 89 l4 -2" stroke="#fff" strokeWidth={1.6} />
      <Circle cx={82} cy={70} r={4} fill={ink} />
      <Path d="M82 74 v12 M82 78 l9 -9 M91 69 l4 18" stroke={ink} strokeWidth={3} strokeLinecap="round" fill="none" />
      <Path d="M52 104 q7 -5 14 0 t14 0 t14 0 t14 0" stroke={ink} strokeWidth={3} fill="none" strokeLinecap="round" />
    </G>
  ),
  // one of Harar's gates in the old town wall
  harar: ink => (
    <G fill={ink}>
      <Path d="M52 108 V76 h6 v-6 h6 v6 h6 v-6 h20 v6 h6 v-6 h6 v6 h6 V108 z" />
      <Path d="M68 108 V88 a12 12 0 0 1 24 0 V108 z" fill="#fff" />
      <Path d="M72 108 V89 a8 8 0 0 1 16 0 V108 z" />
      <Rect x={77} y={56} width={6} height={14} rx={3} />
      <Circle cx={80} cy={54} r={3} />
    </G>
  ),
  // the desert sun over a stack of salt bars
  danakil: ink => (
    <G>
      <Circle cx={80} cy={64} r={9} fill={ink} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map(a => (
        <Path key={a} d="M80 50 v-4" stroke={ink} strokeWidth={3} strokeLinecap="round" transform={`rotate(${a} 80 64)`} />
      ))}
      <Rect x={58} y={96} width={44} height={10} rx={2} fill={ink} />
      <Rect x={62} y={86} width={36} height={10} rx={2} fill={ink} opacity={0.75} />
      <Rect x={66} y={78} width={28} height={8} rx={2} fill={ink} opacity={0.55} />
      <Path d="M58 101 h44 M62 91 h36" stroke="#fff" strokeWidth={1.4} />
    </G>
  ),
  // an Ethiopian wolf's head: tall ears, long red snout
  bale: ink => (
    <G>
      <Path d="M62 58 L70 74 L80 70 L90 74 L98 58 L100 80 L92 92 L84 106 Q80 110 76 106 L68 92 L60 80 Z" fill={ink} />
      <Path d="M66 64 L71 74 M94 64 L89 74" stroke="#fff" strokeWidth={2} strokeLinecap="round" />
      <Circle cx={73} cy={83} r={2.6} fill="#fff" />
      <Circle cx={87} cy={83} r={2.6} fill="#fff" />
      <Path d="M72 94 Q80 100 88 94 L84 104 Q80 107 76 104 Z" fill="#fff" opacity={0.85} />
      <Circle cx={80} cy={104} r={2.6} fill={ink} />
    </G>
  ),
  // Addis Ababa, the "new flower": a six-petal flower on its stem
  addis: ink => (
    <G>
      <Path d="M80 92 V112" stroke={ink} strokeWidth={3.5} strokeLinecap="round" />
      <Path d="M80 104 Q70 98 64 104 Q72 110 80 106 Z" fill={ink} />
      {[0, 60, 120, 180, 240, 300].map(a => (
        <Ellipse key={a} cx={80} cy={62} rx={7} ry={13} fill={ink} transform={`rotate(${a} 80 74)`} />
      ))}
      <Circle cx={80} cy={74} r={7} fill="#fff" />
      <Circle cx={80} cy={74} r={3.5} fill={ink} />
    </G>
  ),
  // Konso: stone terraces climbing a hill, with a waka statue on top
  konso: ink => (
    <G>
      <Path d="M50 108 H110 V100 H50 Z M56 98 H104 V90 H56 Z M62 88 H98 V80 H62 Z M68 78 H92 V70 H68 Z" fill={ink} />
      <Path d="M50 104 H110 M56 94 H104 M62 84 H98 M68 74 H92" stroke="#fff" strokeWidth={1.4} strokeDasharray="4 3" opacity={0.7} />
      <Rect x={77} y={52} width={6} height={18} rx={2} fill={ink} />
      <Circle cx={80} cy={49} r={4.5} fill={ink} />
    </G>
  ),
  // Sof Omar: a cave mouth in the cliff, with the river flowing out
  'sof-omar': ink => (
    <G>
      <Path d="M50 108 V78 Q58 58 80 56 Q102 58 110 78 V108 Z" fill={ink} />
      <Path d="M64 108 V88 Q64 71 80 71 Q96 71 96 88 V108 Z" fill="#fff" />
      <Path d="M72 72 L74.5 80 L77 71.5 Z M83 71.5 L85.5 79 L88 72.5 Z" fill={ink} />
      <Path d="M67 95 Q71 92 75 95 T83 95 T91 95 M65 103 Q70 100 75 103 T85 103 T95 103" stroke={ink} strokeWidth={2} fill="none" strokeLinecap="round" />
    </G>
  ),
  // the Blue Nile Falls: the river over the ledge, falling into its mist
  'tis-abay': ink => (
    <G>
      <Path d="M52 60 Q60 56 68 60 T84 60 T100 60 T110 58" stroke={ink} strokeWidth={2.2} fill="none" strokeLinecap="round" />
      <Rect x={50} y={66} width={60} height={8} rx={2} fill={ink} />
      <Path d="M58 74 V99 M66 74 V102 M74 74 V100 M82 74 V103 M90 74 V100 M98 74 V102" stroke={ink} strokeWidth={3} strokeLinecap="round" />
      <Circle cx={60} cy={104} r={7} fill={ink} opacity={0.35} />
      <Circle cx={72} cy={106} r={8} fill={ink} opacity={0.35} />
      <Circle cx={87} cy={105} r={8} fill={ink} opacity={0.35} />
      <Circle cx={100} cy={104} r={7} fill={ink} opacity={0.35} />
    </G>
  ),
  // the summit, with Ethiopia's flag on top
  'ras-dashen': ink => (
    <G>
      <Path d="M50 108 L74 70 L82 80 L90 66 L110 108 Z" fill={ink} />
      <Path d="M74 70 L82 80 L90 66 L86 78 L80 84 Z" fill="#fff" opacity={0.35} />
      <Path d="M90 66 V48" stroke={ink} strokeWidth={2.5} strokeLinecap="round" />
      <Rect x={91} y={48} width={14} height={3.4} fill="#078930" />
      <Rect x={91} y={51.4} width={14} height={3.4} fill="#fcdd09" />
      <Rect x={91} y={54.8} width={14} height={3.4} fill="#da121a" />
      <Circle cx={98} cy={53.1} r={2.2} fill="#0f47af" />
    </G>
  ),
};

export default function PassportStamp({ stamp, earned, size = 160, tilt = 0 }: { stamp: Stamp; earned: boolean; size?: number; tilt?: number }) {
  const id = `stamp-${useId().replace(/[:«»]/g, '')}`;
  const ink = earned ? stamp.ink : '#c9c4bd';
  return (
    <Svg viewBox="0 0 160 160" width={size} height={size} style={{ transform: [{ rotate: `${tilt}deg` }] }} accessibilityLabel={earned ? `${stamp.name} stamp` : `${stamp.name} stamp, not collected yet`}>
      <Defs>
        <Path id={`${id}-top`} d="M26 80 A54 54 0 0 1 134 80" />
        <Path id={`${id}-bottom`} d="M30 82 A50 50 0 0 0 130 82" />
      </Defs>
      <Circle cx={80} cy={80} r={74} fill={earned ? '#fff' : 'none'} stroke={ink} strokeWidth={4} />
      <Circle cx={80} cy={80} r={66} fill="none" stroke={ink} strokeWidth={1.6} strokeDasharray={earned ? undefined : '4 4'} />
      <Circle cx={80} cy={80} r={40} fill="none" stroke={ink} strokeWidth={1.6} opacity={0.5} />
      <Text fill={ink} fontSize={13} fontFamily={fonts.black} letterSpacing={2.4}>
        <TextPath href={`#${id}-top`} startOffset="50%" textAnchor="middle">
          {stamp.name.toUpperCase()}
        </TextPath>
      </Text>
      <Text fill={ink} fontSize={13} fontFamily={fonts.amharicBold} letterSpacing={1}>
        <TextPath href={`#${id}-bottom`} startOffset="50%" textAnchor="middle">
          {stamp.amharic}
        </TextPath>
      </Text>
      <Path d="M17 80 l3 -3 l3 3 l-3 3 z M137 80 l3 -3 l3 3 l-3 3 z" fill={ink} />
      <G opacity={earned ? 1 : 0.55}>{ICONS[stamp.id](ink)}</G>
    </Svg>
  );
}
