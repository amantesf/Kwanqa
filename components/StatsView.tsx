'use client';

// /stats: how kwanqa is doing, for the team. The numbers come from
// /api/stats (supabase/events.sql), which only answers accounts listed in
// STATS_EMAILS.

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/lib/supabase';
import { courseCatalog, courseContent } from '@/lib/courses';

type Stats = {
  days: number;
  learners: { today: number; last_7_days: number; in_period: number; with_account: number; on_app: number };
  lessons: { started: number; finished: number; quit: number; reviews_finished: number; learners_who_finished_one: number };
  coming_back: {
    new_learners: number;
    came_back_next_day: number;
    new_learners_a_week_ago: number;
    came_back_within_a_week: number;
  };
  by_day: { day: string; learners: number; started: number; finished: number }[];
  by_lesson: {
    track: string;
    camp: string;
    lesson: number;
    started: number;
    finished: number;
    quit: number;
    answered_before_quitting: number | null;
  }[];
};

const PERIODS = [7, 30, 90];

/** "12 of 40 (30%)", or a dash when there's nothing to divide by yet. */
function share(part: number, whole: number) {
  return whole ? `${Math.round((part / whole) * 100)}%` : '–';
}

function lessonName(camp: string, lesson: number) {
  const course = courseCatalog.find(c => c.slug === camp);
  const title = courseContent[camp]?.sections[lesson]?.title?.replace(/^Lesson \d+\s*[–-]\s*/, '');
  const where = course ? `${course.track === 'english' ? 'English' : 'Amharic'} camp ${course.part}` : camp;
  return `${where} · lesson ${lesson + 1}${title ? `: ${title}` : ''}`;
}

function Stat({ value, label, note }: { value: string | number; label: string; note?: string }) {
  return (
    <div className="stats-card">
      <span className="stats-value">{value}</span>
      <span className="stats-label">{label}</span>
      {note && <span className="stats-note">{note}</span>}
    </div>
  );
}

