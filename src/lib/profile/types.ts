export type ProfileVisibility = "public" | "unlisted" | "private";

export type ExpertiseTag = {
  id: string;
  name: string;
  slug: string;
};

export type FullProfile = {
  userId: string;
  createdAt: string;
  updatedAt: string;
  displayName: string;
  title?: string;
  affiliation?: string;
  location?: string;
  shortBio?: string;
  bio?: string;
  avatarUrl?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  githubUrl?: string;
  scholarUrl?: string;
  orcidUrl?: string;
  membershipGrade: "member" | "senior" | "fellow";
  visibility: ProfileVisibility;
  directoryOptOut: boolean;
  emailVerified: boolean;
  expertiseTags?: ExpertiseTag[];
};

export type ProfileFormData = {
  displayName: string;
  title: string;
  affiliation: string;
  location: string;
  shortBio: string;
  bio: string;
  avatarUrl: string;
  linkedinUrl: string;
  websiteUrl: string;
  githubUrl: string;
  scholarUrl: string;
  orcidUrl: string;
  visibility: ProfileVisibility;
  directoryOptOut: boolean;
  expertiseTagIds: string[];
};
