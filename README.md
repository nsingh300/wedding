# Neha & Vivek — Wedding Website (Stage 1)

```bash
npm install
npm run dev   # http://localhost:3000
```

- Edit names, year, venues, dress codes, story and music in `config/wedding.ts`.
- Couple album: drop images into `public/images/couple/` (jpg, png, webp, avif). They load automatically.
- Hero: `public/images/hero.jpg`. Event backgrounds: `public/images/events/{haldi,sangeet,wedding,reception}.jpg`. Story: `public/images/story/1.jpg`, `2.jpg`.
- Set `siteUrl` in the config to your Vercel URL so WhatsApp previews use the right image.

Not yet built: RSVP, guest uploads, admin dashboard, Supabase (Stages 3–5).

## RSVP setup (Stage 3)
1. Create a project at supabase.com. In SQL Editor, run `supabase/migrations/001_rsvp.sql`.
2. Copy `.env.example` to `.env.local` and fill `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (Project Settings > API). Never commit it; on Vercel add both under Settings > Environment Variables.
3. Add guests with `supabase/guests-example.sql`. Its last query prints each guest's personal link (`https://your-site/?g=TOKEN`) to send on WhatsApp.
4. Test: open a guest link, press RSVP, submit, then reopen the link to confirm your answers are pre-filled. Check the `rsvp_responses` table in Supabase (4 rows per guest).

## Guest photo upload (Stage 4)
1. Run `supabase/migrations/002_guest_photos.sql` in the SQL Editor (creates the private `guest-photos` bucket and the `guest_photos` table).
2. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local` and to Vercel, then restart `npm run dev`.
3. Test: scroll to "Your Moments, Our Memories", enter a name, choose 2 photos, upload. Check Storage > guest-photos and the `guest_photos` table.
4. Until the admin dashboard exists, review and download photos in the Supabase dashboard (Storage). Records start as `pending`.
