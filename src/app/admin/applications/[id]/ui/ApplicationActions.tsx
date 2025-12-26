"use client";

import { useActionState, useState } from "react";

import {
  approveApplication,
  rejectApplication,
  moveToReview,
  type ApplicationActionState,
} from "../actions";

const initialState: ApplicationActionState = { ok: false, message: "" };

export function ApplicationActions({
  applicationId,
  currentStatus,
  userId,
}: {
  applicationId: string;
  currentStatus: string;
  userId: string;
}) {
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectNotes, setRejectNotes] = useState("");

  const [stateApprove, actionApprove, isPendingApprove] = useActionState(
    approveApplication.bind(null, applicationId, userId),
    initialState
  );

  const [stateReject, actionReject, isPendingReject] = useActionState(
    async (_prevState: ApplicationActionState | undefined, formData: FormData) => {
      return rejectApplication(applicationId, userId, formData);
    },
    initialState
  );

  const [stateReview, actionReview, isPendingReview] = useActionState(
    moveToReview.bind(null, applicationId),
    initialState
  );

  const isPending = isPendingApprove || isPendingReject || isPendingReview;

  return (
    <section className="rounded-2xl border border-black/[.06] bg-white p-6 shadow-sm dark:border-white/[.08] dark:bg-zinc-950">
      <h2 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
        Review Actions
      </h2>

      <div className="mt-4 space-y-4">
        {currentStatus === "submitted" && (
          <form action={actionReview} className="flex gap-3">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex h-10 items-center justify-center rounded-lg border border-black/[.08] bg-white px-4 text-sm font-medium text-zinc-900 shadow-sm hover:bg-black/[.02] disabled:opacity-60 dark:border-white/[.12] dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-white/[.06]"
            >
              {isPendingReview ? "Moving..." : "Move to Review"}
            </button>
          </form>
        )}

        {(currentStatus === "submitted" || currentStatus === "under_review") && (
          <>
            <form action={actionApprove} className="flex gap-3">
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex h-10 items-center justify-center rounded-lg bg-emerald-600 px-4 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60"
              >
                {isPendingApprove ? "Approving..." : "Approve Application"}
              </button>
            </form>

            {!showRejectForm ? (
              <button
                onClick={() => setShowRejectForm(true)}
                disabled={isPending}
                className="inline-flex h-10 items-center justify-center rounded-lg border border-red-200 bg-white px-4 text-sm font-medium text-red-700 shadow-sm hover:bg-red-50 disabled:opacity-60 dark:border-red-900/60 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-950/40"
              >
                Reject Application
              </button>
            ) : (
              <form action={actionReject} className="space-y-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                    Rejection notes (required)
                  </label>
                  <textarea
                    name="notes"
                    required
                    rows={4}
                    value={rejectNotes}
                    onChange={(e) => setRejectNotes(e.target.value)}
                    className="w-full rounded-lg border border-black/[.08] bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-white/[.12] dark:bg-black dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600"
                    placeholder="Provide clear feedback on why the application is being rejected."
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isPending || !rejectNotes.trim()}
                    className="inline-flex h-10 items-center justify-center rounded-lg bg-red-600 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 disabled:opacity-60"
                  >
                    {isPendingReject ? "Rejecting..." : "Confirm Rejection"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowRejectForm(false);
                      setRejectNotes("");
                    }}
                    disabled={isPending}
                    className="inline-flex h-10 items-center justify-center rounded-lg border border-black/[.08] bg-white px-4 text-sm font-medium text-zinc-900 shadow-sm hover:bg-black/[.02] disabled:opacity-60 dark:border-white/[.12] dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-white/[.06]"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </>
        )}

        {currentStatus === "approved" && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-100">
            This application has been approved. The user&apos;s membership grade has been upgraded.
          </div>
        )}

        {currentStatus === "rejected" && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100">
            This application has been rejected.
          </div>
        )}

        {(stateApprove.message || stateReject.message || stateReview.message) && (
          <div
            className={[
              "rounded-lg border px-3 py-2 text-sm",
              (stateApprove.ok || stateReject.ok || stateReview.ok)
                ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-100"
                : "border-red-200 bg-red-50 text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100",
            ].join(" ")}
          >
            {stateApprove.message || stateReject.message || stateReview.message}
          </div>
        )}
      </div>
    </section>
  );
}
