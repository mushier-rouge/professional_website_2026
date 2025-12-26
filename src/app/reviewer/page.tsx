import type { Metadata } from "next";
import Link from "next/link";

import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { hasRole } from "@/lib/rbac/permissions";

export const metadata: Metadata = {
  title: "Reviewer Dashboard",
  description: "Manage your assigned article reviews.",
};

type ReviewAssignment = {
  id: string;
  article_id: string;
  status: string;
  assigned_at: string;
  submitted_at: string | null;
  article: {
    title: string;
    slug: string;
    article_type: string | null;
    status: string;
    author: {
      display_name: string | null;
    } | null;
  } | null;
};

export default async function ReviewerDashboardPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  const user = data.user;

  if (!user) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Reviewer Dashboard
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
          Reviewer Dashboard
        </h1>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
          <p className="font-medium">Access Denied</p>
          <p className="mt-2 text-amber-800 dark:text-amber-200">
            You must have reviewer privileges to access this page.
          </p>
        </div>
      </div>
    );
  }

  if (!supabase) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Reviewer Dashboard
        </h1>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
          <p className="font-medium">Supabase is not configured.</p>
        </div>
      </div>
    );
  }

  const { data: rows, error } = await supabase
    .from("reviews")
    .select(`
      id,
      article_id,
      status,
      assigned_at,
      submitted_at,
      article:articles!reviews_article_id_fkey(
        title,
        slug,
        article_type,
        status,
        author:profiles!articles_author_id_fkey(display_name)
      )
    `)
    .eq("reviewer_id", user.id)
    .order("assigned_at", { ascending: false });

  if (error) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Reviewer Dashboard
        </h1>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100">
          Failed to load review assignments.
        </div>
      </div>
    );
  }

  const assignments = (rows ?? []) as unknown as ReviewAssignment[];

  const pendingReviews = assignments.filter((r) =>
    ["pending", "in_progress"].includes(r.status)
  );
  const completedReviews = assignments.filter((r) =>
    ["completed", "declined"].includes(r.status)
  );

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Reviewer Dashboard
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Manage your assigned article reviews and provide feedback to authors.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Pending Reviews ({pendingReviews.length})
        </h2>
        {pendingReviews.length === 0 ? (
          <div className="rounded-2xl border border-black/[.06] bg-white p-6 text-sm text-zinc-600 shadow-sm dark:border-white/[.08] dark:bg-zinc-950 dark:text-zinc-400">
            No pending review assignments.
          </div>
        ) : (
          <div className="space-y-3">
            {pendingReviews.map((review) => (
              <Link
                key={review.id}
                href={`/reviewer/review/${review.id}`}
                className="block rounded-2xl border border-black/[.06] bg-white p-5 shadow-sm transition-colors hover:bg-black/[.02] dark:border-white/[.08] dark:bg-zinc-950 dark:hover:bg-white/[.06]"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex-1 space-y-2">
                    <h3 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                      {review.article?.title || "Untitled"}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                      {review.article?.author?.display_name && (
                        <span>by {review.article.author.display_name}</span>
                      )}
                      {review.article?.article_type && (
                        <>
                          <span>•</span>
                          <span>{review.article.article_type}</span>
                        </>
                      )}
                      <span>•</span>
                      <span>Assigned {new Date(review.assigned_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <span
                    className={[
                      "rounded px-2.5 py-1 text-xs font-medium",
                      review.status === "pending"
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                        : "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
                    ].join(" ")}
                  >
                    {review.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Completed Reviews ({completedReviews.length})
        </h2>
        {completedReviews.length === 0 ? (
          <div className="rounded-2xl border border-black/[.06] bg-white p-6 text-sm text-zinc-600 shadow-sm dark:border-white/[.08] dark:bg-zinc-950 dark:text-zinc-400">
            No completed reviews.
          </div>
        ) : (
          <div className="space-y-3">
            {completedReviews.map((review) => (
              <Link
                key={review.id}
                href={`/reviewer/review/${review.id}`}
                className="block rounded-2xl border border-black/[.06] bg-white p-5 shadow-sm transition-colors hover:bg-black/[.02] dark:border-white/[.08] dark:bg-zinc-950 dark:hover:bg-white/[.06]"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex-1 space-y-2">
                    <h3 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                      {review.article?.title || "Untitled"}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                      {review.article?.author?.display_name && (
                        <span>by {review.article.author.display_name}</span>
                      )}
                      {review.submitted_at && (
                        <>
                          <span>•</span>
                          <span>Submitted {new Date(review.submitted_at).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <span
                    className={[
                      "rounded px-2.5 py-1 text-xs font-medium",
                      review.status === "completed"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                        : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
                    ].join(" ")}
                  >
                    {review.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
