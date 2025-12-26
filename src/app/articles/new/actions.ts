"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import type { ArticleStatus } from "@/lib/articles/workflow";
import { canTransition } from "@/lib/articles/workflow";

export type SaveArticleState =
  | { ok: true; message: string; articleId?: string }
  | { ok: false; message: string };

export async function saveArticle(
  _prevState: SaveArticleState | undefined,
  formData: FormData,
): Promise<SaveArticleState> {
  const title = String(formData.get("title") ?? "").trim();
  const abstract = String(formData.get("abstract") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const articleType = String(formData.get("articleType") ?? "research");
  const topicsRaw = String(formData.get("topics") ?? "");
  const action = String(formData.get("action") ?? "save_draft");

  // Parse topics
  const topics = topicsRaw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  // Generate slug from title
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  // Validation
  if (!title) {
    return { ok: false, message: "Title is required." };
  }

  if (!abstract) {
    return { ok: false, message: "Abstract is required." };
  }

  if (!content) {
    return { ok: false, message: "Content is required." };
  }

  if (abstract.length > 1000) {
    return { ok: false, message: "Abstract must be 1000 characters or fewer." };
  }

  // Determine target status based on action
  const targetStatus: ArticleStatus =
    action === "submit_review" ? "submitted" : "draft";

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { ok: false, message: "Supabase is not configured." };
  }

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return { ok: false, message: "You must be signed in." };
  }

  // Insert article
  const { data: article, error } = await supabase
    .from("articles")
    .insert({
      title,
      slug,
      abstract,
      content,
      article_type: articleType,
      topics,
      status: targetStatus,
      author_id: userData.user.id,
    })
    .select("id")
    .single();

  if (error) {
    return {
      ok: false,
      message: "Failed to create article. Error: " + error.message,
    };
  }

  revalidatePath("/articles");
  revalidatePath("/articles/new");

  if (targetStatus === "submitted") {
    return {
      ok: true,
      message: "Article submitted for review!",
      articleId: article.id,
    };
  }

  return {
    ok: true,
    message: "Draft saved successfully!",
    articleId: article.id,
  };
}

export async function updateArticle(
  articleId: string,
  _prevState: SaveArticleState | undefined,
  formData: FormData,
): Promise<SaveArticleState> {
  const title = String(formData.get("title") ?? "").trim();
  const abstract = String(formData.get("abstract") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const articleType = String(formData.get("articleType") ?? "research");
  const topicsRaw = String(formData.get("topics") ?? "");
  const action = String(formData.get("action") ?? "save_draft");

  const topics = topicsRaw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  if (!title || !abstract || !content) {
    return { ok: false, message: "Title, abstract, and content are required." };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { ok: false, message: "Supabase is not configured." };
  }

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return { ok: false, message: "You must be signed in." };
  }

  // Get current article to check status and ownership
  const { data: currentArticle, error: fetchError } = await supabase
    .from("articles")
    .select("status, author_id")
    .eq("id", articleId)
    .single();

  if (fetchError || !currentArticle) {
    return { ok: false, message: "Article not found." };
  }

  if (currentArticle.author_id !== userData.user.id) {
    return { ok: false, message: "You can only edit your own articles." };
  }

  // Determine target status
  const currentStatus = currentArticle.status as ArticleStatus;
  const targetStatus: ArticleStatus =
    action === "submit_review" ? "submitted" : currentStatus;

  // Validate transition
  if (targetStatus !== currentStatus) {
    if (!canTransition(currentStatus, targetStatus)) {
      return {
        ok: false,
        message: `Cannot transition from ${currentStatus} to ${targetStatus}.`,
      };
    }
  }

  // Update article
  const { error: updateError } = await supabase
    .from("articles")
    .update({
      title,
      slug,
      abstract,
      content,
      article_type: articleType,
      topics,
      status: targetStatus,
    })
    .eq("id", articleId);

  if (updateError) {
    return {
      ok: false,
      message: "Failed to update article. Error: " + updateError.message,
    };
  }

  revalidatePath("/articles");
  revalidatePath(`/articles/${articleId}`);
  revalidatePath(`/articles/${articleId}/edit`);

  return {
    ok: true,
    message:
      targetStatus === "submitted"
        ? "Article submitted for review!"
        : "Article updated successfully!",
    articleId,
  };
}
