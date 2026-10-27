import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View, type LayoutChangeEvent, type NativeScrollEvent, type NativeSyntheticEvent, type ScrollViewInstance } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { BASE_ALTITUDE, climbStreak, hornLevel, isDone, nextLesson, SUMMIT_ALTITUDE, trackCourses, useClimb, zoneForCamp } from '@/lib/climb';
import { courseContent, type Track } from '@/lib/courses';
import { REVIEW_SIZE, useMistakes } from '@/lib/mistakes';
import { Grass, Peak } from '@/components/icons';
import Mountain, { type MountainCamp } from '@/components/mountain';
import Stone, { type StoneKind, type StoneState } from '@/components/stone';
import Walia from '@/components/walia';
import { campColors, colors, fonts } from '@/theme';

// The trail, like the website's Learn page (components/CoursesRoadmap.tsx and
// Trail.tsx): one mountain from the meadow at the trailhead up to the summit,
// with each camp's lessons as stones on a sandy footpath that climbs the page.
// The banner at the top names the camp you're looking at, and the trail opens
// where Walia is standing. Progress is the same climb as the website's.

const TRACKS: { id: Track; label: string }[] = [
  { id: 'amharic', label: 'Amharic' },
  { id: 'english', label: 'English' },
];

// how far each stone sits from the middle, row height, and where the stone sits in its row (as on the website)
const WIND = [0, 70, 96, 70, 0, -70, -96, -70];
const ROW = 124;
const STONE_Y = 44;
const STONE = 72;
const REACH = 120; // the path runs on past a camp's first and last stones to join the next camp
const DIVIDER = 64; // height of a camp's name pill, with its spacing

type Stop = { key: string; kind: StoneKind; state: StoneState; label: string; open?: () => void; count?: number };
type Box = { top: number; bottom: number };

