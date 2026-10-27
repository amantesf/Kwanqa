import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { FIDEL, VOWELS } from '@/lib/fidel';
import { storage } from '@/lib/storage';
import Button from '@/components/button';
import { play, playEffect } from '@/components/sound';
import Speaker from '@/components/speaker';
import Writer, { type Mode, type WriterEvent } from '@/components/writer';
import { colors, fonts } from '@/theme';

// Write the ፊደል, like the website's Write tab (components/FidelWrite.tsx):
// watch a letter's strokes in order, trace them, then write it from memory.
// All seven forms of every family. Letters written without help get a ✓.

const DONE_KEY = 'kwanqa-fidel-written';

function readDone(): Set<string> {
  try {
    return new Set(JSON.parse(storage().getItem(DONE_KEY) ?? '[]'));
  } catch {
    return new Set();
  }
}

const MODES: { id: Mode; label: string }[] = [
  { id: 'watch', label: 'Watch' },
  { id: 'trace', label: 'Trace' },
  { id: 'memory', label: 'From memory' },
];

export default function FidelWrite() {
  const [row, setRow] = useState(0);
  const [form, setForm] = useState(0);
  const [mode, setMode] = useState<Mode>('watch');
  const [round, setRound] = useState(0);
  const [message, setMessage] = useState('');
  const [finished, setFinished] = useState<{ mistakes: number } | null>(null);
  const [strokes, setStrokes] = useState(0);
  const [done, setDone] = useState(readDone);

  const family = FIDEL[row];
  const cell = family.cells[form];
  const vowel = VOWELS[form];
  const familyDone = (r: number) => FIDEL[r].cells.filter(c => done.has(c.char)).length;

  function pick(r: number, f = 0, m: Mode = 'watch') {
    setRow(r);
    setForm(f);
    setMode(m);
    setRound(n => n + 1);
    setMessage('');
    setFinished(null);
  }

  const onEvent = useCallback(
    (e: WriterEvent) => {
      if (e.t === 'strokes') setStrokes(e.n);
      else if (e.t === 'message') setMessage(e.text);
      else if (e.t === 'wrong') playEffect('wrong');
      else if (e.t === 'correct') playEffect('correct');
      else if (e.t === 'done') {
        setFinished({ mistakes: e.mistakes });
        setMessage('');
        if (mode === 'memory' || e.mistakes === 0) {
          setDone(prev => {
            const next = new Set(prev).add(cell.char);
            storage().setItem(DONE_KEY, JSON.stringify([...next]));
            return next;
          });
        }
      }
    },
    [mode, cell.char],
  );

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.letters}>
        {FIDEL.map((f, r) => {
          const n = familyDone(r);
          return (
            <Pressable key={f.base} onPress={() => pick(r)} style={[styles.letter, r === row && styles.letterOn, n === 7 && styles.letterDone]} accessibilityState={{ selected: r === row }}>
              <Text style={[styles.letterChar, r === row && styles.letterCharOn]}>{f.base}</Text>
              <Text style={styles.letterRoman}>{f.cells[0].roman || 'a'}</Text>
              {n === 7 ? <Text style={styles.check}>✓</Text> : n > 0 ? <Text style={styles.part}>{n}/7</Text> : null}
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.forms}>
        {family.cells.map((c, k) => (
          <Pressable key={c.char} onPress={() => pick(row, k, mode)} style={[styles.form, k === form && styles.formOn]} accessibilityState={{ selected: k === form }}>
            <Text style={[styles.formChar, k === form && styles.formCharOn]}>{c.char}</Text>
            <Text style={styles.formRoman}>{done.has(c.char) ? '✓' : c.roman || '·'}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.head}>
        <Text style={styles.big}>{cell.char}</Text>
        <View style={styles.headText}>
          <Text style={styles.sound}>{cell.roman || vowel.roman}</Text>
          <Text style={styles.hint}>
            {vowel.hint} · {strokes} {strokes === 1 ? 'stroke' : 'strokes'}
          </Text>
        </View>
        <Speaker onPress={() => play(cell.audio)} label={`Hear ${cell.char}`} />
      </View>

      <Writer char={cell.char} mode={mode} round={round} onEvent={onEvent} />

      <Text style={styles.message}>
        {finished ? (
          <>
            <Text style={styles.gobez}>ጎበዝ!</Text>{' '}
            {finished.mistakes === 0 ? 'Written perfectly.' : `Done, with ${finished.mistakes} ${finished.mistakes === 1 ? 'slip' : 'slips'}. Try it from memory next.`}
          </>
        ) : (
          message || ' '
        )}
      </Text>

      <View style={styles.modes}>
        {MODES.map(m => (
          <Pressable key={m.id} onPress={() => pick(row, form, m.id)} style={[styles.mode, mode === m.id && styles.modeOn]} accessibilityState={{ selected: mode === m.id }}>
            <Text style={[styles.modeText, mode === m.id && styles.modeTextOn]}>{m.label}</Text>
          </Pressable>
        ))}
      </View>
      <Button label={form < 6 ? 'Next form' : 'Next letter'} onPress={() => (form < 6 ? pick(row, form + 1) : pick((row + 1) % FIDEL.length, 0))} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: 16, gap: 14, paddingBottom: 40 },
  letters: { gap: 8, paddingTop: 10, paddingRight: 8 },
  letter: { width: 58, paddingVertical: 6, alignItems: 'center', borderRadius: 14, borderWidth: 2, borderBottomWidth: 4, borderColor: colors.line, backgroundColor: '#ffffff' },
  letterOn: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  letterDone: { borderColor: '#a5ed6e' },
  letterChar: { fontFamily: fonts.amharicBold, fontSize: 24, lineHeight: 32, color: colors.ink },
  letterCharOn: { color: colors.primary },
  letterRoman: { fontFamily: fonts.heavy, fontSize: 11, color: colors.muted },
  check: { position: 'absolute', top: -2, right: 4, fontFamily: fonts.black, fontSize: 13, color: '#3a9a28' },
  part: { position: 'absolute', top: -8, right: -6, paddingHorizontal: 5, borderRadius: 8, overflow: 'hidden', backgroundColor: colors.gold, fontFamily: fonts.black, fontSize: 10, color: '#ffffff' },
  forms: { flexDirection: 'row', gap: 5 },
  form: { flex: 1, paddingVertical: 4, alignItems: 'center', borderRadius: 12, borderWidth: 2, borderBottomWidth: 4, borderColor: colors.line },
  formOn: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  formChar: { fontFamily: fonts.amharic, fontSize: 21, lineHeight: 29, color: colors.ink },
  formCharOn: { color: colors.primary },
  formRoman: { fontFamily: fonts.heavy, fontSize: 11, color: colors.muted },
  head: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  big: { fontFamily: fonts.amharicBold, fontSize: 44, lineHeight: 60, color: colors.ink },
  headText: { flex: 1 },
  sound: { fontFamily: fonts.black, fontSize: 24, color: colors.primary },
  hint: { fontFamily: fonts.bold, fontSize: 14, color: colors.muted },
  message: { minHeight: 24, fontFamily: fonts.bold, fontSize: 16, lineHeight: 22, color: colors.ink, textAlign: 'center' },
  gobez: { fontFamily: fonts.amharicBold, color: colors.primary },
  modes: { flexDirection: 'row', gap: 8 },
  mode: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 14, borderWidth: 2, borderBottomWidth: 4, borderColor: colors.line },
  modeOn: { borderColor: '#b9cdf2', backgroundColor: '#e6eefb' },
  modeText: { fontFamily: fonts.heavy, fontSize: 14, color: colors.muted },
  modeTextOn: { color: colors.blue },
});
