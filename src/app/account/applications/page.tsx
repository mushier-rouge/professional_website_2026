import type { Metadata } from "next";
import Link from "next/link";

import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { MembershipGradeBadge } from "@/components/MembershipGradeBadge";
import type { MembershipGrade } from "@/lib/membership";

export const metadata: Metadata = {
  title: "My Applications",
  description: "View your membership application status.",
};

type ApplicationRow = {
  id: string;
  target_grade: string;
  status: string;
  statement: string;
  submitted_at: string | null;
  reviewed_at: string | null;
  decision_notes: string | null;
  created_at: string;
  reviewer: {
    display_name: string | null;
  } | null;
};

export default async function MyApplicationsPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  const user = data.user;

  if (!user) {
    return (
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          My Applications
        </h1>
        <div className="rounded-2xl border border-black/[.06] bg-white p-6 shadow-sm dark:border-white/[.08] dark:bg-zinc-950">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            You must be signed in.
          </p>
        </div>
      </div>
    );
  }

  if (!supabase) {
    return (
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          My Applications
        </h1>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
          <p className="font-medium">Supabase is not configured.</p>
        </div>
      </div>
    );
  }

  const { data: rows, error } = await supabase
    .from("membership_applications")
    .select(`
      id,
      target_grade,
      status,
      statement,
      submitted_at,
      reviewed_at,
      decision_notes,
      created_at,
      reviewer:profiles!membership_applications_reviewed_by_fkey(display_name)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          My Applications
        </h1>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100">
          Failed to load applications.
        </div>
      </div>
    );
  }

  const applications = (rows ?? []) as unknown as ApplicationRow[];

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          My Applications
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Track the status of your membership upgrade applications.
        </p>
      </header>

      {applications.length === 0 ? (
        <section className="rounded-2xl border border-black/[.06] bg-white p-6 shadow-sm dark:border-white/[.08] dark:bg-zinc-950">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            You haven&apos;t submitted any membership applications yet.
          </p>
          <div className="mt-4">
            <Link
              href="/membership/apply"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-zinc-950 px-4 text-sm font-medium text-white shadow-sm hover:opacity-90 dark:bg-white dark:text-black"
            >
              Apply for upgrade
            </Link>
          </div>
        </section>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <section
              key={app.id}
              className="rounded-2xl border border-black/[.06] bg-white p-6 shadow-sm dark:border-white/[.08] dark:bg-zinc-950"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <MembershipGradeBadge grade={app.target_grade as MembershipGrade} />
                    <span
                      className={[
                        "rounded px-2.5 py-1 text-xs font-medium",
                        app.status === "draft"
                          ? "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                          : app.status === "submitted"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                            : app.status === "under_review"
                              ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
                              : app.status === "approved"
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                                : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
                      ].join(" ")}
                    >
                      {app.status}
                    </span>
                  </div>

                  <p className="line-clamp-2 text-sm text-zinc-700 dark:text-zinc-300">
                    {app.statement}
                  </p>

                  <div className="space-y-1 text-xs text-zinc-500 dark:text-zinc-500">
                    {app.submitted_at && (
                      <p>
                        Submitted {new Date(app.submitted_at).toLocaleDateString()}
                      </p>
                    )}
                    {app.reviewed_at && (
                      <p>
                        Reviewed {new Date(app.reviewed_at).toLocaleDateString()}
                        {app.reviewer?.display_name && ` by ${app.reviewer.display_name}`}
                      </p>
                    )}
                  </div>

                  {app.decision_notes && (
                    <div className="rounded-lg border border-black/[.06] bg-zinc-50 p-3 text-sm dark:border-white/[.08] dark:bg-zinc-900">
                      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                        Reviewer Notes
                      </p>
                      <p className="mt-1 text-zinc-700 dark:text-zinc-300">
                        {app.decision_notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-4 text-sm">
        <Link
          href="/membership/apply"
          className="text-zinc-600 hover:underline dark:text-zinc-400"
        >
          Apply for upgrade
        </Link>
        <Link
          href="/account"
          className="text-zinc-600 hover:underline dark:text-zinc-400"
        >
          Account
        </Link>
      </div>
    </div>
  );
}
