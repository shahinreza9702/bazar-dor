import { Suspense } from "react";
import BanglaDate from "@/components/BanglaDate";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[200px] flex-col overflow-hidden rounded-2xl border border-[#e1e9e2] bg-gradient-to-br from-[#fbfdfb] to-[#eef6ef] p-5 sm:min-h-[240px] sm:flex-row sm:items-center sm:justify-between sm:p-8">
      <div className="relative z-10 max-w-xl">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e5f4e9] px-3 py-1 text-[11px] font-medium text-green-800 sm:text-xs">
          <span>📅</span>
          <Suspense fallback={<>…</>}>
            <BanglaDate />
          </Suspense>
        </span>

        <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
          আজকের বাজারের দাম এক নজরে
        </h1>

        <p className="mt-2 max-w-lg text-sm leading-6 text-gray-600">
          চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও নিত্যপণ্যের দাম — বাজারের
          সর্বশেষ দর জানুন সহজেই।
        </p>

        <a
          href="#সব-পণ্য"
          className="mt-4 inline-flex items-center rounded-lg bg-[#078b43] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800"
        >
          সব দাম দেখুন
          <span className="ml-2" aria-hidden="true">
            →
          </span>
        </a>
      </div>

      <div className="mt-4 flex justify-center sm:mt-0 sm:w-56">
        <div
          className="relative flex h-32 w-40 items-end justify-center sm:h-36 sm:w-48"
          aria-label="বাজারের পণ্যের ছবি"
        >
          <div className="absolute bottom-1 h-4 w-36 rounded-[50%] bg-gray-200/70"></div>
          <div
            className="absolute bottom-5 z-10 h-12 w-32 rounded-b-xl border-x-4 border-b-4 border-[#87400d] bg-[#b75b17]"
            style={{
              clipPath: "polygon(0 0, 100% 0, 88% 100%, 12% 100%)",
            }}
          ></div>
          <div className="absolute bottom-5 z-20 flex w-28 justify-around">
            <span className="text-3xl drop-shadow">🍎</span>
            <span className="text-3xl drop-shadow">🍅</span>
            <span className="text-3xl drop-shadow">🥕</span>
          </div>
          <span className="absolute bottom-[58px] left-8 text-4xl">🍆</span>
          <span className="absolute bottom-[58px] right-7 text-4xl">🫑</span>
        </div>
      </div>
    </section>
  );
}
