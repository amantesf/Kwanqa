import { NextResponse } from 'next/server';
import { requestUser } from '@/lib/requestUser';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

// The numbers for /stats, added up by kwanqa_stats() (supabase/events.sql).
// Only for the team: the logged-in account's email must be in STATS_EMAILS
// (a comma-separated list in the Vercel environment variables).

export const dynamic = 'force-dynamic';

function allowed(email: string | undefined) {
  const list = (process.env.STATS_EMAILS ?? '')
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean);
  return !!email && list.includes(email.toLowerCase());
}

export async function GET(request: Request) {
  const user = await requestUser(request);
  if (!user) return NextResponse.json({ error: 'Log in to see the numbers.' }, { status: 401 });
  if (!allowed(user.email)) return NextResponse.json({ error: 'This page is only for the kwanqa team.' }, { status: 403 });

  const admin = supabaseAdmin();
  if (!admin) return NextResponse.json({ error: 'SUPABASE_SECRET_KEY isn’t set on the server.' }, { status: 500 });

  const days = Math.min(90, Math.max(7, Number(new URL(request.url).searchParams.get('days')) || 30));
  const { data, error } = await admin.rpc('kwanqa_stats', { days });
  if (error) {
    const missing = /kwanqa_stats|lesson_events/.test(error.message);
    return NextResponse.json(
      { error: missing ? 'Run supabase/events.sql in the Supabase SQL editor first.' : error.message },
      { status: 500 },
    );
  }
  return NextResponse.json(data, { headers: { 'Cache-Control': 'no-store' } });
}
