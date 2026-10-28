import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { readProfile } from '@/lib/profile';
import { useAuth } from '@/auth';
import Captcha from '@/components/captcha';
import SocialButtons from '@/components/social-buttons';
import Walia from '@/components/walia';
import { SITE } from '@/site';
import { supabase } from '@/supabase';
import { colors, fonts } from '@/theme';

// Sign up or log in with Apple, Google, or email and password, like the
// website's forms (components/AuthForm.tsx): same account, same progress.

type Mode = 'signup' | 'login';

// Turns Supabase's error messages into friendlier ones (as on the website).
function friendly(message: string) {
  const m = message.toLowerCase();
  if (m.includes('invalid login credentials')) return 'That email and password don’t match. Try again?';
  if (m.includes('email not confirmed')) return 'Please confirm your email first. Check your inbox for the link.';
  if (m.includes('already registered')) return 'There’s already an account with that email. Try logging in.';
  if (m.includes('captcha')) return 'The “are you human?” check didn’t go through. Please try again.';
  if (m.includes('rate limit')) return 'Too many tries for now. Please wait a few minutes and try again.';
  if (m.includes('password')) return message;
  return 'Something went wrong. Please try again.';
}

function Field({ label, ...props }: { label: string } & React.ComponentProps<typeof TextInput>) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput placeholderTextColor="#afafaf" style={styles.input} {...props} />
    </View>
  );
}

export default function Account() {
  const params = useLocalSearchParams<{ mode?: Mode }>();
  const [mode, setMode] = useState<Mode>(params.mode === 'login' ? 'login' : 'signup');
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [sentTo, setSentTo] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [captchaKey, setCaptchaKey] = useState(0);
  const isSignup = mode === 'signup';
  const close = () => (router.canGoBack() ? router.back() : router.replace('/'));

  async function submit() {
    if (!supabase || busy) return;
    setError('');
    setBusy(true);
    // Each token works once, so get a fresh check ready for the next try.
    const token = captchaToken || undefined;
    setCaptchaToken('');
    setCaptchaKey(k => k + 1);

    if (isSignup) {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { name: name.trim(), onboarding: readProfile() ?? undefined },
          // the confirmation link opens the website; then they log in here
          emailRedirectTo: `${SITE}/auth/callback?next=${encodeURIComponent('/courses')}`,
          captchaToken: token,
        },
      });
      setBusy(false);
      if (error) return setError(friendly(error.message));
      if (data.session) return close();
      setSentTo(email.trim()); // email confirmation is on: wait for the link
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password, options: { captchaToken: token } });
      setBusy(false);
      if (error) return setError(friendly(error.message));
      close();
    }
  }

  const ready = email.trim() && password && (!isSignup || name.trim()) && !busy;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.top}>
        <Pressable onPress={close} accessibilityLabel="Close" hitSlop={10}>
          <Svg viewBox="0 0 24 24" width={26} height={26}>
            <Path d="M6 6l12 12M18 6L6 18" stroke="#afafaf" strokeWidth={3} strokeLinecap="round" />
          </Svg>
        </Pressable>
      </View>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
          {!supabase ? (
            <View style={styles.center}>
              <Walia pose="happy" size={110} />
              <Text style={styles.title}>Accounts are coming soon</Text>
              <Text style={styles.lead}>You can still climb the whole trail. Your progress is saved on this phone.</Text>
            </View>
          ) : user ? (
            <View style={styles.center}>
              <Walia pose="wave" size={110} />
              <Text style={styles.title}>You’re logged in</Text>
              <Text style={styles.lead}>{user.email}</Text>
              <Button label="Continue climbing" onPress={close} />
            </View>
          ) : sentTo ? (
            <View style={styles.center}>
              <Walia mood="cheer" size={120} />
              <Text style={styles.title}>Check your email</Text>
              <Text style={styles.lead}>We sent a link to {sentTo}. Open it to confirm your account, then log in here.</Text>
              <Button
                label="Log in"
                onPress={() => {
                  setSentTo('');
                  setMode('login');
                }}
              />
            </View>
          ) : (
            <>
              <View style={styles.center}>
                <Walia pose="wave" size={96} />
                <Text style={styles.title}>{isSignup ? 'Save your climb' : 'Welcome back'}</Text>
                <Text style={styles.lead}>
                  {isSignup ? 'Make a free account to keep your progress on any phone and on kwanqa.com.' : 'Log in to pick up where you left off.'}
                </Text>
              </View>
              <SocialButtons signup={isSignup} onError={setError} />
              {isSignup && <Field label="Name" value={name} onChangeText={setName} placeholder="Your first name" autoComplete="given-name" textContentType="givenName" />}
              <Field
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                textContentType="emailAddress"
              />
              <Field
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder={isSignup ? 'At least 6 characters' : 'Your password'}
                secureTextEntry
                autoComplete={isSignup ? 'new-password' : 'current-password'}
                textContentType={isSignup ? 'newPassword' : 'password'}
              />
              <Captcha key={captchaKey} onToken={setCaptchaToken} />
              {error ? <Text style={styles.error}>{error}</Text> : null}
              <Button label={busy ? 'One moment…' : isSignup ? 'Create account' : 'Log in'} onPress={submit} disabled={!ready} />
              <Pressable
                onPress={() => {
                  setError('');
                  setMode(isSignup ? 'login' : 'signup');
                }}
                style={styles.switch}
              >
                <Text style={styles.switchText}>{isSignup ? 'Already have an account? Log in' : 'New here? Make an account'}</Text>
              </Pressable>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Button({ label, onPress, disabled }: { label: string; onPress: () => void; disabled?: boolean }) {
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      style={({ pressed }) => [styles.button, disabled && styles.buttonOff, pressed && !disabled && styles.buttonDown]}
    >
      <Text style={[styles.buttonText, disabled && styles.buttonTextOff]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  top: { paddingHorizontal: 16, paddingVertical: 10 },
  page: { padding: 20, gap: 14, paddingBottom: 40, maxWidth: 480, width: '100%', alignSelf: 'center' },
  center: { alignItems: 'center', gap: 8, marginBottom: 6 },
  title: { fontFamily: fonts.black, fontSize: 26, color: colors.ink, textAlign: 'center' },
  lead: { fontFamily: fonts.bold, fontSize: 16, lineHeight: 22, color: colors.muted, textAlign: 'center' },
  field: { gap: 6 },
  label: { fontFamily: fonts.heavy, fontSize: 14, color: colors.ink },
  input: { minHeight: 52, paddingHorizontal: 16, borderRadius: 14, borderWidth: 2, borderColor: colors.line, backgroundColor: colors.bgSoft, fontFamily: fonts.bold, fontSize: 17, color: colors.ink },
  error: { fontFamily: fonts.bold, fontSize: 15, color: '#d9443a', textAlign: 'center' },
  button: { minHeight: 52, borderRadius: 16, borderBottomWidth: 5, borderBottomColor: colors.primaryShadow, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', alignSelf: 'stretch' },
  buttonOff: { backgroundColor: colors.line, borderBottomColor: colors.line },
  buttonDown: { borderBottomWidth: 0, marginTop: 5 },
  buttonText: { fontFamily: fonts.black, fontSize: 16, color: '#ffffff', textTransform: 'uppercase', letterSpacing: 0.8 },
  buttonTextOff: { color: '#afafaf' },
  switch: { paddingVertical: 10, alignItems: 'center' },
  switchText: { fontFamily: fonts.black, fontSize: 15, color: colors.blue, textTransform: 'uppercase', letterSpacing: 0.5 },
});
