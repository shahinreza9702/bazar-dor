import { connection } from "next/server";
import { bnDate } from "@/lib/bn";

export default async function BanglaDate() {
  await connection();

  return <>{bnDate()}</>;
}
