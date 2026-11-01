import { db } from '@/lib/supabase-server';
import { cleanFullName, MAX_RSVP_PARTY } from '@/lib/validation';

type GuestRow = {
  id: string;
  full_name: string;
  invited_attendees: number;
};

export async function guestRsvpPayload(guest: GuestRow) {
  const { data: rows } = await db()
    .from('rsvp_responses')
    .select('event_id, attendance_status, attendee_count')
    .eq('guest_id', guest.id);
  const rsvp = rows?.length
    ? {
        responses: Object.fromEntries(rows.map((r) => [r.event_id, r.attendance_status])),
        eventCounts: Object.fromEntries(rows.map((r) => [r.event_id, r.attendee_count])),
      }
    : null;
  return { guest: { full_name: guest.full_name }, rsvp };
}

export async function findGuestByName(fullName: string) {
  const { data } = await db()
    .from('guests')
    .select('id, full_name, invited_attendees')
    .ilike('full_name', fullName)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  return data;
}

export async function ensureGuest(fullName: string) {
  const name = cleanFullName(fullName);
  const client = db();
  const existing = await findGuestByName(name);
  if (existing) {
    const { data, error } = await client
      .from('guests')
      .update({ invited_attendees: MAX_RSVP_PARTY })
      .eq('id', existing.id)
      .select('id, full_name, invited_attendees')
      .single();
    if (error) throw error;
    return data!;
  }
  const { data, error } = await client
    .from('guests')
    .insert({ full_name: name, invited_attendees: MAX_RSVP_PARTY })
    .select('id, full_name, invited_attendees')
    .single();
  if (error) throw error;
  return data!;
}
