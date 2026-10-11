"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function SignInForm({
  callbackUrl,
}: {
  callbackUrl: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<
    "google" | "github" | null
  >(null);

  useEffect(() => {
    if (callbackUrl && callbackUrl !== "/") {
      toast("পণ্যটি দেখতে অনুগ্রহ করে সাইন ইন করুন", {
        icon: "🔒",
      });
    }
  }, [callbackUrl]);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    console.log("[SignIn] Attempting email sign-in for:", email);

    try {
      const response = await authClient.signIn.email({
        email,
        password,
      });

      console.log("[SignIn] Response:", response);

      if (response.error) {
        const message = (
          response.error.message ?? ""
        ).toLowerCase();

        console.error("[SignIn] Error:", response.error);

        if (message.includes("invalid email")) {
          toast.error("ইমেইল বা পাসওয়ার্ড ভুল");
        } else if (message.includes("not enabled")) {
          toast.error("ইমেইল সাইন ইন এখন উপলব্ধ না");
        } else {
          toast.error("সাইন ইন করতে সমস্যা হয়েছে");
        }
        return;
      }

      toast.success("সাইন ইন সফল হয়েছে");
      const safeCallbackUrl = callbackUrl?.startsWith("/")
        ? callbackUrl
        : "/";
      router.push(safeCallbackUrl);
      router.refresh();
    } catch (err) {
      console.error("[SignIn] Exception:", err);
      toast.error("সাইন ইন করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const handleSocial = async (provider: "google" | "github") => {
    setSocialLoading(provider);

    console.log("[SignIn] Starting social login with:", provider);

    try {
      const result = await authClient.signIn.social({ provider });
      console.log("[SignIn] Social login result:", result);
    } catch (err) {
      console.error("[SignIn] Social login error:", err);
      toast.error(
        `${provider === "google" ? "Google" : "GitHub"} দিয়ে সাইন ইন এখন উপলব্ধ না`
      );
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-md items-center justify-center px-4 py-10">
      <div className="w-full">
        <div className="mb-6 text-center">
          <span className="inline-grid h-14 w-14 place-items-center rounded-2xl bg-[#078b43] text-2xl text-white">
            ৳
          </span>
          <h1 className="mt-3 text-2xl font-bold">সাইন ইন</h1>
          <p className="mt-1 text-sm text-gray-500">
            বিজ্ঞাপিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে
            অ্যাকাউন্টে ঢুকুন।
          </p>
        </div>

        <form
          id="login"
          onSubmit={handleSubmit}
          className="rounded-2xl border bg-white p-6 shadow-sm sm:p-8"
        >
          <label
            htmlFor="email"
            className="block text-sm font-medium"
          >
            ইমেইল
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="mt-2 w-full rounded-xl border px-4 py-3 focus:border-[#078b43] focus:outline-none"
          />

          <label
            htmlFor="password"
            className="mt-5 block text-sm font-medium"
          >
            পাসওয়ার্ড
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="current-password"
            placeholder="কমপক্ষে ৮ অক্ষর"
            className="mt-2 w-full rounded-xl border px-4 py-3 focus:border-[#078b43] focus:outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-5 w-full rounded-xl bg-[#078b43] py-3 font-semibold text-white shadow-sm transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "সাইন ইন হচ্ছে..." : "সাইন ইন"}
          </button>

          <div className="my-5 flex items-center gap-3 text-sm text-gray-400">
            <span className="h-px flex-1 bg-gray-200" />
            <span>অথবা</span>
            <span className="h-px flex-1 bg-gray-200" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleSocial("google")}
              disabled={socialLoading !== null}
              className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 py-2.5 text-sm font-medium transition hover:bg-gray-50 disabled:opacity-60"
            >
              <span aria-hidden="true">🔎</span>
              Google
            </button>

            <button
              type="button"
              onClick={() => handleSocial("github")}
              disabled={socialLoading !== null}
              className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 py-2.5 text-sm font-medium transition hover:bg-gray-50 disabled:opacity-60"
            >
              <span aria-hidden="true">🐙</span>
              GitHub
            </button>
          </div>

          <p className="mt-5 text-center text-sm text-gray-500">
            অ্যাকাউন্ট নেই?{" "}
            <Link
              href="/signup"
              className="font-medium text-[#078b43] hover:underline"
            >
              রেজিস্টার করুন
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
