"use client";

import { useEffect, useMemo, useState } from "react";

import { getSupabaseBrowserClient } from "@/lib/supabase/browserClient";

type Status =
  | { kind: "idle" }
  | { kind: "working" }
  | { kind: "error"; message: string }
  | { kind: "success"; message: string };

type SessionState =
  | { kind: "checking" }
  | { kind: "ready" }
  | { kind: "invalid"; message: string };

export function ResetPasswordConfirmForm() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [sessionState, setSessionState] = useState<SessionState>(() =>
    supabase
      ? { kind: "checking" }
      : { kind: "invalid", message: "Supabase is not configured." }
  );
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  useEffect(() => {
    if (!supabase) return;

    let isMounted = true;

    supabase.auth.getSession().then(({ data, error }) => {
      if (!isMounted) return;
      if (error || !data.session) {
        setSessionState({
          kind: "invalid",
          message: "Reset link is invalid or expired.",
        });
        return;
      }
      setSessionState({ kind: "ready" });
    });

    return () => {
      isMounted = false;
    };
  }, [supabase]);

  if (sessionState.kind === "checking") {
    return (
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Checking your reset link...
      </p>
    );
  }

  if (sessionState.kind === "invalid") {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100">
        {sessionState.message}
      </div>
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={async (event) => {
        event.preventDefault();
        setStatus({ kind: "working" });

        if (password.length < 8) {
          setStatus({ kind: "error", message: "Password must be at least 8 characters." });
          return;
        }

        if (password !== confirmPassword) {
          setStatus({ kind: "error", message: "Passwords do not match." });
          return;
        }

        if (!supabase) {
          setStatus({ kind: "error", message: "Supabase is not configured." });
          return;
        }

        const { error } = await supabase.auth.updateUser({ password });
        if (error) {
          setStatus({ kind: "error", message: error.message || "Password update failed." });
          return;
        }

        setStatus({ kind: "success", message: "Password updated. You can sign in now." });
      }}
    >
      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
          New password
        </label>
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          autoComplete="new-password"
          className="w-full rounded-lg border border-black/[.08] bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-white/[.12] dark:bg-black dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600"
          placeholder="New password"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
          Confirm new password
        </label>
        <input
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          type="password"
          autoComplete="new-password"
          className="w-full rounded-lg border border-black/[.08] bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-white/[.12] dark:bg-black dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600"
          placeholder="Confirm password"
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
        {status.kind === "working" ? "Updating..." : "Update password"}
      </button>
    </form>
  );
}
