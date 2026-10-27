import { useId } from 'react';
import Svg, { Defs, G, Path, Pattern, Rect } from 'react-native-svg';

// ጥለት (tilet): the woven border on a habesha dress or netela, drawn as on the
// website (components/Tilet.tsx): a chain of diamonds between checkered edges.

const PALETTES = {
  classic: { ground: '#f5c21b', edge: '#1d1d1b', a: ['#1f8a4c', '#ffffff', '#d23c2a'], b: ['#d23c2a', '#ffffff', '#2457c5'], tri: '#1d1d1b' },
  // the quiet version: ink, gold and terracotta only
  ink: { ground: '#241a14', edge: '#c9a24a', a: ['#c9a24a', '#241a14', '#d2582e'], b: ['#d2582e', '#241a14', '#c9a24a'], tri: '#c9a24a' },
} as const;

const diamond = (cx: number, cy: number, r: number) => `M${cx} ${cy - r} L${cx + r} ${cy} L${cx} ${cy + r} L${cx - r} ${cy} Z`;

export default function Tilet({ height = 28, palette = 'classic' }: { height?: number; palette?: keyof typeof PALETTES }) {
  const id = `tilet-${useId().replace(/[:«»]/g, '')}`;
  const c = PALETTES[palette];
  const scale = height / 28; // one repeat is 48 × 28: two diamonds, each nested three deep
  return (
    <Svg width="100%" height={height}>
      <Defs>
        <Pattern id={id} width={48 * scale} height={height} patternUnits="userSpaceOnUse">
          <G transform={`scale(${scale})`}>
            <Rect width={48} height={28} fill={c.ground} />
            {Array.from({ length: 16 }, (_, i) => (
              <G key={i}>
                <Rect x={i * 3} y={i % 2 ? 0 : 1.5} width={3} height={1.5} fill={c.edge} />
                <Rect x={i * 3} y={i % 2 ? 26.5 : 25} width={3} height={1.5} fill={c.edge} />
              </G>
            ))}
            <Path d="M24 3 L28 7 L20 7 Z M24 25 L28 21 L20 21 Z M0 3 L4 7 L-4 7 Z M48 3 L52 7 L44 7 Z M0 25 L4 21 L-4 21 Z M48 25 L52 21 L44 21 Z" fill={c.tri} />
            <Path d={diamond(24, 14, 3)} fill={c.tri} />
            <Path d={diamond(12, 14, 10)} fill={c.a[0]} />
            <Path d={diamond(12, 14, 6.5)} fill={c.a[1]} />
            <Path d={diamond(12, 14, 3.2)} fill={c.a[2]} />
            <Path d={diamond(36, 14, 10)} fill={c.b[0]} />
            <Path d={diamond(36, 14, 6.5)} fill={c.b[1]} />
            <Path d={diamond(36, 14, 3.2)} fill={c.b[2]} />
          </G>
        </Pattern>
      </Defs>
      <Rect width="100%" height={height} fill={`url(#${id})`} />
    </Svg>
  );
}
