-- Site content: editable text blocks for the Homepage and Dashboard, so an
-- admin can update copy without a code change. Publicly readable (the
-- Homepage is public), writable only by admins.
create table if not exists public.site_content (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

drop policy if exists "Anyone can read site content" on public.site_content;
create policy "Anyone can read site content"
  on public.site_content for select
  using (true);

drop policy if exists "Admins can write site content" on public.site_content;
create policy "Admins can write site content"
  on public.site_content for insert
  to authenticated
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

drop policy if exists "Admins can update site content" on public.site_content;
create policy "Admins can update site content"
  on public.site_content for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Seed with the copy that's already live, so the site looks identical until
-- an admin actually changes something.
insert into public.site_content (key, value) values
  ('homepage_hero_title', '"Welcome to Sun Ray Homes"'),
  ('homepage_hero_subtitle', '"Your neighborhood, your community center, your neighbors."'),
  ('homepage_intro', '"<p>Sun Ray Community Center Volunteers is a group of neighbors who keep the Sun Ray Community Center running — cared for, open, and available for the people who live here. We''re not a homeowners'' association, and we don''t oversee homes, yards, or private property. Our job is simple: take care of the community center and bring neighbors together.</p>"'),
  ('homepage_what_we_do', '[
    {"title": "Host community events", "description": "Including our monthly potluck, movie nights, and seasonal get-togethers."},
    {"title": "Run the Summer Lunch Program", "description": "Free lunches for kids and teens 18 and under, all summer long."},
    {"title": "Keep the community center available", "description": "Residents can rent it for parties, family gatherings, showers, classes, and more."},
    {"title": "Rely on volunteers and donations", "description": "Everything we do is made possible by neighbors pitching in."}
  ]'),
  ('homepage_get_involved_title', '"Get Involved"'),
  ('homepage_get_involved_body', '"<p>Whether you want to volunteer a few hours, donate supplies, or just show up to the next potluck — there''s a place for you here.</p>"'),
  ('homepage_quick_note', '"<p>Sun Ray Community Center Volunteers is volunteer-run and focused solely on the community center. We don''t manage homes, yards, or private property, and participation in everything we do is completely voluntary.</p>"'),
  ('dashboard_about', '"<p>Sun Ray Community Center Volunteers is a volunteer-run group focused on the care, operation, and availability of the Sun Ray Community Center in Frostproof, FL.</p>"')
on conflict (key) do nothing;
