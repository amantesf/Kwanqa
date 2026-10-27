import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FidelChart from '@/components/fidel-chart';
import FidelWrite from '@/components/fidel-write';
import { colors, fonts, tabBarTop } from '@/theme';

// The alphabet, like the website's /fidel: the chart, and writing practice.

export default function Alphabet() {
  const [tab, setTab] = useState<'chart' | 'write'>('chart');
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.tabs}>
        {(['chart', 'write'] as const).map(t => (
          <Pressable key={t} onPress={() => setTab(t)} style={[styles.tab, tab === t && styles.tabOn]} accessibilityState={{ selected: tab === t }}>
            <Text style={[styles.tabText, tab === t && styles.tabTextOn]}>{t === 'chart' ? 'Chart' : 'Write'}</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.flex}>{tab === 'chart' ? <FidelChart /> : <FidelWrite />}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg, paddingTop: tabBarTop },
  flex: { flex: 1 },
  tabs: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 },
  tab: { flex: 1, paddingVertical: 9, borderRadius: 14, borderWidth: 2, borderBottomWidth: 4, borderColor: colors.line, alignItems: 'center' },
  tabOn: { borderColor: colors.primaryBorder, backgroundColor: colors.primarySoft },
  tabText: { fontFamily: fonts.heavy, fontSize: 15, color: colors.muted },
  tabTextOn: { color: colors.primary },
});
