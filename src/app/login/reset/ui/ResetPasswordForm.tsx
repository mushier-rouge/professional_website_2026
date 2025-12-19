"use client";

import { useMemo, useState } from "react";

import { requestPasswordReset } from "@/lib/auth/reset";
import { getSupabaseBrowserClient } from "@/lib/supabase/browserClient";

type Status =
  | { kind: "idle" }
  | { kind: "working" }
  | { kind: "error"; message: string }
  | { kind: "success"; message: string };

export function ResetPasswordForm() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  if (!supabase) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
        <p className="font-medium">Supabase is not configured.</p>
        <p className="mt-1 text-amber-800 dark:text-amber-200">
          Set <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to enable password reset.
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

        const redirectTo =
          typeof window === "undefined"
            ? undefined
            : `${window.location.origin}/login/reset/confirm`;

        const result = await requestPasswordReset(supabase, email, redirectTo);
        setStatus(
          result.ok
            ? { kind: "success", message: result.message }
            : { kind: "error", message: result.message }
        );
      }}
    >
      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
          Email
        </label>
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          autoComplete="email"
          className="w-full rounded-lg border border-black/[.08] bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-white/[.12] dark:bg-black dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600"
          placeholder="you@example.com"
          required
        />
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
        {status.kind === "working" ? "Sending..." : "Send reset link"}
      </button>
    </form>
  );
}
