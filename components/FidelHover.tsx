'use client';

// Rest the mouse on any Amharic letter, anywhere on the site, and a small card
// shows its ፊደል family: the same consonant with all seven vowels, with the one
// you're on highlighted. It finds the letter under the pointer from the page's
// text, so no page needs to mark its Amharic up.
//
// Computers with a mouse only (phones have no hover), and not where letters
// are already the lesson: the alphabet page, the puzzle, or text boxes.

import { useEffect, useState } from 'react';
import { FIDEL, type FidelRow } from '@/lib/fidel';

const DWELL_MS = 650; // how long the pointer rests before the card shows
const SKIP = 'input, textarea, [contenteditable="true"], .fidel, .fp, .fw, [data-no-fidel-hover]';

type Shown = { row: FidelRow; at: number; x: number; top: number; bottom: number };

/** The row a letter belongs to and its vowel (0–6), if it's one of the 7 forms. */
function rowOf(char: string): { row: FidelRow; at: number } | null {
  const cp = char.codePointAt(0);
  if (cp === undefined || cp < 0x1200 || cp > 0x137f) return null;
  for (const row of FIDEL) {
    const at = row.cells.findIndex(c => c.char === char);
    if (at >= 0) return { row, at };
  }
  return null;
}

/** The character right under the pointer, and where it sits on screen. */
function charAt(x: number, y: number): { char: string; rect: DOMRect; node: Node } | null {
  let node: Node | null = null;
  let offset = 0;
  const doc = document as Document & {
    caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node; offset: number } | null;
  };
  if (doc.caretPositionFromPoint) {
    const pos = doc.caretPositionFromPoint(x, y);
    if (pos) ({ offsetNode: node, offset } = pos);
  } else if (document.caretRangeFromPoint) {
    const range = document.caretRangeFromPoint(x, y);
    if (range) ({ startContainer: node, startOffset: offset } = range);
  }
  if (!node || node.nodeType !== Node.TEXT_NODE) return null;
  const text = (node as Text).data;
  // the caret lands between letters, so try the letter on each side of it
  for (const i of [offset, offset - 1]) {
    if (i < 0 || i >= text.length) continue;
    const range = document.createRange();
    range.setStart(node, i);
    range.setEnd(node, i + 1);
    const rect = range.getBoundingClientRect();
    if (x >= rect.left - 1 && x <= rect.right + 1 && y >= rect.top - 1 && y <= rect.bottom + 1) {
      return { char: text[i], rect, node };
    }
  }
  return null;
}

export default function FidelHover() {
  const [shown, setShown] = useState<Shown | null>(null);

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    let timer = 0;
    let frame = 0;
    let current = ''; // the letter being rested on, by position

    function hide() {
      window.clearTimeout(timer);
      current = '';
      setShown(null);
    }

    function check(x: number, y: number) {
      const found = charAt(x, y);
      const el = found?.node.parentElement;
      const letter = found && !el?.closest(SKIP) ? rowOf(found.char) : null;
      if (!found || !letter) {
        if (current) hide();
        return;
      }
      const key = `${found.char}@${Math.round(found.rect.left)},${Math.round(found.rect.top)}`;
      if (key === current) return;
      hide();
      current = key;
      timer = window.setTimeout(() => {
        setShown({ ...letter, x: found.rect.left + found.rect.width / 2, top: found.rect.top, bottom: found.rect.bottom });
      }, DWELL_MS);
    }

    function onMove(e: MouseEvent) {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => check(e.clientX, e.clientY));
    }

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('scroll', hide, { passive: true, capture: true });
    window.addEventListener('mousedown', hide);
    window.addEventListener('blur', hide);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', hide, { capture: true });
      window.removeEventListener('mousedown', hide);
      window.removeEventListener('blur', hide);
      window.clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
  }, []);

  if (!shown) return null;
  // keep the card on screen
  const left = Math.min(Math.max(shown.x, 200), window.innerWidth - 200);
  const below = shown.top < 130; // no room above: show it under the letter
  return (
    <div
      className={`fidel-hover${below ? ' below' : ''}`}
      style={{ left, top: below ? shown.bottom + 10 : shown.top - 10 }}
      role="tooltip"
      aria-hidden
    >
      <div className="fidel-hover-forms" lang="am">
        {shown.row.cells.map((cell, i) => (
          <span key={cell.char} className={i === shown.at ? 'on' : undefined}>
            {cell.char}
            <small>{cell.roman}</small>
          </span>
        ))}
      </div>
      <p>
        The <strong lang="am">{shown.row.base}</strong> family: one consonant, seven vowels.
      </p>
    </div>
  );
}
