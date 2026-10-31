'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { wedding, eventStartISO } from '@/config/wedding';
import type { Status } from '@/lib/validation';

const field = 'w-full border-b border-ink/30 bg-transparent py-3 outline-none transition focus:border-champagne';
const when = (id: string) => {
  const e = wedding.events.find((x) => x.id === id)!;
  return new Date(eventStartISO(e)).toLocaleString('en-IN', { day: 'numeric', month: 'long', hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' });
};

export default function RSVPForm() {
  const { token } = useParams<{ token: string }>();
  const [view, setView] = useState<'loading' | 'invalid' | 'form' | 'done'>('loading');
  const [guest, setGuest] = useState({ full_name: '', invited_attendees: 1 });
  const [email, setEmail] = useState(''); const [phone, setPhone] = useState('');
  const [count, setCount] = useState(1); const [names, setNames] = useState<string[]>([]);
  const [dietary, setDietary] = useState(''); const [requests, setRequests] = useState('');
  const [answers, setAnswers] = useState<Record<string, Status | ''>>({});
  const [error, setError] = useState(''); const [busy, setBusy] = useState(false); const [returning, setReturning] = useState(false);

  useEffect(() => {
    fetch(`/api/rsvp?token=${encodeURIComponent(token)}`).then(async (r) => {
      if (!r.ok) return setView('invalid');
      const { guest: g, rsvp } = await r.json();
      setGuest(g); setEmail(g.email ?? ''); setPhone(g.phone ?? '');
      if (rsvp) { setReturning(true); setAnswers(rsvp.responses); setCount(rsvp.attendeeCount); setNames(rsvp.additionalGuests); setDietary(rsvp.dietary); setRequests(rsvp.requests); }
      setView('form');
    }).catch(() => setView('invalid'));
  }, [token]);

  async function submit(ev: React.FormEvent) {
    ev.preventDefault(); if (busy) return; setError('');
    if (wedding.events.some((e) => !answers[e.id])) return setError('Please respond to every event.');
    setBusy(true);
    try {
      const r = await fetch('/api/rsvp', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email, phone, attendeeCount: count, additionalGuests: names.slice(0, count - 1), dietary, requests, responses: answers }) });
      const j = await r.json();
      if (!r.ok) setError(j.error ?? 'Something went wrong.'); else { setReturning(true); setView('done'); window.scrollTo({ top: 0 }); }
    } catch { setError('Network error. Please try again.'); } finally { setBusy(false); }
  }

  const shell = 'mx-auto max-w-xl px-6 py-20 sm:py-28';
  if (view === 'loading') return <div className={`${shell} flex justify-center`}><Loader2 className="animate-spin text-champagne" /></div>;
  if (view === 'invalid') return (<div className={`${shell} text-center`}><h1 className="font-serif text-4xl">We couldn’t find your invitation</h1>
    <p className="mt-4 text-ink/70">Please open the personal link we sent you on WhatsApp, or contact Neha or Vivek.</p></div>);
  const first = guest.full_name.split(' ')[0];
  if (view === 'done') return (<div className={`${shell} text-center`}>
    <h1 className="font-serif text-4xl leading-tight sm:text-5xl">Thank you for being part of our special celebration, {first}.</h1>
    <ul className="mx-auto mt-8 max-w-sm space-y-2 text-left">{wedding.events.map((e) => (
      <li key={e.id} className="flex justify-between border-b border-champagne/40 pb-2 text-sm"><span>{e.name}</span><span className="text-ink/70">{answers[e.id] === 'attending' ? 'Attending' : 'Not attending'}</span></li>))}</ul>
    <div className="mt-10 flex flex-col items-center gap-4">
      <a href="/" className="border border-champagne px-6 py-3">Revisit the website</a>
      <button onClick={() => setView('form')} className="text-sm underline decoration-champagne underline-offset-4">Change my response</button></div></div>);

  return (
    <form onSubmit={submit} className={shell} noValidate>
      <h1 className="font-serif text-4xl sm:text-5xl">Dear {first},</h1>
      <p className="mt-3 text-ink/70">{returning ? 'Your response is saved. You can update it below.' : 'Will you celebrate with us? Please answer for each event.'}</p>
      <fieldset className="mt-10 space-y-5"><legend className="font-serif text-2xl italic">Your celebrations</legend>
        {wedding.events.map((e) => (
          <div key={e.id} className="border border-champagne/40 p-4">
            <p className="font-serif text-xl">{e.name}</p><p className="text-sm text-ink/60">{when(e.id)} IST</p>
            <div className="mt-3 grid grid-cols-2 gap-2" role="group" aria-label={e.name}>
              {(['attending', 'not_attending'] as const).map((s) => (
                <button type="button" key={s} aria-pressed={answers[e.id] === s} onClick={() => setAnswers({ ...answers, [e.id]: s })}
                  className={`py-3 text-sm transition ${answers[e.id] === s ? (s === 'attending' ? 'bg-emerald text-ivory' : 'bg-ink text-ivory') : 'border border-ink/20'}`}>
                  {s === 'attending' ? 'Attending' : 'Not attending'}</button>))}
            </div></div>))}
      </fieldset>
      <div className="mt-10 space-y-6">
        <label className="block text-sm">Full name<input className={field} value={guest.full_name} readOnly /></label>
        {guest.invited_attendees > 1 && (<label className="block text-sm">Number of attendees (including you)
          <select className={field} value={count} onChange={(e) => setCount(Number(e.target.value))}>
            {Array.from({ length: guest.invited_attendees }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}</select></label>)}
        {Array.from({ length: count - 1 }, (_, i) => (
          <label key={i} className="block text-sm">Guest {i + 2} name<input className={field} maxLength={80} value={names[i] ?? ''}
            onChange={(e) => { const n = [...names]; n[i] = e.target.value; setNames(n); }} /></label>))}
        <label className="block text-sm">Email (optional)<input type="email" inputMode="email" autoComplete="email" className={field} value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        <label className="block text-sm">Phone (optional)<input type="tel" inputMode="tel" autoComplete="tel" className={field} value={phone} onChange={(e) => setPhone(e.target.value)} /></label>
        <label className="block text-sm">Dietary preferences (optional)<input className={field} maxLength={200} placeholder="e.g. vegetarian, Jain, no onion-garlic" value={dietary} onChange={(e) => setDietary(e.target.value)} /></label>
        <label className="block text-sm">Special requests (optional)<textarea className={field} rows={3} maxLength={500} value={requests} onChange={(e) => setRequests(e.target.value)} /></label>
      </div>
      {error && <p role="alert" className="mt-6 text-sm text-red-800">{error}</p>}
      <button disabled={busy} className="mt-10 flex w-full items-center justify-center gap-2 bg-emerald py-4 text-ivory disabled:opacity-60">
        {busy && <Loader2 size={16} className="animate-spin" />}{returning ? 'Update my response' : 'Send my response'}</button>
    </form>
  );
}
