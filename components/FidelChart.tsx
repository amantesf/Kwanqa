'use client';

import { useState } from 'react';
import { FIDEL, VOWELS, type FidelCell, type FidelRow } from '@/lib/fidel';

type Selected = { row: FidelRow; cell: FidelCell };

function sound(cell: FidelCell) {
  return cell.roman || '—';
}

export default function FidelChart() {
  const [hideDuplicates, setHideDuplicates] = useState(false);
  const [quiz, setQuiz] = useState(false);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<Selected>({ row: FIDEL[0], cell: FIDEL[0].cells[0] });

  const rows = hideDuplicates ? FIDEL.filter(r => !r.sameAs) : FIDEL;

  function pick(row: FidelRow, cell: FidelCell) {
    setSelected({ row, cell });
    if (quiz) setRevealed(prev => new Set(prev).add(cell.char));
  }

  function toggleQuiz(on: boolean) {
    setQuiz(on);
    setRevealed(new Set());
  }

  const { row, cell } = selected;
  const carrier = !row.roman;

  return (
    <div className="fidel">
      <div className="fidel-controls">
        <label className="toggle">
          <input type="checkbox" checked={hideDuplicates} onChange={e => setHideDuplicates(e.target.checked)} />
          Hide duplicate sounds
        </label>
        <label className="toggle">
          <input type="checkbox" checked={quiz} onChange={e => toggleQuiz(e.target.checked)} />
          Quiz me
        </label>
      </div>

      <div className="fidel-layout">
        <aside className="fidel-detail" aria-live="polite">
          <div className="fidel-big">{cell.char}</div>
          <div className="fidel-roman">{sound(cell)}</div>
          <p className="small">
            {carrier ? (
              <>
                <strong>{row.base}</strong> carries a vowel on its own, so {cell.char} is just the
                vowel <strong>{cell.vowel.roman}</strong> — {cell.vowel.hint}.
              </>
            ) : (
              <>
                <strong>{row.base}</strong> ({row.name}) + vowel <strong>{cell.vowel.roman}</strong>{' '}
                — {cell.vowel.hint}.
              </>
            )}
          </p>
          {row.sameAs && (
            <p className="fidel-note small">
              Sounds the same as <strong>{row.sameAs}</strong> in Amharic today—it appears in some
              traditional spellings.
            </p>
          )}
          <div className="fidel-family" aria-label={`All forms of ${row.base}`}>
            {row.cells.map(c => (
              <button
                key={c.char}
                type="button"
                className={`fidel-mini${c.char === cell.char ? ' on' : ''}`}
                onClick={() => pick(row, c)}
              >
                {c.char}
              </button>
            ))}
          </div>
        </aside>

        <div className="fidel-table-wrap">
          <table className="fidel-table">
            <thead>
              <tr>
                <th scope="col" className="fidel-corner" />
                {VOWELS.map(v => (
                  <th key={v.order} scope="col" title={v.hint}>
                    <span className="fidel-vowel">{v.roman}</span>
                    <span className="fidel-order">{v.order}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.base} className={r.sameAs ? 'dup' : undefined}>
                  <th scope="row">{r.roman || 'ʾ'}</th>
                  {r.cells.map(c => {
                    const hidden = quiz && !revealed.has(c.char);
                    return (
                      <td key={c.char}>
                        <button
                          type="button"
                          className={`fidel-cell${c.char === cell.char ? ' on' : ''}`}
                          onClick={() => pick(r, c)}
                          aria-label={`${c.char}, ${sound(c)}`}
                        >
                          <span className="fidel-char">{c.char}</span>
                          <span className="fidel-sound">{hidden ? '?' : sound(c)}</span>
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
