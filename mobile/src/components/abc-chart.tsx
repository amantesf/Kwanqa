import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { ABC, type AbcLetter } from '@/lib/abc';
import { englishAudioUrl } from '@/lib/englishAudio';
import { play } from '@/components/sound';
import Speaker from '@/components/speaker';
import { siteUrl } from '@/site';
import { fonts, makeStyles, useColors } from '@/theme';

// The English alphabet for Amharic speakers, like the website's /abc
// (components/AbcChart.tsx): tap a letter to see it big, hear its name and an
// example word, with the word's Amharic meaning.

/** Says bits of English one after the other: the letter, then its word. */
function say(texts: string[]) {
  const [first, ...rest] = texts;
  if (first) play(englishAudioUrl(first), rest.length ? () => say(rest) : undefined);
}

export default function AbcChart() {
  const styles = useStyles();
  const colors = useColors();
  const [l, setSelected] = useState<AbcLetter>(ABC[0]);
  const [quiz, setQuiz] = useState(false);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  function pick(letter: AbcLetter) {
    setSelected(letter);
    say([letter.upper, letter.word]);
    if (quiz) setRevealed(prev => new Set(prev).add(letter.upper));
  }

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Text style={styles.lead}>
        <Text style={styles.am}>እንግሊዝኛ 26 ፊደላት አሉት። እያንዳንዱን ፊደል ይንኩ፣ ስሙንና አንድ ምሳሌ ቃል ይስሙ።</Text> English has 26 letters, each with a capital and a small form.
      </Text>

      <View style={styles.detail}>
        <View style={styles.detailTop}>
          <Text style={styles.big}>
            {l.upper}
            <Text style={styles.bigLower}> {l.lower}</Text>
          </Text>
          <View style={styles.flex}>
            <Text style={styles.nameLabel}>ስሙ · name</Text>
            <Text style={styles.nameAm}>{l.nameAm}</Text>
          </View>
          <Speaker onPress={() => say([l.upper, l.word])} label={`Hear ${l.upper} and ${l.word}`} />
        </View>
        <Pressable onPress={() => say([l.word])} style={styles.word}>
          {l.picture ? <Image source={{ uri: siteUrl(l.picture) }} style={styles.picture} contentFit="contain" /> : null}
          <View style={styles.flex}>
            <Text style={styles.wordEn}>
              {l.ends ? (
                <>
                  {l.word.slice(0, -1)}
                  <Text style={styles.wordMark}>{l.word.slice(-1)}</Text>
                </>
              ) : (
                <>
                  <Text style={styles.wordMark}>{l.word.charAt(0)}</Text>
                  {l.word.slice(1)}
                </>
              )}
            </Text>
            <Text style={styles.wordAm}>{l.wordAm}</Text>
          </View>
        </Pressable>
        {l.ends ? (
          <Text style={styles.note}>
            <Text style={styles.am}>ጥቂት ቃላት ብቻ በ X ይጀምራሉ፣ ስለዚህ ብዙ ጊዜ መጨረሻ ላይ ይገኛል።</Text> Few words start with X, so you usually see it at the end.
          </Text>
        ) : null}
      </View>

      <View style={styles.toggle}>
        <Text style={styles.toggleText}>
          <Text style={styles.am}>ፈትነኝ</Text> · Quiz me
        </Text>
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

      <View style={styles.grid}>
        {ABC.map(letter => {
          const hidden = quiz && !revealed.has(letter.upper);
          const on = letter.upper === l.upper;
          return (
            <Pressable key={letter.upper} onPress={() => pick(letter)} style={[styles.cell, on && styles.cellOn]} accessibilityLabel={`${letter.upper}, as in ${letter.word}`}>
              <Text style={[styles.cellLetter, on && styles.cellLetterOn]}>
                {letter.upper}
                <Text style={styles.cellLower}>{letter.lower}</Text>
              </Text>
              <Text style={styles.cellWord} numberOfLines={1}>
                {hidden ? '?' : letter.word}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const useStyles = makeStyles(c => ({
  flex: { flex: 1 },
  page: { padding: 12, gap: 12, paddingBottom: 40 },
  lead: { fontFamily: fonts.bold, fontSize: 14, lineHeight: 20, color: c.muted, paddingHorizontal: 4 },
  am: { fontFamily: fonts.amharic },
  detail: { gap: 12, padding: 14, borderRadius: 20, borderWidth: 2, borderBottomWidth: 5, borderColor: c.line },
  detailTop: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  big: { fontFamily: fonts.black, fontSize: 56, color: c.ink, minWidth: 90 },
  bigLower: { fontSize: 36, color: c.muted },
  nameLabel: { fontFamily: fonts.heavy, fontSize: 12, color: c.muted, textTransform: 'uppercase' },
  nameAm: { fontFamily: fonts.amharicBold, fontSize: 28, lineHeight: 40, color: c.primary },
  word: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 16, backgroundColor: c.bgSoft },
  picture: { width: 64, height: 64 },
  wordEn: { fontFamily: fonts.heavy, fontSize: 24, color: c.ink },
  wordMark: { fontFamily: fonts.black, color: c.primary },
  wordAm: { fontFamily: fonts.amharic, fontSize: 17, lineHeight: 25, color: c.muted },
  note: { fontFamily: fonts.bold, fontSize: 13, lineHeight: 19, color: '#8a6d00', backgroundColor: '#fff6dc', borderRadius: 10, padding: 8, overflow: 'hidden' },
  toggle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 4 },
  toggleText: { fontFamily: fonts.heavy, fontSize: 15, color: c.ink },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  cell: { width: '22%', flexGrow: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 14, borderWidth: 2, borderBottomWidth: 4, borderColor: c.line },
  cellOn: { borderColor: c.primary, backgroundColor: c.primarySoft },
  cellLetter: { fontFamily: fonts.black, fontSize: 24, color: c.ink },
  cellLetterOn: { color: c.primary },
  cellLower: { fontSize: 16, color: c.muted },
  cellWord: { fontFamily: fonts.bold, fontSize: 12, color: '#16449c' },
}));
