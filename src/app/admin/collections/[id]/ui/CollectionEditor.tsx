"use client";

import { useActionState, useState } from "react";

import { updateCollection, publishCollection, deleteCollection, type CollectionActionState } from "../actions";

const initialState: CollectionActionState = { ok: false, message: "" };

type CollectionEditorProps = {
  collectionId: string;
  initialData: {
    title: string;
    description: string;
    coverImageUrl: string;
    isPublished: boolean;
  };
};

export function CollectionEditor({ collectionId, initialData }: CollectionEditorProps) {
  const [title, setTitle] = useState(initialData.title);
  const [description, setDescription] = useState(initialData.description);
  const [coverImageUrl, setCoverImageUrl] = useState(initialData.coverImageUrl);

  const [stateUpdate, actionUpdate, isPendingUpdate] = useActionState(
    updateCollection.bind(null, collectionId),
    initialState
  );

  const [statePublish, actionPublish, isPendingPublish] = useActionState(
    publishCollection.bind(null, collectionId),
    initialState
  );

  const [stateDelete, actionDelete, isPendingDelete] = useActionState(
    deleteCollection.bind(null, collectionId),
    initialState
  );

  const isPending = isPendingUpdate || isPendingPublish || isPendingDelete;

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-black/[.06] bg-white p-6 shadow-sm dark:border-white/[.08] dark:bg-zinc-950">
        <h2 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
          Collection Details
        </h2>

        <form action={actionUpdate} className="mt-5 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
              Title
            </label>
            <input
              name="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-black/[.08] bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-white/[.12] dark:bg-black dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-black/[.08] bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-white/[.12] dark:bg-black dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
              Cover Image URL
            </label>
            <input
              name="coverImageUrl"
              type="url"
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              className="w-full rounded-lg border border-black/[.08] bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-white/[.12] dark:bg-black dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600"
            />
          </div>

          {stateUpdate.message && (
            <div
              className={[
                "rounded-lg border px-3 py-2 text-sm",
                stateUpdate.ok
                  ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-100"
                  : "border-red-200 bg-red-50 text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100",
              ].join(" ")}
            >
              {stateUpdate.message}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-zinc-950 px-4 text-sm font-medium text-white shadow-sm hover:opacity-90 disabled:opacity-60 dark:bg-white dark:text-black"
          >
            {isPendingUpdate ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-black/[.06] bg-white p-6 shadow-sm dark:border-white/[.08] dark:bg-zinc-950">
        <h2 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
          Publishing
        </h2>

        <form action={actionPublish} className="mt-5 space-y-4">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {initialData.isPublished
              ? "This collection is currently published and visible to the public."
              : "This collection is currently a draft and not visible to the public."}
          </p>

          {statePublish.message && (
            <div
              className={[
                "rounded-lg border px-3 py-2 text-sm",
                statePublish.ok
                  ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-100"
                  : "border-red-200 bg-red-50 text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100",
              ].join(" ")}
            >
              {statePublish.message}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className={[
              "inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-medium shadow-sm hover:opacity-90 disabled:opacity-60",
              initialData.isPublished
                ? "border border-black/[.08] bg-white text-zinc-900 dark:border-white/[.12] dark:bg-zinc-950 dark:text-zinc-100"
                : "bg-emerald-600 text-white",
            ].join(" ")}
          >
            {isPendingPublish
              ? initialData.isPublished
                ? "Unpublishing..."
                : "Publishing..."
              : initialData.isPublished
                ? "Unpublish Collection"
                : "Publish Collection"}
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm dark:border-red-900/60 dark:bg-zinc-950">
        <h2 className="text-sm font-semibold text-red-700 dark:text-red-400">
          Danger Zone
        </h2>

        <form action={actionDelete} className="mt-5 space-y-4">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Permanently delete this collection. This action cannot be undone.
          </p>

          {stateDelete.message && (
            <div
              className={[
                "rounded-lg border px-3 py-2 text-sm",
                stateDelete.ok
                  ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-100"
                  : "border-red-200 bg-red-50 text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100",
              ].join(" ")}
            >
              {stateDelete.message}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-red-600 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 disabled:opacity-60"
          >
            {isPendingDelete ? "Deleting..." : "Delete Collection"}
          </button>
        </form>
      </section>
    </div>
  );
}
