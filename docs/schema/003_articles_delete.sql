-- Articles: allow authors to delete their own rows.

drop policy if exists "articles_delete_own" on public.articles;
create policy "articles_delete_own"
on public.articles
for delete
using (auth.uid() = author_user_id);

