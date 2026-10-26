import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { courseCatalog, courseContent, type Track } from '@/lib/courses';
import Stone, { type StoneKind, type StoneState } from '@/components/stone';
import Walia from '@/components/walia';
import { campColors, colors, fonts } from '@/theme';

// The trail: every camp's lessons as stones winding up the mountain, like the
// website's Learn page. Progress isn't saved in the app yet, so Walia waits at
// the first lesson and every stone can be opened.

const TRACKS: { id: Track; label: string }[] = [
  { id: 'amharic', label: 'Amharic' },
  { id: 'english', label: 'English' },
];

// how far each stone sits from the middle, as on the website (components/Trail.tsx)
const WIND = [0, 70, 96, 70, 0, -70, -96, -70];

const ZONES = [
  { below: 2800, name: 'Farmland foothills' },
  { below: 3300, name: 'Montane forest' },
  { below: 3800, name: 'Heather belt' },
  { below: Infinity, name: 'Afroalpine meadows' },
];
const zoneName = (camp: number, count: number) => {
  const span = (4550 - 2000) / count;
  return ZONES.find(z => 2000 + span * (camp + 0.5) < z.below)!.name;
};

const lessonName = (title: string) => title.replace(/^Lesson \d+ – /, '');

type Stop = { key: string; kind: StoneKind; state: StoneState; label: string; lesson?: number };

export default function Trail() {
  const [track, setTrack] = useState<Track>('amharic');
  const { width } = useWindowDimensions();
  const camps = courseCatalog.filter(c => c.track === track).sort((a, b) => a.part - b.part);
  // keep the widest bends inside narrow phones
  const bend = Math.min(1, (Math.min(width, 520) - 32 - 90) / 2 / 96);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.tracks}>
        {TRACKS.map(t => (
          <Pressable key={t.id} onPress={() => setTrack(t.id)} style={[styles.track, track === t.id && styles.trackOn]} accessibilityState={{ selected: track === t.id }}>
            <Text style={[styles.trackText, track === t.id && styles.trackTextOn]}>{t.label}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.page}>
        {camps.map((camp, campIdx) => {
          const look = campColors[campIdx % campColors.length];
          const lessons = courseContent[camp.slug]?.sections ?? [];
          const stops: Stop[] = lessons.map((lesson, i) => ({
            key: `${camp.slug}:${i}`,
            kind: 'lesson',
            state: campIdx === 0 && i === 0 ? 'current' : 'todo',
            label: lessonName(lesson.title),
            lesson: i,
          }));
          if (lessons.length >= 3) {
            stops.splice(Math.ceil(lessons.length / 2), 0, { key: `${camp.slug}:mesob`, kind: 'reward', state: 'locked', label: 'Halfway mesob' });
          }
          stops.push({ key: `${camp.slug}:trophy`, kind: 'trophy', state: 'locked', label: `Camp ${campIdx + 1} trophy` });

          return (
            <View key={camp.slug} style={styles.camp}>
              <Pressable
                onPress={() => router.push({ pathname: '/[slug]', params: { slug: camp.slug } })}
                style={({ pressed }) => [styles.banner, { backgroundColor: look.color, borderBottomColor: look.shadow }, pressed && styles.bannerDown]}
              >
                <Text style={styles.bannerKicker}>
                  Camp {campIdx + 1} · {zoneName(campIdx, camps.length)}
                </Text>
                <Text style={styles.bannerTitle}>{camp.description}</Text>
                <View style={[styles.bannerButton, { borderColor: look.shadow }]}>
                  <Text style={styles.bannerButtonText}>Phrases</Text>
                </View>
              </Pressable>

              {stops.map((stop, i) => {
                const x = WIND[i % WIND.length] * bend;
                return (
                  <View key={stop.key} style={styles.row}>
                    <View style={[styles.stop, { transform: [{ translateX: x }] }]}>
                      {stop.state === 'current' && (
                        <View style={[styles.walia, x >= 0 ? { right: 92 } : { left: 92 }]} pointerEvents="none">
                          <Walia pose="wave" size={84} hornScale={0.86} />
                        </View>
                      )}
                      <Stone
                        state={stop.state}
                        kind={stop.kind}
                        label={stop.label}
                        onPress={
                          stop.lesson === undefined
                            ? undefined
                            : () => router.push({ pathname: '/[slug]', params: { slug: camp.slug, lesson: String(stop.lesson) } })
                        }
                      />
                      {stop.kind === 'lesson' && <Text style={styles.label}>{stop.label}</Text>}
                    </View>
                  </View>
                );
              })}
            </View>
          );
        })}
        <Text style={styles.summit}>Summit · ራስ ዳሽን · 4,550 m</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  tracks: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 10, borderBottomWidth: 2, borderBottomColor: colors.line },
  track: { flex: 1, paddingVertical: 9, borderRadius: 14, borderWidth: 2, borderBottomWidth: 4, borderColor: colors.line, alignItems: 'center' },
  trackOn: { borderColor: colors.primaryBorder, backgroundColor: colors.primarySoft },
  trackText: { fontFamily: fonts.heavy, fontSize: 15, color: colors.muted },
  trackTextOn: { color: colors.primary },
  page: { padding: 16, paddingBottom: 48 },
  camp: { marginBottom: 28 },
  banner: { borderRadius: 18, borderBottomWidth: 5, padding: 16, paddingRight: 110, gap: 4, marginBottom: 24 },
  bannerDown: { borderBottomWidth: 2, marginTop: 3 },
  bannerKicker: { fontFamily: fonts.heavy, fontSize: 13, color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase', letterSpacing: 0.4 },
  bannerTitle: { fontFamily: fonts.black, fontSize: 19, lineHeight: 24, color: '#ffffff' },
  bannerButton: { position: 'absolute', right: 14, top: '50%', marginTop: -20, paddingHorizontal: 14, height: 40, justifyContent: 'center', borderRadius: 12, borderWidth: 2, borderBottomWidth: 4, backgroundColor: 'rgba(255,255,255,0.12)' },
  bannerButtonText: { fontFamily: fonts.heavy, fontSize: 14, color: '#ffffff' },
  row: { alignItems: 'center', minHeight: 124 },
  stop: { alignItems: 'center' },
  walia: { position: 'absolute', top: -14 },
  label: { marginTop: 10, maxWidth: 150, textAlign: 'center', fontFamily: fonts.heavy, fontSize: 13, lineHeight: 17, color: colors.muted },
  summit: { textAlign: 'center', fontFamily: fonts.heavy, color: colors.muted, marginTop: 8 },
});