export default function Trail() {
  const [track, setTrack] = useState<Track>('amharic');
  const { width, height: screenH } = useWindowDimensions();
  const climb = useClimb();
  const mistakes = useMistakes();
  const camps = trackCourses(track);
  const next = nextLesson(climb, track);
  const horns = hornLevel(climb.grass);
  const streak = climbStreak(climb.days);
  const bend = Math.min(1, (Math.min(width, 520) - 32 - 90) / 2 / 96); // keep the widest bends inside narrow phones

  // where things are inside the scrolling trail, for the mountain, the banner and the first scroll
  const [boxes, setBoxes] = useState<Record<string, Box>>({});
  const [summitBottom, setSummitBottom] = useState(0);
  const [contentH, setContentH] = useState(0);
  const [viewH, setViewH] = useState(screenH);
  const [scrollY, setScrollY] = useState<number | null>(null);
  const scroller = useRef<ScrollViewInstance>(null);
  const scrolledFor = useRef<string | null>(null);

  // Questions missed in a camp are asked again before the next camp opens.
  const lessonsOf = (slug: string) => courseContent[slug]?.sections ?? [];
  const campDone = (slug: string) => lessonsOf(slug).length > 0 && lessonsOf(slug).every((_, i) => isDone(climb, slug, i));
  const pendingIn = (slug: string) => mistakes[slug]?.length ?? 0;
  const currentCamp = next ? camps.findIndex(c => c.slug === next.slug) : camps.length;
  const lastCamp = camps[currentCamp - 1];
  const blocking = lastCamp && campDone(lastCamp.slug) && pendingIn(lastCamp.slug) > 0 ? lastCamp : null;
  const lockedAt = (idx: number) => idx > currentCamp && !lessonsOf(camps[idx].slug).some((_, i) => isDone(climb, camps[idx].slug, i));

  const openLesson = (slug: string, lesson: number) => router.push({ pathname: '/[slug]', params: { slug, lesson: String(lesson) } });
  const openReview = (slug: string) => router.push({ pathname: '/practice', params: { slug, review: '1' } });

  function stopsFor(campIdx: number): Stop[] {
    const camp = camps[campIdx];
    const lessons = lessonsOf(camp.slug);
    const stops: Stop[] = lessons.map((lesson, i) => {
      const isNext = next?.slug === camp.slug && next.lesson === i;
      const state: StoneState = isDone(climb, camp.slug, i) ? 'done' : isNext ? (blocking ? 'locked' : 'current') : 'locked';
      return { key: `${camp.slug}:${i}`, kind: 'lesson', state, label: lesson.title.replace(/^Lesson \d+ – /, ''), open: () => openLesson(camp.slug, i) };
    });
    // a mesob of grass waits halfway through each camp
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
    // a trophy marks the top of every camp
    stops.push({ key: `${camp.slug}:trophy`, kind: 'trophy', state: campDone(camp.slug) && pending === 0 ? 'done' : 'locked', label: `Camp ${campIdx + 1} trophy` });
    return stops;
  }

  const allStops = camps.map((_, idx) => stopsFor(idx));
  const xOf = (i: number) => WIND[i % WIND.length] * bend;
  const rowOf = (stops: Stop[], i: number) => stops.length - 1 - i; // the first lesson sits at the bottom

  // where Walia is standing, in the scrolling trail
  const here = (() => {
    for (let c = 0; c < camps.length; c++) {
      const i = allStops[c].findIndex(s => s.state === 'current');
      const box = boxes[camps[c].slug];
      if (i !== -1 && box) return box.top + DIVIDER + rowOf(allStops[c], i) * ROW + STONE_Y;
    }
    return null;
  })();

  // Open the trail where Walia is, not at the summit (again after switching course).
  const measured = camps.every(c => boxes[c.slug]) && contentH > 0;
  const hereKey = `${track}:${next?.slug}:${next?.lesson}`;
  useEffect(() => {
    if (!measured || scrolledFor.current === hereKey) return;
    scrolledFor.current = hereKey;
    const y = here ?? contentH; // at the summit, or before any camp opens: show the top or the trailhead
    scroller.current?.scrollTo({ y: Math.max(0, y - viewH * 0.5), animated: false });
  }, [measured, hereKey, here, contentH, viewH]);

  // The banner names (and takes the colour of) the camp you're scrolling through.
  const shownIdx = (() => {
    if (scrollY === null) return Math.min(currentCamp, camps.length - 1);
    if (scrollY + viewH >= contentH - 4) return 0; // at the trailhead: Camp 1
    const line = scrollY + viewH * 0.45;
    const hit = camps.findIndex(c => boxes[c.slug] && boxes[c.slug].top <= line && boxes[c.slug].bottom > line);
    return hit === -1 ? Math.min(currentCamp, camps.length - 1) : hit;
  })();
  const shown = camps[shownIdx];
  const shownLocked = shown && lockedAt(shownIdx);
  const look = campColors[shownIdx % campColors.length];

  const mountainCamps: MountainCamp[] = camps.filter(c => boxes[c.slug]).map(c => ({ ...boxes[c.slug], locked: lockedAt(camps.indexOf(c)) }));

  function onScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    setScrollY(e.nativeEvent.contentOffset.y);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.top}>
        <View style={styles.tracks}>
          {TRACKS.map(t => (
            <Pressable
              key={t.id}
              onPress={() => {
                setTrack(t.id);
                setBoxes({});
                setScrollY(null);
              }}
              style={[styles.track, track === t.id && styles.trackOn]}
              accessibilityState={{ selected: track === t.id }}
            >
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

      <View style={styles.flex} onLayout={e => setViewH(e.nativeEvent.layout.height)}>
        <ScrollView ref={scroller} onScroll={onScroll} scrollEventThrottle={32} onContentSizeChange={(_, h) => setContentH(h)}>
          {contentH > 0 && summitBottom > 0 ? (
            <View style={StyleSheet.absoluteFill} pointerEvents="none">
              <Mountain w={width} h={contentH} peakY={summitBottom + 110} camps={mountainCamps} />
            </View>
          ) : null}

          {/* Summit */}
          <View style={styles.summit} onLayout={e => setSummitBottom(e.nativeEvent.layout.y + e.nativeEvent.layout.height)}>
            <View style={styles.summitCard}>
              <Text style={styles.summitKicker}>
                Summit · ራስ ዳሽን · {SUMMIT_ALTITUDE.toLocaleString()} m
              </Text>
              <Text style={styles.summitTitle}>{next || blocking ? 'Finish every lesson to reach the summit' : 'You made it to the top!'}</Text>
              <Text style={styles.summitText}>Ras Dashen is the highest peak of the Simien Mountains and home of the Walia ibex.</Text>
            </View>
            {!next && !blocking ? <Walia pose="cheer" size={110} hornScale={horns.scale} /> : null}
          </View>

          {/* Camps, highest first so the trail climbs up the page */}
          {[...camps].reverse().map(camp => {
            const campIdx = camps.indexOf(camp);
            const zone = zoneForCamp(campIdx, camps.length);
            const locked = lockedAt(campIdx);
            const stops = allStops[campIdx];
            const blockH = stops.length * ROW;
            const point = (i: number) => ({ x: width / 2 + xOf(i), y: rowOf(stops, i) * ROW + STONE_Y + REACH });
            let path = '';
            stops.forEach((_, i) => {
              const { x, y } = point(i);
              const prev = i ? point(i - 1) : { x: width / 2, y: blockH + 2 * REACH };
              path += i === 0 ? `M ${prev.x} ${prev.y} C ${prev.x} ${prev.y - REACH / 2}, ${x} ${y + ROW / 2}, ${x} ${y}` : ` C ${prev.x} ${prev.y - ROW / 2}, ${x} ${y + ROW / 2}, ${x} ${y}`;
            });
            const last = point(stops.length - 1);
            path += ` C ${last.x} ${last.y - ROW / 2}, ${width / 2} ${REACH / 2}, ${width / 2} 0`;

            return (
              <View
                key={camp.slug}
                onLayout={(e: LayoutChangeEvent) => {
                  const { y, height } = e.nativeEvent.layout;
                  setBoxes(b => (b[camp.slug]?.top === y && b[camp.slug]?.bottom === y + height ? b : { ...b, [camp.slug]: { top: y, bottom: y + height } }));
                }}
              >
                <View style={styles.divider}>
                  <Text style={styles.dividerText}>
                    {locked ? `Camp ${campIdx + 1} · Finish Camp ${campIdx} to unlock` : `Camp ${campIdx + 1} · ${zone.name} · ${zone.from.toLocaleString()}–${zone.to.toLocaleString()} m`}
                  </Text>
                </View>
                <View style={{ height: blockH }}>
                  <Svg width={width} height={blockH + 2 * REACH} style={[styles.path, { top: -REACH }]} pointerEvents="none">
                    <Path d={path} stroke="#cdb47a" strokeWidth={34} strokeOpacity={0.45} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    <Path d={path} stroke="#f0e3bf" strokeWidth={26} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    <Path d={path} stroke="#ffffff" strokeWidth={8} strokeDasharray="1 17" fill="none" strokeLinecap="round" />
                  </Svg>
                  {stops.map((stop, i) => {
                    const x = xOf(i);
                    const isHere = stop.state === 'current';
                    return (
                      <View key={stop.key} style={[styles.stop, { top: rowOf(stops, i) * ROW + STONE_Y - STONE / 2, left: width / 2 + x - STONE / 2 }]}>
                        {isHere && (
                          // beside the stone, on the side with more room
                          <View style={[styles.walia, x >= 0 ? { right: STONE + 16 } : { left: STONE + 16 }]} pointerEvents="none">
                            <Walia pose="wave" size={92} hornScale={horns.scale} />
                          </View>
                        )}
                        {stop.count ? (
                          <View style={styles.count} pointerEvents="none">
                            <Text style={styles.countText}>{stop.count}</Text>
                          </View>
                        ) : null}
                        <Stone state={stop.state} kind={stop.kind} label={stop.label} onPress={stop.open} />
                      </View>
                    );
                  })}
                </View>
              </View>
            );
          })}

          {/* Trailhead */}
          <View style={styles.trailhead}>
            <Text style={styles.trailheadKicker}>Trailhead · {BASE_ALTITUDE.toLocaleString()} m</Text>
            <Text style={styles.trailheadText}>
              Your climb starts here. Finish lessons to earn grass (ሳር). It grows Walia’s horns and gives you energy when the climb gets tough.
            </Text>
          </View>
        </ScrollView>

        {shown ? (
          <Pressable
            onPress={() => router.push({ pathname: '/[slug]', params: { slug: shown.slug } })}
            style={({ pressed }) => [styles.banner, { backgroundColor: look.color, borderBottomColor: look.shadow }, pressed && styles.bannerDown]}
          >
            <Text style={styles.bannerKicker}>
              Camp {shownIdx + 1} · {shownLocked ? 'Locked' : zoneForCamp(shownIdx, camps.length).name}
            </Text>
            <Text style={styles.bannerTitle} numberOfLines={2}>
              {shown.description}
            </Text>
            <View style={[styles.bannerButton, { borderColor: look.shadow }]}>
              <Text style={styles.bannerButtonText}>Phrases</Text>
            </View>
          </Pressable>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  top: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 10, gap: 10, borderBottomWidth: 2, borderBottomColor: colors.line, backgroundColor: colors.bg },
  tracks: { flexDirection: 'row', gap: 8 },
  track: { flex: 1, paddingVertical: 9, borderRadius: 14, borderWidth: 2, borderBottomWidth: 4, borderColor: colors.line, alignItems: 'center' },
  trackOn: { borderColor: colors.primaryBorder, backgroundColor: colors.primarySoft },
  trackText: { fontFamily: fonts.heavy, fontSize: 15, color: colors.muted },
  trackTextOn: { color: colors.primary },
  stats: { flexDirection: 'row', justifyContent: 'space-around' },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statText: { fontFamily: fonts.black, fontSize: 17 },
  banner: { position: 'absolute', top: 10, left: 12, right: 12, borderRadius: 18, borderBottomWidth: 5, padding: 14, paddingRight: 108, gap: 2 },
  bannerDown: { borderBottomWidth: 2, top: 13 },
  bannerKicker: { fontFamily: fonts.heavy, fontSize: 12, color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase', letterSpacing: 0.4 },
  bannerTitle: { fontFamily: fonts.black, fontSize: 17, lineHeight: 22, color: '#ffffff' },
  bannerButton: { position: 'absolute', right: 12, top: '50%', marginTop: -19, paddingHorizontal: 12, height: 38, justifyContent: 'center', borderRadius: 12, borderWidth: 2, borderBottomWidth: 4, backgroundColor: 'rgba(255,255,255,0.12)' },
  bannerButtonText: { fontFamily: fonts.heavy, fontSize: 14, color: '#ffffff' },
  summit: { alignItems: 'center', gap: 6, paddingTop: 128, paddingHorizontal: 20, zIndex: 2 },
  summitCard: { alignItems: 'center', gap: 4, padding: 16, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.92)' },
  summitKicker: { fontFamily: fonts.heavy, fontSize: 12, color: '#4d5866', textTransform: 'uppercase', letterSpacing: 0.6 },
  summitTitle: { fontFamily: fonts.black, fontSize: 20, lineHeight: 25, color: colors.ink, textAlign: 'center' },
  summitText: { fontFamily: fonts.bold, fontSize: 14, lineHeight: 19, color: '#4d5866', textAlign: 'center', maxWidth: 320 },
  divider: { height: DIVIDER, alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  dividerText: {
    maxWidth: '90%',
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.94)',
    fontFamily: fonts.heavy,
    fontSize: 11,
    color: '#4d5866',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    textAlign: 'center',
  },
  path: { position: 'absolute', left: 0 },
  stop: { position: 'absolute', width: STONE, alignItems: 'center', zIndex: 1 },
  walia: { position: 'absolute', top: -34 },
  count: { position: 'absolute', zIndex: 2, top: -6, left: -4, minWidth: 26, height: 26, paddingHorizontal: 6, borderRadius: 13, backgroundColor: '#ff5a4e', borderWidth: 2, borderColor: '#ffffff', alignItems: 'center', justifyContent: 'center' },
  countText: { fontFamily: fonts.black, fontSize: 13, color: '#ffffff' },
  trailhead: { zIndex: 2, marginTop: 40, marginBottom: 60, marginHorizontal: 20, padding: 16, gap: 4, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.92)', alignItems: 'center' },
  trailheadKicker: { fontFamily: fonts.heavy, fontSize: 12, color: '#4d5866', textTransform: 'uppercase', letterSpacing: 0.6 },
  trailheadText: { fontFamily: fonts.bold, fontSize: 14, lineHeight: 20, color: colors.ink, textAlign: 'center' },
});
