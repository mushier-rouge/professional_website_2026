import type { Metadata } from "next";
import Link from "next/link";

import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { hasRole } from "@/lib/rbac/permissions";
import { MembershipGradeBadge } from "@/components/MembershipGradeBadge";
import type { MembershipGrade } from "@/lib/membership";

export const metadata: Metadata = {
  title: "Membership Applications",
  description: "Review membership upgrade applications.",
};

type ApplicationRow = {
  id: string;
  user_id: string;
  target_grade: string;
  status: string;
  statement: string;
  achievements: string | null;
  publications: string | null;
  contributions: string | null;
  submitted_at: string | null;
  created_at: string;
  applicant: {
    display_name: string | null;
    user_id: string;
  } | null;
};

export default async function ApplicationsPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  const user = data.user;

  if (!user) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Membership Applications
        </h1>
        <div className="rounded-2xl border border-black/[.06] bg-white p-6 shadow-sm dark:border-white/[.08] dark:bg-zinc-950">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            You must be signed in.
          </p>
        </div>
      </div>
    );
  }

  const isAdmin = await hasRole("admin");

  if (!isAdmin) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Membership Applications
        </h1>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
          <p className="font-medium">Access Denied</p>
          <p className="mt-2 text-amber-800 dark:text-amber-200">
            You must have admin privileges to review applications.
          </p>
        </div>
      </div>
    );
  }

  if (!supabase) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Membership Applications
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
      user_id,
      target_grade,
      status,
      statement,
      achievements,
      publications,
      contributions,
      submitted_at,
      created_at,
      applicant:profiles!membership_applications_user_id_fkey(display_name, user_id)
    `)
    .order("submitted_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Membership Applications
        </h1>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100">
          Failed to load applications. Ensure migrations are applied.
        </div>
      </div>
    );
  }

  const applications = (rows ?? []) as unknown as ApplicationRow[];

  const pendingApps = applications.filter((app) =>
    ["submitted", "under_review"].includes(app.status)
  );
  const reviewedApps = applications.filter((app) =>
    ["approved", "rejected"].includes(app.status)
  );

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Membership Applications
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Review and approve membership upgrade applications.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Pending Review ({pendingApps.length})
        </h2>
        {pendingApps.length === 0 ? (
          <div className="rounded-2xl border border-black/[.06] bg-white p-6 text-sm text-zinc-600 shadow-sm dark:border-white/[.08] dark:bg-zinc-950 dark:text-zinc-400">
            No pending applications.
          </div>
        ) : (
          <div className="space-y-3">
            {pendingApps.map((app) => (
              <Link
                key={app.id}
                href={`/admin/applications/${app.id}`}
                className="block rounded-2xl border border-black/[.06] bg-white p-5 shadow-sm transition-colors hover:bg-black/[.02] dark:border-white/[.08] dark:bg-zinc-950 dark:hover:bg-white/[.06]"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                        {app.applicant?.display_name || "Unknown"}
                      </h3>
                      <MembershipGradeBadge grade={app.target_grade as MembershipGrade} />
                    </div>
                    <p className="line-clamp-2 text-xs text-zinc-600 dark:text-zinc-400">
                      {app.statement}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-500">
                      Submitted {app.submitted_at ? new Date(app.submitted_at).toLocaleDateString() : "—"}
                    </p>
                  </div>
                  <span
                    className={[
                      "rounded px-2.5 py-1 text-xs font-medium",
                      app.status === "submitted"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                        : "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
                    ].join(" ")}
                  >
                    {app.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Reviewed ({reviewedApps.length})
        </h2>
        {reviewedApps.length === 0 ? (
          <div className="rounded-2xl border border-black/[.06] bg-white p-6 text-sm text-zinc-600 shadow-sm dark:border-white/[.08] dark:bg-zinc-950 dark:text-zinc-400">
            No reviewed applications.
          </div>
        ) : (
          <div className="space-y-3">
            {reviewedApps.map((app) => (
              <Link
                key={app.id}
                href={`/admin/applications/${app.id}`}
                className="block rounded-2xl border border-black/[.06] bg-white p-5 shadow-sm transition-colors hover:bg-black/[.02] dark:border-white/[.08] dark:bg-zinc-950 dark:hover:bg-white/[.06]"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                        {app.applicant?.display_name || "Unknown"}
                      </h3>
                      <MembershipGradeBadge grade={app.target_grade as MembershipGrade} />
                    </div>
                    <p className="line-clamp-2 text-xs text-zinc-600 dark:text-zinc-400">
                      {app.statement}
                    </p>
                  </div>
                  <span
                    className={[
                      "rounded px-2.5 py-1 text-xs font-medium",
                      app.status === "approved"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                        : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
                    ].join(" ")}
                  >
                    {app.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
