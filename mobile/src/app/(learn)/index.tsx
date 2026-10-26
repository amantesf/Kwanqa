import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { courseCatalog, lessonCount, type Track } from '@/lib/courses';
import { colors } from '@/theme';

const TRACKS: { id: Track; label: string }[] = [
  { id: 'amharic', label: 'Learn Amharic' },
  { id: 'english', label: 'Learn English' },
];

// The trail's camps, in order, for the chosen language.
export default function Camps() {
  const [track, setTrack] = useState<Track>('amharic');
  const camps = courseCatalog.filter(c => c.track === track).sort((a, b) => a.part - b.part);

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.page}>
      <View style={styles.tracks}>
        {TRACKS.map(t => (
          <Pressable key={t.id} onPress={() => setTrack(t.id)} style={[styles.track, track === t.id && styles.trackOn]}>
            <Text style={[styles.trackText, track === t.id && styles.trackTextOn]}>{t.label}</Text>
          </Pressable>
        ))}
      </View>
      {camps.map(c => (
        <Pressable
          key={c.slug}
          onPress={() => router.push({ pathname: '/[slug]', params: { slug: c.slug } })}
          style={({ pressed }) => [styles.camp, pressed && styles.pressed]}
        >
          <Text style={styles.part}>Camp {c.part}</Text>
          <Text style={styles.title}>{c.description}</Text>
          <Text style={styles.count}>{lessonCount(c.slug)} lessons</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: 16, gap: 12 },
  tracks: { flexDirection: 'row', gap: 8, marginBottom: 4 },
  track: { flex: 1, paddingVertical: 10, borderRadius: 12, borderWidth: 2, borderColor: colors.line, alignItems: 'center' },
  trackOn: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  trackText: { fontWeight: '700', color: colors.muted },
  trackTextOn: { color: colors.primary },
  camp: { padding: 16, borderRadius: 16, borderWidth: 2, borderColor: colors.line, borderBottomWidth: 4, gap: 4 },
  pressed: { backgroundColor: colors.bgSoft },
  part: { fontSize: 13, fontWeight: '800', color: colors.primary, textTransform: 'uppercase' },
  title: { fontSize: 17, fontWeight: '700', color: colors.ink },
  count: { fontSize: 14, color: colors.muted },
});
