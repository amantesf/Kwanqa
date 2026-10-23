// Azure Speech, used by the Talk with Walia calls. Server only: the key never
// reaches the browser. Set AZURE_SPEECH_KEY and AZURE_SPEECH_REGION (e.g. eastus).

const key = process.env.AZURE_SPEECH_KEY;
const region = process.env.AZURE_SPEECH_REGION;

/** Walia's voice: Ameha, a male Amharic voice that scored best in our listening test. */
const WALIA_VOICE = 'am-ET-AmehaNeural';
/** His English voice, for learners of English: a warm, clear American English voice. */
const ENGLISH_VOICE = 'en-US-AndrewNeural';

export type SpeechLang = 'am' | 'en';

export const speechReady = Boolean(key && region);

function escapeXml(text: string) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Reads Amharic (or English) text aloud in Walia's voice; returns an mp3. */
export async function synthesize(text: string, rate = 0, lang: SpeechLang = 'am'): Promise<ArrayBuffer> {
  const xmlLang = lang === 'en' ? 'en-US' : 'am-ET';
  const voice = lang === 'en' ? ENGLISH_VOICE : WALIA_VOICE;
  const ssml =
    `<speak version='1.0' xml:lang='${xmlLang}'><voice name='${voice}'>` +
    `<prosody rate='${rate}%'>${escapeXml(text)}</prosody></voice></speak>`;
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
