import { router, type Href } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Rect } from 'react-native-svg';
import { upcomingHolidays } from '@/lib/holidays';
import { proverbOfTheDay } from '@/lib/proverbs';
import { countdown, DateTile } from '@/components/holiday';
import { usePassport } from '@/components/passport';
import PassportStamp from '@/components/passport-stamp';
import { useProfile } from '@/lib/profile';
import Walia from '@/components/walia';
import { fonts, makeStyles, useColors } from '@/theme';
import OfflineNote from '@/components/offline-note';

// Everything beyond the trail, like the website's menu: the phrasebook,
// passport, the daily ፊደል puzzle, Merkato, proverbs, holidays and flashcards.

function Book() {
  const colors = useColors();
  return (
    <Svg width={44} height={44} viewBox="0 0 24 24">
      <Rect x={4} y={3} width={16} height={18} rx={3} fill={colors.blue} />
      <Path d="M8 8h8M8 12h8M8 16h5" stroke="#ffffff" strokeWidth={2.2} strokeLinecap="round" />
    </Svg>
  );
}

function Stack() {
  const colors = useColors();
  return (
    <Svg width={44} height={44} viewBox="0 0 24 24">
      <Rect x={6} y={3} width={13} height={16} rx={3} fill="#f6d3c4" transform="rotate(8 12 12)" />
      <Rect x={4} y={5} width={13} height={16} rx={3} fill={colors.primary} />
      <Path d="M7.5 11h6M7.5 15h4" stroke="#ffffff" strokeWidth={2.2} strokeLinecap="round" />
    </Svg>
  );
}

/** A market basket under a striped awning. */
function Basket() {
  const colors = useColors();
  return (
    <Svg width={44} height={44} viewBox="0 0 24 24">
      <Rect x={3} y={3} width={18} height={5} rx={2} fill={colors.primary} />
      <Path d="M7 3v5M11 3v5M15 3v5M19 3v5" stroke="#fff4e8" strokeWidth={1.6} />
      <Path d="M5 12h14l-1.6 8H6.6z" fill="#b07a4a" />
      <Path d="M8 12l2-3M16 12l-2-3" stroke="#6b4425" strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  );
}

/** Three puzzle tiles: the colours of a good guess. */
function Tiles() {
  const colors = useColors();
  return (
    <Svg width={48} height={20} viewBox="0 0 48 20">
      <Rect x={0} y={2} width={14} height={16} rx={4} fill={colors.green} />
      <Rect x={17} y={2} width={14} height={16} rx={4} fill={colors.blue} />
      <Rect x={34} y={2} width={14} height={16} rx={4} fill={colors.gold} />
    </Svg>
  );
}

function Row({ title, text, art, href, tint }: { title: string; text: string; art: ReactNode; href: Href; tint: string }) {
  const styles = useStyles();
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
  const styles = useStyles();
  const colors = useColors();
  const now = new Date();
  const today = proverbOfTheDay(now);
  const soon = upcomingHolidays(now)[0];
  const stamps = usePassport(useProfile()?.track ?? 'amharic');
  const got = stamps.filter(e => e.earned);
  const nextStamp = stamps.find(e => !e.earned);
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.page}>
        <Text style={styles.heading}>Explore</Text>
        <OfflineNote text="You’re offline. Proverbs, holidays and the phrasebook still work, but sounds and pictures need the internet." />

        <Pressable onPress={() => router.push('/explore/proverbs')} style={({ pressed }) => [styles.today, pressed && styles.rowDown]} accessibilityRole="button">
          <Text style={styles.todayKicker}>Today’s proverb</Text>
          <Text style={styles.todayAm}>{today.amharic}</Text>
          <Text style={styles.todayTr}>{today.transliteration}</Text>
          <Text style={styles.todayAsk}>What does it mean? Crack it with Walia.</Text>
          <View style={styles.todayWalia} pointerEvents="none">
            <Walia mood="thinking" size={74} />
          </View>
        </Pressable>

        <Row
          title="Your passport"
          text={`${got.length} of ${stamps.length} stamps. ${nextStamp ? `Finish Camp ${nextStamp.camp} to stamp ${nextStamp.stamp.name}.` : 'Every stamp collected. ጎበዝ!'}`}
          art={<PassportStamp stamp={(got[got.length - 1] ?? nextStamp ?? stamps[0]).stamp} earned={got.length > 0} size={56} tilt={-6} />}
          href="/explore/passport"
          tint="#eef3f8"
        />
        <Row title="Daily ፊደል puzzle" text="Guess today’s three-letter word in six tries. A new one every day." art={<Tiles />} href="/explore/puzzle" tint="#eef8ea" />
        <Row title="Bargain at Merkato" text="Haggle at three market stalls: ask the price, catch the number, make an offer." art={<Basket />} href="/explore/merkato" tint="#fdf0e6" />
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

const useStyles = makeStyles(c => ({
  safe: { flex: 1, backgroundColor: c.bg },
  page: { padding: 16, gap: 14, paddingBottom: 40 },
  heading: { fontFamily: fonts.black, fontSize: 32, color: c.ink },
  today: { padding: 18, paddingRight: 96, gap: 4, borderRadius: 22, borderWidth: 2, borderTopWidth: 8, borderBottomWidth: 5, borderColor: c.line, borderTopColor: c.gold, backgroundColor: '#ffffff' },
  todayKicker: { fontFamily: fonts.heavy, fontSize: 12, color: c.goldShadow, textTransform: 'uppercase', letterSpacing: 0.6 },
  todayAm: { fontFamily: fonts.amharicBold, fontSize: 22, lineHeight: 32, color: c.ink },
  todayTr: { fontFamily: fonts.bold, fontSize: 14, color: c.primary },
  todayAsk: { fontFamily: fonts.bold, fontSize: 14, color: c.muted, marginTop: 4 },
  todayWalia: { position: 'absolute', right: 12, bottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14, borderRadius: 20, borderWidth: 2, borderBottomWidth: 5, borderColor: c.line, backgroundColor: '#ffffff' },
  rowDown: { borderBottomWidth: 2, marginTop: 3 },
  art: { width: 64, height: 64, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  rowText: { flex: 1, gap: 2 },
  rowTitle: { fontFamily: fonts.black, fontSize: 19, color: c.ink },
  rowBody: { fontFamily: fonts.bold, fontSize: 14, lineHeight: 19, color: c.muted },
}));
