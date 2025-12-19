import type { Metadata } from "next";
import Link from "next/link";

import { LoginForm } from "./ui/LoginForm";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your account.",
};

export default function LoginPage() {
  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-2xl border border-black/[.06] bg-white p-6 shadow-sm dark:border-white/[.08] dark:bg-zinc-950 sm:p-8">
        <header className="space-y-2">
          <h1 className="text-xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            Sign in
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Use your Supabase account to sign in.
          </p>
        </header>

        <div className="mt-6">
          <LoginForm />
        </div>

        <p className="mt-6 text-xs text-zinc-500 dark:text-zinc-500">
          By signing in, you agree to the consortium&apos;s code of conduct and
          professional standards.
        </p>
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/"
          className="text-sm text-zinc-600 hover:underline dark:text-zinc-400"
        >
          Back to profile
        </Link>
      </div>
    </div>
  );
}
