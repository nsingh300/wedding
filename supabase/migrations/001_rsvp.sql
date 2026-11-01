-- RSVP schema. Safe to re-run in Supabase SQL Editor.
create table if not exists public.guests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(full_name) between 1 and 120),
  email text, phone text,
  invited_attendees int not null default 1 check (invited_attendees between 1 and 10),
  invite_token text not null unique default substr(replace(gen_random_uuid()::text, '-', ''), 1, 20),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.wedding_events (
  id text primary key,
  event_name text not null,
  event_date date not null,
  event_time time not null,
  venue text, description text
);

do $$ begin
  create type public.attendance as enum ('attending', 'not_attending');
exception when duplicate_object then null;
end $$;

create table if not exists public.rsvp_responses (
  id uuid primary key default gen_random_uuid(),
  guest_id uuid not null references public.guests(id) on delete cascade,
  event_id text not null references public.wedding_events(id),
  attendance_status public.attendance not null,
  attendee_count int not null default 0 check (attendee_count between 0 and 10),
  additional_guest_names text[] not null default '{}',
  dietary_preferences text, special_requests text,
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (guest_id, event_id)
);
create index if not exists rsvp_responses_event_idx on public.rsvp_responses (event_id, attendance_status);

create or replace function public.set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists guests_updated on public.guests;
create trigger guests_updated before update on public.guests for each row execute function public.set_updated_at();
drop trigger if exists rsvp_updated on public.rsvp_responses;
create trigger rsvp_updated before update on public.rsvp_responses for each row execute function public.set_updated_at();

alter table public.guests enable row level security;
alter table public.rsvp_responses enable row level security;
alter table public.wedding_events enable row level security;
drop policy if exists "events are public" on public.wedding_events;
create policy "events are public" on public.wedding_events for select using (true);

insert into public.wedding_events (id, event_name, event_date, event_time) values
 ('haldi',     'Haldi Ceremony',                   '2026-12-02', '11:00'),
 ('sangeet',   'Sangeet Ceremony',                 '2026-12-02', '19:00'),
 ('wedding',   'Wedding Ceremony',                 '2026-12-03', '09:00'),
 ('reception', 'North Indian Wedding & Reception', '2026-12-03', '19:00')
on conflict (id) do update set
  event_name = excluded.event_name,
  event_date = excluded.event_date,
  event_time = excluded.event_time;
