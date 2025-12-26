"use client";

import { useActionState, useState } from "react";

import { submitReview, declineReview, type ReviewActionState } from "../actions";

const initialState: ReviewActionState = { ok: false, message: "" };

type ReviewFormProps = {
  reviewId: string;
  currentStatus: string;
  isCompleted: boolean;
  initialData?: {
    recommendation: string;
    summary: string;
    strengths: string;
    weaknesses: string;
    detailedComments: string;
    confidentialComments: string;
  };
};

export function ReviewForm({
  reviewId,
  currentStatus,
  isCompleted,
  initialData,
}: ReviewFormProps) {
  const [recommendation, setRecommendation] = useState(
    initialData?.recommendation || "accept_with_minor_revisions"
  );
  const [summary, setSummary] = useState(initialData?.summary || "");
  const [strengths, setStrengths] = useState(initialData?.strengths || "");
  const [weaknesses, setWeaknesses] = useState(initialData?.weaknesses || "");
  const [detailedComments, setDetailedComments] = useState(
    initialData?.detailedComments || ""
  );
  const [confidentialComments, setConfidentialComments] = useState(
    initialData?.confidentialComments || ""
  );

  const [stateSubmit, actionSubmit, isPendingSubmit] = useActionState(
    submitReview.bind(null, reviewId),
    initialState
  );

  const [stateDecline, actionDecline, isPendingDecline] = useActionState(
    declineReview.bind(null, reviewId),
    initialState
  );

  const isPending = isPendingSubmit || isPendingDecline;

  if (isCompleted) {
    return (
      <section className="rounded-2xl border border-black/[.06] bg-white p-6 shadow-sm dark:border-white/[.08] dark:bg-zinc-950">
        <h2 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
          Your Review
        </h2>

        <div className="mt-5 space-y-5">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Recommendation
            </h3>
            <p className="mt-2 text-sm text-zinc-900 dark:text-zinc-100">
              {recommendation
                .split("_")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </p>
          </div>

          {summary && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Summary
              </h3>
              <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-300">
                {summary}
              </p>
            </div>
          )}

          {strengths && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Strengths
              </h3>
              <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-300">
                {strengths}
              </p>
            </div>
          )}

          {weaknesses && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Weaknesses
              </h3>
              <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-300">
                {weaknesses}
              </p>
            </div>
          )}

          {detailedComments && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Detailed Comments
              </h3>
              <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-300">
                {detailedComments}
              </p>
            </div>
          )}

          {confidentialComments && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Confidential Comments (Editors Only)
              </h3>
              <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-300">
                {confidentialComments}
              </p>
            </div>
          )}

          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-100">
            {currentStatus === "completed"
              ? "Review submitted successfully."
              : "Review declined."}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-black/[.06] bg-white p-6 shadow-sm dark:border-white/[.08] dark:bg-zinc-950">
      <h2 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
        Submit Your Review
      </h2>

      <form action={actionSubmit} className="mt-5 space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
            Recommendation <span className="text-red-600">*</span>
          </label>
          <select
            name="recommendation"
            required
            value={recommendation}
            onChange={(e) => setRecommendation(e.target.value)}
            className="w-full rounded-lg border border-black/[.08] bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm outline-none focus:border-zinc-400 dark:border-white/[.12] dark:bg-black dark:text-zinc-50 dark:focus:border-zinc-600"
          >
            <option value="accept">Accept</option>
            <option value="accept_with_minor_revisions">
              Accept with Minor Revisions
            </option>
            <option value="major_revisions_required">
              Major Revisions Required
            </option>
            <option value="reject">Reject</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
            Summary <span className="text-red-600">*</span>
          </label>
          <textarea
            name="summary"
            required
            rows={4}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="w-full rounded-lg border border-black/[.08] bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-white/[.12] dark:bg-black dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600"
            placeholder="Brief overview of your assessment."
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
            Strengths
          </label>
          <textarea
            name="strengths"
            rows={4}
            value={strengths}
            onChange={(e) => setStrengths(e.target.value)}
            className="w-full rounded-lg border border-black/[.08] bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-white/[.12] dark:bg-black dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600"
            placeholder="What are the article's main strengths?"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
            Weaknesses
          </label>
          <textarea
            name="weaknesses"
            rows={4}
            value={weaknesses}
            onChange={(e) => setWeaknesses(e.target.value)}
            className="w-full rounded-lg border border-black/[.08] bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-white/[.12] dark:bg-black dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600"
            placeholder="What are the article's main weaknesses?"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
            Detailed Comments
          </label>
          <textarea
            name="detailedComments"
            rows={6}
            value={detailedComments}
            onChange={(e) => setDetailedComments(e.target.value)}
            className="w-full rounded-lg border border-black/[.08] bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-white/[.12] dark:bg-black dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600"
            placeholder="Detailed feedback for the author (line-by-line, suggestions, etc.)."
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
            Confidential Comments (Editors Only)
          </label>
          <textarea
            name="confidentialComments"
            rows={4}
            value={confidentialComments}
            onChange={(e) => setConfidentialComments(e.target.value)}
            className="w-full rounded-lg border border-black/[.08] bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-white/[.12] dark:bg-black dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600"
            placeholder="Comments visible only to editors (e.g., concerns about methodology, plagiarism, etc.)."
          />
          <p className="text-xs text-zinc-500 dark:text-zinc-500">
            These comments will not be shared with the author.
          </p>
        </div>

        {stateSubmit.message && (
          <div
            className={[
              "rounded-lg border px-3 py-2 text-sm",
              stateSubmit.ok
                ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-100"
                : "border-red-200 bg-red-50 text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100",
            ].join(" ")}
          >
            {stateSubmit.message}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isPending || !summary.trim()}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-zinc-950 px-4 text-sm font-medium text-white shadow-sm hover:opacity-90 disabled:opacity-60 dark:bg-white dark:text-black"
          >
            {isPendingSubmit ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </form>

      <div className="mt-6 border-t border-black/[.06] pt-6 dark:border-white/[.08]">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Decline Review
        </p>
        <form action={actionDecline}>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex h-10 items-center justify-center rounded-lg border border-red-200 bg-white px-4 text-sm font-medium text-red-700 shadow-sm hover:bg-red-50 disabled:opacity-60 dark:border-red-900/60 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-950/40"
          >
            {isPendingDecline ? "Declining..." : "Decline This Review"}
          </button>
        </form>
        {stateDecline.message && (
          <div
            className={[
              "mt-3 rounded-lg border px-3 py-2 text-sm",
              stateDecline.ok
                ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-100"
                : "border-red-200 bg-red-50 text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100",
            ].join(" ")}
          >
            {stateDecline.message}
          </div>
        )}
      </div>
    </section>
  );
}
