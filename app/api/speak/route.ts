import { speakableLines } from '@/lib/conversations';
import { speechReady, synthesize } from '@/lib/azureSpeech';
import { accountsOn, requestUser } from '@/lib/requestUser';

// GET /api/speak?text=…&slow=1 reads one of Walia's scripted lines aloud.
// Only lines from lib/conversations.ts are allowed, so anyone can play them
// without logging in, and each clip is cached for a year.
//
// POST { text, slow } reads one of Walia's own replies (written by his brain
// during a call). Those are new every time, so this needs a signed-in learner.

const allowed = speakableLines();
const MAX_REPLY = 200;
const ETHIOPIC = /[ሀ-፿]/;

export async function POST(request: Request) {
  if (!speechReady) {
    return new Response('Speech is not set up yet', { status: 503 });
  }
  if (accountsOn && !(await requestUser(request))) {
    return new Response('Log in to talk with Walia', { status: 401 });
  }
  const body = (await request.json().catch(() => null)) as { text?: unknown; slow?: unknown } | null;
  const text = typeof body?.text === 'string' ? body.text.trim() : '';
  if (!text || text.length > MAX_REPLY || !ETHIOPIC.test(text)) {
    return new Response('Bad text', { status: 400 });
  }

  try {
    const mp3 = await synthesize(text, body?.slow === true ? -30 : 0);
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

  if (!allowed.has(text)) {
    return new Response('Unknown line', { status: 404 });
  }
  if (!speechReady) {
    return new Response('Speech is not set up yet', { status: 503 });
  }

  try {
    const mp3 = await synthesize(text, slow ? -30 : 0);
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
