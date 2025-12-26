import type { Metadata } from "next";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { buildBibTeX, buildCitation } from "@/lib/articles/citation";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";

type ArticleRow = {
  id: string;
  title: string;
  slug: string;
  abstract: string | null;
  content: string | null;
  article_type: string | null;
  topics: string[] | null;
  status: string;
  created_at: string;
  author_id: string;
  author: {
    display_name: string | null;
    user_id: string;
  } | null;
};

export const metadata: Metadata = {
  title: "Article",
  description: "Article details.",
};

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
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Article
        </h1>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
          <p className="font-medium">Supabase is not configured.</p>
        </div>
        <Link href="/articles" className="text-sm text-zinc-600 hover:underline dark:text-zinc-400">
          Back to articles
        </Link>
      </div>
    );
  }

  const { data: row, error } = await supabase
    .from("articles")
    .select(`
      id,
      title,
      slug,
      abstract,
      content,
      article_type,
      topics,
      status,
      created_at,
      author_id,
      author:profiles!articles_author_id_fkey(display_name, user_id)
    `)
    .eq("id", id)
    .single();

  if (error || !row) {
    return (
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Article
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

  const article = row as unknown as ArticleRow;
  const isAuthor = user && article.author_id === user.id;

  // Check access permissions
  // Published articles are visible to everyone
  // Non-published articles are only visible to the author
  if (article.status !== "published" && !isAuthor) {
    return (
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Article
        </h1>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
          <p className="font-medium">This article is not yet published.</p>
          <p className="mt-2 text-amber-800 dark:text-amber-200">
            Only the author can view this article while it&apos;s in {article.status} status.
          </p>
        </div>
        <Link href="/articles" className="text-sm text-zinc-600 hover:underline dark:text-zinc-400">
          Back to articles
        </Link>
      </div>
    );
  }

  const authorLabel = article.author?.display_name ?? "Unknown Author";
  const citeThis = buildCitation({
    title: article.title,
    author: authorLabel,
    publishedAt: article.created_at,
    url: undefined,
  });
  const bibTeX = buildBibTeX({
    title: article.title,
    author: authorLabel,
    publishedAt: article.created_at,
    url: undefined,
  });

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8">
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {article.article_type && (
            <span className="rounded bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              {article.article_type}
            </span>
          )}
          {article.status !== "published" && (
            <span className="rounded bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
              {article.status}
            </span>
          )}
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
          {article.author && (
            <Link
              href={`/members/${article.author.user_id}`}
              className="font-medium text-zinc-900 hover:underline dark:text-zinc-100"
            >
              {authorLabel}
            </Link>
          )}
          <span>•</span>
          <time dateTime={article.created_at}>
            {new Date(article.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>

        {article.topics && article.topics.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {article.topics.map((topic) => (
              <span
                key={topic}
                className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
              >
                {topic}
              </span>
            ))}
          </div>
        )}
      </header>

      {article.abstract && (
        <section className="rounded-2xl border border-black/[.06] bg-white p-6 shadow-sm dark:border-white/[.08] dark:bg-zinc-950">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Abstract
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
            {article.abstract}
          </p>
        </section>
      )}

      {article.content && (
        <section className="rounded-2xl border border-black/[.06] bg-white p-8 shadow-sm dark:border-white/[.08] dark:bg-zinc-950">
          <div className="prose prose-zinc prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {article.content}
            </ReactMarkdown>
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-black/[.06] bg-white p-6 shadow-sm dark:border-white/[.08] dark:bg-zinc-950">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Cite this article
        </h2>
        <p className="mt-3 font-mono text-xs text-zinc-800 dark:text-zinc-200">
          {citeThis}
        </p>
        <details className="mt-4">
          <summary className="cursor-pointer text-xs font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
            Show BibTeX
          </summary>
          <pre className="mt-3 overflow-x-auto rounded-lg border border-black/[.06] bg-zinc-50 p-4 text-xs text-zinc-800 dark:border-white/[.08] dark:bg-zinc-900 dark:text-zinc-200">
            {bibTeX}
          </pre>
        </details>
      </section>

      <div className="flex flex-wrap gap-4 border-t border-black/[.06] pt-6 text-sm dark:border-white/[.08]">
        <Link href="/articles" className="text-zinc-600 hover:underline dark:text-zinc-400">
          All articles
        </Link>
        {isAuthor && (
          <Link
            href={`/articles/${article.id}/edit`}
            className="text-zinc-600 hover:underline dark:text-zinc-400"
          >
            Edit this article
          </Link>
        )}
        {article.author && (
          <Link
            href={`/members/${article.author.user_id}`}
            className="text-zinc-600 hover:underline dark:text-zinc-400"
          >
            View author profile
          </Link>
        )}
      </div>
    </div>
  );
}
