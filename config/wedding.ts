// Central configuration — edit this file to change names, year, venues, copy and images.
export const wedding = {
  bride: 'Neha',
  groom: 'Vivek',
  year: 2026, // confirm the wedding year
  tagline: 'Together Forever',
  siteUrl: 'https://your-site.vercel.app',
  heroImage: '/images/hero.jpeg', // add your own photo; a soft gradient shows until then
  musicSrc: '', // e.g. '/audio/theme.mp3' — leave empty to hide the music control
  story: {
    title: 'How we found each other',
    intro: 'Replace this paragraph with your story. Two people, one long conversation that never quite ended.',
    photos: ['/images/story/1.jpeg', '/images/story/2.jpeg'],
timeline: [
  {
    when: 'The first hello',
    text: 'Who would have thought that an ordinary office video call would become the beginning of our forever? What started as a professional introduction turned into a beautiful coincidence when he joined my team on the same project. Our conversations slowly moved beyond work — from sharing office gossip and little secrets to talking about our days, dreams, plans, and everything in between. Somewhere between those endless conversations, we began sharing pieces of our hearts. He was 1,081 miles away, yet our hearts felt just 0 miles apart. Even a single day without talking felt incomplete. And just like that, a North Indian girl from UP fell in love with a South Indian boy. What began as a simple hello quietly became our favourite love story.'
  },
  {
    when: 'The first trip',
    text: 'After countless calls, messages, and conversations, the day finally arrived when we got to meet beyond our screens. Our first meeting in Bangalore made everything feel a little more real. The person who had become such a big part of my everyday life was finally right there beside me. And then came Mussoorie — the mountains, the beautiful views, and moments that made our story even more magical. Somewhere amidst those hills, our connection took an even more beautiful turn. We realised that we no longer wanted to count the days until our next meeting; we wanted to build a life where goodbyes would no longer be necessary. Mussoorie gave us more than beautiful memories; it gave our love a new direction.'
  },
  {
    when: 'The question',
    text: 'And then came Hyderabad, the city where a beautiful new chapter of our lives began. On my very first day there, on the 10th floor of a building, he turned an ordinary moment into one I would cherish forever. There was no grand setup or elaborate celebration — just the two of us, a little toe ring, and a question that carried the promise of a lifetime. As he gave me that toe ring, he asked me to stay in his life forever. A tiny piece of jewellery, yet a promise so big. In that moment, it was no longer about the miles between us or the distance we had travelled. It was about choosing each other, every single day, for the rest of our lives. And somewhere between that first hello and this beautiful promise, we had found our forever.'
  },
],
  },
  // Local date/time in IST. Countdown targets the event flagged `countdown: true`.
  events: [
    { id: 'haldi', name: 'Haldi Ceremony', month: 12, day: 2, time: '11:00', durationHrs: 3,
      venue: 'Mana theera Destination Wedding', address: 'Nandi Hills, Bangalore', mapsQuery: ' Foot Hills, Hobli, Sulthanpet, Karnataka 562103', dressCode: 'Yellow & pastels',
      image: '/images/events/haldi.jpg', tint: 'from-amber-200 to-yellow-100' },
    { id: 'sangeet', name: 'Sangeet Ceremony', month: 12, day: 2, time: '19:00', durationHrs: 4,
      venue: 'Mana theera Destination Wedding', address: 'Nandi Hills, Bangalore', mapsQuery: 'Foot Hills, Hobli, Sulthanpet, Karnataka 562103', dressCode: 'Festive glam',
      image: '/images/events/sangeet.jpg', tint: 'from-rose-200 to-amber-100' },
    { id: 'wedding', name: 'Wedding Ceremony', month: 12, day: 3, time: '09:00', durationHrs: 3, countdown: true,
      venue: 'Mana theera Destination Wedding', address: 'Nandi Hills, Bangalore', mapsQuery: 'Foot Hills, Hobli, Sulthanpet, Karnataka 562103', dressCode: 'Traditional Indian',
      image: '/images/events/wedding.jpg', tint: 'from-orange-200 to-rose-100' },
    { id: 'reception', name: 'North Indian Wedding & Reception', month: 12, day: 3, time: '19:00', durationHrs: 4,
      venue: 'Mana theera Destination Wedding', address: 'Nandi Hills, Bangalore', mapsQuery: 'Foot Hills, Hobli, Sulthanpet, Karnataka 562103', dressCode: 'Evening formal / Indian',
      image: '/images/events/reception.jpg', tint: 'from-emerald-200 to-stone-100' },
  ],
};
export type WeddingEvent = (typeof wedding.events)[number];
export const eventStartISO = (e: WeddingEvent) =>
  `${wedding.year}-${String(e.month).padStart(2, '0')}-${String(e.day).padStart(2, '0')}T${e.time}:00+05:30`;
