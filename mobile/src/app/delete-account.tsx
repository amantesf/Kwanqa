import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Linking, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/auth';
import Button from '@/components/button';
import Walia from '@/components/walia';
import { fonts, makeStyles } from '@/theme';

// Deleting an account takes two steps, like the website's (components/DeleteAccount.tsx):
// read what will be lost, then type your email to confirm. It can't be undone,
// so the button stays off until then.

const CONTACT = 'kwanqa.team@gmail.com';

export default function DeleteAccount() {
  const styles = useStyles();
  const { user, deleteAccount } = useAuth();
  const [typed, setTyped] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const email = user?.email ?? '';
  const confirmed = email !== '' && typed.trim().toLowerCase() === email.toLowerCase();
  const close = () => (router.canGoBack() ? router.back() : router.replace('/'));

  async function submit() {
    if (!confirmed || busy) return;
    setBusy(true);
    setError('');
    const message = await deleteAccount();
    setBusy(false);
    if (message) return setError(message);
    setDone(true);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
          {done ? (
            <>
              <View style={styles.center}>
                <Walia pose="wave" size={110} />
              </View>
              <Text style={styles.title}>Your account has been deleted</Text>
              <Text style={styles.text}>Thank you for climbing with Walia. You can still learn on this phone without an account.</Text>
              <Button label="Done" onPress={() => router.replace('/')} />
            </>
          ) : !user ? (
            <>
              <View style={styles.center}>
                <Walia pose="happy" size={110} />
              </View>
              <Text style={styles.title}>Delete your account</Text>
              <Text style={styles.text}>Log in to the account you want to delete. Can’t log in? Email us from the account’s email address.</Text>
              <Pressable onPress={() => void Linking.openURL(`mailto:${CONTACT}`)}>
                <Text style={styles.link}>{CONTACT}</Text>
              </Pressable>
              <Button label="Log in" onPress={() => router.replace({ pathname: '/account', params: { mode: 'login' } })} />
            </>
          ) : (
            <>
              <View style={styles.center}>
                <Walia mood="sad" size={110} />
              </View>
              <Text style={styles.title}>Delete your account?</Text>
              <Text style={styles.text}>This permanently deletes:</Text>
              <View style={styles.list}>
                <Text style={styles.item}>• Your account and login for {email}</Text>
                <Text style={styles.item}>• Your progress, grass, and climb streak</Text>
                <Text style={styles.item}>• Your Get started answers and course choices</Text>
              </View>
              <Text style={styles.warning}>This can’t be undone.</Text>
              <View style={styles.field}>
                <Text style={styles.label}>Type your email to confirm</Text>
                <TextInput
                  value={typed}
                  onChangeText={setTyped}
                  placeholder={email}
                  placeholderTextColor="#afafaf"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  style={styles.input}
                />
              </View>
              {error ? <Text style={styles.error}>{error}</Text> : null}
              <Button label={busy ? 'Deleting…' : 'Delete my account'} tone="red" disabled={!confirmed || busy} onPress={submit} />
              <Button label="Keep my account" tone="plain" onPress={close} />
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const useStyles = makeStyles(c => ({
  safe: { flex: 1, backgroundColor: c.bg },
  flex: { flex: 1 },
  page: { padding: 24, gap: 14, alignItems: 'stretch', maxWidth: 480, width: '100%', alignSelf: 'center' },
  center: { alignSelf: 'center' },
  title: { fontFamily: fonts.black, fontSize: 26, color: c.ink, textAlign: 'center' },
  text: { fontFamily: fonts.bold, fontSize: 16, lineHeight: 22, color: c.muted, textAlign: 'center' },
  list: { gap: 4 },
  item: { fontFamily: fonts.bold, fontSize: 15, lineHeight: 21, color: c.ink },
  warning: { fontFamily: fonts.black, fontSize: 15, color: '#d9443a' },
  field: { gap: 6 },
  label: { fontFamily: fonts.heavy, fontSize: 14, color: c.ink },
  input: { minHeight: 52, paddingHorizontal: 16, borderRadius: 14, borderWidth: 2, borderColor: c.line, backgroundColor: c.bgSoft, fontFamily: fonts.bold, fontSize: 16, color: c.ink },
  error: { fontFamily: fonts.bold, fontSize: 15, color: '#d9443a', textAlign: 'center' },
  link: { fontFamily: fonts.heavy, fontSize: 15, color: c.blue, textAlign: 'center' },
}));
