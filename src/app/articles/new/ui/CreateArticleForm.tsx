"use client";

import { useActionState } from "react";

import { createArticle, type CreateArticleState } from "../../actions";

const initialState: CreateArticleState = { ok: false, message: "" };

export function CreateArticleForm({ userEmail }: { userEmail: string }) {
  const [state, formAction, isPending] = useActionState(createArticle, initialState);

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

      <form action={formAction} className="mt-5 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
            Title
          </label>
          <input
            name="title"
            required
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
            className="w-full rounded-lg border border-black/[.08] bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-white/[.12] dark:bg-black dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600"
            placeholder="https://..."
          />
        </div>

        {state.message ? (
          <div
            className={[
              "rounded-lg border px-3 py-2 text-sm",
              state.ok
                ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-100"
                : "border-red-200 bg-red-50 text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100",
            ].join(" ")}
          >
            {state.message}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className="flex h-11 w-full items-center justify-center rounded-lg bg-zinc-950 px-4 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-60 dark:bg-white dark:text-black"
        >
          {isPending ? "Creating..." : "Create article"}
        </button>
      </form>
    </section>
  );
}

