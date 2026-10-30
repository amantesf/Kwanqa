'use client';

import { useState, type FormEvent, type ReactNode } from 'react';
import Link from 'next/link';
import { displayName, useAuth } from '@/components/AuthProvider';
import Flag from '@/components/Flag';
import GrassIcon from '@/components/GrassIcon';
import Mascot from '@/components/Mascot';
import MountainScene from '@/components/MountainScene';
import { showToast } from '@/components/Toaster';
import LearnSidebar from '@/components/LearnSidebar';
import TopStats from '@/components/TopStats';
import ReminderToggle from '@/components/ReminderToggle';
import ThemeToggle from '@/components/ThemeToggle';
import {
  altitudeFor,
  climbStreak,
  hornLevel,
  isCallKey,
  trackCourses,
  trackTotals,
  useClimb,
  type Climb,
} from '@/lib/climb';
import { courseContent, type Track } from '@/lib/courses';
import { useProfile, type Profile } from '@/lib/profile';
import { supabase } from '@/lib/supabase';

const LANGUAGE: Record<string, string> = {
  amharic: 'Amharic',
  english: 'English',
  oromo: 'Afaan Oromo',
  tigrinya: 'Tigrinya',
  other: 'Another language',
};
const LEVEL: Record<Profile['level'], string> = {
  new: 'Brand new',
  'some-words': 'Knows some common words',
  basic: 'Basic conversations',
  conversational: 'Can talk about most topics',
};
const REASON: Record<string, string> = {
  family: 'Talk with family',
  heritage: 'Connect with heritage',
  travel: 'Travel to Ethiopia',
  work: 'Work or school',
  fun: 'Just for fun',
  other: 'Something else',
};
const GOAL: Record<number, string> = { 5: 'A stroll', 10: 'A hike', 15: 'A climb', 20: 'Summit push' };

function lessonsDone(climb: Climb) {
  return Object.entries(climb.completed)
    .filter(([key]) => !isCallKey(key))
    .reduce((sum, [, list]) => sum + list.length, 0);
}

function campsDone(climb: Climb) {
  return Object.entries(courseContent).filter(([slug, course]) =>
    course.sections.every((_, i) => climb.completed[slug]?.includes(i)),
  ).length;
}

function tracksDone(climb: Climb) {
  return (['amharic', 'english'] as Track[]).filter(track =>
    trackCourses(track).every(c =>
      (courseContent[c.slug]?.sections ?? []).every((_, i) => climb.completed[c.slug]?.includes(i)),
    ),
  ).length;
}

/** The longest run of consecutive practice days ever. */
function longestStreak(days: string[]) {
  const sorted = [...new Set(days)].sort();
  let best = 0;
  let run = 0;
  let prev: number | null = null;
  for (const day of sorted) {
    const [y, m, d] = day.split('-').map(Number);
    const t = Date.UTC(y, m - 1, d) / 86400000;
    run = prev !== null && t - prev === 1 ? run + 1 : 1;
    best = Math.max(best, run);
    prev = t;
  }
  return best;
}

function Stat({ icon, value, label }: { icon: ReactNode; value: ReactNode; label: string }) {
  return (
    <div className="pf-stat">
      <span className="pf-stat-icon">{icon}</span>
      <div>
        <div className="pf-stat-value">{value}</div>
        <div className="pf-stat-label">{label}</div>
      </div>
    </div>
  );
}

// White glyphs drawn on the coloured achievement badges.
const GLYPHS: Record<string, ReactNode> = {
  mountain: (
    <>
      <path d="M4 40 L18 14 L26 26 L31 19 L44 40 Z" fill="#fff" />
      <path d="M18 14 L22 21 L19.5 20 L16.5 22.5 Z" fill="currentColor" opacity="0.35" />
    </>
  ),
  grass: (
    <>
      <path d="M10 40 C 11 30, 13 24, 11 14 C 17 22, 18 30, 18 40 Z" fill="#fff" />
      <path d="M18 40 C 20 26, 22 18, 24 8 C 26 18, 28 26, 30 40 Z" fill="#fff" />
      <path d="M30 40 C 30 30, 32 22, 38 15 C 36 25, 37 31, 38 40 Z" fill="#fff" />
    </>
  ),
  boot: (
    <>
      <path d="M14 8 h12 v18 l12 5 a5 5 0 0 1 3 4.6 V40 H11 Z" fill="#fff" />
      <path d="M11 34 H41" stroke="currentColor" strokeWidth="3" opacity="0.35" />
    </>
  ),
  tent: (
    <>
      <path d="M24 8 L42 40 H6 Z" fill="#fff" />
      <path d="M24 22 L31 40 H17 Z" fill="currentColor" opacity="0.4" />
    </>
  ),
  horns: (
    <>
      <path d="M22 40 C 21 26, 15 14, 6 10 C 9 18, 12 28, 13 40 Z" fill="#fff" />
      <path d="M26 40 C 27 26, 33 14, 42 10 C 39 18, 36 28, 35 40 Z" fill="#fff" />
    </>
  ),
  flag: (
    <>
      <rect x="11" y="6" width="4" height="36" rx="2" fill="#fff" />
      <path d="M15 8 H39 L33 16 L39 24 H15 Z" fill="#fff" />
    </>
  ),
};

