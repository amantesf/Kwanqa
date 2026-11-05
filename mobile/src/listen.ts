import { AudioQuality, IOSOutputFormat, type RecordingOptions } from 'expo-audio';
import { FileSystemUploadType, uploadAsync } from 'expo-file-system/legacy';
import { Platform } from 'react-native';
import { SITE } from '@/site';
import { supabase } from '@/supabase';

// Recording the learner's voice and asking kwanqa.com what it heard
// (/api/listen, which needs a signed-in learner): used by Talk's calls and by
// the "Speak this" lesson questions.

// 16 kHz mono 16-bit WAV, which is what /api/listen hands to Azure.
export const WAV: RecordingOptions = {
  extension: '.wav',
  sampleRate: 16000,
  numberOfChannels: 1,
  bitRate: 256000,
  isMeteringEnabled: true,
  ios: { extension: '.wav', outputFormat: IOSOutputFormat.LINEARPCM, audioQuality: AudioQuality.MAX, sampleRate: 16000, linearPCMBitDepth: 16, linearPCMIsBigEndian: false, linearPCMIsFloat: false },
  // Android can't record WAV, so its calls are typed for now
  android: { extension: '.m4a', outputFormat: 'mpeg4', audioEncoder: 'aac', sampleRate: 16000 },
  web: {},
};
export const canRecord = Platform.OS === 'ios';

export async function authHeaders(): Promise<Record<string, string>> {
  const token = (await supabase?.auth.getSession())?.data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function withTimeout<T>(work: Promise<T>, ms: number, message: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(message)), ms);
    work.then(
      value => {
        clearTimeout(timer);
        resolve(value);
      },
      error => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

/**
 * Sends a finished recording to /api/listen and returns what Azure heard.
 * `status` is the server's answer: 401 (not signed in) and 503 (listening
 * isn't set up) mean speaking isn't available, not that the learner was wrong.
 */
export async function listenTo(uri: string, lang: 'am' | 'en'): Promise<{ status: number; text: string; error?: string }> {
  const res = await withTimeout(
    uploadAsync(`${SITE}/api/listen${lang === 'en' ? '?lang=en' : ''}`, uri, {
      httpMethod: 'POST',
      uploadType: FileSystemUploadType.BINARY_CONTENT,
      headers: { 'Content-Type': 'audio/wav', ...(await authHeaders()) },
    }),
    25000,
    'Walia couldn’t be reached. Check your connection and try again.',
  );
  let data: { text?: string; error?: string } = {};
  try {
    data = JSON.parse(res.body);
  } catch {
    // not JSON: an error page; the status says what happened
  }
  return { status: res.status, text: data.text ?? '', error: data.error };
}
