import type { Metadata } from "next";
import Link from "next/link";

import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { hasRole } from "@/lib/rbac/permissions";

export const metadata: Metadata = {
  title: "Editor Dashboard",
  description: "Manage article submissions and reviews.",
};

type ArticleRow = {
  id: string;
  title: string;
  article_type: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  author: {
    display_name: string | null;
    user_id: string;
  } | null;
};

export default async function EditorDashboardPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  const user = data.user;

  if (!user) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Editor Dashboard
        </h1>
        <div className="rounded-2xl border border-black/[.06] bg-white p-6 shadow-sm dark:border-white/[.08] dark:bg-zinc-950">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            You must be signed in to access the editor dashboard.
          </p>
          <Link
            href="/login"
            className="mt-4 inline-flex h-10 items-center justify-center rounded-lg bg-zinc-950 px-4 text-sm font-medium text-white shadow-sm hover:opacity-90 dark:bg-white dark:text-black"
          >
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  const isEditor = await hasRole("editor");
  const isAdmin = await hasRole("admin");

  if (!isEditor && !isAdmin) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Editor Dashboard
        </h1>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
          <p className="font-medium">Access Denied</p>
          <p className="mt-2 text-amber-800 dark:text-amber-200">
            You must have editor or admin privileges to access this page.
          </p>
        </div>
        <Link href="/articles" className="text-sm text-zinc-600 hover:underline dark:text-zinc-400">
          Back to articles
        </Link>
      </div>
    );
  }

  if (!supabase) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Editor Dashboard
        </h1>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
          <p className="font-medium">Supabase is not configured.</p>
        </div>
      </div>
    );
  }

  // Get all articles that need editor attention (submitted, in_review, resubmitted)
  const { data: submittedArticles, error } = await supabase
    .from("articles")
    .select(`
      id,
      title,
      article_type,
      status,
      created_at,
      updated_at,
      author:profiles!articles_author_id_fkey(display_name, user_id)
    `)
    .in("status", ["submitted", "in_review", "resubmitted"])
    .order("updated_at", { ascending: false });

  const articles = (submittedArticles || []) as unknown as ArticleRow[];

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Editor Dashboard
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Manage article submissions and reviews.
        </p>
      </header>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100">
          Failed to load articles: {error.message}
        </div>
      ) : articles.length === 0 ? (
        <div className="rounded-2xl border border-black/[.06] bg-white p-8 text-center shadow-sm dark:border-white/[.08] dark:bg-zinc-950">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            No articles awaiting review.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {articles.map((article) => (
            <article
              key={article.id}
              className="rounded-2xl border border-black/[.06] bg-white p-6 shadow-sm dark:border-white/[.08] dark:bg-zinc-950"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
                      <Link
                        href={`/editor/review/${article.id}`}
                        className="hover:underline"
                      >
                        {article.title}
                      </Link>
                    </h2>
                    {article.article_type && (
                      <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                        {article.article_type}
                      </span>
                    )}
                    <span
                      className={[
                        "rounded px-2 py-0.5 text-xs font-medium",
                        article.status === "submitted"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                          : article.status === "in_review"
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
                      ].join(" ")}
                    >
                      {article.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                    {article.author?.display_name && (
                      <span>by {article.author.display_name}</span>
                    )}
                    <span>•</span>
                    <span>
                      Updated {new Date(article.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <Link
                  href={`/editor/review/${article.id}`}
                  className="inline-flex h-9 items-center justify-center rounded-lg bg-zinc-950 px-4 text-sm font-medium text-white shadow-sm hover:opacity-90 dark:bg-white dark:text-black"
                >
                  Review
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
