-- How learners with an account are doing. Paste one query at a time into the
-- Supabase SQL editor (Dashboard → SQL Editor) and press Run. Read-only: these
-- only count, they never change anything, and they show no names or emails.
-- Learners who never made an account aren't here; Vercel Analytics counts them.


-- 1. Do people come back?
select
  count(*)                                                        as learners_with_progress,
  count(*) filter (where jsonb_array_length(days) >= 1)           as practised_at_least_once,
  count(*) filter (where jsonb_array_length(days) >= 2)           as came_back_another_day,
  count(*) filter (where jsonb_array_length(days) >= 7)           as practised_7_days_or_more,
  count(*) filter (where updated_at > now() - interval '7 days')  as active_in_the_last_7_days
from public.climbs;


-- 2. How far do they get? Learners who finished each lesson, camp by camp.
-- Big drops between two lessons show where people give up.
select
  c.key                     as camp,
  l.lesson::int + 1         as lesson,
  count(*)                  as learners_who_finished_it
from public.climbs,
  jsonb_each(completed) as c(key, value),
  jsonb_array_elements_text(c.value) as l(lesson)
where c.key not like 'talk:%'
group by c.key, l.lesson::int
order by c.key, l.lesson::int;


-- 3. How many lessons has each learner finished? (0, 1, 2–5, 6–15, 16+)
with totals as (
  select coalesce(sum(jsonb_array_length(c.value)) filter (where c.key not like 'talk:%'), 0) as lessons
  from public.climbs
  left join lateral jsonb_each(completed) as c(key, value) on true
  group by user_id
)
select
  case
    when lessons = 0 then '0'
    when lessons = 1 then '1'
    when lessons <= 5 then '2–5'
    when lessons <= 15 then '6–15'
    else '16+'
  end as lessons_finished,
  count(*) as learners
from totals
group by 1
order by min(lessons);


-- 4. Talk calls: learners who finished each call at least once.
select
  substring(c.key from 6) as call,
  count(*)                as learners
from public.climbs, jsonb_each(completed) as c(key, value)
where c.key like 'talk:%'
group by 1
order by 2 desc;
