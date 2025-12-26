export type ArticleState =
  | "DRAFT"
  | "SUBMITTED"
  | "IN_REVIEW"
  | "REVISION_REQUESTED"
  | "RESUBMITTED"
  | "ACCEPTED"
  | "SCHEDULED"
  | "PUBLISHED"
  | "ARCHIVED"
  | "RETRACTED";

export type ArticleStatus =
  | "draft"
  | "submitted"
  | "in_review"
  | "revision_requested"
  | "resubmitted"
  | "accepted"
  | "scheduled"
  | "published"
  | "archived"
  | "retracted";

const transitions: Record<ArticleState, ArticleState[]> = {
  DRAFT: ["SUBMITTED"],
  SUBMITTED: ["IN_REVIEW"],
  IN_REVIEW: ["REVISION_REQUESTED", "ACCEPTED"],
  REVISION_REQUESTED: ["RESUBMITTED"],
  RESUBMITTED: ["IN_REVIEW"],
  ACCEPTED: ["SCHEDULED", "PUBLISHED"],
  SCHEDULED: ["PUBLISHED"],
  PUBLISHED: ["ARCHIVED", "RETRACTED"],
  ARCHIVED: [],
  RETRACTED: [],
};

const statusTransitions: Record<ArticleStatus, ArticleStatus[]> = {
  draft: ["submitted"],
  submitted: ["in_review"],
  in_review: ["revision_requested", "accepted"],
  revision_requested: ["resubmitted"],
  resubmitted: ["in_review"],
  accepted: ["scheduled", "published"],
  scheduled: ["published"],
  published: ["archived", "retracted"],
  archived: [],
  retracted: [],
};

export function getAllowedTransitions(state: ArticleState): ArticleState[] {
  return transitions[state];
}

export function canTransition(from: ArticleStatus, to: ArticleStatus): boolean {
  return statusTransitions[from]?.includes(to) ?? false;
}
