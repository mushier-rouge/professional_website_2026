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

export function getAllowedTransitions(state: ArticleState): ArticleState[] {
  return transitions[state];
}

export function canTransition(from: ArticleState, to: ArticleState): boolean {
  return transitions[from].includes(to);
}
