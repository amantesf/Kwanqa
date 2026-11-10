import { respell } from '@/lib/speechFixes';

// Azure Speech, used by the Talk with Walia calls and every lesson line. Server only: the key never
// reaches the browser. Set AZURE_SPEECH_KEY and AZURE_SPEECH_REGION (e.g. eastus).

const key = process.env.AZURE_SPEECH_KEY;
const region = process.env.AZURE_SPEECH_REGION;

/** The two Amharic voices Azure has: Ameha (male, Walia's) and Mekdes (female). */
export const AMHARIC_VOICES = { ameha: 'am-ET-AmehaNeural', mekdes: 'am-ET-MekdesNeural' } as const;
export type AmharicVoice = keyof typeof AMHARIC_VOICES;
/** His English voice, for learners of English: a warm, clear American English voice. */
const ENGLISH_VOICE = 'en-US-AndrewNeural';

export type SpeechLang = 'am' | 'en';

export const speechReady = Boolean(key && region);

/**
 * How Walia's Amharic sounds, tuned on /voice-lab and set in the Vercel
 * environment so it can change without new code:
 *   AMHARIC_VOICE  ameha | mekdes      (default ameha)
 *   AMHARIC_RATE   speed in %, -30..30 (default -6: a touch slower, clearer for learners)
 *   AMHARIC_PITCH  pitch in %, -20..20 (default 0)
 *   AMHARIC_CLEAN  1 | 0               (default 1: tidy ፊደል punctuation first)
 * Bump VOICE_VERSION in lib/voiceVersion.ts after changing them, so browsers
 * fetch the new sound instead of last year's cached clips.
 */
export type VoiceSettings = { voice: AmharicVoice; rate: number; pitch: number; clean: boolean };

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const num = (v: string | undefined, fallback: number) => (v !== undefined && v !== '' && !Number.isNaN(Number(v)) ? Number(v) : fallback);

export const DEFAULT_VOICE: VoiceSettings = {
  voice: process.env.AMHARIC_VOICE === 'mekdes' ? 'mekdes' : 'ameha',
  rate: clamp(num(process.env.AMHARIC_RATE, -6), -30, 30),
  pitch: clamp(num(process.env.AMHARIC_PITCH, 0), -20, 20),
  clean: process.env.AMHARIC_CLEAN !== '0',
};

function escapeXml(text: string) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Amharic punctuation the voice reads more naturally as its everyday
 * equivalent: ። as a full stop (so it pauses and drops its pitch), ፣ as a
 * comma, ፧ as a question mark (so questions rise), and quote marks dropped.
 * Words that the voice says wrong can be respelled in lib/speechFixes.ts.
 */
export function tidyAmharic(text: string) {
  return text
    .replace(/።/g, '. ')
    .replace(/፣/g, ', ')
    .replace(/፤/g, '; ')
    .replace(/[፥፦]/g, ': ')
    .replace(/፧/g, '? ')
    .replace(/[‹›«»“”"]/g, '')
    .replace(/\s+([.,;:?!])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Reads Amharic (or English) text aloud in Walia's voice; returns an mp3. */
export async function synthesize(
  text: string,
  rate = 0,
  lang: SpeechLang = 'am',
  settings: VoiceSettings = DEFAULT_VOICE,
): Promise<ArrayBuffer> {
  const english = lang === 'en';
  const xmlLang = english ? 'en-US' : 'am-ET';
  const voice = english ? ENGLISH_VOICE : AMHARIC_VOICES[settings.voice];
  const words = english ? text : respell(settings.clean ? tidyAmharic(text) : text);
  // the slow button (rate -30) still wins; otherwise the tuned speed
  const speed = english ? rate : rate || settings.rate;
  const pitch = english ? 0 : settings.pitch;
  const ssml =
    `<speak version='1.0' xml:lang='${xmlLang}'><voice name='${voice}'>` +
    `<prosody rate='${speed}%' pitch='${pitch}%'>${escapeXml(words)}</prosody>` +
    // a breath at the end, so short words aren't clipped by the player
    `<break time='200ms'/></voice></speak>`;
  const res = await fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': key!,
      'Content-Type': 'application/ssml+xml',
      'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
      'User-Agent': 'kwanqa',
    },
    body: ssml,
  });
  if (!res.ok) throw new Error(`Azure text-to-speech failed: ${res.status}`);
  return res.arrayBuffer();
}

/** Turns a short 16 kHz mono WAV of Amharic (or English) speech into text. */
export async function transcribe(wav: ArrayBuffer, lang: SpeechLang = 'am'): Promise<string> {
  const language = lang === 'en' ? 'en-US' : 'am-ET';
  const res = await fetch(
    `https://${region}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=${language}`,
    {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': key!,
        'Content-Type': 'audio/wav; codecs=audio/pcm; samplerate=16000',
      },
      body: wav,
    },
  );
  if (!res.ok) throw new Error(`Azure speech-to-text failed: ${res.status}`);
  const data = (await res.json()) as { RecognitionStatus?: string; DisplayText?: string };
  return data.RecognitionStatus === 'Success' ? (data.DisplayText ?? '') : '';
}
