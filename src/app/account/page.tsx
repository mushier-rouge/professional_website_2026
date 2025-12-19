import type { Metadata } from "next";
import Link from "next/link";

import { MembershipGradeBadge } from "@/components/MembershipGradeBadge";
import type { MembershipGrade } from "@/lib/membership";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";

export const metadata: Metadata = {
  title: "Account",
  description: "Account and session information.",
};

type ProfileRow = {
  display_name: string | null;
  linkedin_url: string | null;
  avatar_url: string | null;
  membership_grade: MembershipGrade | null;
};

type ApplicationRow = {
  id: string;
  requested_grade: MembershipGrade;
  status: string;
  created_at: string;
};

function formatIsoDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toISOString().slice(0, 10);
}

export default async function AccountPage() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return (
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Account
        </h1>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
          <p className="font-medium">Supabase is not configured.</p>
          <p className="mt-2 text-amber-800 dark:text-amber-200">
            Set <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to enable login.
          </p>
        </div>
        <Link
          href="/"
          className="text-sm text-zinc-600 hover:underline dark:text-zinc-400"
        >
          Back to profile
        </Link>
      </div>
    );
  }

  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return (
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Account
        </h1>
        <div className="rounded-2xl border border-black/[.06] bg-white p-6 shadow-sm dark:border-white/[.08] dark:bg-zinc-950">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            You are signed out.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/login"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-zinc-950 px-4 text-sm font-medium text-white shadow-sm hover:opacity-90 dark:bg-white dark:text-black"
            >
              Sign in
            </Link>
            <Link
              href="/membership-grades"
              className="inline-flex h-10 items-center justify-center rounded-lg border border-black/[.08] bg-white px-4 text-sm font-medium text-zinc-900 shadow-sm hover:bg-black/[.02] dark:border-white/[.12] dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-white/[.06]"
            >
              Membership grades
            </Link>
          </div>
        </div>
      </div>
    );
  }

  let profile: ProfileRow | null = null;
  let profileLoadError: string | null = null;
  let applications: ApplicationRow[] = [];
  let applicationsLoadError: string | null = null;

  const { data: profileRow, error: profileError } = await supabase
    .from("profiles")
    .select("display_name,linkedin_url,avatar_url,membership_grade")
    .eq("user_id", data.user.id)
    .maybeSingle();

  if (profileError) {
    profileLoadError =
      "Unable to load your profile details. Apply the Supabase migrations to enable profiles.";
  } else {
    profile = (profileRow as ProfileRow | null) ?? null;
  }

  const currentGrade = (profile?.membership_grade ?? "member") as MembershipGrade;

  const { data: applicationRows, error: applicationError } = await supabase
    .from("membership_applications")
    .select("id,requested_grade,status,created_at")
    .order("created_at", { ascending: false })
    .limit(10);

  if (applicationError) {
    applicationsLoadError =
      "Unable to load membership applications. Apply the Supabase migrations to enable applications.";
  } else {
    applications = (applicationRows ?? []) as ApplicationRow[];
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
        Account
      </h1>
      <section className="rounded-2xl border border-black/[.06] bg-white p-6 shadow-sm dark:border-white/[.08] dark:bg-zinc-950">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
              Session
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-500">
              Membership grade is controlled by peer review.
            </p>
          </div>
          <MembershipGradeBadge grade={currentGrade} />
        </div>

        <dl className="mt-5 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-zinc-500 dark:text-zinc-500">Email</dt>
            <dd className="mt-1 font-medium text-zinc-900 dark:text-zinc-100">
              {data.user.email ?? "(none)"}
            </dd>
          </div>
          <div>
            <dt className="text-zinc-500 dark:text-zinc-500">User ID</dt>
            <dd className="mt-1 font-mono text-xs text-zinc-700 dark:text-zinc-300">
              {data.user.id}
            </dd>
          </div>
          <div>
            <dt className="text-zinc-500 dark:text-zinc-500">Display name</dt>
            <dd className="mt-1 text-zinc-700 dark:text-zinc-300">
              {profile?.display_name || "(not set)"}
            </dd>
          </div>
          <div>
            <dt className="text-zinc-500 dark:text-zinc-500">LinkedIn</dt>
            <dd className="mt-1">
              {profile?.linkedin_url ? (
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-700 hover:underline dark:text-zinc-300"
                >
                  {profile.linkedin_url}
                </a>
              ) : (
                <span className="text-zinc-700 dark:text-zinc-300">(not set)</span>
              )}
            </dd>
          </div>
        </dl>

        {profileLoadError ? (
          <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
            {profileLoadError}
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/profile/edit"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-black/[.08] bg-white px-4 text-sm font-medium text-zinc-900 shadow-sm hover:bg-black/[.02] dark:border-white/[.12] dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-white/[.06]"
          >
            Edit profile
          </Link>
          <Link
            href="/membership/apply"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-zinc-950 px-4 text-sm font-medium text-white shadow-sm hover:opacity-90 dark:bg-white dark:text-black"
          >
            Apply for membership upgrade
          </Link>
          <Link
            href="/membership-grades"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-black/[.08] bg-white px-4 text-sm font-medium text-zinc-900 shadow-sm hover:bg-black/[.02] dark:border-white/[.12] dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-white/[.06]"
          >
            Membership criteria
          </Link>
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-black/[.08] bg-white px-4 text-sm font-medium text-zinc-900 shadow-sm hover:bg-black/[.02] dark:border-white/[.12] dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-white/[.06]"
          >
            Back to profile
          </Link>
        </div>
      </section>

      <section className="rounded-2xl border border-black/[.06] bg-white p-6 shadow-sm dark:border-white/[.08] dark:bg-zinc-950">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
            Membership applications
          </h2>
          <Link href="/membership/apply" className="text-sm text-zinc-600 hover:underline dark:text-zinc-400">
            Submit a new application
          </Link>
        </div>

        {applicationsLoadError ? (
          <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
            {applicationsLoadError}
          </div>
        ) : applications.length === 0 ? (
          <p className="mt-5 text-sm text-zinc-600 dark:text-zinc-400">
            No applications submitted yet.
          </p>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[420px] border-separate border-spacing-y-2 text-left text-sm">
              <thead>
                <tr className="text-xs text-zinc-500 dark:text-zinc-500">
                  <th className="px-3 py-1 font-medium">Date</th>
                  <th className="px-3 py-1 font-medium">Requested</th>
                  <th className="px-3 py-1 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((a) => (
                  <tr
                    key={a.id}
                    className="rounded-lg bg-black/[.02] text-zinc-700 dark:bg-white/[.06] dark:text-zinc-300"
                  >
                    <td className="px-3 py-2 font-mono text-xs">
                      {formatIsoDate(a.created_at)}
                    </td>
                    <td className="px-3 py-2">
                      <MembershipGradeBadge grade={a.requested_grade} />
                    </td>
                    <td className="px-3 py-2">{a.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
