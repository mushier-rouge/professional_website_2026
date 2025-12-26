import type { Metadata } from "next";
import Link from "next/link";

import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { hasRole } from "@/lib/rbac/permissions";

export const metadata: Metadata = {
  title: "Manage Collections",
  description: "Create and manage article collections.",
};

type Collection = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  article_count: number;
};

export default async function ManageCollectionsPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  const user = data.user;

  if (!user) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Manage Collections
        </h1>
        <div className="rounded-2xl border border-black/[.06] bg-white p-6 shadow-sm dark:border-white/[.08] dark:bg-zinc-950">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            You must be signed in.
          </p>
        </div>
      </div>
    );
  }

  const isEditor = await hasRole("editor");
  const isAdmin = await hasRole("admin");

  if (!isEditor && !isAdmin) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Manage Collections
        </h1>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
          <p className="font-medium">Access Denied</p>
          <p className="mt-2 text-amber-800 dark:text-amber-200">
            You must have editor or admin privileges.
          </p>
        </div>
      </div>
    );
  }

  if (!supabase) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Manage Collections
        </h1>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
          <p className="font-medium">Supabase is not configured.</p>
        </div>
      </div>
    );
  }

  const { data: rows, error } = await supabase
    .from("collections")
    .select(`
      id,
      title,
      slug,
      description,
      is_published,
      published_at,
      created_at,
      collection_articles(count)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Manage Collections
        </h1>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100">
          Failed to load collections.
        </div>
      </div>
    );
  }

  const collections = (rows ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    is_published: row.is_published,
    published_at: row.published_at,
    created_at: row.created_at,
    article_count: Array.isArray(row.collection_articles)
      ? row.collection_articles.length
      : typeof row.collection_articles === "object" && row.collection_articles !== null
        ? (row.collection_articles as {count: number}).count
        : 0,
  })) as Collection[];

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8">
      <header className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            Manage Collections
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Create and manage curated article collections.
          </p>
        </div>
        <Link
          href="/admin/collections/new"
          className="inline-flex h-10 items-center justify-center rounded-lg bg-zinc-950 px-4 text-sm font-medium text-white shadow-sm hover:opacity-90 dark:bg-white dark:text-black"
        >
          New Collection
        </Link>
      </header>

      {collections.length === 0 ? (
        <section className="rounded-2xl border border-black/[.06] bg-white p-6 text-sm text-zinc-600 shadow-sm dark:border-white/[.08] dark:bg-zinc-950 dark:text-zinc-400">
          No collections created yet.
        </section>
      ) : (
        <div className="space-y-3">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={`/admin/collections/${collection.id}`}
              className="block rounded-2xl border border-black/[.06] bg-white p-5 shadow-sm transition-colors hover:bg-black/[.02] dark:border-white/[.08] dark:bg-zinc-950 dark:hover:bg-white/[.06]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                      {collection.title}
                    </h3>
                    <span
                      className={[
                        "rounded px-2 py-0.5 text-xs font-medium",
                        collection.is_published
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                          : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
                      ].join(" ")}
                    >
                      {collection.is_published ? "Published" : "Draft"}
                    </span>
                  </div>
                  {collection.description && (
                    <p className="line-clamp-2 text-xs text-zinc-600 dark:text-zinc-400">
                      {collection.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-500">
                    <span>{collection.article_count} articles</span>
                    <span>•</span>
                    <span>Created {new Date(collection.created_at).toLocaleDateString()}</span>
                    {collection.published_at && (
                      <>
                        <span>•</span>
                        <span>Published {new Date(collection.published_at).toLocaleDateString()}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
