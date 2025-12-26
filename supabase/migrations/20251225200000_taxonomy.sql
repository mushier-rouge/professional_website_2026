-- Taxonomy system: topics and tags for articles

-- Create topics table
create table if not exists public.topics (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  color text, -- Hex color code for display
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Create indexes
create index if not exists idx_topics_slug on public.topics(slug);
create index if not exists idx_topics_name on public.topics(name);

-- RLS policies for topics table
alter table public.topics enable row level security;

-- Everyone can view topics
create policy "Topics are viewable by everyone"
  on public.topics for select
  using (true);

-- Only admins can manage topics
create policy "Admins can insert topics"
  on public.topics for insert
  with check (
    exists (
      select 1 from public.user_roles ur
      join public.roles r on ur.role_id = r.id
      where ur.user_id = auth.uid()
      and r.name = 'admin'
    )
  );

create policy "Admins can update topics"
  on public.topics for update
  using (
    exists (
      select 1 from public.user_roles ur
      join public.roles r on ur.role_id = r.id
      where ur.user_id = auth.uid()
      and r.name = 'admin'
    )
  );

create policy "Admins can delete topics"
  on public.topics for delete
  using (
    exists (
      select 1 from public.user_roles ur
      join public.roles r on ur.role_id = r.id
      where ur.user_id = auth.uid()
      and r.name = 'admin'
    )
  );

-- Trigger to update updated_at timestamp
create or replace function public.update_topic_timestamp()
returns trigger as $$
begin
  NEW.updated_at = now();
  return NEW;
end;
$$ language plpgsql;

create trigger on_topic_update
  before update on public.topics
  for each row execute function public.update_topic_timestamp();

-- Insert default topics
insert into public.topics (name, slug, description, color) values
  ('Machine Learning', 'machine-learning', 'Machine learning algorithms and applications', '#3B82F6'),
  ('Deep Learning', 'deep-learning', 'Neural networks and deep learning architectures', '#8B5CF6'),
  ('Computer Vision', 'computer-vision', 'Image processing and computer vision', '#EC4899'),
  ('Natural Language Processing', 'nlp', 'NLP and text processing', '#10B981'),
  ('Reinforcement Learning', 'reinforcement-learning', 'RL algorithms and applications', '#F59E0B'),
  ('AI Ethics', 'ai-ethics', 'Ethics, fairness, and responsible AI', '#EF4444'),
  ('Research', 'research', 'Research papers and findings', '#6366F1'),
  ('Tutorial', 'tutorial', 'Educational tutorials and guides', '#14B8A6')
on conflict (slug) do nothing;
