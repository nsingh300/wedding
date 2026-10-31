import type { Metadata } from 'next';
import RSVPForm from '@/components/RSVPForm';
export const metadata: Metadata = { title: 'RSVP — Neha & Vivek', robots: { index: false, follow: false } };
export default function Page() { return <RSVPForm />; }
