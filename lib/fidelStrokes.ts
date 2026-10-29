import type { CharacterJson } from 'hanzi-writer';

// Stroke data for writing the ፊደል (Kwanqa's own, made from Noto Sans Ethiopic):
// one file per letter family in public/fidel-strokes/, fetched once and shared
// by every letter in it. Used by the alphabet page's Write tab and by the
// "Trace the new letter" questions in lessons.

type Family = Record<string, CharacterJson>;
const families = new Map<string, Promise<Family>>();

export function loadFamily(base: string) {
  const code = base.codePointAt(0)!.toString(16);
  if (!families.has(code)) {
    families.set(
      code,
      fetch(`/fidel-strokes/${code}.json`).then(r => {
        if (!r.ok) throw new Error(`no strokes for ${base}`);
        return r.json() as Promise<Family>;
      }),
    );
  }
  return families.get(code)!;
}

/** The first letter of a character's family (fidel families sit in blocks of eight code points). */
export function familyOf(char: string) {
  const code = char.codePointAt(0)!;
  return String.fromCodePoint(code - ((code - 0x1200) % 8));
}

/** For Hanzi Writer's charDataLoader: the strokes of one letter. */
export function loadLetter(char: string, onLoad: (data: CharacterJson) => void, onError: (err?: unknown) => void) {
  loadFamily(familyOf(char))
    .then(f => (f[char] ? onLoad(f[char]) : onError(new Error(`no strokes for ${char}`))))
    .catch(onError);
}
