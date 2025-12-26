"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { hasPermission } from "@/lib/rbac/permissions";

export type ReviewerActionState =
  | { ok: true; message: string }
  | { ok: false; message: string };

/**
 * Assign a reviewer to an article
 */
export async function assignReviewer(
  articleId: string,
  reviewerId: string
): Promise<ReviewerActionState> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { ok: false, message: "Supabase is not configured." };
  }

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return { ok: false, message: "You must be signed in." };
  }

  // Check permission
  if (!(await hasPermission("article:assign_reviewer"))) {
    return {
      ok: false,
      message: "You do not have permission to assign reviewers.",
    };
  }

  // Check if reviewer can be assigned
  const { data: canAssign, error: checkError } = await supabase.rpc(
    "can_assign_reviewer",
    {
      article_uuid: articleId,
      reviewer_uuid: reviewerId,
    }
  );

  if (checkError) {
    return {
      ok: false,
      message: "Error checking reviewer eligibility: " + checkError.message,
    };
  }

  if (!canAssign) {
    return {
      ok: false,
      message:
        "This reviewer cannot be assigned (may be the author or already assigned).",
    };
  }

  // Create review assignment
  const { error: insertError } = await supabase.from("reviews").insert({
    article_id: articleId,
    reviewer_id: reviewerId,
    assigned_by: userData.user.id,
    status: "pending",
  });

  if (insertError) {
    return {
      ok: false,
      message: "Failed to assign reviewer: " + insertError.message,
    };
  }

  revalidatePath(`/editor/review/${articleId}`);
  revalidatePath("/editor");

  return {
    ok: true,
    message: "Reviewer assigned successfully.",
  };
}

/**
 * Remove a reviewer assignment
 */
export async function removeReviewer(
  reviewId: string,
  articleId: string
): Promise<ReviewerActionState> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { ok: false, message: "Supabase is not configured." };
  }

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return { ok: false, message: "You must be signed in." };
  }

  // Check permission
  if (!(await hasPermission("article:assign_reviewer"))) {
    return {
      ok: false,
      message: "You do not have permission to remove reviewers.",
    };
  }

  // Delete review assignment
  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("id", reviewId)
    .in("status", ["pending", "declined"]); // Only allow removal of pending/declined reviews

  if (error) {
    return {
      ok: false,
      message: "Failed to remove reviewer: " + error.message,
    };
  }

  revalidatePath(`/editor/review/${articleId}`);
  revalidatePath("/editor");

  return {
    ok: true,
    message: "Reviewer removed successfully.",
  };
}
