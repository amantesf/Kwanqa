import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { amharicAudio } from '@/lib/amharicAudio';
import { geezNumber, toEthiopian } from '@/lib/ethiopianCalendar';
import { GEEZ_BIG, GEEZ_ONES, GEEZ_TENS, type GeezNumeral } from '@/lib/geezNumerals';
import { feel } from '@/haptics';
import { play } from '@/components/sound';
import { fonts, makeStyles } from '@/theme';

// Ge'ez numerals, like the website's Numbers view on the alphabet page: the
// ones, the tens, ፻ and ፼ with their Amharic names (tap to hear), how they
// combine, and a box that writes any number in Ge'ez.

const EXAMPLES: [number, string][] = [
  [25, 'tens, then ones'],
  [300, 'how many hundreds, then ፻'],
  [1980, '19 hundreds and 80'],
];

function Numeral({ n }: { n: GeezNumeral }) {
  const styles = useStyles();
  return (
    <Pressable
      onPress={() => {
        feel('pick');
        const audio = amharicAudio(n.amharic);
        if (audio) play(audio);
      }}
      accessibilityRole="button"
      accessibilityLabel={`${n.value}, ${n.tr}: hear it`}
      style={({ pressed }) => [styles.cell, pressed && styles.cellDown]}
    >
      <Text style={styles.sign}>{n.sign}</Text>
      <Text style={styles.value}>{n.value.toLocaleString()}</Text>
      <Text style={styles.word}>{n.amharic}</Text>
      <Text style={styles.tr}>{n.tr}</Text>
    </Pressable>
  );
}

function Group({ title, list }: { title: string; list: GeezNumeral[] }) {
  const styles = useStyles();
  return (
    <>
      <Text style={styles.label}>{title}</Text>
      <View style={styles.grid}>
        {list.map(n => (
          <Numeral key={n.sign} n={n} />
        ))}
      </View>
    </>
  );
}

export default function GeezNumerals() {
  const styles = useStyles();
  const [typed, setTyped] = useState('1984');
  const value = Number(typed);
  const valid = Number.isInteger(value) && value > 0;
  const year = toEthiopian(new Date()).year;
  return (
    <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
      <Text style={styles.heading}>Ge’ez numerals</Text>
      <Text style={styles.lead}>
        Ethiopia has its own numbers too, on calendars, in church books and on old buildings. There’s no zero: the tens and
        ones sit side by side. Tap one to hear its Amharic name.
      </Text>
      <Group title="Ones" list={GEEZ_ONES} />
      <Group title="Tens" list={GEEZ_TENS} />
      <Group title="Hundred and ten thousand" list={GEEZ_BIG} />

      <Text style={styles.label}>Putting them together</Text>
      {[...EXAMPLES, [year, 'this year in the Ethiopian calendar'] as [number, string]].map(([n, how]) => (
        <View key={n} style={styles.example}>
          <Text style={styles.exampleSign}>{geezNumber(n)}</Text>
          <Text style={styles.exampleText}>
            {n} · {how}
          </Text>
        </View>
      ))}

      <Text style={styles.label}>Write any number in Ge’ez</Text>
      <View style={styles.tryRow}>
        <TextInput
          value={typed}
          onChangeText={t => setTyped(t.replace(/\D/g, '').slice(0, 8))}
          keyboardType="number-pad"
          style={styles.input}
          accessibilityLabel="A number"
        />
        <Text style={styles.out}>{valid ? geezNumber(value) : '–'}</Text>
      </View>
    </ScrollView>
  );
}

const useStyles = makeStyles(c => ({
  page: { padding: 16, gap: 10, paddingBottom: 48 },
  heading: { fontFamily: fonts.black, fontSize: 24, color: c.ink },
  lead: { fontFamily: fonts.body, fontSize: 15, lineHeight: 21, color: c.muted },
  label: { fontFamily: fonts.heavy, fontSize: 15, color: c.muted, marginTop: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  cell: { width: '31%', flexGrow: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 16, borderWidth: 2, borderBottomWidth: 4, borderColor: c.line, backgroundColor: c.bg },
  cellDown: { borderBottomWidth: 2, marginTop: 2 },
  sign: { fontFamily: fonts.amharicBold, fontSize: 30, lineHeight: 40, color: c.primary },
  value: { fontFamily: fonts.black, fontSize: 15, color: c.ink },
  word: { fontFamily: fonts.amharic, fontSize: 15, lineHeight: 22, color: c.ink },
  tr: { fontFamily: fonts.bold, fontSize: 12, color: c.blue },
  example: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 14, backgroundColor: c.bgSoft },
  exampleSign: { fontFamily: fonts.amharicBold, fontSize: 22, lineHeight: 30, color: c.primary },
  exampleText: { flex: 1, fontFamily: fonts.bold, fontSize: 14, color: c.muted },
  tryRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  input: { width: 130, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12, borderWidth: 2, borderColor: c.line, fontFamily: fonts.heavy, fontSize: 20, color: c.ink, backgroundColor: c.bg },
  out: { flex: 1, fontFamily: fonts.amharicBold, fontSize: 30, lineHeight: 40, color: c.primary },
}));
