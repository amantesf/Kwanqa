import { AMHARIC_VOICES, DEFAULT_VOICE, speechReady, synthesize, type AmharicVoice } from '@/lib/azureSpeech';
import { requestUser } from '@/lib/requestUser';
import { isTeam } from '@/lib/teamAccess';

// POST { text, voice, rate, pitch, clean } → the Amharic read with those
// settings, so the team can compare voices on /voice-lab. Team only (STATS_EMAILS).
// GET → the settings the site uses now.

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const user = await requestUser(request);
  if (!user || !isTeam(user.email)) return Response.json({ error: 'Only for the kwanqa team.' }, { status: 403 });
  return Response.json(DEFAULT_VOICE);
}

export async function POST(request: Request) {
  if (!speechReady) return Response.json({ error: 'Speech is not set up yet.' }, { status: 503 });
  const user = await requestUser(request);
  if (!user) return Response.json({ error: 'Log in first.' }, { status: 401 });
  if (!isTeam(user.email)) return Response.json({ error: 'Only for the kwanqa team.' }, { status: 403 });

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const text = typeof body?.text === 'string' ? body.text.trim() : '';
  const voice = body?.voice as AmharicVoice;
  const rate = Number(body?.rate);
  const pitch = Number(body?.pitch);
  if (!text || text.length > 300 || !/[ሀ-፼]/.test(text) || !(voice in AMHARIC_VOICES) || !Number.isFinite(rate) || !Number.isFinite(pitch)) {
    return Response.json({ error: 'Bad request.' }, { status: 400 });
  }
  try {
    const mp3 = await synthesize(text, 0, 'am', {
      voice,
      rate: Math.min(30, Math.max(-30, Math.round(rate))) || 0.1, // 0 would fall back to the default speed
      pitch: Math.min(20, Math.max(-20, Math.round(pitch))),
      clean: body?.clean !== false,
    });
    return new Response(mp3, { headers: { 'Content-Type': 'audio/mpeg', 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Speech failed.' }, { status: 502 });
  }
}
