import { createSupabaseServerClient } from "@/lib/supabase/serverClient";

export type Permission =
  | "article:create"
  | "article:edit:own"
  | "article:edit:any"
  | "article:delete:own"
  | "article:delete:any"
  | "article:publish"
  | "article:unpublish"
  | "article:assign_reviewer"
  | "review:create"
  | "review:view:any"
  | "user:manage_roles"
  | "profile:view:private"
  | "profile:edit:any";

export type Role = "member" | "editor" | "admin" | "reviewer";

type PermissionCheckResult =
  | { ok: true }
  | { ok: false; reason: string };

/**
 * Check if the current user has a specific permission
 */
export async function hasPermission(
  permission: Permission
): Promise<boolean> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return false;

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return false;

  const { data, error } = await supabase.rpc("user_has_permission", {
    user_uuid: userData.user.id,
    permission_name: permission,
  });

  if (error) {
    console.error("Error checking permission:", error);
    return false;
  }

  return data === true;
}

/**
 * Check if the current user has a specific role
 */
export async function hasRole(role: Role): Promise<boolean> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return false;

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return false;

  const { data, error } = await supabase.rpc("get_user_roles", {
    user_uuid: userData.user.id,
  });

  if (error) {
    console.error("Error checking role:", error);
    return false;
  }

  type RoleResult = { role_name: string; role_description: string };
  return (data || []).some((r: RoleResult) => r.role_name === role);
}

/**
 * Get all roles for the current user
 */
export async function getUserRoles(): Promise<Role[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return [];

  const { data, error } = await supabase.rpc("get_user_roles", {
    user_uuid: userData.user.id,
  });

  if (error) {
    console.error("Error getting user roles:", error);
    return [];
  }

  type RoleResult = { role_name: string; role_description: string };
  return (data || []).map((r: RoleResult) => r.role_name as Role);
}

/**
 * Get all permissions for the current user
 */
export async function getUserPermissions(): Promise<Permission[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return [];

  const { data, error } = await supabase.rpc("get_user_permissions", {
    user_uuid: userData.user.id,
  });

  if (error) {
    console.error("Error getting user permissions:", error);
    return [];
  }

  type PermissionResult = { permission_name: string; permission_description: string };
  return (data || []).map((p: PermissionResult) => p.permission_name as Permission);
}

/**
 * Require a specific permission, throw error if not authorized
 */
export async function requirePermission(
  permission: Permission
): Promise<PermissionCheckResult> {
  const hasIt = await hasPermission(permission);

  if (!hasIt) {
    return {
      ok: false,
      reason: `You do not have permission: ${permission}`,
    };
  }

  return { ok: true };
}

/**
 * Check if user can edit a specific article
 */
export async function canEditArticle(
  articleAuthorId: string
): Promise<boolean> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return false;

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return false;

  // Can edit if: (1) they're the author and have edit:own OR (2) they have edit:any
  if (articleAuthorId === userData.user.id) {
    return await hasPermission("article:edit:own");
  }

  return await hasPermission("article:edit:any");
}

/**
 * Check if user can publish articles
 */
export async function canPublishArticle(): Promise<boolean> {
  return await hasPermission("article:publish");
}

/**
 * Check if user can assign reviewers
 */
export async function canAssignReviewer(): Promise<boolean> {
  return await hasPermission("article:assign_reviewer");
}
