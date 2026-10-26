import { NotoSansEthiopic_600SemiBold, NotoSansEthiopic_700Bold } from '@expo-google-fonts/noto-sans-ethiopic';
import { Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold, Nunito_900Black, useFonts } from '@expo-google-fonts/nunito';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { colors } from '@/theme';

// keep the splash screen up until the fonts are ready
SplashScreen.preventAutoHideAsync();

// The tabs, with practice opening over them full screen.
export default function RootLayout() {
  const [loaded, failed] = useFonts({
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_900Black,
    NotoSansEthiopic_600SemiBold,
    NotoSansEthiopic_700Bold,
  });

  useEffect(() => {
    if (loaded || failed) SplashScreen.hideAsync();
  }, [loaded, failed]);

  if (!loaded && !failed) return null;

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="practice" options={{ presentation: 'fullScreenModal', gestureEnabled: false }} />
    </Stack>
  );
}
