import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { ArticleFilters } from "./ui/ArticleFilters";

export const metadata: Metadata = {
  title: "Articles",
  description: "Article feed for members.",
};

type ArticleRow = {
  id: string;
  title: string;
  abstract: string | null;
  article_type: string | null;
  topics: string[] | null;
  status: string;
  created_at: string;
  author: {
    display_name: string | null;
  } | null;
};

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; type?: string; topic?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createSupabaseServerClient();
  const { data } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  const user = data.user;

  let articles: ArticleRow[] = [];
  let allTopics: string[] = [];
  let loadError: string | null = null;

  if (supabase) {
    // Build query with filters
    let query = supabase
      .from("articles")
      .select(`
        id,
        title,
        abstract,
        article_type,
        topics,
        status,
        created_at,
        author:profiles!articles_author_id_fkey(display_name)
      `)
      .in("status", ["published"]);

    // Apply type filter
    if (params.type) {
      query = query.eq("article_type", params.type);
    }

    // Apply topic filter
    if (params.topic) {
      query = query.contains("topics", [params.topic]);
    }

    // Apply search filter
    if (params.search) {
      query = query.or(
        `title.ilike.%${params.search}%,abstract.ilike.%${params.search}%`
      );
    }

    const { data: rows, error } = await query
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      loadError =
        "Unable to load articles. Ensure the Supabase migrations are applied.";
    } else {
      articles = (rows ?? []) as unknown as ArticleRow[];

      // Extract all unique topics from all published articles for filter dropdown
      const topicsSet = new Set<string>();
      articles.forEach((article) => {
        article.topics?.forEach((topic) => topicsSet.add(topic));
      });
      allTopics = Array.from(topicsSet).sort();
    }
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            Articles
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Member-submitted writeups and links.
          </p>
        </div>
        {user ? (
          <Link
            href="/articles/new"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-zinc-950 px-4 text-sm font-medium text-white shadow-sm hover:opacity-90 dark:bg-white dark:text-black"
          >
            New article
          </Link>
        ) : (
          <Link
            href="/login"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-black/[.08] bg-white px-4 text-sm font-medium text-zinc-900 shadow-sm hover:bg-black/[.02] dark:border-white/[.12] dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-white/[.06]"
          >
            Sign in to write
          </Link>
        )}
      </header>

      <Suspense fallback={<div className="text-sm text-zinc-500">Loading filters...</div>}>
        <ArticleFilters allTopics={allTopics} />
      </Suspense>

      {!supabase ? (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
          <p className="font-medium">Supabase is not configured.</p>
          <p className="mt-2 text-amber-800 dark:text-amber-200">
            Set <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to enable articles.
          </p>
        </section>
      ) : loadError ? (
        <section className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100">
          {loadError}
        </section>
      ) : articles.length === 0 ? (
        <section className="rounded-2xl border border-black/[.06] bg-white p-6 text-sm text-zinc-600 shadow-sm dark:border-white/[.08] dark:bg-zinc-950 dark:text-zinc-400">
          No articles yet.
        </section>
      ) : (
        <div className="space-y-4">
          {articles.map((a) => (
            <article
              key={a.id}
              className="rounded-2xl border border-black/[.06] bg-white p-6 shadow-sm dark:border-white/[.08] dark:bg-zinc-950"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
                      <Link href={`/articles/${a.id}`} className="hover:underline">
                        {a.title}
                      </Link>
                    </h2>
                    {a.article_type && (
                      <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                        {a.article_type}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                    {a.author?.display_name && (
                      <span>by {a.author.display_name}</span>
                    )}
                    <span>•</span>
                    <time dateTime={a.created_at}>
                      {new Date(a.created_at).toLocaleDateString()}
                    </time>
                  </div>
                </div>
              </div>
              {a.abstract ? (
                <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {a.abstract}
                </p>
              ) : null}
              {a.topics && a.topics.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {a.topics.map((topic) => (
                    <span
                      key={topic}
                      className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
