import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { READING, SMALL_WORDS, type ReadingScene, type SmallWord } from '@/lib/everyday';
import { feel } from '@/haptics';
import { fonts, makeStyles } from '@/theme';

// Everyday Amharic, like the website's (components/EverydayPage.tsx): the
// small words that make speech sound natural, and real-world Amharic to read
// (a minibus sign, a menu, a text), tapping a line to check yourself.

function WordCard({ word }: { word: SmallWord }) {
  const styles = useStyles();
  return (
    <View style={styles.card}>
      <Text style={styles.word}>
        {word.word} <Text style={styles.roman}>{word.roman}</Text>
      </Text>
      <Text style={styles.meaning}>{word.meaning}</Text>
      <Text style={styles.how}>{word.how}</Text>
      {word.examples.map(ex => (
        <View key={ex.amharic} style={styles.example}>
          <Text style={styles.exampleAm}>{ex.amharic}</Text>
          <Text style={styles.exampleText}>
            {ex.transliteration} · {ex.english}
          </Text>
        </View>
      ))}
    </View>
  );
}

const BOARD = {
  sign: { bg: '#1f5f3a', border: '#e9e4d8', text: '#ffffff', sub: 'rgba(255,255,255,0.78)' },
  menu: { bg: '#2b2622', border: '#8a5a33', text: '#fde9b8', sub: 'rgba(255,255,255,0.78)' },
  message: { bg: '#f7f7f7', border: '#e5e5e5', text: '#3c3c3c', sub: '#777777' },
  card: { bg: '#fff6dc', border: '#e0a000', text: '#3c3c3c', sub: '#777777' },
};

function Scene({ scene }: { scene: ReadingScene }) {
  const styles = useStyles();
  const [shown, setShown] = useState<Set<number>>(new Set());
  const all = shown.size === scene.lines.length;
  const look = BOARD[scene.look];
  return (
    <View style={styles.card}>
      <Text style={styles.sceneTitle}>{scene.title}</Text>
      <Text style={styles.how}>{scene.context}</Text>
      {/* drawn in fixed colours, like a real sign or menu, in light and dark mode alike */}
      <View style={[styles.board, { backgroundColor: look.bg, borderColor: look.border }]}>
        {scene.lines.map((line, i) => {
          const open = shown.has(i);
          return (
            <Pressable
              key={line.amharic}
              onPress={() => {
                feel('pick');
                setShown(s => new Set(s).add(i));
              }}
              accessibilityRole="button"
              accessibilityLabel={open ? `${line.amharic}: ${line.transliteration}, ${line.english}` : `${line.amharic}: tap to check your reading`}
              style={styles.line}
            >
              <Text style={[styles.lineAm, { color: look.text }]}>{line.amharic}</Text>
              <Text style={[styles.lineSub, { color: look.sub }, !open && styles.hint]}>
                {open ? `${line.transliteration} · ${line.english}` : 'Read it, then tap to check'}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {all ? (
        scene.tip ? <Text style={styles.tip}>{scene.tip}</Text> : null
      ) : (
        <Pressable onPress={() => setShown(new Set(scene.lines.map((_, i) => i)))} hitSlop={6} accessibilityRole="button">
          <Text style={styles.showAll}>Show all</Text>
        </Pressable>
      )}
    </View>
  );
}

export default function Everyday() {
  const styles = useStyles();
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Text style={styles.lead}>The little words that make you sound natural, and the Amharic you’ll actually read on the street.</Text>

      <Text style={styles.section}>Small words that make you sound natural</Text>
      {SMALL_WORDS.map(group => (
        <View key={group.title} style={styles.group}>
          <Text style={styles.groupTitle}>{group.title}</Text>
          <Text style={styles.how}>{group.intro}</Text>
          {group.words.map(w => (
            <WordCard key={w.word} word={w} />
          ))}
        </View>
      ))}

      <Text style={styles.section}>Read real Amharic</Text>
      <Text style={styles.how}>Try to read each line first, then tap it to check.</Text>
      {READING.map(scene => (
        <Scene key={scene.id} scene={scene} />
      ))}
    </ScrollView>
  );
}

const useStyles = makeStyles(c => ({
  page: { padding: 16, gap: 14, paddingBottom: 48 },
  lead: { fontFamily: fonts.bold, fontSize: 16, lineHeight: 23, color: c.muted },
  section: { fontFamily: fonts.black, fontSize: 22, lineHeight: 28, color: c.ink, marginTop: 10 },
  group: { gap: 10 },
  groupTitle: { fontFamily: fonts.black, fontSize: 17, color: c.primary, marginTop: 4 },
  card: { gap: 8, padding: 16, borderRadius: 18, borderWidth: 2, borderBottomWidth: 5, borderColor: c.line, backgroundColor: '#ffffff' },
  word: { fontFamily: fonts.amharicBold, fontSize: 22, lineHeight: 30, color: c.ink },
  roman: { fontFamily: fonts.heavy, fontSize: 15, color: c.primary },
  meaning: { fontFamily: fonts.heavy, fontSize: 15, color: c.ink },
  how: { fontFamily: fonts.bold, fontSize: 14, lineHeight: 20, color: c.muted },
  example: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12, backgroundColor: c.bgSoft },
  exampleAm: { fontFamily: fonts.amharicBold, fontSize: 18, lineHeight: 26, color: c.ink },
  exampleText: { fontFamily: fonts.bold, fontSize: 13, color: c.muted },
  sceneTitle: { fontFamily: fonts.black, fontSize: 18, color: c.ink },
  board: { gap: 4, padding: 12, borderRadius: 14, borderWidth: 3 },
  line: { paddingVertical: 8, paddingHorizontal: 8, borderRadius: 10 },
  lineAm: { fontFamily: fonts.amharicBold, fontSize: 22, lineHeight: 30 },
  lineSub: { fontFamily: fonts.bold, fontSize: 13 },
  hint: { fontStyle: 'italic' },
  tip: { padding: 12, borderRadius: 12, overflow: 'hidden', backgroundColor: c.primarySoft, fontFamily: fonts.bold, fontSize: 14, lineHeight: 20, color: c.ink },
  showAll: { fontFamily: fonts.heavy, fontSize: 14, color: c.blue },
}));
