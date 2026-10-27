import { Platform, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { siteUrl } from '@/site';
import { colors, fonts } from '@/theme';

// The "are you human?" check before logging in or signing up. Turnstile only
// runs on kwanqa.com, so the app shows that page (app/app-captcha/route.ts)
// in a small web view and gets each token back from it. Most people never see
// a puzzle. Tokens work once: remount it (change its `key`) after each try.
export default function Captcha({ onToken }: { onToken: (token: string) => void }) {
  if (Platform.OS === 'web') {
    // The browser preview isn't on kwanqa.com, so Turnstile can't run here.
    return <Text style={styles.note}>The “are you human?” check only runs in the phone app.</Text>;
  }
  return (
    <View style={styles.box}>
      <WebView
        source={{ uri: siteUrl('/app-captcha') }}
        onMessage={e => onToken(e.nativeEvent.data)}
        onError={() => onToken('')}
        scrollEnabled={false}
        style={styles.web}
        containerStyle={styles.web}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  box: { height: 70, borderRadius: 12, overflow: 'hidden' },
  web: { backgroundColor: 'transparent' },
  note: { fontFamily: fonts.bold, fontSize: 13, color: colors.muted, textAlign: 'center' },
});
