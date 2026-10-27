import { Stack } from 'expo-router';
import { View } from 'react-native';
import { colors, fonts, tabBarTop } from '@/theme';

export default function ExploreLayout() {
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
        <Stack.Screen name="phrasebook" options={{ title: 'Phrasebook' }} />
        <Stack.Screen name="proverbs" options={{ title: 'Proverbs' }} />
        <Stack.Screen name="cards" options={{ title: 'Flashcards' }} />
        <Stack.Screen name="holidays" options={{ title: 'Holidays' }} />
        <Stack.Screen name="holiday/[id]" options={{ title: '' }} />
      </Stack>
    </View>
  );
}
