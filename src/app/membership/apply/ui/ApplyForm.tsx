"use client";

import { useActionState } from "react";

import { MembershipGradeBadge } from "@/components/MembershipGradeBadge";
import { membershipGrades } from "@/content/membership_grades";
import type { MembershipGrade } from "@/lib/membership";

import { applyForMembershipUpgrade, type ApplyState } from "../actions";

const initialState: ApplyState = { ok: false, message: "" };

export function ApplyForm({ userEmail }: { userEmail: string }) {
  const [state, formAction, isPending] = useActionState(
    applyForMembershipUpgrade,
    initialState,
  );

  const selectableGrades = membershipGrades.filter(
    (g) => g.grade !== "member",
  ) as Array<(typeof membershipGrades)[number] & { grade: MembershipGrade }>;

  return (
    <section className="rounded-2xl border border-black/[.06] bg-white p-6 shadow-sm dark:border-white/[.08] dark:bg-zinc-950">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
          Application
        </h2>
        <span className="text-xs text-zinc-500 dark:text-zinc-500">
          Signed in as {userEmail || "(unknown)"}
        </span>
      </div>

      <form action={formAction} className="mt-5 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
            Requested grade
          </label>
          <select
            name="requestedGrade"
            className="w-full rounded-lg border border-black/[.08] bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm outline-none focus:border-zinc-400 dark:border-white/[.12] dark:bg-black dark:text-zinc-50 dark:focus:border-zinc-600"
            defaultValue="senior"
          >
            {selectableGrades.map((g) => (
              <option key={g.grade} value={g.grade}>
                {g.label}
              </option>
            ))}
          </select>
          <div className="flex flex-wrap gap-2">
            <MembershipGradeBadge grade="senior" />
            <MembershipGradeBadge grade="fellow" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
            Evidence (required)
          </label>
          <textarea
            name="evidence"
            required
            rows={7}
            className="w-full rounded-lg border border-black/[.08] bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-white/[.12] dark:bg-black dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600"
            placeholder="Summarize your sustained impact, leadership, and contributions relevant to the criteria."
          />
          <p className="text-xs text-zinc-500 dark:text-zinc-500">
            Keep this factual and evidence-based.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
            Links (optional)
          </label>
          <textarea
            name="links"
            rows={3}
            className="w-full rounded-lg border border-black/[.08] bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-white/[.12] dark:bg-black dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600"
            placeholder="Publications, projects, talks, repos, patents, etc."
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
          {isPending ? "Submitting..." : "Submit application"}
        </button>
      </form>
    </section>
  );
}

