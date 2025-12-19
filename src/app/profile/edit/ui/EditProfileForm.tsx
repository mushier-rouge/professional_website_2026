"use client";

import { useActionState } from "react";

import { MembershipGradeBadge } from "@/components/MembershipGradeBadge";
import type { MembershipGrade } from "@/lib/membership";

import type { SaveProfileState } from "../actions";
import { saveProfile } from "../actions";

const initialState: SaveProfileState = { ok: false, message: "" };

export type EditProfileDefaults = {
  displayName: string;
  linkedinUrl: string;
  avatarUrl: string;
  membershipGrade: MembershipGrade;
};

export function EditProfileForm({
  userEmail,
  userId,
  initialProfile,
}: {
  userEmail: string;
  userId: string;
  initialProfile: EditProfileDefaults;
}) {
  const [state, formAction, isPending] = useActionState(saveProfile, initialState);

  return (
    <section className="rounded-2xl border border-black/[.06] bg-white p-6 shadow-sm dark:border-white/[.08] dark:bg-zinc-950">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
            Profile fields
          </h2>
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-500">
            <span>Current grade</span>
            <MembershipGradeBadge grade={initialProfile.membershipGrade} />
          </div>
        </div>
        <span className="text-xs text-zinc-500 dark:text-zinc-500">
          Signed in as {userEmail || "(unknown)"}
        </span>
      </div>

      <form action={formAction} className="mt-5 space-y-4">
        <input type="hidden" name="userId" value={userId} />

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
            Display name
          </label>
          <input
            name="displayName"
            required
            defaultValue={initialProfile.displayName}
            className="w-full rounded-lg border border-black/[.08] bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-white/[.12] dark:bg-black dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600"
            placeholder="Your name"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
            LinkedIn URL
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
            Avatar URL
          </label>
          <input
            name="avatarUrl"
            type="url"
            defaultValue={initialProfile.avatarUrl}
            className="w-full rounded-lg border border-black/[.08] bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-white/[.12] dark:bg-black dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600"
            placeholder="https://..."
          />
          <p className="text-xs text-zinc-500 dark:text-zinc-500">
            (Optional) Used for your public profile card.
          </p>
        </div>

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

        <button
          type="submit"
          disabled={isPending}
          className="flex h-11 w-full items-center justify-center rounded-lg bg-zinc-950 px-4 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-60 dark:bg-white dark:text-black"
        >
          {isPending ? "Saving..." : "Save profile"}
        </button>
      </form>
    </section>
  );
}
