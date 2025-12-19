"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import type { MembershipGrade } from "@/lib/membership";

export type ApplyState =
  | { ok: true; message: string }
  | { ok: false; message: string };

export async function applyForMembershipUpgrade(
  _prevState: ApplyState | undefined,
  formData: FormData,
): Promise<ApplyState> {
  const requestedGrade = String(formData.get("requestedGrade") ?? "");
  const evidence = String(formData.get("evidence") ?? "");
  const links = String(formData.get("links") ?? "");

  if (requestedGrade !== "senior" && requestedGrade !== "fellow") {
    return { ok: false, message: "Select Senior Member or Fellow." };
  }

  if (!evidence.trim()) {
    return { ok: false, message: "Evidence is required." };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { ok: false, message: "Supabase is not configured." };
  }

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return { ok: false, message: "You must be signed in to apply." };
  }

  const { error } = await supabase.from("membership_applications").insert({
    user_id: userData.user.id,
    requested_grade: requestedGrade as MembershipGrade,
    evidence,
    links,
  });

  if (error) {
    return {
      ok: false,
      message:
        "Submission failed. Ensure the Supabase schema is applied and RLS policies permit inserts.",
    };
  }

  revalidatePath("/membership/apply");
  revalidatePath("/account");

  return { ok: true, message: "Application submitted." };
}

