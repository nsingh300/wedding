'use client';
import { motion } from 'framer-motion';
import { CalendarPlus, MapPin, Shirt, Navigation } from 'lucide-react';
import { wedding, eventStartISO, WeddingEvent } from '@/config/wedding';
import { googleCalUrl, icsDataUrl, mapsUrl } from '@/lib/calendar';

const tz = 'Asia/Kolkata';
const d = (e: WeddingEvent) => new Date(eventStartISO(e));
const timeLabel = (e: WeddingEvent) => d(e).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: tz }).toUpperCase();
const weekday = (e: WeddingEvent) => d(e).toLocaleDateString('en-IN', { weekday: 'long', timeZone: tz });
const month = (e: WeddingEvent) => d(e).toLocaleDateString('en-IN', { month: 'long', timeZone: tz });

export default function EventSection() {
  const days = Array.from(new Set(wedding.events.map((e) => e.day))).map((day) => wedding.events.filter((e) => e.day === day));
  return (
    <section id="celebrations" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <h2 className="font-serif text-4xl sm:text-5xl">The celebrations</h2>
      <p className="mt-3 text-ink/70">All times are in Indian Standard Time (IST).</p>
      <div className="mt-16 space-y-20">
        {days.map((group) => (
          <div key={group[0].day}>
            <div className="mb-8 flex items-end gap-5 border-b border-champagne/50 pb-4">
              <span className="font-serif text-7xl font-light leading-none text-champagne sm:text-8xl">{String(group[0].day).padStart(2, '0')}</span>
              <span className="pb-2 font-serif text-2xl italic sm:text-3xl">{weekday(group[0])}, {month(group[0])} {wedding.year}</span>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {group.map((e, i) => (
                <motion.article key={e.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: i * 0.15 }}
                  className={`relative min-h-[480px] overflow-hidden bg-gradient-to-br ${e.tint}`}>
                  <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,.7)_1px,transparent_0)] [background-size:18px_18px]" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={e.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" onError={(ev) => (ev.currentTarget.style.display = 'none')} />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/35 to-ink/10" />
                  <div className="pointer-events-none absolute inset-3 border border-champagne/60" />
                  <div className="relative flex min-h-[480px] flex-col justify-between p-8 text-ivory">
                    <p className="font-serif text-5xl font-light sm:text-6xl">{timeLabel(e)}</p>
                    <div>
                      <h3 className="font-serif text-3xl leading-tight sm:text-4xl">{e.name}</h3>
                      <div className="glass mt-5 space-y-3 p-4 text-sm">
                        <p className="flex gap-2"><MapPin size={16} className="mt-0.5 shrink-0 text-champagne" /><span>{e.venue}<br />{e.address}</span></p>
                        {e.dressCode && <p className="flex gap-2"><Shirt size={16} className="mt-0.5 shrink-0 text-champagne" />{e.dressCode}</p>}
                        <div className="flex flex-wrap gap-2 pt-1">
                          <a href={mapsUrl(e)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 border border-champagne/70 px-3 py-2"><Navigation size={14} />Directions</a>
                          <a href={googleCalUrl(e)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 border border-champagne/70 px-3 py-2"><CalendarPlus size={14} />Google</a>
                          <a href={icsDataUrl(e)} download={`${e.id}.ics`} className="inline-flex items-center gap-1.5 border border-champagne/70 px-3 py-2"><CalendarPlus size={14} />Apple / Outlook</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
