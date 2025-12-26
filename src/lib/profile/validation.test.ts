import { describe, expect, it } from "vitest";

import { MAX_DISPLAY_NAME_LENGTH, validateProfileInput } from "./validation";

describe("validateProfileInput", () => {
  it("rejects empty display name", () => {
    const result = validateProfileInput({
      displayName: " ",
      linkedinUrl: "",
      avatarUrl: "",
    });

    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("Expected validation to fail.");
    expect(result.message).toBe("Display name is required.");
  });

  it("rejects display names longer than the limit", () => {
    const tooLongName = "a".repeat(MAX_DISPLAY_NAME_LENGTH + 1);
    const result = validateProfileInput({
      displayName: tooLongName,
      linkedinUrl: "",
      avatarUrl: "",
    });

    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("Expected validation to fail.");
    expect(result.message).toBe(
      `Display name must be ${MAX_DISPLAY_NAME_LENGTH} characters or fewer.`
    );
  });

  it("rejects non-https LinkedIn URLs", () => {
    const result = validateProfileInput({
      displayName: "Ada Lovelace",
      linkedinUrl: "http://linkedin.com/in/ada",
      avatarUrl: "",
    });

    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("Expected validation to fail.");
    expect(result.message).toBe("LinkedIn URL must start with https://.");
  });

  it("rejects invalid avatar URLs", () => {
    const result = validateProfileInput({
      displayName: "Ada Lovelace",
      linkedinUrl: "",
      avatarUrl: "not-a-url",
    });

    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("Expected validation to fail.");
    expect(result.message).toBe("Avatar URL must be a valid URL.");
  });

  it("accepts valid inputs and trims values", () => {
    const result = validateProfileInput({
      displayName: "  Ada Lovelace ",
      linkedinUrl: " https://linkedin.com/in/ada ",
      avatarUrl: "https://example.com/avatar.png",
    });

    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("Expected validation to succeed.");
    expect(result.data.displayName).toBe("Ada Lovelace");
    expect(result.data.linkedinUrl).toBe("https://linkedin.com/in/ada");
    expect(result.data.avatarUrl).toBe("https://example.com/avatar.png");
  });
});
