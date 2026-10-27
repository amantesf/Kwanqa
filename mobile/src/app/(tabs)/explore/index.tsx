import { router, type Href } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Rect } from 'react-native-svg';
import { upcomingHolidays } from '@/lib/holidays';
import { proverbOfTheDay } from '@/lib/proverbs';
import { countdown, DateTile } from '@/components/holiday';
import Walia from '@/components/walia';
import { colors, fonts } from '@/theme';

// Everything beyond the trail, like the website's menu: the phrasebook,
// proverbs, holidays and flashcards.

function Book() {
  return (
    <Svg width={44} height={44} viewBox="0 0 24 24">
      <Rect x={4} y={3} width={16} height={18} rx={3} fill={colors.blue} />
      <Path d="M8 8h8M8 12h8M8 16h5" stroke="#ffffff" strokeWidth={2.2} strokeLinecap="round" />
    </Svg>
  );
}

function Stack() {
  return (
    <Svg width={44} height={44} viewBox="0 0 24 24">
      <Rect x={6} y={3} width={13} height={16} rx={3} fill="#f6d3c4" transform="rotate(8 12 12)" />
      <Rect x={4} y={5} width={13} height={16} rx={3} fill={colors.primary} />
      <Path d="M7.5 11h6M7.5 15h4" stroke="#ffffff" strokeWidth={2.2} strokeLinecap="round" />
    </Svg>
  );
}

function Row({ title, text, art, href, tint }: { title: string; text: string; art: ReactNode; href: Href; tint: string }) {
  return (
    <Pressable onPress={() => router.push(href)} style={({ pressed }) => [styles.row, pressed && styles.rowDown]} accessibilityRole="button">
      <View style={[styles.art, { backgroundColor: tint }]}>{art}</View>
      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowBody}>{text}</Text>
      </View>
    </Pressable>
  );
}

export default function Explore() {
  const now = new Date();
  const today = proverbOfTheDay(now);
  const soon = upcomingHolidays(now)[0];
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.page}>
        <Text style={styles.heading}>Explore</Text>

        <Pressable onPress={() => router.push('/explore/proverbs')} style={({ pressed }) => [styles.today, pressed && styles.rowDown]} accessibilityRole="button">
          <Text style={styles.todayKicker}>Today’s proverb</Text>
          <Text style={styles.todayAm}>{today.amharic}</Text>
          <Text style={styles.todayTr}>{today.transliteration}</Text>
          <Text style={styles.todayAsk}>What does it mean? Crack it with Walia.</Text>
          <View style={styles.todayWalia} pointerEvents="none">
            <Walia mood="thinking" size={74} />
          </View>
        </Pressable>

        <Row title="Phrasebook" text="Every phrase from a camp on one page, with a quiz mode." art={<Book />} href="/explore/phrasebook" tint="#e6eefb" />
        <Row title="Proverbs" text="ተረትና ምሳሌ: crack their meaning, word by word." art={<Walia pose="happy" size={40} />} href="/explore/proverbs" tint="#fff6dc" />
        <Row
          title="Holidays"
          text={`The Ethiopian calendar, greetings to send, and a lesson for each holiday. Next: ${soon.holiday.name}, ${countdown(soon.days)}.`}
          art={<DateTile date={soon.date} color={soon.holiday.color} />}
          href="/explore/holidays"
          tint="#fbf5ec"
        />
        <Row title="Flashcards" text="Flip through each camp’s phrases until you know them all." art={<Stack />} href="/explore/cards" tint={colors.primarySoft} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  page: { padding: 16, gap: 14, paddingBottom: 40 },
  heading: { fontFamily: fonts.black, fontSize: 32, color: colors.ink },
  today: { padding: 18, paddingRight: 96, gap: 4, borderRadius: 22, borderWidth: 2, borderTopWidth: 8, borderBottomWidth: 5, borderColor: colors.line, borderTopColor: colors.gold, backgroundColor: '#ffffff' },
  todayKicker: { fontFamily: fonts.heavy, fontSize: 12, color: colors.goldShadow, textTransform: 'uppercase', letterSpacing: 0.6 },
  todayAm: { fontFamily: fonts.amharicBold, fontSize: 22, lineHeight: 32, color: colors.ink },
  todayTr: { fontFamily: fonts.bold, fontSize: 14, color: colors.primary },
  todayAsk: { fontFamily: fonts.bold, fontSize: 14, color: colors.muted, marginTop: 4 },
  todayWalia: { position: 'absolute', right: 12, bottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14, borderRadius: 20, borderWidth: 2, borderBottomWidth: 5, borderColor: colors.line, backgroundColor: '#ffffff' },
  rowDown: { borderBottomWidth: 2, marginTop: 3 },
  art: { width: 64, height: 64, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  rowText: { flex: 1, gap: 2 },
  rowTitle: { fontFamily: fonts.black, fontSize: 19, color: colors.ink },
  rowBody: { fontFamily: fonts.bold, fontSize: 14, lineHeight: 19, color: colors.muted },
});
