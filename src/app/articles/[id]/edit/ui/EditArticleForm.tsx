"use client";

import { useActionState } from "react";

import {
  deleteArticle,
  type DeleteArticleState,
  updateArticle,
  type UpdateArticleState,
} from "../../../actions";

const initialUpdateState: UpdateArticleState = { ok: false, message: "" };
const initialDeleteState: DeleteArticleState = { ok: false, message: "" };

export function EditArticleForm({
  userEmail,
  articleId,
  initialTitle,
  initialSummary,
  initialExternalUrl,
}: {
  userEmail: string;
  articleId: string;
  initialTitle: string;
  initialSummary: string;
  initialExternalUrl: string;
}) {
  const [updateState, updateAction, isUpdating] = useActionState(
    updateArticle,
    initialUpdateState,
  );
  const [deleteState, deleteAction, isDeleting] = useActionState(
    deleteArticle,
    initialDeleteState,
  );

  return (
    <section className="rounded-2xl border border-black/[.06] bg-white p-6 shadow-sm dark:border-white/[.08] dark:bg-zinc-950">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
          Article fields
        </h2>
        <span className="text-xs text-zinc-500 dark:text-zinc-500">
          Signed in as {userEmail || "(unknown)"}
        </span>
      </div>

      <form action={updateAction} className="mt-5 space-y-4">
        <input type="hidden" name="articleId" value={articleId} />

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
            Title
          </label>
          <input
            name="title"
            required
            defaultValue={initialTitle}
            className="w-full rounded-lg border border-black/[.08] bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-white/[.12] dark:bg-black dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600"
            placeholder="Title"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
            Summary (optional)
          </label>
          <textarea
            name="summary"
            rows={6}
            defaultValue={initialSummary}
            className="w-full rounded-lg border border-black/[.08] bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-white/[.12] dark:bg-black dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600"
            placeholder="What is this article about?"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
            External URL (optional)
          </label>
          <input
            name="externalUrl"
            type="url"
            defaultValue={initialExternalUrl}
            className="w-full rounded-lg border border-black/[.08] bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-white/[.12] dark:bg-black dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600"
            placeholder="https://..."
          />
        </div>

        {updateState.message ? (
          <div
            className={[
              "rounded-lg border px-3 py-2 text-sm",
              updateState.ok
                ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-100"
                : "border-red-200 bg-red-50 text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100",
            ].join(" ")}
          >
            {updateState.message}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isUpdating || isDeleting}
          className="flex h-11 w-full items-center justify-center rounded-lg bg-zinc-950 px-4 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-60 dark:bg-white dark:text-black"
        >
          {isUpdating ? "Saving..." : "Save changes"}
        </button>
      </form>

      <div className="mt-6 border-t border-black/[.06] pt-6 dark:border-white/[.08]">
        <form
          action={deleteAction}
          className="space-y-3"
          onSubmit={(event) => {
            if (!confirm("Delete this article? This cannot be undone.")) {
              event.preventDefault();
            }
          }}
        >
          <input type="hidden" name="articleId" value={articleId} />

          {deleteState.message ? (
            <div
              className={[
                "rounded-lg border px-3 py-2 text-sm",
                deleteState.ok
                  ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-100"
                  : "border-red-200 bg-red-50 text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100",
              ].join(" ")}
            >
              {deleteState.message}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isUpdating || isDeleting}
            className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-red-200 bg-red-50 px-4 text-sm font-medium text-red-900 shadow-sm transition-opacity hover:bg-red-100 disabled:opacity-60 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100 dark:hover:bg-red-950/60"
          >
            {isDeleting ? "Deleting..." : "Delete article"}
          </button>
        </form>
      </div>
    </section>
  );
}

