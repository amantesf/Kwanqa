import { NotoSansEthiopic_600SemiBold, NotoSansEthiopic_700Bold } from '@expo-google-fonts/noto-sans-ethiopic';
import { Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold, Nunito_900Black, useFonts } from '@expo-google-fonts/nunito';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { AuthProvider } from '@/auth';
import Intro from '@/components/intro';
import { useClimb } from '@/lib/climb';
import { loadProgress } from '@/progress';
import { scheduleReminders, useReminders } from '@/reminders';
import { ThemeProvider, useColors, useScheme } from '@/theme';

// keep the splash screen up until the fonts and saved progress are ready
// (then Intro takes over from it)
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

  // the theme choice is saved with the progress, so it's read once that's loaded
  if (!ready) return null;

  return (
    <ThemeProvider>
      <AuthProvider>
        <Screens />
        <ReminderScheduler />
        <Intro />
      </AuthProvider>
    </ThemeProvider>
  );
}

/** Keeps the streak reminders in step: on start, after each lesson, and when the app comes back. */
function ReminderScheduler() {
  const days = useClimb().days.join(',');
  const { on, hour } = useReminders();
  useEffect(() => {
    void scheduleReminders();
  }, [days, on, hour]);
  useEffect(() => {
    const sub = AppState.addEventListener('change', state => {
      if (state === 'active') void scheduleReminders();
    });
    return () => sub.remove();
  }, []);
  return null;
}

/** Every screen, on the page colour of the theme (light or dark, chosen on Profile). */
function Screens() {
  const colors = useColors();
  const scheme = useScheme();
  return (
    <>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="practice" options={{ presentation: 'fullScreenModal', gestureEnabled: false }} />
        <Stack.Screen name="account" options={{ presentation: 'modal' }} />
        <Stack.Screen name="call" options={{ presentation: 'fullScreenModal', gestureEnabled: false }} />
        <Stack.Screen name="start" options={{ gestureEnabled: false, animation: 'fade' }} />
        <Stack.Screen name="welcome" />
        <Stack.Screen name="delete-account" options={{ presentation: 'modal' }} />
      </Stack>
    </>
  );
}
