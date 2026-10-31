import { wedding } from '@/config/wedding';
export type Status = 'attending' | 'not_attending';
export const eventIds = wedding.events.map((e) => e.id);
export const tokenOk = (t: unknown): t is string => typeof t === 'string' && /^[a-f0-9]{20}$/.test(t);

export type RsvpInput = {
  email: string | null; phone: string | null; attendeeCount: number; additionalGuests: string[];
  dietary: string | null; requests: string | null; responses: Record<string, Status>;
};
const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export function validateRsvp(b: any, invited: number): { ok: true; data: RsvpInput } | { ok: false; error: string } {
  const email = str(b?.email, 120), phone = str(b?.phone, 20);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: 'Please enter a valid email address.' };
  if (phone && !/^\+?[\d\s-]{7,18}$/.test(phone)) return { ok: false, error: 'Please enter a valid phone number.' };
  const count = Number(b?.attendeeCount);
  if (!Number.isInteger(count) || count < 1 || count > invited) return { ok: false, error: `Number of attendees must be between 1 and ${invited}.` };
  const extra = Array.isArray(b?.additionalGuests) ? b.additionalGuests.map((n: unknown) => str(n, 80)).filter(Boolean) : [];
  if (extra.length > count - 1) return { ok: false, error: 'Too many additional guest names for the attendee count.' };
  const responses: Record<string, Status> = {};
  for (const id of eventIds) {
    const v = b?.responses?.[id];
    if (v !== 'attending' && v !== 'not_attending') return { ok: false, error: 'Please respond to every event.' };
    responses[id] = v;
  }
  return { ok: true, data: { email: email || null, phone: phone || null, attendeeCount: count, additionalGuests: extra,
    dietary: str(b?.dietary, 200) || null, requests: str(b?.requests, 500) || null, responses } };
}
