import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

import { UserButton } from "@/components/auth/UserButton";
import { memberNav, primaryNav } from "@/content/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Sanjay Devnani",
    template: "%s | Sanjay Devnani",
  },
  description: "Professional profile and membership information.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50`}
      >
        <div className="min-h-screen">
          <header className="sticky top-0 z-10 border-b border-black/[.06] bg-zinc-50/80 backdrop-blur dark:border-white/[.08] dark:bg-black/60">
            <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-6 py-4">
              <Link
                href="/"
                className="text-sm font-semibold tracking-tight text-zinc-950 dark:text-zinc-50"
              >
                Sanjay Devnani
              </Link>
              <nav className="flex items-center gap-4 text-sm text-zinc-700 dark:text-zinc-300">
                {primaryNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-md px-2 py-1 hover:bg-black/[.04] dark:hover:bg-white/[.06]"
                  >
                    {item.label}
                  </Link>
                ))}
                <span className="h-4 w-px bg-black/[.06] dark:bg-white/[.12]" />
                {memberNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-md px-2 py-1 hover:bg-black/[.04] dark:hover:bg-white/[.06]"
                  >
                    {item.label}
                  </Link>
                ))}
                <UserButton />
              </nav>
            </div>
          </header>
          <main className="mx-auto w-full max-w-4xl px-6 py-12">
            {children}
          </main>
          <footer className="border-t border-black/[.06] py-10 text-sm text-zinc-600 dark:border-white/[.08] dark:text-zinc-400">
            <div className="mx-auto w-full max-w-4xl px-6">
              <p>Copyright {new Date().getFullYear()} Sanjay Devnani.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
