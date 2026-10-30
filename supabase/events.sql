-- Learning activity, for the numbers on /stats. Run this once in the Supabase
-- SQL editor (Dashboard → SQL Editor → paste → Run). Safe to run more than once.
--
-- One row each time someone opens the site (once a day per device), starts a
-- lesson, finishes it, or leaves it early. "device" is a random id the browser
-- makes up and keeps, so learners without an account are counted too; no
-- names, emails or IP addresses are stored. Logged-in learners' rows also get
-- their account id, so we can tell how many learners have accounts.
--
-- Anyone can add a row, nobody can read them through the website: only the
-- server (with the secret key) reads them, to add them up for /stats.

create table if not exists public.lesson_events (
  id bigint generated always as identity primary key,
  at timestamptz not null default now(),
  device text not null check (length(device) between 8 and 64),
  user_id uuid default auth.uid() references auth.users (id) on delete set null,
  kind text not null check (kind in ('visit', 'lesson_start', 'lesson_finish', 'lesson_quit')),
  platform text not null default 'web' check (platform in ('web', 'app')),
  track text check (track in ('amharic', 'english')),
  camp text check (length(camp) <= 80),
  lesson integer check (lesson between 0 and 200),
  -- review sessions of saved mistakes, rather than a lesson
  review boolean not null default false,
  level text check (length(level) <= 30),
  -- for finishes and early exits: questions answered right, and mistakes made
  answered integer check (answered between 0 and 1000),
  mistakes integer check (mistakes between 0 and 1000)
);

create index if not exists lesson_events_at on public.lesson_events (at);
create index if not exists lesson_events_device on public.lesson_events (device, at);

alter table public.lesson_events enable row level security;

drop policy if exists "Anyone can add events" on public.lesson_events;
create policy "Anyone can add events" on public.lesson_events
  for insert to anon, authenticated
  with check (user_id is null or user_id = auth.uid());

-- Everything /stats shows, added up for the last `days` days (in UTC).
create or replace function public.kwanqa_stats(days integer default 30)
returns jsonb
language sql
stable
set search_path = ''
as $$
  with recent as (
    select *, (at at time zone 'utc')::date as day
    from public.lesson_events
    where at >= (now() at time zone 'utc')::date - (days - 1)
  ),
  -- the days each device was seen, and the first one
  device_days as (
    select device, day from recent group by device, day
  ),
  firsts as (
    select device, min((at at time zone 'utc')::date) as first_day
    from public.lesson_events
    group by device
  ),
  newcomers as (
    select f.device, f.first_day,
      exists (select 1 from device_days d where d.device = f.device and d.day = f.first_day + 1) as next_day,
      exists (select 1 from device_days d where d.device = f.device and d.day > f.first_day and d.day <= f.first_day + 7) as within_week
    from firsts f
    where f.first_day >= (now() at time zone 'utc')::date - (days - 1)
  ),
  lessons as (
    select track, camp, lesson,
      count(*) filter (where kind = 'lesson_start') as started,
      count(*) filter (where kind = 'lesson_finish') as finished,
      count(*) filter (where kind = 'lesson_quit') as quit,
      round(avg(answered) filter (where kind = 'lesson_quit'), 1) as answered_before_quitting
    from recent
    where kind like 'lesson_%' and not review and camp is not null
    group by track, camp, lesson
  )
  select jsonb_build_object(
    'days', days,
    'learners', jsonb_build_object(
      'today', (select count(distinct device) from recent where day = (now() at time zone 'utc')::date),
      'last_7_days', (select count(distinct device) from recent where day > (now() at time zone 'utc')::date - 7),
      'in_period', (select count(distinct device) from recent),
      'with_account', (select count(distinct device) from recent where user_id is not null),
      'on_app', (select count(distinct device) from recent where platform = 'app')
    ),
    'lessons', jsonb_build_object(
      'started', (select count(*) from recent where kind = 'lesson_start' and not review),
      'finished', (select count(*) from recent where kind = 'lesson_finish' and not review),
      'quit', (select count(*) from recent where kind = 'lesson_quit' and not review),
      'reviews_finished', (select count(*) from recent where kind = 'lesson_finish' and review),
      'learners_who_finished_one', (select count(distinct device) from recent where kind = 'lesson_finish')
    ),
    'coming_back', jsonb_build_object(
      -- only newcomers who've had a chance to come back the next day count
      'new_learners', (select count(*) from newcomers where first_day < (now() at time zone 'utc')::date),
      'came_back_next_day', (select count(*) from newcomers where first_day < (now() at time zone 'utc')::date and next_day),
      'new_learners_a_week_ago', (select count(*) from newcomers where first_day <= (now() at time zone 'utc')::date - 7),
      'came_back_within_a_week', (select count(*) from newcomers where first_day <= (now() at time zone 'utc')::date - 7 and within_week)
    ),
    'by_day', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'day', d.day,
        'learners', (select count(distinct device) from recent r where r.day = d.day),
        'started', (select count(*) from recent r where r.day = d.day and r.kind = 'lesson_start'),
        'finished', (select count(*) from recent r where r.day = d.day and r.kind = 'lesson_finish')
      ) order by d.day), '[]'::jsonb)
      from (
        select (now() at time zone 'utc')::date - (days - 1) + n as day from generate_series(0, days - 1) as n
      ) d
    ),
    'by_lesson', (
      select coalesce(jsonb_agg(to_jsonb(l) order by l.track, l.camp, l.lesson), '[]'::jsonb) from lessons l
    )
  );
$$;

-- Only the server can run it.
revoke execute on function public.kwanqa_stats(integer) from public, anon, authenticated;
grant execute on function public.kwanqa_stats(integer) to service_role;
