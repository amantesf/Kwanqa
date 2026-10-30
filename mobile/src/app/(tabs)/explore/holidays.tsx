import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { MONTHS, formatEthiopian, fromEthiopian, geezNumber, toEthiopian, type EthiopianDate } from '@/lib/ethiopianCalendar';
import { holidays, upcomingHolidays, type Holiday } from '@/lib/holidays';
import { DateTile, ShareGreeting, countdown } from '@/components/holiday';
import Tilet from '@/components/tilet';
import { fonts, makeStyles } from '@/theme';

// The Ethiopian calendar and every holiday in the order it comes up, like the
// website's /holidays (components/HolidayCalendar.tsx).

const WEEKDAY_SHORT = ['እሑ', 'ሰኞ', 'ማክ', 'ረቡ', 'ሐሙ', 'ዓር', 'ቅዳ'];
const WEEKDAY_FULL = ['እሑድ', 'ሰኞ', 'ማክሰኞ', 'ረቡዕ', 'ሐሙስ', 'ዓርብ', 'ቅዳሜ'];
const longDate = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
const monthDay = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });
const gregMonth = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' });
const INK = '#241a14';
const SAND = '#b5a38f';

/** Moves `months` Ethiopian months from a month (Pagume counts as the 13th). */
function shiftMonth({ year, month }: EthiopianDate, months: number): EthiopianDate {
  const index = year * 13 + month - 1 + months;
  return { year: Math.floor(index / 13), month: (index % 13) + 1, day: 1 };
}

/** Days in an Ethiopian month: 30, or 5–6 for Pagume. */
const monthLength = ({ year, month }: EthiopianDate) => (month < 13 ? 30 : year % 4 === 3 ? 6 : 5);

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

const openHoliday = (id: string) => router.push({ pathname: '/explore/holiday/[id]', params: { id } });

