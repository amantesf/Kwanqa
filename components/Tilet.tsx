import { useId } from 'react';

// ጥለት (tilet): the woven border on a habesha dress or netela. A chain of
// diamonds between black-and-gold checkered edges, repeated to any width.
// Drawn here from scratch so it scales crisply and costs no image download.

const PALETTES = {
  classic: { ground: '#f5c21b', edge: '#1d1d1b', a: ['#1f8a4c', '#ffffff', '#d23c2a'], b: ['#d23c2a', '#ffffff', '#2457c5'], tri: '#1d1d1b' },
  dusk: { ground: '#f5c21b', edge: '#1d1d1b', a: ['#7b3fa0', '#fbe7a1', '#1f8a4c'], b: ['#2457c5', '#ffffff', '#e0457b'], tri: '#1d1d1b' },
  // Quiet version for modern layouts: ink, gold and terracotta only.
  ink: { ground: '#241a14', edge: '#c9a24a', a: ['#c9a24a', '#241a14', '#d2582e'], b: ['#d2582e', '#241a14', '#c9a24a'], tri: '#c9a24a' },
} as const;

/** A diamond centered on (cx, cy) with half-width r. */
function diamond(cx: number, cy: number, r: number) {
  return `M${cx} ${cy - r} L${cx + r} ${cy} L${cx} ${cy + r} L${cx - r} ${cy} Z`;
}

export default function Tilet({
  height = 28,
  palette = 'classic',
  className,
}: {
  height?: number;
  palette?: keyof typeof PALETTES;
  className?: string;
}) {
  const id = useId().replace(/:/g, '');
  const c = PALETTES[palette];
  // One repeat is 48 × 28: two diamonds, each nested three deep.
  const scale = height / 28;
  return (
    <svg className={`tilet${className ? ` ${className}` : ''}`} width="100%" height={height} aria-hidden focusable="false">
      <defs>
        <pattern id={`tilet-${id}`} width={48 * scale} height={height} patternUnits="userSpaceOnUse">
          <g transform={`scale(${scale})`}>
            <rect width="48" height="28" fill={c.ground} />
            {/* checkered edges */}
            {Array.from({ length: 16 }, (_, i) => (
              <g key={i}>
                <rect x={i * 3} y={i % 2 ? 0 : 1.5} width="3" height="1.5" fill={c.edge} />
                <rect x={i * 3} y={i % 2 ? 26.5 : 25} width="3" height="1.5" fill={c.edge} />
              </g>
            ))}
            {/* little triangles pointing in between the diamonds */}
            <path d="M24 3 L28 7 L20 7 Z M24 25 L28 21 L20 21 Z M0 3 L4 7 L-4 7 Z M48 3 L52 7 L44 7 Z M0 25 L4 21 L-4 21 Z M48 25 L52 21 L44 21 Z" fill={c.tri} />
            <path d={diamond(24, 14, 3)} fill={c.tri} />
            {/* the two diamonds */}
            <path d={diamond(12, 14, 10)} fill={c.a[0]} />
            <path d={diamond(12, 14, 6.5)} fill={c.a[1]} />
            <path d={diamond(12, 14, 3.2)} fill={c.a[2]} />
            <path d={diamond(36, 14, 10)} fill={c.b[0]} />
            <path d={diamond(36, 14, 6.5)} fill={c.b[1]} />
            <path d={diamond(36, 14, 3.2)} fill={c.b[2]} />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height={height} fill={`url(#tilet-${id})`} />
    </svg>
  );
}
