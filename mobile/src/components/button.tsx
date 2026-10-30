import { Pressable, Text } from 'react-native';
import { fonts, makeStyles, useColors, useNight, type Palette } from '@/theme';

// A chunky 3D button that presses down, like the website's .btn.

type Tone = 'primary' | 'plain' | 'green' | 'red';

const tones = (colors: Palette): Record<Tone, { bg: string; edge: string; fg: string; border?: string }> => ({
  primary: { bg: colors.primary, edge: colors.primaryShadow, fg: '#ffffff' },
  plain: { bg: colors.bg, edge: colors.line, fg: colors.blue, border: colors.line },
  green: { bg: colors.green, edge: '#3a9a28', fg: '#ffffff' },
  red: { bg: '#ff5a4e', edge: '#d9443a', fg: '#ffffff' },
});

export default function Button({ label, onPress, tone = 'primary', disabled }: { label: string; onPress: () => void; tone?: Tone; disabled?: boolean }) {
  const styles = useStyles();
  const colors = useColors();
  const night = useNight();
  const look = disabled ? { bg: colors.line, edge: colors.line, fg: night('#afafaf', 'text') } : tones(colors)[tone];
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: look.bg, borderBottomColor: look.edge },
        'border' in look && look.border ? { borderWidth: 2, borderColor: look.border, borderBottomColor: look.edge } : null,
        pressed && !disabled && styles.down,
      ]}
    >
      <Text style={[styles.text, { color: look.fg }]}>{label}</Text>
    </Pressable>
  );
}

const useStyles = makeStyles(c => ({
  button: { minHeight: 50, paddingHorizontal: 20, borderRadius: 16, borderBottomWidth: 5, alignItems: 'center', justifyContent: 'center' },
  down: { borderBottomWidth: 0, marginTop: 5 },
  text: { fontFamily: fonts.black, fontSize: 16, textTransform: 'uppercase', letterSpacing: 0.8 },
}));
