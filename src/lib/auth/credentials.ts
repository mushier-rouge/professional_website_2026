export type AuthMode = "signin" | "signup";

export type AuthClient = {
  auth: {
    signInWithPassword: (credentials: {
      email: string;
      password: string;
    }) => Promise<{ error: { message: string } | null }>;
    signUp: (credentials: {
      email: string;
      password: string;
    }) => Promise<{ error: { message: string } | null }>;
  };
};

export type AuthResult = {
  ok: boolean;
  message: string;
};

const emailPattern = /^\S+@\S+\.\S+$/;

export async function submitCredentials(
  client: AuthClient,
  mode: AuthMode,
  email: string,
  password: string
): Promise<AuthResult> {
  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    return { ok: false, message: "Email is required." };
  }

  if (!emailPattern.test(trimmedEmail)) {
    return { ok: false, message: "Enter a valid email address." };
  }

  if (!password) {
    return { ok: false, message: "Password is required." };
  }

  const { error } =
    mode === "signin"
      ? await client.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        })
      : await client.auth.signUp({
          email: trimmedEmail,
          password,
        });

  if (error) {
    return { ok: false, message: error.message || "Sign in failed." };
  }

  return {
    ok: true,
    message:
      mode === "signin"
        ? "Signed in."
        : "Account created. Check your email if confirmation is required.",
  };
}
