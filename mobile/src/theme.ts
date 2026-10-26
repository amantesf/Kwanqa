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
  ink: '#3c3c3c',
  muted: '#777777',
  line: '#e5e5e5',
  bg: '#ffffff',
  bgSoft: '#f7f7f7',
};

// On web the tab bar sits across the top of the page instead of the bottom,
// so screens without a header leave room for it.
export const tabBarTop = Platform.OS === 'web' ? 64 : 0;
