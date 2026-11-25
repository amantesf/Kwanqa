import { glossReady, glossSentence, glossWord } from '@/lib/gloss';
import { limitReached, takeAiUse } from '@/lib/aiLimits';
import { accountsOn, requestUser } from '@/lib/requestUser';

// POST { word, sentence } → what an Amharic word means in that sentence.
// POST { sentence } → the sentence in English (for learners' own books).
// Signed-in learners only, since each answer comes from the AI model, and capped
// per day (lib/aiLimits.ts).

const ETHIOPIC = /[ሀ-፼]/;
const MAX_WORD = 40;
const MAX_SENTENCE = 400;

export async function POST(request: Request) {
  if (!glossReady) {
    return Response.json({ error: 'Word meanings are not set up yet.' }, { status: 503 });
  }
  const user = accountsOn ? await requestUser(request) : null;
  if (accountsOn && !user) {
    return Response.json({ error: 'Log in to look up any word.' }, { status: 401 });
  }
  // a word and its sentence are tiny: refuse anything big before reading it
  if (Number(request.headers.get('content-length') ?? 0) > 8_000) {
    return Response.json({ error: 'Too much text.' }, { status: 413 });
  }
  if (!request.headers.get('content-type')?.startsWith('application/json')) {
    return Response.json({ error: 'Send JSON.' }, { status: 415 });
  }
  const body = (await request.json().catch(() => null)) as { word?: unknown; sentence?: unknown } | null;
  const sentence = typeof body?.sentence === 'string' ? body.sentence.trim() : '';
  const word = typeof body?.word === 'string' ? body.word.trim() : '';
  if (!sentence || sentence.length > MAX_SENTENCE || !ETHIOPIC.test(sentence)) {
    return Response.json({ error: 'Bad request.' }, { status: 400 });
  }
  if (word && (word.length > MAX_WORD || !ETHIOPIC.test(word) || !sentence.includes(word))) {
    return Response.json({ error: 'Bad request.' }, { status: 400 });
  }
  if (user && !(await takeAiUse(user, 'gloss'))) return limitReached('gloss');
  try {
    return Response.json(word ? await glossWord(word, sentence) : await glossSentence(sentence), {
      headers: { 'Cache-Control': 'private, no-store' },
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Couldn’t look that up just now.' }, { status: 502 });
  }
}
