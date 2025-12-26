"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

type ArticleFiltersProps = {
  allTopics: string[];
};

export function ArticleFilters({ allTopics }: ArticleFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [selectedType, setSelectedType] = useState(searchParams.get("type") ?? "");
  const [selectedTopic, setSelectedTopic] = useState(searchParams.get("topic") ?? "");

  const articleTypes = [
    { value: "", label: "All types" },
    { value: "research", label: "Research" },
    { value: "review", label: "Review" },
    { value: "tutorial", label: "Tutorial" },
    { value: "perspective", label: "Perspective" },
    { value: "news", label: "News & Commentary" },
  ];

  const topicOptions = [
    { value: "", label: "All topics" },
    ...allTopics.map((topic) => ({ value: topic, label: topic })),
  ];

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (selectedType) params.set("type", selectedType);
    if (selectedTopic) params.set("topic", selectedTopic);

    startTransition(() => {
      router.push(`/articles?${params.toString()}`);
    });
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedType("");
    setSelectedTopic("");
    startTransition(() => {
      router.push("/articles");
    });
  };

  const hasActiveFilters = search || selectedType || selectedTopic;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {/* Search input */}
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                applyFilters();
              }
            }}
            placeholder="Search articles..."
            className="w-full rounded-lg border border-black/[.08] bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-white/[.12] dark:bg-black dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600"
          />
        </div>

        {/* Type filter */}
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="rounded-lg border border-black/[.08] bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm outline-none focus:border-zinc-400 dark:border-white/[.12] dark:bg-black dark:text-zinc-50 dark:focus:border-zinc-600"
        >
          {articleTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>

        {/* Topic filter */}
        {allTopics.length > 0 && (
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="rounded-lg border border-black/[.08] bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm outline-none focus:border-zinc-400 dark:border-white/[.12] dark:bg-black dark:text-zinc-50 dark:focus:border-zinc-600"
          >
            {topicOptions.map((topic) => (
              <option key={topic.value} value={topic.value}>
                {topic.label}
              </option>
            ))}
          </select>
        )}

        {/* Apply button */}
        <button
          onClick={applyFilters}
          disabled={isPending}
          className="inline-flex h-10 items-center justify-center rounded-lg bg-zinc-950 px-4 text-sm font-medium text-white shadow-sm hover:opacity-90 disabled:opacity-60 dark:bg-white dark:text-black"
        >
          {isPending ? "Filtering..." : "Apply"}
        </button>

        {/* Clear button */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            disabled={isPending}
            className="inline-flex h-10 items-center justify-center rounded-lg border border-black/[.08] bg-white px-4 text-sm font-medium text-zinc-900 shadow-sm hover:bg-black/[.02] disabled:opacity-60 dark:border-white/[.12] dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-white/[.06]"
          >
            Clear
          </button>
        )}
      </div>

      {/* Active filters display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <span>Filters:</span>
          {search && (
            <span className="rounded bg-zinc-100 px-2 py-0.5 dark:bg-zinc-800">
              Search: &quot;{search}&quot;
            </span>
          )}
          {selectedType && (
            <span className="rounded bg-zinc-100 px-2 py-0.5 dark:bg-zinc-800">
              Type: {articleTypes.find((t) => t.value === selectedType)?.label}
            </span>
          )}
          {selectedTopic && (
            <span className="rounded bg-zinc-100 px-2 py-0.5 dark:bg-zinc-800">
              Topic: {selectedTopic}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
