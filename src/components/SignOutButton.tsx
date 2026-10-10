"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      const response = await authClient.signOut();

      if (response.error) {
        toast.error("সাইন আউট করতে সমস্যা হয়েছে");
        return;
      }

      toast.success("সাইন আউট হয়েছে");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("সাইন আউট করতে সমস্যা হয়েছে");
    }
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="rounded-xl border border-red-300 px-4 py-3 font-medium text-red-600 transition hover:bg-red-50"
    >
      ↩ সাইন আউট
    </button>
  );
}
