import type { Metadata } from "next";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { hasRole } from "@/lib/rbac/permissions";
import { ReviewForm } from "./ui/ReviewForm";

export const metadata: Metadata = {
  title: "Submit Review",
  description: "Review article and provide feedback.",
};

type ReviewRow = {
  id: string;
  article_id: string;
  reviewer_id: string;
  status: string;
  recommendation: string | null;
  summary: string | null;
  strengths: string | null;
  weaknesses: string | null;
  detailed_comments: string | null;
  confidential_comments: string | null;
  assigned_at: string;
  submitted_at: string | null;
  article: {
    id: string;
    title: string;
    slug: string;
    abstract: string | null;
    content: string | null;
    article_type: string | null;
    topics: string[] | null;
    status: string;
    created_at: string;
    author: {
      display_name: string | null;
      user_id: string;
    } | null;
  } | null;
};

export default async function ReviewSubmissionPage({
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
          Submit Review
        </h1>
        <div className="rounded-2xl border border-black/[.06] bg-white p-6 shadow-sm dark:border-white/[.08] dark:bg-zinc-950">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            You must be signed in.
          </p>
        </div>
      </div>
    );
  }

  const isReviewer = await hasRole("reviewer");
  const isEditor = await hasRole("editor");
  const isAdmin = await hasRole("admin");

  if (!isReviewer && !isEditor && !isAdmin) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Submit Review
        </h1>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
          <p className="font-medium">Access Denied</p>
          <p className="mt-2 text-amber-800 dark:text-amber-200">
            You must have reviewer privileges.
          </p>
        </div>
      </div>
    );
  }

  if (!supabase) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Submit Review
        </h1>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
          <p className="font-medium">Supabase is not configured.</p>
        </div>
      </div>
    );
  }

  const { data: row, error } = await supabase
    .from("reviews")
    .select(`
      id,
      article_id,
      reviewer_id,
      status,
      recommendation,
      summary,
      strengths,
      weaknesses,
      detailed_comments,
      confidential_comments,
      assigned_at,
      submitted_at,
      article:articles!reviews_article_id_fkey(
        id,
        title,
        slug,
        abstract,
        content,
        article_type,
        topics,
        status,
        created_at,
        author:profiles!articles_author_id_fkey(display_name, user_id)
      )
    `)
    .eq("id", id)
    .single();

  if (error || !row) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Submit Review
        </h1>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100">
          Review assignment not found.
        </div>
        <Link
          href="/reviewer"
          className="text-sm text-zinc-600 hover:underline dark:text-zinc-400"
        >
          ← Back to dashboard
        </Link>
      </div>
    );
  }

  const review = row as unknown as ReviewRow;

  // Check if this review belongs to the current user
  if (review.reviewer_id !== user.id && !isEditor && !isAdmin) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Submit Review
        </h1>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
          <p className="font-medium">Access Denied</p>
          <p className="mt-2 text-amber-800 dark:text-amber-200">
            This review is not assigned to you.
          </p>
        </div>
      </div>
    );
  }

  const article = review.article;
  const isCompleted = ["completed", "declined"].includes(review.status);

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <Link
            href="/reviewer"
            className="text-sm text-zinc-600 hover:underline dark:text-zinc-400"
          >
            ← Back to dashboard
          </Link>
        </div>
      </header>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {article?.article_type && (
            <span className="rounded bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              {article.article_type}
            </span>
          )}
          <span
            className={[
              "rounded px-2.5 py-1 text-xs font-medium",
              review.status === "pending"
                ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                : review.status === "in_progress"
                  ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
                  : review.status === "completed"
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                    : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
            ].join(" ")}
          >
            {review.status}
          </span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
          {article?.title || "Untitled"}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
          {article?.author && (
            <span>by {article.author.display_name || "Unknown Author"}</span>
          )}
          <span>•</span>
          <span>Assigned {new Date(review.assigned_at).toLocaleDateString()}</span>
        </div>

        {article?.topics && article.topics.length > 0 && (
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

      {article?.abstract && (
        <section className="rounded-2xl border border-black/[.06] bg-white p-6 shadow-sm dark:border-white/[.08] dark:bg-zinc-950">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Abstract
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
            {article.abstract}
          </p>
        </section>
      )}

      {article?.content && (
        <section className="rounded-2xl border border-black/[.06] bg-white p-8 shadow-sm dark:border-white/[.08] dark:bg-zinc-950">
          <div className="prose prose-zinc prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {article.content}
            </ReactMarkdown>
          </div>
        </section>
      )}

      <ReviewForm
        reviewId={review.id}
        currentStatus={review.status}
        isCompleted={isCompleted}
        initialData={
          isCompleted
            ? {
                recommendation: review.recommendation || "",
                summary: review.summary || "",
                strengths: review.strengths || "",
                weaknesses: review.weaknesses || "",
                detailedComments: review.detailed_comments || "",
                confidentialComments: review.confidential_comments || "",
              }
            : undefined
        }
      />
    </div>
  );
}
