-- Guest photo uploads. Safe to re-run. Does not depend on the RSVP tables.
-- Private bucket: files are only reachable through signed links; the bucket itself enforces size and type.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('guest-photos', 'guest-photos', false, 15728640, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = false, file_size_limit = 15728640, allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'];

create table if not exists public.guest_photos (
  id uuid primary key default gen_random_uuid(),
  guest_name text not null check (char_length(guest_name) between 1 and 80),
  event_id text,
  storage_path text not null unique,
  content_type text not null,
  size_bytes int not null check (size_bytes > 0),
  moderation_status text not null default 'pending' check (moderation_status in ('pending', 'approved', 'rejected')),
  uploaded_at timestamptz not null default now()
);
create index if not exists guest_photos_uploaded_idx on public.guest_photos (uploaded_at desc);
create index if not exists guest_photos_status_idx on public.guest_photos (moderation_status);

-- RLS on, no policies: the public cannot read, change or delete photo records or files.
-- Uploads happen through one-time signed upload links created by the server.
alter table public.guest_photos enable row level security;
