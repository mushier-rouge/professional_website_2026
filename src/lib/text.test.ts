import { describe, expect, it } from "vitest";

import { normalizeWhitespace } from "./text";

describe("normalizeWhitespace", () => {
  it("trims and collapses whitespace", () => {
    expect(normalizeWhitespace("  a   b \n c ")).toBe("a b c");
  });
});
