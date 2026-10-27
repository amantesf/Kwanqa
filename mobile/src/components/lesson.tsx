import { StyleSheet, Text, View } from 'react-native';
import { amharicAudio } from '@/lib/amharicAudio';
import type { LessonSection, Track } from '@/lib/courses';
import { englishAudioUrl, isSpeakableEnglish } from '@/lib/englishAudio';
import { play } from '@/components/sound';
import Speaker from '@/components/speaker';
import Walia from '@/components/walia';
import { colors, fonts } from '@/theme';

// A lesson's phrases, dialogue and tip, as on a trail stone or a holiday.
// The language being learned comes first and is the one spoken: Amharic in the
// Amharic course; English (with the Amharic meaning) in the English course.

type Line = { amharic: string; transliteration: string; english: string; speaker?: 'A' | 'B' };

function LineCard({ line, track }: { line: Line; track: Track }) {
  const english = track === 'english';
  const audio = english ? (isSpeakableEnglish(line.english) ? englishAudioUrl(line.english) : null) : amharicAudio(line.amharic);
  return (
    <View style={[styles.line, line.speaker === 'B' && styles.lineB]}>
      <View style={styles.lineText}>
        <Text style={english ? styles.mainEn : styles.amharic}>{english ? line.english : line.amharic}</Text>
        {english ? null : <Text style={styles.roman}>{line.transliteration}</Text>}
        <Text style={english ? styles.meaningAm : styles.english}>{english ? line.amharic : line.english}</Text>
      </View>
      {audio ? <Speaker onPress={() => play(audio)} label={`Hear ${line.english}`} /> : null}
    </View>
  );
}

export default function Lesson({ lesson, number, track }: { lesson: LessonSection; number?: number; track: Track }) {
  return (
    <View style={styles.lesson}>
      {number ? <Text style={styles.kicker}>Lesson {number}</Text> : null}
      <Text style={styles.title}>{lesson.title.replace(/^Lesson \d+ – /, '')}</Text>
      {lesson.description ? <Text style={styles.description}>{lesson.description}</Text> : null}
      {(lesson.phrases ?? []).map(p => (
        <LineCard key={p.amharic + p.english} line={p} track={track} />
      ))}
      {lesson.dialogue?.length ? <Text style={styles.subhead}>Conversation</Text> : null}
      {(lesson.dialogue ?? []).map((d, i) => (
        <LineCard key={i} line={d} track={track} />
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

const styles = StyleSheet.create({
  lesson: { gap: 10 },
  kicker: { fontFamily: fonts.heavy, fontSize: 13, color: colors.primary, textTransform: 'uppercase', letterSpacing: 0.4 },
  title: { fontFamily: fonts.black, fontSize: 24, lineHeight: 30, color: colors.ink },
  description: { fontFamily: fonts.body, fontSize: 16, lineHeight: 22, color: colors.muted },
  subhead: { fontFamily: fonts.black, fontSize: 18, color: colors.ink, marginTop: 6 },
  line: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 16, borderWidth: 2, borderBottomWidth: 4, borderColor: colors.line, backgroundColor: colors.bg },
  lineB: { backgroundColor: colors.bgSoft },
  lineText: { flex: 1, gap: 2 },
  amharic: { fontFamily: fonts.amharicBold, fontSize: 21, lineHeight: 30, color: colors.ink },
  mainEn: { fontFamily: fonts.black, fontSize: 19, lineHeight: 25, color: colors.ink },
  roman: { fontFamily: fonts.bold, fontSize: 15, color: colors.primary },
  english: { fontFamily: fonts.body, fontSize: 15, color: colors.muted },
  meaningAm: { fontFamily: fonts.amharic, fontSize: 16, lineHeight: 24, color: colors.muted },
  note: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: 16, backgroundColor: colors.primarySoft },
  noteText: { flex: 1, fontFamily: fonts.bold, fontSize: 15, lineHeight: 21, color: colors.ink },
});
