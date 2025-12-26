import type { Metadata } from "next";
import Link from "next/link";

import { createSupabaseServerClient } from "@/lib/supabase/serverClient";

import { ArticleEditorWrapper } from "./ui/ArticleEditorWrapper";

export const metadata: Metadata = {
  title: "New article",
  description: "Create a new article.",
};

export default async function NewArticlePage() {
  const supabase = await createSupabaseServerClient();
  const { data } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  const user = data.user;

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8">
      <header className="space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          New Article
        </h1>
        <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          Write and publish your research, tutorials, or perspectives.
        </p>
      </header>

      {!supabase ? (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
          <p className="font-medium">Supabase is not configured.</p>
          <p className="mt-2 text-amber-800 dark:text-amber-200">
            Set <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to enable article creation.
          </p>
        </section>
      ) : !user ? (
        <section className="rounded-2xl border border-black/[.06] bg-white p-6 shadow-sm dark:border-white/[.08] dark:bg-zinc-950">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            You must be signed in to create an article.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/login"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-zinc-950 px-4 text-sm font-medium text-white shadow-sm hover:opacity-90 dark:bg-white dark:text-black"
            >
              Sign in
            </Link>
            <Link
              href="/articles"
              className="inline-flex h-10 items-center justify-center rounded-lg border border-black/[.08] bg-white px-4 text-sm font-medium text-zinc-900 shadow-sm hover:bg-black/[.02] dark:border-white/[.12] dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-white/[.06]"
            >
              Back to feed
            </Link>
          </div>
        </section>
      ) : (
        <ArticleEditorWrapper userEmail={user.email ?? ""} />
      )}

      <div className="flex flex-wrap gap-4 text-sm">
        <Link href="/articles" className="text-zinc-600 hover:underline dark:text-zinc-400">
          Articles
        </Link>
        <Link href="/" className="text-zinc-600 hover:underline dark:text-zinc-400">
          Profile
        </Link>
      </div>
    </div>
  );
}

