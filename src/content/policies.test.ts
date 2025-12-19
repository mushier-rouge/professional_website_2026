import { describe, expect, it } from "vitest";

import { policyPages } from "./policies";

const requiredPaths = [
  "/about/mission",
  "/about/editorial-policy",
  "/about/code-of-conduct",
  "/about/governance",
  "/about/privacy",
  "/about/terms",
  "/membership-grades",
];

describe("policyPages", () => {
  it("includes required policy paths", () => {
    const paths = policyPages.map((page) => page.path);

    for (const required of requiredPaths) {
      expect(paths).toContain(required);
    }
  });

  it("has unique slugs and paths", () => {
    const slugs = policyPages.map((page) => page.slug);
    const paths = policyPages.map((page) => page.path);

    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(paths).size).toBe(paths.length);
  });
});
