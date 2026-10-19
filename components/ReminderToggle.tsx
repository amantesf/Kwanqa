'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

// Profile switch for streak reminder emails. They're on unless the learner has
// turned them off (here or with the link in an email).
export default function ReminderToggle({ userId }: { userId: string }) {
  const [enabled, setEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    supabase
      ?.from('reminders')
      .select('enabled')
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!cancelled && !error) setEnabled(data?.enabled ?? true);
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  async function toggle(next: boolean) {
    setEnabled(next);
    const { error } = await supabase!
      .from('reminders')
      .upsert({ user_id: userId, enabled: next, updated_at: new Date().toISOString() });
    if (error) setEnabled(!next);
  }

  if (enabled === null) return null; // still loading, or reminders aren't set up yet

  return (
    <label className="toggle reminder-toggle">
      <input type="checkbox" checked={enabled} onChange={e => toggle(e.target.checked)} />
      <span>
        <strong>Streak reminder emails</strong>
        <span className="faint small">An email at 7 pm if your streak is about to end.</span>
      </span>
    </label>
  );
}
