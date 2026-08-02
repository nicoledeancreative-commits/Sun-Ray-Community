-- Announcements: short posts from admins/moderators, visible to all signed-in members.
create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.announcements enable row level security;

drop policy if exists "Signed-in members can view announcements" on public.announcements;
create policy "Signed-in members can view announcements"
  on public.announcements for select
  to authenticated
  using (true);

drop policy if exists "Admins and moderators can post announcements" on public.announcements;
create policy "Admins and moderators can post announcements"
  on public.announcements for insert
  to authenticated
  with check (
    auth.uid() = author_id
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'moderator')
    )
  );

drop policy if exists "Admins and moderators can update their announcements" on public.announcements;
create policy "Admins and moderators can update their announcements"
  on public.announcements for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'moderator')
    )
  );

drop policy if exists "Admins and moderators can delete announcements" on public.announcements;
create policy "Admins and moderators can delete announcements"
  on public.announcements for delete
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'moderator')
    )
  );
