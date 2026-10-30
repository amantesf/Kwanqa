import * as AppleAuthentication from 'expo-apple-authentication';
import { useEffect, useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { appleAvailable, signInWithApple, signInWithGoogle } from '@/social';
import { fonts, makeStyles } from '@/theme';

// The one-tap ways in, above the email form: Apple's own button (iPhone only,
// as Apple requires) and Google's, followed by an "or" before the form.

function GoogleMark() {
  return (
    <Svg width={20} height={20} viewBox="0 0 48 48">
      <Path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <Path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <Path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <Path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </Svg>
  );
}

export default function SocialButtons({ onError, signup }: { onError: (message: string) => void; signup: boolean }) {
  const styles = useStyles();
  const [apple, setApple] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'ios') appleAvailable().then(setApple).catch(() => setApple(false));
  }, []);

  async function run(signIn: () => Promise<string | null>) {
    if (busy) return;
    setBusy(true);
    onError('');
    const problem = await signIn();
    setBusy(false);
    if (problem) onError(problem);
  }

  return (
    <View style={styles.wrap}>
      {apple ? (
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={signup ? AppleAuthentication.AppleAuthenticationButtonType.SIGN_UP : AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
          cornerRadius={16}
          style={styles.apple}
          onPress={() => void run(signInWithApple)}
        />
      ) : null}
      <Pressable
        onPress={() => void run(signInWithGoogle)}
        style={({ pressed }) => [styles.google, pressed && styles.googleDown]}
        accessibilityRole="button"
        accessibilityLabel="Continue with Google"
      >
        <GoogleMark />
        <Text style={styles.googleText}>Continue with Google</Text>
      </Pressable>
      <View style={styles.or}>
        <View style={styles.line} />
        <Text style={styles.orText}>or</Text>
        <View style={styles.line} />
      </View>
    </View>
  );
}

const useStyles = makeStyles(c => ({
  wrap: { gap: 10 },
  apple: { height: 52, width: '100%' },
  google: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, minHeight: 52, borderRadius: 16, borderWidth: 2, borderBottomWidth: 4, borderColor: c.line, backgroundColor: '#ffffff' },
  googleDown: { borderBottomWidth: 2, marginTop: 2 },
  googleText: { fontFamily: fonts.heavy, fontSize: 17, color: c.ink },
  or: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 4 },
  line: { flex: 1, height: 2, backgroundColor: c.line },
  orText: { fontFamily: fonts.heavy, fontSize: 14, color: c.muted, textTransform: 'uppercase' },
}));
