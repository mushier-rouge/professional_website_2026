"use client";

import { useState, useTransition } from "react";
import { assignReviewer, removeReviewer } from "../reviewer-actions";

type Reviewer = {
  userId: string;
  displayName: string;
};

type Review = {
  id: string;
  reviewerId: string;
  status: string;
  reviewer: {
    displayName: string | null;
  } | null;
};

type ReviewerAssignmentProps = {
  articleId: string;
  currentReviews: Review[];
  availableReviewers: Reviewer[];
};

export function ReviewerAssignment({
  articleId,
  currentReviews,
  availableReviewers,
}: ReviewerAssignmentProps) {
  const [selectedReviewer, setSelectedReviewer] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleAssign = () => {
    if (!selectedReviewer) return;

    startTransition(async () => {
      const result = await assignReviewer(articleId, selectedReviewer);
      setMessage({
        type: result.ok ? "success" : "error",
        text: result.message,
      });

      if (result.ok) {
        setSelectedReviewer("");
        // Refresh the page to show the new reviewer
        window.location.reload();
      }
    });
  };

  const handleRemove = (reviewId: string) => {
    startTransition(async () => {
      const result = await removeReviewer(reviewId, articleId);
      setMessage({
        type: result.ok ? "success" : "error",
        text: result.message,
      });

      if (result.ok) {
        // Refresh the page to update the list
        window.location.reload();
      }
    });
  };

  // Filter out already assigned reviewers
  const assignedReviewerIds = new Set(currentReviews.map((r) => r.reviewerId));
  const unassignedReviewers = availableReviewers.filter(
    (r) => !assignedReviewerIds.has(r.userId)
  );

  return (
    <section className="space-y-4 rounded-2xl border border-black/[.06] bg-white p-6 shadow-sm dark:border-white/[.08] dark:bg-zinc-950">
      <h2 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
        Peer Review Assignments
      </h2>

      {message && (
        <div
          className={[
            "rounded-lg border px-4 py-3 text-sm",
            message.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-100"
              : "border-red-200 bg-red-50 text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100",
          ].join(" ")}
        >
          {message.text}
        </div>
      )}

      {/* Current reviewers */}
      {currentReviews.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Current Reviewers
          </h3>
          <div className="space-y-2">
            {currentReviews.map((review) => (
              <div
                key={review.id}
                className="flex items-center justify-between rounded-lg border border-black/[.06] bg-zinc-50 p-3 dark:border-white/[.08] dark:bg-zinc-900"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {review.reviewer?.displayName || "Unknown Reviewer"}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Status: {review.status}
                  </p>
                </div>
                {(review.status === "pending" || review.status === "declined") && (
                  <button
                    onClick={() => handleRemove(review.id)}
                    disabled={isPending}
                    className="text-xs text-red-600 hover:text-red-700 disabled:opacity-60 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Assign new reviewer */}
      {unassignedReviewers.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Assign New Reviewer
          </h3>
          <div className="flex gap-2">
            <select
              value={selectedReviewer}
              onChange={(e) => setSelectedReviewer(e.target.value)}
              disabled={isPending}
              className="flex-1 rounded-lg border border-black/[.08] bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm outline-none focus:border-zinc-400 disabled:opacity-60 dark:border-white/[.12] dark:bg-black dark:text-zinc-50 dark:focus:border-zinc-600"
            >
              <option value="">Select a reviewer...</option>
              {unassignedReviewers.map((reviewer) => (
                <option key={reviewer.userId} value={reviewer.userId}>
                  {reviewer.displayName}
                </option>
              ))}
            </select>
            <button
              onClick={handleAssign}
              disabled={!selectedReviewer || isPending}
              className="inline-flex h-10 items-center justify-center rounded-lg bg-zinc-950 px-4 text-sm font-medium text-white shadow-sm hover:opacity-90 disabled:opacity-60 dark:bg-white dark:text-black"
            >
              {isPending ? "Assigning..." : "Assign"}
            </button>
          </div>
        </div>
      )}

      {currentReviews.length === 0 && unassignedReviewers.length === 0 && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          No reviewers available to assign.
        </p>
      )}
    </section>
  );
}
