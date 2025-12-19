import type { Metadata } from "next";
import Link from "next/link";

import { MembershipGradeBadge } from "@/components/MembershipGradeBadge";
import { membershipGrades } from "@/content/membership_grades";

export const metadata: Metadata = {
  title: "Membership grades",
  description:
    "Membership grades and criteria for an AI/ML professional consortium.",
};

export default function MembershipGradesPage() {
  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Membership grades
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          Grades recognize different levels of experience, responsibility, and
          impact. Criteria are intentionally evidence-based and evaluated via
          peer review.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/membership/apply"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-zinc-950 px-4 text-sm font-medium text-white shadow-sm hover:opacity-90 dark:bg-white dark:text-black"
          >
            Apply for upgrade
          </Link>
          <Link
            href="/account"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-black/[.08] bg-white px-4 text-sm font-medium text-zinc-900 shadow-sm hover:bg-black/[.02] dark:border-white/[.12] dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-white/[.06]"
          >
            Account
          </Link>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        {membershipGrades.map((grade) => (
          <section
            key={grade.grade}
            className="rounded-2xl border border-black/[.06] bg-white p-6 shadow-sm dark:border-white/[.08] dark:bg-zinc-950"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
                  {grade.label}
                </h2>
                <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  {grade.summary}
                </p>
              </div>
              <MembershipGradeBadge grade={grade.grade} />
            </div>

            <h3 className="mt-6 text-sm font-semibold text-zinc-950 dark:text-zinc-50">
              Criteria
            </h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              {grade.criteria.map((criterion) => (
                <li key={criterion}>{criterion}</li>
              ))}
            </ul>

            <h3 className="mt-6 text-sm font-semibold text-zinc-950 dark:text-zinc-50">
              Typical evidence
            </h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              {grade.typicalEvidence.map((evidence) => (
                <li key={evidence}>{evidence}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <p className="max-w-3xl text-xs leading-5 text-zinc-500 dark:text-zinc-500">
        Note: These criteria are inspired by long-running professional society
        grade systems, adapted for an AI/ML consortium. Final interpretation and
        decisions depend on peer review and the specific evidence provided.
      </p>
    </div>
  );
}
