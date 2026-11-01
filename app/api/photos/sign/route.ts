import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { db } from '@/lib/supabase-server';
import { ipOf, limited } from '@/lib/ratelimit';
import { BUCKET, MAX_BYTES, MAX_FILES, PHOTO_TYPES } from '@/lib/upload-rules';
import { eventIds } from '@/lib/validation';

const fail = (error: string, status: number) => NextResponse.json({ error }, { status });

// Validates the request, then returns one-time signed upload links. Files go straight to private storage.
export async function POST(req: Request) {
  const ip = ipOf(req);
  if (limited(`s:${ip}`, 5) || limited(`sh:${ip}`, 20, 3_600_000)) return fail('Too many uploads. Please try again in a few minutes.', 429);
  let b: any;
  try { b = await req.json(); } catch { return fail('Invalid request.', 400); }

  const name = typeof b?.name === 'string' ? b.name.replace(/[\u0000-\u001f]/g, '').trim().slice(0, 80) : '';
  if (!name) return fail('Please enter your name.', 400);
  const eventId = b?.eventId ? String(b.eventId) : null;
  if (eventId && !eventIds.includes(eventId)) return fail('Unknown event.', 400);
  const files = b?.files;
  if (!Array.isArray(files) || files.length < 1 || files.length > MAX_FILES) return fail(`Choose between 1 and ${MAX_FILES} photos.`, 400);
  for (const f of files) {
    if (!PHOTO_TYPES[f?.type]) return fail('Only JPG, PNG and WEBP photos are allowed.', 400);
    if (!Number.isInteger(f?.size) || f.size < 1 || f.size > MAX_BYTES) return fail(`Each photo must be under ${MAX_BYTES / 1048576} MB.`, 400);
  }

  try {
    const client = db(), day = new Date().toISOString().slice(0, 10);
    const uploads: { path: string; token: string }[] = [];
    const rows: object[] = [];
    for (const f of files) {
      const path = `${day}/${randomUUID()}.${PHOTO_TYPES[f.type]}`;
      const { data, error } = await client.storage.from(BUCKET).createSignedUploadUrl(path);
      if (error || !data) throw error;
      uploads.push({ path, token: data.token });
      rows.push({ guest_name: name, event_id: eventId, storage_path: path, content_type: f.type, size_bytes: f.size });
    }
    const ins = await client.from('guest_photos').insert(rows);
    if (ins.error) throw ins.error;
    return NextResponse.json({ uploads });
  } catch (err) {
    console.error('photo sign failed', err);
    const msg = err instanceof Error ? err.message : (err && typeof err === 'object' && 'message' in err ? String((err as { message: unknown }).message) : '');
    if (msg.includes('environment variables')) {
      return fail('Photo upload is not configured. Add the Supabase keys to .env.local and restart the server.', 503);
    }
    if (/guest.photos|schema cache|does not exist|bucket/i.test(msg)) {
      return fail('Photo storage is not set up yet. Run supabase/migrations/002_guest_photos.sql in the Supabase SQL Editor.', 503);
    }
    return fail('Upload could not be started. Please try again.', 500);
  }
}
