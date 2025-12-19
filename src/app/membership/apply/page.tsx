import type { Metadata } from "next";
import Link from "next/link";

import { membershipGrades } from "@/content/membership_grades";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";

import { ApplyForm } from "./ui/ApplyForm";

export const metadata: Metadata = {
  title: "Apply",
  description: "Apply for a membership upgrade.",
};

export default async function ApplyPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  const user = data.user;

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8">
      <header className="space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Membership upgrade application
        </h1>
        <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          Apply for an upgraded membership grade. Applications are evaluated by
          peer review against the published criteria.
        </p>
      </header>

      <section className="rounded-2xl border border-black/[.06] bg-white p-6 shadow-sm dark:border-white/[.08] dark:bg-zinc-950">
        <h2 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
          Criteria (summary)
        </h2>
        <div className="mt-4 space-y-6">
          {membershipGrades
            .filter((g) => g.grade !== "member")
            .map((grade) => (
              <div key={grade.grade}>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {grade.label}
                </h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  {grade.criteria.slice(0, 3).map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            ))}
        </div>

        <p className="mt-6 text-xs text-zinc-500 dark:text-zinc-500">
          See the full criteria on{" "}
          <Link href="/membership-grades" className="hover:underline">
            Membership grades
          </Link>
          .
        </p>
      </section>

      {!supabase ? (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
          <p className="font-medium">Supabase is not configured.</p>
          <p className="mt-2 text-amber-800 dark:text-amber-200">
            Set <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to enable applications.
          </p>
        </section>
      ) : !user ? (
        <section className="rounded-2xl border border-black/[.06] bg-white p-6 shadow-sm dark:border-white/[.08] dark:bg-zinc-950">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            You must be signed in to apply.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/login"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-zinc-950 px-4 text-sm font-medium text-white shadow-sm hover:opacity-90 dark:bg-white dark:text-black"
            >
              Sign in
            </Link>
            <Link
              href="/account"
              className="inline-flex h-10 items-center justify-center rounded-lg border border-black/[.08] bg-white px-4 text-sm font-medium text-zinc-900 shadow-sm hover:bg-black/[.02] dark:border-white/[.12] dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-white/[.06]"
            >
              Account
            </Link>
          </div>
        </section>
      ) : (
        <ApplyForm userEmail={user.email ?? ""} />
      )}

      <div className="flex flex-wrap gap-4 text-sm">
        <Link href="/account" className="text-zinc-600 hover:underline dark:text-zinc-400">
          Account
        </Link>
        <Link href="/" className="text-zinc-600 hover:underline dark:text-zinc-400">
          Profile
        </Link>
      </div>
    </div>
  );
}