type Achievement = {
  title: string;
  color: string;
  glyph: keyof typeof GLYPHS;
  value: number;
  tiers: number[];
  describe: (goal: number) => string;
};

function AchievementRow({ a }: { a: Achievement }) {
  const reached = a.tiers.filter(t => a.value >= t).length;
  const maxed = reached === a.tiers.length;
  const goal = maxed ? a.tiers[a.tiers.length - 1] : a.tiers[reached];
  const pct = Math.min(1, a.value / goal);
  return (
    <div className="pf-ach">
      <div className="pf-badge" style={{ background: a.color, color: a.color }}>
        <svg viewBox="0 0 48 48" width="46" height="46" aria-hidden>
          {GLYPHS[a.glyph]}
        </svg>
        <span className="pf-badge-level">{maxed ? 'MAX' : `LEVEL ${reached + 1}`}</span>
      </div>
      <div className="pf-ach-body">
        <div className="pf-ach-top">
          <strong>{a.title}</strong>
          <span>
            {Math.min(a.value, goal)}/{goal}
          </span>
        </div>
        <div className="pf-ach-bar">
          <span style={{ width: `${pct * 100}%` }} />
        </div>
        <p>{maxed ? 'Completed every level!' : a.describe(goal)}</p>
      </div>
    </div>
  );
}

