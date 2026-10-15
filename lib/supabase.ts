import { createClient } from '@supabase/supabase-js';

// Accounts are optional: without these env vars the site still works,
// progress just stays in the browser and the auth pages say so.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const supabase = url && key ? createClient(url, key) : null;

export const accountsEnabled = supabase !== null;
