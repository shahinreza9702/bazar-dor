import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/api";

export default async function IncreasedSection() {
  const products = (await getProducts())
    .filter((product) => product.change?.dir === "up")
    .sort(
      (a, b) => (b.change?.pct ?? 0) - (a.change?.pct ?? 0)
    )
    .slice(0, 6);

  return (
    <section className="mt-8" id="বেড়েছে">
      <h2 className="mb-3 flex items-center gap-2 text-lg font-bold sm:text-xl">
        <span className="text-green-600">▲</span>
        আজ দাম বেড়েছে
      </h2>

      {products.length === 0 ? (
        <p className="rounded-xl border border-[#e1e9e2] bg-[#fbfdfb] p-4 text-sm text-gray-500">
          আজ কোনো পণ্যের দাম বাড়েনি।
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
