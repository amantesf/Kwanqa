import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { validUnsubscribe } from '@/lib/reminders';

// Turns off streak reminders from a signed link. Used by the /unsubscribe page
// and by email apps' one-click "Unsubscribe" button (RFC 8058), both as POST so
// link scanners that open every URL can't unsubscribe anyone by accident.

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const url = new URL(request.url);
  let userId = url.searchParams.get('u') ?? '';
  let token = url.searchParams.get('t') ?? '';
  if (!userId || !token) {
    const body = await request.json().catch(() => ({}));
    userId = typeof body.u === 'string' ? body.u : '';
    token = typeof body.t === 'string' ? body.t : '';
  }

  const secret = process.env.CRON_SECRET;
  const admin = supabaseAdmin();
  if (!secret || !admin) return NextResponse.json({ error: 'not configured' }, { status: 503 });
  if (!validUnsubscribe(userId, token, secret)) {
    return NextResponse.json({ error: 'invalid link' }, { status: 400 });
  }

  const { error } = await admin
    .from('reminders')
    .upsert({ user_id: userId, enabled: false, updated_at: new Date().toISOString() });
  if (error) {
    // The account may have been deleted since the email went out.
    if (error.code === '23503') return NextResponse.json({ ok: true });
    return NextResponse.json({ error: 'could not save' }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
