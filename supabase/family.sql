-- Family mode: parents and kids learn together with a shared family streak.
-- Run this once in the Supabase SQL editor (after schema.sql). Safe to run
-- more than once.
--
-- A learner starts a family and gets a 6-letter code; others join with it
-- from their own account (up to 8 people, one family each). The family
-- streak grows on days when everyone practised.
--
-- The tables have no policies on purpose: the browser can't read or change
-- them directly, only through the functions below, which check that the
-- caller belongs to the family. Members see each other's first name, the
-- days they practised (last 120 days) and how many lessons they've done,
-- nothing else.

create table if not exists public.families (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(name) between 1 and 40),
  code text not null unique check (code ~ '^[A-Z2-9]{6}$'),
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.family_members (
  user_id uuid primary key references auth.users (id) on delete cascade,
  family_id uuid not null references public.families (id) on delete cascade,
  name text not null check (length(name) between 1 and 40),
  joined_at timestamptz not null default now()
);

create index if not exists family_members_family on public.family_members (family_id);

alter table public.families enable row level security;
alter table public.family_members enable row level security;

-- Start a family; returns its join code.
create or replace function public.family_create(family_name text, member_name text)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  alphabet constant text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; -- no 0/O, 1/I/L
  new_code text;
  new_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Log in first.';
  end if;
  if exists (select 1 from public.family_members where user_id = auth.uid()) then
    raise exception 'You''re already in a family. Leave it first.';
  end if;
  loop
    new_code := '';
    for i in 1..6 loop
      new_code := new_code || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
    end loop;
    exit when not exists (select 1 from public.families where code = new_code);
  end loop;
  insert into public.families (name, code, created_by)
  values (left(coalesce(nullif(trim(family_name), ''), 'Our family'), 40), new_code, auth.uid())
  returning id into new_id;
  insert into public.family_members (user_id, family_id, name)
  values (auth.uid(), new_id, left(coalesce(nullif(trim(member_name), ''), 'Me'), 40));
  return new_code;
end;
$$;

-- Join a family with its code.
create or replace function public.family_join(join_code text, member_name text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  target uuid;
begin
  if auth.uid() is null then
    raise exception 'Log in first.';
  end if;
  if exists (select 1 from public.family_members where user_id = auth.uid()) then
    raise exception 'You''re already in a family. Leave it first.';
  end if;
  select id into target from public.families where code = upper(trim(join_code));
  if target is null then
    raise exception 'No family has that code. Check the letters and try again.';
  end if;
  if (select count(*) from public.family_members where family_id = target) >= 8 then
    raise exception 'That family is full (8 people).';
  end if;
  insert into public.family_members (user_id, family_id, name)
  values (auth.uid(), target, left(coalesce(nullif(trim(member_name), ''), 'Me'), 40));
end;
$$;

-- Leave your family; the family goes away when its last member leaves.
create or replace function public.family_leave()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  fam uuid;
begin
  delete from public.family_members where user_id = auth.uid() returning family_id into fam;
  if fam is not null and not exists (select 1 from public.family_members where family_id = fam) then
    delete from public.families where id = fam;
  end if;
end;
$$;

-- Your family: its name and code, and for each member their first name,
-- whether it's you, when they joined, the days they practised (last 120)
-- and how many lessons they've finished. Null when you're not in a family.
create or replace function public.family_view()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  fam uuid;
  result jsonb;
begin
  select family_id into fam from public.family_members where user_id = auth.uid();
  if fam is null then
    return null;
  end if;
  select jsonb_build_object(
    'name', f.name,
    'code', f.code,
    'members', coalesce((
      select jsonb_agg(jsonb_build_object(
        'me', m.user_id = auth.uid(),
        'name', m.name,
        'joined', m.joined_at,
        'days', coalesce((
          select jsonb_agg(d.value order by d.value)
          from jsonb_array_elements_text(coalesce(c.days, '[]'::jsonb)) as d (value)
          where d.value >= to_char(now() - interval '120 days', 'YYYY-MM-DD')
        ), '[]'::jsonb),
        'lessons', coalesce((
          select sum(jsonb_array_length(e.value))
          from jsonb_each(coalesce(c.completed, '{}'::jsonb)) as e (key, value)
          where jsonb_typeof(e.value) = 'array'
        ), 0)
      ) order by m.joined_at)
      from public.family_members m
      left join public.climbs c on c.user_id = m.user_id
      where m.family_id = fam
    ), '[]'::jsonb)
  )
  into result
  from public.families f
  where f.id = fam;
  return result;
end;
$$;

revoke execute on function public.family_create(text, text) from public, anon;
revoke execute on function public.family_join(text, text) from public, anon;
revoke execute on function public.family_leave() from public, anon;
revoke execute on function public.family_view() from public, anon;
grant execute on function public.family_create(text, text) to authenticated;
grant execute on function public.family_join(text, text) to authenticated;
grant execute on function public.family_leave() to authenticated;
grant execute on function public.family_view() to authenticated;
