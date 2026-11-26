'use client';

import { useState } from 'react';
import { showToast } from '@/components/Toaster';
import { knownWordsSnapshot } from '@/lib/knownWords';
import { supabase } from '@/lib/supabase';

// Saves everything kwanqa keeps about you as one file: what's on our servers
// (from /api/my-data) plus the words you've marked, which only live on this device.
export default function DownloadMyData() {
  const [busy, setBusy] = useState(false);

  async function download() {
    setBusy(true);
    try {
      const token = (await supabase?.auth.getSession())?.data.session?.access_token;
      const res = await fetch('/api/my-data', { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Couldn’t download your data.');
      const file = { ...data, on_this_device: { stories_words: knownWordsSnapshot() } };
      const url = URL.createObjectURL(new Blob([JSON.stringify(file, null, 2)], { type: 'application/json' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'kwanqa-my-data.json';
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      showToast('Your data is downloading.');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Couldn’t download your data.', 'bad');
    } finally {
      setBusy(false);
    }
  }

  return (
    <button type="button" className="download-data-link" onClick={download} disabled={busy}>
      {busy ? 'Preparing your file…' : 'Download my data'}
    </button>
  );
}
