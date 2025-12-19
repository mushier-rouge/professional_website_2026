-- Articles/feed tables

create extension if not exists "pgcrypto";

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  author_user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  title text not null,
  summary text,
  external_url text
);

alter table public.articles enable row level security;

-- Reads require authentication (member-only feed). Adjust as needed.
create policy "articles_select_authenticated"
on public.articles
for select
using (auth.role() = 'authenticated');

create policy "articles_insert_own"
on public.articles
for insert
with check (auth.uid() = author_user_id);

create policy "articles_update_own"
on public.articles
for update
using (auth.uid() = author_user_id)
with check (auth.uid() = author_user_id);

-- updated_at trigger (re-uses public.set_updated_at from earlier migration)
drop trigger if exists trg_articles_updated_at on public.articles;
create trigger trg_articles_updated_at
before update on public.articles
for each row
execute function public.set_updated_at();

