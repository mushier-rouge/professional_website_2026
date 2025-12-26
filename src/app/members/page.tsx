import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import { MembershipGradeBadge } from "@/components/MembershipGradeBadge";
import type { MembershipGrade } from "@/lib/membership";
import { toMemberSlug } from "@/lib/members/slug";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { MemberFilters } from "./ui/MemberFilters";

export const metadata: Metadata = {
  title: "Members",
  description: "Member directory.",
};

type MemberCard = {
  id: string;
  displayName: string;
  title: string | null;
  affiliation: string | null;
  shortBio: string | null;
  avatarUrl: string | null;
  membershipGrade: MembershipGrade;
};

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; grade?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createSupabaseServerClient();
  let members: MemberCard[] = [];
  let loadError: string | null = null;

  if (supabase) {
    let query = supabase
      .from("profiles")
      .select("user_id,display_name,title,affiliation,short_bio,avatar_url,membership_grade,created_at")
      .not("display_name", "is", null)
      .eq("visibility", "public")
      .eq("directory_opt_out", false);

    // Apply grade filter
    if (params.grade) {
      query = query.eq("membership_grade", params.grade);
    }

    // Apply search filter
    if (params.search) {
      query = query.or(
        `display_name.ilike.%${params.search}%,title.ilike.%${params.search}%,affiliation.ilike.%${params.search}%,short_bio.ilike.%${params.search}%`
      );
    }

    const { data: rows, error } = await query
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      loadError =
        "Unable to load members. Ensure the Supabase migrations are applied.";
    } else {
      members = (rows ?? [])
        .map((row) => ({
          id: row.user_id as string,
          displayName: row.display_name ?? "",
          title: row.title ?? null,
          affiliation: row.affiliation ?? null,
          shortBio: row.short_bio ?? null,
          avatarUrl: row.avatar_url ?? null,
          membershipGrade: (row.membership_grade ?? "member") as MembershipGrade,
        }))
        .filter((member) => member.displayName.trim().length > 0);
    }
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Members
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Browse verified member profiles and professional biographies.
        </p>
      </header>

      <Suspense fallback={<div className="text-sm text-zinc-500">Loading filters...</div>}>
        <MemberFilters />
      </Suspense>

      {!supabase ? (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
          <p className="font-medium">Supabase is not configured.</p>
          <p className="mt-2 text-amber-800 dark:text-amber-200">
            Set <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to load the directory.
          </p>
        </section>
      ) : loadError ? (
        <section className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100">
          {loadError}
        </section>
      ) : members.length === 0 ? (
        <section className="rounded-2xl border border-black/[.06] bg-white p-6 text-sm text-zinc-600 shadow-sm dark:border-white/[.08] dark:bg-zinc-950 dark:text-zinc-400">
          No public profiles yet.
        </section>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {members.map((member) => {
            const slug = toMemberSlug(member.displayName);
            const initials = member.displayName.slice(0, 1).toUpperCase();
            return (
              <Link
                key={member.id}
                href={`/members/${slug}`}
                className="rounded-2xl border border-black/[.06] bg-white p-5 shadow-sm transition-colors hover:bg-black/[.02] dark:border-white/[.08] dark:bg-zinc-950 dark:hover:bg-white/[.06]"
              >
                <div className="flex items-center gap-4">
                  {member.avatarUrl ? (
                    <Image
                      src={member.avatarUrl}
                      alt={member.displayName}
                      width={64}
                      height={64}
                      className="h-16 w-16 rounded-full border border-black/[.06] bg-white object-cover dark:border-white/[.08] dark:bg-zinc-950"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-black/[.06] bg-zinc-100 text-sm font-semibold text-zinc-600 dark:border-white/[.08] dark:bg-zinc-900 dark:text-zinc-300">
                      {initials}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                        {member.displayName}
                      </h2>
                      <MembershipGradeBadge grade={member.membershipGrade} />
                    </div>
                    {member.title && (
                      <p className="mt-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                        {member.title}
                      </p>
                    )}
                    {member.affiliation && (
                      <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-500">
                        {member.affiliation}
                      </p>
                    )}
                    {member.shortBio && (
                      <p className="mt-2 line-clamp-2 text-xs text-zinc-600 dark:text-zinc-400">
                        {member.shortBio}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
