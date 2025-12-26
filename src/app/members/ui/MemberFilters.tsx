"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

export function MemberFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [selectedGrade, setSelectedGrade] = useState(
    searchParams.get("grade") ?? ""
  );

  const grades = [
    { value: "", label: "All grades" },
    { value: "member", label: "Member" },
    { value: "senior", label: "Senior Member" },
    { value: "fellow", label: "Fellow" },
  ];

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (selectedGrade) params.set("grade", selectedGrade);

    startTransition(() => {
      router.push(`/members?${params.toString()}`);
    });
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedGrade("");
    startTransition(() => {
      router.push("/members");
    });
  };

  const hasActiveFilters = search || selectedGrade;

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
            placeholder="Search members..."
            className="w-full rounded-lg border border-black/[.08] bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-white/[.12] dark:bg-black dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600"
          />
        </div>

        {/* Grade filter */}
        <select
          value={selectedGrade}
          onChange={(e) => setSelectedGrade(e.target.value)}
          className="rounded-lg border border-black/[.08] bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm outline-none focus:border-zinc-400 dark:border-white/[.12] dark:bg-black dark:text-zinc-50 dark:focus:border-zinc-600"
        >
          {grades.map((grade) => (
            <option key={grade.value} value={grade.value}>
              {grade.label}
            </option>
          ))}
        </select>

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
          {selectedGrade && (
            <span className="rounded bg-zinc-100 px-2 py-0.5 dark:bg-zinc-800">
              Grade: {grades.find((g) => g.value === selectedGrade)?.label}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
