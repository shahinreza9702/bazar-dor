import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/api";

export default async function DecreasedSection() {
  const products = (await getProducts())
    .filter((product) => product.change?.dir === "down")
    .sort(
      (a, b) => (a.change?.pct ?? 0) - (b.change?.pct ?? 0)
    )
    .slice(0, 6);

  return (
    <section className="mt-8" id="কমেছে">
      <h2 className="mb-3 flex items-center gap-2 text-lg font-bold sm:text-xl">
        <span className="text-red-600">▼</span>
        আজ দাম কমেছে
      </h2>

      {products.length === 0 ? (
        <p className="rounded-xl border border-[#e1e9e2] bg-[#fbfdfb] p-4 text-sm text-gray-500">
          আজ কোনো পণ্যের দাম কমেনি।
        </p>
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
