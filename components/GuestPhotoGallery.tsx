'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { GuestPhoto, GuestPhotoGroup } from '@/lib/guest-photos';

export default function GuestPhotoGallery({ groups }: { groups: GuestPhotoGroup[] }) {
  const photos = useMemo(() => groups.flatMap((g) => g.photos), [groups]);
  const [open, setOpen] = useState<GuestPhoto | null>(null);
  const n = photos.length;
  const idx = open ? photos.findIndex((p) => p.id === open.id) : -1;
  const go = useCallback((d: number) => {
    if (!n) return;
    setOpen((cur) => {
      const i = cur ? photos.findIndex((p) => p.id === cur.id) : 0;
      return photos[(i + d + n) % n];
    });
  }, [n, photos]);

  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'Escape') setOpen(null);
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [open, go]);

  const swipe = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60) go(1);
    else if (info.offset.x > 60) go(-1);
  };

  const caption = (photo: GuestPhoto) => {
    const group = groups.find((g) => g.photos.some((p) => p.id === photo.id));
    return [photo.guestName, group?.name].filter(Boolean).join(' · ');
  };

  return (
    <section id="guest-album" className="bg-beige/50 px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-serif text-4xl sm:text-5xl">Guest moments</h2>
        <p className="mt-3 max-w-xl text-ink/70">Photographs our guests have shared, gathered by celebration.</p>
        {n === 0 ? (
          <p className="mt-10 text-ink/60">No guest photos yet. Add one above and it will appear here.</p>
        ) : (
          <>
            {groups.length > 1 && (
              <nav className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-b border-champagne/50 pb-4" aria-label="Jump to an event">
                {groups.map((g) => (
                  <a key={g.id} href={`#guest-${g.id}`} className="font-serif text-xl italic text-ink/70 transition hover:text-champagne">
                    {g.name}
                  </a>
                ))}
              </nav>
            )}
            <div className="mt-6 space-y-16">
              {groups.map((g) => (
                <div key={g.id} id={`guest-${g.id}`}>
                  <div className="mb-8 flex items-end gap-5 border-b border-champagne/50 pb-4">
                    <h3 className="font-serif text-3xl italic sm:text-4xl">{g.name}</h3>
                    <span className="pb-1 text-xs tracking-[0.2em] text-ink/50">{g.photos.length} {g.photos.length === 1 ? 'PHOTO' : 'PHOTOS'}</span>
                  </div>
                  <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {g.photos.map((photo, i) => (
                      <motion.li key={photo.id} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: Math.min(i, 7) * 0.05 }}>
                        <button type="button" onClick={() => setOpen(photo)} aria-label={`Open photo from ${photo.guestName}`}
                          className="group relative block aspect-square w-full overflow-hidden bg-beige">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={photo.url} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                          <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent px-3 py-2 text-left text-xs text-ivory opacity-0 transition group-hover:opacity-100">
                            {photo.guestName}
                          </span>
                        </button>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <AnimatePresence>
        {open && n > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-label="Guest photo viewer"
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95" onClick={() => setOpen(null)}>
            <motion.div key={open.id} drag="x" dragConstraints={{ left: 0, right: 0 }} onDragEnd={swipe} onClick={(e) => e.stopPropagation()}
              className="relative flex h-[85vh] w-[94vw] flex-col items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={open.url} alt={caption(open)} className="max-h-[78vh] max-w-full object-contain" />
              <p className="mt-4 font-serif text-xl italic text-champagne">{caption(open)}</p>
              <p className="mt-1 text-xs tracking-widest text-ivory/50">{idx + 1} / {n}</p>
            </motion.div>
            <button type="button" onClick={() => setOpen(null)} aria-label="Close" className="glass absolute right-4 top-4 rounded-full p-2 text-ivory"><X /></button>
            {n > 1 && (<>
              <button type="button" onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label="Previous photo" className="glass absolute left-3 rounded-full p-2 text-ivory"><ChevronLeft /></button>
              <button type="button" onClick={(e) => { e.stopPropagation(); go(1); }} aria-label="Next photo" className="glass absolute right-3 rounded-full p-2 text-ivory"><ChevronRight /></button>
            </>)}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
