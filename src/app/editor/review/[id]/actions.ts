"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { hasPermission } from "@/lib/rbac/permissions";
import { canTransition, type ArticleStatus } from "@/lib/articles/workflow";

export type EditorActionState =
  | { ok: true; message: string }
  | { ok: false; message: string };

export async function changeArticleStatus(
  articleId: string,
  targetStatus: ArticleStatus,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _prevState: EditorActionState | undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _formData: FormData
): Promise<EditorActionState> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { ok: false, message: "Supabase is not configured." };
  }

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return { ok: false, message: "You must be signed in." };
  }

  // Check permissions based on target status
  const requiredPermission =
    targetStatus === "published" ? "article:publish" : "article:edit:any";

  if (!(await hasPermission(requiredPermission))) {
    return {
      ok: false,
      message: `You do not have permission to ${targetStatus === "published" ? "publish" : "edit"} articles.`,
    };
  }

  // Get current article
  const { data: currentArticle, error: fetchError } = await supabase
    .from("articles")
    .select("status")
    .eq("id", articleId)
    .single();

  if (fetchError || !currentArticle) {
    return { ok: false, message: "Article not found." };
  }

  const currentStatus = currentArticle.status as ArticleStatus;

  // Validate transition
  if (!canTransition(currentStatus, targetStatus)) {
    return {
      ok: false,
      message: `Cannot transition from ${currentStatus} to ${targetStatus}.`,
    };
  }

  // Update article status
  const { error: updateError } = await supabase
    .from("articles")
    .update({ status: targetStatus, updated_at: new Date().toISOString() })
    .eq("id", articleId);

  if (updateError) {
    return {
      ok: false,
      message: "Failed to update article status: " + updateError.message,
    };
  }

  revalidatePath("/editor");
  revalidatePath(`/editor/review/${articleId}`);
  revalidatePath("/articles");
  revalidatePath(`/articles/${articleId}`);

  return {
    ok: true,
    message: `Article status changed to ${targetStatus}.`,
  };
}
