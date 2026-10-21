import { createClient, type User } from '@supabase/supabase-js';

// Who is calling an API route, from the "Authorization: Bearer <access token>"
// header the browser sends. Server only.

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const auth = url && key ? createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }) : null;

/** False when Supabase isn't configured, in which case the site runs without accounts. */
export const accountsOn = auth !== null;

export async function requestUser(request: Request): Promise<User | null> {
  const token = request.headers.get('authorization')?.match(/^Bearer (.+)$/)?.[1];
  if (!auth || !token) return null;
  const { data, error } = await auth.auth.getUser(token);
  return error ? null : data.user;
}
