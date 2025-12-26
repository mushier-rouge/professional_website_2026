-- Collections and Issues: group articles into curated collections or journal issues

-- Create collections table
create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  cover_image_url text,
  is_published boolean not null default false,
  published_at timestamptz,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Create collection_articles junction table
create table if not exists public.collection_articles (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid not null references public.collections(id) on delete cascade,
  article_id uuid not null references public.articles(id) on delete cascade,
  position integer not null default 0, -- For ordering articles within collection
  created_at timestamptz not null default now(),
  unique(collection_id, article_id)
);

-- Create issues table (journal-style issues)
create table if not exists public.issues (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  volume integer,
  issue_number integer,
  description text,
  cover_image_url text,
  is_published boolean not null default false,
  published_at timestamptz,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Create issue_articles junction table
create table if not exists public.issue_articles (
  id uuid primary key default gen_random_uuid(),
  issue_id uuid not null references public.issues(id) on delete cascade,
  article_id uuid not null references public.articles(id) on delete cascade,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  unique(issue_id, article_id)
);

-- Create indexes
create index if not exists idx_collections_slug on public.collections(slug);
create index if not exists idx_collections_published on public.collections(is_published);
create index if not exists idx_collection_articles_collection on public.collection_articles(collection_id);
create index if not exists idx_collection_articles_article on public.collection_articles(article_id);

create index if not exists idx_issues_slug on public.issues(slug);
create index if not exists idx_issues_published on public.issues(is_published);
create index if not exists idx_issue_articles_issue on public.issue_articles(issue_id);
create index if not exists idx_issue_articles_article on public.issue_articles(article_id);

-- RLS policies for collections
alter table public.collections enable row level security;

-- Everyone can view published collections
create policy "Published collections are viewable by everyone"
  on public.collections for select
  using (is_published = true or auth.uid() = created_by or exists (
    select 1 from public.user_roles ur
    join public.roles r on ur.role_id = r.id
    where ur.user_id = auth.uid()
    and r.name in ('editor', 'admin')
  ));

-- Editors and admins can create collections
create policy "Editors can create collections"
  on public.collections for insert
  with check (
    exists (
      select 1 from public.user_roles ur
      join public.roles r on ur.role_id = r.id
      where ur.user_id = auth.uid()
      and r.name in ('editor', 'admin')
    )
  );

-- Editors and admins can update collections
create policy "Editors can update collections"
  on public.collections for update
  using (
    exists (
      select 1 from public.user_roles ur
      join public.roles r on ur.role_id = r.id
      where ur.user_id = auth.uid()
      and r.name in ('editor', 'admin')
    )
  );

-- Editors and admins can delete collections
create policy "Editors can delete collections"
  on public.collections for delete
  using (
    exists (
      select 1 from public.user_roles ur
      join public.roles r on ur.role_id = r.id
      where ur.user_id = auth.uid()
      and r.name in ('editor', 'admin')
    )
  );

-- RLS policies for collection_articles
alter table public.collection_articles enable row level security;

create policy "Collection articles viewable with collection"
  on public.collection_articles for select
  using (
    exists (
      select 1 from public.collections c
      where c.id = collection_id
      and (c.is_published = true or auth.uid() = c.created_by or exists (
        select 1 from public.user_roles ur
        join public.roles r on ur.role_id = r.id
        where ur.user_id = auth.uid()
        and r.name in ('editor', 'admin')
      ))
    )
  );

create policy "Editors can manage collection articles"
  on public.collection_articles for all
  using (
    exists (
      select 1 from public.user_roles ur
      join public.roles r on ur.role_id = r.id
      where ur.user_id = auth.uid()
      and r.name in ('editor', 'admin')
    )
  );

-- RLS policies for issues
alter table public.issues enable row level security;

create policy "Published issues are viewable by everyone"
  on public.issues for select
  using (is_published = true or auth.uid() = created_by or exists (
    select 1 from public.user_roles ur
    join public.roles r on ur.role_id = r.id
    where ur.user_id = auth.uid()
    and r.name in ('editor', 'admin')
  ));

create policy "Editors can create issues"
  on public.issues for insert
  with check (
    exists (
      select 1 from public.user_roles ur
      join public.roles r on ur.role_id = r.id
      where ur.user_id = auth.uid()
      and r.name in ('editor', 'admin')
    )
  );

create policy "Editors can update issues"
  on public.issues for update
  using (
    exists (
      select 1 from public.user_roles ur
      join public.roles r on ur.role_id = r.id
      where ur.user_id = auth.uid()
      and r.name in ('editor', 'admin')
    )
  );

create policy "Editors can delete issues"
  on public.issues for delete
  using (
    exists (
      select 1 from public.user_roles ur
      join public.roles r on ur.role_id = r.id
      where ur.user_id = auth.uid()
      and r.name in ('editor', 'admin')
    )
  );

-- RLS policies for issue_articles
alter table public.issue_articles enable row level security;

create policy "Issue articles viewable with issue"
  on public.issue_articles for select
  using (
    exists (
      select 1 from public.issues i
      where i.id = issue_id
      and (i.is_published = true or auth.uid() = i.created_by or exists (
        select 1 from public.user_roles ur
        join public.roles r on ur.role_id = r.id
        where ur.user_id = auth.uid()
        and r.name in ('editor', 'admin')
      ))
    )
  );

create policy "Editors can manage issue articles"
  on public.issue_articles for all
  using (
    exists (
      select 1 from public.user_roles ur
      join public.roles r on ur.role_id = r.id
      where ur.user_id = auth.uid()
      and r.name in ('editor', 'admin')
    )
  );

-- Triggers to update updated_at timestamps
create or replace function public.update_collection_timestamp()
returns trigger as $$
begin
  NEW.updated_at = now();
  return NEW;
end;
$$ language plpgsql;

create trigger on_collection_update
  before update on public.collections
  for each row execute function public.update_collection_timestamp();

create trigger on_issue_update
  before update on public.issues
  for each row execute function public.update_collection_timestamp();
