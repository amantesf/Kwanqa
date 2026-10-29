// Builds the dark-mode versions of the stylesheets: for every rule that uses a
// fixed colour (a white card, dark grey text, a light border...), a dark-mode
// version of that rule with the colour swapped for its dark equivalent.
//   app/globals.css        -> app/dark.generated.css   (loaded in app/layout.tsx)
//   app/fidel/fidel.css    -> app/fidel/fidel.dark.css (loaded in its page.tsx)
//   app/talk/talk.css      -> app/talk/talk.dark.css
//   app/talk/call.css      -> app/talk/call.dark.css
//
// Run it again after changing colours in globals.css:
//   node scripts/make-dark-css.mjs
//
// Hand-written dark-mode tokens and fixes live in app/dark.css, which is loaded
// after this file and wins over it.

import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const postcss = require('postcss');

const FILES = [
  ['app/globals.css', 'app/dark.generated.css'],
  ['app/fidel/fidel.css', 'app/fidel/fidel.dark.css'],
  ['app/talk/talk.css', 'app/talk/talk.dark.css'],
  ['app/talk/call.css', 'app/talk/call.dark.css'],
];
const DARK = ":where(html[data-theme='dark'])";

// Rules left exactly as they are: the colour tokens (dark ones are in
// app/dark.css), the stamp celebration (already dark), flags and stamps.
// The mountain and Walia are drawn with their own colours inside the SVGs.
const SKIP = [
  /^:root$/,
  /\.reveal/,
  /\.flag|ethio-flag/,
  /stamp-drop|passport-rail-row svg|passport-page svg/,
  /confetti|sparkle/,
];

