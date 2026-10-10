import { Suspense } from "react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import UpdateInfoForm from "@/components/UpdateInfoForm";
import { PageSkeleton } from "@/components/Skeletons";

export const metadata: Metadata = {
  title: "তথ্য হালনাগাদ | বাজার দর",
};

export default function UpdateInfoPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <UpdateInfoContent />
    </Suspense>
  );
}

async function UpdateInfoContent() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/signin");
  }

  return <UpdateInfoForm name={session.user.name ?? ""} />;
}