export default function ProfileView() {
  const { enabled, loading, user, signOut } = useAuth();
  const climb = useClimb();
  const profile = useProfile();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  if (enabled && loading) {
    return (
      <main className="section" style={{ paddingTop: 40 }}>
      <div className="container">
      <div className="gate">
        <Mascot pose="happy" size={100} />
        <p className="muted">Loading your profile…</p>
      </div>
      </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="section" style={{ paddingTop: 40 }}>
      <div className="container">
      <div className="gate">
        <Mascot pose="wave" size={120} />
        <h1 className="h3" style={{ fontSize: 26 }}>
          Create a profile to see your stats
        </h1>
        <p className="muted">
          Your profile keeps your grass, lessons, achievements, and Walia’s horns on any device.
        </p>
        {enabled ? (
          <div className="row" style={{ justifyContent: 'center' }}>
            <Link href="/signup?next=%2Fprofile" className="btn">
              Create a profile
            </Link>
            <Link href="/login?next=%2Fprofile" className="btn btn-secondary">
              Log in
            </Link>
          </div>
        ) : (
          <p className="faint small">Accounts aren’t set up yet.</p>
        )}
      </div>
      </div>
      </main>
    );
  }

  const horns = hornLevel(climb.grass);
  const lessons = lessonsDone(climb);
  const camps = campsDone(climb);
  const summits = tracksDone(climb);
  const highestAltitude = Math.max(
    ...(['amharic', 'english'] as Track[]).map(t => {
      const { done, total } = trackTotals(climb, t);
      return altitudeFor(done, total);
    }),
  );
  const joined = user.created_at
    ? new Date(user.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
    : null;

  const track: Track = profile?.track ?? 'amharic';
  const streak = climbStreak(climb.days).count;
  const best = longestStreak(climb.days);
  const totalLessons = (['amharic', 'english'] as Track[]).reduce((n, t) => n + trackTotals(climb, t).total, 0);

  const achievements: Achievement[] = [
    {
      title: 'Steady climber',
      color: '#ff6b4a',
      glyph: 'mountain',
      value: best,
      tiers: [3, 7, 14, 30, 60],
      describe: g => `Reach a ${g} day climb streak`,
    },
    {
      title: 'Trailblazer',
      color: '#b06cf2',
      glyph: 'boot',
      value: lessons,
      tiers: [1, 5, 15, 30, totalLessons].filter((t, i, all) => all.indexOf(t) === i).sort((a, b) => a - b),
      describe: g => (g === 1 ? 'Complete your first lesson' : `Complete ${g} lessons`),
    },
    {
      title: 'Grass grazer',
      color: '#4fc23a',
      glyph: 'grass',
      value: climb.grass,
      tiers: [50, 150, 300, 600, 1000],
      describe: g => `Collect ${g} grass`,
    },
    {
      title: 'Camp conqueror',
      color: '#1f5bd0',
      glyph: 'tent',
      value: camps,
      tiers: [1, 3, 6],
      describe: g => (g === 1 ? 'Finish every lesson in a camp' : `Finish ${g} camps`),
    },
    {
      title: 'Ridge grower',
      color: '#e0a000',
      glyph: 'horns',
      value: horns.level,
      tiers: [2, 3, 4, 5],
      describe: g => `Grow Walia’s horns to level ${g}`,
    },
    {
      title: 'Summit',
      color: '#d2582e',
      glyph: 'flag',
      value: summits,
      tiers: [1, 2],
      describe: g => (g === 1 ? 'Finish a whole track and reach ራስ ዳሽን' : 'Reach the summit of both tracks'),
    },
  ];
  const fullName = (user.user_metadata?.name as string) || displayName(user);

  async function invite() {
    const url = 'https://kwanqa.vercel.app';
    const text = 'Learn Amharic with me on Kwanqa, climbing the Simien Mountains with Walia!';
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Kwanqa', text, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      showToast('Link copied! Send it to a friend.');
    } catch {
      // the learner closed the share sheet; nothing to do
    }
  }

  async function saveName(e: FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || !supabase) return;
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ data: { name: trimmed } });
    setSaving(false);
    if (error) return showToast('Couldn’t save your name. Please try again.', 'bad');
    setEditing(false);
    showToast('Name updated!');
  }

  return (
    <div className="learn-app">
      <LearnSidebar active="profile" track={track} />

      <div className="learn-main pf-main">
        {/* Banner: a big avatar on a mountain backdrop */}
        <section className="pf-banner">
          <MountainScene className="pf-banner-art" />
          <div className="pf-avatar">{fullName.charAt(0).toUpperCase()}</div>
          <div className="pf-banner-walia" aria-hidden>
            <Mascot pose="wave" size={110} hornScale={horns.scale} animated />
          </div>
          <button
            type="button"
            className="pf-edit"
            onClick={() => {
              setName((user.user_metadata?.name as string) || '');
              setEditing(true);
            }}
            aria-label="Edit name"
            title="Edit name"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M4 20h4L19 9l-4-4L4 16z" />
              <path d="M13.5 6.5l4 4" />
            </svg>
          </button>
        </section>

        <section className="pf-id">
          <div>
            {editing ? (
              <form className="profile-name-form" onSubmit={saveName}>
                <input
                  className="input"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  maxLength={60}
                  autoFocus
                  aria-label="Your name"
                />
                <button type="submit" className="btn btn-sm" disabled={saving}>
                  {saving ? 'Saving…' : 'Save'}
                </button>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditing(false)}>
                  Cancel
                </button>
              </form>
            ) : (
              <h1 className="pf-name">{fullName}</h1>
            )}
            <p className="pf-handle">{user.email}</p>
            {joined && <p className="pf-joined">Joined {joined}</p>}
          </div>
          {profile && (
            <span className="pf-learning" title={`Learning ${LANGUAGE[profile.track]}`}>
              <Flag name={profile.track === 'amharic' ? 'ethiopia' : 'usa'} className="profile-flag" />
            </span>
          )}
        </section>

        <section>
          <h2 className="pf-title">Statistics</h2>
          <div className="pf-stats">
            <Stat
              icon={
                <svg width="32" height="32" viewBox="0 0 24 24" aria-hidden>
                  <path d="M2 20 L9 8 L13 14 L16 10 L22 20 Z" fill={streak ? 'var(--primary)' : '#d6d0ca'} />
                  <path d="M9 8 L11 11.5 L9.8 11 L8.3 12 Z" fill="rgba(0,0,0,0.22)" />
                </svg>
              }
              value={streak}
              label="Day climb streak"
            />
            <Stat icon={<GrassIcon size={32} />} value={climb.grass} label="Total grass" />
            <Stat
              icon={
                <svg width="32" height="32" viewBox="0 0 24 24" aria-hidden>
                  <path d="M12 3 L21 20 H3 Z" fill="#c98b68" />
                  <path d="M12 3 L15 8.6 L13 8 L11.6 9.4 L10.4 8.2 L9 8.6 Z" fill="#8f5a40" />
                  <rect x="11.2" y="1" width="1.6" height="5" fill="#5c3a24" />
                  <path d="M12.8 1.2 L17 2.4 L12.8 3.8 Z" fill="var(--primary)" />
                </svg>
              }
              value={`${highestAltitude.toLocaleString()} m`}
              label="Highest altitude"
            />
            <Stat
              icon={
                <svg width="32" height="32" viewBox="0 0 24 24" aria-hidden>
                  <circle cx="12" cy="12" r="10" fill="var(--green)" />
                  <path d="M7 12.5 L10.5 16 L17 8.5" stroke="#fff" strokeWidth="2.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              }
              value={lessons}
              label="Lessons completed"
            />
          </div>
        </section>

        <section>
          <h2 className="pf-title">Achievements</h2>
          <div className="pf-achs">
            {achievements.map(a => (
              <AchievementRow key={a.title} a={a} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="pf-title">Your learning</h2>
          <div className="pf-card profile-facts">
            {profile ? (
              <dl>
                <div>
                  <dt>Learning</dt>
                  <dd>{LANGUAGE[profile.track]}</dd>
                </div>
                <div>
                  <dt>Speaks</dt>
                  <dd>{profile.speaks.map(sp => LANGUAGE[sp] ?? sp).join(', ') || 'Not answered'}</dd>
                </div>
                <div>
                  <dt>Starting level</dt>
                  <dd>{LEVEL[profile.level]}</dd>
                </div>
                <div>
                  <dt>Why</dt>
                  <dd>{profile.reasons.map(r => REASON[r] ?? r).join(', ') || 'Not answered'}</dd>
                </div>
                <div>
                  <dt>Daily goal</dt>
                  <dd>
                    {GOAL[profile.dailyMinutes] ?? 'Custom'} · {profile.dailyMinutes} min / day
                  </dd>
                </div>
              </dl>
            ) : (
              <p className="muted">You haven’t taken the Get started survey yet.</p>
            )}
            <Link
              href={profile ? `/welcome?track=${profile.track}` : '/welcome'}
              className="btn btn-secondary btn-sm"
            >
              {profile ? 'Retake survey' : 'Take the survey'}
            </Link>
          </div>
        </section>

        <section>
          <h2 className="pf-title">Settings</h2>
          <div className="pf-card profile-settings">
            <ThemeToggle />
          </div>
        </section>

        <section>
          <h2 className="pf-title">Account</h2>
          <div className="pf-card profile-account">
            <div>
              <strong>{user.email}</strong>
              <p className="faint small">Your progress is saved to this account.</p>
            </div>
            <button type="button" className="btn btn-secondary btn-sm" onClick={signOut}>
              Log out
            </button>
            <ReminderToggle userId={user.id} />
          </div>
          <Link href="/delete-account" className="delete-link">
            Delete account
          </Link>
        </section>
      </div>

      {/* Right column: stats on top, then cards */}
      <aside className="learn-rail pf-rail" aria-label="More">
        <TopStats track={track} />

        <div className="rail-card pf-invite">
          <div className="pf-invite-art" aria-hidden>
            <Mascot pose="cheer" size={86} hornScale={horns.scale} animated />
          </div>
          <h3 className="rail-title">Climbing is more fun together</h3>
          <p className="small muted">Invite a friend or a cousin to learn with you. Walia loves company!</p>
          <button type="button" className="btn btn-secondary" onClick={invite}>
            Invite friends
          </button>
        </div>

        <div className="rail-card">
          <div className="rail-card-head">
            <h3 className="rail-title">Walia’s horns</h3>
            <span className="kicker">
              Level {horns.level} of {horns.max}
            </span>
          </div>
          <p className="small muted">
            {horns.next === null
              ? 'Walia’s horns are fully grown. You’re a true mountain ibex!'
              : `Collect ${horns.next - climb.grass} more grass to grow a new ridge.`}
          </p>
        </div>
      </aside>
    </div>
  );
}
