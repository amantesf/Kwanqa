import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { supabase } from '@/supabase';

// Continue with Apple and Continue with Google: the same Supabase accounts as
// the website, so progress follows the learner either way. Each returns an
// error message to show, or null when the learner is signed in (or cancelled).

/** A one-time secret: Apple gets its hash, Supabase checks the original, so a stolen token can't be replayed. */
async function makeNonce() {
  const raw = Crypto.randomUUID();
  const hashed = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, raw);
  return { raw, hashed };
}

export const appleAvailable = () => AppleAuthentication.isAvailableAsync();

export async function signInWithApple(): Promise<string | null> {
  if (!supabase) return 'Accounts aren’t available right now.';
  try {
    const { raw, hashed } = await makeNonce();
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [AppleAuthentication.AppleAuthenticationScope.FULL_NAME, AppleAuthentication.AppleAuthenticationScope.EMAIL],
      nonce: hashed,
    });
    if (!credential.identityToken) return 'Apple sign-in didn’t work. Please try again.';
    const { data, error } = await supabase.auth.signInWithIdToken({ provider: 'apple', token: credential.identityToken, nonce: raw });
    if (error) return 'Apple sign-in didn’t work. Please try again.';
    // Apple shares the learner's name only the very first time, so keep it
    const name = credential.fullName?.givenName?.trim();
    if (name && !data.user?.user_metadata?.name) await supabase.auth.updateUser({ data: { name } });
    return null;
  } catch (error) {
    if ((error as { code?: string })?.code === 'ERR_REQUEST_CANCELED') return null;
    return 'Apple sign-in didn’t work. Please try again.';
  }
}

/**
 * Google opens in a secure browser sheet and comes back to the app with the
 * session in the link (in Expo Go the link starts exp://, in the app kwanqa://).
 */
export async function signInWithGoogle(): Promise<string | null> {
  if (!supabase) return 'Accounts aren’t available right now.';
  try {
    const redirectTo = Linking.createURL('auth-callback');
    const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo, skipBrowserRedirect: true } });
    if (error || !data.url) return 'Couldn’t open Google sign-in. Please try again.';
    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
    if (result.type !== 'success') return null; // closed the sheet
    const params = new URLSearchParams(result.url.split('#')[1] ?? result.url.split('?')[1] ?? '');
    const access_token = params.get('access_token');
    const refresh_token = params.get('refresh_token');
    if (!access_token || !refresh_token) return params.get('error_description')?.replace(/\+/g, ' ') ?? 'Google sign-in didn’t work. Please try again.';
    const { error: sessionError } = await supabase.auth.setSession({ access_token, refresh_token });
    return sessionError ? 'Google sign-in didn’t work. Please try again.' : null;
  } catch {
    return 'Google sign-in didn’t work. Please try again.';
  }
}
