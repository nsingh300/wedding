import { NextResponse } from 'next/server';
import { db } from '@/lib/supabase-server';
import { ipOf, limited } from '@/lib/ratelimit';
import { tokenOk, validateRsvp } from '@/lib/validation';

const fail = (error: string, status: number) => NextResponse.json({ error }, { status });

async function findGuest(token: string) {
  const { data } = await db().from('guests').select('id, full_name, email, phone, invited_attendees').eq('invite_token', token).maybeSingle();
  return data;
}

export async function GET(req: Request) {
  if (limited(`g:${ipOf(req)}`, 30)) return fail('Too many requests. Please wait a minute.', 429);
  const token = new URL(req.url).searchParams.get('token');
  if (!tokenOk(token)) return fail('Invalid invitation link.', 404);
  try {
    const guest = await findGuest(token);
    if (!guest) return fail('Invitation not found.', 404);
    const { data: rows } = await db().from('rsvp_responses').select('event_id, attendance_status, attendee_count, additional_guest_names, dietary_preferences, special_requests').eq('guest_id', guest.id);
    const rsvp = rows?.length ? {
      responses: Object.fromEntries(rows.map((r) => [r.event_id, r.attendance_status])),
      attendeeCount: Math.max(1, ...rows.map((r) => r.attendee_count)),
      additionalGuests: rows[0].additional_guest_names ?? [], dietary: rows[0].dietary_preferences ?? '', requests: rows[0].special_requests ?? '',
    } : null;
    return NextResponse.json({ guest: { full_name: guest.full_name, email: guest.email, phone: guest.phone, invited_attendees: guest.invited_attendees }, rsvp });
  } catch { return fail('Something went wrong. Please try again.', 500); }
}

export async function POST(req: Request) {
  if (limited(`p:${ipOf(req)}`, 8)) return fail('Too many requests. Please wait a minute.', 429);
  let body: any;
  try { body = await req.json(); } catch { return fail('Invalid request.', 400); }
  if (!tokenOk(body?.token)) return fail('Invalid invitation link.', 404);
  try {
    const guest = await findGuest(body.token);
    if (!guest) return fail('Invitation not found.', 404);
    const v = validateRsvp(body, guest.invited_attendees);
    if (!v.ok) return fail(v.error, 400);
    const d = v.data, client = db();
    const g = await client.from('guests').update({ email: d.email, phone: d.phone }).eq('id', guest.id);
    if (g.error) throw g.error;
    const rows = Object.entries(d.responses).map(([event_id, status]) => ({
      guest_id: guest.id, event_id, attendance_status: status, attendee_count: status === 'attending' ? d.attendeeCount : 0,
      additional_guest_names: d.additionalGuests, dietary_preferences: d.dietary, special_requests: d.requests,
    }));
    const r = await client.from('rsvp_responses').upsert(rows, { onConflict: 'guest_id,event_id' });
    if (r.error) throw r.error;
    return NextResponse.json({ ok: true, name: guest.full_name });
  } catch { return fail('We could not save your response. Please try again.', 500); }
}
