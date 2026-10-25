'use client';

// The alphabet page's tabs: the chart and writing practice.
// The tab lives in the URL (?tab=write) so it can be linked to.

import { useRouter, useSearchParams } from 'next/navigation';
import FidelChart from '@/components/FidelChart';
import FidelWrite from '@/components/FidelWrite';

const TABS = [
  { id: 'chart', label: 'Chart' },
  { id: 'write', label: 'Write' },
] as const;

type Tab = (typeof TABS)[number]['id'];

export default function FidelTabs() {
  const params = useSearchParams();
  const router = useRouter();
  const tab: Tab = TABS.some(t => t.id === params.get('tab')) ? (params.get('tab') as Tab) : 'chart';

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
        {tab === 'chart' && <FidelChart />}
        {tab === 'write' && <FidelWrite />}
      </div>
    </>
  );
}
