import { Platform } from 'react-native';

// The website's colors (app/globals.css), so the app looks like Kwanqa.
export const colors = {
  primary: '#d2582e',
  primaryShadow: '#a8431f',
  primarySoft: '#fcede6',
  primaryBorder: '#f6d3c4',
  green: '#4fc23a',
  blue: '#1f5bd0',
  gold: '#ffc233',
  goldShadow: '#e0a000',
  ink: '#3c3c3c',
  muted: '#777777',
  line: '#e5e5e5',
  bg: '#ffffff',
  bgSoft: '#f7f7f7',
  stone: '#e2dcd3',
  stoneEdge: '#c4bbae',
  stoneText: '#a39887',
};

// On web the tab bar sits across the top of the page instead of the bottom,
// so screens without a header leave room for it.
export const tabBarTop = Platform.OS === 'web' ? 64 : 0;

// The website's fonts: Nunito for English, Noto Sans Ethiopic for Amharic.
export const fonts = {
  body: 'Nunito_600SemiBold',
  bold: 'Nunito_700Bold',
  heavy: 'Nunito_800ExtraBold',
  black: 'Nunito_900Black',
  amharic: 'NotoSansEthiopic_600SemiBold',
  amharicBold: 'NotoSansEthiopic_700Bold',
};

// Each camp's banner color, in order (the website's .camp-color-0 … 5).
export const campColors = [
  { color: '#d2582e', shadow: '#a8431f' },
  { color: '#1f5bd0', shadow: '#16449c' },
  { color: '#3d8b40', shadow: '#2b6a2e' },
  { color: '#8f4fd0', shadow: '#6c35a8' },
  { color: '#1d8aa0', shadow: '#136677' },
  { color: '#a8650c', shadow: '#7d4a07' },
];
