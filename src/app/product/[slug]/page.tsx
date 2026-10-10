import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/auth";
import { getProduct } from "@/lib/api";
import { bn, unitLabel } from "@/lib/bn";
import {
  ChangeBadge,
  ChangeIndicator,
} from "@/components/ProductCard";
import { PageSkeleton } from "@/components/Skeletons";

export const metadata: Metadata = {
  title: "পণ্যের বিস্তারিত | বাজার দর",
};

export default function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <ProductContent params={params} />
    </Suspense>
  );
}

async function ProductContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(
      `/signin?callbackUrl=${encodeURIComponent(`/product/${slug}`)}`
    );
  }

  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const markets = product.markets ?? [];

  const minPrice =
    markets.length > 0
      ? Math.min(...markets.map((market) => market.min))
      : product.today;

  const maxPrice =
    markets.length > 0
      ? Math.max(...markets.map((market) => market.max))
      : product.today;

  const averagePrice =
    markets.length > 0
      ? markets.reduce(
          (sum, market) => sum + (market.min + market.max) / 2,
          0
        ) / markets.length
      : product.today;

  const priceDiff = product.today - product.yesterday;
  const diffText =
    priceDiff > 0
      ? `গতকালের তুলনায় আজ দাম বেড়েছে: ${bn(priceDiff)} টাকা`
      : priceDiff < 0
        ? `গতকালের তুলনায় আজ দাম কমেছে: ${bn(Math.abs(priceDiff))} টাকা`
        : "গতকালের তুলনায় আজ দাম অপরিবর্তিত";

  return (
    <div className="mx-auto max-w-5xl px-4 py-7 sm:px-6">
      <p className="mb-5 text-sm text-gray-500">
        <Link href="/" className="hover:text-green-700">
          হোম
        </Link>
        {" › "}
        <Link
          href={`/category/${product.category}`}
          className="hover:text-green-700"
        >
          {product.categoryNameBn}
        </Link>
        {" › "}
        <span className="text-gray-800">{product.nameBn}</span>
      </p>

      {/* Summary */}
      <section className="flex flex-col justify-between gap-5 rounded-2xl border bg-white p-6 shadow-sm sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-[#f0f5f0] text-4xl">
            {product.image || product.categoryIcon}
          </div>

          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">
              {product.nameBn}
            </h1>

            <p className="mt-1 text-gray-500">
              প্রতি {unitLabel(product.unit)} ·{" "}
              {product.categoryNameBn}
            </p>

            <p className="mt-2 text-sm text-gray-600">
              {diffText}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#e5f4e9] px-2.5 py-1 text-xs font-medium text-green-800">
                {product.categoryIcon} {product.categoryNameBn}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                📦 প্রতি {unitLabel(product.unit)}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                🏪 {bn(markets.length)}টি বাজার
              </span>
            </div>
          </div>
        </div>

        <div className="min-w-32 rounded-2xl bg-[#f0f5f0] p-4 text-center">
          <p className="text-sm text-gray-500">আজকের দাম</p>
          <b className="text-3xl">{bn(product.today)}</b>
          <p className="text-sm text-gray-500">
            টাকা / {unitLabel(product.unit)}
          </p>
          <ChangeIndicator
            change={product.change}
            className="mt-1 inline-block text-sm"
          />
        </div>
      </section>

      {/* Price summary */}
      <section className="mt-5 rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-bold">দামের সারসংক্ষেপ</h2>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border p-4">
            <p className="text-sm text-gray-500">সর্বনিম্ন দাম</p>
            <b className="text-2xl text-green-700">
              {bn(minPrice)} টাকা
            </b>
            <p className="mt-1 text-xs text-gray-500">
              সবচেয়ে কম দামের বাজার
            </p>
          </div>

          <div className="rounded-2xl border p-4">
            <p className="text-sm text-gray-500">সর্বোচ্চ দাম</p>
            <b className="text-2xl text-red-600">
              {bn(maxPrice)} টাকা
            </b>
            <p className="mt-1 text-xs text-gray-500">
              সবচেয়ে বেশি দামের বাজার
            </p>
          </div>

          <div className="rounded-2xl border p-4">
            <p className="text-sm text-gray-500">গড় দাম</p>
            <b className="text-2xl text-green-700">
              {bn(averagePrice, 1)} টাকা
            </b>
            <p className="mt-1 text-xs text-gray-500">
              প্রতি {unitLabel(product.unit)} হিসাবে
            </p>
          </div>
        </div>

        <h2 className="mb-3 mt-6 text-lg font-bold">
          বাজারভিত্তিক আজকের দাম
        </h2>

        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="p-3">বাজার</th>
                <th className="p-3">বিভাগ</th>
                <th className="p-3">সর্বনিম্ন</th>
                <th className="p-3">সর্বোচ্চ</th>
                <th className="p-3 text-right">গড়</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {markets.map((market, index) => (
                <tr
                  key={`${market.market}-${index}`}
                  className={index % 2 ? "bg-[#f0f5f0]" : ""}
                >
                  <td className="p-3">{market.market}</td>
                  <td className="p-3">{market.division}</td>
                  <td className="p-3">
                    {bn(market.min)} টাকা
                  </td>
                  <td className="p-3">
                    {bn(market.max)} টাকা
                  </td>
                  <td className="p-3 text-right font-semibold">
                    {bn((market.min + market.max) / 2, 1)} টাকা
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <ChangeBadge change={product.change} />
          <span className="text-xs text-gray-500">
            গত ২৪ ঘণ্টার দামের পরিবর্তন
          </span>
        </div>
      </section>
    </div>
  );
}
