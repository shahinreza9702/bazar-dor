import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import SortSelect from "@/components/SortSelect";
import { PageSkeleton } from "@/components/Skeletons";
import { getCategories, getProducts } from "@/lib/api";
import { bn } from "@/lib/bn";

export const metadata: Metadata = {
  title: "ক্যাটাগরি | বাজার দর",
};

export default function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string }>;
}) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <CategoryContent
        params={params}
        searchParams={searchParams}
      />
    </Suspense>
  );
}

async function CategoryContent({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string }>;
}) {
  const { slug } = await params;
  const { sort = "default" } = await searchParams;

  const [categories, allProducts] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  const category = categories.find((item) => item.slug === slug);

  if (!category) {
    notFound();
  }

  const products = allProducts.filter(
    (product) => product.category === category.id
  );

  if (sort === "asc") {
    products.sort((a, b) => a.today - b.today);
  } else if (sort === "desc") {
    products.sort((a, b) => b.today - a.today);
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-7 sm:px-6">
      {/* Category heading */}
      <section className="flex items-center gap-4 rounded-2xl border bg-white p-6 shadow-sm">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#f0f5f0] text-4xl">
          {category.icon}
        </span>

        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">
            {category.nameBn}
          </h1>
          <p className="text-sm text-gray-500 sm:text-base">
            {bn(products.length)}টি পণ্যের আজকের দাম ও
            পরিবর্তন
          </p>
        </div>
      </section>

      {/* Sort control */}
      <SortSelect />

      <p className="mb-3 mt-5 text-sm text-gray-500">
        মোট {bn(products.length)}টি পণ্য দেখানো হচ্ছে
      </p>

      {/* Product cards */}
      {products.length === 0 ? (
        <div className="rounded-2xl border bg-white p-10 text-center">
          <p className="text-4xl">🛒</p>
          <p className="mt-3 text-lg font-semibold">
            এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি
          </p>
          <p className="mt-1 text-sm text-gray-500">
            অন্য ক্যাটাগরি দেখুন অথবা হোম পেজে ফিরে যান।
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex rounded-xl bg-[#078b43] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800"
          >
            হোম পেজে ফিরে যান
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
