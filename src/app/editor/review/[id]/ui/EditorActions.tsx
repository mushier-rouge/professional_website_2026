"use client";

import { useActionState } from "react";
import type { ArticleStatus } from "@/lib/articles/workflow";
import { changeArticleStatus, type EditorActionState } from "../actions";

const initialState: EditorActionState = { ok: false, message: "" };

type EditorActionsProps = {
  articleId: string;
  currentStatus: string;
};

export function EditorActions({ articleId, currentStatus }: EditorActionsProps) {
  const [stateInReview, actionInReview, isPendingInReview] = useActionState(
    changeArticleStatus.bind(null, articleId, "in_review" as ArticleStatus),
    initialState
  );

  const [stateRevision, actionRevision, isPendingRevision] = useActionState(
    changeArticleStatus.bind(null, articleId, "revision_requested" as ArticleStatus),
    initialState
  );

  const [stateAccept, actionAccept, isPendingAccept] = useActionState(
    changeArticleStatus.bind(null, articleId, "accepted" as ArticleStatus),
    initialState
  );

  const [statePublish, actionPublish, isPendingPublish] = useActionState(
    changeArticleStatus.bind(null, articleId, "published" as ArticleStatus),
    initialState
  );

  const anyPending = isPendingInReview || isPendingRevision || isPendingAccept || isPendingPublish;

  // Combine all states to show the most recent message
  const currentState = [stateInReview, stateRevision, stateAccept, statePublish]
    .filter((s) => s.message)
    .slice(-1)[0];

  return (
    <section className="space-y-4 rounded-2xl border border-black/[.06] bg-white p-6 shadow-sm dark:border-white/[.08] dark:bg-zinc-950">
      <h2 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
        Editor Actions
      </h2>

      {currentState?.message && (
        <div
          className={[
            "rounded-lg border px-4 py-3 text-sm",
            currentState.ok
              ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-100"
              : "border-red-200 bg-red-50 text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100",
          ].join(" ")}
        >
          {currentState.message}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        {currentStatus === "submitted" && (
          <form action={actionInReview}>
            <button
              type="submit"
              disabled={anyPending}
              className="inline-flex h-10 items-center justify-center rounded-lg bg-zinc-950 px-4 text-sm font-medium text-white shadow-sm hover:opacity-90 disabled:opacity-60 dark:bg-white dark:text-black"
            >
              {isPendingInReview ? "Processing..." : "Move to Review"}
            </button>
          </form>
        )}

        {(currentStatus === "in_review" || currentStatus === "resubmitted") && (
          <>
            <form action={actionRevision}>
              <button
                type="submit"
                disabled={anyPending}
                className="inline-flex h-10 items-center justify-center rounded-lg border border-amber-600 bg-amber-50 px-4 text-sm font-medium text-amber-900 shadow-sm hover:bg-amber-100 disabled:opacity-60 dark:border-amber-500 dark:bg-amber-950/40 dark:text-amber-100 dark:hover:bg-amber-950/60"
              >
                {isPendingRevision ? "Processing..." : "Request Revisions"}
              </button>
            </form>

            <form action={actionAccept}>
              <button
                type="submit"
                disabled={anyPending}
                className="inline-flex h-10 items-center justify-center rounded-lg border border-emerald-600 bg-emerald-50 px-4 text-sm font-medium text-emerald-900 shadow-sm hover:bg-emerald-100 disabled:opacity-60 dark:border-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-100 dark:hover:bg-emerald-950/60"
              >
                {isPendingAccept ? "Processing..." : "Accept"}
              </button>
            </form>
          </>
        )}

        {currentStatus === "accepted" && (
          <form action={actionPublish}>
            <button
              type="submit"
              disabled={anyPending}
              className="inline-flex h-10 items-center justify-center rounded-lg bg-emerald-600 px-4 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60 dark:bg-emerald-500 dark:hover:bg-emerald-600"
            >
              {isPendingPublish ? "Publishing..." : "Publish Article"}
            </button>
          </form>
        )}
      </div>

      <div className="text-xs text-zinc-500 dark:text-zinc-400">
        <p>Current status: <span className="font-medium">{currentStatus}</span></p>
      </div>
    </section>
  );
}
