import { Share, StyleSheet, Text, View } from 'react-native';
import { MONTHS, geezNumber, toEthiopian } from '@/lib/ethiopianCalendar';
import type { Holiday } from '@/lib/holidays';
import Button from '@/components/button';
import { fonts } from '@/theme';

// Small pieces shared by the holidays screens (the website's HolidayCards.tsx).

export function countdown(days: number) {
  if (days === 0) return 'today';
  if (days === 1) return 'tomorrow';
  if (days === -1) return 'yesterday';
  return `in ${days} days`;
}

const shortDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });

/** A small calendar page: the Ethiopian month on top, the day in Ge'ez numerals. */
export function DateTile({ date, color }: { date: Date; color: string }) {
  const et = toEthiopian(date);
  return (
    <View style={styles.tile}>
      <Text style={[styles.tileMonth, { color }]}>{MONTHS[et.month - 1].amharic}</Text>
      <Text style={styles.tileDay}>{geezNumber(et.day)}</Text>
      <Text style={styles.tileGreg}>{shortDate.format(date)}</Text>
    </View>
  );
}

/** Share a holiday greeting with the phone's share sheet. */
export function ShareGreeting({ holiday, tone = 'plain' }: { holiday: Holiday; tone?: 'plain' | 'primary' }) {
  return (
    <Button
      label="Send greeting"
      tone={tone}
      onPress={() => void Share.share({ message: `${holiday.greeting.amharic}\n${holiday.greeting.english}\n\nkwanqa.com` }).catch(() => {})}
    />
  );
}

const styles = StyleSheet.create({
  tile: { width: 64, paddingTop: 8, paddingBottom: 7, alignItems: 'center', gap: 1, borderRadius: 14, borderWidth: 1, borderColor: '#ece4d8', backgroundColor: '#ffffff' },
  tileMonth: { fontFamily: fonts.amharicBold, fontSize: 12, lineHeight: 17 },
  tileDay: { fontFamily: fonts.amharicBold, fontSize: 22, lineHeight: 28, color: '#241a14' },
  tileGreg: { fontFamily: fonts.heavy, fontSize: 10, letterSpacing: 0.8, textTransform: 'uppercase', color: '#b5a38f' },
});
