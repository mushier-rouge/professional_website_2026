import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { policyPages } from "@/content/policies";

export const metadata: Metadata = {
  title: "Policy",
  description: "Policy details.",
};

export default async function PolicyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = policyPages.find(
    (item) => item.slug === slug && item.path.startsWith("/about/")
  );

  if (!page) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          {page.title}
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{page.summary}</p>
      </header>

      <div className="space-y-8">
        {page.sections.map((section) => (
          <section key={section.heading} className="space-y-3">
            <h2 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
              {section.heading}
            </h2>
            <div className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
              {section.body.map((paragraph, index) => (
                <p key={`${section.heading}-${index}`} className="leading-6">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="flex flex-wrap gap-4 text-sm">
        <Link href="/about" className="text-zinc-600 hover:underline dark:text-zinc-400">
          Back to About
        </Link>
      </div>
    </div>
  );
}
