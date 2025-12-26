import { describe, expect, it } from "vitest";

import { canTransition, type ArticleStatus } from "./workflow";

type Transition = [ArticleStatus, ArticleStatus];

const validTransitions: Transition[] = [
  ["draft", "submitted"],
  ["submitted", "in_review"],
  ["in_review", "revision_requested"],
  ["in_review", "accepted"],
  ["revision_requested", "resubmitted"],
  ["resubmitted", "in_review"],
  ["accepted", "scheduled"],
  ["accepted", "published"],
  ["scheduled", "published"],
  ["published", "archived"],
  ["published", "retracted"],
];

const invalidTransitions: Transition[] = [
  ["draft", "published"],
  ["submitted", "published"],
  ["resubmitted", "published"],
  ["archived", "published"],
  ["retracted", "published"],
];

describe("article workflow transitions", () => {
  it("allows valid transitions", () => {
    for (const [from, to] of validTransitions) {
      expect(canTransition(from, to)).toBe(true);
    }
  });

  it("rejects invalid transitions", () => {
    for (const [from, to] of invalidTransitions) {
      expect(canTransition(from, to)).toBe(false);
    }
  });
});
