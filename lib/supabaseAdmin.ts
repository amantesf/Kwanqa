import { createClient } from '@supabase/supabase-js';

// Server-only Supabase client with the secret key. It bypasses row-level
// security, so it must never be imported by a page or component.
export function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
