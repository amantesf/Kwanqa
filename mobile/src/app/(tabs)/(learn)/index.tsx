import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { climbStreak, hornLevel, isDone, nextLesson, trackCourses, useClimb, zoneForCamp } from '@/lib/climb';
import { courseContent, type Track } from '@/lib/courses';
import { REVIEW_SIZE, useMistakes } from '@/lib/mistakes';
import { Grass, Peak } from '@/components/icons';
import Stone, { type StoneKind, type StoneState } from '@/components/stone';
import Walia from '@/components/walia';
import { campColors, colors, fonts } from '@/theme';

// The trail: every camp's lessons as stones winding up the mountain, like the
// website's Learn page (components/CoursesRoadmap.tsx). Progress comes from the
// same climb as the website (lib/climb.ts), kept on this phone.

const TRACKS: { id: Track; label: string }[] = [
  { id: 'amharic', label: 'Amharic' },
  { id: 'english', label: 'English' },
];

// how far each stone sits from the middle, as on the website (components/Trail.tsx)
const WIND = [0, 70, 96, 70, 0, -70, -96, -70];

const lessonName = (title: string) => title.replace(/^Lesson \d+ – /, '');

type Stop = { key: string; kind: StoneKind; state: StoneState; label: string; open?: () => void; count?: number };

