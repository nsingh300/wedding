'use client';
import { motion } from 'framer-motion';
import { wedding } from '@/config/wedding';

export default function Story() {
  const s = wedding.story;
  return (
    <section id="story" className="mx-auto max-w-6xl px-6 py-24 md:py-36">
      <div className="grid items-start gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <h2 className="font-serif text-4xl leading-tight sm:text-5xl">{s.title}</h2>
          <p className="mt-6 max-w-md font-serif text-xl leading-relaxed text-ink/80">{s.intro}</p>
          <ol className="mt-12 space-y-8 border-l border-champagne/60 pl-6">
            {s.timeline.map((t) => (
              <li key={t.when} className="relative">
                <span className="absolute -left-[29px] top-2 h-2 w-2 rounded-full bg-champagne" />
                <p className="font-serif text-2xl italic">{t.when}</p>
                <p className="mt-1 max-w-sm text-ink/70">{t.text}</p>
              </li>
            ))}
          </ol>
        </div>
        <div className="grid grid-cols-2 gap-4 md:col-span-7">
          {s.photos.map((src, i) => (
            <motion.div key={src} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1 }}
              className={`overflow-hidden bg-beige ${i % 2 ? 'mt-12 aspect-[3/4]' : 'aspect-[3/4]'}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
