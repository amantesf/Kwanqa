import { speakableLines } from '@/lib/conversations';
import { speakableEnglish } from '@/lib/englishAudio';
import { speakableAmharic } from '@/lib/amharicAudio';
import { speechReady, synthesize } from '@/lib/azureSpeech';
import { accountsOn, requestUser } from '@/lib/requestUser';

// GET /api/speak?text=…&slow=1 reads one of Walia's scripted lines, or any
// line, word or answer from the Amharic lessons, aloud.
// GET /api/speak?lang=en&text=… reads a line, word or picture name from the
// English course in English, for Amharic speakers learning English.
// Only lines from lib/conversations.ts are allowed, so anyone can play them
// without logging in, and each clip is cached for a year.
//
// POST { text, slow, lang } reads one of Walia's own replies (written by his
// brain during a call). Those are new every time, so this needs a signed-in learner.

const allowed = new Set([...speakableLines(), ...speakableAmharic()]);
const allowedEnglish = speakableEnglish();
const MAX_REPLY = 200;
const ETHIOPIC = /[ሀ-፿]/;

export async function POST(request: Request) {
  if (!speechReady) {
    return new Response('Speech is not set up yet', { status: 503 });
  }
  if (accountsOn && !(await requestUser(request))) {
    return new Response('Log in to talk with Walia', { status: 401 });
  }
  const body = (await request.json().catch(() => null)) as { text?: unknown; slow?: unknown; lang?: unknown } | null;
  const text = typeof body?.text === 'string' ? body.text.trim() : '';
  // English calls get English replies; Amharic calls Amharic ones.
  const lang = body?.lang === 'en' ? 'en' : 'am';
  const fits = lang === 'en' ? /[A-Za-z]/.test(text) && !ETHIOPIC.test(text) : ETHIOPIC.test(text);
  if (!text || text.length > MAX_REPLY || !fits) {
    return new Response('Bad text', { status: 400 });
  }

  try {
    const mp3 = await synthesize(text, body?.slow === true ? -30 : 0, lang);
    return new Response(mp3, { headers: { 'Content-Type': 'audio/mpeg', 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    console.error(error);
    return new Response('Speech failed', { status: 502 });
  }
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const text = params.get('text') ?? '';
  const slow = params.get('slow') === '1';
  const lang = params.get('lang') === 'en' ? 'en' : 'am';

  if (!(lang === 'en' ? allowedEnglish : allowed).has(text)) {
    return new Response('Unknown line', { status: 404 });
  }
  if (!speechReady) {
    return new Response('Speech is not set up yet', { status: 503 });
  }

  try {
    const mp3 = await synthesize(text, slow ? -30 : 0, lang);
    return new Response(mp3, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error(error);
    return new Response('Speech failed', { status: 502 });
  }
}
