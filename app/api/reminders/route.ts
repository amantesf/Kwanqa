import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import {
  holidayEmail,
  holidayFor,
  oneClickUnsubscribeUrl,
  reminderEmail,
  reminderFor,
  unsubscribeUrl,
  type Candidate,
  type HolidayCandidate,
  type ReminderKind,
} from '@/lib/reminders';

// Called every hour by the Supabase scheduler (see supabase/schema.sql).
// Sends streak reminders to learners for whom it's now 7 pm, and holiday
// emails to learners for whom it's 9 am on an Ethiopian holiday.

const FROM = process.env.REMINDER_FROM ?? 'Walia from kwanqa <reminders@kwanqa.com>';
const REPLY_TO = 'kwanqa.team@gmail.com';
const BATCH = 100; // Resend's batch limit

export const dynamic = 'force-dynamic';

type Outgoing = {
  userId: string;
  to: string;
  kind: ReminderKind;
  email: { subject: string; html: string; text: string };
  /** The row update that records this send, so nobody gets it twice. */
  record: Record<string, string>;
};

/** Sends emails in batches and records each batch that Resend accepted. */
async function send(
  outgoing: Outgoing[],
  label: string,
  ctx: { resendKey: string; secret: string; hour: string; admin: NonNullable<ReturnType<typeof supabaseAdmin>> },
) {
  let sent = 0;
  const failures: string[] = [];
  for (let i = 0; i < outgoing.length; i += BATCH) {
    const chunk = outgoing.slice(i, i + BATCH);
    const response = await fetch('https://api.resend.com/emails/batch', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${ctx.resendKey}`,
        'Content-Type': 'application/json',
        // If the scheduler retries this hour, Resend won't send the same batch twice.
        'Idempotency-Key': `${label}-${ctx.hour}-${i / BATCH}`,
      },
      body: JSON.stringify(
        chunk.map(o => ({
          from: FROM,
          to: [o.to],
          reply_to: REPLY_TO,
          subject: o.email.subject,
          html: o.email.html,
          text: o.email.text,
          headers: {
            'List-Unsubscribe': `<${oneClickUnsubscribeUrl(o.userId, ctx.secret, o.kind)}>`,
            'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
          },
        })),
      ),
    });
    if (!response.ok) {
      failures.push(`${label} batch ${i / BATCH}: ${response.status} ${(await response.text()).slice(0, 200)}`);
      continue;
    }
    const { error } = await ctx.admin.from('reminders').upsert(chunk.map(o => ({ user_id: o.userId, ...o.record })));
    if (error) failures.push(`saving ${label} sends: ${error.message}`);
    sent += chunk.length;
  }
  return { sent, failures };
}

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

  const now = new Date();
  const ctx = { resendKey, secret, admin, hour: now.toISOString().slice(0, 13) };
  const failures: string[] = [];

  // Streak reminders
  const streak = await admin.rpc('reminder_candidates');
  let streakDue: Outgoing[] = [];
  if (streak.error) failures.push(`streak candidates: ${streak.error.message}`);
  else {
    streakDue = (streak.data as Candidate[]).flatMap(c => {
      const due = reminderFor(c, now);
      if (!due) return [];
      return [{
        userId: c.user_id,
        to: c.email,
        kind: 'streak' as const,
        email: reminderEmail(c.name, due.streak, unsubscribeUrl(c.user_id, secret)),
        record: { time_zone: c.time_zone, last_sent: due.today },
      }];
    });
  }
  const streakResult = await send(streakDue, 'reminders', ctx);

  // Holiday emails
  const festive = await admin.rpc('holiday_candidates');
  let holidayDue: Outgoing[] = [];
  // PGRST202: the holiday SQL hasn't been run yet, so holiday emails are simply off.
  if (festive.error && festive.error.code !== 'PGRST202') failures.push(`holiday candidates: ${festive.error.message}`);
  else if (festive.data) {
    holidayDue = (festive.data as HolidayCandidate[]).flatMap(c => {
      const due = holidayFor(c, now);
      if (!due) return [];
      return [{
        userId: c.user_id,
        to: c.email,
        kind: 'holidays' as const,
        email: holidayEmail(c.name, due.holiday, c.track, unsubscribeUrl(c.user_id, secret, 'holidays')),
        record: { time_zone: c.time_zone, last_holiday: due.key },
      }];
    });
  }
  const holidayResult = await send(holidayDue, 'holidays', ctx);

  failures.push(...streakResult.failures, ...holidayResult.failures);
  return NextResponse.json(
    {
      streak: { checked: streak.data?.length ?? 0, due: streakDue.length, sent: streakResult.sent },
      holidays: { checked: festive.data?.length ?? 0, due: holidayDue.length, sent: holidayResult.sent },
      failures,
    },
    { status: failures.length ? 500 : 200 },
  );
}
