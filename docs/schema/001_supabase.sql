-- Schema reference (same as `supabase/migrations/20251219000000_init.sql`).
-- Keep this in sync if you modify the migration.

-- Enable required extensions
create extension if not exists "pgcrypto";

-- Membership grade enum
do $$
begin
  if not exists (select 1 from pg_type where typname = 'membership_grade') then
    create type public.membership_grade as enum ('member', 'senior', 'fellow');
  end if;
end $$;

-- Profiles
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  display_name text,
  linkedin_url text,
  avatar_url text,
  membership_grade public.membership_grade not null default 'member'
);

alter table public.profiles enable row level security;

create policy "profiles_select_own"
on public.profiles
for select
using (auth.uid() = user_id);

create policy "profiles_insert_own"
on public.profiles
for insert
with check (auth.uid() = user_id);

create policy "profiles_update_own"
on public.profiles
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Membership applications
create table if not exists public.membership_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  requested_grade public.membership_grade not null,
  evidence text not null,
  links text,
  status text not null default 'submitted'
);

alter table public.membership_applications enable row level security;

create policy "applications_select_own"
on public.membership_applications
for select
using (auth.uid() = user_id);

create policy "applications_insert_own"
on public.membership_applications
for insert
with check (auth.uid() = user_id);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

