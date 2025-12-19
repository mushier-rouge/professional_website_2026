"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { getSupabaseBrowserClient } from "@/lib/supabase/browserClient";

type AuthState = {
  status: "loading" | "disabled" | "signed_out" | "signed_in";
  email?: string;
};

export function UserButton() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [state, setState] = useState<AuthState>(() =>
    supabase ? { status: "loading" } : { status: "disabled" },
  );

  useEffect(() => {
    if (!supabase) {
      return;
    }

    supabase.auth
      .getUser()
      .then(({ data }) => {
        const email = data.user?.email ?? undefined;
        setState(email ? { status: "signed_in", email } : { status: "signed_out" });
      })
      .catch(() => setState({ status: "signed_out" }));

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const email = session?.user?.email ?? undefined;
        setState(email ? { status: "signed_in", email } : { status: "signed_out" });
      },
    );

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, [supabase]);

  if (state.status === "loading") {
    return (
      <span className="text-sm text-zinc-500 dark:text-zinc-400">...</span>
    );
  }

  if (state.status === "disabled") {
    return (
      <span className="text-xs text-zinc-500 dark:text-zinc-500">
        Auth not configured
      </span>
    );
  }

  if (state.status === "signed_in") {
    return (
      <div className="flex items-center gap-3">
        <span className="hidden text-xs text-zinc-500 dark:text-zinc-400 sm:inline">
          {state.email}
        </span>
        <button
          type="button"
          className="rounded-md px-2 py-1 text-sm text-zinc-700 hover:bg-black/[.04] dark:text-zinc-300 dark:hover:bg-white/[.06]"
          onClick={async () => {
            const supabase = getSupabaseBrowserClient();
            if (!supabase) return;
            await supabase.auth.signOut();
          }}
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className="rounded-md px-2 py-1 text-sm text-zinc-700 hover:bg-black/[.04] dark:text-zinc-300 dark:hover:bg-white/[.06]"
    >
      Sign in
    </Link>
  );
}
