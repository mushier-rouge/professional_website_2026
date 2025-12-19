import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MembershipGradeBadge } from "@/components/MembershipGradeBadge";
import { profile } from "@/content/profile";
import { isMemberSlugMatch } from "@/lib/members/slug";

export const metadata: Metadata = {
  title: "Member profile",
  description: "Member profile details.",
};

export default async function MemberProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!isMemberSlugMatch(profile.name, slug)) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-10">
      <header className="rounded-2xl border border-black/[.06] bg-white p-6 shadow-sm dark:border-white/[.08] dark:bg-zinc-950 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            <Image
              src={profile.photo.src}
              alt={profile.photo.alt}
              width={96}
              height={96}
              className="h-24 w-24 rounded-full border border-black/[.06] bg-white object-cover dark:border-white/[.08] dark:bg-zinc-950"
            />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                  {profile.name}
                </h1>
                <MembershipGradeBadge grade={profile.membershipGrade} />
              </div>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {profile.location}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <a
              href={`mailto:${profile.email}`}
              className="font-medium text-zinc-950 hover:underline dark:text-zinc-50"
            >
              {profile.email}
            </a>
            <a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-600 hover:underline dark:text-zinc-400"
            >
              linkedin.com/in/sanjaydevnani
            </a>
          </div>
        </div>
      </header>

      <section className="grid gap-8 sm:grid-cols-2">
        <div>
          <h2 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
            Alma mater
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            {profile.education.map((edu) => (
              <li key={edu.school} className="leading-6">
                <span className="font-medium text-zinc-800 dark:text-zinc-200">
                  {edu.school}
                </span>
                <span className="text-zinc-500 dark:text-zinc-500"> - {edu.degree}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
            Professional experience
          </h2>
          <ol className="mt-3 space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
            {profile.experience.map((role) => (
              <li key={`${role.company}-${role.start}`} className="flex flex-col gap-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <span className="font-medium text-zinc-800 dark:text-zinc-200">
                    {role.company}
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-500">
                    {role.start} - {role.end}
                  </span>
                </div>
                <span className="text-zinc-600 dark:text-zinc-400">{role.title}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div className="flex flex-wrap gap-4 text-sm">
        <Link href="/members" className="text-zinc-600 hover:underline dark:text-zinc-400">
          Back to directory
        </Link>
        <Link href="/" className="text-zinc-600 hover:underline dark:text-zinc-400">
          Back to home
        </Link>
      </div>
    </div>
  );
}
