'use client';

import { useState, type FormEvent, type ReactNode } from 'react';
import Link from 'next/link';
import { displayName, useAuth } from '@/components/AuthProvider';
import Flag from '@/components/Flag';
import GrassIcon from '@/components/GrassIcon';
import Mascot from '@/components/Mascot';
import { showToast } from '@/components/Toaster';
import { altitudeFor, hornLevel, trackCourses, trackTotals, useClimb, type Climb } from '@/lib/climb';
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
const GOAL: Record<number, string> = { 5: 'Casual', 10: 'Regular', 15: 'Serious', 20: 'Intense' };

function lessonsDone(climb: Climb) {
  return Object.values(climb.completed).reduce((sum, list) => sum + list.length, 0);
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

function Stat({ icon, value, label }: { icon: ReactNode; value: ReactNode; label: string }) {
  return (
    <div className="stat-card">
      <span className="stat-icon">{icon}</span>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
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
      <div className="gate">
        <Mascot pose="happy" size={100} />
        <p className="muted">Loading your profile…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="gate">
        <Mascot pose="wave" size={120} />
        <h1 className="h3" style={{ fontSize: 26 }}>
          Create a profile to see your stats
        </h1>
        <p className="muted">
          Your profile keeps your grass, lessons, achievements, and Walia’s horns—on any device.
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

  const achievements = [
    { title: 'First step', body: 'Complete your first lesson', value: lessons, goal: 1, icon: '🥾' },
    { title: 'Trailblazer', body: 'Complete 5 lessons', value: lessons, goal: 5, icon: '🧭' },
    { title: 'Camp conqueror', body: 'Finish every lesson in a camp', value: camps, goal: 1, icon: '⛺' },
    { title: 'Grass grazer', body: 'Collect 50 grass', value: climb.grass, goal: 50, icon: '🌱' },
    { title: 'Ridge grower', body: 'Grow Walia’s horns to level 3', value: horns.level, goal: 3, icon: '🐐' },
    { title: 'Summit', body: 'Finish a whole track and reach ራስ ዳሽን', value: summits, goal: 1, icon: '🏔️' },
  ];

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
    <div className="profile">
      {/* Header */}
      <section className="profile-head">
        <div className="profile-avatar">{displayName(user).charAt(0).toUpperCase()}</div>
        <div className="profile-id">
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
            <h1 className="profile-name">
              {(user.user_metadata?.name as string) || displayName(user)}
              <button
                type="button"
                className="profile-edit"
                onClick={() => {
                  setName((user.user_metadata?.name as string) || '');
                  setEditing(true);
                }}
                aria-label="Edit name"
                title="Edit name"
              >
                ✎
              </button>
            </h1>
          )}
          <p className="muted small">{user.email}</p>
          {joined && <p className="faint small">Joined {joined}</p>}
          {profile && (
            <div className="profile-learning">
              <Flag name={profile.track === 'amharic' ? 'ethiopia' : 'usa'} className="profile-flag" />
              <span className="small">Learning {LANGUAGE[profile.track]}</span>
            </div>
          )}
        </div>
        <div className="profile-walia" aria-hidden>
          <Mascot pose="wave" size={120} hornScale={horns.scale} />
        </div>
      </section>

      {/* Statistics */}
      <section>
        <h2 className="profile-section-title">Statistics</h2>
        <div className="stat-grid">
          <Stat icon={<GrassIcon size={30} />} value={climb.grass} label="Total grass" />
          <Stat icon={<span className="stat-emoji">✅</span>} value={lessons} label="Lessons completed" />
          <Stat
            icon={<span className="stat-emoji">⛰️</span>}
            value={`${highestAltitude.toLocaleString()} m`}
            label="Highest altitude"
          />
          <Stat
            icon={<Mascot pose="happy" size={30} hornScale={horns.scale} />}
            value={`${horns.level} / ${horns.max}`}
            label="Horn level"
          />
        </div>
      </section>

      {/* Achievements */}
      <section>
        <h2 className="profile-section-title">Achievements</h2>
        <div className="achievements">
          {achievements.map(a => {
            const earned = a.value >= a.goal;
            const pct = Math.min(1, a.value / a.goal);
            return (
              <div key={a.title} className={`achievement${earned ? ' earned' : ''}`}>
                <span className="achievement-icon">{a.icon}</span>
                <div className="achievement-body">
                  <div className="achievement-top">
                    <strong>{a.title}</strong>
                    <span className="faint small">
                      {Math.min(a.value, a.goal)} / {a.goal}
                    </span>
                  </div>
                  <div className="meter achievement-meter">
                    <span style={{ width: `${pct * 100}%` }} />
                  </div>
                  <span className="muted small">{earned ? 'Earned!' : a.body}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Survey answers */}
      <section>
        <h2 className="profile-section-title">Your learning</h2>
        <div className="card profile-facts">
          {profile ? (
            <dl>
              <div>
                <dt>Learning</dt>
                <dd>{LANGUAGE[profile.track]}</dd>
              </div>
              <div>
                <dt>Speaks</dt>
                <dd>{profile.speaks.map(s => LANGUAGE[s] ?? s).join(', ') || '—'}</dd>
              </div>
              <div>
                <dt>Starting level</dt>
                <dd>{LEVEL[profile.level]}</dd>
              </div>
              <div>
                <dt>Why</dt>
                <dd>{profile.reasons.map(r => REASON[r] ?? r).join(', ') || '—'}</dd>
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
          <Link href={profile ? `/welcome?track=${profile.track}` : '/welcome'} className="btn btn-secondary btn-sm">
            {profile ? 'Retake survey' : 'Take the survey'}
          </Link>
        </div>
      </section>

      {/* Account */}
      <section>
        <h2 className="profile-section-title">Account</h2>
        <div className="card profile-account">
          <div>
            <strong>{user.email}</strong>
            <p className="faint small">Your progress is saved to this account.</p>
          </div>
          <button type="button" className="btn btn-secondary btn-sm" onClick={signOut}>
            Log out
          </button>
        </div>
      </section>
    </div>
  );
}
