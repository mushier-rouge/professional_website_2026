import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { createSupabaseServerClient } from "@/lib/supabase/serverClient";

export const metadata: Metadata = {
  title: "Collections",
  description: "Curated collections of articles.",
};

type Collection = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_image_url: string | null;
  published_at: string | null;
  article_count: number;
};

export default async function CollectionsPage() {
  const supabase = await createSupabaseServerClient();
  let collections: Collection[] = [];
  let loadError: string | null = null;

  if (supabase) {
    // Get published collections with article counts
    const { data: rows, error } = await supabase
      .from("collections")
      .select(`
        id,
        title,
        slug,
        description,
        cover_image_url,
        published_at,
        collection_articles(count)
      `)
      .eq("is_published", true)
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false });

    if (error) {
      loadError = "Failed to load collections.";
    } else {
      collections = (rows ?? []).map((row) => ({
        id: row.id,
        title: row.title,
        slug: row.slug,
        description: row.description,
        cover_image_url: row.cover_image_url,
        published_at: row.published_at,
        article_count: Array.isArray(row.collection_articles)
          ? row.collection_articles.length
          : typeof row.collection_articles === "object" && row.collection_articles !== null
            ? (row.collection_articles as {count: number}).count
            : 0,
      }));
    }
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Collections
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Curated collections of articles on specific themes and topics.
        </p>
      </header>

      {!supabase ? (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
          <p className="font-medium">Supabase is not configured.</p>
        </section>
      ) : loadError ? (
        <section className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100">
          {loadError}
        </section>
      ) : collections.length === 0 ? (
        <section className="rounded-2xl border border-black/[.06] bg-white p-6 text-sm text-zinc-600 shadow-sm dark:border-white/[.08] dark:bg-zinc-950 dark:text-zinc-400">
          No published collections yet.
        </section>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={`/collections/${collection.slug}`}
              className="group rounded-2xl border border-black/[.06] bg-white shadow-sm transition-colors hover:bg-black/[.02] dark:border-white/[.08] dark:bg-zinc-950 dark:hover:bg-white/[.06]"
            >
              {collection.cover_image_url && (
                <div className="relative aspect-[2/1] w-full overflow-hidden rounded-t-2xl">
                  <Image
                    src={collection.cover_image_url}
                    alt={collection.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-5 space-y-2">
                <h2 className="text-base font-semibold text-zinc-950 group-hover:text-zinc-700 dark:text-zinc-50 dark:group-hover:text-zinc-200">
                  {collection.title}
                </h2>
                {collection.description && (
                  <p className="line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {collection.description}
                  </p>
                )}
                <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-500">
                  <span>{collection.article_count} article{collection.article_count !== 1 ? "s" : ""}</span>
                  {collection.published_at && (
                    <>
                      <span>•</span>
                      <span>Published {new Date(collection.published_at).toLocaleDateString()}</span>
                    </>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
