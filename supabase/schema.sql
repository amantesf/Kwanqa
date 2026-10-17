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
