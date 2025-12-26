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
  const targetGrade = String(formData.get("targetGrade") ?? "");
  const statement = String(formData.get("statement") ?? "");
  const achievements = String(formData.get("achievements") ?? "");
  const publications = String(formData.get("publications") ?? "");
  const contributions = String(formData.get("contributions") ?? "");

  if (targetGrade !== "senior" && targetGrade !== "fellow") {
    return { ok: false, message: "Select Senior Member or Fellow." };
  }

  if (!statement.trim()) {
    return { ok: false, message: "Personal statement is required." };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { ok: false, message: "Supabase is not configured." };
  }

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return { ok: false, message: "You must be signed in to apply." };
  }

  // Check if user already has a pending or approved application for this grade
  const { data: existingApp } = await supabase
    .from("membership_applications")
    .select("id, status, target_grade")
    .eq("user_id", userData.user.id)
    .in("status", ["draft", "submitted", "under_review", "approved"])
    .single();

  if (existingApp) {
    if (existingApp.status === "approved") {
      return { ok: false, message: "You already have an approved application." };
    }
    if (existingApp.target_grade === targetGrade) {
      return {
        ok: false,
        message: `You already have a ${existingApp.status} application for ${targetGrade}.`
      };
    }
  }

  const { error } = await supabase.from("membership_applications").insert({
    user_id: userData.user.id,
    target_grade: targetGrade as MembershipGrade,
    statement,
    achievements: achievements.trim() || null,
    publications: publications.trim() || null,
    contributions: contributions.trim() || null,
    status: "submitted",
    submitted_at: new Date().toISOString(),
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

  return { ok: true, message: "Application submitted successfully! You will be notified when it is reviewed." };
}

