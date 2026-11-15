'use client';

// The alphabet page's tabs: the chart, writing practice, phrase flashcards and
// the daily ፊደል puzzle. The Chart tab has a Letters / Numbers switch for the
// ፊደል and the Ge'ez numerals. Both live in the URL (?tab=write, ?view=numbers)
// so they can be linked to.

import { useRouter, useSearchParams } from 'next/navigation';
import FidelChart from '@/components/FidelChart';
import FidelPuzzle from '@/components/FidelPuzzle';
import FidelWrite from '@/components/FidelWrite';
import Flashcards from '@/components/Flashcards';
import GeezNumerals from '@/components/GeezNumerals';

const TABS = [
  { id: 'chart', label: 'Chart' },
  { id: 'write', label: 'Write' },
  { id: 'cards', label: 'Flashcards' },
  { id: 'puzzle', label: 'Puzzle' },
] as const;

type Tab = (typeof TABS)[number]['id'];

export default function FidelTabs() {
  const params = useSearchParams();
  const router = useRouter();
  const tab: Tab = TABS.some(t => t.id === params.get('tab')) ? (params.get('tab') as Tab) : 'chart';
  const numbers = tab === 'chart' && params.get('view') === 'numbers';

  function open(id: Tab) {
    router.replace(id === 'chart' ? '/fidel' : `/fidel?tab=${id}`, { scroll: false });
  }

  return (
    <>
      <div className="fidel-tabs" role="tablist" aria-label="Alphabet">
        {TABS.map(t => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`fidel-tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls="fidel-panel"
            className={`fidel-tab${tab === t.id ? ' on' : ''}`}
            onClick={() => open(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div id="fidel-panel" role="tabpanel" aria-labelledby={`fidel-tab-${tab}`}>
        {tab === 'chart' && (
          <>
            <div className="fidel-view" role="group" aria-label="Show">
              <button
                type="button"
                className={`fidel-view-btn${numbers ? '' : ' on'}`}
                aria-pressed={!numbers}
                onClick={() => router.replace('/fidel', { scroll: false })}
              >
                <span lang="am">ፊደል</span> Letters
              </button>
              <button
                type="button"
                className={`fidel-view-btn${numbers ? ' on' : ''}`}
                aria-pressed={numbers}
                onClick={() => router.replace('/fidel?view=numbers', { scroll: false })}
              >
                <span lang="am">፩፪፫</span> Numbers
              </button>
            </div>
            {numbers ? <GeezNumerals /> : <FidelChart />}
          </>
        )}
        {tab === 'write' && <FidelWrite />}
        {tab === 'cards' && <Flashcards />}
        {tab === 'puzzle' && <FidelPuzzle />}
      </div>
    </>
  );
}
