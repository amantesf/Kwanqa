import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { courseCatalog, courseContent } from '@/lib/courses';
import Lesson from '@/components/lesson';
import { campColors, fonts, makeStyles } from '@/theme';

// One lesson's phrases and dialogue (from a trail stone), or every lesson in
// the camp (from the camp banner's "Phrases"). Tap the speaker to hear a line.

export default function Camp() {
  const styles = useStyles();
  const { slug, lesson } = useLocalSearchParams<{ slug: string; lesson?: string }>();
  const camp = courseCatalog.find(c => c.slug === slug);
  const course = courseContent[slug];
  if (!camp || !course) return null;

  const campIdx = courseCatalog.filter(c => c.track === camp.track).sort((a, b) => a.part - b.part).indexOf(camp);
  const look = campColors[campIdx % campColors.length];
  const one = lesson !== undefined ? Number(lesson) : null;
  const shown = one !== null && course.sections[one] ? [one] : course.sections.map((_, i) => i);

  return (
    <View style={styles.screen}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.page}>
        <Stack.Screen options={{ title: `Camp ${camp.part}` }} />
        <View style={[styles.banner, { backgroundColor: look.color, borderBottomColor: look.shadow }]}>
          <Text style={styles.bannerKicker}>{one !== null ? `Camp ${camp.part}` : `Camp ${camp.part} · Phrases`}</Text>
          <Text style={styles.bannerTitle}>{camp.description}</Text>
        </View>
        {shown.map(i => (
          <Lesson key={i} lesson={course.sections[i]} number={i + 1} track={camp.track} />
        ))}
      </ScrollView>
      {one !== null ? (
        <SafeAreaView edges={['bottom']} style={styles.footer}>
          <Pressable
            onPress={() => router.push({ pathname: '/practice', params: { slug, lesson: String(one) } })}
            style={({ pressed }) => [styles.start, pressed && styles.startDown]}
            accessibilityRole="button"
          >
            <Text style={styles.startText}>Start practice</Text>
          </Pressable>
        </SafeAreaView>
      ) : null}
    </View>
  );
}

const useStyles = makeStyles(c => ({
  screen: { flex: 1, backgroundColor: c.bg },
  footer: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12, borderTopWidth: 2, borderTopColor: c.line, backgroundColor: c.bg },
  start: { minHeight: 52, borderRadius: 16, borderBottomWidth: 5, borderBottomColor: c.primaryShadow, backgroundColor: c.primary, alignItems: 'center', justifyContent: 'center' },
  startDown: { borderBottomWidth: 0, marginTop: 5 },
  startText: { fontFamily: fonts.black, fontSize: 16, color: '#ffffff', textTransform: 'uppercase', letterSpacing: 0.8 },
  page: { padding: 16, gap: 24, paddingBottom: 48 },
  banner: { borderRadius: 18, borderBottomWidth: 5, padding: 16, gap: 4 },
  bannerKicker: { fontFamily: fonts.heavy, fontSize: 13, color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase', letterSpacing: 0.4 },
  bannerTitle: { fontFamily: fonts.black, fontSize: 19, lineHeight: 24, color: '#ffffff' },
}));
