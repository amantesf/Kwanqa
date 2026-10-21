'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DateTile, ShareGreeting, countdown, useNow } from '@/components/HolidayCards';
import { MONTHS, formatEthiopian, fromEthiopian, geezNumber, toEthiopian, type EthiopianDate } from '@/lib/ethiopianCalendar';
import { holidays, upcomingHolidays, type Holiday } from '@/lib/holidays';
import Tilet from '@/components/Tilet';

const WEEKDAY_SHORT = ['እሑ', 'ሰኞ', 'ማክ', 'ረቡ', 'ሐሙ', 'ዓር', 'ቅዳ'];
const WEEKDAY_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKDAY_FULL = ['እሑድ', 'ሰኞ', 'ማክሰኞ', 'ረቡዕ', 'ሐሙስ', 'ዓርብ', 'ቅዳሜ'];
const longDate = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
const monthDay = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });
const gregMonth = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' });

/** Moves `months` Ethiopian months from a month (Pagume counts as the 13th). */
function shiftMonth({ year, month }: EthiopianDate, months: number): EthiopianDate {
  const index = (year * 13 + month - 1) + months;
  return { year: Math.floor(index / 13), month: (index % 13) + 1, day: 1 };
}

/** Days in an Ethiopian month: 30, or 5–6 for Pagume. */
function monthLength({ year, month }: EthiopianDate) {
  if (month < 13) return 30;
  return year % 4 === 3 ? 6 : 5;
}

/** Holidays that fall on each day of an Ethiopian month, keyed by day number. */
function holidaysIn(month: EthiopianDate) {
  const first = fromEthiopian({ ...month, day: 1 });
  const found = new Map<number, Holiday>();
  for (const holiday of holidays) {
    for (const year of [first.getFullYear(), first.getFullYear() + 1]) {
      const et = toEthiopian(holiday.date(year));
      if (et.year === month.year && et.month === month.month) found.set(et.day, holiday);
    }
  }
  return found;
}

/** One Ethiopian month as a calendar grid, starting on Sunday. */
function MonthGrid({ month, today }: { month: EthiopianDate; today: EthiopianDate }) {
  const first = fromEthiopian({ ...month, day: 1 });
  const length = monthLength(month);
  const marked = holidaysIn(month);
  const last = fromEthiopian({ ...month, day: length });
  const span =
    first.getMonth() === last.getMonth()
      ? gregMonth.format(first)
      : `${monthDay.format(first).split(' ')[0]} – ${gregMonth.format(last)}`;

  const cells: (number | null)[] = [...Array(first.getDay()).fill(null), ...Array.from({ length }, (_, i) => i + 1)];

  return (
    <figure className="month">
      <Tilet className="month-tilet" height={12} palette="ink" />
      <figcaption className="month-caption">
        <span className="month-name" lang="am">
          {MONTHS[month.month - 1].amharic} {geezNumber(month.year)}
        </span>
        <span className="month-sub">
          {MONTHS[month.month - 1].name} {month.year} · {span}
        </span>
      </figcaption>
      <div className="month-grid">
        {WEEKDAY_SHORT.map((d, i) => (
          <span key={d} className="month-weekday" title={WEEKDAY_EN[i]} lang="am">
            {d}
          </span>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <span key={`blank-${i}`} aria-hidden />;
          const date = fromEthiopian({ ...month, day });
          const holiday = marked.get(day);
          const isToday = today.year === month.year && today.month === month.month && today.day === day;
          const label = `${MONTHS[month.month - 1].name} ${day} (${monthDay.format(date)})${holiday ? `, ${holiday.name}` : ''}${isToday ? ', today' : ''}`;
          const body = (
            <>
              <span className="day-geez" lang="am">
                {geezNumber(day)}
              </span>
              <span className="day-greg">{date.getDate() === 1 || day === 1 ? monthDay.format(date) : date.getDate()}</span>
            </>
          );
          const className = `day${isToday ? ' today' : ''}${holiday ? ' feast' : ''}`;
          const style = holiday ? ({ '--holiday': holiday.color } as React.CSSProperties) : undefined;
          return holiday ? (
            <Link key={day} href={`/holidays/${holiday.id}`} className={className} style={style} aria-label={label}>
              {body}
            </Link>
          ) : (
            <span key={day} className={className} title={label}>
              {body}
            </span>
          );
        })}
      </div>
      {marked.size > 0 && (
        <ul className="month-feasts">
          {[...marked].map(([day, holiday]) => (
            <li key={holiday.id} style={{ '--holiday': holiday.color } as React.CSSProperties}>
              <span lang="am">{geezNumber(day)}</span> {holiday.name}
            </li>
          ))}
        </ul>
      )}
    </figure>
  );
}

