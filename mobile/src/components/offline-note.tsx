import { SymbolView } from 'expo-symbols';
import { Text, View } from 'react-native';
import { useOnline } from '@/online';
import { fonts, makeStyles, useColors } from '@/theme';

// A small note when the phone is offline, saying what still works.
export default function OfflineNote({ text = 'You’re offline. Lessons still work, but sounds and pictures need the internet.' }: { text?: string }) {
  const styles = useStyles();
  const colors = useColors();
  const online = useOnline();
  if (online) return null;
  return (
    <View style={styles.note} accessibilityRole="alert">
      <SymbolView name={{ ios: 'wifi.slash', android: 'wifi_off', web: 'wifi_off' }} tintColor={colors.muted} size={18} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const useStyles = makeStyles(c => ({
  note: { flexDirection: 'row', alignItems: 'center', gap: 10, marginHorizontal: 16, marginVertical: 6, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 14, borderWidth: 2, borderColor: c.line, backgroundColor: c.bgSoft },
  text: { flex: 1, fontFamily: fonts.bold, fontSize: 13, lineHeight: 18, color: c.muted },
}));
