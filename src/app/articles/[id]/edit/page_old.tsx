import type { Metadata } from "next";
import Link from "next/link";

import { createSupabaseServerClient } from "@/lib/supabase/serverClient";

import { EditArticleForm } from "./ui/EditArticleForm";

export const metadata: Metadata = {
  title: "Edit article",
  description: "Edit your article submission.",
};

type ArticleRow = {
  id: string;
  title: string;
  summary: string | null;
  external_url: string | null;
  created_at: string;
  author_user_id: string;
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
          Edit article
        </h1>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
          <p className="font-medium">Supabase is not configured.</p>
        </div>
        <Link
          href="/articles"
          className="text-sm text-zinc-600 hover:underline dark:text-zinc-400"
        >
          Back to feed
        </Link>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Edit article
        </h1>
        <div className="rounded-2xl border border-black/[.06] bg-white p-6 shadow-sm dark:border-white/[.08] dark:bg-zinc-950">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            You must be signed in to edit articles.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/login"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-zinc-950 px-4 text-sm font-medium text-white shadow-sm hover:opacity-90 dark:bg-white dark:text-black"
            >
              Sign in
            </Link>
            <Link
              href="/articles"
              className="inline-flex h-10 items-center justify-center rounded-lg border border-black/[.08] bg-white px-4 text-sm font-medium text-zinc-900 shadow-sm hover:bg-black/[.02] dark:border-white/[.12] dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-white/[.06]"
            >
              Back to feed
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { data: row, error } = await supabase
    .from("articles")
    .select("id,title,summary,external_url,created_at,author_user_id")
    .eq("id", id)
    .single();

  if (error || !row) {
    return (
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Edit article
        </h1>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100">
          Article not found (or schema not applied).
        </div>
        <Link
          href="/articles"
          className="text-sm text-zinc-600 hover:underline dark:text-zinc-400"
        >
          Back to feed
        </Link>
      </div>
    );
  }

  const article = row as ArticleRow;

  if (article.author_user_id !== user.id) {
    return (
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Edit article
        </h1>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100">
          You can only edit articles you created.
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          <Link
            href={`/articles/${article.id}`}
            className="text-zinc-600 hover:underline dark:text-zinc-400"
          >
            Back to article
          </Link>
          <Link
            href="/articles"
            className="text-zinc-600 hover:underline dark:text-zinc-400"
          >
            Back to feed
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Edit article
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Update your title, summary, or external URL.
        </p>
      </header>

      <EditArticleForm
        userEmail={user.email ?? ""}
        articleId={article.id}
        initialTitle={article.title}
        initialSummary={article.summary ?? ""}
        initialExternalUrl={article.external_url ?? ""}
      />

      <div className="flex flex-wrap gap-4 text-sm">
        <Link
          href={`/articles/${article.id}`}
          className="text-zinc-600 hover:underline dark:text-zinc-400"
        >
          Back to article
        </Link>
        <Link href="/articles" className="text-zinc-600 hover:underline dark:text-zinc-400">
          Back to feed
        </Link>
      </div>
    </div>
  );
}

