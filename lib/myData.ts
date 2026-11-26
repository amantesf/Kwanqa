import type { User } from '@supabase/supabase-js';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

// Everything kwanqa keeps about one learner on its servers, for the
// "Download my data" button on the profile page. Server only.

export async function myData(user: User) {
  const db = supabaseAdmin();
  if (!db) return null;

  const climb = await db.from('climbs').select('completed, grass, updated_at').eq('user_id', user.id).maybeSingle();

  return {
    about: 'Everything kwanqa keeps about you. Questions? kwanqa.team@gmail.com',
    downloaded_at: new Date().toISOString(),
    account: {
      email: user.email ?? null,
      created_at: user.created_at,
      last_sign_in_at: user.last_sign_in_at ?? null,
      signed_in_with: user.app_metadata?.providers ?? [user.app_metadata?.provider].filter(Boolean),
      profile: user.user_metadata ?? {},
    },
    progress: climb.data ?? null,
  };
}
