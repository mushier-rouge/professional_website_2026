import type { Metadata } from "next";
import Link from "next/link";

import type { MembershipGrade } from "@/lib/membership";
import type { ProfileVisibility } from "@/lib/profile/types";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";

import { EditProfileFormExpanded, type ExpandedProfileDefaults } from "./ui/EditProfileFormExpanded";
import { AvatarUpload } from "./ui/AvatarUpload";

export const metadata: Metadata = {
  title: "Edit profile",
  description: "Edit your member profile.",
};

export default async function EditProfilePage() {
  const supabase = await createSupabaseServerClient();
  const { data } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  const user = data.user;

  let profileDefaults: ExpandedProfileDefaults = {
    displayName: "",
    title: "",
    affiliation: "",
    location: "",
    shortBio: "",
    bio: "",
    linkedinUrl: "",
    avatarUrl: "",
    websiteUrl: "",
    githubUrl: "",
    scholarUrl: "",
    orcidUrl: "",
    visibility: "public",
    directoryOptOut: false,
    membershipGrade: "member",
  };
  let profileLoadError: string | null = null;

  if (supabase && user) {
    const { data: row, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      profileLoadError =
        "Unable to load your profile. Ensure the Supabase migrations are applied.";
    } else if (row) {
      profileDefaults = {
        displayName: row.display_name ?? "",
        title: row.title ?? "",
        affiliation: row.affiliation ?? "",
        location: row.location ?? "",
        shortBio: row.short_bio ?? "",
        bio: row.bio ?? "",
        linkedinUrl: row.linkedin_url ?? "",
        avatarUrl: row.avatar_url ?? "",
        websiteUrl: row.website_url ?? "",
        githubUrl: row.github_url ?? "",
        scholarUrl: row.scholar_url ?? "",
        orcidUrl: row.orcid_url ?? "",
        visibility: (row.visibility ?? "public") as ProfileVisibility,
        directoryOptOut: row.directory_opt_out ?? false,
        membershipGrade: (row.membership_grade ?? "member") as MembershipGrade,
      };
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8">
      <header className="space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Edit profile
        </h1>
        <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          Manage your basic profile fields. Membership grade is determined by
          peer review.
        </p>
      </header>

      {!supabase ? (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
          <p className="font-medium">Supabase is not configured.</p>
          <p className="mt-2 text-amber-800 dark:text-amber-200">
            Set <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to enable profiles.
          </p>
        </section>
      ) : !user ? (
        <section className="rounded-2xl border border-black/[.06] bg-white p-6 shadow-sm dark:border-white/[.08] dark:bg-zinc-950">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            You must be signed in to edit your profile.
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
        <div className="space-y-4">
          {profileLoadError ? (
            <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
              <p className="font-medium">Could not load your existing profile.</p>
              <p className="mt-2 text-amber-800 dark:text-amber-200">
                You may need to apply the expanded profile migration in Supabase.
              </p>
            </section>
          ) : null}

          <section className="rounded-2xl border border-black/[.06] bg-white p-6 shadow-sm dark:border-white/[.08] dark:bg-zinc-950">
            <AvatarUpload
              currentAvatarUrl={profileDefaults.avatarUrl}
              userId={user.id}
            />
          </section>

          <EditProfileFormExpanded
            userEmail={user.email ?? ""}
            userId={user.id}
            initialProfile={profileDefaults}
          />
        </div>
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
