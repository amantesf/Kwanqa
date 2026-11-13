-- Daily limits on the features that cost money each time they're used:
-- word lookups and sentence translations (Claude, /api/gloss), Walia's
-- answers in Talk (Claude, /api/tutor) and listening to a recording
-- (Azure, /api/listen).
--
-- Run this once in the Supabase SQL editor (after schema.sql). Safe to run
-- more than once. Until it's run, the site keeps working with no limits.
--
-- Only the server can count, with the secret key: the browser can't read
-- or change the table and can't call the function.

create table if not exists public.ai_usage (
  user_id uuid not null references auth.users (id) on delete cascade,
  day date not null default (now() at time zone 'utc')::date,
  kind text not null check (kind in ('gloss', 'talk', 'listen')),
  uses integer not null default 0 check (uses >= 0),
  primary key (user_id, day, kind)
);

alter table public.ai_usage enable row level security;

-- Count one use if the learner is still under today's limit (UTC day).
-- Returns true when the use is allowed, false when the limit is reached.
create or replace function public.ai_use(learner uuid, use_kind text, day_limit integer)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  today date := (now() at time zone 'utc')::date;
  counted integer;
begin
  insert into public.ai_usage as u (user_id, day, kind, uses)
  values (learner, today, use_kind, 1)
  on conflict (user_id, day, kind)
    do update set uses = u.uses + 1
    where u.uses < day_limit
  returning u.uses into counted;
  return counted is not null and counted <= day_limit;
end;
$$;

-- Old rows are only useful for a few weeks of history.
create or replace function public.ai_usage_tidy()
returns void
language sql
security definer
set search_path = ''
as $$
  delete from public.ai_usage where day < (now() at time zone 'utc')::date - 60;
$$;

revoke execute on function public.ai_use(uuid, text, integer) from public, anon, authenticated;
revoke execute on function public.ai_usage_tidy() from public, anon, authenticated;
grant execute on function public.ai_use(uuid, text, integer) to service_role;
grant execute on function public.ai_usage_tidy() to service_role;
