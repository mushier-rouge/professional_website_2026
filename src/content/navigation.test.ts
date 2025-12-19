import { describe, expect, it } from "vitest";

import { memberNav, primaryNav } from "./navigation";

const requiredPrimary = ["/", "/members", "/articles", "/about"];

describe("primaryNav", () => {
  it("includes required public routes", () => {
    const paths = primaryNav.map((item) => item.href);
    for (const path of requiredPrimary) {
      expect(paths).toContain(path);
    }
  });

  it("has unique paths", () => {
    const paths = primaryNav.map((item) => item.href);
    expect(new Set(paths).size).toBe(paths.length);
  });
});

describe("memberNav", () => {
  it("includes account navigation", () => {
    const paths = memberNav.map((item) => item.href);
    expect(paths).toContain("/account");
    expect(paths).toContain("/profile/edit");
    expect(paths).toContain("/membership-grades");
  });
});
