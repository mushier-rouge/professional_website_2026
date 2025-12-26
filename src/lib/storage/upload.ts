import { createSupabaseServerClient } from "@/lib/supabase/serverClient";

export type UploadResult =
  | { ok: true; url: string; path: string }
  | { ok: false; error: string };

const MAX_AVATAR_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_ASSET_SIZE = 10 * 1024 * 1024; // 10MB

const ALLOWED_AVATAR_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ALLOWED_ASSET_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
];

/**
 * Upload an avatar image for a user
 */
export async function uploadAvatar(
  file: File,
  userId: string
): Promise<UploadResult> {
  // Validate file type
  if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
    return {
      ok: false,
      error: "Invalid file type. Only JPEG, PNG, and WebP images are allowed.",
    };
  }

  // Validate file size
  if (file.size > MAX_AVATAR_SIZE) {
    return {
      ok: false,
      error: "File too large. Maximum size is 5MB.",
    };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { ok: false, error: "Supabase is not configured." };
  }

  // Create a unique filename
  const fileExt = file.name.split(".").pop();
  const fileName = `${userId}/avatar.${fileExt}`;

  // Upload to storage
  const { error } = await supabase.storage
    .from("avatars")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) {
    return { ok: false, error: error.message };
  }

  // Get public URL
  const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);

  return {
    ok: true,
    url: data.publicUrl,
    path: fileName,
  };
}

/**
 * Delete an avatar image
 */
export async function deleteAvatar(userId: string): Promise<UploadResult> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { ok: false, error: "Supabase is not configured." };
  }

  // List all files in the user's avatar directory
  const { data: files, error: listError } = await supabase.storage
    .from("avatars")
    .list(userId);

  if (listError) {
    return { ok: false, error: listError.message };
  }

  if (!files || files.length === 0) {
    return { ok: true, url: "", path: "" };
  }

  // Delete all avatar files
  const filePaths = files.map((f) => `${userId}/${f.name}`);
  const { error } = await supabase.storage.from("avatars").remove(filePaths);

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true, url: "", path: "" };
}

/**
 * Upload an article asset
 */
export async function uploadArticleAsset(
  file: File,
  userId: string,
  articleId?: string
): Promise<UploadResult> {
  // Validate file type
  if (!ALLOWED_ASSET_TYPES.includes(file.type)) {
    return {
      ok: false,
      error:
        "Invalid file type. Only JPEG, PNG, WebP, GIF images and PDF files are allowed.",
    };
  }

  // Validate file size
  if (file.size > MAX_ASSET_SIZE) {
    return {
      ok: false,
      error: "File too large. Maximum size is 10MB.",
    };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { ok: false, error: "Supabase is not configured." };
  }

  // Create a unique filename
  const fileExt = file.name.split(".").pop();
  const timestamp = Date.now();
  const sanitizedName = file.name
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-z0-9-_]/gi, "-")
    .toLowerCase();

  const folder = articleId ? `${userId}/${articleId}` : `${userId}/drafts`;
  const fileName = `${folder}/${sanitizedName}-${timestamp}.${fileExt}`;

  // Upload to storage
  const { error } = await supabase.storage
    .from("article-assets")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    return { ok: false, error: error.message };
  }

  // Get public URL
  const { data } = supabase.storage.from("article-assets").getPublicUrl(fileName);

  return {
    ok: true,
    url: data.publicUrl,
    path: fileName,
  };
}

/**
 * Delete an article asset
 */
export async function deleteArticleAsset(path: string): Promise<UploadResult> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { ok: false, error: "Supabase is not configured." };
  }

  const { error } = await supabase.storage.from("article-assets").remove([path]);

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true, url: "", path: "" };
}

/**
 * Get the public URL for an avatar
 */
export async function getAvatarUrl(userId: string): Promise<string | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  // List files in user's avatar directory
  const { data: files } = await supabase.storage.from("avatars").list(userId);

  if (!files || files.length === 0) return null;

  // Get the first avatar file
  const avatarFile = files.find((f) => f.name.startsWith("avatar"));
  if (!avatarFile) return null;

  const { data } = supabase.storage
    .from("avatars")
    .getPublicUrl(`${userId}/${avatarFile.name}`);

  return data.publicUrl;
}
