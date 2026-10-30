import { Platform, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { siteUrl } from '@/site';
import { fonts, makeStyles } from '@/theme';

// The "are you human?" check before logging in or signing up. Turnstile only
// runs on kwanqa.com, so the app shows that page (app/app-captcha/route.ts)
// in a small web view and gets each token back from it. Most people never see
// a puzzle. Tokens work once: remount it (change its `key`) after each try.
export default function Captcha({ onToken }: { onToken: (token: string) => void }) {
  const styles = useStyles();
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
        // Turnstile needs storage and cookies, and runs its check in frames from Cloudflare
        originWhitelist={['*']}
        javaScriptEnabled
        domStorageEnabled
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
        setSupportMultipleWindows={false}
        scrollEnabled={false}
        style={styles.web}
        containerStyle={styles.web}
      />
    </View>
  );
}

const useStyles = makeStyles(c => ({
  box: { height: 70, borderRadius: 12, overflow: 'hidden' },
  web: { backgroundColor: 'transparent' },
  note: { fontFamily: fonts.bold, fontSize: 13, color: c.muted, textAlign: 'center' },
}));
