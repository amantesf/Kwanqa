import { SymbolView } from 'expo-symbols';
import { Modal, ScrollView, Text, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { campRecap } from '@/lib/canDo';
import type { Track } from '@/lib/courses';
import Button from '@/components/button';
import Walia from '@/components/walia';
import { fonts, makeStyles } from '@/theme';

// The end of a camp, like the website's (components/CampRecap.tsx): what you
// can now do in the language ("I can …", lib/canDo.ts) and how much the camp
// taught. Shown after the passport stamp lands, and from the camp's trophy.

export default function CampRecap({ slug, camp, track, onClose }: { slug: string; camp: number; track: Track; onClose: () => void }) {
  const styles = useStyles();
  const recap = campRecap(slug);
  const english = track === 'english';
  const t = (en: string, am: string) => (english ? `${am} · ${en}` : en);
  const counts = [
    `${recap.phrases} phrases`,
    recap.rules ? `${recap.rules} grammar ${recap.rules === 1 ? 'rule' : 'rules'}` : null,
    recap.families ? `${recap.families} word ${recap.families === 1 ? 'family' : 'families'}` : null,
  ].filter(Boolean);

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Animated.View entering={ZoomIn.duration(260)} style={styles.card}>
          <ScrollView contentContainerStyle={styles.inner} showsVerticalScrollIndicator={false}>
            <Walia pose="cheer" size={110} />
            <Text style={styles.title}>{t(`Camp ${camp} complete!`, `ካምፕ ${camp} ተጠናቀቀ!`)}</Text>
            <Text style={styles.lead}>{t('You can now say:', 'አሁን እንዲህ ማለት ይችላሉ፡')}</Text>
            {recap.canDo.map(item => (
              <View key={item.en} style={styles.item}>
                <SymbolView name={{ ios: 'checkmark', android: 'check', web: 'check' }} tintColor="#3a9a28" size={18} weight="bold" />
                <View style={styles.itemText}>
                  {item.am ? (
                    <>
                      <Text style={[styles.itemMain, styles.amharic]}>{item.am}</Text>
                      <Text style={styles.itemSub}>I can {item.en}</Text>
                    </>
                  ) : (
                    <Text style={styles.itemMain}>I can {item.en}</Text>
                  )}
                </View>
              </View>
            ))}
            <Text style={styles.counts}>
              {t('New this camp', 'በዚህ ካምፕ')}: {counts.join(' · ')}
            </Text>
          </ScrollView>
          <Button label={t('Keep climbing', 'መውጣት ቀጥል')} onPress={onClose} />
        </Animated.View>
      </View>
    </Modal>
  );
}

const useStyles = makeStyles(c => ({
  backdrop: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16, backgroundColor: 'rgba(0,0,0,0.45)' },
  card: { width: '100%', maxWidth: 460, maxHeight: '90%', gap: 12, padding: 20, borderRadius: 24, borderWidth: 2, borderBottomWidth: 6, borderColor: c.line, backgroundColor: c.bg },
  inner: { alignItems: 'center', gap: 10 },
  title: { fontFamily: fonts.black, fontSize: 25, color: c.ink, textAlign: 'center' },
  lead: { fontFamily: fonts.heavy, fontSize: 15, color: c.muted },
  item: { alignSelf: 'stretch', flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 14, backgroundColor: '#e9f8e4' },
  itemText: { flex: 1, gap: 1 },
  itemMain: { fontFamily: fonts.bold, fontSize: 15, lineHeight: 21, color: c.ink },
  amharic: { fontFamily: fonts.amharic, lineHeight: 24 },
  itemSub: { fontFamily: fonts.bold, fontSize: 13, color: c.muted },
  counts: { fontFamily: fonts.heavy, fontSize: 14, lineHeight: 20, color: c.muted, textAlign: 'center', marginTop: 4 },
}));
