-- Storage buckets for avatars and article assets

-- Create avatars bucket (public)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  5242880, -- 5MB limit
  array['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

-- Create article-assets bucket (public)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'article-assets',
  'article-assets',
  true,
  10485760, -- 10MB limit
  array['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']
)
on conflict (id) do nothing;

-- Avatar storage policies
-- Anyone can view avatars (public bucket)
create policy "Avatar images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'avatars');

-- Users can upload their own avatar
create policy "Users can upload their own avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can update their own avatar
create policy "Users can update their own avatar"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can delete their own avatar
create policy "Users can delete their own avatar"
  on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Article assets storage policies
-- Anyone can view article assets (public bucket)
create policy "Article assets are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'article-assets');

-- Authenticated users can upload article assets
create policy "Authenticated users can upload article assets"
  on storage.objects for insert
  with check (
    bucket_id = 'article-assets'
    and auth.role() = 'authenticated'
  );

-- Users can update article assets they uploaded
create policy "Users can update their own article assets"
  on storage.objects for update
  using (
    bucket_id = 'article-assets'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can delete article assets they uploaded
create policy "Users can delete their own article assets"
  on storage.objects for delete
  using (
    bucket_id = 'article-assets'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Editors and admins can manage any article assets
create policy "Editors can manage article assets"
  on storage.objects for all
  using (
    bucket_id = 'article-assets'
    and exists (
      select 1 from public.user_roles ur
      join public.roles r on ur.role_id = r.id
      where ur.user_id = auth.uid()
      and r.name in ('editor', 'admin')
    )
  );
