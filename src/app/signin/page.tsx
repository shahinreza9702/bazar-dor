import { Suspense } from "react";
import type { Metadata } from "next";
import SignInForm from "@/components/SignInForm";
import { AuthPageSkeleton } from "@/components/Skeletons";

export const metadata: Metadata = {
  title: "সাইন ইন | বাজার দর",
};

export default function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  return (
    <Suspense fallback={<AuthPageSkeleton />}>
      <SignInSection searchParams={searchParams} />
    </Suspense>
  );
}

async function SignInSection({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  return <SignInForm callbackUrl={callbackUrl || "/"} />;
}
