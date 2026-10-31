import { createClient } from '@supabase/supabase-js';
// Uses the public anon key only. It cannot read or list anything: RLS has no public policies.
export function supabaseBrowser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Upload is not configured yet.');
  return createClient(url, key, { auth: { persistSession: false } });
}
