import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/auth";
import { getCategories, getProducts } from "@/lib/api";
import { bn, bnDate } from "@/lib/bn";
import { changeDir } from "@/components/ProductCard";
import CategoryNav from "@/components/CategoryNav";
import AuthButtons from "@/components/AuthButtons";

async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export default async function HeaderSection() {
  const [categories, products, session] = await Promise.all([
    getCategories(),
    getProducts(),
    getSession(),
  ]);

  const tickerProducts = products.filter((product) => product.change);

  return (
    <header className="sticky top-0 z-20 border-b border-[#e4ebe5] bg-white/95 backdrop-blur">
      {/* Main header row: logo + auth buttons */}
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#078b43] text-xl">
            🛒
          </span>

          <span>
            <span className="block text-lg font-bold leading-tight">
              বাজার দর
            </span>
            <span className="block text-[10px] text-gray-500 sm:text-[11px]">
              {bnDate()}
            </span>
          </span>
        </Link>

        <AuthButtons session={session} />
      </div>

      {/* Category navigation row */}
      <CategoryNav categories={categories} />

      {/* Price ticker */}
      {tickerProducts.length > 0 && (
        <div className="overflow-hidden border-t border-gray-100 bg-[#f8faf8]">
          <div className="price-marquee flex w-max items-center py-2">
            {[0, 1].map((copy) => (
              <div
                key={copy}
                className="flex shrink-0 items-center gap-6 pr-6 sm:gap-8 sm:pr-8"
                aria-hidden={copy === 1}
              >
                {tickerProducts.map((product) => {
                  const dir = changeDir(product.change);

                  const colorClass =
                    dir === "up"
                      ? "text-green-600"
                      : dir === "down"
                        ? "text-red-600"
                        : "text-gray-500";

                  const arrow =
                    dir === "up" ? "▲" : dir === "down" ? "▼" : "—";

                  return (
                    <span
                      key={product.id}
                      className="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-[11px]"
                    >
                      <span aria-hidden="true">
                        {product.image || product.categoryIcon || "🛒"}
                      </span>

                      <span className="font-medium">
                        {product.nameBn}
                      </span>

                      <span className="text-gray-500">
                        {bn(product.today)} টাকা/
                        {product.unit === "kg" ? "কেজি" : product.unit}
                      </span>

                      <b className={colorClass}>
                        {arrow} {bn(Math.abs(product.change.pct), 1)}%
                      </b>
                    </span>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
