import { NotoSansEthiopic_600SemiBold, NotoSansEthiopic_700Bold } from '@expo-google-fonts/noto-sans-ethiopic';
import { Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold, Nunito_900Black, useFonts } from '@expo-google-fonts/nunito';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { AuthProvider } from '@/auth';
import { loadProgress } from '@/progress';
import { colors } from '@/theme';

// keep the splash screen up until the fonts and saved progress are ready
SplashScreen.preventAutoHideAsync();

// The tabs, with practice opening over them full screen and the account
// screen as a sheet. Accounts sync progress with the website's.
export default function RootLayout() {
  const [loaded, failed] = useFonts({
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_900Black,
    NotoSansEthiopic_600SemiBold,
    NotoSansEthiopic_700Bold,
  });

  const [progressReady, setProgressReady] = useState(false);
  const ready = (loaded || !!failed) && progressReady;

  useEffect(() => {
    loadProgress().then(() => setProgressReady(true));
  }, []);

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="practice" options={{ presentation: 'fullScreenModal', gestureEnabled: false }} />
        <Stack.Screen name="account" options={{ presentation: 'modal' }} />
        <Stack.Screen name="call" options={{ presentation: 'fullScreenModal', gestureEnabled: false }} />
      </Stack>
    </AuthProvider>
  );
}
