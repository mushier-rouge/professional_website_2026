"use server";

import { revalidatePath } from "next/cache";

import { validateProfileInput } from "@/lib/profile/validation";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";

export type SaveProfileState =
  | { ok: true; message: string }
  | { ok: false; message: string };

export async function saveProfile(
  _prevState: SaveProfileState | undefined,
  formData: FormData,
): Promise<SaveProfileState> {
  const displayName = String(formData.get("displayName") ?? "");
  const linkedinUrl = String(formData.get("linkedinUrl") ?? "");
  const avatarUrl = String(formData.get("avatarUrl") ?? "");

  const validation = validateProfileInput({
    displayName,
    linkedinUrl,
    avatarUrl,
  });

  if (!validation.ok) return { ok: false, message: validation.message };

  const supabase = await createSupabaseServerClient();
  if (!supabase) return { ok: false, message: "Supabase is not configured." };

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { ok: false, message: "You must be signed in." };

  const { error } = await supabase.from("profiles").upsert(
    {
      user_id: userData.user.id,
      display_name: validation.data.displayName,
      linkedin_url: validation.data.linkedinUrl || null,
      avatar_url: validation.data.avatarUrl || null,
    },
    { onConflict: "user_id" },
  );

  if (error) {
    return {
      ok: false,
      message:
        "Save failed. Ensure the Supabase schema is applied and RLS policies permit upserts.",
    };
  }

  revalidatePath("/profile/edit");
  revalidatePath("/account");

  return { ok: true, message: "Profile saved." };
}

export async function saveProfileExpanded(
  _prevState: SaveProfileState | undefined,
  formData: FormData,
): Promise<SaveProfileState> {
  const displayName = String(formData.get("displayName") ?? "");
  const title = String(formData.get("title") ?? "");
  const affiliation = String(formData.get("affiliation") ?? "");
  const location = String(formData.get("location") ?? "");
  const shortBio = String(formData.get("shortBio") ?? "");
  const bio = String(formData.get("bio") ?? "");
  const avatarUrl = String(formData.get("avatarUrl") ?? "");
  const linkedinUrl = String(formData.get("linkedinUrl") ?? "");
  const websiteUrl = String(formData.get("websiteUrl") ?? "");
  const githubUrl = String(formData.get("githubUrl") ?? "");
  const scholarUrl = String(formData.get("scholarUrl") ?? "");
  const orcidUrl = String(formData.get("orcidUrl") ?? "");
  const visibility = String(formData.get("visibility") ?? "public");
  const directoryOptOut = formData.get("directoryOptOut") === "on";

  const validation = validateProfileInput({
    displayName,
    title,
    affiliation,
    location,
    shortBio,
    bio,
    avatarUrl,
    linkedinUrl,
    websiteUrl,
    githubUrl,
    scholarUrl,
    orcidUrl,
    visibility: visibility as "public" | "unlisted" | "private",
    directoryOptOut,
    expertiseTagIds: [],
  });

  if (!validation.ok) return { ok: false, message: validation.message };

  const supabase = await createSupabaseServerClient();
  if (!supabase) return { ok: false, message: "Supabase is not configured." };

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { ok: false, message: "You must be signed in." };

  const { error } = await supabase.from("profiles").upsert(
    {
      user_id: userData.user.id,
      display_name: validation.data.displayName,
      title: validation.data.title || null,
      affiliation: validation.data.affiliation || null,
      location: validation.data.location || null,
      short_bio: validation.data.shortBio || null,
      bio: validation.data.bio || null,
      avatar_url: validation.data.avatarUrl || null,
      linkedin_url: validation.data.linkedinUrl || null,
      website_url: validation.data.websiteUrl || null,
      github_url: validation.data.githubUrl || null,
      scholar_url: validation.data.scholarUrl || null,
      orcid_url: validation.data.orcidUrl || null,
      visibility: validation.data.visibility,
      directory_opt_out: validation.data.directoryOptOut,
    },
    { onConflict: "user_id" },
  );

  if (error) {
    return {
      ok: false,
      message:
        "Save failed. Ensure the expanded profile migration is applied. Error: " +
        error.message,
    };
  }

  revalidatePath("/profile/edit");
  revalidatePath("/account");
  revalidatePath("/members");

  return { ok: true, message: "Profile saved successfully!" };
}
