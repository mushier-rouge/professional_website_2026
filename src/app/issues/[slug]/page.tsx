import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { createSupabaseServerClient } from "@/lib/supabase/serverClient";

export const metadata: Metadata = {
  title: "Issue",
  description: "View issue details and articles.",
};

type IssueRow = {
  id: string;
  title: string;
  slug: string;
  volume: number | null;
  issue_number: number | null;
  description: string | null;
  cover_image_url: string | null;
  published_at: string | null;
  created_at: string;
};

type IssueArticle = {
  position: number;
  article: {
    id: string;
    title: string;
    slug: string;
    abstract: string | null;
    article_type: string | null;
    author: {
      display_name: string | null;
    } | null;
  } | null;
};

export default async function IssueDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Issue
        </h1>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
          <p className="font-medium">Supabase is not configured.</p>
        </div>
      </div>
    );
  }

  const { data: issueData, error: issueError } = await supabase
    .from("issues")
    .select("id, title, slug, volume, issue_number, description, cover_image_url, published_at, created_at")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (issueError || !issueData) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Issue
        </h1>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100">
          Issue not found.
        </div>
        <Link href="/issues" className="text-sm text-zinc-600 hover:underline dark:text-zinc-400">
          ← Back to issues
        </Link>
      </div>
    );
  }

  const issue = issueData as unknown as IssueRow;

  // Get articles in this issue
  const { data: articleRows } = await supabase
    .from("issue_articles")
    .select(`
      position,
      article:articles!issue_articles_article_id_fkey(
        id,
        title,
        slug,
        abstract,
        article_type,
        author:profiles!articles_author_id_fkey(display_name)
      )
    `)
    .eq("issue_id", issue.id)
    .order("position", { ascending: true });

  const articles = ((articleRows ?? []) as unknown as IssueArticle[])
    .filter((row) => row.article !== null);

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8">
      <header>
        <Link
          href="/issues"
          className="text-sm text-zinc-600 hover:underline dark:text-zinc-400"
        >
          ← Back to issues
        </Link>
      </header>

      {issue.cover_image_url && (
        <div className="relative aspect-[3/1] w-full overflow-hidden rounded-2xl">
          <Image
            src={issue.cover_image_url}
            alt={issue.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="space-y-4">
        {issue.volume !== null && issue.issue_number !== null && (
          <div className="flex items-center gap-2">
            <span className="rounded bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              Volume {issue.volume}, Issue {issue.issue_number}
            </span>
          </div>
        )}

        <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
          {issue.title}
        </h1>

        {issue.description && (
          <p className="text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
            {issue.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
          <span>{articles.length} article{articles.length !== 1 ? "s" : ""}</span>
          {issue.published_at && (
            <>
              <span>•</span>
              <span>Published {new Date(issue.published_at).toLocaleDateString()}</span>
            </>
          )}
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Table of Contents
        </h2>

        {articles.length === 0 ? (
          <div className="rounded-2xl border border-black/[.06] bg-white p-6 text-sm text-zinc-600 shadow-sm dark:border-white/[.08] dark:bg-zinc-950 dark:text-zinc-400">
            No articles in this issue yet.
          </div>
        ) : (
          <div className="space-y-3">
            {articles.map((item, index) => {
              const article = item.article;
              if (!article) return null;

              return (
                <Link
                  key={article.id}
                  href={`/articles/${article.id}`}
                  className="block rounded-2xl border border-black/[.06] bg-white p-5 shadow-sm transition-colors hover:bg-black/[.02] dark:border-white/[.08] dark:bg-zinc-950 dark:hover:bg-white/[.06]"
                >
                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-sm font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                      {index + 1}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                          {article.title}
                        </h3>
                        {article.article_type && (
                          <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                            {article.article_type}
                          </span>
                        )}
                      </div>
                      {article.abstract && (
                        <p className="line-clamp-2 text-xs text-zinc-600 dark:text-zinc-400">
                          {article.abstract}
                        </p>
                      )}
                      {article.author?.display_name && (
                        <p className="text-xs text-zinc-500 dark:text-zinc-500">
                          by {article.author.display_name}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
