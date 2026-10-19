"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { showToast } from "@/components/Toaster";
import {
  MONTHS,
  formatEthiopian,
  geezNumber,
  toEthiopian,
} from "@/lib/ethiopianCalendar";
import {
  currentHoliday,
  holidayById,
  upcomingHolidays,
  type Holiday,
} from "@/lib/holidays";

// Today's Ethiopian date and the holiday season, for the learning pages.
// Dates depend on the visitor's own clock, so nothing renders on the server.
// Add ?holiday=meskel (or any holiday id) to a page to preview its season.

const noop = () => () => {};

/** "Now" in the browser, or null during server rendering. Honors the ?holiday= preview. */
export function useNow(): Date | null {
  const preview = useSyncExternalStore(
    noop,
    () => new URLSearchParams(window.location.search).get("holiday") ?? "",
    () => null,
  );
  if (preview === null) return null;
  const holiday = holidayById(preview);
  if (!holiday) return new Date();
  // Pretend it's two days before the holiday.
  const date = holiday.date(new Date().getFullYear());
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - 2, 12);
}

/** "in 3 days", "tomorrow", "today" */
export function countdown(days: number) {
  if (days === 0) return "today";
  if (days === 1) return "tomorrow";
  if (days === -1) return "yesterday";
  return `in ${days} days`;
}

const shortDate = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

/** A small calendar page: the Ethiopian month on top, the day in Ge'ez numerals. */
export function DateTile({ date, color }: { date: Date; color?: string }) {
  const et = toEthiopian(date);
  return (
    <div
      className="date-tile"
      style={
        color ? ({ "--holiday": color } as React.CSSProperties) : undefined
      }
      aria-hidden
    >
      <span className="date-tile-month" lang="am">
        {MONTHS[et.month - 1].amharic}
      </span>
      <span className="date-tile-day" lang="am">
        {geezNumber(et.day)}
      </span>
      <span className="date-tile-greg">{shortDate.format(date)}</span>
    </div>
  );
}

/** Share a holiday greeting with the phone's share sheet, or copy it. */
export function ShareGreeting({
  holiday,
  className = "btn btn-block",
}: {
  holiday: Holiday;
  className?: string;
}) {
  async function share() {
    const text = `${holiday.greeting.amharic}\n${holiday.greeting.english}\n\nkwanqa.com`;
    try {
      if (navigator.share) {
        await navigator.share({ text });
        return;
      }
      await navigator.clipboard.writeText(text);
      showToast("Greeting copied. Paste it to your family!");
    } catch {
      // the learner closed the share sheet
    }
  }

  return (
    <button type="button" className={className} onClick={share}>
      Send greeting
    </button>
  );
}

/** Rail card: today's Ethiopian date and the next holiday. */
export function EthiopianDateCard() {
  const now = useNow();
  if (!now) return null;
  const today = formatEthiopian(toEthiopian(now));
  const next = upcomingHolidays(now)[0];
  const inSeason = currentHoliday(now)?.holiday.id === next.holiday.id; // the season card already shows it
  return (
    <div className="rail-card rail-extra et-date-card">
      <div className="rail-card-head">
        <h3 className="rail-title">Ethiopian calendar</h3>
        <Link href="/holidays" className="rail-link">
          Holidays
        </Link>
      </div>
      <div>
        <strong className="et-date" lang="am">
          {today.amharic}
        </strong>
        <p className="small muted">{today.latin}</p>
      </div>
      {!inSeason && (
        <Link href={`/holidays/${next.holiday.id}`} className="et-next">
          <DateTile date={next.date} color={next.holiday.color} />
          <span>
            <strong>{next.holiday.name}</strong>
            <span className="small muted">
              {next.holiday.about}, {countdown(next.days)}
            </span>
          </span>
        </Link>
      )}
    </div>
  );
}

/** Rail card shown from a week before a holiday to the day after. */
export function HolidaySeasonCard() {
  const now = useNow();
  const season = now ? currentHoliday(now) : null;
  if (!season) return null;
  const { holiday, date, days } = season;
  return (
    <div
      className="rail-card holiday-card"
      style={{ "--holiday": holiday.color } as React.CSSProperties}
    >
      <div className="holiday-card-head">
        <DateTile date={date} color={holiday.color} />
        <div>
          <h3 className="rail-title">{days === 0 ? `Today is ${holiday.name}` : `${holiday.name} is ${countdown(days)}`}</h3>
          <p className="small muted">
            <span lang="am">{holiday.amharic}</span> · {holiday.about}
          </p>
        </div>
      </div>
      <p className="holiday-greeting" lang="am">
        {holiday.greeting.amharic}
      </p>
      <div className="holiday-actions">
        <ShareGreeting holiday={holiday} className="btn btn-sm" />
        <Link
          href={`/holidays/${holiday.id}`}
          className="btn btn-secondary btn-sm"
        >
          Lesson
        </Link>
      </div>
    </div>
  );
}

/** The holiday currently in season (for theming the trail), or null. */
export function useHolidaySeason() {
  const now = useNow();
  return now ? currentHoliday(now) : null;
}
