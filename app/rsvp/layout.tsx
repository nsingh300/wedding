import Footer from '@/components/Footer';

export default function RsvpLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="min-h-[70vh]">{children}</div>
      <Footer />
    </>
  );
}
