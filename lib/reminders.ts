import { createHmac, timingSafeEqual } from 'node:crypto';

// Streak reminder emails (server only). Every hour the scheduler calls
// /api/reminders; learners for whom it's 7 pm get one email if they practiced
// yesterday but not yet today, so their climb streak is about to end.

export const SITE_URL = 'https://kwanqa.com';
export const REMINDER_HOUR = 19;

export type Candidate = {
  user_id: string;
  email: string;
  name: string | null;
  time_zone: string;
  days: unknown;
  last_sent: string | null;
};

/** Today's date (YYYY-MM-DD) and hour in a time zone; falls back to UTC for unknown zones. */
export function localTime(now: Date, timeZone: string) {
  let parts: Intl.DateTimeFormatPart[];
  try {
    parts = new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      hourCycle: 'h23',
    }).formatToParts(now);
  } catch {
    return localTime(now, 'UTC');
  }
  const get = (type: string) => parts.find(p => p.type === type)?.value ?? '';
  return { date: `${get('year')}-${get('month')}-${get('day')}`, hour: Number(get('hour')) };
}

function previousDay(date: string) {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

/** Days in a row up to and including `lastDay`. */
function streakEnding(days: Set<string>, lastDay: string) {
  let count = 0;
  for (let day = lastDay; days.has(day); day = previousDay(day)) count++;
  return count;
}

/** The learner's streak if they should get a reminder right now, otherwise null. */
export function reminderFor(candidate: Candidate, now: Date) {
  const { date: today, hour } = localTime(now, candidate.time_zone);
  if (hour !== REMINDER_HOUR || candidate.last_sent === today) return null;
  const days = new Set(Array.isArray(candidate.days) ? candidate.days.filter(d => typeof d === 'string') : []);
  const yesterday = previousDay(today);
  if (days.has(today) || !days.has(yesterday)) return null;
  return { today, streak: streakEnding(days, yesterday) };
}

// Unsubscribe links are signed, so nobody can turn off someone else's reminders.
function signature(userId: string, secret: string) {
  return createHmac('sha256', secret).update(`unsubscribe:${userId}`).digest('base64url');
}

export function unsubscribeUrl(userId: string, secret: string) {
  return `${SITE_URL}/unsubscribe?u=${userId}&t=${signature(userId, secret)}`;
}

export function oneClickUnsubscribeUrl(userId: string, secret: string) {
  return `${SITE_URL}/api/unsubscribe?u=${userId}&t=${signature(userId, secret)}`;
}

export function validUnsubscribe(userId: string, token: string, secret: string) {
  if (!/^[0-9a-f-]{36}$/i.test(userId)) return false;
  const expected = Buffer.from(signature(userId, secret));
  const given = Buffer.from(token);
  return expected.length === given.length && timingSafeEqual(expected, given);
}

function escapeHtml(text: string) {
  return text.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

/** The reminder email: subject, HTML and plain text. */
export function reminderEmail(name: string | null, streak: number, unsubscribe: string) {
  const first = name?.trim().split(/\s+/)[0] ?? '';
  const hello = first ? `ሰላም ${first}!` : 'ሰላም!';
  const days = streak === 1 ? '1 day' : `${streak} days`;
  const subject = `Keep your ${streak}-day streak going 🐐`;
  const learn = `${SITE_URL}/courses`;

  const text = [
    hello,
    '',
    `You’ve climbed ${days} in a row. One short lesson today keeps your streak alive.`,
    '',
    `Keep climbing: ${learn}`,
    '',
    '— Walia from kwanqa',
    '',
    `Don’t want these reminders? Turn them off: ${unsubscribe}`,
  ].join('\n');

  const html = `<div style="margin:0;padding:32px 16px;background:#fcede6;font-family:'Nunito','Segoe UI',Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;">
    <tr>
      <td style="padding:0 0 20px;text-align:center;">
        <a href="${SITE_URL}" style="text-decoration:none;">
          <img src="${SITE_URL}/email/kwanqa-logo.png" width="158" height="38" alt="kwanqa" style="display:inline-block;border:0;" />
        </a>
      </td>
    </tr>
    <tr>
      <td style="background:#ffffff;border:2px solid #e5e5e5;border-bottom-width:5px;border-radius:24px;padding:32px 32px 28px;text-align:center;">
        <img src="${SITE_URL}/email/walia.png" width="120" height="160" alt="Walia the ibex" style="display:inline-block;border:0;" />
        <h1 style="margin:16px 0 10px;font-size:26px;line-height:1.25;font-weight:800;color:#3c3c3c;">${escapeHtml(hello)}</h1>
        <p style="margin:0 0 8px;font-size:40px;line-height:1.2;font-weight:900;color:#d2582e;">🔥 ${days}</p>
        <p style="margin:0 0 26px;font-size:16px;line-height:1.6;color:#777777;">
          You’ve climbed ${days} in a row. One short lesson today keeps your streak alive.
        </p>
        <a href="${learn}" style="display:inline-block;padding:15px 32px;border-radius:16px;background:#d2582e;border-bottom:4px solid #a8431f;color:#ffffff;font-size:15px;font-weight:800;letter-spacing:1px;text-transform:uppercase;text-decoration:none;">
          Keep climbing
        </a>
      </td>
    </tr>
    <tr>
      <td style="padding:20px 24px 0;text-align:center;font-size:12px;line-height:1.6;color:#a08a7c;">
        You’re getting this because you have a kwanqa account and a climb streak.<br />
        <a href="${escapeHtml(unsubscribe)}" style="color:#a08a7c;">Turn off streak reminders</a>
      </td>
    </tr>
  </table>
</div>`;

  return { subject, html, text };
}
