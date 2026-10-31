'use client';
import { useEffect, useState } from 'react';
// Guests arrive via https://site/?g=TOKEN. The token is remembered so the button survives a refresh.
export default function RsvpCta() {
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    try {
      const g = new URLSearchParams(window.location.search).get('g');
      if (g && /^[a-f0-9]{20}$/.test(g)) localStorage.setItem('rsvp_token', g);
      setToken(g && /^[a-f0-9]{20}$/.test(g) ? g : localStorage.getItem('rsvp_token'));
    } catch { /* storage unavailable */ }
  }, []);
  return (
    <section id="rsvp" className="px-6 py-24 text-center">
      <div className="mx-auto max-w-xl border border-champagne/60 p-10 sm:p-14">
        <h2 className="font-serif text-4xl sm:text-5xl">Will you join us?</h2>
        <p className="mt-4 text-ink/70">Please let us know which celebrations you will attend.</p>
        {token ? <a href={`/rsvp/${token}`} className="mt-8 inline-block bg-emerald px-10 py-4 text-ivory">RSVP</a>
          : <p className="mt-8 text-sm text-ink/60">Open the personal invitation link we sent you on WhatsApp to respond.</p>}
      </div>
    </section>
  );
}
