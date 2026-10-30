import { Stack } from 'expo-router';
import { View } from 'react-native';
import { fonts, tabBarTop, useColors } from '@/theme';

export default function LearnLayout() {
  const colors = useColors();
  return (
    <View style={{ flex: 1, paddingTop: tabBarTop, backgroundColor: colors.bg }}>
      <Stack
        screenOptions={{
          headerTintColor: colors.primary,
          headerTitleStyle: { color: colors.ink, fontFamily: fonts.heavy },
          headerBackButtonDisplayMode: 'minimal',
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="[slug]" options={{ title: '' }} />
      </Stack>
    </View>
  );
}
