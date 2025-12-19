"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/serverClient";

export type CreateArticleState =
  | { ok: true; message: string }
  | { ok: false; message: string };

export type UpdateArticleState =
  | { ok: true; message: string }
  | { ok: false; message: string };

export type DeleteArticleState =
  | { ok: true; message: string }
  | { ok: false; message: string };

export async function createArticle(
  _prevState: CreateArticleState | undefined,
  formData: FormData,
): Promise<CreateArticleState> {
  const title = String(formData.get("title") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const externalUrl = String(formData.get("externalUrl") ?? "").trim();

  if (!title) return { ok: false, message: "Title is required." };

  const supabase = await createSupabaseServerClient();
  if (!supabase) return { ok: false, message: "Supabase is not configured." };

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { ok: false, message: "You must be signed in." };

  const { data, error } = await supabase
    .from("articles")
    .insert({
      author_user_id: userData.user.id,
      title,
      summary: summary || null,
      external_url: externalUrl || null,
    })
    .select("id")
    .single();

  if (error || !data) {
    return {
      ok: false,
      message:
        "Create failed. Ensure the Supabase schema is applied and RLS policies permit inserts.",
    };
  }

  revalidatePath("/articles");
  redirect(`/articles/${data.id}`);
}

export async function updateArticle(
  _prevState: UpdateArticleState | undefined,
  formData: FormData,
): Promise<UpdateArticleState> {
  const articleId = String(formData.get("articleId") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const externalUrl = String(formData.get("externalUrl") ?? "").trim();

  if (!articleId) return { ok: false, message: "Missing article id." };
  if (!title) return { ok: false, message: "Title is required." };

  const supabase = await createSupabaseServerClient();
  if (!supabase) return { ok: false, message: "Supabase is not configured." };

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { ok: false, message: "You must be signed in." };

  const { data, error } = await supabase
    .from("articles")
    .update({
      title,
      summary: summary || null,
      external_url: externalUrl || null,
    })
    .eq("id", articleId)
    .eq("author_user_id", userData.user.id)
    .select("id");

  if (error) {
    return {
      ok: false,
      message:
        "Update failed. Ensure the Supabase schema is applied and RLS policies permit updates.",
    };
  }

  if (!data || data.length === 0) {
    return { ok: false, message: "Article not found (or you are not the author)." };
  }

  revalidatePath("/articles");
  revalidatePath(`/articles/${articleId}`);
  redirect(`/articles/${articleId}`);
}

export async function deleteArticle(
  _prevState: DeleteArticleState | undefined,
  formData: FormData,
): Promise<DeleteArticleState> {
  const articleId = String(formData.get("articleId") ?? "").trim();

  if (!articleId) return { ok: false, message: "Missing article id." };

  const supabase = await createSupabaseServerClient();
  if (!supabase) return { ok: false, message: "Supabase is not configured." };

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { ok: false, message: "You must be signed in." };

  const { data, error } = await supabase
    .from("articles")
    .delete()
    .eq("id", articleId)
    .eq("author_user_id", userData.user.id)
    .select("id");

  if (error) {
    return {
      ok: false,
      message:
        "Delete failed. Ensure the Supabase schema is applied and a delete policy exists for articles.",
    };
  }

  if (!data || data.length === 0) {
    return { ok: false, message: "Article not found (or you are not the author)." };
  }

  revalidatePath("/articles");
  redirect("/articles");
}
