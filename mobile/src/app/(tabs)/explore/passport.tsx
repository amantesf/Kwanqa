import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import type { Track } from '@/lib/courses';
import type { Stamp } from '@/lib/passport';
import { useProfile } from '@/lib/profile';
import { displayName, useAuth } from '@/auth';
import { TILTS, usePassport, type PassportEntry } from '@/components/passport';
import PassportStamp from '@/components/passport-stamp';
import PlaceLesson, { hasPlaceLesson } from '@/components/place-lesson';
import StampReveal from '@/components/stamp-reveal';
import Walia from '@/components/walia';
import { fonts, makeStyles, useColors } from '@/theme';

// The Kwanqa passport book, like the website's /passport (components/Passport.tsx):
// a stamp from a real place in Ethiopia for every camp finished. Tap a stamp
// to replay its celebration, or open its place's quick lesson.

export default function Passport() {
  const styles = useStyles();
  const colors = useColors();
  const params = useLocalSearchParams<{ track?: Track }>();
  const profile = useProfile();
  const { user } = useAuth();
  const [track, setTrack] = useState<Track>(params.track === 'english' || params.track === 'amharic' ? params.track : (profile?.track ?? 'amharic'));
  const entries = usePassport(track);
  const got = entries.filter(e => e.earned).length;
  const [lessonFor, setLessonFor] = useState<Stamp | null>(null);
  const [replay, setReplay] = useState<PassportEntry | null>(null);

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <View style={styles.cover}>
        <View style={styles.flex}>
          <Text style={styles.coverKicker}>ፓስፖርት · Kwanqa passport</Text>
          <Text style={styles.coverName}>{user ? displayName(user) : 'Traveller'}</Text>
          <Text style={styles.coverSub}>
            {got} of {entries.length} stamps · Finish a camp to stamp a new place in Ethiopia.
          </Text>
          <View style={styles.meter}>
            <View style={[styles.meterFill, { width: `${(got / Math.max(entries.length, 1)) * 100}%` }]} />
          </View>
        </View>
        <Walia pose={got === entries.length ? 'cheer' : 'wave'} size={86} />
      </View>

      <View style={styles.tabs}>
        {(['amharic', 'english'] as Track[]).map(t => (
          <Pressable key={t} onPress={() => setTrack(t)} style={[styles.tab, track === t && styles.tabOn]} accessibilityState={{ selected: track === t }}>
            <Text style={[styles.tabText, track === t && styles.tabTextOn]}>{t === 'amharic' ? 'Amharic course' : 'English course'}</Text>
          </Pressable>
        ))}
      </View>

      {entries.map((e, i) => (
        <View key={e.slug} style={[styles.pageCard, e.earned && styles.pageEarned]}>
          <Pressable disabled={!e.earned} onPress={() => setReplay(e)} accessibilityLabel={e.earned ? `Replay the ${e.stamp.name} stamp celebration` : undefined}>
            <PassportStamp stamp={e.stamp} earned={e.earned} size={112} tilt={e.earned ? TILTS[i % TILTS.length] : 0} />
          </Pressable>
          <View style={styles.flex}>
            <Text style={styles.camp}>
              Camp {e.camp} · {e.stamp.region}
            </Text>
            <Text style={styles.name}>
              {e.stamp.name} <Text style={[styles.nameAm, { color: e.earned ? e.stamp.ink : colors.muted }]}>{e.stamp.amharic}</Text>
            </Text>
            {e.earned ? (
              <>
                <Text style={styles.fact}>{e.stamp.fact}</Text>
                {hasPlaceLesson(e.stamp) ? (
                  <Pressable onPress={() => setLessonFor(e.stamp)} hitSlop={6}>
                    <Text style={[styles.lessonLink, { color: e.stamp.ink }]}>Quick lesson about {e.stamp.name}</Text>
                  </Pressable>
                ) : null}
              </>
            ) : (
              <Text style={styles.locked}>Finish Camp {e.camp} to collect this stamp.</Text>
            )}
          </View>
        </View>
      ))}

      {replay ? <StampReveal stamp={replay.stamp} camp={replay.camp} track={track} onClose={() => setReplay(null)} /> : null}

      <Modal visible={lessonFor !== null} transparent animationType="fade" onRequestClose={() => setLessonFor(null)}>
        <Pressable style={styles.backdrop} onPress={() => setLessonFor(null)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            {lessonFor ? <PlaceLesson stamp={lessonFor} onDone={() => setLessonFor(null)} /> : null}
          </Pressable>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}

const useStyles = makeStyles(c => ({
  flex: { flex: 1 },
  page: { padding: 16, gap: 14, paddingBottom: 48 },
  cover: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 18, borderRadius: 22, backgroundColor: '#1f3a52', borderBottomWidth: 5, borderBottomColor: '#14283a' },
  coverKicker: { fontFamily: fonts.amharicBold, fontSize: 13, color: '#ffc233' },
  coverName: { fontFamily: fonts.black, fontSize: 26, color: '#ffffff' },
  coverSub: { fontFamily: fonts.bold, fontSize: 13, lineHeight: 18, color: 'rgba(255,255,255,0.8)' },
  meter: { height: 10, borderRadius: 5, backgroundColor: 'rgba(255,255,255,0.2)', overflow: 'hidden', marginTop: 8 },
  meterFill: { height: '100%', borderRadius: 5, backgroundColor: '#ffc233' },
  tabs: { flexDirection: 'row', gap: 8 },
  tab: { flex: 1, paddingVertical: 9, alignItems: 'center', borderRadius: 14, borderWidth: 2, borderBottomWidth: 4, borderColor: c.line },
  tabOn: { borderColor: c.primaryBorder, backgroundColor: c.primarySoft },
  tabText: { fontFamily: fonts.heavy, fontSize: 14, color: c.muted },
  tabTextOn: { color: c.primary },
  pageCard: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14, borderRadius: 20, borderWidth: 2, borderBottomWidth: 5, borderColor: c.line, backgroundColor: '#fbf8f3' },
  pageEarned: { backgroundColor: '#ffffff' },
  camp: { fontFamily: fonts.heavy, fontSize: 11, color: c.muted, textTransform: 'uppercase', letterSpacing: 0.6 },
  name: { fontFamily: fonts.black, fontSize: 19, color: c.ink },
  nameAm: { fontFamily: fonts.amharicBold },
  fact: { fontFamily: fonts.bold, fontSize: 13, lineHeight: 19, color: c.ink, marginTop: 4 },
  lessonLink: { fontFamily: fonts.heavy, fontSize: 14, marginTop: 6 },
  locked: { fontFamily: fonts.bold, fontSize: 13, color: c.muted, marginTop: 4 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { padding: 20, paddingBottom: 36, borderTopLeftRadius: 24, borderTopRightRadius: 24, backgroundColor: '#ffffff' },
}));
