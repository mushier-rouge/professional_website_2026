"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { hasRole } from "@/lib/rbac/permissions";

export type TopicActionState =
  | { ok: true; message: string }
  | { ok: false; message: string };

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function addTopic(
   
  _prevState: TopicActionState | undefined,
  formData: FormData
): Promise<TopicActionState> {
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const color = String(formData.get("color") ?? "").trim();

  if (!name) {
    return { ok: false, message: "Topic name is required." };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { ok: false, message: "Supabase is not configured." };
  }

  const isAdmin = await hasRole("admin");
  if (!isAdmin) {
    return { ok: false, message: "You do not have permission to add topics." };
  }

  const slug = generateSlug(name);

  // Check if slug already exists
  const { data: existing } = await supabase
    .from("topics")
    .select("id")
    .eq("slug", slug)
    .single();

  if (existing) {
    return { ok: false, message: `A topic with slug "${slug}" already exists.` };
  }

  const { error } = await supabase.from("topics").insert({
    name,
    slug,
    description: description || null,
    color: color || null,
  });

  if (error) {
    return { ok: false, message: "Failed to add topic." };
  }

  revalidatePath("/admin/topics");

  return { ok: true, message: `Topic "${name}" added successfully!` };
}

export async function updateTopic(formData: FormData): Promise<TopicActionState> {
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const color = String(formData.get("color") ?? "").trim();

  if (!id || !name) {
    return { ok: false, message: "Topic ID and name are required." };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { ok: false, message: "Supabase is not configured." };
  }

  const isAdmin = await hasRole("admin");
  if (!isAdmin) {
    return { ok: false, message: "You do not have permission to update topics." };
  }

  const slug = generateSlug(name);

  // Check if slug already exists for a different topic
  const { data: existing } = await supabase
    .from("topics")
    .select("id")
    .eq("slug", slug)
    .neq("id", id)
    .single();

  if (existing) {
    return { ok: false, message: `Another topic with slug "${slug}" already exists.` };
  }

  const { error } = await supabase
    .from("topics")
    .update({
      name,
      slug,
      description: description || null,
      color: color || null,
    })
    .eq("id", id);

  if (error) {
    return { ok: false, message: "Failed to update topic." };
  }

  revalidatePath("/admin/topics");

  return { ok: true, message: "Topic updated successfully!" };
}

export async function deleteTopic(formData: FormData): Promise<TopicActionState> {
  const id = String(formData.get("id") ?? "");

  if (!id) {
    return { ok: false, message: "Topic ID is required." };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { ok: false, message: "Supabase is not configured." };
  }

  const isAdmin = await hasRole("admin");
  if (!isAdmin) {
    return { ok: false, message: "You do not have permission to delete topics." };
  }

  const { error } = await supabase.from("topics").delete().eq("id", id);

  if (error) {
    return { ok: false, message: "Failed to delete topic." };
  }

  revalidatePath("/admin/topics");

  return { ok: true, message: "Topic deleted successfully!" };
}
