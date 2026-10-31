import { createClient } from '@supabase/supabase-js';
// Server-only. Uses the service-role key, which must never reach the browser.
export function db() {
  const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase environment variables are missing');
  return createClient(url, key, { auth: { persistSession: false } });
}
