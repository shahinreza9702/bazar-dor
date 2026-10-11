import { headers } from "next/headers";
import { auth } from "@/auth";
import { getCategories, getProducts } from "@/lib/api";
import HeaderClient from "@/components/HeaderClient";

export default async function HeaderSection() {
  const [categoriesResult, productsResult, sessionResult] =
    await Promise.allSettled([
      getCategories(),
      getProducts(),
      auth.api.getSession({ headers: await headers() }),
    ]);

  if (categoriesResult.status === "rejected") {
    console.error(
      "[HeaderSection] Categories failed:",
      categoriesResult.reason
    );
  }

  if (productsResult.status === "rejected") {
    console.error(
      "[HeaderSection] Products failed:",
      productsResult.reason
    );
  }

  if (sessionResult.status === "rejected") {
    console.error(
      "[HeaderSection] Session failed:",
      sessionResult.reason
    );
  }

  const categories =
    categoriesResult.status === "fulfilled"
      ? categoriesResult.value
      : [];

  const products =
    productsResult.status === "fulfilled"
      ? productsResult.value
      : [];

  const session =
    sessionResult.status === "fulfilled"
      ? sessionResult.value
      : null;

  return (
    <HeaderClient
      categories={categories}
      products={products}
      session={session}
    />
  );
}