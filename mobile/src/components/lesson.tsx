import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { amharicAudio } from '@/lib/amharicAudio';
import type { LessonSection, Track } from '@/lib/courses';
import { englishAudioUrl, isSpeakableEnglish } from '@/lib/englishAudio';
import { wordsOf, type GrammarCard } from '@/lib/grammar';
import { feel } from '@/haptics';
import { play } from '@/components/sound';
import Speaker from '@/components/speaker';
import Walia from '@/components/walia';
import { fonts, makeStyles } from '@/theme';

// A lesson's phrases, dialogue and tip, as on a trail stone or a holiday.
// The language being learned comes first and is the one spoken: Amharic in the
// Amharic course; English (with the Amharic meaning) in the English course.
// Amharic words can be tapped to see the pieces they're built from, and the
// lesson's grammar ("How it works", lib/grammar.ts) follows its phrases.

const ETHIOPIC = /[ሀ-፿]/;

/** An Amharic line with tappable words: a word we know the pieces of shows them underneath. */
function BrokenDownLine({ text }: { text: string }) {
  const styles = useStyles();
  const [open, setOpen] = useState<number | null>(null);
  const words = wordsOf(text);
  const shown = open !== null ? words[open]?.parts : null;
  return (
    <>
      <View style={styles.words}>
        {words.map((w, i) =>
          w.parts ? (
            <Pressable
              key={i}
              onPress={() => {
                feel('pick');
                setOpen(open === i ? null : i);
              }}
              accessibilityRole="button"
              accessibilityLabel={`${w.word}: show its parts`}
              accessibilityState={{ expanded: open === i }}
              hitSlop={4}
            >
              <Text style={[styles.amharic, styles.wordTap, open === i && styles.wordOpen]}>{w.word}</Text>
            </Pressable>
          ) : (
            <Text key={i} style={styles.amharic}>
              {w.word}
            </Text>
          ),
        )}
      </View>
      {shown ? (
        <View style={styles.parts}>
          {shown.map((part, i) => (
            <View key={i} style={styles.part}>
              <Text style={styles.partRoman}>{part.roman}</Text>
              <Text style={styles.partGloss}>{part.gloss}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </>
  );
}

/** A table cell like "ስሜ səme": the Amharic, with how it's said underneath. */
function Cell({ text, head }: { text: string; head?: boolean }) {
  const styles = useStyles();
  const [first, ...rest] = text.split(' ');
  const split = ETHIOPIC.test(first) && rest.length > 0;
  return (
    <View style={styles.cell}>
      <Text style={head ? styles.cellHead : split ? styles.cellAmharic : styles.cellText}>{split ? first : text}</Text>
      {split ? <Text style={styles.cellRoman}>{rest.join(' ')}</Text> : null}
    </View>
  );
}

/** "How it works": one grammar rule, a small table and examples from the lesson. */
function Grammar({ card }: { card: GrammarCard }) {
  const styles = useStyles();
  return (
    <View style={styles.grammar}>
      <Text style={styles.grammarTitle}>{card.title}</Text>
      <Text style={styles.grammarRule}>{card.rule}</Text>
      {card.table ? (
        <View style={styles.table}>
          {card.table.map((row, r) => (
            <View key={r} style={[styles.row, r > 0 && styles.rowLine]}>
              {row.map((cell, i) => (
                <Cell key={i} text={cell} head={r === 0 || i === 0} />
              ))}
            </View>
          ))}
        </View>
      ) : null}
      {card.examples.map(ex => (
        <View key={ex.amharic} style={styles.example}>
          <Text style={styles.exampleAmharic}>{ex.amharic}</Text>
          <Text style={styles.exampleText}>
            {ex.transliteration} · {ex.english}
          </Text>
        </View>
      ))}
      {card.tip ? <Text style={styles.grammarTip}>{card.tip}</Text> : null}
    </View>
  );
}

type Line = { amharic: string; transliteration: string; english: string; speaker?: 'A' | 'B' };

function LineCard({ line, track }: { line: Line; track: Track }) {
  const styles = useStyles();
  const english = track === 'english';
  const audio = english ? (isSpeakableEnglish(line.english) ? englishAudioUrl(line.english) : null) : amharicAudio(line.amharic);
  return (
    <View style={[styles.line, line.speaker === 'B' && styles.lineB]}>
      <View style={styles.lineText}>
        {english ? <Text style={styles.mainEn}>{line.english}</Text> : <BrokenDownLine text={line.amharic} />}
        {english ? null : <Text style={styles.roman}>{line.transliteration}</Text>}
        <Text style={english ? styles.meaningAm : styles.english}>{english ? line.amharic : line.english}</Text>
      </View>
      {audio ? <Speaker onPress={() => play(audio)} label={`Hear ${line.english}`} /> : null}
    </View>
  );
}

export default function Lesson({ lesson, number, track, grammar = [] }: { lesson: LessonSection; number?: number; track: Track; grammar?: GrammarCard[] }) {
  const styles = useStyles();
  return (
    <View style={styles.lesson}>
      {number ? <Text style={styles.kicker}>Lesson {number}</Text> : null}
      <Text style={styles.title}>{lesson.title.replace(/^Lesson \d+ – /, '')}</Text>
      {lesson.description ? <Text style={styles.description}>{lesson.description}</Text> : null}
      {(lesson.phrases ?? []).map(p => (
        <LineCard key={p.amharic + p.english} line={p} track={track} />
      ))}
      {grammar.length ? <Text style={styles.subhead}>How it works</Text> : null}
      {grammar.map(card => (
        <Grammar key={card.title} card={card} />
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

const useStyles = makeStyles(c => ({
  lesson: { gap: 10 },
  kicker: { fontFamily: fonts.heavy, fontSize: 13, color: c.primary, textTransform: 'uppercase', letterSpacing: 0.4 },
  title: { fontFamily: fonts.black, fontSize: 24, lineHeight: 30, color: c.ink },
  description: { fontFamily: fonts.body, fontSize: 16, lineHeight: 22, color: c.muted },
  subhead: { fontFamily: fonts.black, fontSize: 18, color: c.ink, marginTop: 6 },
  line: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 16, borderWidth: 2, borderBottomWidth: 4, borderColor: c.line, backgroundColor: c.bg },
  lineB: { backgroundColor: c.bgSoft },
  lineText: { flex: 1, gap: 2 },
  amharic: { fontFamily: fonts.amharicBold, fontSize: 21, lineHeight: 30, color: c.ink },
  mainEn: { fontFamily: fonts.black, fontSize: 19, lineHeight: 25, color: c.ink },
  roman: { fontFamily: fonts.bold, fontSize: 15, color: c.primary },
  english: { fontFamily: fonts.body, fontSize: 15, color: c.muted },
  meaningAm: { fontFamily: fonts.amharic, fontSize: 16, lineHeight: 24, color: c.muted },
  note: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: 16, backgroundColor: c.primarySoft },
  noteText: { flex: 1, fontFamily: fonts.bold, fontSize: 15, lineHeight: 21, color: c.ink },
  words: { flexDirection: 'row', flexWrap: 'wrap', columnGap: 7 },
  wordTap: { textDecorationLine: 'underline', textDecorationStyle: 'dotted', textDecorationColor: c.primaryBorder },
  wordOpen: { color: c.primary, textDecorationColor: c.primary },
  parts: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginVertical: 2 },
  part: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 10, backgroundColor: c.primarySoft },
  partRoman: { fontFamily: fonts.heavy, fontSize: 15, color: c.primary },
  partGloss: { fontFamily: fonts.bold, fontSize: 12, color: c.muted },
  grammar: { gap: 10, padding: 16, borderRadius: 18, borderWidth: 2, borderBottomWidth: 5, borderColor: c.line, backgroundColor: c.bg },
  grammarTitle: { fontFamily: fonts.black, fontSize: 18, lineHeight: 23, color: c.ink },
  grammarRule: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22, color: c.ink },
  table: { borderTopWidth: 0 },
  row: { flexDirection: 'row', paddingVertical: 6 },
  rowLine: { borderTopWidth: 2, borderTopColor: c.line },
  cell: { flex: 1, paddingRight: 8 },
  cellHead: { fontFamily: fonts.heavy, fontSize: 14, color: c.muted },
  cellText: { fontFamily: fonts.bold, fontSize: 15, color: c.ink },
  cellAmharic: { fontFamily: fonts.amharicBold, fontSize: 17, lineHeight: 24, color: c.ink },
  cellRoman: { fontFamily: fonts.bold, fontSize: 13, color: c.muted },
  example: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12, backgroundColor: c.bgSoft },
  exampleAmharic: { fontFamily: fonts.amharicBold, fontSize: 18, lineHeight: 26, color: c.ink },
  exampleText: { fontFamily: fonts.bold, fontSize: 13, color: c.muted },
  grammarTip: { padding: 12, borderRadius: 12, overflow: 'hidden', backgroundColor: c.primarySoft, fontFamily: fonts.bold, fontSize: 14, lineHeight: 20, color: c.ink },
}));