// ---------- colour maths ----------
function parseColor(text) {
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

function toHsl({ r, g, b }) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
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

function fromHsl({ h, s, l }) {
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return { r: Math.round(f(0) * 255), g: Math.round(f(8) * 255), b: Math.round(f(4) * 255) };
}

function format({ r, g, b }, a) {
  const hex = '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
  return a >= 1 ? hex : `rgba(${r}, ${g}, ${b}, ${Math.round(a * 1000) / 1000})`;
}

// The dark page's own hue: a deep blue-grey, so greys don't look flat.
const NIGHT_HUE = 200;

/** A light surface (card, panel, soft tint) as it looks in dark mode. */
function darkSurface(c) {
  const { h, s, l } = toHsl(c);
  const grey = s < 0.12;
  // white -> the card colour; light tints keep a hint of their hue
  const nl = 0.13 + (1 - l) * 0.55;
  // tints stay only a hint of their colour, so cream doesn't turn into mud
  const ns = grey ? 0.22 : Math.min(s, 0.3) * 0.4;
  return format(fromHsl({ h: grey ? NIGHT_HUE : h, s: ns, l: Math.min(nl, 0.3) }), c.a);
}

/** A light line (border, divider) in dark mode: a little brighter than the surface. */
function darkLine(c) {
  const { h, s, l } = toHsl(c);
  const grey = s < 0.12;
  return format(fromHsl({ h: grey ? NIGHT_HUE : h, s: grey ? 0.18 : Math.min(s, 0.4) * 0.35, l: 0.22 + (1 - l) * 0.4 }), c.a);
}

/** Dark text in dark mode: light, keeping its hue. */
function lightText(c) {
  const { h, s, l } = toHsl(c);
  const grey = s < 0.12;
  return format(fromHsl({ h: grey ? NIGHT_HUE : h, s: grey ? 0.15 : Math.min(s, 0.7), l: Math.min(0.94, 0.94 - l * 0.35) }), c.a);
}

const COLOR = /#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)|\bwhite\b|\bblack\b/g;
const TEXT_PROPS = new Set(['color', 'fill', '-webkit-text-fill-color', 'caret-color', 'text-decoration-color']);
const LINE_PROPS = /^(border|outline|column-rule)/;
const SURFACE_PROPS = /^(background|box-shadow|stroke)/;

/** What a custom property holds, from its name: text, a line, or a surface. */
function roleOf(prop) {
  if (!prop.startsWith('--')) return prop;
  if (/(fg|text|ink)$/.test(prop)) return 'color';
  if (/(edge|border|line)$/.test(prop)) return 'border-color';
  if (/(bg|soft|page|raised|surface|paper)$/.test(prop) || prop === '--stone') return 'background';
  return null; // anything else (brand colours like --camp or --tone) stays as it is
}

/** True when a rule paints a bright, saturated background (a gold or green button). */
function brightBackground(rule) {
  let bright = false;
  rule.each(node => {
    if (node.type !== 'decl' || !/^(background|--btn-bg)/.test(node.prop)) return;
    for (const match of node.value.match(COLOR) ?? []) {
      const c = parseColor(match);
      if (!c) continue;
      const { s, l } = toHsl(c);
      if (s > 0.45 && l > 0.4 && l < 0.85) bright = true;
    }
    if (/var\(--(primary|green|blue|gold|red|purple)\)/.test(node.value)) bright = true;
  });
  return bright;
}

/** The dark version of one declaration's value, or null if nothing changes. */
function darken(rawProp, value, onBright) {
  const prop = roleOf(rawProp);
  if (!prop) return null;
  let changed = false;
  let out = value;
  // Text in a brand colour's dark "shadow" shade (made for white pages) gets a
  // lighter mix of that colour instead.
  if (TEXT_PROPS.has(prop) && !onBright) {
    out = out.replace(/var\(--(blue|gold|red|purple|primary)-shadow\)/g, (_, name) => {
      changed = true;
      return `color-mix(in srgb, var(--${name}) 70%, #fff)`;
    });
  }
  out = out.replace(COLOR, match => {
    const c = parseColor(match);
    if (!c) return match;
    const { s, l } = toHsl(c);
    let next = match;
    if (TEXT_PROPS.has(prop)) {
      // dark text becomes light; white text (on coloured buttons) stays, and so
      // does dark text sitting on a bright button
      if (onBright) return match;
      if (l < 0.45 && s < 0.45) next = lightText(c);
      else if (l < 0.55) next = format(fromHsl({ h: toHsl(c).h, s: Math.min(s, 0.75), l: 0.7 }), c.a);
    } else if (LINE_PROPS.test(prop)) {
      if (l > 0.75) next = darkLine(c);
    } else if (SURFACE_PROPS.test(prop)) {
      // shadows made of black stay; light surfaces and pale tints go dark
      if (prop === 'box-shadow' && l < 0.5) return match;
      if (l > 0.82 || (l > 0.7 && s < 0.12)) next = darkSurface(c);
    }
    if (next !== match) changed = true;
    return next;
  });
  return changed ? out : null;
}


// ---------- walk each stylesheet ----------
function build(source) {
  const root = postcss.parse(readFileSync(new URL(`../${source}`, import.meta.url), 'utf8'));
  const out = postcss.root();
  let rules = 0;
  let decls = 0;

  root.walkRules(rule => {
    if (rule.parent?.type === 'atrule' && /keyframes$/i.test(rule.parent.name)) return;
    const selectors = rule.selectors.filter(sel => !SKIP.some(re => re.test(sel)));
    if (!selectors.length) return;
    const changed = [];
    const onBright = brightBackground(rule);
    rule.each(node => {
      if (node.type !== 'decl') return;
      const value = darken(node.prop.toLowerCase(), node.value, onBright);
      if (value) changed.push(postcss.decl({ prop: node.prop, value, important: node.important }));
    });
    if (!changed.length) return;

    const dark = postcss.rule({
      selectors: selectors.map(sel =>
        /^(html|:root)\b/.test(sel) ? sel.replace(/^(html|:root)/, "html[data-theme='dark']") : `${DARK} ${sel}`,
      ),
    });
    changed.forEach(d => dark.append(d));
    rules++;
    decls += changed.length;

    // keep the rule inside the same @media / @supports blocks
    let target = dark;
    for (let p = rule.parent; p && p.type === 'atrule'; p = p.parent) {
      target = postcss.atRule({ name: p.name, params: p.params }).append(target);
    }
    out.append(target);
  });
  return { css: out.toString().trim(), rules, decls };
}

for (const [source, output] of FILES) {
  const { css, rules, decls } = build(source);
  const header = `/* GENERATED by scripts/make-dark-css.mjs from ${source}. Don't edit by hand:
   change ${source} (or app/dark.css for hand-written dark-mode fixes) and run
   \`node scripts/make-dark-css.mjs\` again. */\n\n`;
  writeFileSync(new URL(`../${output}`, import.meta.url), header + css + '\n');
  console.log(`${output}: ${rules} rules, ${decls} declarations`);
}
