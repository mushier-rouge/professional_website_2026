import { describe, expect, it } from "vitest";

import { isMemberSlugMatch, toMemberSlug } from "./slug";

describe("toMemberSlug", () => {
  it("converts names to kebab-case", () => {
    expect(toMemberSlug("Sanjay Devnani")).toBe("sanjay-devnani");
  });

  it("strips punctuation and extra spaces", () => {
    expect(toMemberSlug("  Ada  Lovelace, PhD ")).toBe("ada-lovelace-phd");
  });
});

describe("isMemberSlugMatch", () => {
  it("matches a slug to a name", () => {
    expect(isMemberSlugMatch("Ada Lovelace", "ada-lovelace")).toBe(true);
    expect(isMemberSlugMatch("Ada Lovelace", "grace-hopper")).toBe(false);
  });
});
