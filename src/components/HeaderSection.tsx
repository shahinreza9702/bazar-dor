import { headers } from "next/headers";
import { auth } from "@/auth";
import { getCategories, getProducts } from "@/lib/api";
import HeaderClient from "@/components/HeaderClient";

export default async function HeaderSection() {
  const [categoriesResult, productsResult] = await Promise.allSettled([
    getCategories(),
    getProducts(),
  ]);

  const categories =
    categoriesResult.status === "fulfilled"
      ? categoriesResult.value
      : [];

  const products =
    productsResult.status === "fulfilled"
      ? productsResult.value
      : [];

  let session = null;

  try {
    const headersList = await headers();
    if (headersList) {
      session = await auth.api.getSession({ headers: headersList });
    }
  } catch {
    // Session unavailable during prerendering - ignore
  }

  return (
    <HeaderClient
      categories={categories}
      products={products}
      session={session}
    />
  );
}