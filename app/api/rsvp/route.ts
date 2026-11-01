import { NextResponse } from 'next/server';
import { db } from '@/lib/supabase-server';
import { ipOf, limited } from '@/lib/ratelimit';
import { ensureGuest, findGuestByName, guestRsvpPayload } from '@/lib/rsvp';
import { cleanFullName, validateRsvp } from '@/lib/validation';

const fail = (error: string, status: number) => NextResponse.json({ error }, { status });

// Optional: load a previous RSVP by the same name (not an invite list check).
export async function GET(req: Request) {
  if (limited(`g:${ipOf(req)}`, 30)) return fail('Too many requests. Please wait a minute.', 429);
  const name = cleanFullName(new URL(req.url).searchParams.get('name'));
  if (name.length < 2) return fail('Please enter your name.', 400);
  try {
    const guest = await findGuestByName(name);
    if (!guest) return NextResponse.json({ guest: { full_name: name }, rsvp: null });
    return NextResponse.json(await guestRsvpPayload(guest));
  } catch (err) {
    console.error('rsvp get failed', err);
    const msg = err instanceof Error ? err.message : '';
    if (msg.includes('environment variables')) return fail('RSVP is not configured yet.', 503);
    if (/guests|rsvp_responses|schema cache|does not exist/i.test(msg)) return fail('RSVP database is not set up yet.', 503);
    return fail('Something went wrong. Please try again.', 500);
  }
}

export async function POST(req: Request) {
  if (limited(`p:${ipOf(req)}`, 8)) return fail('Too many requests. Please wait a minute.', 429);
  let body: any;
  try { body = await req.json(); } catch { return fail('Invalid request.', 400); }
  const fullName = cleanFullName(body?.fullName);
  if (fullName.length < 2) return fail('Please enter your name.', 400);
  try {
    const v = validateRsvp(body);
    if (!v.ok) return fail(v.error, 400);
    const d = v.data;
    const guest = await ensureGuest(fullName);
    const client = db();
    const rows = Object.entries(d.responses).map(([event_id, status]) => ({
      guest_id: guest.id,
      event_id,
      attendance_status: status,
      attendee_count: status === 'attending' ? d.eventCounts[event_id] : 0,
      additional_guest_names: [],
      dietary_preferences: null,
      special_requests: null,
    }));
    const r = await client.from('rsvp_responses').upsert(rows, { onConflict: 'guest_id,event_id' });
    if (r.error) throw r.error;
    return NextResponse.json({ ok: true, name: guest.full_name });
  } catch (err) {
    console.error('rsvp post failed', err);
    const msg = err instanceof Error ? err.message : '';
    if (msg.includes('environment variables')) return fail('RSVP is not configured yet.', 503);
    if (/guests|rsvp_responses|schema cache|does not exist/i.test(msg)) return fail('RSVP database is not set up yet.', 503);
    return fail('We could not save your response. Please try again.', 500);
  }
}
