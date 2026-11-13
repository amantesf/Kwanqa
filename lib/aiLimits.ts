import { supabaseAdmin } from '@/lib/supabaseAdmin';

// Daily caps on the features that cost money every time they're used, so one
// very busy account (or a script) can't run up the bill. Counted per learner
// per UTC day in Supabase (supabase/ai-limits.sql). Server only.
//
// The limits can be changed in Vercel without touching code:
//   GLOSS_DAILY_LIMIT   word lookups + sentence translations (default 150)
//   TALK_DAILY_LIMIT    Walia's answers in Talk (default 40)
//   LISTEN_DAILY_LIMIT  recordings Walia listens to (default 120)

export type AiKind = 'gloss' | 'talk' | 'listen';

const DEFAULTS: Record<AiKind, number> = { gloss: 150, talk: 40, listen: 120 };
const ENV: Record<AiKind, string> = {
  gloss: 'GLOSS_DAILY_LIMIT',
  talk: 'TALK_DAILY_LIMIT',
  listen: 'LISTEN_DAILY_LIMIT',
};

export function dailyLimit(kind: AiKind): number {
  const set = Number(process.env[ENV[kind]]);
  return Number.isInteger(set) && set > 0 ? set : DEFAULTS[kind];
}

/** What a learner sees once they've used up a feature for the day. */
export const LIMIT_MESSAGES: Record<AiKind, string> = {
  gloss: 'That’s all the new words Walia can look up for you today. ነገ እንገናኝ! Come back tomorrow.',
  talk: 'Walia has talked a lot today and needs a rest. ነገ እንገናኝ! Come back tomorrow.',
  listen: 'Walia’s ears are tired for today. ነገ እንገናኝ! Come back tomorrow.',
};

let warned = false;

/**
 * Counts one use and says whether it's allowed. When the limits can't be
 * checked (no secret key, or the SQL hasn't been run yet) it lets the use
 * through rather than breaking the feature, and logs a warning once.
 */
export async function takeAiUse(userId: string, kind: AiKind): Promise<boolean> {
  const db = supabaseAdmin();
  if (!db) return letThrough('SUPABASE_SECRET_KEY is not set');
  const { data, error } = await db.rpc('ai_use', {
    learner: userId,
    use_kind: kind,
    day_limit: dailyLimit(kind),
  });
  if (error) return letThrough(error.message);
  return data === true;
}

function letThrough(reason: string) {
  if (!warned) {
    warned = true;
    console.warn(`AI limits are off (${reason}). Run supabase/ai-limits.sql to turn them on.`);
  }
  return true;
}

/** The response for a learner who has reached today's limit. */
export function limitReached(kind: AiKind) {
  return Response.json({ error: LIMIT_MESSAGES[kind], limit: kind }, { status: 429 });
}
