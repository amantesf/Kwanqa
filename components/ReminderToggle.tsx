'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

// Profile switches for reminder emails: streak reminders and holiday emails.
// Both are on unless the learner turned them off (here or from an email link).

type Settings = { enabled: boolean; holiday_emails: boolean };
type Field = keyof Settings;

const SWITCHES: { field: Field; title: string; detail: string }[] = [
  { field: 'enabled', title: 'Streak reminder emails', detail: 'An email at 7 pm if your streak is about to end.' },
  { field: 'holiday_emails', title: 'Holiday emails', detail: 'A greeting at 9 am on Ethiopian holidays, with a holiday lesson.' },
];

export default function ReminderToggle({ userId }: { userId: string }) {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [holidaysReady, setHolidaysReady] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!supabase) return;
      let { data, error } = await supabase
        .from('reminders')
        .select('enabled, holiday_emails')
        .eq('user_id', userId)
        .maybeSingle();
      if (error) {
        // The holiday column may not exist yet; streak reminders still work.
        const fallback = await supabase.from('reminders').select('enabled').eq('user_id', userId).maybeSingle();
        if (fallback.error) return;
        if (!cancelled) setHolidaysReady(false);
        data = fallback.data ? { ...fallback.data, holiday_emails: true } : null;
        error = null;
      }
      if (!cancelled) setSettings({ enabled: data?.enabled ?? true, holiday_emails: data?.holiday_emails ?? true });
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  async function toggle(field: Field, next: boolean) {
    setSettings(s => (s ? { ...s, [field]: next } : s));
    const { error } = await supabase!
      .from('reminders')
      .upsert({ user_id: userId, [field]: next, updated_at: new Date().toISOString() });
    if (error) setSettings(s => (s ? { ...s, [field]: !next } : s));
  }

  if (!settings) return null; // still loading, or reminders aren't set up yet

  return (
    <>
      {SWITCHES.filter(s => s.field !== 'holiday_emails' || holidaysReady).map(s => (
        <label key={s.field} className="toggle reminder-toggle">
          <input type="checkbox" checked={settings[s.field]} onChange={e => toggle(s.field, e.target.checked)} />
          <span>
            <strong>{s.title}</strong>
            <span className="faint small">{s.detail}</span>
          </span>
        </label>
      ))}
    </>
  );
}
