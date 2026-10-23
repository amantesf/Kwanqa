import { speechReady, transcribe } from '@/lib/azureSpeech';
import { accountsOn, requestUser } from '@/lib/requestUser';

// POST a short WAV recording (16 kHz mono) and get back what Azure heard.
// ?lang=en listens for English (English learners' calls); otherwise Amharic.
// Only for signed-in learners, so strangers can't use up the Azure allowance.
// Capped at about 30 seconds of audio, which is plenty for one answer.

const MAX_BYTES = 30 * 16000 * 2 + 44;

export async function POST(request: Request) {
  if (!speechReady) {
    return Response.json({ error: 'Listening is not set up yet.' }, { status: 503 });
  }
  if (accountsOn && !(await requestUser(request))) {
    return Response.json({ error: 'Log in to talk with Walia.' }, { status: 401 });
  }
  if (!request.headers.get('content-type')?.startsWith('audio/wav')) {
    return Response.json({ error: 'Send a WAV recording.' }, { status: 415 });
  }
  const length = Number(request.headers.get('content-length') ?? 0);
  if (length > MAX_BYTES) {
    return Response.json({ error: 'That recording is too long.' }, { status: 413 });
  }

  const audio = await request.arrayBuffer();
  if (audio.byteLength > MAX_BYTES) {
    return Response.json({ error: 'That recording is too long.' }, { status: 413 });
  }
  if (audio.byteLength < 44 + 16000 * 2 * 0.2) {
    return Response.json({ text: '' });
  }

  try {
    const lang = new URL(request.url).searchParams.get('lang') === 'en' ? 'en' : 'am';
    return Response.json({ text: await transcribe(audio, lang) });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Walia couldn’t hear that. Try again.' }, { status: 502 });
  }
}
