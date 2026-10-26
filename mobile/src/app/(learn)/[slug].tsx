import { Stack, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { amharicAudio } from '@/lib/amharicAudio';
import { courseCatalog, courseContent } from '@/lib/courses';
import { play } from '@/components/sound';
import { colors } from '@/theme';

// A camp's lessons, each with its phrases. Tap a phrase to hear it.
export default function Camp() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const camp = courseCatalog.find(c => c.slug === slug);
  const course = courseContent[slug];
  if (!camp || !course) return null;

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.page}>
      <Stack.Screen options={{ title: `Camp ${camp.part}` }} />
      <Text style={styles.heading}>{camp.description}</Text>
      {course.sections.map((lesson, i) => (
        <View key={lesson.title} style={styles.lesson}>
          <Text style={styles.number}>Lesson {i + 1}</Text>
          <Text style={styles.title}>{lesson.title}</Text>
          {lesson.description ? <Text style={styles.description}>{lesson.description}</Text> : null}
          {(lesson.phrases ?? []).map(p => {
            const audio = amharicAudio(p.amharic);
            return (
              <Pressable
                key={p.amharic + p.english}
                disabled={!audio}
                onPress={() => audio && play(audio)}
                style={({ pressed }) => [styles.phrase, pressed && styles.pressed]}
              >
                <Text style={styles.amharic}>{p.amharic}</Text>
                <Text style={styles.roman}>{p.transliteration}</Text>
                <Text style={styles.english}>{p.english}</Text>
              </Pressable>
            );
          })}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: 16, gap: 16 },
  heading: { fontSize: 22, fontWeight: '800', color: colors.ink },
  lesson: { gap: 8 },
  number: { fontSize: 13, fontWeight: '800', color: colors.primary, textTransform: 'uppercase' },
  title: { fontSize: 18, fontWeight: '700', color: colors.ink },
  description: { fontSize: 15, color: colors.muted },
  phrase: { padding: 12, borderRadius: 12, borderWidth: 2, borderColor: colors.line, gap: 2 },
  pressed: { backgroundColor: colors.primarySoft, borderColor: colors.primaryBorder },
  amharic: { fontSize: 20, fontWeight: '700', color: colors.ink },
  roman: { fontSize: 14, color: colors.primary },
  english: { fontSize: 15, color: colors.muted },
});
