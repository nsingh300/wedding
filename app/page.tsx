import Hero from '@/components/Hero';
import Story from '@/components/Story';
import Countdown from '@/components/Countdown';
import EventSection from '@/components/EventSection';
import RsvpCta from '@/components/RsvpCta';
import CoupleGallery from '@/components/CoupleGallery';
import GuestPhotoUpload from '@/components/GuestPhotoUpload';
import Footer from '@/components/Footer';
import { getCouplePhotos } from '@/lib/photos';

export default function Home() {
  const photos = getCouplePhotos();
  return (<main><Hero /><Story /><Countdown /><EventSection /><RsvpCta /><CoupleGallery photos={photos} /><GuestPhotoUpload /><Footer /></main>);
}
