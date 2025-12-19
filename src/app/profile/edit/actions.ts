"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase/serverClient";

export type SaveProfileState =
  | { ok: true; message: string }
  | { ok: false; message: string };

export async function saveProfile(
  _prevState: SaveProfileState | undefined,
  formData: FormData,
): Promise<SaveProfileState> {
  const displayName = String(formData.get("displayName") ?? "").trim();
  const linkedinUrl = String(formData.get("linkedinUrl") ?? "").trim();
  const avatarUrl = String(formData.get("avatarUrl") ?? "").trim();

  if (!displayName) return { ok: false, message: "Display name is required." };

  const supabase = await createSupabaseServerClient();
  if (!supabase) return { ok: false, message: "Supabase is not configured." };

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { ok: false, message: "You must be signed in." };

  const { error } = await supabase.from("profiles").upsert(
    {
      user_id: userData.user.id,
      display_name: displayName,
      linkedin_url: linkedinUrl || null,
      avatar_url: avatarUrl || null,
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

