import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { FIDEL, VOWELS, type FidelCell, type FidelRow } from '@/lib/fidel';
import { play } from '@/components/sound';
import Speaker from '@/components/speaker';
import { colors, fonts } from '@/theme';

// The ፊደል chart, like the website's (components/FidelChart.tsx): one row per
// consonant, one column per vowel sound. Tap a letter to hear it and see how
// it's built in the card at the top.

const sound = (cell: FidelCell) => cell.roman || cell.vowel.roman;

export default function FidelChart() {
  const [row, setRow] = useState<FidelRow>(FIDEL[0]);
  const [cell, setCell] = useState<FidelCell>(FIDEL[0].cells[0]);
  const [hideDuplicates, setHideDuplicates] = useState(false);
  // Quiz me: the sounds hide until each letter is tapped, as on the website
  const [quiz, setQuiz] = useState(false);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const carrier = row.roman === '';
  const rows = hideDuplicates ? FIDEL.filter(r => !r.sameAs) : FIDEL;

  function pick(r: FidelRow, c: FidelCell) {
    setRow(r);
    setCell(c);
    play(c.audio);
    if (quiz) setRevealed(prev => new Set(prev).add(c.char));
  }

  return (
    <View style={styles.safe}>
      <View style={styles.detail}>
        <View style={styles.detailTop}>
          <Text style={styles.big}>{cell.char}</Text>
          <View style={styles.detailText}>
            <View style={styles.soundRow}>
              <Text style={styles.roman}>{sound(cell)}</Text>
              <Speaker onPress={() => play(cell.audio)} label={`Hear ${cell.char}`} />
            </View>
            <Text style={styles.explain}>
              {carrier ? (
                <>
                  <Text style={styles.strongAm}>{row.base}</Text> carries a vowel on its own, so {cell.char} is just the vowel{' '}
                  <Text style={styles.strong}>{cell.vowel.roman}</Text>, {cell.vowel.hint}.
                </>
              ) : (
                <>
                  <Text style={styles.strongAm}>{row.base}</Text> ({row.name}) + vowel <Text style={styles.strong}>{cell.vowel.roman}</Text>, {cell.vowel.hint}.
                </>
              )}
            </Text>
          </View>
        </View>
        {row.sameAs ? (
          <Text style={styles.note}>
            Sounds the same as <Text style={styles.strongAm}>{row.sameAs}</Text> in Amharic today.
          </Text>
        ) : null}
        <View style={styles.family}>
          {row.cells.map(c => (
            <Pressable key={c.char} onPress={() => pick(row, c)} style={[styles.mini, c.char === cell.char && styles.miniOn]} accessibilityLabel={`${c.char}, ${sound(c)}`}>
              <Text style={[styles.miniChar, c.char === cell.char && styles.miniCharOn]}>{c.char}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.toggle}>
          <Text style={styles.toggleText}>Hide duplicate sounds</Text>
          <Switch value={hideDuplicates} onValueChange={setHideDuplicates} trackColor={{ true: colors.primary, false: colors.line }} thumbColor="#ffffff" />
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
        <View style={styles.row}>
          {VOWELS.map(v => (
            <View key={v.order} style={styles.head}>
              <Text style={styles.vowel}>{v.roman}</Text>
              <Text style={styles.order}>{v.order}</Text>
            </View>
          ))}
        </View>
        {rows.map(r => (
          <View key={r.base} style={[styles.row, r.sameAs && styles.dup]}>
            {r.cells.map(c => {
              const on = c.char === cell.char;
              return (
                <Pressable key={c.char} onPress={() => pick(r, c)} style={[styles.cell, on && styles.cellOn]} accessibilityLabel={`${c.char}, ${sound(c)}`}>
                  <Text style={styles.char}>{c.char}</Text>
                  <Text style={styles.cellSound}>{quiz && !revealed.has(c.char) ? '?' : sound(c)}</Text>
                </Pressable>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  detail: { margin: 12, marginBottom: 6, padding: 14, gap: 10, borderRadius: 20, borderWidth: 2, borderBottomWidth: 5, borderColor: colors.line, backgroundColor: colors.bg },
  detailTop: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  big: { fontFamily: fonts.amharicBold, fontSize: 64, lineHeight: 84, color: colors.ink, minWidth: 76, textAlign: 'center' },
  detailText: { flex: 1, gap: 4 },
  soundRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  roman: { fontFamily: fonts.black, fontSize: 30, color: colors.primary },
  explain: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20, color: colors.muted },
  strong: { fontFamily: fonts.heavy, color: colors.ink },
  strongAm: { fontFamily: fonts.amharicBold, color: colors.ink },
  note: { fontFamily: fonts.body, fontSize: 13, color: '#8a6d00', backgroundColor: '#fff6dc', borderRadius: 10, padding: 8, overflow: 'hidden' },
  family: { flexDirection: 'row', gap: 5 },
  mini: { flex: 1, paddingVertical: 4, borderRadius: 10, borderWidth: 2, borderBottomWidth: 4, borderColor: colors.line, alignItems: 'center' },
  miniOn: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  miniChar: { fontFamily: fonts.amharic, fontSize: 20, lineHeight: 28, color: colors.ink },
  miniCharOn: { color: colors.primary },
  page: { paddingHorizontal: 12, paddingBottom: 40, gap: 4 },
  toggle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 4, paddingVertical: 6 },
  toggleText: { fontFamily: fonts.heavy, fontSize: 15, color: colors.ink },
  row: { flexDirection: 'row', gap: 4, borderRadius: 12 },
  dup: { backgroundColor: '#fffbf0' },
  head: { flex: 1, alignItems: 'center', paddingBottom: 2 },
  vowel: { fontFamily: fonts.black, fontSize: 16, color: colors.primary },
  order: { fontFamily: fonts.bold, fontSize: 11, color: colors.muted },
  cell: { flex: 1, paddingVertical: 4, borderRadius: 12, borderWidth: 2, borderColor: 'transparent', alignItems: 'center' },
  cellOn: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  char: { fontFamily: fonts.amharic, fontSize: 24, lineHeight: 34, color: colors.ink },
  cellSound: { fontFamily: fonts.heavy, fontSize: 11, color: '#16449c' },
});
