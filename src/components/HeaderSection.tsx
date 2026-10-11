import { headers } from "next/headers";
import { auth } from "@/auth";
import { getCategories, getProducts } from "@/lib/api";
import HeaderClient from "@/components/HeaderClient";

async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export default async function HeaderSection() {
  const [categories, products, session] = await Promise.all([
    getCategories(),
    getProducts(),
    getSession(),
  ]);

  return <HeaderClient categories={categories} products={products} session={session} />;
}