import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/api";

export default async function AllProducts() {
  const products = await getProducts();

  return (
    <section id="সব-পণ্য" className="mt-8 scroll-mt-44">
      <h2 className="text-lg font-bold sm:text-xl">সব পণ্য</h2>

      <p className="mb-3 mt-1 text-xs text-gray-500 sm:text-sm">
        প্রতিদিনের প্রয়োজনীয় পণ্যের সর্বশেষ দাম — মোট {products.length}টি
        পণ্য
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
