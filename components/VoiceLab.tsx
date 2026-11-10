'use client';

// /voice-lab: the team listens to Walia's Amharic voice with different
// settings, side by side, and picks the one that sounds most like a real
// person from Addis. The pick becomes AMHARIC_* settings in Vercel
// (lib/azureSpeech.ts). Team only (STATS_EMAILS).

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/lib/supabase';

type Setting = { name: string; voice: 'ameha' | 'mekdes'; rate: number; pitch: number; clean: boolean };

const PRESETS: Setting[] = [
  { name: 'Before (Ameha, as it was)', voice: 'ameha', rate: 0, pitch: 0, clean: false },
  { name: 'Ameha, tidied, a touch slower', voice: 'ameha', rate: -6, pitch: 0, clean: true },
  { name: 'Ameha, slower for learners', voice: 'ameha', rate: -14, pitch: 0, clean: true },
  { name: 'Ameha, slightly deeper', voice: 'ameha', rate: -6, pitch: -4, clean: true },
  { name: 'Mekdes, tidied, a touch slower', voice: 'mekdes', rate: -6, pitch: 0, clean: true },
  { name: 'Mekdes, slower for learners', voice: 'mekdes', rate: -14, pitch: 0, clean: true },
];

const SAMPLES = [
  'ሰላም፣ እንዴት ነህ?',
  'ስምህ ማን ነው?',
  'አማርኛ ትናገራለህ ወይ?',
  'ቡና ትፈልጋለህ?',
  'ደህና ነኝ፣ እግዚአብሔር ይመስገን።',
  'ወደ ባሕር ዳር አንድ ትኬት እፈልጋለሁ።',
  'የአያቴ የአትክልት ስፍራ ግሩም ነው።',
  'አመሰግናለሁ',
];

export default function VoiceLab() {
  const { user, loading } = useAuth();
  const [text, setText] = useState(SAMPLES[0]);
  const [custom, setCustom] = useState<Setting>({ name: 'Your own mix', voice: 'ameha', rate: -6, pitch: 0, clean: true });
  const [busy, setBusy] = useState<string | null>(null);
  const [problem, setProblem] = useState('');
  const [pick, setPick] = useState<Setting | null>(null);
  const [now, setNow] = useState<Omit<Setting, 'name'> | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const token = (await supabase?.auth.getSession())?.data.session?.access_token;
      const res = await fetch('/api/voice-lab', { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      if (res.ok) setNow(await res.json());
      else setProblem((await res.json()).error ?? 'Couldn’t open the voice lab.');
    })();
  }, [user]);

  async function listen(s: Setting) {
    setBusy(s.name);
    setProblem('');
    try {
      const token = (await supabase?.auth.getSession())?.data.session?.access_token;
      const res = await fetch('/api/voice-lab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ text, voice: s.voice, rate: s.rate, pitch: s.pitch, clean: s.clean }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => null))?.error ?? 'Speech failed.');
      const audio = new Audio(URL.createObjectURL(await res.blob()));
      await audio.play();
    } catch (e) {
      setProblem(e instanceof Error ? e.message : 'Speech failed.');
    } finally {
      setBusy(null);
    }
  }

  if (loading) return <main className="container stats-page" />;
  if (!user)
    return (
      <main className="container stats-page">
        <h1 className="h2">Voice lab</h1>
        <p className="lead">
          <Link href="/login?next=/voice-lab">Log in</Link> with a team account.
        </p>
      </main>
    );

  const row = (s: Setting, editable = false) => (
    <li key={s.name} className={`vl-row${pick?.name === s.name ? ' picked' : ''}`}>
      <div className="vl-name">
        <strong>{s.name}</strong>
        <small>
          {s.voice === 'ameha' ? 'Ameha (male)' : 'Mekdes (female)'} · speed {s.rate}% · pitch {s.pitch}% ·{' '}
          {s.clean ? 'tidied punctuation' : 'raw text'}
        </small>
        {editable && (
          <div className="vl-controls">
            <label>
              Voice{' '}
              <select value={custom.voice} onChange={e => setCustom({ ...custom, voice: e.target.value as Setting['voice'] })}>
                <option value="ameha">Ameha</option>
                <option value="mekdes">Mekdes</option>
              </select>
            </label>
            <label>
              Speed {custom.rate}%
              <input type="range" min={-30} max={20} value={custom.rate} onChange={e => setCustom({ ...custom, rate: Number(e.target.value) })} />
            </label>
            <label>
              Pitch {custom.pitch}%
              <input type="range" min={-20} max={20} value={custom.pitch} onChange={e => setCustom({ ...custom, pitch: Number(e.target.value) })} />
            </label>
            <label>
              <input type="checkbox" checked={custom.clean} onChange={e => setCustom({ ...custom, clean: e.target.checked })} /> Tidy
              punctuation
            </label>
          </div>
        )}
      </div>
      <button type="button" className="btn btn-secondary" disabled={!!busy} onClick={() => void listen(s)}>
        {busy === s.name ? 'Loading…' : 'Listen'}
      </button>
      <button type="button" className="vl-pick" aria-pressed={pick?.name === s.name} onClick={() => setPick(s)}>
        {pick?.name === s.name ? 'Picked' : 'Sounds best'}
      </button>
    </li>
  );

  return (
    <main className="container stats-page vl-page">
      <h1 className="h2">Voice lab</h1>
      <p className="lead">Listen to the same line in each voice, and pick the one that sounds most like a real person.</p>
      {now && (
        <p className="faint">
          The site uses now: {now.voice === 'ameha' ? 'Ameha' : 'Mekdes'}, speed {now.rate}%, pitch {now.pitch}%,{' '}
          {now.clean ? 'tidied punctuation' : 'raw text'}.
        </p>
      )}
      <div className="vl-samples">
        {SAMPLES.map(s => (
          <button key={s} type="button" className={`vl-sample${s === text ? ' on' : ''}`} lang="am" onClick={() => setText(s)}>
            {s}
          </button>
        ))}
      </div>
      <label className="field">
        <span>Or type any Amharic</span>
        <input className="input" lang="am" value={text} onChange={e => setText(e.target.value)} maxLength={300} />
      </label>
      {problem && <p className="stats-error">{problem}</p>}
      <ul className="vl-list">
        {PRESETS.map(s => row(s))}
        {row(custom, true)}
      </ul>
      {pick && (
        <div className="vl-result">
          <p>
            <strong>To use “{pick.name}”</strong>, set these in Vercel → Settings → Environment Variables, then bump
            VOICE_VERSION in lib/voiceVersion.ts and redeploy:
          </p>
          <pre>
            {`AMHARIC_VOICE=${pick.voice}\nAMHARIC_RATE=${pick.rate}\nAMHARIC_PITCH=${pick.pitch}\nAMHARIC_CLEAN=${pick.clean ? 1 : 0}`}
          </pre>
          <p className="faint">
            If a word still sounds wrong, add a respelling for it in lib/speechFixes.ts and test it here.
          </p>
        </div>
      )}
    </main>
  );
}
