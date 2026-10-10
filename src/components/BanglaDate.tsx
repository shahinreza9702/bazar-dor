"use client";

import { useMemo } from "react";
import { bnDate } from "@/lib/bn";

export default function BanglaDate() {
  const date = useMemo(() => bnDate(), []);

  return <>{date}</>;
}
