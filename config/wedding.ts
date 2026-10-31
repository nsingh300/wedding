// Central configuration — edit this file to change names, year, venues, copy and images.
export const wedding = {
  bride: 'Neha',
  groom: 'Vivek',
  year: 2026, // confirm the wedding year
  tagline: 'Together Forever',
  siteUrl: 'https://your-site.vercel.app',
  heroImage: '/images/hero.jpg', // add your own photo; a soft gradient shows until then
  musicSrc: '', // e.g. '/audio/theme.mp3' — leave empty to hide the music control
  story: {
    title: 'How we found each other',
    intro: 'Replace this paragraph with your story. Two people, one long conversation that never quite ended.',
    photos: ['/images/story/1.jpg', '/images/story/2.jpg'],
    timeline: [
      { when: 'The first hello', text: 'Add the moment you met.' },
      { when: 'The first trip', text: 'Add a memory that changed everything.' },
      { when: 'The question', text: 'Add how the proposal happened.' },
    ],
  },
  // Local date/time in IST. Countdown targets the event flagged `countdown: true`.
  events: [
    { id: 'haldi', name: 'Haldi Ceremony', month: 12, day: 2, time: '11:00', durationHrs: 3,
      venue: 'Venue name TBC', address: 'Address, City', mapsQuery: 'Venue name, City', dressCode: 'Yellow & pastels',
      image: '/images/events/haldi.jpg', tint: 'from-amber-200 to-yellow-100' },
    { id: 'sangeet', name: 'Sangeet Ceremony', month: 12, day: 2, time: '19:00', durationHrs: 4,
      venue: 'Venue name TBC', address: 'Address, City', mapsQuery: 'Venue name, City', dressCode: 'Festive glam',
      image: '/images/events/sangeet.jpg', tint: 'from-rose-200 to-amber-100' },
    { id: 'wedding', name: 'Wedding Ceremony', month: 12, day: 3, time: '09:00', durationHrs: 3, countdown: true,
      venue: 'Venue name TBC', address: 'Address, City', mapsQuery: 'Venue name, City', dressCode: 'Traditional Indian',
      image: '/images/events/wedding.jpg', tint: 'from-orange-200 to-rose-100' },
    { id: 'reception', name: 'North Indian Wedding & Reception', month: 12, day: 3, time: '19:00', durationHrs: 4,
      venue: 'Venue name TBC', address: 'Address, City', mapsQuery: 'Venue name, City', dressCode: 'Evening formal / Indian',
      image: '/images/events/reception.jpg', tint: 'from-emerald-200 to-stone-100' },
  ],
};
export type WeddingEvent = (typeof wedding.events)[number];
export const eventStartISO = (e: WeddingEvent) =>
  `${wedding.year}-${String(e.month).padStart(2, '0')}-${String(e.day).padStart(2, '0')}T${e.time}:00+05:30`;
