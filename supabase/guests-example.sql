-- Optional: seed test data. RSVPs also create rows in `guests` automatically when someone submits on the website.
-- You do NOT need to pre-load names for RSVP to work.

-- Example manual insert (optional):
-- insert into public.guests (full_name, invited_attendees) values ('Example Guest', 4);

-- View all RSVPs with headcount per event:
select g.full_name, e.event_name, r.attendance_status, r.attendee_count, r.additional_guest_names, r.submitted_at
from public.rsvp_responses r
join public.guests g on g.id = r.guest_id
join public.wedding_events e on e.id = r.event_id
where r.attendance_status = 'attending'
order by r.submitted_at desc;
