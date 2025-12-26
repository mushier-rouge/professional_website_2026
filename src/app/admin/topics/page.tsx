import type { Metadata } from "next";
import Link from "next/link";

import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { hasRole } from "@/lib/rbac/permissions";
import { TopicList } from "./ui/TopicList";
import { AddTopicForm } from "./ui/AddTopicForm";

export const metadata: Metadata = {
  title: "Manage Topics",
  description: "Manage article topics and tags.",
};

type Topic = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
  created_at: string;
};

export default async function ManageTopicsPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  const user = data.user;

  if (!user) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Manage Topics
        </h1>
        <div className="rounded-2xl border border-black/[.06] bg-white p-6 shadow-sm dark:border-white/[.08] dark:bg-zinc-950">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            You must be signed in.
          </p>
        </div>
      </div>
    );
  }

  const isAdmin = await hasRole("admin");

  if (!isAdmin) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Manage Topics
        </h1>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
          <p className="font-medium">Access Denied</p>
          <p className="mt-2 text-amber-800 dark:text-amber-200">
            You must have admin privileges to manage topics.
          </p>
        </div>
      </div>
    );
  }

  if (!supabase) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Manage Topics
        </h1>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
          <p className="font-medium">Supabase is not configured.</p>
        </div>
      </div>
    );
  }

  const { data: rows, error } = await supabase
    .from("topics")
    .select("id, name, slug, description, color, created_at")
    .order("name", { ascending: true });

  if (error) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Manage Topics
        </h1>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100">
          Failed to load topics. Ensure migrations are applied.
        </div>
      </div>
    );
  }

  const topics = (rows ?? []) as Topic[];

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Manage Topics
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Manage article topics and tags used across the site.
        </p>
      </header>

      <AddTopicForm />

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          All Topics ({topics.length})
        </h2>
        <TopicList topics={topics} />
      </section>

      <div className="flex flex-wrap gap-4 text-sm">
        <Link
          href="/admin/applications"
          className="text-zinc-600 hover:underline dark:text-zinc-400"
        >
          Applications
        </Link>
        <Link href="/editor" className="text-zinc-600 hover:underline dark:text-zinc-400">
          Editor Dashboard
        </Link>
      </div>
    </div>
  );
}
