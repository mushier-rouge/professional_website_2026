import type { Metadata } from "next";
import Link from "next/link";

import { buildBibTeX, buildCitation } from "@/lib/articles/citation";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";

type ArticleRow = {
  id: string;
  title: string;
  summary: string | null;
  external_url: string | null;
  created_at: string;
  author_user_id: string;
};

export const metadata: Metadata = {
  title: "Article",
  description: "Article details.",
};

function formatIsoDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toISOString().slice(0, 10);
}

export default async function ArticleDetailPage({
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
          Article
        </h1>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
          <p className="font-medium">Supabase is not configured.</p>
        </div>
        <Link href="/articles" className="text-sm text-zinc-600 hover:underline dark:text-zinc-400">
          Back to feed
        </Link>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Article
        </h1>
        <div className="rounded-2xl border border-black/[.06] bg-white p-6 shadow-sm dark:border-white/[.08] dark:bg-zinc-950">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            You must be signed in to view articles.
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
          Article
        </h1>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100">
          Article not found (or schema not applied).
        </div>
        <Link href="/articles" className="text-sm text-zinc-600 hover:underline dark:text-zinc-400">
          Back to feed
        </Link>
      </div>
    );
  }

  const article = row as ArticleRow;
  const isAuthor = article.author_user_id === user.id;
  const authorLabel = isAuthor ? user.email ?? "You" : "Member";
  const publishedDate = formatIsoDate(article.created_at);
  const citeThis = buildCitation({
    title: article.title,
    author: authorLabel,
    publishedAt: article.created_at,
    url: article.external_url ?? undefined,
  });
  const bibTeX = buildBibTeX({
    title: article.title,
    author: authorLabel,
    publishedAt: article.created_at,
    url: article.external_url ?? undefined,
  });

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <header className="space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          {article.title}
        </h1>
        <dl className="flex flex-wrap gap-6 text-xs text-zinc-500 dark:text-zinc-400">
          <div>
            <dt className="uppercase tracking-wide">Author</dt>
            <dd className="mt-1 text-zinc-700 dark:text-zinc-300">{authorLabel}</dd>
          </div>
          <div>
            <dt className="uppercase tracking-wide">Published</dt>
            <dd className="mt-1 text-zinc-700 dark:text-zinc-300">{publishedDate}</dd>
          </div>
        </dl>
      </header>

      <section className="rounded-2xl border border-black/[.06] bg-white p-5 text-sm text-zinc-700 shadow-sm dark:border-white/[.08] dark:bg-zinc-950 dark:text-zinc-200">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Abstract
        </h2>
        <p className="mt-2 leading-6">
          {article.summary || "No abstract has been provided yet."}
        </p>
      </section>

      <section className="rounded-2xl border border-black/[.06] bg-white p-5 text-sm text-zinc-700 shadow-sm dark:border-white/[.08] dark:bg-zinc-950 dark:text-zinc-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Cite this
          </h2>
          {article.external_url ? (
            <a
              href={article.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-zinc-600 hover:underline dark:text-zinc-400"
            >
              Source link
            </a>
          ) : null}
        </div>
        <p className="mt-2 font-mono text-xs text-zinc-800 dark:text-zinc-200">
          {citeThis}
        </p>
        <pre className="mt-4 overflow-x-auto rounded-lg border border-black/[.06] bg-zinc-50 p-3 text-xs text-zinc-800 dark:border-white/[.08] dark:bg-zinc-900 dark:text-zinc-200">
          {bibTeX}
        </pre>
      </section>

      <section className="rounded-2xl border border-black/[.06] bg-white p-5 text-sm text-zinc-700 shadow-sm dark:border-white/[.08] dark:bg-zinc-950 dark:text-zinc-200">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Disclosures
        </h2>
        <p className="mt-2">No disclosures reported.</p>
      </section>

      <div className="flex flex-wrap gap-4 text-sm">
        <Link href="/articles" className="text-zinc-600 hover:underline dark:text-zinc-400">
          Back to feed
        </Link>
        <Link href="/articles/new" className="text-zinc-600 hover:underline dark:text-zinc-400">
          New article
        </Link>
        {isAuthor ? (
          <Link
            href={`/articles/${article.id}/edit`}
            className="text-zinc-600 hover:underline dark:text-zinc-400"
          >
            Edit article
          </Link>
        ) : null}
      </div>
    </div>
  );
}
