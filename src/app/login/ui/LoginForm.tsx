"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { getSupabaseBrowserClient } from "@/lib/supabase/browserClient";

export function LoginForm() {
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [status, setStatus] = useState<
    | { kind: "idle" }
    | { kind: "working" }
    | { kind: "error"; message: string }
    | { kind: "success"; message: string }
  >({ kind: "idle" });

  if (!supabase) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
        <p className="font-medium">Supabase is not configured.</p>
        <p className="mt-1 text-amber-800 dark:text-amber-200">
          Set <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to enable login.
        </p>
      </div>
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={async (event) => {
        event.preventDefault();
        setStatus({ kind: "working" });

        try {
          if (!email.trim()) throw new Error("Email is required.");
          if (!password) throw new Error("Password is required.");

          if (mode === "signin") {
            const { error } = await supabase.auth.signInWithPassword({
              email,
              password,
            });
            if (error) throw error;

            setStatus({ kind: "success", message: "Signed in." });
            router.push("/");
            router.refresh();
            return;
          }

          const { error } = await supabase.auth.signUp({ email, password });
          if (error) throw error;

          setStatus({
            kind: "success",
            message: "Account created. Check your email if confirmation is required.",
          });
          router.push("/");
          router.refresh();
        } catch (err) {
          const message = err instanceof Error ? err.message : "Sign in failed.";
          setStatus({ kind: "error", message });
        }
      }}
    >
      <div className="flex gap-2 rounded-lg bg-black/[.04] p-1 dark:bg-white/[.06]">
        <button
          type="button"
          className={[
            "flex-1 rounded-md px-3 py-2 text-sm",
            mode === "signin"
              ? "bg-white font-medium text-zinc-950 shadow-sm dark:bg-zinc-950 dark:text-zinc-50"
              : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-zinc-50",
          ].join(" ")}
          onClick={() => setMode("signin")}
        >
          Sign in
        </button>
        <button
          type="button"
          className={[
            "flex-1 rounded-md px-3 py-2 text-sm",
            mode === "signup"
              ? "bg-white font-medium text-zinc-950 shadow-sm dark:bg-zinc-950 dark:text-zinc-50"
              : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-zinc-50",
          ].join(" ")}
          onClick={() => setMode("signup")}
        >
          Create account
        </button>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
          Email
        </label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          autoComplete="email"
          className="w-full rounded-lg border border-black/[.08] bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-white/[.12] dark:bg-black dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600"
          placeholder="you@example.com"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
          Password
        </label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          autoComplete={
            mode === "signin" ? "current-password" : "new-password"
          }
          className="w-full rounded-lg border border-black/[.08] bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-white/[.12] dark:bg-black dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600"
          placeholder="Password"
          required
        />
      </div>
      <div className="text-right">
        <Link
          href="/login/reset"
          className="text-xs text-zinc-600 hover:underline dark:text-zinc-400"
        >
          Forgot password?
        </Link>
      </div>

      {status.kind === "error" ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100">
          {status.message}
        </div>
      ) : null}

      {status.kind === "success" ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-100">
          {status.message}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={status.kind === "working"}
        className="flex h-11 w-full items-center justify-center rounded-lg bg-zinc-950 px-4 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-60 dark:bg-white dark:text-black"
      >
        {status.kind === "working"
          ? "Working..."
          : mode === "signin"
            ? "Sign in"
            : "Create account"}
      </button>
    </form>
  );
}
