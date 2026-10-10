export type Category = {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
};

export type Market = {
  market: string;
  division: string;
  min: number;
  max: number;
};

export type Product = {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: {
    dir: string;
    pct: number;
  };
  markets: Market[];
};

const API_BASE = "https://api.abcz.workers.dev/api/bazardor";


async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { cache: "no-store" });

  if (!res.ok) {
    throw new Error("ডেটা লোড করা যায়নি");
  }

  return (await res.json()) as T;
}

export const getCategories = () => getJson<Category[]>("/categories");

export const getProducts = () => getJson<Product[]>("/products");

export async function getProduct(slug: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((product) => product.slug === slug);
}
