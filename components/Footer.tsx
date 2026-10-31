import { wedding } from '@/config/wedding';
export default function Footer() {
  return (
    <footer className="bg-ink px-6 py-16 text-center text-ivory">
      <p className="font-serif text-4xl italic text-champagne">{wedding.bride} &amp; {wedding.groom}</p>
      <p className="mt-3 text-sm tracking-widest text-ivory/70">2 – 3 DECEMBER {wedding.year}</p>
    </footer>
  );
}
