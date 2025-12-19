import type { Metadata } from "next";
import Link from "next/link";

import { ResetPasswordForm } from "./ui/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Request a password reset link.",
};

export default function ResetPasswordPage() {
  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-2xl border border-black/[.06] bg-white p-6 shadow-sm dark:border-white/[.08] dark:bg-zinc-950 sm:p-8">
        <header className="space-y-2">
          <h1 className="text-xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            Reset password
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            We&apos;ll send a reset link to your email address.
          </p>
        </header>

        <div className="mt-6">
          <ResetPasswordForm />
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/login"
          className="text-sm text-zinc-600 hover:underline dark:text-zinc-400"
        >
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
