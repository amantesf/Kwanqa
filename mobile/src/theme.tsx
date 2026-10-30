import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Appearance, Platform, StyleSheet, useColorScheme } from 'react-native';
import { storage } from '@/lib/storage';

// The website's colors (app/globals.css), so the app looks like Kwanqa, and
// its dark mode (app/dark.css): the same night colours, and the same colour
// maths as scripts/make-dark-css.mjs for any fixed colour a screen uses
// (white cards go dark, dark text goes light, bright buttons stay bright).
//
// Light, Dark, or Automatic (the phone's own setting), chosen on Profile.
// Screens read colours with useColors() and styles with makeStyles(), so they
// redraw when it changes.

export const light = {
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

export type Palette = typeof light;

export const dark: Palette = {
  ...light,
  primarySoft: '#3a2219',
  primaryBorder: '#5a3324',
  // a brighter blue, so blue text reads on dark
  blue: '#4f8ff2',
  ink: '#eef3f6',
  muted: '#9cabb3',
  line: '#2e3c43',
  bg: '#131c20',
  bgSoft: '#1b262b',
  stone: '#25333a',
  stoneEdge: '#3e5059',
  stoneText: '#6f8089',
};

/** The light colours, for drawings and constants that keep their colours at night. */
export const colors = light;

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

// ---------- light, dark or automatic ----------

export type ThemeSetting = 'system' | 'light' | 'dark';
export type Scheme = 'light' | 'dark';
const KEY = 'kwanqa-theme';

function readSetting(): ThemeSetting {
  const saved = storage().getItem(KEY);
  return saved === 'light' || saved === 'dark' ? saved : 'system';
}

const ThemeContext = createContext<{ scheme: Scheme; setting: ThemeSetting; setSetting: (s: ThemeSetting) => void }>({
  scheme: 'light',
  setting: 'system',
  setSetting: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [setting, setSettingState] = useState<ThemeSetting>(readSetting);
  const system = useColorScheme();

  // the phone's own parts (tab bar, sheets, keyboard, alerts) follow along too
  useEffect(() => {
    if (Platform.OS !== 'web') Appearance.setColorScheme(setting === 'system' ? 'unspecified' : setting);
  }, [setting]);

  function setSetting(next: ThemeSetting) {
    if (next === 'system') storage().removeItem(KEY);
    else storage().setItem(KEY, next);
    setSettingState(next);
  }

  const scheme: Scheme = setting === 'system' ? (system === 'dark' ? 'dark' : 'light') : setting;
  return <ThemeContext.Provider value={{ scheme, setting, setSetting }}>{children}</ThemeContext.Provider>;
}

/** 'light' or 'dark', as it's showing now. */
export function useScheme() {
  return useContext(ThemeContext).scheme;
}

/** The Light / Dark / Automatic choice, for the switch on Profile. */
export function useThemeSetting() {
  const { setting, setSetting } = useContext(ThemeContext);
  return [setting, setSetting] as const;
}

/** The colours for now. */
export function useColors(): Palette {
  return useScheme() === 'dark' ? dark : light;
}

/** For a fixed colour set in a component (not in its styles): its night version when it's dark. */
export function useNight() {
  const isDark = useScheme() === 'dark';
  return (color: string, role: ColorRole, onBright = false) => (isDark ? nightColor(color, role, onBright) : color);
}

/**
 * A screen's styles, made from the colours: `const useStyles = makeStyles(c => ({ … }))`,
 * then `const styles = useStyles()` inside each component. At night any fixed
 * colour in them is swapped for its dark version, the way the website does it.
 */
type Styles = Parameters<typeof StyleSheet.create>[0];

export function makeStyles<S extends Styles>(make: (c: Palette) => S & Styles) {
  const made: Partial<Record<Scheme, Readonly<S>>> = {};
  return function useStyles(): Readonly<S> {
    const scheme = useScheme();
    if (!made[scheme]) made[scheme] = StyleSheet.create(scheme === 'dark' ? darkStyles(make(dark)) : make(light));
    return made[scheme]!;
  };
}

// ---------- colour maths (from the website's scripts/make-dark-css.mjs) ----------

type RGBA = { r: number; g: number; b: number; a: number };

function parseColor(text: string): RGBA | null {
  const t = text.trim().toLowerCase();
  if (t === 'white') return { r: 255, g: 255, b: 255, a: 1 };
  if (t === 'black') return { r: 0, g: 0, b: 0, a: 1 };
  let m = t.match(/^#([0-9a-f]{3,8})$/);
  if (m) {
    let h = m[1];
    if (h.length === 3 || h.length === 4) h = [...h].map(c => c + c).join('');
    const n = parseInt(h.slice(0, 6), 16);
    const a = h.length === 8 ? parseInt(h.slice(6), 16) / 255 : 1;
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a };
  }
  m = t.match(/^rgba?\(([^)]*)\)$/);
  if (m) {
    const parts = m[1].split(/[\s,/]+/).filter(Boolean).map(Number);
    if (parts.length < 3 || parts.some(Number.isNaN)) return null;
    return { r: parts[0], g: parts[1], b: parts[2], a: parts[3] ?? 1 };
  }
  return null;
}

function toHsl({ r, g, b }: RGBA) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;
  if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return { h: h * 60, s, l };
}

