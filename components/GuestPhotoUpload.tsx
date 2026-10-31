'use client';
import { useRef, useState } from 'react';
import { AlertCircle, Camera, CheckCircle2, Loader2, X } from 'lucide-react';
import { wedding } from '@/config/wedding';
import { MAX_BYTES, MAX_FILES, PHOTO_TYPES, BUCKET } from '@/lib/upload-rules';
import { supabaseBrowser } from '@/lib/supabase-browser';

type Item = { id: number; file: File; url: string; status: 'queued' | 'uploading' | 'done' | 'error' };
const field = 'w-full border-b border-ink/30 bg-transparent py-3 outline-none transition focus:border-champagne';
const mb = (n: number) => `${(n / 1048576).toFixed(1)} MB`;

export default function GuestPhotoUpload() {
  const [items, setItems] = useState<Item[]>([]);
  const [name, setName] = useState(''); const [eventId, setEventId] = useState('');
  const [busy, setBusy] = useState(false); const [batch, setBatch] = useState({ done: 0, total: 0 });
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const seq = useRef(0); const input = useRef<HTMLInputElement>(null);

  function add(list: FileList | null) {
    if (!list) return;
    const added: Item[] = []; const problems: string[] = [];
    for (const file of Array.from(list)) {
      if (!PHOTO_TYPES[file.type]) problems.push(`${file.name}: only JPG, PNG or WEBP.`);
      else if (file.size > MAX_BYTES) problems.push(`${file.name}: larger than ${MAX_BYTES / 1048576} MB.`);
      else if (items.length + added.length >= MAX_FILES) { problems.push(`You can add up to ${MAX_FILES} photos at a time.`); break; }
      else added.push({ id: ++seq.current, file, url: URL.createObjectURL(file), status: 'queued' });
    }
    setItems((p) => [...p, ...added]);
    setMsg(problems.length ? { ok: false, text: problems.join(' ') } : null);
    if (input.current) input.current.value = '';
  }
  const remove = (id: number) => setItems((p) => { p.filter((i) => i.id === id).forEach((i) => URL.revokeObjectURL(i.url)); return p.filter((i) => i.id !== id); });
  const mark = (id: number, status: Item['status']) => setItems((p) => p.map((i) => (i.id === id ? { ...i, status } : i)));

  async function submit(e: React.FormEvent) {
    e.preventDefault(); if (busy) return;
    const todo = items.filter((i) => i.status !== 'done');
    if (!name.trim()) return setMsg({ ok: false, text: 'Please enter your name.' });
    if (!todo.length) return setMsg({ ok: false, text: 'Please choose at least one photo.' });
    setBusy(true); setMsg(null); setBatch({ done: 0, total: todo.length });
    try {
      const r = await fetch('/api/photos/sign', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, eventId: eventId || null, files: todo.map((i) => ({ type: i.file.type, size: i.file.size })) }) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error ?? 'Upload could not be started.');
      const sb = supabaseBrowser(); let ok = 0;
      for (let k = 0; k < todo.length; k++) {
        mark(todo[k].id, 'uploading');
        const { error } = await sb.storage.from(BUCKET).uploadToSignedUrl(j.uploads[k].path, j.uploads[k].token, todo[k].file, { contentType: todo[k].file.type });
        mark(todo[k].id, error ? 'error' : 'done'); if (!error) ok++;
        setBatch({ done: k + 1, total: todo.length });
      }
      setItems((p) => { p.filter((i) => i.status === 'done').forEach((i) => URL.revokeObjectURL(i.url)); return p.filter((i) => i.status !== 'done'); });
      setMsg(ok === todo.length
        ? { ok: true, text: `Thank you, ${name.trim().split(' ')[0]}! ${ok} photo${ok > 1 ? 's' : ''} added to our memories.` }
        : { ok: false, text: `${ok} of ${todo.length} uploaded. The rest failed. Please press Upload photos to retry.` });
    } catch (err) { setMsg({ ok: false, text: err instanceof Error ? err.message : 'Something went wrong.' }); }
    finally { setBusy(false); }
  }

  return (
    <section id="moments" className="px-6 py-24 md:py-32">
      <form onSubmit={submit} noValidate className="mx-auto max-w-2xl border border-champagne/60 p-6 sm:p-12">
        <h2 className="text-center font-serif text-4xl sm:text-5xl">Your Moments, Our Memories</h2>
        <p className="mx-auto mt-4 max-w-md text-center text-ink/70">Took a photo at our celebrations? Add it here so we can keep it forever.</p>
        <div className="mt-10 space-y-6">
          <label className="block text-sm">Your name<input className={field} value={name} maxLength={80} autoComplete="name" onChange={(e) => setName(e.target.value)} /></label>
          <label className="block text-sm">Which event? (optional)
            <select className={field} value={eventId} onChange={(e) => setEventId(e.target.value)}>
              <option value="">Not sure / general</option>{wedding.events.map((ev) => <option key={ev.id} value={ev.id}>{ev.name}</option>)}</select></label>
        </div>
        <input ref={input} type="file" multiple accept="image/jpeg,image/png,image/webp" className="sr-only" id="photo-input" onChange={(e) => add(e.target.files)} />
        <label htmlFor="photo-input" onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); add(e.dataTransfer.files); }}
          className="mt-8 flex cursor-pointer flex-col items-center gap-2 border border-dashed border-champagne py-10 text-center transition hover:bg-beige/40">
          <Camera className="text-champagne" /><span>Choose photos</span>
          <span className="text-xs text-ink/60">JPG, PNG or WEBP · up to {MAX_BYTES / 1048576} MB each · {MAX_FILES} at a time</span></label>
        {items.length > 0 && (<ul className="mt-6 space-y-2">{items.map((i) => (
          <li key={i.id} className="flex items-center gap-3 text-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={i.url} alt="" className="h-12 w-12 shrink-0 object-cover" />
            <span className="min-w-0 flex-1 truncate">{i.file.name}<span className="block text-xs text-ink/50">{mb(i.file.size)}</span></span>
            {i.status === 'uploading' && <Loader2 size={16} className="animate-spin text-champagne" />}
            {i.status === 'error' && <AlertCircle size={16} className="text-red-800" aria-label="Failed" />}
            {!busy && <button type="button" onClick={() => remove(i.id)} aria-label={`Remove ${i.file.name}`}><X size={16} /></button>}
          </li>))}</ul>)}
        {busy && (<div className="mt-6" role="progressbar" aria-valuemin={0} aria-valuemax={batch.total} aria-valuenow={batch.done}>
          <div className="h-1 bg-beige"><div className="h-1 bg-champagne transition-all" style={{ width: `${(batch.done / batch.total) * 100}%` }} /></div>
          <p className="mt-2 text-center text-xs text-ink/60">Uploading {Math.min(batch.done + 1, batch.total)} of {batch.total}. Please keep this page open.</p></div>)}
        {msg && (<p role="alert" className={`mt-6 flex items-start gap-2 text-sm ${msg.ok ? 'text-emerald' : 'text-red-800'}`}>
          {msg.ok ? <CheckCircle2 size={16} className="mt-0.5 shrink-0" /> : <AlertCircle size={16} className="mt-0.5 shrink-0" />}{msg.text}</p>)}
        <button disabled={busy} className="mt-8 flex w-full items-center justify-center gap-2 bg-emerald py-4 text-ivory disabled:opacity-60">
          {busy && <Loader2 size={16} className="animate-spin" />}Upload photos</button>
      </form>
    </section>
  );
}
