import { Stack } from 'expo-router';
import { colors } from '@/theme';

export default function LearnLayout() {
  return (
    <Stack screenOptions={{ headerTintColor: colors.primary, headerTitleStyle: { color: colors.ink }, contentStyle: { backgroundColor: colors.bg } }}>
      <Stack.Screen name="index" options={{ title: 'Learn' }} />
      <Stack.Screen name="[slug]" options={{ title: '' }} />
    </Stack>
  );
}
