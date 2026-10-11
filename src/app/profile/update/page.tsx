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
  const headersList = await headers();
  const session = headersList
    ? await auth.api.getSession({ headers: headersList })
    : null;

  if (!session) {
    redirect("/signin");
  }

  return <UpdateInfoForm name={session.user.name ?? ""} />;
}
