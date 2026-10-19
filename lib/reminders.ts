import { createHmac, timingSafeEqual } from 'node:crypto';
import { holidays, type Holiday, type HolidayId } from '@/lib/holidays';

// Reminder emails (server only). Every hour the scheduler calls /api/reminders:
// - streak reminders go out at 7 pm local time to learners who practiced
//   yesterday but not yet today, so their climb streak is about to end;
// - holiday emails go out at 9 am local time on each Ethiopian holiday.

export const SITE_URL = 'https://kwanqa.com';
export const REMINDER_HOUR = 19;
export const HOLIDAY_HOUR = 9;

export type Candidate = {
  user_id: string;
  email: string;
  name: string | null;
  time_zone: string;
  days: unknown;
  last_sent: string | null;
};

export type HolidayCandidate = {
  user_id: string;
  email: string;
  name: string | null;
  time_zone: string;
  track: string | null;
  last_holiday: string | null;
};

/** Which emails an unsubscribe link turns off. */
export type ReminderKind = 'streak' | 'holidays';

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

/** YYYY-MM-DD of a holiday in a year (holiday dates are calendar days). */
function holidayDate(holiday: Holiday, year: number) {
  const d = holiday.date(year);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** The holiday to email this learner about right now (9 am on the day), or null. */
export function holidayFor(candidate: HolidayCandidate, now: Date) {
  const { date: today, hour } = localTime(now, candidate.time_zone);
  if (hour !== HOLIDAY_HOUR) return null;
  const year = Number(today.slice(0, 4));
  const holiday = holidays.find(h => holidayDate(h, year) === today);
  if (!holiday) return null;
  const key = `${holiday.id}-${year}`; // one email per holiday per year
  if (candidate.last_holiday === key) return null;
  return { holiday, key };
}

// Unsubscribe links are signed, so nobody can turn off someone else's emails.
// Streak links keep their original signature so emails already sent keep working.
function signature(userId: string, secret: string, kind: ReminderKind) {
  const scope = kind === 'streak' ? 'unsubscribe' : `unsubscribe-${kind}`;
  return createHmac('sha256', secret).update(`${scope}:${userId}`).digest('base64url');
}

const kindParam = (kind: ReminderKind) => (kind === 'streak' ? '' : `&k=${kind}`);

export function unsubscribeUrl(userId: string, secret: string, kind: ReminderKind = 'streak') {
  return `${SITE_URL}/unsubscribe?u=${userId}&t=${signature(userId, secret, kind)}${kindParam(kind)}`;
}

export function oneClickUnsubscribeUrl(userId: string, secret: string, kind: ReminderKind = 'streak') {
  return `${SITE_URL}/api/unsubscribe?u=${userId}&t=${signature(userId, secret, kind)}${kindParam(kind)}`;
}

export function validUnsubscribe(userId: string, token: string, secret: string, kind: ReminderKind = 'streak') {
  if (!/^[0-9a-f-]{36}$/i.test(userId)) return false;
  const expected = Buffer.from(signature(userId, secret, kind));
  const given = Buffer.from(token);
  return expected.length === given.length && timingSafeEqual(expected, given);
}

function escapeHtml(text: string) {
  return text.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

const firstName = (name: string | null) => name?.trim().split(/\s+/)[0] ?? '';

/** The shared kwanqa email layout: logo, a white card with Walia, a button, and a footer. */
function emailLayout(o: {
  heading: string;
  feature?: string;
  paragraphs: string[];
  button: { label: string; href: string };
  footer: string;
  unsubscribe: { label: string; href: string };
}) {
  const paragraphs = o.paragraphs
    .map(p => `<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#777777;">${escapeHtml(p)}</p>`)
    .join('\n        ');
  return `<div style="margin:0;padding:32px 16px;background:#fcede6;font-family:'Nunito','Segoe UI',Helvetica,Arial,sans-serif;">
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
        <h1 style="margin:16px 0 10px;font-size:26px;line-height:1.25;font-weight:800;color:#3c3c3c;">${escapeHtml(o.heading)}</h1>
        ${o.feature ? `<p style="margin:0 0 18px;font-size:22px;line-height:1.5;font-weight:800;color:#d2582e;">${escapeHtml(o.feature)}</p>` : ''}
        ${paragraphs}
        <a href="${o.button.href}" style="display:inline-block;margin-top:10px;padding:15px 32px;border-radius:16px;background:#d2582e;border-bottom:4px solid #a8431f;color:#ffffff;font-size:15px;font-weight:800;letter-spacing:1px;text-transform:uppercase;text-decoration:none;">
          ${escapeHtml(o.button.label)}
        </a>
      </td>
    </tr>
    <tr>
      <td style="padding:20px 24px 0;text-align:center;font-size:12px;line-height:1.6;color:#a08a7c;">
        ${escapeHtml(o.footer)}<br />
        <a href="${escapeHtml(o.unsubscribe.href)}" style="color:#a08a7c;">${escapeHtml(o.unsubscribe.label)}</a>
      </td>
    </tr>
  </table>
</div>`;
}

/** The streak reminder: subject, HTML and plain text. */
export function reminderEmail(name: string | null, streak: number, unsubscribe: string) {
  const first = firstName(name);
  const hello = first ? `ሰላም ${first}!` : 'ሰላም!';
  const days = streak === 1 ? '1 day' : `${streak} days`;
  const subject = `Keep your ${streak}-day streak going 🐐`;
  const learn = `${SITE_URL}/courses`;
  const line = `You’ve climbed ${days} in a row. One short lesson today keeps your streak alive.`;

  const text = [hello, '', line, '', `Keep climbing: ${learn}`, '', 'Walia from kwanqa', '', `Don’t want these reminders? Turn them off: ${unsubscribe}`].join('\n');
  const html = emailLayout({
    heading: hello,
    feature: `🔥 ${days}`,
    paragraphs: [line],
    button: { label: 'Keep climbing', href: learn },
    footer: 'You’re getting this because you have a kwanqa account and a climb streak.',
    unsubscribe: { label: 'Turn off streak reminders', href: unsubscribe },
  });
  return { subject, html, text };
}

/** What each holiday email says about the day. */
const HOLIDAY_COPY: Record<HolidayId, { subject: string; today: string; enjoy: string; learnAmharic: string; learnEnglish: string }> = {
  enkutatash: {
    subject: 'Happy Ethiopian New Year',
    today: 'Today is Enkutatash, Meskerem 1, the first day of the new Ethiopian year.',
    enjoy: 'Enjoy the day with your family, and may the new year bring you peace and health.',
    learnAmharic: 'When you have a few minutes, take today’s short holiday lesson and learn the New Year greetings in Amharic.',
    learnEnglish: 'When you have a few minutes, take today’s short holiday lesson and learn to talk about the Ethiopian New Year in English.',
  },
  meskel: {
    subject: 'Happy Meskel',
    today: 'Today is Meskel, when Ethiopians celebrate the Finding of the True Cross around the Demera bonfire.',
    enjoy: 'Enjoy the celebration with your family and your community.',
    learnAmharic: 'When you have a few minutes, take today’s short holiday lesson and learn the words of Meskel in Amharic.',
    learnEnglish: 'When you have a few minutes, take today’s short holiday lesson and learn to explain Meskel in English.',
  },
  genna: {
    subject: 'Merry Christmas, Melkam Genna',
    today: 'Today is Genna, Ethiopian Christmas.',
    enjoy: 'Enjoy the feast and the time with the people you love.',
    learnAmharic: 'When you have a few minutes, take today’s short holiday lesson and learn the Christmas greetings in Amharic.',
    learnEnglish: 'When you have a few minutes, take today’s short holiday lesson and learn to explain Genna in English.',
  },
  timket: {
    subject: 'Happy Timket',
    today: 'Today is Timket, the celebration of Epiphany.',
    enjoy: 'Enjoy the processions, the singing, and the day with your loved ones.',
    learnAmharic: 'When you have a few minutes, take today’s short holiday lesson and learn the words of Timket in Amharic.',
    learnEnglish: 'When you have a few minutes, take today’s short holiday lesson and learn to describe Timket in English.',
  },
  fasika: {
    subject: 'Happy Easter, Melkam Fasika',
    today: 'Today is Fasika, Ethiopian Easter. The long fast is over.',
    enjoy: 'Enjoy the feast with your family.',
    learnAmharic: 'When you have a few minutes, take today’s short holiday lesson and learn the Easter greetings in Amharic.',
    learnEnglish: 'When you have a few minutes, take today’s short holiday lesson and learn to talk about Ethiopian Easter in English.',
  },
};

/** A holiday greeting email: subject, HTML and plain text. */
export function holidayEmail(name: string | null, holiday: Holiday, track: string | null, unsubscribe: string) {
  const copy = HOLIDAY_COPY[holiday.id];
  const first = firstName(name);
  const subject = first ? `${copy.subject}, ${first}` : copy.subject;
  const lesson = `${SITE_URL}/holidays/${holiday.id}`;
  const learn = track === 'english' ? copy.learnEnglish : copy.learnAmharic;
  const heading = first ? `ሰላም ${first}!` : 'ሰላም!';

  const text = [
    heading,
    '',
    holiday.greeting.amharic,
    holiday.greeting.english,
    '',
    copy.today,
    copy.enjoy,
    '',
    learn,
    `Holiday lesson: ${lesson}`,
    '',
    'Walia from kwanqa',
    '',
    `Don’t want holiday emails? Turn them off: ${unsubscribe}`,
  ].join('\n');

  const html = emailLayout({
    heading,
    feature: holiday.greeting.amharic,
    paragraphs: [holiday.greeting.english, `${copy.today} ${copy.enjoy}`, learn],
    button: { label: 'Open the holiday lesson', href: lesson },
    footer: 'You’re getting this because you have a kwanqa account.',
    unsubscribe: { label: 'Turn off holiday emails', href: unsubscribe },
  });
  return { subject, html, text };
}
