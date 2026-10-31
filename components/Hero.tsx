'use client';
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { wedding } from '@/config/wedding';

export default function Hero() {
  const audio = useRef<HTMLAudioElement>(null);
  const [on, setOn] = useState(false);
  const toggle = () => { const a = audio.current; if (!a) return; if (on) a.pause(); else a.play().catch(() => {}); setOn(!on); };
  return (
    <section className="relative flex h-[100svh] min-h-[560px] items-end justify-center overflow-hidden bg-gradient-to-b from-beige via-[#d8c6a3] to-emerald">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={wedding.heroImage} alt="" className="absolute inset-0 h-full w-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.6, ease: 'easeOut' }}
        className="relative z-10 px-6 pb-28 text-center text-ivory">
        <p className="font-serif text-lg italic tracking-wide text-champagne sm:text-xl">{wedding.tagline}</p>
        <h1 className="mt-3 font-serif text-6xl font-light leading-none sm:text-8xl md:text-9xl">
          {wedding.bride}<span className="mx-3 italic text-champagne sm:mx-5">&amp;</span>{wedding.groom}
        </h1>
        <p className="mt-6 text-sm tracking-[0.3em] sm:text-base">2 – 3 December {wedding.year}</p>
      </motion.div>
      <a href="#story" aria-label="Scroll to our story" className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
        <motion.span animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2.2 }} className="block h-12 w-px bg-champagne" />
      </a>
      {wedding.musicSrc && (<>
        <audio ref={audio} src={wedding.musicSrc} loop preload="none" />
        <button onClick={toggle} aria-label={on ? 'Mute music' : 'Play music'} className="glass absolute right-4 top-4 z-20 rounded-full p-3 text-ivory">
          {on ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
      </>)}
    </section>
  );
}
