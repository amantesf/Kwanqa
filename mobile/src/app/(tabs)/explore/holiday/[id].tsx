import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { daysBetween, holidayById } from '@/lib/holidays';
import { useProfile } from '@/lib/profile';
import Button from '@/components/button';
import { DateTile, ShareGreeting, countdown } from '@/components/holiday';
import Lesson from '@/components/lesson';
import { fonts, makeStyles } from '@/theme';

// A holiday's special lesson, like the website's (components/HolidayLesson.tsx),
// in the learner's course: Amharic learners learn the greetings; English
// learners learn to explain the holiday in English.

export default function HolidayLesson() {
  const styles = useStyles();
  const { id } = useLocalSearchParams<{ id: string }>();
  const profile = useProfile();
  const [now] = useState(() => new Date());
  const holiday = holidayById(id);
  if (!holiday) return null;
  const track = profile?.track ?? 'amharic';
  const thisYear = holiday.date(now.getFullYear());
  const next = daysBetween(now, thisYear) >= 0 ? thisYear : holiday.date(now.getFullYear() + 1);

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ title: holiday.name }} />
      <ScrollView contentContainerStyle={styles.page}>
        <View style={[styles.hero, { borderTopColor: holiday.color }]}>
          <View style={styles.heroTop}>
            <DateTile date={next} color={holiday.color} />
            <View style={styles.flex}>
              <Text style={styles.name}>
                {holiday.name} <Text style={[styles.am, { color: holiday.color }]}>{holiday.amharic}</Text>
              </Text>
              <Text style={styles.meta}>
                {holiday.about}, {countdown(daysBetween(now, next))}
              </Text>
            </View>
          </View>
          <Text style={styles.greeting}>{holiday.greeting.amharic}</Text>
          <Text style={styles.greetingEn}>{holiday.greeting.english}</Text>
          <ShareGreeting holiday={holiday} tone="primary" />
        </View>
        <Lesson lesson={holiday.lessons[track]} track={track} />
      </ScrollView>
      <SafeAreaView edges={['bottom']} style={styles.footer}>
        <Button label="Start practice" onPress={() => router.push({ pathname: '/practice', params: { holiday: holiday.id, track } })} />
      </SafeAreaView>
    </View>
  );
}

const useStyles = makeStyles(c => ({
  flex: { flex: 1 },
  screen: { flex: 1, backgroundColor: c.bg },
  page: { padding: 16, gap: 24, paddingBottom: 48 },
  hero: { gap: 10, padding: 16, borderRadius: 22, borderWidth: 2, borderTopWidth: 8, borderBottomWidth: 5, borderColor: c.line, backgroundColor: '#ffffff' },
  heroTop: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  name: { fontFamily: fonts.black, fontSize: 22, color: c.ink },
  am: { fontFamily: fonts.amharicBold },
  meta: { fontFamily: fonts.bold, fontSize: 14, color: c.muted },
  greeting: { fontFamily: fonts.amharicBold, fontSize: 20, lineHeight: 30, color: c.ink },
  greetingEn: { fontFamily: fonts.bold, fontSize: 15, lineHeight: 21, color: c.muted },
  footer: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12, borderTopWidth: 2, borderTopColor: c.line, backgroundColor: c.bg },
}));
