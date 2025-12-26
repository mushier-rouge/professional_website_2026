"use client";

import { useActionState, useState } from "react";

import { addTopic, type TopicActionState } from "../actions";

const initialState: TopicActionState = { ok: false, message: "" };

export function AddTopicForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#3B82F6");

  const [state, formAction, isPending] = useActionState(addTopic, initialState);

  // Reset form on success
  if (state.ok && name) {
    setName("");
    setDescription("");
    setColor("#3B82F6");
  }

  return (
    <section className="rounded-2xl border border-black/[.06] bg-white p-6 shadow-sm dark:border-white/[.08] dark:bg-zinc-950">
      <h2 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
        Add New Topic
      </h2>

      <form action={formAction} className="mt-5 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
              Name <span className="text-red-600">*</span>
            </label>
            <input
              name="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-black/[.08] bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-white/[.12] dark:bg-black dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600"
              placeholder="Machine Learning"
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
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-10 w-16 rounded-lg border border-black/[.08] bg-white shadow-sm dark:border-white/[.12] dark:bg-black"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="flex-1 rounded-lg border border-black/[.08] bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm outline-none focus:border-zinc-400 dark:border-white/[.12] dark:bg-black dark:text-zinc-50 dark:focus:border-zinc-600"
                placeholder="#3B82F6"
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
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border border-black/[.08] bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-white/[.12] dark:bg-black dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600"
            placeholder="Brief description of this topic"
          />
        </div>

        {state.message && (
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
        )}

        <button
          type="submit"
          disabled={isPending || !name.trim()}
          className="inline-flex h-10 items-center justify-center rounded-lg bg-zinc-950 px-4 text-sm font-medium text-white shadow-sm hover:opacity-90 disabled:opacity-60 dark:bg-white dark:text-black"
        >
          {isPending ? "Adding..." : "Add Topic"}
        </button>
      </form>
    </section>
  );
}
