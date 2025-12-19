import { describe, expect, it } from "vitest";

import { requestPasswordReset } from "./reset";

type Call = {
  email: string;
  redirectTo?: string;
};

function createClient(errorMessage?: string) {
  const calls: Call[] = [];
  return {
    calls,
    client: {
      auth: {
        resetPasswordForEmail: async (email: string, options?: { redirectTo?: string }) => {
          calls.push({ email, redirectTo: options?.redirectTo });
          return { error: errorMessage ? { message: errorMessage } : null };
        },
      },
    },
  };
}

describe("requestPasswordReset", () => {
  it("rejects empty email", async () => {
    const { client } = createClient();
    const result = await requestPasswordReset(client, "");

    expect(result.ok).toBe(false);
    expect(result.message).toBe("Email is required.");
  });

  it("rejects invalid email", async () => {
    const { client } = createClient();
    const result = await requestPasswordReset(client, "invalid");

    expect(result.ok).toBe(false);
    expect(result.message).toBe("Enter a valid email address.");
  });

  it("passes redirectTo to the client", async () => {
    const { client, calls } = createClient();
    const result = await requestPasswordReset(client, "user@example.com", "https://example.com/reset");

    expect(result.ok).toBe(true);
    expect(calls).toEqual([
      { email: "user@example.com", redirectTo: "https://example.com/reset" },
    ]);
  });

  it("surfaces Supabase errors", async () => {
    const { client } = createClient("No account");
    const result = await requestPasswordReset(client, "user@example.com");

    expect(result.ok).toBe(false);
    expect(result.message).toBe("No account");
  });
});