export default function StatsView() {
  const { user, loading } = useAuth();
  const [days, setDays] = useState(30);
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    let alive = true;
    (async () => {
      const token = (await supabase?.auth.getSession())?.data.session?.access_token;
      try {
        const res = await fetch(`/api/stats?days=${days}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
        const body = await res.json();
        if (!alive) return;
        if (res.ok) {
          setStats(body);
          setError('');
        } else setError(body.error ?? 'Couldn’t load the numbers.');
      } catch {
        if (alive) setError('Couldn’t load the numbers. Are you online?');
      }
    })();
    return () => {
      alive = false;
    };
  }, [user, days]);

  if (loading) return <main className="container stats-page" />;
  if (!user) {
    return (
      <main className="container stats-page">
        <h1 className="h2">kwanqa numbers</h1>
        <p className="lead">
          <Link href="/login?next=/stats">Log in</Link> with a team account to see them.
        </p>
      </main>
    );
  }

  const s = stats;
  const busiest = Math.max(1, ...(s?.by_day.map(d => d.learners) ?? [1]));
  // the lessons people leave most: at least 3 starts, sorted by finish rate
  const lessons = [...(s?.by_lesson ?? [])].sort((a, b) =>
    a.track === b.track ? a.camp.localeCompare(b.camp, undefined, { numeric: true }) || a.lesson - b.lesson : a.track.localeCompare(b.track),
  );
  const hardest = (s?.by_lesson ?? [])
    .filter(l => l.started >= 3)
    .sort((a, b) => a.finished / a.started - b.finished / b.started)
    .slice(0, 3);

  return (
    <main className="container stats-page">
      <div className="stats-head">
        <div>
          <h1 className="h2">kwanqa numbers</h1>
          <p className="faint">Everyone who uses the site, with or without an account. Days are in UTC.</p>
        </div>
        <div className="stats-periods" role="group" aria-label="Period">
          {PERIODS.map(p => (
            <button
              key={p}
              type="button"
              className={`stats-period${p === days ? ' active' : ''}`}
              aria-pressed={p === days}
              onClick={() => setDays(p)}
            >
              {p} days
            </button>
          ))}
        </div>
      </div>

      {error && <p className="stats-error">{error}</p>}
      {!s && !error && <p className="faint">Loading…</p>}

      {s && (
        <>
          <h2 className="stats-title">Learners</h2>
          <div className="stats-grid">
            <Stat value={s.learners.today} label="today" />
            <Stat value={s.learners.last_7_days} label="last 7 days" />
            <Stat value={s.learners.in_period} label={`last ${s.days} days`} />
            <Stat
              value={s.learners.with_account}
              label="with an account"
              note={`${share(s.learners.with_account, s.learners.in_period)} of learners`}
            />
          </div>

          <h2 className="stats-title">Do they come back?</h2>
          <div className="stats-grid">
            <Stat
              value={share(s.coming_back.came_back_next_day, s.coming_back.new_learners)}
              label="came back the next day"
              note={`${s.coming_back.came_back_next_day} of ${s.coming_back.new_learners} new learners`}
            />
            <Stat
              value={share(s.coming_back.came_back_within_a_week, s.coming_back.new_learners_a_week_ago)}
              label="came back within a week"
              note={`${s.coming_back.came_back_within_a_week} of ${s.coming_back.new_learners_a_week_ago} who started over a week ago`}
            />
          </div>

          <h2 className="stats-title">Lessons</h2>
          <div className="stats-grid">
            <Stat value={s.lessons.started} label="started" />
            <Stat value={s.lessons.finished} label="finished" note={`${share(s.lessons.finished, s.lessons.started)} of the ones started`} />
            <Stat value={s.lessons.quit} label="left early" note="pressed ✕ before the end" />
            <Stat
              value={s.lessons.learners_who_finished_one}
              label="learners finished one"
              note={`${share(s.lessons.learners_who_finished_one, s.learners.in_period)} of learners`}
            />
          </div>

          <h2 className="stats-title">Learners each day</h2>
          <div className="stats-chart" role="img" aria-label="Learners each day">
            {s.by_day.map(d => (
              <div
                key={d.day}
                className="stats-bar"
                style={{ height: `${Math.max(2, (d.learners / busiest) * 100)}%` }}
                title={`${d.day}: ${d.learners} learners, ${d.started} lessons started, ${d.finished} finished`}
              />
            ))}
          </div>
          <div className="stats-chart-axis faint small">
            <span>{s.by_day[0]?.day}</span>
            <span>busiest day: {busiest} learners</span>
            <span>{s.by_day[s.by_day.length - 1]?.day}</span>
          </div>

          {hardest.length > 0 && (
            <>
              <h2 className="stats-title">Where people give up</h2>
              <ul className="stats-hardest">
                {hardest.map(l => (
                  <li key={`${l.camp}-${l.lesson}`}>
                    <strong>{lessonName(l.camp, l.lesson)}</strong>: {share(l.finished, l.started)} finish
                    {l.answered_before_quitting !== null && `, people who leave answered about ${Math.round(l.answered_before_quitting)} questions first`}
                  </li>
                ))}
              </ul>
            </>
          )}

          <h2 className="stats-title">Every lesson</h2>
          {lessons.length === 0 ? (
            <p className="faint">No lessons started yet in this period.</p>
          ) : (
            <div className="stats-table-wrap">
              <table className="stats-table">
                <thead>
                  <tr>
                    <th>Lesson</th>
                    <th>Started</th>
                    <th>Finished</th>
                    <th>Finish rate</th>
                    <th>Left early</th>
                  </tr>
                </thead>
                <tbody>
                  {lessons.map(l => (
                    <tr key={`${l.camp}-${l.lesson}`}>
                      <td>{lessonName(l.camp, l.lesson)}</td>
                      <td>{l.started}</td>
                      <td>{l.finished}</td>
                      <td>{share(l.finished, l.started)}</td>
                      <td>{l.quit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </main>
  );
}
