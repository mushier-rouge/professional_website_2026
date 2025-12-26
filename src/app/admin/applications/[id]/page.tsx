import type { Metadata } from "next";
import Link from "next/link";

import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { hasRole } from "@/lib/rbac/permissions";
import { MembershipGradeBadge } from "@/components/MembershipGradeBadge";
import type { MembershipGrade } from "@/lib/membership";
import { ApplicationActions } from "./ui/ApplicationActions";

export const metadata: Metadata = {
  title: "Review Application",
  description: "Review membership upgrade application.",
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
  nominator_id: string | null;
  nomination_letter: string | null;
  submitted_at: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  decision_notes: string | null;
  created_at: string;
  applicant: {
    display_name: string | null;
    user_id: string;
    title: string | null;
    affiliation: string | null;
    membership_grade: string;
  } | null;
  reviewer: {
    display_name: string | null;
  } | null;
};

export default async function ReviewApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createSupabaseServerClient();
  const { data } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  const user = data.user;

  if (!user) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Review Application
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
          Review Application
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
          Review Application
        </h1>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
          <p className="font-medium">Supabase is not configured.</p>
        </div>
      </div>
    );
  }

  const { data: row, error } = await supabase
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
      nominator_id,
      nomination_letter,
      submitted_at,
      reviewed_by,
      reviewed_at,
      decision_notes,
      created_at,
      applicant:profiles!membership_applications_user_id_fkey(display_name, user_id, title, affiliation, membership_grade),
      reviewer:profiles!membership_applications_reviewed_by_fkey(display_name)
    `)
    .eq("id", id)
    .single();

  if (error || !row) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Review Application
        </h1>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100">
          Application not found.
        </div>
        <Link
          href="/admin/applications"
          className="text-sm text-zinc-600 hover:underline dark:text-zinc-400"
        >
          ← Back to applications
        </Link>
      </div>
    );
  }

  const application = row as unknown as ApplicationRow;

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/applications"
            className="text-sm text-zinc-600 hover:underline dark:text-zinc-400"
          >
            ← Back to applications
          </Link>
        </div>
      </header>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <MembershipGradeBadge grade={application.target_grade as MembershipGrade} />
          <span
            className={[
              "rounded px-2.5 py-1 text-xs font-medium",
              application.status === "submitted"
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                : application.status === "under_review"
                  ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
                  : application.status === "approved"
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                    : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
            ].join(" ")}
          >
            {application.status}
          </span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
          {application.target_grade === "senior" ? "Senior Member" : "Fellow"} Application
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
          {application.applicant && (
            <Link
              href={`/members/${application.applicant.user_id}`}
              className="font-medium text-zinc-900 hover:underline dark:text-zinc-100"
            >
              {application.applicant.display_name || "Unknown"}
            </Link>
          )}
          {application.applicant?.title && (
            <>
              <span>•</span>
              <span>{application.applicant.title}</span>
            </>
          )}
          {application.applicant?.affiliation && (
            <>
              <span>•</span>
              <span>{application.applicant.affiliation}</span>
            </>
          )}
        </div>

        {application.applicant && (
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            Current grade:{" "}
            <MembershipGradeBadge
              grade={application.applicant.membership_grade as MembershipGrade}
            />
          </div>
        )}

        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Submitted {application.submitted_at ? new Date(application.submitted_at).toLocaleDateString() : "—"}
        </p>
      </div>

      <section className="rounded-2xl border border-black/[.06] bg-white p-6 shadow-sm dark:border-white/[.08] dark:bg-zinc-950">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Personal Statement
        </h2>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          {application.statement}
        </p>
      </section>

      {application.achievements && (
        <section className="rounded-2xl border border-black/[.06] bg-white p-6 shadow-sm dark:border-white/[.08] dark:bg-zinc-950">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Professional Achievements
          </h2>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
            {application.achievements}
          </p>
        </section>
      )}

      {application.publications && (
        <section className="rounded-2xl border border-black/[.06] bg-white p-6 shadow-sm dark:border-white/[.08] dark:bg-zinc-950">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Key Publications
          </h2>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
            {application.publications}
          </p>
        </section>
      )}

      {application.contributions && (
        <section className="rounded-2xl border border-black/[.06] bg-white p-6 shadow-sm dark:border-white/[.08] dark:bg-zinc-950">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Contributions to the Field
          </h2>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
            {application.contributions}
          </p>
        </section>
      )}

      {application.nomination_letter && (
        <section className="rounded-2xl border border-black/[.06] bg-white p-6 shadow-sm dark:border-white/[.08] dark:bg-zinc-950">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Nomination Letter
          </h2>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
            {application.nomination_letter}
          </p>
        </section>
      )}

      {application.decision_notes && (
        <section className="rounded-2xl border border-black/[.06] bg-white p-6 shadow-sm dark:border-white/[.08] dark:bg-zinc-950">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Decision Notes
          </h2>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
            {application.decision_notes}
          </p>
          {application.reviewer && application.reviewed_at && (
            <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-500">
              Reviewed by {application.reviewer.display_name || "Unknown"} on{" "}
              {new Date(application.reviewed_at).toLocaleDateString()}
            </p>
          )}
        </section>
      )}

      <ApplicationActions
        applicationId={application.id}
        currentStatus={application.status}
        userId={user.id}
      />
    </div>
  );
}
