import { Suspense } from "react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import SignOutButton from "@/components/SignOutButton";
import { PageSkeleton } from "@/components/Skeletons";

export const metadata: Metadata = {
  title: "আমার প্রোফাইল | বাজার দর",
};

export default function ProfilePage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <ProfileContent />
    </Suspense>
  );
}

async function ProfileContent() {
  const headersList = await headers();
  const session = headersList
    ? await auth.api.getSession({ headers: headersList })
    : null;

  if (!session) {
    redirect("/signin");
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold">আমার প্রোফাইল</h1>
      <p className="mt-1 text-sm text-gray-500">
        আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
      </p>

      <section className="mt-6 flex flex-col gap-5 rounded-2xl border bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="grid h-20 w-20 place-items-center rounded-2xl bg-[#f0f5f0] text-4xl">
            👨🏻
          </div>
          <div>
            <h2 className="text-xl font-semibold">
              {session.user.name || "ব্যবহারকারী"}
            </h2>
            <p className="text-gray-500">
              {session.user.email}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/profile/update"
            className="rounded-xl bg-[#078b43] px-4 py-3 font-medium text-white shadow-sm transition hover:bg-green-800"
          >
            ✎ তথ্য হালনাগাদ
          </Link>
          <SignOutButton />
        </div>
      </section>
    </main>
  );
}
