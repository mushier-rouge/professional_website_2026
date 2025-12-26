"use client";

import { useState } from "react";
import type { ArticleStatus } from "@/lib/articles/workflow";

export type ArticleFormData = {
  title: string;
  slug: string;
  abstract: string;
  content: string;
  articleType: string;
  topics: string[];
  status: ArticleStatus;
};

type ArticleEditorProps = {
  initialData?: Partial<ArticleFormData>;
  mode: "create" | "edit";
  isPending?: boolean;
};

export function ArticleEditor({ initialData, mode, isPending = false }: ArticleEditorProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [abstract, setAbstract] = useState(initialData?.abstract || "");
  const [content, setContent] = useState(initialData?.content || "");

  // Auto-generate slug from title
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const slug = generateSlug(title);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-black/[.06] bg-white p-6 shadow-sm dark:border-white/[.08] dark:bg-zinc-950">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
            {mode === "create" ? "New Article" : "Edit Article"}
          </h2>
          <span className="text-xs text-zinc-500">Draft</span>
        </div>

        <div className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              name="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-black/[.08] bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-white/[.12] dark:bg-black dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600"
              placeholder="The Future of Machine Learning"
            />
            <p className="text-xs text-zinc-500">
              Slug: <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-900">{slug || "..."}</code>
            </p>
          </div>

          {/* Article Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
              Article Type
            </label>
            <select
              name="articleType"
              defaultValue={initialData?.articleType || "research"}
              className="w-full rounded-lg border border-black/[.08] bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm outline-none focus:border-zinc-400 dark:border-white/[.12] dark:bg-black dark:text-zinc-50 dark:focus:border-zinc-600"
            >
              <option value="research">Research Article</option>
              <option value="review">Review</option>
              <option value="tutorial">Tutorial</option>
              <option value="perspective">Perspective</option>
              <option value="news">News & Commentary</option>
            </select>
          </div>

          {/* Abstract */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                Abstract <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-zinc-500">{abstract.length} characters</span>
            </div>
            <textarea
              name="abstract"
              required
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              rows={4}
              maxLength={1000}
              className="w-full rounded-lg border border-black/[.08] bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-white/[.12] dark:bg-black dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600"
              placeholder="A brief summary of your article..."
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                Content <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-zinc-500">
                {content.split(/\s+/).filter(Boolean).length} words
              </span>
            </div>
            <textarea
              name="content"
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={20}
              className="font-mono w-full rounded-lg border border-black/[.08] bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-white/[.12] dark:bg-black dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600"
              placeholder="Write your article content here using Markdown...

## Introduction

Your content...

## Methods

More content..."
            />
            <p className="text-xs text-zinc-500">
              Supports Markdown formatting
            </p>
          </div>

          {/* Topics */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
              Topics (comma-separated)
            </label>
            <input
              name="topics"
              defaultValue={initialData?.topics?.join(", ") || ""}
              className="w-full rounded-lg border border-black/[.08] bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-white/[.12] dark:bg-black dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600"
              placeholder="machine-learning, nlp, transformers"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="submit"
              name="action"
              value="save_draft"
              disabled={isPending}
              className="flex h-11 flex-1 items-center justify-center rounded-lg border border-black/[.08] bg-white px-4 text-sm font-medium text-zinc-900 shadow-sm hover:bg-black/[.02] disabled:opacity-60 dark:border-white/[.12] dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-white/[.06]"
            >
              {isPending ? "Saving..." : "Save Draft"}
            </button>
            <button
              type="submit"
              name="action"
              value="submit_review"
              disabled={isPending}
              className="flex h-11 flex-1 items-center justify-center rounded-lg bg-zinc-950 px-4 text-sm font-medium text-white shadow-sm hover:opacity-90 disabled:opacity-60 dark:bg-white dark:text-black"
            >
              {isPending ? "Submitting..." : "Submit for Review"}
            </button>
          </div>

          <p className="text-xs text-zinc-500">
            Drafts are only visible to you. Submitting for review makes it visible to editors.
          </p>
        </div>
      </div>
    </div>
  );
}
