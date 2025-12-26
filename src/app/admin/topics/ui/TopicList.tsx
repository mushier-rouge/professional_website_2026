"use client";

import { useActionState, useState } from "react";

import { deleteTopic, updateTopic, type TopicActionState } from "../actions";

const initialState: TopicActionState = { ok: false, message: "" };

type Topic = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
  created_at: string;
};

export function TopicList({ topics }: { topics: Topic[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editColor, setEditColor] = useState("#3B82F6");

  const [deleteState, deleteAction, isDeletePending] = useActionState(
    async (_prevState: TopicActionState | undefined, formData: FormData) => {
      const result = await deleteTopic(formData);
      return result;
    },
    initialState
  );

  const [updateState, updateAction, isUpdatePending] = useActionState(
    async (_prevState: TopicActionState | undefined, formData: FormData) => {
      const result = await updateTopic(formData);
      if (result.ok) {
        setEditingId(null);
      }
      return result;
    },
    initialState
  );

  const startEdit = (topic: Topic) => {
    setEditingId(topic.id);
    setEditName(topic.name);
    setEditDescription(topic.description || "");
    setEditColor(topic.color || "#3B82F6");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditDescription("");
    setEditColor("#3B82F6");
  };

  if (topics.length === 0) {
    return (
      <div className="rounded-2xl border border-black/[.06] bg-white p-6 text-sm text-zinc-600 shadow-sm dark:border-white/[.08] dark:bg-zinc-950 dark:text-zinc-400">
        No topics created yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {topics.map((topic) => (
        <div
          key={topic.id}
          className="rounded-2xl border border-black/[.06] bg-white p-5 shadow-sm dark:border-white/[.08] dark:bg-zinc-950"
        >
          {editingId === topic.id ? (
            <form action={updateAction} className="space-y-4">
              <input type="hidden" name="id" value={topic.id} />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                    Name
                  </label>
                  <input
                    name="name"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full rounded-lg border border-black/[.08] bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm outline-none focus:border-zinc-400 dark:border-white/[.12] dark:bg-black dark:text-zinc-50 dark:focus:border-zinc-600"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                    Color
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      name="color"
                      value={editColor}
                      onChange={(e) => setEditColor(e.target.value)}
                      className="h-10 w-16 rounded-lg border border-black/[.08] bg-white shadow-sm dark:border-white/[.12] dark:bg-black"
                    />
                    <input
                      type="text"
                      value={editColor}
                      onChange={(e) => setEditColor(e.target.value)}
                      className="flex-1 rounded-lg border border-black/[.08] bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm outline-none focus:border-zinc-400 dark:border-white/[.12] dark:bg-black dark:text-zinc-50 dark:focus:border-zinc-600"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={2}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full rounded-lg border border-black/[.08] bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm outline-none focus:border-zinc-400 dark:border-white/[.12] dark:bg-black dark:text-zinc-50 dark:focus:border-zinc-600"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isUpdatePending}
                  className="inline-flex h-9 items-center justify-center rounded-lg bg-zinc-950 px-3 text-sm font-medium text-white shadow-sm hover:opacity-90 disabled:opacity-60 dark:bg-white dark:text-black"
                >
                  {isUpdatePending ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  disabled={isUpdatePending}
                  className="inline-flex h-9 items-center justify-center rounded-lg border border-black/[.08] bg-white px-3 text-sm font-medium text-zinc-900 shadow-sm hover:bg-black/[.02] disabled:opacity-60 dark:border-white/[.12] dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-white/[.06]"
                >
                  Cancel
                </button>
              </div>

              {updateState.message && (
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
              )}
            </form>
          ) : (
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: topic.color || "#3B82F6" }}
                  />
                  <h3 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                    {topic.name}
                  </h3>
                  <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                    {topic.slug}
                  </code>
                </div>
                {topic.description && (
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {topic.description}
                  </p>
                )}
                <p className="text-xs text-zinc-500 dark:text-zinc-500">
                  Created {new Date(topic.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(topic)}
                  className="inline-flex h-8 items-center justify-center rounded-lg border border-black/[.08] bg-white px-3 text-xs font-medium text-zinc-900 shadow-sm hover:bg-black/[.02] dark:border-white/[.12] dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-white/[.06]"
                >
                  Edit
                </button>
                <form action={deleteAction}>
                  <input type="hidden" name="id" value={topic.id} />
                  <button
                    type="submit"
                    disabled={isDeletePending}
                    className="inline-flex h-8 items-center justify-center rounded-lg border border-red-200 bg-white px-3 text-xs font-medium text-red-700 shadow-sm hover:bg-red-50 disabled:opacity-60 dark:border-red-900/60 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-950/40"
                  >
                    {isDeletePending ? "Deleting..." : "Delete"}
                  </button>
                </form>
              </div>
            </div>
          )}

          {deleteState.message && editingId !== topic.id && (
            <div
              className={[
                "mt-3 rounded-lg border px-3 py-2 text-sm",
                deleteState.ok
                  ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-100"
                  : "border-red-200 bg-red-50 text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100",
              ].join(" ")}
            >
              {deleteState.message}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
