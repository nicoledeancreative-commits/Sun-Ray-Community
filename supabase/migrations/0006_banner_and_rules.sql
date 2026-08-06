-- Dashboard banner image storage + editable group rules.

-- Public bucket for site-managed images (currently just the dashboard
-- banner). Publicly readable, writable only by admins.
insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true)
on conflict (id) do nothing;

drop policy if exists "Public can view site images" on storage.objects;
create policy "Public can view site images"
  on storage.objects for select
  using (bucket_id = 'site-images');

drop policy if exists "Admins can upload site images" on storage.objects;
create policy "Admins can upload site images"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'site-images'
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

drop policy if exists "Admins can update site images" on storage.objects;
create policy "Admins can update site images"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'site-images'
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

drop policy if exists "Admins can delete site images" on storage.objects;
create policy "Admins can delete site images"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'site-images'
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- New site_content keys: the dashboard banner image URL, and the group
-- rules shown on the dashboard. Seeded with the rules already in use so
-- nothing is lost in the move.
insert into public.site_content (key, value) values
  ('dashboard_banner_url', '""'),
  ('group_rules', '[
    {"title": "No hate speech or bullying", "body": "Make sure everyone feels safe. Bullying of any kind isn''t allowed, and degrading comments about things like race, religion, culture, sexual orientation, gender or identity will not be tolerated."},
    {"title": "Be kind and courteous", "body": "We''re all in this together to create a welcoming environment. Let''s treat everyone with respect. Healthy debates are natural, but kindness is required."},
    {"title": "Respect everyone''s privacy", "body": "Being part of this group requires mutual trust. Authentic, expressive discussions make groups great, but may also be sensitive and private. What''s shared in the group should stay in the group."},
    {"title": "No promotions or spam except by residents", "body": "Residents are free to post their offerings here. If the small business is not located in the community, please refrain from posting it here. Please limit it to one post per day. If you have multiple items or services, please post them together in one post."},
    {"title": "No political posts", "body": "Any posts will be removed; repeated posts will get you removed."},
    {"title": "Authentic profiles required", "body": "Members must use a genuine profile that reasonably identifies them as a real person. Accounts using fake names, having little or no history, or appearing to exist mainly to provoke arguments may be removed. Disagreement is allowed, but anonymous or questionable accounts will not be permitted to disrupt the group. Admins may request private verification before approving or retaining membership."}
  ]')
on conflict (key) do nothing;
