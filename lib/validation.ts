import { wedding } from '@/config/wedding';
export type Status = 'attending' | 'not_attending';
export const eventIds = wedding.events.map((e) => e.id);
export const MAX_RSVP_PARTY = 10;

export type RsvpInput = {
  responses: Record<string, Status>;
  eventCounts: Record<string, number>;
};

export const cleanFullName = (v: unknown) =>
  typeof v === 'string' ? v.replace(/[\u0000-\u001f]/g, '').trim().replace(/\s+/g, ' ').slice(0, 120) : '';

export function validateRsvp(b: any, maxParty = MAX_RSVP_PARTY): { ok: true; data: RsvpInput } | { ok: false; error: string } {
  const responses: Record<string, Status> = {};
  const eventCounts: Record<string, number> = {};

  for (const id of eventIds) {
    const v = b?.responses?.[id];
    if (v !== 'attending' && v !== 'not_attending') return { ok: false, error: 'Please respond to every event.' };
    responses[id] = v;

    if (v === 'not_attending') {
      eventCounts[id] = 0;
      continue;
    }

    const count = Number(b?.eventCounts?.[id] ?? 1);
    if (!Number.isInteger(count) || count < 1 || count > maxParty) {
      return { ok: false, error: `For ${wedding.events.find((e) => e.id === id)?.name ?? 'each event'}, guests must be between 1 and ${maxParty}.` };
    }
    eventCounts[id] = count;
  }

  if (!eventIds.some((id) => responses[id] === 'attending')) {
    return { ok: false, error: 'Please select at least one event you will attend.' };
  }

  return { ok: true, data: { responses, eventCounts } };
}
