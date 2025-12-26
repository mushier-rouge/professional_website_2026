import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { hasRole } from "@/lib/rbac/permissions";
import { createCollection } from "./actions";

export const metadata: Metadata = {
  title: "New Collection",
  description: "Create a new article collection.",
};

export default async function NewCollectionPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  const user = data.user;

  if (!user) {
    redirect("/login");
  }

  const isEditor = await hasRole("editor");
  const isAdmin = await hasRole("admin");

  if (!isEditor && !isAdmin) {
    return (
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          New Collection
        </h1>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
          <p className="font-medium">Access Denied</p>
        </div>
      </div>
    );
  }

  async function handleCreate(formData: FormData) {
    "use server";
    const result = await createCollection(formData);
    if (result.ok && result.id) {
      redirect(`/admin/collections/${result.id}`);
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8">
      <header>
        <Link
          href="/admin/collections"
          className="text-sm text-zinc-600 hover:underline dark:text-zinc-400"
        >
          ← Back to collections
        </Link>
      </header>

      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          New Collection
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Create a curated collection of articles.
        </p>
      </div>

      <form action={handleCreate} className="space-y-6">
        <div className="rounded-2xl border border-black/[.06] bg-white p-6 shadow-sm dark:border-white/[.08] dark:bg-zinc-950">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                Title <span className="text-red-600">*</span>
              </label>
              <input
                name="title"
                required
                className="w-full rounded-lg border border-black/[.08] bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-white/[.12] dark:bg-black dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600"
                placeholder="Best of AI Research 2025"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                Description
              </label>
              <textarea
                name="description"
                rows={4}
                className="w-full rounded-lg border border-black/[.08] bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-white/[.12] dark:bg-black dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600"
                placeholder="A curated collection of the most impactful AI research articles published this year."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                Cover Image URL
              </label>
              <input
                name="coverImageUrl"
                type="url"
                className="w-full rounded-lg border border-black/[.08] bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-white/[.12] dark:bg-black dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600"
                placeholder="https://example.com/cover.jpg"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-zinc-950 px-4 text-sm font-medium text-white shadow-sm hover:opacity-90 dark:bg-white dark:text-black"
          >
            Create Collection
          </button>
          <Link
            href="/admin/collections"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-black/[.08] bg-white px-4 text-sm font-medium text-zinc-900 shadow-sm hover:bg-black/[.02] dark:border-white/[.12] dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-white/[.06]"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
