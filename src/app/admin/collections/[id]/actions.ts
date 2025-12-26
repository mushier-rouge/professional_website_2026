"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { hasRole } from "@/lib/rbac/permissions";

export type CollectionActionState =
  | { ok: true; message: string; id?: string }
  | { ok: false; message: string };

export async function updateCollection(
  collectionId: string,
   
  _prevState: CollectionActionState | undefined,
  formData: FormData
): Promise<CollectionActionState> {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const coverImageUrl = String(formData.get("coverImageUrl") ?? "").trim();

  if (!title) {
    return { ok: false, message: "Title is required." };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { ok: false, message: "Supabase is not configured." };
  }

  const isEditor = await hasRole("editor");
  const isAdmin = await hasRole("admin");

  if (!isEditor && !isAdmin) {
    return { ok: false, message: "You do not have permission to update collections." };
  }

  const { error } = await supabase
    .from("collections")
    .update({
      title,
      description: description || null,
      cover_image_url: coverImageUrl || null,
    })
    .eq("id", collectionId);

  if (error) {
    return { ok: false, message: "Failed to update collection." };
  }

  revalidatePath(`/admin/collections/${collectionId}`);
  revalidatePath("/admin/collections");
  revalidatePath("/collections");

  return { ok: true, message: "Collection updated successfully!" };
}

export async function publishCollection(
  collectionId: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _prevState: CollectionActionState | undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _formData: FormData
): Promise<CollectionActionState> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { ok: false, message: "Supabase is not configured." };
  }

  const isEditor = await hasRole("editor");
  const isAdmin = await hasRole("admin");

  if (!isEditor && !isAdmin) {
    return { ok: false, message: "You do not have permission to publish collections." };
  }

  // Get current status
  const { data: collection } = await supabase
    .from("collections")
    .select("is_published")
    .eq("id", collectionId)
    .single();

  if (!collection) {
    return { ok: false, message: "Collection not found." };
  }

  const newStatus = !collection.is_published;

  const { error } = await supabase
    .from("collections")
    .update({
      is_published: newStatus,
      published_at: newStatus ? new Date().toISOString() : null,
    })
    .eq("id", collectionId);

  if (error) {
    return { ok: false, message: "Failed to update publication status." };
  }

  revalidatePath(`/admin/collections/${collectionId}`);
  revalidatePath("/admin/collections");
  revalidatePath("/collections");

  return {
    ok: true,
    message: newStatus
      ? "Collection published successfully!"
      : "Collection unpublished successfully!",
  };
}

export async function deleteCollection(
  collectionId: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _prevState: CollectionActionState | undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _formData: FormData
): Promise<CollectionActionState> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { ok: false, message: "Supabase is not configured." };
  }

  const isEditor = await hasRole("editor");
  const isAdmin = await hasRole("admin");

  if (!isEditor && !isAdmin) {
    return { ok: false, message: "You do not have permission to delete collections." };
  }

  const { error } = await supabase.from("collections").delete().eq("id", collectionId);

  if (error) {
    return { ok: false, message: "Failed to delete collection." };
  }

  revalidatePath("/admin/collections");
  revalidatePath("/collections");
  redirect("/admin/collections");
}

export async function addArticle(
  collectionId: string,
   
  _prevState: CollectionActionState | undefined,
  formData: FormData
): Promise<CollectionActionState> {
  const articleId = String(formData.get("articleId") ?? "");

  if (!articleId) {
    return { ok: false, message: "Please select an article." };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { ok: false, message: "Supabase is not configured." };
  }

  const isEditor = await hasRole("editor");
  const isAdmin = await hasRole("admin");

  if (!isEditor && !isAdmin) {
    return { ok: false, message: "You do not have permission to modify collections." };
  }

  // Get current max position
  const { data: maxPos } = await supabase
    .from("collection_articles")
    .select("position")
    .eq("collection_id", collectionId)
    .order("position", { ascending: false })
    .limit(1)
    .single();

  const position = (maxPos?.position ?? -1) + 1;

  const { error } = await supabase.from("collection_articles").insert({
    collection_id: collectionId,
    article_id: articleId,
    position,
  });

  if (error) {
    return { ok: false, message: "Failed to add article to collection." };
  }

  revalidatePath(`/admin/collections/${collectionId}`);
  revalidatePath(`/collections`);

  return { ok: true, message: "Article added successfully!" };
}

export async function removeArticle(
  collectionId: string,
   
  _prevState: CollectionActionState | undefined,
  formData: FormData
): Promise<CollectionActionState> {
  const collectionArticleId = String(formData.get("collectionArticleId") ?? "");

  if (!collectionArticleId) {
    return { ok: false, message: "Invalid article ID." };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { ok: false, message: "Supabase is not configured." };
  }

  const isEditor = await hasRole("editor");
  const isAdmin = await hasRole("admin");

  if (!isEditor && !isAdmin) {
    return { ok: false, message: "You do not have permission to modify collections." };
  }

  const { error } = await supabase
    .from("collection_articles")
    .delete()
    .eq("id", collectionArticleId);

  if (error) {
    return { ok: false, message: "Failed to remove article from collection." };
  }

  revalidatePath(`/admin/collections/${collectionId}`);
  revalidatePath(`/collections`);

  return { ok: true, message: "Article removed successfully!" };
}

export async function reorderArticles(
  collectionId: string,
   
  _prevState: CollectionActionState | undefined,
  formData: FormData
): Promise<CollectionActionState> {
  const orderJson = String(formData.get("order") ?? "");

  let order: string[];
  try {
    order = JSON.parse(orderJson);
  } catch {
    return { ok: false, message: "Invalid order data." };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { ok: false, message: "Supabase is not configured." };
  }

  const isEditor = await hasRole("editor");
  const isAdmin = await hasRole("admin");

  if (!isEditor && !isAdmin) {
    return { ok: false, message: "You do not have permission to modify collections." };
  }

  // Update positions
  for (let i = 0; i < order.length; i++) {
    await supabase
      .from("collection_articles")
      .update({ position: i })
      .eq("id", order[i]);
  }

  revalidatePath(`/admin/collections/${collectionId}`);
  revalidatePath(`/collections`);

  return { ok: true, message: "Articles reordered successfully!" };
}
