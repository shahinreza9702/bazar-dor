import Link from "next/link";
import type { Product } from "@/lib/api";
import { bn, unitLabel } from "@/lib/bn";

export type ChangeDir = "up" | "down" | "flat";

export const changeDir = (change: Product["change"]): ChangeDir => {
  if (!change || change.pct === 0) return "flat";
  return change.dir === "up" ? "up" : change.dir === "down" ? "down" : "flat";
};

const badgeStyles: Record<ChangeDir, string> = {
  up: "bg-green-100 text-green-700 border border-green-300",
  down: "bg-red-100 text-red-600 border border-red-300",
  flat: "bg-gray-100 text-gray-600 border border-gray-200",
};

const arrows: Record<ChangeDir, string> = {
  up: "▲",
  down: "▼",
  flat: "—",
};

const textStyles: Record<ChangeDir, string> = {
  up: "text-green-700",
  down: "text-red-600",
  flat: "text-gray-500",
};

export function ChangeBadge({ change }: { change: Product["change"] }) {
  const dir = changeDir(change);

  return (
    <span
      className={`shrink-0 self-end rounded-full px-2 py-1 text-[10px] font-semibold sm:px-2.5 sm:py-1.5 sm:text-xs ${badgeStyles[dir]}`}
    >
      {arrows[dir]} {bn(Math.abs(change?.pct ?? 0), 1)}%
    </span>
  );
}

export function ChangeIndicator({
  change,
  className = "",
}: {
  change: Product["change"];
  className?: string;
}) {
  const dir = changeDir(change);

  return (
    <b className={`${textStyles[dir]} ${className}`}>
      {arrows[dir]} {bn(Math.abs(change?.pct ?? 0), 1)}%
    </b>
  );
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex min-h-[104px] items-center justify-between gap-3 rounded-xl border border-[#e1e9e2] bg-[#fbfdfb] p-3 transition hover:-translate-y-0.5 hover:border-green-300 hover:shadow-sm sm:p-4"
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#f0f5f0] text-xl sm:h-11 sm:w-11 sm:text-2xl">
          {product.image || product.categoryIcon || "🛒"}
        </span>

        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold group-hover:text-green-800 sm:text-base">
            {product.nameBn}
          </h3>

          <p className="mt-0.5 truncate text-[11px] text-gray-500">
            {product.categoryNameBn} · প্রতি {unitLabel(product.unit)}
          </p>

          <p className="mt-2 text-[10px] text-gray-500">আজকের দাম</p>

          <p className="text-base font-bold leading-tight sm:text-lg">
            {bn(product.today)}
            <span className="ml-1 text-xs font-medium">টাকা</span>
          </p>
        </div>
      </div>

      <ChangeBadge change={product.change} />
    </Link>
  );
}
