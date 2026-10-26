import { NotoSansEthiopic_600SemiBold, NotoSansEthiopic_700Bold } from '@expo-google-fonts/noto-sans-ethiopic';
import { Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold, Nunito_900Black, useFonts } from '@expo-google-fonts/nunito';
import { NativeTabs } from 'expo-router/native-tabs';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { colors } from '@/theme';

// keep the splash screen up until the fonts are ready
SplashScreen.preventAutoHideAsync();

export default function Layout() {
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
    <NativeTabs backgroundColor={colors.bg} iconColor={{ default: colors.muted, selected: colors.primary }} labelStyle={{ selected: { color: colors.primary } }}>
      <NativeTabs.Trigger name="(learn)">
        <NativeTabs.Trigger.Label>Learn</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'map', selected: 'map.fill' }} md="hiking" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="alphabet">
        <NativeTabs.Trigger.Label>Alphabet</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'character.book.closed', selected: 'character.book.closed.fill' }} md="translate" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="cards">
        <NativeTabs.Trigger.Label>Cards</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'rectangle.on.rectangle.angled', selected: 'rectangle.fill.on.rectangle.angled.fill' }} md="style" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