// /holidays: the Ethiopian calendar itself, then every holiday in the order it comes up.
export default function HolidayCalendar() {
  const now = useNow();
  const [offset, setOffset] = useState(0);
  const today = now ? toEthiopian(now) : null;
  const shown = today ? shiftMonth(today, offset) : null;

  return (
    <main className="section holidays-page">
      <div className="container holidays-container">
        <Link href="/courses" className="back-link">
          ← Back to the trail
        </Link>
        <header className="et-hero">
          <Tilet height={14} palette="ink" />
          <div className="et-hero-body">
            <p className="et-hero-kicker" lang="am">
              {now ? `ዛሬ ${WEEKDAY_FULL[now.getDay()]}` : 'ዛሬ'}
              <span> · Today</span>
            </p>
            <h1 className="et-date-big" lang="am">
              {today ? formatEthiopian(today).amharic : 'Ethiopian calendar'}
            </h1>
            {now && today && (
              <p className="holidays-today">
                {formatEthiopian(today).latin} in the Ethiopian calendar · {longDate.format(now)}
              </p>
            )}
          </div>
        </header>

        {today && shown && (
          <section className="calendar" aria-label="Ethiopian calendar">
            <MonthGrid month={shown} today={today} />
            <div className="calendar-nav">
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setOffset(o => o - 1)}>
                ← {MONTHS[shiftMonth(today, offset - 1).month - 1].name}
              </button>
              {offset !== 0 && (
                <button type="button" className="text-link small" onClick={() => setOffset(0)}>
                  This month
                </button>
              )}
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setOffset(o => o + 1)}>
                {MONTHS[shiftMonth(today, offset + 1).month - 1].name} →
              </button>
            </div>
          </section>
        )}

        <section className="holidays-section">
          <h2 className="h3">Holidays</h2>
          <ol className="holiday-list">
            {now &&
              upcomingHolidays(now).map(({ holiday, date, days }) => (
                <li key={holiday.id} className="holiday-item" style={{ '--holiday': holiday.color } as React.CSSProperties}>
                  <DateTile date={date} color={holiday.color} />
                  <div className="holiday-item-body">
                    <h3 className="holiday-name">
                      <Link href={`/holidays/${holiday.id}`}>
                        {holiday.name} <span lang="am">{holiday.amharic}</span>
                      </Link>
                    </h3>
                    <p className="small muted">
                      {holiday.about}, {countdown(days)}
                    </p>
                  </div>
                  <div className="holiday-item-actions">
                    <Link href={`/holidays/${holiday.id}`} className="text-link small">
                      Lesson
                    </Link>
                    <ShareGreeting holiday={holiday} className="btn btn-secondary btn-sm" />
                  </div>
                </li>
              ))}
          </ol>
        </section>

        <p className="holidays-note">
          The Ethiopian calendar has thirteen months: twelve of 30 days, and Pagume, with 5 days (6 in
          a leap year). The year begins in September and runs 7 or 8 years behind the Gregorian one.
        </p>
      </div>
    </main>
  );
}