export default function Trail() {
  const [track, setTrack] = useState<Track>('amharic');
  const { width } = useWindowDimensions();
  const climb = useClimb();
  const mistakes = useMistakes();
  const camps = trackCourses(track);
  const next = nextLesson(climb, track);
  const horns = hornLevel(climb.grass);
  const streak = climbStreak(climb.days);
  // keep the widest bends inside narrow phones
  const bend = Math.min(1, (Math.min(width, 520) - 32 - 90) / 2 / 96);

  // Questions missed in a camp are asked again before the next camp opens.
  const lessonsOf = (slug: string) => courseContent[slug]?.sections ?? [];
  const campDone = (slug: string) => lessonsOf(slug).length > 0 && lessonsOf(slug).every((_, i) => isDone(climb, slug, i));
  const pendingIn = (slug: string) => mistakes[slug]?.length ?? 0;
  const currentCamp = next ? camps.findIndex(c => c.slug === next.slug) : camps.length;
  const lastCamp = camps[currentCamp - 1];
  const blocking = lastCamp && campDone(lastCamp.slug) && pendingIn(lastCamp.slug) > 0 ? lastCamp : null;

  const openLesson = (slug: string, lesson: number) => router.push({ pathname: '/[slug]', params: { slug, lesson: String(lesson) } });
  const openReview = (slug: string) => router.push({ pathname: '/practice', params: { slug, review: '1' } });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.top}>
        <View style={styles.tracks}>
          {TRACKS.map(t => (
            <Pressable key={t.id} onPress={() => setTrack(t.id)} style={[styles.track, track === t.id && styles.trackOn]} accessibilityState={{ selected: track === t.id }}>
              <Text style={[styles.trackText, track === t.id && styles.trackTextOn]}>{t.label}</Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.stats}>
          <View style={styles.stat} accessibilityLabel={`${streak.count} day climb streak`}>
            <Peak lit={streak.doneToday} size={26} />
            <Text style={[styles.statText, { color: streak.doneToday ? colors.primary : colors.muted }]}>{streak.count}</Text>
          </View>
          <View style={styles.stat} accessibilityLabel={`${climb.grass} grass`}>
            <Grass size={24} />
            <Text style={[styles.statText, { color: '#3a9a28' }]}>{climb.grass}</Text>
          </View>
          <View style={styles.stat} accessibilityLabel={`Horn level ${horns.level}`}>
            <Walia size={24} hornScale={horns.scale} />
            <Text style={[styles.statText, { color: '#843a18' }]}>{horns.level}</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.page}>
        {camps.map((camp, campIdx) => {
          const look = campColors[campIdx % campColors.length];
          const lessons = lessonsOf(camp.slug);
          const locked = campIdx > currentCamp && !lessons.some((_, i) => isDone(climb, camp.slug, i));
          const stops: Stop[] = lessons.map((lesson, i) => {
            const isNext = next?.slug === camp.slug && next.lesson === i;
            const state: StoneState = isDone(climb, camp.slug, i) ? 'done' : isNext ? (blocking ? 'locked' : 'current') : 'locked';
            return { key: `${camp.slug}:${i}`, kind: 'lesson', state, label: lessonName(lesson.title), open: () => openLesson(camp.slug, i) };
          });
          if (lessons.length >= 3) {
            const half = Math.ceil(lessons.length / 2);
            const reached = lessons.slice(0, half).every((_, i) => isDone(climb, camp.slug, i));
            stops.splice(half, 0, { key: `${camp.slug}:mesob`, kind: 'reward', state: reached ? 'done' : 'locked', label: 'Halfway mesob' });
          }
          const pending = campDone(camp.slug) ? pendingIn(camp.slug) : 0;
          if (pending > 0) {
            stops.push({
              key: `${camp.slug}:review`,
              kind: 'review',
              state: blocking?.slug === camp.slug ? 'current' : 'todo',
              label: `Review your mistakes from Camp ${campIdx + 1}`,
              count: Math.min(pending, REVIEW_SIZE),
              open: () => openReview(camp.slug),
            });
          }
          stops.push({ key: `${camp.slug}:trophy`, kind: 'trophy', state: campDone(camp.slug) && pending === 0 ? 'done' : 'locked', label: `Camp ${campIdx + 1} trophy` });

          return (
            <View key={camp.slug} style={styles.camp}>
              <Pressable
                onPress={() => router.push({ pathname: '/[slug]', params: { slug: camp.slug } })}
                style={({ pressed }) => [
                  styles.banner,
                  locked ? styles.bannerLocked : { backgroundColor: look.color, borderBottomColor: look.shadow },
                  pressed && styles.bannerDown,
                ]}
              >
                <Text style={[styles.bannerKicker, locked && styles.lockedText]}>
                  Camp {campIdx + 1} · {locked ? `Finish Camp ${campIdx} to unlock` : zoneForCamp(campIdx, camps.length).name}
                </Text>
                <Text style={[styles.bannerTitle, locked && styles.lockedTitle]}>{camp.description}</Text>
                <View style={[styles.bannerButton, locked ? styles.bannerButtonLocked : { borderColor: look.shadow }]}>
                  <Text style={[styles.bannerButtonText, locked && styles.lockedText]}>Phrases</Text>
                </View>
              </Pressable>

              {stops.map((stop, i) => {
                const x = WIND[i % WIND.length] * bend;
                const here = stop.state === 'current';
                return (
                  <View key={stop.key} style={styles.row}>
                    <View style={[styles.stop, { transform: [{ translateX: x }] }]}>
                      <View>
                        {here && (
                          // beside the stone, on the side with more room
                          <View style={[styles.walia, x >= 0 ? { right: 88 } : { left: 88 }]} pointerEvents="none">
                            <Walia pose="wave" size={84} hornScale={horns.scale} />
                          </View>
                        )}
                        {stop.count ? (
                          <View style={styles.count} pointerEvents="none">
                            <Text style={styles.countText}>{stop.count}</Text>
                          </View>
                        ) : null}
                        <Stone state={stop.state} kind={stop.kind} label={stop.label} onPress={stop.open} />
                      </View>
                      {stop.kind === 'lesson' || stop.kind === 'review' ? (
                        <Text style={[styles.label, here && styles.labelHere]}>{stop.label}</Text>
                      ) : null}
                    </View>
                  </View>
                );
              })}
            </View>
          );
        })}
        <Text style={styles.summit}>{next || blocking ? 'Summit · ራስ ዳሽን · 4,550 m' : 'You made it to the top of ራስ ዳሽን!'}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  top: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 10, gap: 10, borderBottomWidth: 2, borderBottomColor: colors.line },
  tracks: { flexDirection: 'row', gap: 8 },
  track: { flex: 1, paddingVertical: 9, borderRadius: 14, borderWidth: 2, borderBottomWidth: 4, borderColor: colors.line, alignItems: 'center' },
  trackOn: { borderColor: colors.primaryBorder, backgroundColor: colors.primarySoft },
  trackText: { fontFamily: fonts.heavy, fontSize: 15, color: colors.muted },
  trackTextOn: { color: colors.primary },
  stats: { flexDirection: 'row', justifyContent: 'space-around' },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statText: { fontFamily: fonts.black, fontSize: 17 },
  page: { padding: 16, paddingBottom: 48 },
  camp: { marginBottom: 28 },
  banner: { borderRadius: 18, borderBottomWidth: 5, padding: 16, paddingRight: 110, gap: 4, marginBottom: 24 },
  bannerLocked: { backgroundColor: colors.bgSoft, borderBottomColor: colors.line, borderWidth: 2, borderBottomWidth: 5, borderColor: colors.line },
  bannerDown: { borderBottomWidth: 2, marginTop: 3 },
  bannerKicker: { fontFamily: fonts.heavy, fontSize: 13, color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase', letterSpacing: 0.4 },
  bannerTitle: { fontFamily: fonts.black, fontSize: 19, lineHeight: 24, color: '#ffffff' },
  lockedText: { color: '#afafaf' },
  lockedTitle: { color: colors.muted },
  bannerButton: { position: 'absolute', right: 14, top: '50%', marginTop: -20, paddingHorizontal: 14, height: 40, justifyContent: 'center', borderRadius: 12, borderWidth: 2, borderBottomWidth: 4, backgroundColor: 'rgba(255,255,255,0.12)' },
  bannerButtonLocked: { borderColor: colors.line, backgroundColor: '#ffffff' },
  bannerButtonText: { fontFamily: fonts.heavy, fontSize: 14, color: '#ffffff' },
  row: { alignItems: 'center', minHeight: 124 },
  stop: { alignItems: 'center' },
  walia: { position: 'absolute', top: -14 },
  count: { position: 'absolute', zIndex: 2, top: -6, left: -4, minWidth: 26, height: 26, paddingHorizontal: 6, borderRadius: 13, backgroundColor: '#ff5a4e', borderWidth: 2, borderColor: '#ffffff', alignItems: 'center', justifyContent: 'center' },
  countText: { fontFamily: fonts.black, fontSize: 13, color: '#ffffff' },
  label: { marginTop: 10, maxWidth: 150, textAlign: 'center', fontFamily: fonts.heavy, fontSize: 13, lineHeight: 17, color: colors.muted },
  labelHere: { color: colors.ink },
  summit: { textAlign: 'center', fontFamily: fonts.heavy, color: colors.muted, marginTop: 8 },
});
