-- Expand profiles table with full field set for CV-like profiles
-- Run this migration in Supabase SQL Editor after 20251219000000_init.sql

-- Profile visibility enum
do $$
begin
  if not exists (select 1 from pg_type where typname = 'profile_visibility') then
    create type public.profile_visibility as enum ('public', 'unlisted', 'private');
  end if;
end $$;

-- Add new columns to profiles table
alter table public.profiles
  add column if not exists title text,
  add column if not exists affiliation text,
  add column if not exists location text,
  add column if not exists short_bio text,
  add column if not exists bio text,
  add column if not exists website_url text,
  add column if not exists github_url text,
  add column if not exists scholar_url text,
  add column if not exists orcid_url text,
  add column if not exists visibility public.profile_visibility not null default 'public',
  add column if not exists directory_opt_out boolean not null default false,
  add column if not exists email_verified boolean not null default false;

-- Add column constraints (drop first if they exist to avoid errors on re-run)
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'short_bio_length') then
    alter table public.profiles add constraint short_bio_length check (char_length(short_bio) <= 280);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'bio_length') then
    alter table public.profiles add constraint bio_length check (char_length(bio) <= 5000);
  end if;
end $$;

-- Update RLS policies to respect visibility settings
drop policy if exists "profiles_select_public" on public.profiles;
create policy "profiles_select_public"
on public.profiles
for select
using (
  visibility = 'public'
  or auth.uid() = user_id
);

-- Expertise tags table (many-to-many with profiles)
create table if not exists public.expertise_tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

alter table public.expertise_tags enable row level security;

create policy "expertise_tags_select_all"
on public.expertise_tags
for select
to authenticated, anon
using (true);

-- Profile expertise junction table
create table if not exists public.profile_expertise (
  profile_id uuid not null references public.profiles(user_id) on delete cascade,
  tag_id uuid not null references public.expertise_tags(id) on delete cascade,
  primary key (profile_id, tag_id)
);

alter table public.profile_expertise enable row level security;

create policy "profile_expertise_select_own"
on public.profile_expertise
for select
using (auth.uid() = profile_id);

create policy "profile_expertise_insert_own"
on public.profile_expertise
for insert
with check (auth.uid() = profile_id);

create policy "profile_expertise_delete_own"
on public.profile_expertise
for delete
using (auth.uid() = profile_id);

-- Seed some common expertise tags
insert into public.expertise_tags (name, slug) values
  ('Machine Learning', 'machine-learning'),
  ('Deep Learning', 'deep-learning'),
  ('Natural Language Processing', 'nlp'),
  ('Computer Vision', 'computer-vision'),
  ('Reinforcement Learning', 'reinforcement-learning'),
  ('Data Science', 'data-science'),
  ('AI Ethics', 'ai-ethics'),
  ('Robotics', 'robotics')
on conflict (slug) do nothing;
