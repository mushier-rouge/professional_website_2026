import { isMemberSlugMatch } from "./slug";

type MemberLike = {
  displayName: string;
};

export function findMemberBySlug<T extends MemberLike>(
  members: T[],
  slug: string,
): T | undefined {
  return members.find((member) => isMemberSlugMatch(member.displayName, slug));
}
