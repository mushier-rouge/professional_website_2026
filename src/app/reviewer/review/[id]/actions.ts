"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { hasRole } from "@/lib/rbac/permissions";

export type ReviewActionState =
  | { ok: true; message: string }
  | { ok: false; message: string };

export async function submitReview(
  reviewId: string,
   
  _prevState: ReviewActionState | undefined,
  formData: FormData
): Promise<ReviewActionState> {
  const recommendation = String(formData.get("recommendation") ?? "");
  const summary = String(formData.get("summary") ?? "");
  const strengths = String(formData.get("strengths") ?? "");
  const weaknesses = String(formData.get("weaknesses") ?? "");
  const detailedComments = String(formData.get("detailedComments") ?? "");
  const confidentialComments = String(formData.get("confidentialComments") ?? "");

  const validRecommendations = [
    "accept",
    "accept_with_minor_revisions",
    "major_revisions_required",
    "reject",
  ];

  if (!validRecommendations.includes(recommendation)) {
    return { ok: false, message: "Invalid recommendation." };
  }

  if (!summary.trim()) {
    return { ok: false, message: "Summary is required." };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { ok: false, message: "Supabase is not configured." };
  }

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return { ok: false, message: "You must be signed in." };
  }

  const isReviewer = await hasRole("reviewer");
  const isEditor = await hasRole("editor");
  const isAdmin = await hasRole("admin");

  if (!isReviewer && !isEditor && !isAdmin) {
    return { ok: false, message: "You do not have permission to submit reviews." };
  }

  // Verify this review belongs to the user
  const { data: reviewData } = await supabase
    .from("reviews")
    .select("reviewer_id, status")
    .eq("id", reviewId)
    .single();

  if (!reviewData) {
    return { ok: false, message: "Review not found." };
  }

  if (reviewData.reviewer_id !== userData.user.id && !isEditor && !isAdmin) {
    return { ok: false, message: "This review is not assigned to you." };
  }

  if (!["pending", "in_progress"].includes(reviewData.status)) {
    return { ok: false, message: "This review has already been submitted or declined." };
  }

  const { error } = await supabase
    .from("reviews")
    .update({
      status: "completed",
      recommendation,
      summary,
      strengths: strengths.trim() || null,
      weaknesses: weaknesses.trim() || null,
      detailed_comments: detailedComments.trim() || null,
      confidential_comments: confidentialComments.trim() || null,
      submitted_at: new Date().toISOString(),
    })
    .eq("id", reviewId);

  if (error) {
    return { ok: false, message: "Failed to submit review." };
  }

  revalidatePath(`/reviewer/review/${reviewId}`);
  revalidatePath("/reviewer");

  return { ok: true, message: "Review submitted successfully!" };
}

export async function declineReview(
  reviewId: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _prevState: ReviewActionState | undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _formData: FormData
): Promise<ReviewActionState> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { ok: false, message: "Supabase is not configured." };
  }

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return { ok: false, message: "You must be signed in." };
  }

  const isReviewer = await hasRole("reviewer");
  const isEditor = await hasRole("editor");
  const isAdmin = await hasRole("admin");

  if (!isReviewer && !isEditor && !isAdmin) {
    return { ok: false, message: "You do not have permission to decline reviews." };
  }

  // Verify this review belongs to the user
  const { data: reviewData } = await supabase
    .from("reviews")
    .select("reviewer_id, status")
    .eq("id", reviewId)
    .single();

  if (!reviewData) {
    return { ok: false, message: "Review not found." };
  }

  if (reviewData.reviewer_id !== userData.user.id && !isEditor && !isAdmin) {
    return { ok: false, message: "This review is not assigned to you." };
  }

  if (!["pending", "in_progress"].includes(reviewData.status)) {
    return { ok: false, message: "This review has already been submitted or declined." };
  }

  const { error } = await supabase
    .from("reviews")
    .update({ status: "declined" })
    .eq("id", reviewId);

  if (error) {
    return { ok: false, message: "Failed to decline review." };
  }

  revalidatePath(`/reviewer/review/${reviewId}`);
  revalidatePath("/reviewer");

  return { ok: true, message: "Review declined. The editor will be notified." };
}
