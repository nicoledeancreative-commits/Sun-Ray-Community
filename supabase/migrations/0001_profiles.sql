-- Profiles table: one row per user, holds editable profile info + role.
-- `role` is NOT user-editable (see trigger below) — it can only be changed
-- by server code using the service_role key, once admin features exist.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text,
  household_address text,
  phone text,
  avatar_url text,
  role text not null default 'member' check (role in ('admin', 'moderator', 'member')),
  notify_events boolean not null default true,
  notify_announcements boolean not null default true,
  notify_volunteer boolean not null default true,
  notify_marketplace boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Silently ignore any attempt to change `role` unless it comes from the
-- service_role key (client requests never carry that role).
create or replace function public.protect_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role and auth.role() <> 'service_role' then
    new.role := old.role;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_profile_role_trigger on public.profiles;
create trigger protect_profile_role_trigger
  before update on public.profiles
  for each row execute function public.protect_profile_role();

-- Automatically create a profile row whenever someone signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill profile rows for any accounts created before this migration,
-- carrying over anything already stored in user_metadata.
insert into public.profiles (
  id, name, household_address, phone,
  notify_events, notify_announcements, notify_volunteer, notify_marketplace
)
select
  u.id,
  u.raw_user_meta_data ->> 'full_name',
  u.raw_user_meta_data ->> 'household_address',
  u.raw_user_meta_data ->> 'phone',
  coalesce((u.raw_user_meta_data ->> 'notify_events')::boolean, true),
  coalesce((u.raw_user_meta_data ->> 'notify_announcements')::boolean, true),
  coalesce((u.raw_user_meta_data ->> 'notify_volunteer')::boolean, true),
  coalesce((u.raw_user_meta_data ->> 'notify_marketplace')::boolean, true)
from auth.users u
on conflict (id) do nothing;
