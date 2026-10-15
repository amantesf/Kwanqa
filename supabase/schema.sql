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
