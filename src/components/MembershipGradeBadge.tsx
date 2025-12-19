import { membershipGradeLabels, type MembershipGrade } from "@/lib/membership";

const badgeClassesByGrade: Record<MembershipGrade, string> = {
  member:
    "border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300",
  senior:
    "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-200",
  fellow:
    "border-violet-200 bg-violet-50 text-violet-800 dark:border-violet-900/60 dark:bg-violet-950/40 dark:text-violet-200",
};

export function MembershipGradeBadge({ grade }: { grade: MembershipGrade }) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        badgeClassesByGrade[grade],
      ].join(" ")}
    >
      {membershipGradeLabels[grade]}
    </span>
  );
}

