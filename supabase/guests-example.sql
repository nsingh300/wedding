-- Add invited guests (invited_attendees = max people in that invitation, including the guest).
insert into public.guests (full_name, invited_attendees) values
 ('Aarav Sharma', 4),
 ('Priya Mehta', 2);

-- Get each guest's personal link (replace the domain):
select full_name, 'https://YOUR-SITE.vercel.app/?g=' || invite_token as invite_link from public.guests order by full_name;
