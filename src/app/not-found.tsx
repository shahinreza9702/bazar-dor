import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-16 text-center">
      <span className="grid h-20 w-20 place-items-center rounded-2xl bg-[#f0f5f0] text-4xl">
        🔍
      </span>

      <p className="mt-6 text-6xl font-bold text-[#078b43]">
        ৪০৪
      </p>

      <h1 className="mt-3 text-2xl font-bold">
        পৃষ্ঠাটি পাওয়া যায়নি
      </h1>

      <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
        আপনি যে ঠিকানায় যেতে চেয়েছেন, সেই পৃষ্ঠা বা পণ্যটি
        আমাদের কাছে নেই। ঠিকানাটি সঠিক কিনা দেখে
        আবার চেষ্টা করুন।
      </p>

      <Link
        href="/"
        className="mt-6 inline-flex items-center rounded-xl bg-[#078b43] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800"
      >
        হোম পেজে ফিরে যান
      </Link>
    </main>
  );
}
