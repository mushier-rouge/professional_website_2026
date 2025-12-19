export function toMemberSlug(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function isMemberSlugMatch(name: string, slug: string): boolean {
  return toMemberSlug(name) === slug;
}
