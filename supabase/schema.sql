-- Run this once in the Supabase SQL editor.
-- One row per learner holding their trail progress and grass.

create table if not exists public.climbs (
  user_id uuid primary key references auth.users (id) on delete cascade,
  completed jsonb not null default '{}'::jsonb,
  grass integer not null default 0 check (grass >= 0),
  updated_at timestamptz not null default now()
);

alter table public.climbs enable row level security;

-- Learners can only see and change their own row.
create policy "Read own climb" on public.climbs
  for select using (auth.uid() = user_id);

create policy "Insert own climb" on public.climbs
  for insert with check (auth.uid() = user_id);

create policy "Update own climb" on public.climbs
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Climb streak: the days a learner finished at least one lesson (YYYY-MM-DD),
-- and a daily log of lessons, answers and minutes for each of those days.
-- Safe to run more than once.
alter table public.climbs add column if not exists days jsonb not null default '[]'::jsonb;
alter table public.climbs add column if not exists log jsonb not null default '{}'::jsonb;

-- Lets a logged-in learner delete their own account from the profile page.
-- Their climbs row goes with it (on delete cascade). Safe to run more than once.
create or replace function public.delete_account()
returns void
language sql
security definer
set search_path = ''
as $$
  delete from auth.users where id = auth.uid();
$$;

revoke execute on function public.delete_account() from public, anon;
grant execute on function public.delete_account() to authenticated;

-- Limits on what the browser can save, so nobody can stuff the table with junk.
-- Generous on purpose: ten years of daily practice is about 260 KB of log.
-- Safe to run more than once.
alter table public.climbs drop constraint if exists climbs_shape;
alter table public.climbs add constraint climbs_shape check (
  jsonb_typeof(completed) = 'object'
  and jsonb_typeof(days) = 'array'
  and jsonb_typeof(log) = 'object'
);

alter table public.climbs drop constraint if exists climbs_size;
alter table public.climbs add constraint climbs_size check (
  length(completed::text) <= 50000
  and length(days::text) <= 100000
  and length(log::text) <= 500000
);

alter table public.climbs drop constraint if exists climbs_grass_max;
alter table public.climbs add constraint climbs_grass_max check (grass <= 1000000);

-- Streak reminder emails: one row per learner with their choice and time zone.
-- Reminders are on by default; learners turn them off on their profile or with
-- the unsubscribe link in each email. Safe to run more than once.
create table if not exists public.reminders (
  user_id uuid primary key references auth.users (id) on delete cascade,
  enabled boolean not null default true,
  time_zone text not null default 'UTC' check (length(time_zone) <= 64),
  last_sent date,
  updated_at timestamptz not null default now()
);

alter table public.reminders enable row level security;

drop policy if exists "Read own reminders" on public.reminders;
create policy "Read own reminders" on public.reminders
  for select using (auth.uid() = user_id);

drop policy if exists "Insert own reminders" on public.reminders;
create policy "Insert own reminders" on public.reminders
  for insert with check (auth.uid() = user_id);

drop policy if exists "Update own reminders" on public.reminders;
create policy "Update own reminders" on public.reminders
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Learners may change their choice and time zone, but only the server records sends.
revoke insert, update on public.reminders from anon, authenticated;
grant insert (user_id, enabled, time_zone, updated_at) on public.reminders to authenticated;
grant update (user_id, enabled, time_zone, updated_at) on public.reminders to authenticated;

-- Learners who might need a reminder: confirmed email, reminders on, and practice
-- in the last few days. The server picks who is at 7 pm and at risk of losing
-- their streak. Only the server (service role) can call this.
create or replace function public.reminder_candidates()
returns table (user_id uuid, email text, name text, time_zone text, days jsonb, last_sent date)
language sql
stable
security definer
set search_path = ''
as $$
  select
    u.id,
    u.email::text,
    coalesce(u.raw_user_meta_data ->> 'name', u.raw_user_meta_data ->> 'full_name'),
    coalesce(r.time_zone, 'UTC'),
    c.days,
    r.last_sent
  from auth.users u
  join public.climbs c on c.user_id = u.id
  left join public.reminders r on r.user_id = u.id
  where coalesce(r.enabled, true)
    and u.email is not null
    and u.email_confirmed_at is not null
    and jsonb_array_length(c.days) > 0
    and c.days ->> -1 >= to_char(now() - interval '3 days', 'YYYY-MM-DD');
$$;

revoke execute on function public.reminder_candidates() from public, anon, authenticated;
grant execute on function public.reminder_candidates() to service_role;

-- Holiday emails: a greeting on each Ethiopian holiday. On by default, with
-- their own switch, separate from streak reminders. Safe to run more than once.
alter table public.reminders add column if not exists holiday_emails boolean not null default true;
alter table public.reminders add column if not exists last_holiday text check (length(last_holiday) <= 40);

revoke insert, update on public.reminders from anon, authenticated;
grant insert (user_id, enabled, holiday_emails, time_zone, updated_at) on public.reminders to authenticated;
grant update (user_id, enabled, holiday_emails, time_zone, updated_at) on public.reminders to authenticated;

-- Every learner who gets holiday emails, with the course they're on.
-- Only the server (service role) can call this.
create or replace function public.holiday_candidates()
returns table (user_id uuid, email text, name text, time_zone text, track text, last_holiday text)
language sql
stable
security definer
set search_path = ''
as $$
  select
    u.id,
    u.email::text,
    coalesce(u.raw_user_meta_data ->> 'name', u.raw_user_meta_data ->> 'full_name'),
    coalesce(r.time_zone, 'UTC'),
    u.raw_user_meta_data -> 'onboarding' ->> 'track',
    r.last_holiday
  from auth.users u
  left join public.reminders r on r.user_id = u.id
  where coalesce(r.holiday_emails, true)
    and u.email is not null
    and u.email_confirmed_at is not null;
$$;

revoke execute on function public.holiday_candidates() from public, anon, authenticated;
grant execute on function public.holiday_candidates() to service_role;

-- Mistakes and passport stamps, saved in the account so they follow the learner
-- to the app or a new phone: the questions waiting to be practised again (per
-- camp) and the stamps already celebrated. Safe to run more than once.
alter table public.climbs add column if not exists mistakes jsonb not null default '{}'::jsonb;
alter table public.climbs add column if not exists stamps jsonb not null default '[]'::jsonb;

alter table public.climbs drop constraint if exists climbs_extras_shape;
alter table public.climbs add constraint climbs_extras_shape check (
  jsonb_typeof(mistakes) = 'object'
  and jsonb_typeof(stamps) = 'array'
);

-- At most 40 saved questions per camp, about 1 KB each.
alter table public.climbs drop constraint if exists climbs_extras_size;
alter table public.climbs add constraint climbs_extras_size check (
  length(mistakes::text) <= 700000
  and length(stamps::text) <= 10000
);
