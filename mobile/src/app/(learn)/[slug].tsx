import { Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { amharicAudio } from '@/lib/amharicAudio';
import { courseCatalog, courseContent, type LessonSection } from '@/lib/courses';
import { play } from '@/components/sound';
import Speaker from '@/components/speaker';
import Walia from '@/components/walia';
import { campColors, colors, fonts } from '@/theme';

// One lesson's phrases and dialogue (from a trail stone), or every lesson in
// the camp (from the camp banner's "Phrases"). Tap the speaker to hear a line.

type Line = { amharic: string; transliteration: string; english: string; speaker?: 'A' | 'B' };

function LineCard({ line }: { line: Line }) {
  const audio = amharicAudio(line.amharic);
  return (
    <View style={[styles.line, line.speaker === 'B' && styles.lineB]}>
      <View style={styles.lineText}>
        <Text style={styles.amharic}>{line.amharic}</Text>
        <Text style={styles.roman}>{line.transliteration}</Text>
        <Text style={styles.english}>{line.english}</Text>
      </View>
      {audio ? <Speaker onPress={() => play(audio)} label={`Hear ${line.english}`} /> : null}
    </View>
  );
}

function Lesson({ lesson, number }: { lesson: LessonSection; number: number }) {
  return (
    <View style={styles.lesson}>
      <Text style={styles.kicker}>Lesson {number}</Text>
      <Text style={styles.title}>{lesson.title.replace(/^Lesson \d+ – /, '')}</Text>
      {lesson.description ? <Text style={styles.description}>{lesson.description}</Text> : null}
      {(lesson.phrases ?? []).map(p => (
        <LineCard key={p.amharic + p.english} line={p} />
      ))}
      {lesson.dialogue?.length ? <Text style={styles.subhead}>Conversation</Text> : null}
      {(lesson.dialogue ?? []).map((d, i) => (
        <LineCard key={i} line={d} />
      ))}
      {lesson.note ? (
        <View style={styles.note}>
          <Walia pose="happy" size={54} />
          <Text style={styles.noteText}>{lesson.note}</Text>
        </View>
      ) : null}
    </View>
  );
}

export default function Camp() {
  const { slug, lesson } = useLocalSearchParams<{ slug: string; lesson?: string }>();
  const camp = courseCatalog.find(c => c.slug === slug);
  const course = courseContent[slug];
  if (!camp || !course) return null;

  const campIdx = courseCatalog.filter(c => c.track === camp.track).sort((a, b) => a.part - b.part).indexOf(camp);
  const look = campColors[campIdx % campColors.length];
  const one = lesson !== undefined ? Number(lesson) : null;
  const shown = one !== null && course.sections[one] ? [one] : course.sections.map((_, i) => i);

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.page}>
      <Stack.Screen options={{ title: `Camp ${camp.part}` }} />
      <View style={[styles.banner, { backgroundColor: look.color, borderBottomColor: look.shadow }]}>
        <Text style={styles.bannerKicker}>{one !== null ? `Camp ${camp.part}` : `Camp ${camp.part} · Phrases`}</Text>
        <Text style={styles.bannerTitle}>{camp.description}</Text>
      </View>
      {shown.map(i => (
        <Lesson key={i} lesson={course.sections[i]} number={i + 1} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: 16, gap: 24, paddingBottom: 48 },
  banner: { borderRadius: 18, borderBottomWidth: 5, padding: 16, gap: 4 },
  bannerKicker: { fontFamily: fonts.heavy, fontSize: 13, color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase', letterSpacing: 0.4 },
  bannerTitle: { fontFamily: fonts.black, fontSize: 19, lineHeight: 24, color: '#ffffff' },
  lesson: { gap: 10 },
  kicker: { fontFamily: fonts.heavy, fontSize: 13, color: colors.primary, textTransform: 'uppercase', letterSpacing: 0.4 },
  title: { fontFamily: fonts.black, fontSize: 24, lineHeight: 30, color: colors.ink },
  description: { fontFamily: fonts.body, fontSize: 16, lineHeight: 22, color: colors.muted },
  subhead: { fontFamily: fonts.black, fontSize: 18, color: colors.ink, marginTop: 6 },
  line: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 16, borderWidth: 2, borderBottomWidth: 4, borderColor: colors.line, backgroundColor: colors.bg },
  lineB: { backgroundColor: colors.bgSoft },
  lineText: { flex: 1, gap: 2 },
  amharic: { fontFamily: fonts.amharicBold, fontSize: 21, lineHeight: 30, color: colors.ink },
  roman: { fontFamily: fonts.bold, fontSize: 15, color: colors.primary },
  english: { fontFamily: fonts.body, fontSize: 15, color: colors.muted },
  note: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: 16, backgroundColor: colors.primarySoft },
  noteText: { flex: 1, fontFamily: fonts.bold, fontSize: 15, lineHeight: 21, color: colors.ink },
});
