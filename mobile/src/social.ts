import * as AppleAuthentication from 'expo-apple-authentication';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import * as Crypto from 'expo-crypto';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';
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

// Expo Go (and the browser preview) can't run Google's native sign-in, so
// they use the browser sheet; the real app uses the phone's own account picker.
const nativeGoogle = Platform.OS !== 'web' && Constants.executionEnvironment !== ExecutionEnvironment.StoreClient;

/** Continue with Google: the native account picker in the app, the browser sheet in Expo Go. */
export function signInWithGoogle(): Promise<string | null> {
  return nativeGoogle ? signInWithGoogleNative() : signInWithGoogleBrowser();
}

/** Which app the Google token was made for, and whether it carries a nonce, for the logs (no secrets). */
function tokenSummary(token: string) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return { audience: payload.aud, hasNonce: Boolean(payload.nonce) };
  } catch {
    return {};
  }
}

/**
 * Like the website (components/GoogleButton.tsx): Google hands the app a
 * sign-in token, and Supabase checks it. Google shows "Kwanqa", never Supabase.
 */
async function signInWithGoogleNative(): Promise<string | null> {
  if (!supabase) return 'Accounts aren’t available right now.';
  // loaded only here, since Expo Go doesn't include this native module
  const { GoogleSignin, isCancelledResponse, isErrorWithCode, statusCodes } = await import('@react-native-google-signin/google-signin');
  try {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    });
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const response = await GoogleSignin.signIn();
    if (isCancelledResponse(response)) return null;
    const token = response.data.idToken;
    if (!token) return 'Google sign-in didn’t work. Please try again.';
    const { error } = await supabase.auth.signInWithIdToken({ provider: 'google', token });
    if (error) {
      // Supabase turned Google's token down: say why (usually a client ID or nonce setting)
      console.warn('Kwanqa: Supabase rejected the Google sign-in', error.message, tokenSummary(token));
      return `Google sign-in didn’t work. Please try again. (${error.message})`;
    }
    return null;
  } catch (error) {
    if (isErrorWithCode(error) && error.code === statusCodes.IN_PROGRESS) return null;
    if (isErrorWithCode(error) && error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) return 'Google sign-in needs Google Play services on this phone.';
    // Google's own sign-in on the phone failed: say why (usually the iOS client ID)
    console.warn('Kwanqa: Google sign-in failed on the phone', error);
    const detail = isErrorWithCode(error) ? `${error.code}: ${error.message}` : error instanceof Error ? error.message : String(error);
    return `Google sign-in didn’t work. Please try again. (${detail})`;
  }
}

/**
 * In Expo Go: Google opens in a secure browser sheet and comes back to the app
 * with the session in the link (exp://…). Google shows Supabase's address here.
 */
async function signInWithGoogleBrowser(): Promise<string | null> {
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

/** Forgets the Google account on this phone, so the next sign-in shows the picker again. */
export async function signOutOfGoogle() {
  if (!nativeGoogle) return;
  try {
    const { GoogleSignin } = await import('@react-native-google-signin/google-signin');
    await GoogleSignin.signOut();
  } catch {
    // not signed in with Google
  }
}
