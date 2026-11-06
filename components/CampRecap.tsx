'use client';

import { useEffect } from 'react';
import Mascot from '@/components/Mascot';
import { campRecap } from '@/lib/canDo';
import type { Track } from '@/lib/courses';

// The end of a camp: what you can now do in the language ("I can …", lib/canDo.ts)
// and how much the camp taught. Shown after the passport stamp lands, and from
// the camp's trophy on the trail.

export default function CampRecap({ slug, camp, track, onClose }: { slug: string; camp: number; track: Track; onClose: () => void }) {
  const recap = campRecap(slug);
  const english = track === 'english';
  const t = (en: string, am: string) => (english ? `${am} · ${en}` : en);

  useEffect(() => {
    const escape = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', escape);
    return () => document.removeEventListener('keydown', escape);
  }, [onClose]);

  const counts = [
    `${recap.phrases} ${english ? 'phrases · ሐረጎች' : 'phrases'}`,
    recap.rules ? `${recap.rules} grammar ${recap.rules === 1 ? 'rule' : 'rules'}` : null,
    recap.families ? `${recap.families} word ${recap.families === 1 ? 'family' : 'families'}` : null,
  ].filter(Boolean);

  return (
    <div className="recap-backdrop" onClick={onClose}>
      <div className="recap" role="dialog" aria-modal="true" aria-label={`Camp ${camp} complete`} onClick={e => e.stopPropagation()}>
        <Mascot pose="cheer" size={110} />
        <h2>{t(`Camp ${camp} complete!`, `ካምፕ ${camp} ተጠናቀቀ!`)}</h2>
        <p className="recap-lead">{t('You can now say:', 'አሁን እንዲህ ማለት ይችላሉ፡')}</p>
        <ul className="recap-list">
          {recap.canDo.map(item => (
            <li key={item.en}>
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
                <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
              <span>
                {item.am ? (
                  <>
                    <span lang="am">{item.am}</span>
                    <small>I can {item.en}</small>
                  </>
                ) : (
                  <>I can {item.en}</>
                )}
              </span>
            </li>
          ))}
        </ul>
        <p className="recap-counts">
          {t('New this camp', 'በዚህ ካምፕ')}: {counts.join(' · ')}
        </p>
        <button type="button" className="btn btn-block" onClick={onClose} autoFocus>
          {t('Keep climbing', 'መውጣት ቀጥል')}
        </button>
      </div>
    </div>
  );
}
