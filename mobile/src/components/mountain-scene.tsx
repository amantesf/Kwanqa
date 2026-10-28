import Svg, { Circle, Path } from 'react-native-svg';

// Stylized Simien Mountains under a Meskel-yellow sun, as on the website
// (components/MountainScene.tsx). Fills its box, anchored to the bottom.
export default function MountainScene() {
  return (
    <Svg viewBox="0 0 480 300" width="100%" height="100%" preserveAspectRatio="xMidYMax slice">
      <Circle cx={360} cy={78} r={38} fill="#ffc233" />
      <Circle cx={360} cy={78} r={56} fill="#ffc233" opacity={0.18} />
      {/* far ridge */}
      <Path d="M0 190 L52 132 L84 150 L126 96 L162 122 L204 84 L246 118 L292 70 L330 104 L372 88 L420 128 L480 106 L480 300 L0 300 Z" fill="#f6d3c4" />
      {/* mid ridge with flat-topped ambas */}
      <Path d="M0 228 L40 200 L70 206 L96 168 L150 168 L176 196 L222 176 L268 136 L318 136 L348 172 L392 160 L438 186 L480 172 L480 300 L0 300 Z" fill="#e79a76" />
      {/* near ridge */}
      <Path d="M0 262 L48 238 L104 250 L150 222 L210 244 L262 214 L322 238 L382 218 L436 240 L480 230 L480 300 L0 300 Z" fill="#d2582e" />
    </Svg>
  );
}
