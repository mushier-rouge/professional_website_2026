import { describe, expect, it } from "vitest";

import { canTransition, getAllowedTransitions, type ArticleState } from "./workflow";

type Transition = [ArticleState, ArticleState];

const validTransitions: Transition[] = [
  ["DRAFT", "SUBMITTED"],
  ["SUBMITTED", "IN_REVIEW"],
  ["IN_REVIEW", "REVISION_REQUESTED"],
  ["IN_REVIEW", "ACCEPTED"],
  ["REVISION_REQUESTED", "RESUBMITTED"],
  ["RESUBMITTED", "IN_REVIEW"],
  ["ACCEPTED", "SCHEDULED"],
  ["ACCEPTED", "PUBLISHED"],
  ["SCHEDULED", "PUBLISHED"],
  ["PUBLISHED", "ARCHIVED"],
  ["PUBLISHED", "RETRACTED"],
];

const invalidTransitions: Transition[] = [
  ["DRAFT", "PUBLISHED"],
  ["SUBMITTED", "PUBLISHED"],
  ["RESUBMITTED", "PUBLISHED"],
  ["ARCHIVED", "PUBLISHED"],
  ["RETRACTED", "PUBLISHED"],
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

  it("returns allowed transitions for a state", () => {
    expect(getAllowedTransitions("PUBLISHED")).toEqual(["ARCHIVED", "RETRACTED"]);
  });
});
