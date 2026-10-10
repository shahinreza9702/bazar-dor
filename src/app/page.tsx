import { Suspense } from "react";
import type { Metadata } from "next";
import AllProducts from "@/components/AllProducts";
import DecreasedSection from "@/components/DecreasedSection";
import HeroSection from "@/components/HeroSection";
import IncreasedSection from "@/components/IncreasedSection";
import { SectionSkeleton } from "@/components/Skeletons";

export const metadata: Metadata = {
  title: "বাজার দর — আজকের বাজারদর এক নজরে",
};

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-12 pt-5 sm:px-6 sm:pt-7">
      <HeroSection />

      <Suspense fallback={<SectionSkeleton count={4} />}>
        <IncreasedSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton count={4} />}>
        <DecreasedSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton count={8} />}>
        <AllProducts />
      </Suspense>
    </main>
  );
}
