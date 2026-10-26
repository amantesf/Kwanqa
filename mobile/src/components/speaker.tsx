import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet } from 'react-native';
import { colors } from '@/theme';

// The round "hear it" button used on lessons and cards.
export default function Speaker({ onPress, label = 'Hear it' }: { onPress: () => void; label?: string }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} hitSlop={8} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
      <SymbolView name={{ ios: 'speaker.wave.2.fill', android: 'volume_up', web: 'volume_up' }} tintColor="#ffffff" size={22} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.blue, alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: 0.8 },
});
