import { speakableLines } from '@/lib/conversations';
import { speechReady, synthesize } from '@/lib/azureSpeech';

// GET /api/speak?text=…&slow=1 reads one of Walia's lines aloud.
// Only lines from lib/conversations.ts are allowed, so the endpoint can't be
// used to read out anything else. Each clip is cached for a year.

const allowed = speakableLines();

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
