import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MembershipGradeBadge } from "@/components/MembershipGradeBadge";
import type { MembershipGrade } from "@/lib/membership";
import { findMemberBySlug } from "@/lib/members/lookup";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";

export const metadata: Metadata = {
  title: "Member profile",
  description: "Member profile details.",
};

export default async function MemberProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return (
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Member profile
        </h1>
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
          <p className="font-medium">Supabase is not configured.</p>
          <p className="mt-2 text-amber-800 dark:text-amber-200">
            Set <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to load profiles.
          </p>
        </section>
        <Link href="/members" className="text-sm text-zinc-600 hover:underline dark:text-zinc-400">
          Back to directory
        </Link>
      </div>
    );
  }

  type MemberProfile = {
    id: string;
    displayName: string;
    title: string | null;
    affiliation: string | null;
    location: string | null;
    shortBio: string | null;
    bio: string | null;
    avatarUrl: string | null;
    membershipGrade: MembershipGrade;
    linkedinUrl: string | null;
    websiteUrl: string | null;
    githubUrl: string | null;
    scholarUrl: string | null;
    orcidUrl: string | null;
  };

  const { data: rows, error } = await supabase
    .from("profiles")
    .select("*")
    .not("display_name", "is", null)
    .eq("visibility", "public")
    .eq("directory_opt_out", false)
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    return (
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Member profile
        </h1>
        <section className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100">
          Unable to load this profile. Ensure the Supabase migrations are applied.
        </section>
        <Link href="/members" className="text-sm text-zinc-600 hover:underline dark:text-zinc-400">
          Back to directory
        </Link>
      </div>
    );
  }

  const members: MemberProfile[] = (rows ?? [])
    .map((row) => ({
      id: row.user_id as string,
      displayName: row.display_name ?? "",
      title: row.title ?? null,
      affiliation: row.affiliation ?? null,
      location: row.location ?? null,
      shortBio: row.short_bio ?? null,
      bio: row.bio ?? null,
      avatarUrl: row.avatar_url ?? null,
      membershipGrade: (row.membership_grade ?? "member") as MembershipGrade,
      linkedinUrl: row.linkedin_url ?? null,
      websiteUrl: row.website_url ?? null,
      githubUrl: row.github_url ?? null,
      scholarUrl: row.scholar_url ?? null,
      orcidUrl: row.orcid_url ?? null,
    }))
    .filter((member) => member.displayName.trim().length > 0);

  const member = findMemberBySlug(members, slug);

  if (!member) {
    notFound();
  }

  const initials = member.displayName.slice(0, 1).toUpperCase();

  return (
    <div className="mx-auto w-full max-w-3xl space-y-10">
      <header className="rounded-2xl border border-black/[.06] bg-white p-6 shadow-sm dark:border-white/[.08] dark:bg-zinc-950 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            {member.avatarUrl ? (
              <Image
                src={member.avatarUrl}
                alt={member.displayName}
                width={96}
                height={96}
                className="h-24 w-24 rounded-full border border-black/[.06] bg-white object-cover dark:border-white/[.08] dark:bg-zinc-950"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full border border-black/[.06] bg-zinc-100 text-2xl font-semibold text-zinc-600 dark:border-white/[.08] dark:bg-zinc-900 dark:text-zinc-300">
                {initials}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                  {member.displayName}
                </h1>
                <MembershipGradeBadge grade={member.membershipGrade} />
              </div>
              {member.title && (
                <p className="mt-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {member.title}
                </p>
              )}
              {member.affiliation && (
                <p className="mt-0.5 text-sm text-zinc-600 dark:text-zinc-400">
                  {member.affiliation}
                </p>
              )}
              {member.location && (
                <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-500">
                  📍 {member.location}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            {member.websiteUrl && (
              <a
                href={member.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-600 hover:underline dark:text-zinc-400"
              >
                🌐 Website
              </a>
            )}
            {member.linkedinUrl && (
              <a
                href={member.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-600 hover:underline dark:text-zinc-400"
              >
                💼 LinkedIn
              </a>
            )}
            {member.githubUrl && (
              <a
                href={member.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-600 hover:underline dark:text-zinc-400"
              >
                💻 GitHub
              </a>
            )}
            {member.scholarUrl && (
              <a
                href={member.scholarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-600 hover:underline dark:text-zinc-400"
              >
                🎓 Scholar
              </a>
            )}
            {member.orcidUrl && (
              <a
                href={member.orcidUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-600 hover:underline dark:text-zinc-400"
              >
                🆔 ORCID
              </a>
            )}
          </div>
        </div>
      </header>

      {member.shortBio && (
        <section className="rounded-2xl border border-black/[.06] bg-white p-6 shadow-sm dark:border-white/[.08] dark:bg-zinc-950">
          <h2 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">About</h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {member.shortBio}
          </p>
        </section>
      )}

      {member.bio && (
        <section className="rounded-2xl border border-black/[.06] bg-white p-6 shadow-sm dark:border-white/[.08] dark:bg-zinc-950">
          <h2 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">Biography</h2>
          <div className="prose prose-sm prose-zinc mt-3 max-w-none dark:prose-invert">
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap">
              {member.bio}
            </p>
          </div>
        </section>
      )}

      <div className="flex flex-wrap gap-4 text-sm">
        <Link href="/members" className="text-zinc-600 hover:underline dark:text-zinc-400">
          Back to directory
        </Link>
        <Link href="/" className="text-zinc-600 hover:underline dark:text-zinc-400">
          Back to home
        </Link>
      </div>
    </div>
  );
}
