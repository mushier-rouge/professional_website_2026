import { describe, expect, it } from "vitest";

import { submitCredentials } from "./credentials";

type Call = {
  kind: "signin" | "signup";
  email: string;
  password: string;
};

function createClient(errorMessage?: string) {
  const calls: Call[] = [];

  return {
    calls,
    client: {
      auth: {
        signInWithPassword: async ({
          email,
          password,
        }: {
          email: string;
          password: string;
        }) => {
          calls.push({ kind: "signin", email, password });
          return { error: errorMessage ? { message: errorMessage } : null };
        },
        signUp: async ({
          email,
          password,
        }: {
          email: string;
          password: string;
        }) => {
          calls.push({ kind: "signup", email, password });
          return { error: errorMessage ? { message: errorMessage } : null };
        },
      },
    },
  };
}

describe("submitCredentials", () => {
  it("rejects empty email", async () => {
    const { client } = createClient();
    const result = await submitCredentials(client, "signin", "", "secret");

    expect(result.ok).toBe(false);
    expect(result.message).toBe("Email is required.");
  });

  it("rejects invalid email", async () => {
    const { client } = createClient();
    const result = await submitCredentials(client, "signin", "invalid", "secret");

    expect(result.ok).toBe(false);
    expect(result.message).toBe("Enter a valid email address.");
  });

  it("rejects empty password", async () => {
    const { client } = createClient();
    const result = await submitCredentials(client, "signin", "user@example.com", "");

    expect(result.ok).toBe(false);
    expect(result.message).toBe("Password is required.");
  });

  it("calls signInWithPassword for sign in", async () => {
    const { client, calls } = createClient();
    const result = await submitCredentials(
      client,
      "signin",
      " user@example.com ",
      "secret"
    );

    expect(result.ok).toBe(true);
    expect(result.message).toBe("Signed in.");
    expect(calls).toEqual([
      { kind: "signin", email: "user@example.com", password: "secret" },
    ]);
  });

  it("calls signUp for sign up", async () => {
    const { client, calls } = createClient();
    const result = await submitCredentials(
      client,
      "signup",
      "new@example.com",
      "secret"
    );

    expect(result.ok).toBe(true);
    expect(result.message).toBe(
      "Account created. Check your email if confirmation is required."
    );
    expect(calls).toEqual([
      { kind: "signup", email: "new@example.com", password: "secret" },
    ]);
  });

  it("surfaces Supabase errors", async () => {
    const { client } = createClient("No account");
    const result = await submitCredentials(
      client,
      "signin",
      "user@example.com",
      "secret"
    );

    expect(result.ok).toBe(false);
    expect(result.message).toBe("No account");
  });
});
