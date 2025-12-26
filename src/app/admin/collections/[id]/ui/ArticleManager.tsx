"use client";

import { useActionState, useState } from "react";

import { addArticle, removeArticle, reorderArticles, type CollectionActionState } from "../actions";

const initialState: CollectionActionState = { ok: false, message: "" };

type Article = {
  id: string;
  articleId: string;
  title: string;
  position: number;
};

type AvailableArticle = {
  id: string;
  title: string;
};

export function ArticleManager({
  collectionId,
  articles,
  availableArticles,
}: {
  collectionId: string;
  articles: Article[];
  availableArticles: AvailableArticle[];
}) {
  const [selectedArticle, setSelectedArticle] = useState("");

  const [stateAdd, actionAdd, isPendingAdd] = useActionState(
    addArticle.bind(null, collectionId),
    initialState
  );

  const [stateRemove, actionRemove, isPendingRemove] = useActionState(
    removeArticle.bind(null, collectionId),
    initialState
  );

  const [stateReorder, actionReorder, isPendingReorder] = useActionState(
    reorderArticles.bind(null, collectionId),
    initialState
  );

  const isPending = isPendingAdd || isPendingRemove || isPendingReorder;

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newOrder = [...articles];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    const formData = new FormData();
    formData.append("order", JSON.stringify(newOrder.map((a) => a.id)));
    actionReorder(formData);
  };

  const moveDown = (index: number) => {
    if (index === articles.length - 1) return;
    const newOrder = [...articles];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    const formData = new FormData();
    formData.append("order", JSON.stringify(newOrder.map((a) => a.id)));
    actionReorder(formData);
  };

  return (
    <section className="rounded-2xl border border-black/[.06] bg-white p-6 shadow-sm dark:border-white/[.08] dark:bg-zinc-950">
      <h2 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
        Articles ({articles.length})
      </h2>

      {availableArticles.length > 0 && (
        <form action={actionAdd} className="mt-5 space-y-3">
          <div className="flex gap-2">
            <select
              name="articleId"
              value={selectedArticle}
              onChange={(e) => setSelectedArticle(e.target.value)}
              className="flex-1 rounded-lg border border-black/[.08] bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm outline-none focus:border-zinc-400 dark:border-white/[.12] dark:bg-black dark:text-zinc-50 dark:focus:border-zinc-600"
            >
              <option value="">Select an article to add...</option>
              {availableArticles.map((article) => (
                <option key={article.id} value={article.id}>
                  {article.title}
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={isPending || !selectedArticle}
              className="inline-flex h-10 items-center justify-center rounded-lg bg-zinc-950 px-4 text-sm font-medium text-white shadow-sm hover:opacity-90 disabled:opacity-60 dark:bg-white dark:text-black"
            >
              {isPendingAdd ? "Adding..." : "Add"}
            </button>
          </div>

          {stateAdd.message && (
            <div
              className={[
                "rounded-lg border px-3 py-2 text-sm",
                stateAdd.ok
                  ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-100"
                  : "border-red-200 bg-red-50 text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100",
              ].join(" ")}
            >
              {stateAdd.message}
            </div>
          )}
        </form>
      )}

      <div className="mt-5 space-y-2">
        {articles.length === 0 ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            No articles in this collection yet.
          </p>
        ) : (
          articles.map((article, index) => (
            <div
              key={article.id}
              className="flex items-center gap-3 rounded-lg border border-black/[.06] bg-zinc-50 p-3 dark:border-white/[.08] dark:bg-zinc-900"
            >
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => moveUp(index)}
                  disabled={index === 0 || isPending}
                  className="h-5 w-5 rounded text-xs text-zinc-600 hover:bg-zinc-200 disabled:opacity-40 dark:text-zinc-400 dark:hover:bg-zinc-700"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveDown(index)}
                  disabled={index === articles.length - 1 || isPending}
                  className="h-5 w-5 rounded text-xs text-zinc-600 hover:bg-zinc-200 disabled:opacity-40 dark:text-zinc-400 dark:hover:bg-zinc-700"
                >
                  ↓
                </button>
              </div>

              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded bg-zinc-200 text-xs font-semibold text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
                {index + 1}
              </div>

              <p className="flex-1 text-sm text-zinc-900 dark:text-zinc-100">
                {article.title}
              </p>

              <form action={actionRemove}>
                <input type="hidden" name="collectionArticleId" value={article.id} />
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-lg border border-red-200 bg-white px-3 py-1 text-xs font-medium text-red-700 shadow-sm hover:bg-red-50 disabled:opacity-60 dark:border-red-900/60 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-950/40"
                >
                  Remove
                </button>
              </form>
            </div>
          ))
        )}

        {(stateRemove.message || stateReorder.message) && (
          <div
            className={[
              "rounded-lg border px-3 py-2 text-sm",
              (stateRemove.ok || stateReorder.ok)
                ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-100"
                : "border-red-200 bg-red-50 text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100",
            ].join(" ")}
          >
            {stateRemove.message || stateReorder.message}
          </div>
        )}
      </div>
    </section>
  );
}
