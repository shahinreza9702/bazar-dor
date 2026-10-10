"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function UpdateInfoForm({
  name,
}: {
  name: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const newName = String(formData.get("name") || "").trim();

    if (!newName) {
      toast.error("নাম লিখুন");
      setLoading(false);
      return;
    }

    try {
      const response = await authClient.updateUser({
        name: newName,
      });

      if (response.error) {
        toast.error("তথ্য হালনাগাদ করতে সমস্যা হয়েছে");
        return;
      }

      toast.success("তথ্য হালনাগাদ হয়েছে");
      router.push("/profile");
      router.refresh();
    } catch {
      toast.error("তথ্য হালনাগাদ করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold">তথ্য হালনাগাদ</h1>
      <p className="mt-1 text-sm text-gray-500">
        আপনার অ্যাকাউন্টের নাম পরিবর্তন করুন।
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-5 rounded-2xl border bg-white p-6 shadow-sm sm:p-8"
      >
        <h2 className="text-lg font-bold">তথ্য</h2>

        <label
          htmlFor="name"
          className="mt-5 mb-2 block text-sm font-medium"
        >
          নাম
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={name}
          className="w-full rounded-xl border px-4 py-3 focus:border-[#078b43] focus:outline-none"
        />

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-[#078b43] px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "হালনাগাদ হচ্ছে..."
              : "তথ্য হালনাগাদ"}
          </button>

          <Link
            href="/profile"
            className="rounded-xl border border-gray-300 px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
          >
            বাতিল
          </Link>
        </div>
      </form>
    </main>
  );
}
