import { connection } from "next/server";
import { bnDate } from "@/lib/bn";

export default async function HeroDate() {
  await connection();

  return <>{bnDate()}</>;
}
