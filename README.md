# Neha & Vivek — Wedding Website

```bash
npm install
npm run dev   # http://localhost:3000
```

- Edit names, year, venues, dress codes, story and music in `config/wedding.ts`.
- Couple album: drop images into `public/images/couple/` (jpg, png, webp, avif). They load automatically.
- Hero: `public/images/hero.jpg`. Event backgrounds: `public/images/events/{haldi,sangeet,wedding,reception}.jpg`. Story: `public/images/story/1.jpg`, `2.jpg`.
- Set `siteUrl` in the config to your Vercel URL so WhatsApp previews use the right image.

## Supabase (one project for RSVP + guest photos)

Copy `.env.example` to `.env.local` and fill all four keys from **Project Settings → API** on [supabase.com](https://supabase.com). Never commit `.env.local`; add the same variables on Vercel.

## RSVP

1. In the Supabase **SQL Editor**, run `supabase/migrations/001_rsvp.sql` once.
2. No guest list is required — anyone can RSVP on the site with their name, events, and headcount (up to 10 per event).
3. Responses appear in **`rsvp_responses`** (use the report query in `supabase/guests-example.sql`).
4. Submitting again with the **same name** updates that person's answers.

## Guest photo upload

1. Run `supabase/migrations/002_guest_photos.sql` (private `guest-photos` bucket + `guest_photos` table).
2. Restart `npm run dev` after adding the public Supabase keys to `.env.local`.
3. Guests upload from **Your Moments, Our Memories**; approved uploads appear under **Guest moments** on the homepage.
