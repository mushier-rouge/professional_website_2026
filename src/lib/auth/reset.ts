export type ResetClient = {
  auth: {
    resetPasswordForEmail: (
      email: string,
      options?: { redirectTo?: string }
    ) => Promise<{ error: { message: string } | null }>;
  };
};

export type ResetResult = {
  ok: boolean;
  message: string;
};

const emailPattern = /^\S+@\S+\.\S+$/;

export async function requestPasswordReset(
  client: ResetClient,
  email: string,
  redirectTo?: string
): Promise<ResetResult> {
  if (!email.trim()) {
    return { ok: false, message: "Email is required." };
  }

  if (!emailPattern.test(email)) {
    return { ok: false, message: "Enter a valid email address." };
  }

  const { error } = await client.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) {
    return { ok: false, message: error.message || "Password reset failed." };
  }

  return { ok: true, message: "Check your email for a reset link." };
}
