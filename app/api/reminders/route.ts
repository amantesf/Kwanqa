import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import {
  oneClickUnsubscribeUrl,
  reminderEmail,
  reminderFor,
  unsubscribeUrl,
  type Candidate,
} from '@/lib/reminders';

// Called every hour by the Supabase scheduler (see supabase/schema.sql).
// Sends a streak reminder to learners for whom it's now 7 pm.

const FROM = process.env.REMINDER_FROM ?? 'Walia from kwanqa <reminders@kwanqa.com>';
const REPLY_TO = 'kwanqa.team@gmail.com';
const BATCH = 100; // Resend's batch limit

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const resendKey = process.env.RESEND_API_KEY;
  const admin = supabaseAdmin();
  if (!admin || !resendKey) {
    return NextResponse.json({ error: 'reminders are not configured' }, { status: 503 });
  }

  const { data, error } = await admin.rpc('reminder_candidates');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const now = new Date();
  const due = (data as Candidate[]).flatMap(candidate => {
    const reminder = reminderFor(candidate, now);
    return reminder ? [{ candidate, ...reminder }] : [];
  });

  let sent = 0;
  const failures: string[] = [];
  for (let i = 0; i < due.length; i += BATCH) {
    const chunk = due.slice(i, i + BATCH);
    const emails = chunk.map(({ candidate, streak }) => {
      const { subject, html, text } = reminderEmail(
        candidate.name,
        streak,
        unsubscribeUrl(candidate.user_id, secret),
      );
      return {
        from: FROM,
        to: [candidate.email],
        reply_to: REPLY_TO,
        subject,
        html,
        text,
        headers: {
          'List-Unsubscribe': `<${oneClickUnsubscribeUrl(candidate.user_id, secret)}>`,
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        },
      };
    });

    const response = await fetch('https://api.resend.com/emails/batch', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
        // If the scheduler retries this hour, Resend won't send the same batch twice.
        'Idempotency-Key': `reminders-${now.toISOString().slice(0, 13)}-${i / BATCH}`,
      },
      body: JSON.stringify(emails),
    });
    if (!response.ok) {
      failures.push(`batch ${i / BATCH}: ${response.status} ${(await response.text()).slice(0, 200)}`);
      continue;
    }

    // Remember today's send so nobody gets two reminders in one day.
    const { error: saveError } = await admin
      .from('reminders')
      .upsert(chunk.map(({ candidate, today }) => ({ user_id: candidate.user_id, time_zone: candidate.time_zone, last_sent: today })));
    if (saveError) failures.push(`saving sends: ${saveError.message}`);
    sent += chunk.length;
  }

  return NextResponse.json(
    { checked: data.length, due: due.length, sent, failures },
    { status: failures.length ? 500 : 200 },
  );
}
