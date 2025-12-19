import type { Metadata } from "next";
import Link from "next/link";

import { policyPages } from "@/content/policies";

export const metadata: Metadata = {
  title: "About",
  description: "Mission, policies, and governance.",
};

const aboutPages = policyPages.filter((page) => page.path.startsWith("/about/"));
const otherPages = policyPages.filter((page) => !page.path.startsWith("/about/"));

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          About
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Mission, policies, and governance for the AI/ML Society.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
          Society policies
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {aboutPages.map((page) => (
            <Link
              key={page.slug}
              href={page.path}
              className="rounded-2xl border border-black/[.06] bg-white p-5 text-sm shadow-sm transition-colors hover:bg-black/[.02] dark:border-white/[.08] dark:bg-zinc-950 dark:hover:bg-white/[.06]"
            >
              <h3 className="font-semibold text-zinc-950 dark:text-zinc-50">
                {page.title}
              </h3>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">{page.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      {otherPages.length ? (
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
            Related
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {otherPages.map((page) => (
              <Link
                key={page.slug}
                href={page.path}
                className="rounded-2xl border border-black/[.06] bg-white p-5 text-sm shadow-sm transition-colors hover:bg-black/[.02] dark:border-white/[.08] dark:bg-zinc-950 dark:hover:bg-white/[.06]"
              >
                <h3 className="font-semibold text-zinc-950 dark:text-zinc-50">
                  {page.title}
                </h3>
                <p className="mt-2 text-zinc-600 dark:text-zinc-400">{page.summary}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
