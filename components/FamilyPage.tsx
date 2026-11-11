'use client';

// /family: parents and kids learn together. Start a family and share its
// code, or join one; then see everyone's day and the family streak, which
// grows on days when everyone practised (lib/family.ts, supabase/family.sql).

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import LearnSidebar from '@/components/LearnSidebar';
import { displayName, useAuth } from '@/components/AuthProvider';
import { dateKey, useClimb } from '@/lib/climb';
import {
  FAMILY_MAX,
  cleanCode,
  createFamily,
  familyStreak,
  joinFamily,
  leaveFamily,
  loadFamily,
  type Family,
  type FamilyMember,
} from '@/lib/family';
import { useProfile } from '@/lib/profile';

function Flame({ lit }: { lit: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="44" height="44" aria-hidden="true">
      <path
        d="M12 2.5c1 3.2 4.8 5 4.8 9.6a4.8 4.8 0 0 1-9.6 0c0-2 1-3.4 2-4.3.2 1.6 1 2.5 2 2.8-.6-2.6-.2-5.4.8-8.1Z"
        fill={lit ? '#f5821f' : 'var(--border)'}
      />
      <path d="M12 21.5a3 3 0 0 1-3-3c0-1.8 1.6-2.6 2.2-4 .9 1.4 3.8 2.2 3.8 4a3 3 0 0 1-3 3Z" fill={lit ? '#ffd23f' : 'var(--bg-soft)'} />
    </svg>
  );
}

function Start({ name, onDone }: { name: string; onDone: () => void }) {
  const params = useSearchParams();
  const [mode, setMode] = useState<'start' | 'join'>(params.get('code') ? 'join' : 'start');
  const [familyName, setFamilyName] = useState('');
  const [code, setCode] = useState(cleanCode(params.get('code') ?? ''));
  const [me, setMe] = useState(name);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const problem =
      mode === 'start' ? (await createFamily(familyName, me)).error : await joinFamily(code, me);
    setBusy(false);
    if (problem) setError(problem);
    else onDone();
  }

  return (
    <>
      <header className="fam-head">
        <h1>Learn together</h1>
        <p className="lead">
          Start a family, share the code with your kids or parents, and keep a family streak going. It grows on days
          when everyone practises.
        </p>
      </header>
      <div className="fam-tabs" role="tablist">
        <button type="button" role="tab" aria-selected={mode === 'start'} onClick={() => setMode('start')}>
          Start a family
        </button>
        <button type="button" role="tab" aria-selected={mode === 'join'} onClick={() => setMode('join')}>
          Join with a code
        </button>
      </div>
      <form className="fam-card fam-form" onSubmit={submit}>
        {mode === 'start' ? (
          <label className="field">
            <span>Family name</span>
            <input
              className="input"
              value={familyName}
              onChange={e => setFamilyName(e.target.value)}
              placeholder="The Bekele family"
              maxLength={40}
              required
            />
          </label>
        ) : (
          <label className="field">
            <span>Family code</span>
            <input
              className="input fam-code-input"
              value={code}
              onChange={e => setCode(cleanCode(e.target.value))}
              placeholder="ABC234"
              autoCapitalize="characters"
              autoComplete="off"
              inputMode="text"
              required
              minLength={6}
            />
          </label>
        )}
        <label className="field">
          <span>Your name in the family</span>
          <input className="input" value={me} onChange={e => setMe(e.target.value)} placeholder="Mom, Abel, Ayat…" maxLength={40} required />
        </label>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="btn" disabled={busy}>
          {busy ? 'One moment…' : mode === 'start' ? 'Start our family' : 'Join the family'}
        </button>
        <p className="fam-fine">
          Each person uses their own kwanqa account. Family members see each other’s first name and which days they
          practised, nothing else.
        </p>
      </form>
    </>
  );
}

function MemberRow({ member, own, today }: { member: FamilyMember; own: number; today: string }) {
  const done = member.days.includes(today);
  return (
    <li className={`fam-member${done ? ' done' : ''}`}>
      <span className="fam-avatar" aria-hidden="true">
        {member.name.trim().charAt(0).toUpperCase()}
      </span>
      <span className="fam-member-name">
        <strong>
          {member.name}
          {member.me && <small> (you)</small>}
        </strong>
        <span>
          {own > 0 ? `${own}-day streak` : 'No streak yet'} · {member.lessons} {member.lessons === 1 ? 'lesson' : 'lessons'}
        </span>
      </span>
      <span className={`fam-today${done ? ' done' : ''}`}>{done ? 'Done today' : 'Not yet today'}</span>
    </li>
  );
}

