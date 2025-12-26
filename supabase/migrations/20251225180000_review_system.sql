-- Review system: peer review assignments and submissions

-- Create review status enum
do $
begin
  if not exists (select 1 from pg_type where typname = 'review_status') then
    create type public.review_status as enum (
      'pending',
      'in_progress',
      'completed',
      'declined'
    );
  end if;
end $;

-- Create review recommendation enum
do $
begin
  if not exists (select 1 from pg_type where typname = 'review_recommendation') then
    create type public.review_recommendation as enum (
      'accept',
      'accept_with_minor_revisions',
      'major_revisions_required',
      'reject'
    );
  end if;
end $;

-- Create reviews table
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references public.articles(id) on delete cascade,
  reviewer_id uuid not null references auth.users(id) on delete cascade,
  assigned_by uuid not null references auth.users(id),
  assigned_at timestamptz not null default now(),

  status public.review_status not null default 'pending',

  -- Review content (filled when status = 'completed')
  recommendation public.review_recommendation,
  summary text,
  strengths text,
  weaknesses text,
  detailed_comments text,
  confidential_comments text, -- Only visible to editors

  submitted_at timestamptz,
  updated_at timestamptz not null default now(),

  -- Constraints
  constraint different_reviewer_author check (reviewer_id != (
    select author_id from public.articles where id = article_id
  ))
);

-- Create indexes
create index if not exists idx_reviews_article_id on public.reviews(article_id);
create index if not exists idx_reviews_reviewer_id on public.reviews(reviewer_id);
create index if not exists idx_reviews_status on public.reviews(status);

-- RLS policies for reviews table
alter table public.reviews enable row level security;

-- Reviewers can view their own review assignments
create policy "Reviewers can view their own assignments"
  on public.reviews for select
  using (auth.uid() = reviewer_id);

-- Reviewers can update their own pending/in_progress reviews
create policy "Reviewers can update their own reviews"
  on public.reviews for update
  using (
    auth.uid() = reviewer_id
    and status in ('pending', 'in_progress')
  );

-- Editors and admins can view all reviews
create policy "Editors can view all reviews"
  on public.reviews for select
  using (
    exists (
      select 1 from public.user_roles ur
      join public.roles r on ur.role_id = r.id
      where ur.user_id = auth.uid()
      and r.name in ('editor', 'admin')
    )
  );

-- Editors and admins can assign reviews
create policy "Editors can assign reviews"
  on public.reviews for insert
  with check (
    exists (
      select 1 from public.user_roles ur
      join public.roles r on ur.role_id = r.id
      where ur.user_id = auth.uid()
      and r.name in ('editor', 'admin')
    )
  );

-- Editors and admins can update any review
create policy "Editors can update any review"
  on public.reviews for update
  using (
    exists (
      select 1 from public.user_roles ur
      join public.roles r on ur.role_id = r.id
      where ur.user_id = auth.uid()
      and r.name in ('editor', 'admin')
    )
  );

-- Function to get review statistics for an article
create or replace function public.get_article_review_stats(article_uuid uuid)
returns table(
  total_reviews bigint,
  completed_reviews bigint,
  pending_reviews bigint,
  avg_recommendation numeric
) as $$
begin
  return query
  select
    count(*)::bigint as total_reviews,
    count(*) filter (where status = 'completed')::bigint as completed_reviews,
    count(*) filter (where status = 'pending')::bigint as pending_reviews,
    case
      when count(*) filter (where status = 'completed' and recommendation is not null) > 0
      then avg(
        case recommendation
          when 'accept' then 4
          when 'accept_with_minor_revisions' then 3
          when 'major_revisions_required' then 2
          when 'reject' then 1
          else null
        end
      ) filter (where status = 'completed')
      else null
    end as avg_recommendation
  from public.reviews
  where article_id = article_uuid;
end;
$$ language plpgsql security definer;

-- Function to check if a user can be assigned as reviewer
create or replace function public.can_assign_reviewer(
  article_uuid uuid,
  reviewer_uuid uuid
) returns boolean as $$
declare
  article_author_id uuid;
  existing_review_count int;
begin
  -- Get article author
  select author_id into article_author_id
  from public.articles
  where id = article_uuid;

  -- Check if reviewer is the author
  if reviewer_uuid = article_author_id then
    return false;
  end if;

  -- Check if reviewer already assigned
  select count(*) into existing_review_count
  from public.reviews
  where article_id = article_uuid
  and reviewer_id = reviewer_uuid;

  if existing_review_count > 0 then
    return false;
  end if;

  return true;
end;
$$ language plpgsql security definer;

-- Trigger to update updated_at timestamp
create or replace function public.update_review_timestamp()
returns trigger as $$
begin
  NEW.updated_at = now();
  return NEW;
end;
$$ language plpgsql;

create trigger on_review_update
  before update on public.reviews
  for each row execute function public.update_review_timestamp();
