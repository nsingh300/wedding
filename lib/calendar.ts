import { WeddingEvent, eventStartISO, wedding } from '@/config/wedding';
const fmt = (d: Date) => d.toISOString().replace(/[-:]|\.\d{3}/g, '');
function range(e: WeddingEvent) {
  const s = new Date(eventStartISO(e));
  return { s: fmt(s), e: fmt(new Date(s.getTime() + e.durationHrs * 3600_000)) };
}
const title = (e: WeddingEvent) => `${e.name} — ${wedding.bride} & ${wedding.groom}`;
export function googleCalUrl(e: WeddingEvent) {
  const { s, e: end } = range(e);
  const p = new URLSearchParams({ action: 'TEMPLATE', text: title(e), dates: `${s}/${end}`, location: `${e.venue}, ${e.address}` });
  return `https://calendar.google.com/calendar/render?${p}`;
}
export function icsDataUrl(e: WeddingEvent) {
  const { s, e: end } = range(e);
  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'BEGIN:VEVENT', `UID:${e.id}@wedding`, `DTSTAMP:${s}`, `DTSTART:${s}`, `DTEND:${end}`,
    `SUMMARY:${title(e)}`, `LOCATION:${e.venue}, ${e.address}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  return 'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics);
}
export const mapsUrl = (e: WeddingEvent) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(e.mapsQuery)}`;
