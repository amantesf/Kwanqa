import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FIDEL, VOWELS } from '@/lib/fidel';
import { play } from '@/components/sound';
import { colors, tabBarTop } from '@/theme';

// The ፊደል chart: one row per consonant, one column per vowel sound.
// Tap a letter to hear it.
export default function Alphabet() {
  const [heard, setHeard] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.page}>
        <Text style={styles.heading}>ፊደል</Text>
        <Text style={styles.lead}>Every row is one consonant, every column one vowel sound. Tap a letter to hear it.</Text>
        <View style={styles.row}>
          {VOWELS.map(v => (
            <Text key={v.order} style={styles.vowel}>
              {v.roman}
            </Text>
          ))}
        </View>
        {FIDEL.map(row => (
          <View key={row.base} style={styles.row}>
            {row.cells.map(cell => (
              <Pressable
                key={cell.char}
                onPress={() => {
                  setHeard(cell.char);
                  play(cell.audio);
                }}
                style={({ pressed }) => [styles.cell, (pressed || heard === cell.char) && styles.cellOn]}
                accessibilityLabel={`${cell.char}, ${cell.roman || cell.vowel.roman}`}
              >
                <Text style={styles.char}>{cell.char}</Text>
                <Text style={styles.roman}>{cell.roman || cell.vowel.roman}</Text>
              </Pressable>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg, paddingTop: tabBarTop },
  page: { padding: 12, gap: 6 },
  heading: { fontSize: 34, fontWeight: '800', color: colors.ink, paddingHorizontal: 4 },
  lead: { fontSize: 15, color: colors.muted, paddingHorizontal: 4, marginBottom: 8 },
  row: { flexDirection: 'row', gap: 6 },
  vowel: { flex: 1, textAlign: 'center', fontWeight: '800', color: colors.primary },
  cell: { flex: 1, aspectRatio: 0.9, borderRadius: 10, borderWidth: 2, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  cellOn: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  char: { fontSize: 22, color: colors.ink },
  roman: { fontSize: 11, color: colors.muted },
});
