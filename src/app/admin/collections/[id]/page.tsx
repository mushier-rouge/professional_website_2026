import type { Metadata } from "next";
import Link from "next/link";

import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { hasRole } from "@/lib/rbac/permissions";
import { CollectionEditor } from "./ui/CollectionEditor";
import { ArticleManager } from "./ui/ArticleManager";

export const metadata: Metadata = {
  title: "Edit Collection",
  description: "Manage collection details and articles.",
};

type CollectionRow = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_image_url: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
};

type CollectionArticle = {
  id: string;
  position: number;
  article: {
    id: string;
    title: string;
    status: string;
  } | null;
};

export default async function EditCollectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createSupabaseServerClient();
  const { data } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  const user = data.user;

  if (!user) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Edit Collection
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
          Edit Collection
        </h1>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
          <p className="font-medium">Access Denied</p>
        </div>
      </div>
    );
  }

  if (!supabase) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Edit Collection
        </h1>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
          <p className="font-medium">Supabase is not configured.</p>
        </div>
      </div>
    );
  }

  const { data: collectionData, error: collectionError } = await supabase
    .from("collections")
    .select("id, title, slug, description, cover_image_url, is_published, published_at, created_at")
    .eq("id", id)
    .single();

  if (collectionError || !collectionData) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Edit Collection
        </h1>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100">
          Collection not found.
        </div>
        <Link href="/admin/collections" className="text-sm text-zinc-600 hover:underline dark:text-zinc-400">
          ← Back to collections
        </Link>
      </div>
    );
  }

  const collection = collectionData as unknown as CollectionRow;

  // Get articles in this collection
  const { data: articleRows } = await supabase
    .from("collection_articles")
    .select(`
      id,
      position,
      article:articles!collection_articles_article_id_fkey(id, title, status)
    `)
    .eq("collection_id", collection.id)
    .order("position", { ascending: true });

  const articles = ((articleRows ?? []) as unknown as CollectionArticle[])
    .filter((row) => row.article !== null);

  // Get available published articles
  const { data: availableRows } = await supabase
    .from("articles")
    .select("id, title")
    .eq("status", "published")
    .order("title", { ascending: true });

  const availableArticles = (availableRows ?? []).filter(
    (article) => !articles.some((ca) => ca.article?.id === article.id)
  );

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8">
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
          Edit Collection
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Manage collection details and articles.
        </p>
      </div>

      <CollectionEditor
        collectionId={collection.id}
        initialData={{
          title: collection.title,
          description: collection.description || "",
          coverImageUrl: collection.cover_image_url || "",
          isPublished: collection.is_published,
        }}
      />

      <ArticleManager
        collectionId={collection.id}
        articles={articles.map((ca) => ({
          id: ca.id,
          articleId: ca.article!.id,
          title: ca.article!.title,
          position: ca.position,
        }))}
        availableArticles={availableArticles.map((a) => ({
          id: a.id,
          title: a.title,
        }))}
      />
    </div>
  );
}
