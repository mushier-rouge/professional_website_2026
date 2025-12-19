-- Allow authors to delete their own articles.

drop policy if exists "articles_delete_own" on public.articles;
create policy "articles_delete_own"
on public.articles
for delete
using (auth.uid() = author_user_id);

