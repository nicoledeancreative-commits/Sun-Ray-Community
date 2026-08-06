-- Posts: the community feed. Any signed-in member can post; authors can edit/delete
-- their own posts, and admins/moderators can moderate (edit/delete) any post.
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles (id) on delete cascade,
  title text,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.posts enable row level security;

drop policy if exists "Signed-in members can view posts" on public.posts;
create policy "Signed-in members can view posts"
  on public.posts for select
  to authenticated
  using (true);

drop policy if exists "Signed-in members can create their own posts" on public.posts;
create policy "Signed-in members can create their own posts"
  on public.posts for insert
  to authenticated
  with check (auth.uid() = author_id);

drop policy if exists "Authors and moderators can update posts" on public.posts;
create policy "Authors and moderators can update posts"
  on public.posts for update
  to authenticated
  using (
    auth.uid() = author_id
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'moderator')
    )
  );

drop policy if exists "Authors and moderators can delete posts" on public.posts;
create policy "Authors and moderators can delete posts"
  on public.posts for delete
  to authenticated
  using (
    auth.uid() = author_id
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'moderator')
    )
  );

-- Carry over anything already posted as an announcement.
insert into public.posts (author_id, title, body, created_at, updated_at)
select author_id, title, body, created_at, updated_at
from public.announcements
on conflict do nothing;

-- Members' contact details (phone, address, etc.) stay private — RLS on
-- `profiles` only lets a user read their own row. This function gives every
-- signed-in member a plain member count for the dashboard without exposing
-- anyone else's profile data.
create or replace function public.get_member_count()
returns bigint
language sql
security definer
set search_path = public
stable
as $$
  select count(*) from public.profiles;
$$;

revoke all on function public.get_member_count() from public;
grant execute on function public.get_member_count() to authenticated;
