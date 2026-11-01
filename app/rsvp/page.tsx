import Link from 'next/link';

export default function Page() {
  return (
    <div className="mx-auto max-w-xl px-6 py-28 text-center sm:py-32">
      <div className="border border-champagne/60 p-10 sm:p-14">
        <h1 className="font-serif text-4xl sm:text-5xl">RSVP</h1>
        <p className="mt-4 text-ink/70">Please respond on the wedding homepage — scroll to <strong className="font-normal">Will you join us?</strong> and enter your name.</p>
        <Link href="/#rsvp" className="mt-8 inline-block bg-emerald px-10 py-4 text-ivory">Go to RSVP</Link>
      </div>
    </div>
  );
}