/** One Ethiopian month as a calendar grid, starting on Sunday. */
function MonthGrid({ month, today }: { month: EthiopianDate; today: EthiopianDate }) {
  const styles = useStyles();
  const first = fromEthiopian({ ...month, day: 1 });
  const length = monthLength(month);
  const marked = holidaysIn(month);
  const last = fromEthiopian({ ...month, day: length });
  const span = first.getMonth() === last.getMonth() ? gregMonth.format(first) : `${monthDay.format(first).split(' ')[0]} – ${gregMonth.format(last)}`;
  const cells: (number | null)[] = [...Array(first.getDay()).fill(null), ...Array.from({ length }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);

  return (
    <View style={styles.card}>
      <Tilet height={12} palette="ink" />
      <View style={styles.monthBody}>
        <Text style={styles.monthName}>
          {MONTHS[month.month - 1].amharic} {geezNumber(month.year)}
        </Text>
        <Text style={styles.monthSub}>
          {MONTHS[month.month - 1].name} {month.year} · {span}
        </Text>
        <View style={styles.week}>
          {WEEKDAY_SHORT.map(d => (
            <Text key={d} style={styles.weekday}>
              {d}
            </Text>
          ))}
        </View>
        {Array.from({ length: cells.length / 7 }, (_, row) => (
          <View key={row} style={styles.week}>
            {cells.slice(row * 7, row * 7 + 7).map((day, i) => {
              if (day === null) return <View key={`blank-${row}-${i}`} style={styles.day} />;
              const date = fromEthiopian({ ...month, day });
              const holiday = marked.get(day);
              const isToday = today.year === month.year && today.month === month.month && today.day === day;
              return (
                <Pressable
                  key={day}
                  disabled={!holiday}
                  onPress={() => holiday && openHoliday(holiday.id)}
                  style={[styles.day, holiday && { backgroundColor: `${holiday.color}1a` }, isToday && styles.today]}
                  accessibilityLabel={`${MONTHS[month.month - 1].name} ${day} (${monthDay.format(date)})${holiday ? `, ${holiday.name}` : ''}${isToday ? ', today' : ''}`}
                >
                  <Text style={[styles.dayGeez, holiday && { color: holiday.color }, isToday && styles.todayText]}>{geezNumber(day)}</Text>
                  <Text style={[styles.dayGreg, isToday && styles.todayGreg]}>{date.getDate() === 1 || day === 1 ? monthDay.format(date) : date.getDate()}</Text>
                </Pressable>
              );
            })}
          </View>
        ))}
        {[...marked].map(([day, holiday]) => (
          <Pressable key={holiday.id} onPress={() => openHoliday(holiday.id)} style={styles.feast}>
            <View style={[styles.dot, { backgroundColor: holiday.color }]} />
            <Text style={styles.feastText}>
              <Text style={styles.feastGeez}>{geezNumber(day)}</Text> {holiday.name}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export default function Holidays() {
  const styles = useStyles();
  const [now] = useState(() => new Date());
  const [offset, setOffset] = useState(0);
  const today = toEthiopian(now);
  const shown = shiftMonth(today, offset);

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <View style={styles.card}>
        <Tilet height={14} palette="ink" />
        <View style={styles.heroBody}>
          <Text style={styles.kicker}>
            ዛሬ {WEEKDAY_FULL[now.getDay()]} <Text style={styles.kickerEn}>· Today</Text>
          </Text>
          <Text style={styles.big}>{formatEthiopian(today).amharic}</Text>
          <Text style={styles.sub}>
            {formatEthiopian(today).latin} in the Ethiopian calendar · {longDate.format(now)}
          </Text>
        </View>
      </View>

      <MonthGrid month={shown} today={today} />
      <View style={styles.nav}>
        <Pressable onPress={() => setOffset(o => o - 1)} style={styles.navButton}>
          <Text style={styles.navText}>‹ {MONTHS[shiftMonth(today, offset - 1).month - 1].name}</Text>
        </Pressable>
        {offset !== 0 ? (
          <Pressable onPress={() => setOffset(0)} hitSlop={8}>
            <Text style={styles.thisMonth}>This month</Text>
          </Pressable>
        ) : null}
        <Pressable onPress={() => setOffset(o => o + 1)} style={styles.navButton}>
          <Text style={styles.navText}>{MONTHS[shiftMonth(today, offset + 1).month - 1].name} ›</Text>
        </Pressable>
      </View>

      <Text style={styles.heading}>Holidays</Text>
      {upcomingHolidays(now).map(({ holiday, date, days }) => (
        <View key={holiday.id} style={styles.item}>
          <Pressable onPress={() => openHoliday(holiday.id)} style={styles.itemTop}>
            <DateTile date={date} color={holiday.color} />
            <View style={styles.itemText}>
              <Text style={styles.itemName}>
                {holiday.name} <Text style={[styles.itemAm, { color: holiday.color }]}>{holiday.amharic}</Text>
              </Text>
              <Text style={styles.itemAbout}>
                {holiday.about}, {countdown(days)}
              </Text>
            </View>
          </Pressable>
          <View style={styles.itemActions}>
            <Pressable onPress={() => openHoliday(holiday.id)} style={styles.lessonLink}>
              <Text style={styles.lessonLinkText}>Lesson</Text>
            </Pressable>
            <View style={styles.flex}>
              <ShareGreeting holiday={holiday} />
            </View>
          </View>
        </View>
      ))}

      <Text style={styles.note}>
        The Ethiopian calendar has thirteen months: twelve of 30 days, and Pagume, with 5 days (6 in a leap year). The year begins in September and runs 7 or 8 years behind the Gregorian one.
      </Text>
    </ScrollView>
  );
}

const useStyles = makeStyles(c => ({
  flex: { flex: 1 },
  page: { padding: 16, gap: 14, paddingBottom: 48 },
  card: { overflow: 'hidden', borderRadius: 24, borderWidth: 1, borderColor: '#ece4d8', backgroundColor: '#ffffff' },
  heroBody: { padding: 18, gap: 4 },
  kicker: { fontFamily: fonts.amharicBold, fontSize: 14, color: c.primary },
  kickerEn: { fontFamily: fonts.heavy, color: SAND },
  big: { fontFamily: fonts.amharicBold, fontSize: 34, lineHeight: 46, color: INK },
  sub: { fontFamily: fonts.bold, fontSize: 14, lineHeight: 19, color: c.muted },
  monthBody: { padding: 14, paddingTop: 12, gap: 4 },
  monthName: { fontFamily: fonts.amharicBold, fontSize: 24, lineHeight: 34, color: INK, textAlign: 'center' },
  monthSub: { fontFamily: fonts.bold, fontSize: 13, color: SAND, textAlign: 'center', marginBottom: 8 },
  week: { flexDirection: 'row', gap: 4 },
  weekday: { flex: 1, textAlign: 'center', fontFamily: fonts.amharicBold, fontSize: 12, color: SAND, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#f1ebe2', marginBottom: 4 },
  day: { flex: 1, height: 50, borderRadius: 12, alignItems: 'center', justifyContent: 'center', gap: 1 },
  today: { backgroundColor: INK },
  dayGeez: { fontFamily: fonts.amharicBold, fontSize: 16, lineHeight: 22, color: INK },
  todayText: { color: '#ffffff' },
  dayGreg: { fontFamily: fonts.bold, fontSize: 10, color: SAND },
  todayGreg: { color: 'rgba(255,255,255,0.7)' },
  feast: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: 8 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  feastText: { fontFamily: fonts.heavy, fontSize: 14, color: INK },
  feastGeez: { fontFamily: fonts.amharicBold },
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  navButton: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 12, borderWidth: 2, borderBottomWidth: 4, borderColor: c.line },
  navText: { fontFamily: fonts.heavy, fontSize: 14, color: c.ink },
  thisMonth: { fontFamily: fonts.heavy, fontSize: 14, color: c.blue },
  heading: { fontFamily: fonts.black, fontSize: 24, color: c.ink, marginTop: 8 },
  item: { gap: 12, padding: 14, borderRadius: 20, borderWidth: 2, borderBottomWidth: 5, borderColor: c.line, backgroundColor: '#ffffff' },
  itemTop: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  itemText: { flex: 1, gap: 2 },
  itemName: { fontFamily: fonts.black, fontSize: 18, color: c.ink },
  itemAm: { fontFamily: fonts.amharicBold },
  itemAbout: { fontFamily: fonts.bold, fontSize: 14, color: c.muted },
  itemActions: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  lessonLink: { minHeight: 50, paddingHorizontal: 18, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  lessonLinkText: { fontFamily: fonts.black, fontSize: 16, color: c.blue, textTransform: 'uppercase', letterSpacing: 0.8 },
  note: { fontFamily: fonts.bold, fontSize: 13, lineHeight: 19, color: c.muted, textAlign: 'center', paddingHorizontal: 8 },
}));
