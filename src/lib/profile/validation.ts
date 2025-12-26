import type { ProfileFormData, ProfileVisibility } from "./types";

export type ProfileInput = Partial<ProfileFormData> & {
  displayName: string;
};

export type ValidatedProfileInput = {
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
  visibility: ProfileVisibility;
  directoryOptOut: boolean;
  expertiseTagIds: string[];
};

export type ProfileValidationResult =
  | { ok: true; data: ValidatedProfileInput }
  | { ok: false; message: string };

export const MAX_DISPLAY_NAME_LENGTH = 120;
export const MAX_SHORT_BIO_LENGTH = 280;
export const MAX_BIO_LENGTH = 5000;
export const MAX_TITLE_LENGTH = 200;
export const MAX_AFFILIATION_LENGTH = 200;
export const MAX_LOCATION_LENGTH = 100;

export function validateProfileInput(
  input: ProfileInput
): ProfileValidationResult {
  const displayName = input.displayName.trim();
  const title = (input.title || "").trim();
  const affiliation = (input.affiliation || "").trim();
  const location = (input.location || "").trim();
  const shortBio = (input.shortBio || "").trim();
  const bio = (input.bio || "").trim();
  const avatarUrl = (input.avatarUrl || "").trim();
  const linkedinUrl = (input.linkedinUrl || "").trim();
  const websiteUrl = (input.websiteUrl || "").trim();
  const githubUrl = (input.githubUrl || "").trim();
  const scholarUrl = (input.scholarUrl || "").trim();
  const orcidUrl = (input.orcidUrl || "").trim();
  const visibility = input.visibility || "public";
  const directoryOptOut = input.directoryOptOut || false;
  const expertiseTagIds = input.expertiseTagIds || [];

  // Required field validation
  if (!displayName) {
    return { ok: false, message: "Display name is required." };
  }

  // Length validations
  if (displayName.length > MAX_DISPLAY_NAME_LENGTH) {
    return {
      ok: false,
      message: `Display name must be ${MAX_DISPLAY_NAME_LENGTH} characters or fewer.`,
    };
  }

  if (title.length > MAX_TITLE_LENGTH) {
    return {
      ok: false,
      message: `Title must be ${MAX_TITLE_LENGTH} characters or fewer.`,
    };
  }

  if (affiliation.length > MAX_AFFILIATION_LENGTH) {
    return {
      ok: false,
      message: `Affiliation must be ${MAX_AFFILIATION_LENGTH} characters or fewer.`,
    };
  }

  if (location.length > MAX_LOCATION_LENGTH) {
    return {
      ok: false,
      message: `Location must be ${MAX_LOCATION_LENGTH} characters or fewer.`,
    };
  }

  if (shortBio.length > MAX_SHORT_BIO_LENGTH) {
    return {
      ok: false,
      message: `Short bio must be ${MAX_SHORT_BIO_LENGTH} characters or fewer.`,
    };
  }

  if (bio.length > MAX_BIO_LENGTH) {
    return {
      ok: false,
      message: `Bio must be ${MAX_BIO_LENGTH} characters or fewer.`,
    };
  }

  // URL validations
  const urlValidations = [
    { url: linkedinUrl, label: "LinkedIn URL" },
    { url: avatarUrl, label: "Avatar URL" },
    { url: websiteUrl, label: "Website URL" },
    { url: githubUrl, label: "GitHub URL" },
    { url: scholarUrl, label: "Google Scholar URL" },
    { url: orcidUrl, label: "ORCID URL" },
  ];

  for (const { url, label } of urlValidations) {
    const error = validateHttpsUrl(url, label);
    if (error) {
      return { ok: false, message: error };
    }
  }

  // Visibility validation
  if (!["public", "unlisted", "private"].includes(visibility)) {
    return { ok: false, message: "Invalid visibility setting." };
  }

  return {
    ok: true,
    data: {
      displayName,
      title: title || undefined,
      affiliation: affiliation || undefined,
      location: location || undefined,
      shortBio: shortBio || undefined,
      bio: bio || undefined,
      avatarUrl: avatarUrl || undefined,
      linkedinUrl: linkedinUrl || undefined,
      websiteUrl: websiteUrl || undefined,
      githubUrl: githubUrl || undefined,
      scholarUrl: scholarUrl || undefined,
      orcidUrl: orcidUrl || undefined,
      visibility: visibility as ProfileVisibility,
      directoryOptOut,
      expertiseTagIds,
    },
  };
}

function validateHttpsUrl(value: string, label: string): string | null {
  if (!value) return null;

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return `${label} must be a valid URL.`;
  }

  if (url.protocol !== "https:") {
    return `${label} must start with https://.`;
  }

  return null;
}