function FamilyView({ family, onLeft }: { family: Family; onLeft: () => void }) {
  const climb = useClimb();
  const track = useProfile()?.track ?? 'amharic';
  const [copied, setCopied] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const today = dateKey();
  // your own days straight from this device, so a lesson you just finished counts at once
  const members = useMemo(
    () => family.members.map(m => (m.me ? { ...m, days: [...new Set([...m.days, ...climb.days])] } : m)),
    [family.members, climb.days],
  );
  const streak = familyStreak(members);
  const link = typeof window !== 'undefined' ? `${window.location.origin}/family?code=${family.code}` : '';
  const meDone = members.find(m => m.me)?.days.includes(today);

  async function share() {
    const text = `Learn Amharic with me on kwanqa! Join our family with the code ${family.code}: ${link}`;
    try {
      if (navigator.share) await navigator.share({ title: 'Join our kwanqa family', text, url: link });
      else {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // the share sheet was closed
    }
  }

  return (
    <>
      <header className="fam-head">
        <h1>{family.name}</h1>
      </header>

      <section className={`fam-card fam-streak${streak.doneToday ? ' lit' : ''}`} aria-label="Family streak">
        <Flame lit={streak.count > 0 || streak.doneToday} />
        <div className="fam-streak-text">
          <p className="fam-streak-count">
            <strong>{streak.count}</strong> {streak.count === 1 ? 'day' : 'days'} together
          </p>
          <p className="fam-streak-status">
            {members.length === 1
              ? 'Share the code below so your family can join.'
              : streak.doneToday
                ? 'Everyone practised today. ጎበዞች!'
                : `Waiting on ${streak.waitingOn.map(m => (m.me ? 'you' : m.name)).join(', ')} today.`}
          </p>
        </div>
        <ol className="fam-week" aria-label="This week">
          {streak.week.map(d => (
            <li key={d.key} className={`${d.done ? 'done' : ''}${d.today ? ' today' : ''}${d.future ? ' future' : ''}`}>
              <span>{d.label}</span>
            </li>
          ))}
        </ol>
      </section>

      {!meDone && (
        <Link href={`/courses?track=${track}`} className="btn fam-go">
          Do today’s lesson
        </Link>
      )}

      <section className="fam-card">
        <h2>
          Family · {members.length} of {FAMILY_MAX}
        </h2>
        <ul className="fam-members">
          {members.map((m, i) => (
            <MemberRow key={`${m.name}-${i}`} member={m} own={streak.own(m)} today={today} />
          ))}
        </ul>
      </section>

      {members.length < FAMILY_MAX && (
        <section className="fam-card fam-invite">
          <h2>Invite your family</h2>
          <p className="muted">They make their own account, then join with this code:</p>
          <p className="fam-code" aria-label={`Family code ${family.code.split('').join(' ')}`}>
            {family.code}
          </p>
          <button type="button" className="btn btn-secondary" onClick={() => void share()}>
            {copied ? 'Copied!' : 'Share the invite'}
          </button>
        </section>
      )}

      <button
        type="button"
        className="fam-leave"
        disabled={leaving}
        onClick={async () => {
          if (!window.confirm('Leave this family? Your own progress stays, but you’ll leave the family streak.')) return;
          setLeaving(true);
          const problem = await leaveFamily();
          setLeaving(false);
          if (problem) window.alert(problem);
          else onLeft();
        }}
      >
        Leave the family
      </button>
    </>
  );
}

function FamilyBody() {
  const { user, loading, enabled } = useAuth();
  const [state, setState] = useState<{ family: Family | null; error: string | null } | null>(null);

  const refresh = useCallback(() => {
    void loadFamily().then(setState);
  }, []);

  useEffect(() => {
    if (user) refresh();
  }, [user, refresh]);

  if (!enabled) return <p className="muted">Family mode needs accounts, which aren’t set up here.</p>;
  if (loading) return null;
  if (!user)
    return (
      <>
        <header className="fam-head">
          <h1>Learn together</h1>
          <p className="lead">Parents and kids keep a family streak going, each with their own account.</p>
        </header>
        <Link href="/signup?next=/family" className="btn">
          Create an account
        </Link>
        <p className="muted">
          Already have one?{' '}
          <Link href="/login?next=/family" className="text-link">
            Log in
          </Link>
        </p>
      </>
    );
  if (!state) return <p className="muted">Loading your family…</p>;
  if (state.error && !state.family) return <p className="form-error">{state.error}</p>;
  // the first name on the account, not the email address
  const name = user.user_metadata?.name || user.user_metadata?.full_name ? displayName(user) : '';
  return state.family ? <FamilyView family={state.family} onLeft={refresh} /> : <Start name={name} onDone={refresh} />;
}

export default function FamilyPage() {
  const track = useProfile()?.track ?? 'amharic';
  return (
    <div className="learn-app">
      <LearnSidebar active="family" track={track} />
      <main className="learn-main fam-page">
        <FamilyBody />
      </main>
    </div>
  );
}
