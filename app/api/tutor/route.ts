import { conversations, type Gender } from '@/lib/conversations';
import { accountsOn, requestUser } from '@/lib/requestUser';
import { askWalia, tutorReady, type CallLine } from '@/lib/tutor';

// POST { slug, turn, gender, heard, history } → Walia's verdict and reply.
// Signed-in learners only. The question and its goal come from the server's
// own copy of the conversation, never from the browser.

const MAX_TEXT = 300;
const MAX_HISTORY = 24;

export async function POST(request: Request) {
  if (!tutorReady) {
    return Response.json({ error: 'Walia’s brain is not set up yet.' }, { status: 503 });
  }
  if (accountsOn && !(await requestUser(request))) {
    return Response.json({ error: 'Log in to talk with Walia.' }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const conversation = conversations.find(c => c.slug === body?.slug);
  const turnIndex = Number(body?.turn);
  const gender = body?.gender;
  const heard = typeof body?.heard === 'string' ? body.heard.trim() : '';
  const history = Array.isArray(body?.history) ? (body.history as unknown[]) : [];

  if (
    !conversation ||
    !Number.isInteger(turnIndex) ||
    turnIndex < 0 ||
    turnIndex >= conversation.turns.length ||
    (gender !== 'm' && gender !== 'f') ||
    !heard ||
    heard.length > MAX_TEXT
  ) {
    return Response.json({ error: 'Bad request.' }, { status: 400 });
  }

  const lines: CallLine[] = history
    .slice(-MAX_HISTORY)
    .flatMap(l => {
      const line = l as Partial<CallLine>;
      return (line.from === 'walia' || line.from === 'learner') && typeof line.text === 'string'
        ? [{ from: line.from, text: line.text.slice(0, MAX_TEXT) }]
        : [];
    });

  try {
    const answer = await askWalia({ conversation, turnIndex, gender: gender as Gender, heard, history: lines });
    return Response.json(answer);
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Walia lost his train of thought.' }, { status: 502 });
  }
}
