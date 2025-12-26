"use client";

import { useState, useActionState } from "react";

import { MembershipGradeBadge } from "@/components/MembershipGradeBadge";
import type { MembershipGrade } from "@/lib/membership";
import type { ProfileVisibility } from "@/lib/profile/types";
import {
  MAX_DISPLAY_NAME_LENGTH,
  MAX_SHORT_BIO_LENGTH,
  MAX_BIO_LENGTH,
  MAX_TITLE_LENGTH,
  MAX_AFFILIATION_LENGTH,
  MAX_LOCATION_LENGTH,
} from "@/lib/profile/validation";

import type { SaveProfileState } from "../actions";
import { saveProfileExpanded } from "../actions";

const initialState: SaveProfileState = { ok: false, message: "" };

export type ExpandedProfileDefaults = {
  displayName: string;
  title: string;
  affiliation: string;
  location: string;
  shortBio: string;
  bio: string;
  avatarUrl: string;
  linkedinUrl: string;
  websiteUrl: string;
  githubUrl: string;
  scholarUrl: string;
  orcidUrl: string;
  visibility: ProfileVisibility;
  directoryOptOut: boolean;
  membershipGrade: MembershipGrade;
};

export function EditProfileFormExpanded({
  userEmail,
  userId,
  initialProfile,
}: {
  userEmail: string;
  userId: string;
  initialProfile: ExpandedProfileDefaults;
}) {
  const [state, formAction, isPending] = useActionState(saveProfileExpanded, initialState);
  const [shortBio, setShortBio] = useState(initialProfile.shortBio);
  const [bio, setBio] = useState(initialProfile.bio);

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-black/[.06] bg-white p-6 shadow-sm dark:border-white/[.08] dark:bg-zinc-950">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
              Public Profile
            </h2>
            <MembershipGradeBadge grade={initialProfile.membershipGrade} />
          </div>
          <span className="text-xs text-zinc-500">
            Signed in as {userEmail || "(unknown)"}
          </span>
        </div>

        <form action={formAction} className="mt-6 space-y-6">
          <input type="hidden" name="userId" value={userId} />

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Basic Information
            </h3>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                Display name <span className="text-red-500">*</span>
              </label>
              <input
                name="displayName"
                required
                maxLength={MAX_DISPLAY_NAME_LENGTH}
                defaultValue={initialProfile.displayName}
                className="w-full rounded-lg border border-black/[.08] bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-white/[.12] dark:bg-black dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600"
                placeholder="Ada Lovelace"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                Title
              </label>
              <input
                name="title"
                maxLength={MAX_TITLE_LENGTH}
                defaultValue={initialProfile.title}
                className="w-full rounded-lg border border-black/[.08] bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-white/[.12] dark:bg-black dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600"
                placeholder="Research Scientist"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                Affiliation
              </label>
              <input
                name="affiliation"
                maxLength={MAX_AFFILIATION_LENGTH}
                defaultValue={initialProfile.affiliation}
                className="w-full rounded-lg border border-black/[.08] bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-white/[.12] dark:bg-black dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600"
                placeholder="University of Cambridge"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                Location
              </label>
              <input
                name="location"
                maxLength={MAX_LOCATION_LENGTH}
                defaultValue={initialProfile.location}
                className="w-full rounded-lg border border-black/[.08] bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-white/[.12] dark:bg-black dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600"
                placeholder="London, UK"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              About
            </h3>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                  Short bio
                </label>
                <span className="text-xs text-zinc-500">
                  {shortBio.length}/{MAX_SHORT_BIO_LENGTH}
                </span>
              </div>
              <textarea
                name="shortBio"
                maxLength={MAX_SHORT_BIO_LENGTH}
                value={shortBio}
                onChange={(e) => setShortBio(e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-black/[.08] bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-white/[.12] dark:bg-black dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600"
                placeholder="A brief description shown in directory listings..."
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                  Full bio
                </label>
                <span className="text-xs text-zinc-500">
                  {bio.length}/{MAX_BIO_LENGTH}
                </span>
              </div>
              <textarea
                name="bio"
                maxLength={MAX_BIO_LENGTH}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={6}
                className="w-full rounded-lg border border-black/[.08] bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-white/[.12] dark:bg-black dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600"
                placeholder="Your research interests, experience, and background..."
              />
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Links
            </h3>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                Avatar URL
              </label>
              <input
                name="avatarUrl"
                type="url"
                defaultValue={initialProfile.avatarUrl}
                className="w-full rounded-lg border border-black/[.08] bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-white/[.12] dark:bg-black dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600"
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                Website
              </label>
              <input
                name="websiteUrl"
                type="url"
                defaultValue={initialProfile.websiteUrl}
                className="w-full rounded-lg border border-black/[.08] bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-white/[.12] dark:bg-black dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600"
                placeholder="https://yoursite.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                LinkedIn
              </label>
              <input
                name="linkedinUrl"
                type="url"
                defaultValue={initialProfile.linkedinUrl}
                className="w-full rounded-lg border border-black/[.08] bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-white/[.12] dark:bg-black dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600"
                placeholder="https://linkedin.com/in/..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                GitHub
              </label>
              <input
                name="githubUrl"
                type="url"
                defaultValue={initialProfile.githubUrl}
                className="w-full rounded-lg border border-black/[.08] bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-white/[.12] dark:bg-black dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600"
                placeholder="https://github.com/..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                Google Scholar
              </label>
              <input
                name="scholarUrl"
                type="url"
                defaultValue={initialProfile.scholarUrl}
                className="w-full rounded-lg border border-black/[.08] bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-white/[.12] dark:bg-black dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600"
                placeholder="https://scholar.google.com/..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                ORCID
              </label>
              <input
                name="orcidUrl"
                type="url"
                defaultValue={initialProfile.orcidUrl}
                className="w-full rounded-lg border border-black/[.08] bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-white/[.12] dark:bg-black dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600"
                placeholder="https://orcid.org/..."
              />
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Privacy
            </h3>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                Profile visibility
              </label>
              <select
                name="visibility"
                defaultValue={initialProfile.visibility}
                className="w-full rounded-lg border border-black/[.08] bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm outline-none focus:border-zinc-400 dark:border-white/[.12] dark:bg-black dark:text-zinc-50 dark:focus:border-zinc-600"
              >
                <option value="public">Public - Visible to everyone</option>
                <option value="unlisted">Unlisted - Only via direct link</option>
                <option value="private">Private - Only visible to you</option>
              </select>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                name="directoryOptOut"
                id="directoryOptOut"
                defaultChecked={initialProfile.directoryOptOut}
                className="mt-0.5 h-4 w-4 rounded border-black/[.08] text-zinc-950 focus:ring-2 focus:ring-zinc-400 dark:border-white/[.12] dark:bg-zinc-950 dark:focus:ring-zinc-600"
              />
              <div>
                <label
                  htmlFor="directoryOptOut"
                  className="text-sm font-medium text-zinc-950 dark:text-zinc-50"
                >
                  Opt out of member directory
                </label>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  Hide your profile from the public member directory listing
                </p>
              </div>
            </div>
          </div>

          {/* Status Message */}
          {state.message ? (
            <div
              className={[
                "rounded-lg border px-3 py-2 text-sm",
                state.ok
                  ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-100"
                  : "border-red-200 bg-red-50 text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100",
              ].join(" ")}
            >
              {state.message}
            </div>
          ) : null}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="flex h-11 w-full items-center justify-center rounded-lg bg-zinc-950 px-4 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-60 dark:bg-white dark:text-black"
          >
            {isPending ? "Saving..." : "Save profile"}
          </button>
        </form>
      </div>
    </section>
  );
}
