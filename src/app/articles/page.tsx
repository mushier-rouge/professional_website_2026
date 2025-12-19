import type { Metadata } from "next";
import Link from "next/link";

import { createSupabaseServerClient } from "@/lib/supabase/serverClient";

export const metadata: Metadata = {
  title: "Articles",
  description: "Article feed for members.",
};

type ArticleRow = {
  id: string;
  title: string;
  summary: string | null;
  external_url: string | null;
  created_at: string;
};

export default async function ArticlesPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  const user = data.user;

  let articles: ArticleRow[] = [];
  let loadError: string | null = null;

  if (supabase && user) {
    const { data: rows, error } = await supabase
      .from("articles")
      .select("id,title,summary,external_url,created_at")
      .order("created_at", { ascending: false })
      .limit(25);

    if (error) {
      loadError =
        "Unable to load articles. Ensure the Supabase schema is applied and RLS policies allow reads.";
    } else {
      articles = (rows ?? []) as ArticleRow[];
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
        <Link
          href="/articles/new"
          className="inline-flex h-10 items-center justify-center rounded-lg bg-zinc-950 px-4 text-sm font-medium text-white shadow-sm hover:opacity-90 dark:bg-white dark:text-black"
        >
          New article
        </Link>
      </header>

      {!supabase ? (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
          <p className="font-medium">Supabase is not configured.</p>
          <p className="mt-2 text-amber-800 dark:text-amber-200">
            Set <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to enable articles.
          </p>
        </section>
      ) : !user ? (
        <section className="rounded-2xl border border-black/[.06] bg-white p-6 shadow-sm dark:border-white/[.08] dark:bg-zinc-950">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            You must be signed in to view the article feed.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/login"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-zinc-950 px-4 text-sm font-medium text-white shadow-sm hover:opacity-90 dark:bg-white dark:text-black"
            >
              Sign in
            </Link>
            <Link
              href="/membership-grades"
              className="inline-flex h-10 items-center justify-center rounded-lg border border-black/[.08] bg-white px-4 text-sm font-medium text-zinc-900 shadow-sm hover:bg-black/[.02] dark:border-white/[.12] dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-white/[.06]"
            >
              Membership grades
            </Link>
          </div>
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
        <div className="space-y-3">
          {articles.map((a) => (
            <article
              key={a.id}
              className="rounded-2xl border border-black/[.06] bg-white p-6 shadow-sm dark:border-white/[.08] dark:bg-zinc-950"
            >
              <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
                <Link href={`/articles/${a.id}`} className="hover:underline">
                  {a.title}
                </Link>
              </h2>
              {a.summary ? (
                <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  {a.summary}
                </p>
              ) : null}
              {a.external_url ? (
                <a
                  href={a.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-sm text-zinc-600 hover:underline dark:text-zinc-400"
                >
                  External link
                </a>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

