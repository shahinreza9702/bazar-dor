"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import type { auth } from "@/auth";

type Session = typeof auth.$Infer.Session | null;

export default function AuthButtons({
  session,
}: {
  session: Session;
}) {
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

  if (!session) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/signin"
          className="rounded-full border border-[#078b43] px-3 py-1.5 text-sm font-medium text-[#078b43] transition hover:bg-[#e5f4e9] sm:px-4"
        >
          সাইন ইন
        </Link>

        <Link
          href="/signup"
          className="rounded-full bg-[#078b43] px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800 sm:px-4"
        >
          সাইন আপ
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/profile"
        className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-2.5 py-1.5 text-sm shadow-sm transition hover:border-green-300 sm:px-3"
      >
        <span className="grid h-7 w-7 place-items-center rounded-full bg-[#e9eee9] text-sm">
          👤
        </span>
        <span className="hidden max-w-24 truncate sm:inline">
          {session.user.name || session.user.email}
        </span>
        <span className="text-xs text-gray-400" aria-hidden="true">
          ⌄
        </span>
      </Link>

      <button
        type="button"
        onClick={handleSignOut}
        className="rounded-full border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50 sm:px-4"
      >
        সাইন আউট
      </button>
    </div>
  );
}
