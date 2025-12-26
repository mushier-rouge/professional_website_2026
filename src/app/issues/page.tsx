import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { createSupabaseServerClient } from "@/lib/supabase/serverClient";

export const metadata: Metadata = {
  title: "Issues",
  description: "Browse published journal issues.",
};

type Issue = {
  id: string;
  title: string;
  slug: string;
  volume: number | null;
  issue_number: number | null;
  description: string | null;
  cover_image_url: string | null;
  published_at: string | null;
  article_count: number;
};

export default async function IssuesPage() {
  const supabase = await createSupabaseServerClient();
  let issues: Issue[] = [];
  let loadError: string | null = null;

  if (supabase) {
    const { data: rows, error } = await supabase
      .from("issues")
      .select(`
        id,
        title,
        slug,
        volume,
        issue_number,
        description,
        cover_image_url,
        published_at,
        issue_articles(count)
      `)
      .eq("is_published", true)
      .order("volume", { ascending: false, nullsFirst: false })
      .order("issue_number", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false });

    if (error) {
      loadError = "Failed to load issues.";
    } else {
      issues = (rows ?? []).map((row) => ({
        id: row.id,
        title: row.title,
        slug: row.slug,
        volume: row.volume,
        issue_number: row.issue_number,
        description: row.description,
        cover_image_url: row.cover_image_url,
        published_at: row.published_at,
        article_count: Array.isArray(row.issue_articles)
          ? row.issue_articles.length
          : typeof row.issue_articles === "object" && row.issue_articles !== null
            ? (row.issue_articles as {count: number}).count
            : 0,
      }));
    }
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Journal Issues
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Browse past issues of the AI/ML Society Journal.
        </p>
      </header>

      {!supabase ? (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
          <p className="font-medium">Supabase is not configured.</p>
        </section>
      ) : loadError ? (
        <section className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100">
          {loadError}
        </section>
      ) : issues.length === 0 ? (
        <section className="rounded-2xl border border-black/[.06] bg-white p-6 text-sm text-zinc-600 shadow-sm dark:border-white/[.08] dark:bg-zinc-950 dark:text-zinc-400">
          No published issues yet.
        </section>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {issues.map((issue) => (
            <Link
              key={issue.id}
              href={`/issues/${issue.slug}`}
              className="group rounded-2xl border border-black/[.06] bg-white shadow-sm transition-colors hover:bg-black/[.02] dark:border-white/[.08] dark:bg-zinc-950 dark:hover:bg-white/[.06]"
            >
              {issue.cover_image_url && (
                <div className="relative aspect-[2/1] w-full overflow-hidden rounded-t-2xl">
                  <Image
                    src={issue.cover_image_url}
                    alt={issue.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-5 space-y-2">
                <div className="flex items-center gap-2">
                  {issue.volume !== null && issue.issue_number !== null && (
                    <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                      Vol. {issue.volume}, No. {issue.issue_number}
                    </span>
                  )}
                </div>
                <h2 className="text-base font-semibold text-zinc-950 group-hover:text-zinc-700 dark:text-zinc-50 dark:group-hover:text-zinc-200">
                  {issue.title}
                </h2>
                {issue.description && (
                  <p className="line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {issue.description}
                  </p>
                )}
                <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-500">
                  <span>{issue.article_count} article{issue.article_count !== 1 ? "s" : ""}</span>
                  {issue.published_at && (
                    <>
                      <span>•</span>
                      <span>Published {new Date(issue.published_at).toLocaleDateString()}</span>
                    </>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
