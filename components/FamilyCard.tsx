'use client';

// The Family card on the profile page: your family streak at a glance and a
// way into /family, or an invitation to start one (lib/family.ts).

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useClimb } from '@/lib/climb';
import { familyStreak, loadFamily, type Family } from '@/lib/family';

export default function FamilyCard() {
  const climb = useClimb();
  const [family, setFamily] = useState<Family | null | undefined>(undefined);

  useEffect(() => {
    let alive = true;
    void loadFamily().then(r => alive && setFamily(r.error ? null : r.family));
    return () => {
      alive = false;
    };
  }, []);

  // your own lessons from this device count straight away
  const members = useMemo(
    () => family?.members.map(m => (m.me ? { ...m, days: [...new Set([...m.days, ...climb.days])] } : m)) ?? [],
    [family, climb.days],
  );

  if (family === undefined) return <div className="pf-card fam-pf" aria-busy="true" />;

  if (!family)
    return (
      <div className="pf-card fam-pf">
        <div>
          <strong>Learn together</strong>
          <p className="faint small">Start a family or join with a code, and keep a family streak going.</p>
        </div>
        <Link href="/family" className="btn btn-secondary btn-sm">
          Start or join
        </Link>
      </div>
    );

  const streak = familyStreak(members);
  const status =
    members.length === 1
      ? 'Invite your family with the code'
      : streak.doneToday
        ? 'Everyone practised today'
        : `Waiting on ${streak.waitingOn.map(m => (m.me ? 'you' : m.name)).join(', ')}`;
  return (
    <div className="pf-card fam-pf">
      <div>
        <strong>{family.name}</strong>
        <p className="faint small">
          <span className="fam-pf-streak">{streak.count}</span> {streak.count === 1 ? 'day' : 'days'} together ·{' '}
          {members.length} {members.length === 1 ? 'person' : 'people'} · {status}
        </p>
      </div>
      <Link href="/family" className="btn btn-secondary btn-sm">
        Open family
      </Link>
    </div>
  );
}
