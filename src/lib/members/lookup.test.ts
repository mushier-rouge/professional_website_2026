import { describe, expect, it } from "vitest";

import { findMemberBySlug } from "./lookup";

describe("findMemberBySlug", () => {
  it("returns the matching member for a slug", () => {
    const members = [
      { displayName: "Ada Lovelace" },
      { displayName: "Grace Hopper" },
    ];

    const match = findMemberBySlug(members, "grace-hopper");

    expect(match?.displayName).toBe("Grace Hopper");
  });

  it("returns undefined when no member matches", () => {
    const members = [{ displayName: "Alan Turing" }];

    const match = findMemberBySlug(members, "unknown");

    expect(match).toBeUndefined();
  });
});
