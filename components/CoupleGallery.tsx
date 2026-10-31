'use client';
import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function CoupleGallery({ photos }: { photos: string[] }) {
  const [i, setI] = useState(0);
  const [open, setOpen] = useState(false);
  const n = photos.length;
  const go = useCallback((d: number) => setI((v) => (v + d + n) % n), [n]);
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => { if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1); if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k);
  }, [open, go]);
  const swipe = (_: unknown, info: PanInfo) => { if (info.offset.x < -60) go(1); else if (info.offset.x > 60) go(-1); };

  return (
    <section id="album" className="bg-beige/50 px-6 py-24 md:py-32">
      <div className="mx-auto max-w-5xl">
        <h2 className="font-serif text-4xl sm:text-5xl">The album</h2>
        {n === 0 ? (
          <p className="mt-8 text-ink/60">Add photographs to <code>/public/images/couple/</code> and they will appear here.</p>
        ) : (<>
          <div className="relative mt-10 aspect-[4/5] overflow-hidden bg-beige sm:aspect-[3/2]">
            <AnimatePresence mode="wait">
              <motion.button key={photos[i]} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
                drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.2} onDragEnd={swipe} onClick={() => setOpen(true)}
                aria-label="Open full screen" className="absolute inset-0 cursor-zoom-in">
                <Image src={photos[i]} alt={`Neha and Vivek, photo ${i + 1}`} fill sizes="(max-width: 1024px) 100vw, 1024px" className="pointer-events-none object-cover" priority={i === 0} />
              </motion.button>
            </AnimatePresence>
            <button onClick={() => go(-1)} aria-label="Previous photo" className="glass absolute left-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-ivory"><ChevronLeft /></button>
            <button onClick={() => go(1)} aria-label="Next photo" className="glass absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-ivory"><ChevronRight /></button>
          </div>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
            {photos.map((p, k) => (
              <button key={p} onClick={() => setI(k)} aria-label={`Show photo ${k + 1}`} className={`relative h-16 w-16 shrink-0 overflow-hidden ${k === i ? 'ring-2 ring-champagne' : 'opacity-60'}`}>
                <Image src={p} alt="" fill sizes="64px" loading="lazy" className="object-cover" />
              </button>
            ))}
          </div>
        </>)}
      </div>
      <AnimatePresence>
        {open && n > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-label="Photo viewer"
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95" onClick={() => setOpen(false)}>
            <motion.div key={photos[i]} drag="x" dragConstraints={{ left: 0, right: 0 }} onDragEnd={swipe} onClick={(e) => e.stopPropagation()} className="relative h-[85vh] w-[94vw]">
              <Image src={photos[i]} alt={`Photo ${i + 1} of ${n}`} fill sizes="100vw" className="pointer-events-none object-contain" />
            </motion.div>
            <button onClick={() => setOpen(false)} aria-label="Close" className="glass absolute right-4 top-4 rounded-full p-2 text-ivory"><X /></button>
            <button onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label="Previous photo" className="glass absolute left-3 rounded-full p-2 text-ivory"><ChevronLeft /></button>
            <button onClick={(e) => { e.stopPropagation(); go(1); }} aria-label="Next photo" className="glass absolute right-3 rounded-full p-2 text-ivory"><ChevronRight /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