function fromHsl({ h, s, l }: { h: number; s: number; l: number }) {
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return { r: Math.round(f(0) * 255), g: Math.round(f(8) * 255), b: Math.round(f(4) * 255) };
}

function format({ r, g, b }: { r: number; g: number; b: number }, a: number) {
  const hex = '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
  return a >= 1 ? hex : `rgba(${r}, ${g}, ${b}, ${Math.round(a * 1000) / 1000})`;
}

// The dark page's own hue: a deep blue-grey, so greys don't look flat.
const NIGHT_HUE = 200;

export type ColorRole = 'text' | 'line' | 'surface';

/** A fixed colour as it looks at night, by what it paints. Bright colours stay. */
export function nightColor(value: string, role: ColorRole, onBright = false): string {
  const c = parseColor(value);
  if (!c) return value;
  const { h, s, l } = toHsl(c);
  const grey = s < 0.12;
  if (role === 'text') {
    // dark text becomes light; white text (on coloured buttons) stays, and so
    // does dark text sitting on a bright button
    if (onBright) return value;
    if (l < 0.45 && s < 0.45) return format(fromHsl({ h: grey ? NIGHT_HUE : h, s: grey ? 0.15 : Math.min(s, 0.7), l: Math.min(0.94, 0.94 - l * 0.35) }), c.a);
    if (l < 0.55) return format(fromHsl({ h, s: Math.min(s, 0.75), l: 0.7 }), c.a);
    return value;
  }
  if (role === 'line') {
    if (l > 0.75) return format(fromHsl({ h: grey ? NIGHT_HUE : h, s: grey ? 0.18 : Math.min(s, 0.4) * 0.35, l: 0.22 + (1 - l) * 0.4 }), c.a);
    return value;
  }
  // light surfaces and pale tints go dark
  if (l > 0.82 || (l > 0.7 && s < 0.12)) {
    const nl = 0.13 + (1 - l) * 0.55;
    const ns = grey ? 0.22 : Math.min(s, 0.3) * 0.4;
    return format(fromHsl({ h: grey ? NIGHT_HUE : h, s: ns, l: Math.min(nl, 0.3) }), c.a);
  }
  return value;
}

function isBright(value: unknown) {
  if (typeof value !== 'string') return false;
  const c = parseColor(value);
  if (!c) return false;
  const { s, l } = toHsl(c);
  return s > 0.45 && l > 0.4 && l < 0.85;
}

const ROLE: Record<string, ColorRole> = {
  color: 'text',
  tintColor: 'text',
  textDecorationColor: 'text',
  backgroundColor: 'surface',
  borderColor: 'line',
  borderTopColor: 'line',
  borderBottomColor: 'line',
  borderLeftColor: 'line',
  borderRightColor: 'line',
};

function darkStyles<T extends object>(styles: T): T {
  const out: Record<string, object> = {};
  for (const [name, style] of Object.entries(styles)) {
    const s = style as Record<string, unknown>;
    const onBright = isBright(s.backgroundColor);
    const next: Record<string, unknown> = { ...s };
    for (const [prop, role] of Object.entries(ROLE)) {
      if (typeof s[prop] === 'string') next[prop] = nightColor(s[prop] as string, role, onBright);
    }
    out[name] = next;
  }
  return out as T;
}
