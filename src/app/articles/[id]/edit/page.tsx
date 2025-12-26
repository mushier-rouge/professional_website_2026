import type { Metadata } from "next";
import Link from "next/link";

import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import type { ArticleStatus } from "@/lib/articles/workflow";

import { ArticleEditWrapper } from "./ui/ArticleEditWrapper";

export const metadata: Metadata = {
  title: "Edit article",
  description: "Edit your article.",
};

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createSupabaseServerClient();
  const { data } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  const user = data.user;

  if (!supabase) {
    return (
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Edit Article
        </h1>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
          <p className="font-medium">Supabase is not configured.</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Edit Article
        </h1>
        <div className="rounded-2xl border border-black/[.06] bg-white p-6 shadow-sm dark:border-white/[.08] dark:bg-zinc-950">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            You must be signed in to edit articles.
          </p>
        </div>
      </div>
    );
  }

  const { data: article, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !article) {
    return (
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Edit Article
        </h1>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100">
          Article not found.
        </div>
        <Link href="/articles" className="text-sm text-zinc-600 hover:underline dark:text-zinc-400">
          Back to articles
        </Link>
      </div>
    );
  }

  if (article.author_id !== user.id) {
    return (
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Edit Article
        </h1>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100">
          You can only edit your own articles.
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Edit Article
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Update your article content and settings.
        </p>
      </header>

      <ArticleEditWrapper
        userEmail={user.email ?? ""}
        articleId={id}
        initialData={{
          title: article.title,
          slug: article.slug,
          abstract: article.abstract ?? "",
          content: article.content ?? "",
          articleType: article.article_type ?? "research",
          topics: article.topics ?? [],
          status: article.status as ArticleStatus,
        }}
      />

      <div className="flex flex-wrap gap-4 text-sm">
        <Link href={`/articles/${id}`} className="text-zinc-600 hover:underline dark:text-zinc-400">
          View article
        </Link>
        <Link href="/articles" className="text-zinc-600 hover:underline dark:text-zinc-400">
          All articles
        </Link>
      </div>
    </div>
  );
}
