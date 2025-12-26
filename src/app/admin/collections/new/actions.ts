"use server";

import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { hasRole } from "@/lib/rbac/permissions";

export type CollectionActionState =
  | { ok: true; message: string; id?: string }
  | { ok: false; message: string };

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createCollection(
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

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return { ok: false, message: "You must be signed in." };
  }

  const isEditor = await hasRole("editor");
  const isAdmin = await hasRole("admin");

  if (!isEditor && !isAdmin) {
    return { ok: false, message: "You do not have permission to create collections." };
  }

  const slug = generateSlug(title);

  // Check if slug already exists
  const { data: existing } = await supabase
    .from("collections")
    .select("id")
    .eq("slug", slug)
    .single();

  if (existing) {
    return { ok: false, message: `A collection with slug "${slug}" already exists.` };
  }

  const { data, error } = await supabase
    .from("collections")
    .insert({
      title,
      slug,
      description: description || null,
      cover_image_url: coverImageUrl || null,
      created_by: userData.user.id,
      is_published: false,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { ok: false, message: "Failed to create collection." };
  }

  return { ok: true, message: "Collection created successfully!", id: data.id };
}
