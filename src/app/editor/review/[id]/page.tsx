import type { Metadata } from "next";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { hasRole } from "@/lib/rbac/permissions";
import { EditorActions } from "./ui/EditorActions";
import { ReviewerAssignment } from "./ui/ReviewerAssignment";

export const metadata: Metadata = {
  title: "Review Article",
  description: "Review and manage article submission.",
};

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
  updated_at: string;
  author_id: string;
  author: {
    display_name: string | null;
    user_id: string;
  } | null;
};

export default async function EditorReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createSupabaseServerClient();
  const { data } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  const user = data.user;

  if (!user) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Review Article
        </h1>
        <div className="rounded-2xl border border-black/[.06] bg-white p-6 shadow-sm dark:border-white/[.08] dark:bg-zinc-950">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            You must be signed in.
          </p>
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
          Review Article
        </h1>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
          <p className="font-medium">Access Denied</p>
          <p className="mt-2 text-amber-800 dark:text-amber-200">
            You must have editor or admin privileges.
          </p>
        </div>
      </div>
    );
  }

  if (!supabase) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Review Article
        </h1>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
          <p className="font-medium">Supabase is not configured.</p>
        </div>
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
      updated_at,
      author_id,
      author:profiles!articles_author_id_fkey(display_name, user_id)
    `)
    .eq("id", id)
    .single();

  if (error || !row) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Review Article
        </h1>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100">
          Article not found.
        </div>
        <Link href="/editor" className="text-sm text-zinc-600 hover:underline dark:text-zinc-400">
          Back to dashboard
        </Link>
      </div>
    );
  }

  const article = row as unknown as ArticleRow;

  // Fetch current reviews for this article
  const { data: reviews } = await supabase
    .from("reviews")
    .select(`
      id,
      reviewer_id,
      status,
      reviewer:profiles!reviews_reviewer_id_fkey(display_name)
    `)
    .eq("article_id", id);

  const currentReviews = (reviews || []) as unknown as Array<{
    id: string;
    reviewerId: string;
    status: string;
    reviewer: { displayName: string | null } | null;
  }>;

  // Fetch available reviewers (users with reviewer role)
  const { data: reviewerRoles } = await supabase
    .from("user_roles")
    .select(`
      user_id,
      profiles:user_id(display_name)
    `)
    .eq("role_id", (await supabase.from("roles").select("id").eq("name", "reviewer").single()).data?.id || "");

  type ReviewerRoleRow = {
    user_id: string;
    profiles: { display_name: string | null } | null;
  };

  const availableReviewers = (reviewerRoles || [])
    .map((row: unknown) => {
      const r = row as ReviewerRoleRow;
      return {
        userId: r.user_id,
        displayName: r.profiles?.display_name || "Unknown",
      };
    })
    .filter((r) => r.userId !== article.author_id); // Exclude article author

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <Link
            href="/editor"
            className="text-sm text-zinc-600 hover:underline dark:text-zinc-400"
          >
            ← Back to dashboard
          </Link>
        </div>
      </header>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {article.article_type && (
            <span className="rounded bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              {article.article_type}
            </span>
          )}
          <span
            className={[
              "rounded px-2.5 py-1 text-xs font-medium",
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

        <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
          {article.author && (
            <Link
              href={`/members/${article.author.user_id}`}
              className="font-medium text-zinc-900 hover:underline dark:text-zinc-100"
            >
              by {article.author.display_name || "Unknown Author"}
            </Link>
          )}
          <span>•</span>
          <span>Submitted {new Date(article.created_at).toLocaleDateString()}</span>
          {article.created_at !== article.updated_at && (
            <>
              <span>•</span>
              <span>Updated {new Date(article.updated_at).toLocaleDateString()}</span>
            </>
          )}
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
      </div>

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

      <ReviewerAssignment
        articleId={article.id}
        currentReviews={currentReviews}
        availableReviewers={availableReviewers}
      />

      <EditorActions articleId={article.id} currentStatus={article.status} />
    </div>
  );
}
