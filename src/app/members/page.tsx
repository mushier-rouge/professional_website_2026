import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { MembershipGradeBadge } from "@/components/MembershipGradeBadge";
import { profile } from "@/content/profile";
import { toMemberSlug } from "@/lib/members/slug";

export const metadata: Metadata = {
  title: "Members",
  description: "Member directory.",
};

const members = [profile];

export default function MembersPage() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Members
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Directory preview. Full member listings will appear once profile visibility and
          directory policies are enforced.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {members.map((member) => {
          const slug = toMemberSlug(member.name);
          return (
            <Link
              key={member.email}
              href={`/members/${slug}`}
              className="rounded-2xl border border-black/[.06] bg-white p-5 shadow-sm transition-colors hover:bg-black/[.02] dark:border-white/[.08] dark:bg-zinc-950 dark:hover:bg-white/[.06]"
            >
              <div className="flex items-center gap-4">
                <Image
                  src={member.photo.src}
                  alt={member.photo.alt}
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded-full border border-black/[.06] bg-white object-cover dark:border-white/[.08] dark:bg-zinc-950"
                />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                      {member.name}
                    </h2>
                    <MembershipGradeBadge grade={member.membershipGrade} />
                  </div>
                  <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                    {member.location}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
