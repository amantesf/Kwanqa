import Svg, { Circle, Path, Polygon, Rect } from 'react-native-svg';

// Simplified flags used as language icons, like the website's (components/Flag.tsx).

export type FlagName = 'ethiopia' | 'usa' | 'oromia' | 'tigray';

function star(cx: number, cy: number, r: number) {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const radius = i % 2 === 0 ? r : r * 0.4;
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    pts.push(`${(cx + radius * Math.cos(angle)).toFixed(2)},${(cy + radius * Math.sin(angle)).toFixed(2)}`);
  }
  return pts.join(' ');
}

export default function Flag({ name, width = 48 }: { name: FlagName; width?: number }) {
  const size = { width, height: (width * 2) / 3, viewBox: '0 0 60 40', preserveAspectRatio: 'xMidYMid slice' as const };
  if (name === 'ethiopia') {
    return (
      <Svg {...size}>
        <Rect width={60} height={13.4} fill="#078930" />
        <Rect y={13.3} width={60} height={13.4} fill="#fcdd09" />
        <Rect y={26.6} width={60} height={13.4} fill="#da121a" />
        <Circle cx={30} cy={20} r={10} fill="#0f47af" />
        <Polygon points={star(30, 20.6, 7.4)} fill="none" stroke="#fcdd09" strokeWidth={1.3} />
      </Svg>
    );
  }
  if (name === 'oromia') {
    return (
      <Svg {...size}>
        <Rect width={60} height={13.4} fill="#e01212" />
        <Rect y={13.3} width={60} height={13.4} fill="#fff" />
        <Rect y={26.6} width={60} height={13.4} fill="#000" />
        <Path d="M27.8 26.7 L29.2 21 L31 21 L32.6 26.7 Z" fill="#9c9c6c" />
        <Path
          transform="translate(30 18) scale(1.35) translate(-30 -17.6)"
          d="M22.6 18.6 C 22 16.4, 24.2 15, 25.8 15.4 C 26.6 13.6, 29.4 13.1, 30.8 14.2 C 32.6 13.4, 35.4 14.4, 35.6 16.2 C 37.6 16.6, 38.2 18.8, 36.8 20 C 35.6 21.4, 33 21, 31.6 20.6 C 30.2 21.4, 27.8 21.4, 26.4 20.8 C 24.6 21.4, 22.8 20.4, 22.6 18.6 Z"
          fill="#066b32"
          stroke="#000"
          strokeWidth={0.5}
        />
      </Svg>
    );
  }
  if (name === 'tigray') {
    return (
      <Svg {...size}>
        <Rect width={60} height={40} fill="#da121a" />
        <Polygon points="0,0 25,20 0,40" fill="#fcdd09" />
        <Polygon points={star(39, 20.6, 8)} fill="#fcdd09" />
      </Svg>
    );
  }
  return (
    <Svg {...size}>
      <Rect width={60} height={40} fill="#fff" />
      {[0, 2, 4, 6, 8, 10, 12].map(i => (
        <Rect key={i} y={(i * 40) / 13} width={60} height={40 / 13} fill="#b22234" />
      ))}
      <Rect width={26} height={(40 / 13) * 7} fill="#3c3b6e" />
      {[0, 1, 2].map(r => [0, 1, 2, 3].map(c => <Circle key={`${r}-${c}`} cx={4 + c * 6} cy={4.5 + r * 6.5} r={1.3} fill="#fff" />))}
    </Svg>
  );
}
