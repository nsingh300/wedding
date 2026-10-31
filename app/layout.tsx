import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Jost } from 'next/font/google';
import { wedding } from '@/config/wedding';
import './globals.css';

const serif = Cormorant_Garamond({ subsets: ['latin'], weight: ['300', '400', '500'], style: ['normal', 'italic'], variable: '--font-serif' });
const sans = Jost({ subsets: ['latin'], weight: ['300', '400', '500'], variable: '--font-sans' });
const title = `${wedding.bride} & ${wedding.groom} — ${wedding.tagline}`;
const description = `Join us on 2–3 December ${wedding.year} to celebrate the wedding of ${wedding.bride} and ${wedding.groom}.`;

export const metadata: Metadata = {
  metadataBase: new URL(wedding.siteUrl),
  title, description,
  openGraph: { title, description, type: 'website', images: [{ url: wedding.heroImage, width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image', title, description, images: [wedding.heroImage] },
  icons: { icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💍</text></svg>" },
};
export const viewport: Viewport = { themeColor: '#FAF6EE', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en" className={`${serif.variable} ${sans.variable}`}><body className="font-sans font-light">{children}</body></html>);
}
