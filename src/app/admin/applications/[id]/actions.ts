"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { hasRole } from "@/lib/rbac/permissions";

export type ApplicationActionState =
  | { ok: true; message: string }
  | { ok: false; message: string };

export async function moveToReview(
  applicationId: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _prevState: ApplicationActionState | undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _formData: FormData
): Promise<ApplicationActionState> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { ok: false, message: "Supabase is not configured." };
  }

  const isAdmin = await hasRole("admin");
  if (!isAdmin) {
    return { ok: false, message: "You do not have permission to review applications." };
  }

  const { error } = await supabase
    .from("membership_applications")
    .update({ status: "under_review" })
    .eq("id", applicationId)
    .eq("status", "submitted");

  if (error) {
    return { ok: false, message: "Failed to update application status." };
  }

  revalidatePath(`/admin/applications/${applicationId}`);
  revalidatePath("/admin/applications");

  return { ok: true, message: "Application moved to review." };
}

export async function approveApplication(
  applicationId: string,
  reviewerId: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _prevState: ApplicationActionState | undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _formData: FormData
): Promise<ApplicationActionState> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { ok: false, message: "Supabase is not configured." };
  }

  const isAdmin = await hasRole("admin");
  if (!isAdmin) {
    return { ok: false, message: "You do not have permission to approve applications." };
  }

  // Call the approval function from the database
  const { data, error } = await supabase.rpc("approve_membership_application", {
    application_uuid: applicationId,
    reviewer_uuid: reviewerId,
  });

  if (error || !data || typeof data === "object" && "ok" in data && !data.ok) {
    return {
      ok: false,
      message: data && typeof data === "object" && "message" in data
        ? String(data.message)
        : "Failed to approve application.",
    };
  }

  revalidatePath(`/admin/applications/${applicationId}`);
  revalidatePath("/admin/applications");

  return { ok: true, message: "Application approved and membership grade upgraded!" };
}

export async function rejectApplication(
  applicationId: string,
  reviewerId: string,
  formData: FormData
): Promise<ApplicationActionState> {
  const notes = String(formData.get("notes") ?? "");

  if (!notes.trim()) {
    return { ok: false, message: "Rejection notes are required." };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { ok: false, message: "Supabase is not configured." };
  }

  const isAdmin = await hasRole("admin");
  if (!isAdmin) {
    return { ok: false, message: "You do not have permission to reject applications." };
  }

  // Call the rejection function from the database
  const { data, error } = await supabase.rpc("reject_membership_application", {
    application_uuid: applicationId,
    reviewer_uuid: reviewerId,
    notes,
  });

  if (error || !data || typeof data === "object" && "ok" in data && !data.ok) {
    return {
      ok: false,
      message: data && typeof data === "object" && "message" in data
        ? String(data.message)
        : "Failed to reject application.",
    };
  }

  revalidatePath(`/admin/applications/${applicationId}`);
  revalidatePath("/admin/applications");

  return { ok: true, message: "Application rejected." };
}
