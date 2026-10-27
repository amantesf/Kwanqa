import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { nextLesson, trackCourses, useClimb } from '@/lib/climb';
import { amharicAudio } from '@/lib/amharicAudio';
import { courseContent, type Track } from '@/lib/courses';
import { englishAudioUrl, isSpeakableEnglish } from '@/lib/englishAudio';
import { useProfile } from '@/lib/profile';
import { play } from '@/components/sound';
import Speaker from '@/components/speaker';
import Walia from '@/components/walia';
import { campColors, colors, fonts } from '@/theme';

// A guide to a whole camp, like the website's phrasebook (components/Phrasebook.tsx):
// every lesson's phrases and dialogue on one page. It opens on the camp being
// climbed; "Quiz me" hides the meanings until tapped.

export default function Phrasebook() {
  const climb = useClimb();
  const profile = useProfile();
  const [track, setTrack] = useState<Track>(profile?.track ?? 'amharic');
  const english = track === 'english'; // English first, with the Amharic meaning underneath
  const camps = trackCourses(track);
  const next = nextLesson(climb, track);
  const [picked, setPicked] = useState<string | null>(null);
  const camp = camps.find(c => c.slug === picked) ?? camps.find(c => c.slug === next?.slug) ?? camps[camps.length - 1];
  const campIdx = camps.indexOf(camp);
  const course = courseContent[camp.slug];
  const look = campColors[campIdx % campColors.length];
  const [quiz, setQuiz] = useState(false);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  // the language being learned is the one that's spoken
  const say = (text: string) => (english ? (isSpeakableEnglish(text) ? englishAudioUrl(text) : null) : amharicAudio(text));

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <View style={styles.tracks}>
        {(['amharic', 'english'] as Track[]).map(t => (
          <Pressable
            key={t}
            onPress={() => {
              setTrack(t);
              setPicked(null);
            }}
            style={[styles.chip, track === t && styles.chipOn]}
          >
            <Text style={[styles.chipText, track === t && styles.chipTextOn]}>{t === 'amharic' ? 'Amharic' : 'English'}</Text>
          </Pressable>
        ))}
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.camps}>
        {camps.map((c, i) => (
          <Pressable
            key={c.slug}
            onPress={() => {
              setPicked(c.slug);
              setRevealed(new Set());
            }}
            style={[styles.chip, c.slug === camp.slug && styles.chipOn]}
          >
            <Text style={[styles.chipText, c.slug === camp.slug && styles.chipTextOn]}>Camp {i + 1}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={[styles.banner, { backgroundColor: look.color, borderBottomColor: look.shadow }]}>
        <Text style={styles.bannerKicker}>Phrasebook · Camp {campIdx + 1}</Text>
        <Text style={styles.bannerTitle}>{course.title}</Text>
        <Text style={styles.bannerText}>{camp.description}</Text>
      </View>

      <View style={styles.bar}>
        <Walia pose="happy" size={48} />
        <Text style={styles.barText}>
          {english
            ? 'Say each one out loud in English, then check the Amharic meaning.'
            : 'Say each one out loud. Use the transliteration as a bridge, not a crutch.'}
        </Text>
      </View>
      <View style={styles.toggle}>
        <Text style={styles.toggleText}>Quiz me</Text>
        <Switch
          value={quiz}
          onValueChange={on => {
            setQuiz(on);
            setRevealed(new Set());
          }}
          trackColor={{ true: colors.primary, false: colors.line }}
          thumbColor="#ffffff"
        />
      </View>

      {course.sections.map((lesson, li) => (
        <View key={lesson.title} style={styles.lesson}>
          <View style={styles.lessonHead}>
            <Text style={styles.num}>{li + 1}</Text>
            <View style={styles.flex}>
              <Text style={styles.lessonTitle}>{lesson.title.replace(/^Lesson \d+ – /, '')}</Text>
              {lesson.description ? <Text style={styles.lessonText}>{lesson.description}</Text> : null}
            </View>
          </View>

          {(lesson.phrases ?? []).map((phrase, pi) => {
            const key = `${li}-${pi}`;
            const hidden = quiz && !revealed.has(key);
            const audio = say(english ? phrase.english : phrase.amharic);
            return (
              <Pressable key={key} disabled={!quiz} onPress={() => setRevealed(r => new Set(r).add(key))} style={styles.row}>
                <View style={styles.flex}>
                  <Text style={english ? styles.mainEn : styles.mainAm}>{english ? phrase.english : phrase.amharic}</Text>
                  {!english ? <Text style={styles.roman}>{phrase.transliteration}</Text> : null}
                  <Text style={[styles.meaning, hidden && styles.hidden]}>{hidden ? 'Tap to reveal' : english ? phrase.amharic : phrase.english}</Text>
                </View>
                {audio ? <Speaker onPress={() => play(audio)} /> : null}
              </Pressable>
            );
          })}

          {lesson.dialogue?.length ? <Text style={styles.label}>Dialogue</Text> : null}
          {(lesson.dialogue ?? []).map((line, di) => {
            const audio = say(english ? line.english : line.amharic);
            return (
              <View key={di} style={[styles.line, line.speaker === 'B' && styles.lineB]}>
                <Text style={[styles.speakerTag, line.speaker === 'B' && styles.speakerTagB]}>{line.speaker}</Text>
                <View style={styles.flex}>
                  <Text style={english ? styles.mainEnSmall : styles.mainAmSmall}>{english ? line.english : line.amharic}</Text>
                  {!english ? <Text style={styles.roman}>{line.transliteration}</Text> : null}
                  <Text style={styles.meaning}>{english ? line.amharic : line.english}</Text>
                </View>
                {audio ? <Speaker onPress={() => play(audio)} /> : null}
              </View>
            );
          })}

          <Pressable onPress={() => router.push({ pathname: '/[slug]', params: { slug: camp.slug, lesson: String(li) } })} hitSlop={8}>
            <Text style={styles.link}>Practice this lesson</Text>
          </Pressable>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  page: { padding: 16, gap: 14, paddingBottom: 48 },
  tracks: { flexDirection: 'row', gap: 8 },
  camps: { gap: 8 },
  chip: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 12, borderWidth: 2, borderBottomWidth: 4, borderColor: colors.line },
  chipOn: { borderColor: colors.primaryBorder, backgroundColor: colors.primarySoft },
  chipText: { fontFamily: fonts.heavy, fontSize: 14, color: colors.muted },
  chipTextOn: { color: colors.primary },
  banner: { borderRadius: 18, borderBottomWidth: 5, padding: 16, gap: 4 },
  bannerKicker: { fontFamily: fonts.heavy, fontSize: 12, color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase', letterSpacing: 0.4 },
  bannerTitle: { fontFamily: fonts.black, fontSize: 20, lineHeight: 25, color: '#ffffff' },
  bannerText: { fontFamily: fonts.bold, fontSize: 14, color: 'rgba(255,255,255,0.9)' },
  bar: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  barText: { flex: 1, fontFamily: fonts.bold, fontSize: 14, lineHeight: 19, color: colors.muted },
  toggle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  toggleText: { fontFamily: fonts.heavy, fontSize: 15, color: colors.ink },
  lesson: { gap: 10, paddingTop: 6 },
  lessonHead: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  num: { width: 34, height: 34, borderRadius: 17, overflow: 'hidden', textAlign: 'center', lineHeight: 34, backgroundColor: colors.primary, color: '#ffffff', fontFamily: fonts.black, fontSize: 16 },
  lessonTitle: { fontFamily: fonts.black, fontSize: 20, color: colors.ink },
  lessonText: { fontFamily: fonts.bold, fontSize: 14, color: colors.muted },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 16, borderWidth: 2, borderBottomWidth: 4, borderColor: colors.line, backgroundColor: '#ffffff' },
  mainAm: { fontFamily: fonts.amharicBold, fontSize: 20, lineHeight: 29, color: colors.ink },
  mainEn: { fontFamily: fonts.black, fontSize: 18, color: colors.ink },
  mainAmSmall: { fontFamily: fonts.amharicBold, fontSize: 17, lineHeight: 25, color: colors.ink },
  mainEnSmall: { fontFamily: fonts.heavy, fontSize: 16, color: colors.ink },
  roman: { fontFamily: fonts.bold, fontSize: 14, color: colors.primary },
  meaning: { fontFamily: fonts.bold, fontSize: 15, color: colors.muted },
  hidden: { color: colors.blue },
  label: { fontFamily: fonts.heavy, fontSize: 12, color: colors.muted, textTransform: 'uppercase', letterSpacing: 0.6, marginTop: 4 },
  line: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 16, backgroundColor: colors.bgSoft },
  lineB: { backgroundColor: '#e6eefb' },
  speakerTag: { width: 26, height: 26, borderRadius: 13, overflow: 'hidden', textAlign: 'center', lineHeight: 26, backgroundColor: colors.primary, color: '#ffffff', fontFamily: fonts.black, fontSize: 13 },
  speakerTagB: { backgroundColor: colors.blue },
  link: { fontFamily: fonts.black, fontSize: 15, color: colors.blue, textTransform: 'uppercase', letterSpacing: 0.5, paddingVertical: 6 },
});
