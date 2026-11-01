"use client";
import { useState } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { wedding, eventStartISO } from "@/config/wedding";
import { MAX_RSVP_PARTY, type Status } from "@/lib/validation";

const field =
  "w-full border-b border-ink/30 bg-transparent py-3 outline-none transition focus:border-champagne";
const when = (id: string) => {
  const e = wedding.events.find((x) => x.id === id)!;
  return new Date(eventStartISO(e)).toLocaleString("en-IN", {
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });
};

const emptyEventCounts = () =>
  Object.fromEntries(wedding.events.map((e) => [e.id, 1]));

type Props = { standalone?: boolean };

export default function RsvpSection({ standalone = false }: Props) {
  const [step, setStep] = useState<"form" | "done">("form");
  const [fullName, setFullName] = useState("");
  const [eventCounts, setEventCounts] =
    useState<Record<string, number>>(emptyEventCounts);
  const [answers, setAnswers] = useState<Record<string, Status | "">>({});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [returning, setReturning] = useState(false);
  const [loadMsg, setLoadMsg] = useState<string | null>(null);

  const setAttendance = (eventId: string, status: Status) => {
    setAnswers((prev) => ({ ...prev, [eventId]: status }));
    if (status === "not_attending")
      setEventCounts((prev) => ({ ...prev, [eventId]: 0 }));
    else
      setEventCounts((prev) => ({
        ...prev,
        [eventId]: prev[eventId] > 0 ? prev[eventId] : 1,
      }));
  };

  async function loadPrevious() {
    const name = fullName.trim();
    if (name.length < 2)
      return setError("Enter your name first, then load your saved response.");
    setBusy(true);
    setError("");
    setLoadMsg(null);
    try {
      const r = await fetch(`/api/rsvp?name=${encodeURIComponent(name)}`);
      const j = await r.json();
      if (!r.ok) throw new Error(j.error ?? "Could not load your response.");
      if (j.rsvp) {
        setReturning(true);
        setAnswers(j.rsvp.responses);
        setEventCounts({ ...emptyEventCounts(), ...j.rsvp.eventCounts });
        setLoadMsg(
          "Your previous answers are loaded. You can change them and submit again.",
        );
      } else {
        setLoadMsg(
          "No saved response for this name yet — fill in the form below.",
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    if (busy) return;
    setError("");
    setLoadMsg(null);
    if (fullName.trim().length < 2) return setError("Please enter your name.");
    if (wedding.events.some((e) => !answers[e.id]))
      return setError("Please respond to every event.");
    if (!wedding.events.some((e) => answers[e.id] === "attending"))
      return setError("Please select at least one event you will attend.");
    setBusy(true);
    try {
      const r = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          responses: answers,
          eventCounts,
        }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error ?? "Something went wrong.");
      setReturning(true);
      setStep("done");
      document
        .getElementById("rsvp")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Network error. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  const outer = standalone
    ? "mx-auto max-w-2xl px-6 py-16 sm:py-24"
    : "mx-auto max-w-2xl";
  const card = `${outer} border border-champagne/60 p-6 sm:p-12`;
  const first = fullName.trim().split(" ")[0] || "friend";
  const Title = standalone ? "h1" : "h2";

  const summaryFor = (eventId: string) => {
    if (answers[eventId] !== "attending") return "Not attending";
    const n = eventCounts[eventId] ?? 1;
    return n === 1 ? "Attending · 1 guest" : `Attending · ${n} guests`;
  };

  if (step === "done") {
    return (
      <section id="rsvp" className="px-6 py-24 md:py-32">
        <div className={`${card} text-center`}>
          <CheckCircle2 className="mx-auto text-emerald" aria-hidden />
          <p className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
            Thank you, {first}!
          </p>
          <p className="mt-3 text-ink/70">We&apos;ve saved your RSVP.</p>
          <ul className="mx-auto mt-8 max-w-md space-y-2 text-left">
            {wedding.events.map((e) => (
              <li
                key={e.id}
                className="flex justify-between gap-4 border-b border-champagne/40 pb-2 text-sm"
              >
                <span>{e.name}</span>
                <span className="shrink-0 text-ink/70">{summaryFor(e.id)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-col items-center gap-4">
            {!standalone && (
              <p className="text-sm text-ink/60">
                Scroll down to share photos from the celebrations.
              </p>
            )}
            {standalone && (
              <Link href="/" className="border border-champagne px-6 py-3">
                Back to the wedding site
              </Link>
            )}
            <button
              type="button"
              onClick={() => setStep("form")}
              className="text-sm underline decoration-champagne underline-offset-4"
            >
              Change my response
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="rsvp" className="px-6 py-24 md:py-32">
      <form onSubmit={submit} className={card} noValidate>
        {standalone && (
          <Link
            href="/"
            className="text-sm text-ink/60 transition hover:text-champagne"
          >
            ← Back to the wedding site
          </Link>
        )}
        <Title
          className={`text-center font-serif text-4xl sm:text-5xl ${standalone ? "mt-6" : ""}`}
        >
          When will you join us ?
        </Title>
        <p className="mx-auto mt-4 max-w-md text-center text-ink/70">
          Your name, which events you&apos;ll join, and how many people are
          coming.
        </p>

        <div className="mt-10 space-y-3">
          <label className="block text-sm">
            Your name
            <input
              className={field}
              value={fullName}
              autoComplete="name"
              maxLength={120}
              onChange={(e) => setFullName(e.target.value)}
            />
          </label>
          <button
            type="button"
            disabled={busy}
            onClick={loadPrevious}
            className="text-sm text-ink/70 underline decoration-champagne underline-offset-4 disabled:opacity-50"
          >
            Load my previous response
          </button>
          {loadMsg && <p className="text-sm text-ink/60">{loadMsg}</p>}
        </div>

        <fieldset className="mt-10 space-y-5">
          <legend className="font-serif text-2xl italic">
            Your celebrations
          </legend>
          {wedding.events.map((e) => {
            const attending = answers[e.id] === "attending";
            const count = eventCounts[e.id] ?? 1;
            return (
              <div key={e.id} className="border border-champagne/40 p-4">
                <p className="font-serif text-xl">{e.name}</p>
                <p className="text-sm text-ink/60">{when(e.id)} IST</p>
                <p className="mt-3 text-xs tracking-wide text-ink/50">
                  WILL YOU ATTEND?
                </p>
                <div
                  className="mt-2 grid grid-cols-2 gap-2"
                  role="group"
                  aria-label={`${e.name} attendance`}
                >
                  {(["attending", "not_attending"] as const).map((s) => (
                    <button
                      type="button"
                      key={s}
                      aria-pressed={answers[e.id] === s}
                      onClick={() => setAttendance(e.id, s)}
                      className={`py-3 text-sm transition ${answers[e.id] === s ? (s === "attending" ? "bg-emerald text-ivory" : "bg-ink text-ivory") : "border border-ink/20"}`}
                    >
                      {s === "attending" ? "Yes, attending" : "Not attending"}
                    </button>
                  ))}
                </div>
                {attending && (
                  <label className="mt-4 block border-t border-champagne/30 pt-4 text-sm">
                    How many people (including you)?
                    <select
                      className={field}
                      value={count}
                      onChange={(ev) =>
                        setEventCounts((prev) => ({
                          ...prev,
                          [e.id]: Number(ev.target.value),
                        }))
                      }
                    >
                      {Array.from({ length: MAX_RSVP_PARTY }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} {i === 0 ? "guest" : "guests"}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
              </div>
            );
          })}
        </fieldset>

        {error && (
          <p
            role="alert"
            className="mt-6 flex items-start gap-2 text-sm text-red-800"
          >
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            {error}
          </p>
        )}
        <button
          disabled={busy}
          className="mt-10 flex w-full items-center justify-center gap-2 bg-emerald py-4 text-ivory disabled:opacity-60"
        >
          {busy && <Loader2 size={16} className="animate-spin" />}
          {returning ? "Update my response" : "Send my response"}
        </button>
      </form>
    </section>
  );
}
