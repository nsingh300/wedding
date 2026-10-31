'use client';
import { useEffect, useState } from 'react';
import { wedding, eventStartISO } from '@/config/wedding';

const target = new Date(eventStartISO(wedding.events.find((e) => 'countdown' in e) ?? wedding.events[0])).getTime();

export default function Countdown() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => { setNow(Date.now()); const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  const diff = Math.max(0, (target - (now ?? target)) / 1000);
  const parts = [['Days', Math.floor(diff / 86400)], ['Hours', Math.floor(diff / 3600) % 24], ['Minutes', Math.floor(diff / 60) % 60], ['Seconds', Math.floor(diff) % 60]] as const;
  return (
    <section className="bg-emerald px-6 py-20 text-ivory">
      <p className="text-center font-serif text-2xl italic text-champagne">Until we say “I do”</p>
      <div className="mx-auto mt-10 grid max-w-3xl grid-cols-4 gap-2 text-center sm:gap-8" aria-live="off">
        {parts.map(([label, v]) => (
          <div key={label}>
            <div className="font-serif text-5xl font-light tabular-nums sm:text-7xl">{now === null ? '--' : String(v).padStart(2, '0')}</div>
            <div className="mt-2 text-xs tracking-widest text-ivory/70 sm:text-sm">{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
