"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 py-16 text-center">
      <span className="grid h-20 w-20 place-items-center rounded-2xl bg-[#f0f5f0] text-4xl">
        ⚠️
      </span>

      <h1 className="mt-6 text-2xl font-bold">কিছু সমস্যা হয়েছে</h1>

      <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
        {error?.message || "ডেটা লোড করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।"}
      </p>

      <button
        type="button"
        onClick={reset}
        className="mt-6 inline-flex items-center rounded-xl bg-[#078b43] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800"
      >
        আবার চেষ্টা করুন
      </button>
    </main>
  );
}
