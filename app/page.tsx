import Hero from '@/components/Hero';
import Story from '@/components/Story';
import Countdown from '@/components/Countdown';
import EventSection from '@/components/EventSection';
import RsvpSection from '@/components/RsvpSection';
import CoupleGallery from '@/components/CoupleGallery';
import GuestPhotoUpload from '@/components/GuestPhotoUpload';
import GuestPhotoGallery from '@/components/GuestPhotoGallery';
import Footer from '@/components/Footer';
import { getCouplePhotos } from '@/lib/photos';
import { getGuestPhotos, groupGuestPhotos } from '@/lib/guest-photos';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const photos = getCouplePhotos();
  const guestGroups = groupGuestPhotos(await getGuestPhotos());
  return (
    <main>
      <Hero />
      <Story />
      <Countdown />
      <EventSection />
      <RsvpSection />
      <CoupleGallery photos={photos} />
      <GuestPhotoUpload />
      <GuestPhotoGallery groups={guestGroups} />
      <Footer />
    </main>
  );
}
