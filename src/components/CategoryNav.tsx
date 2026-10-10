"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Category } from "@/lib/api";

export default function CategoryNav({
  categories,
}: {
  categories: Category[];
}) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="পণ্যের ক্যাটাগরি"
      className="hide-scrollbar overflow-x-auto border-t border-gray-100"
    >
      <div className="mx-auto flex max-w-6xl min-w-max items-center gap-1.5 px-4 py-2.5 text-xs font-medium sm:gap-2 sm:px-6 sm:text-sm">
        <Link
          href="/"
          className={`whitespace-nowrap rounded-full px-3 py-1.5 transition ${
            pathname === "/"
              ? "bg-[#078b43] text-white"
              : "text-gray-700 hover:bg-[#e5f4e9] hover:text-green-800"
          }`}
        >
          🏠 হোম
        </Link>

        {categories.map((category) => {
          const href = `/category/${category.slug}`;
          const isActive = pathname === href;

          return (
            <Link
              key={category.id}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 transition ${
                isActive
                  ? "bg-[#078b43] text-white shadow-sm"
                  : "text-gray-700 hover:bg-[#e5f4e9] hover:text-green-800"
              }`}
            >
              <span aria-hidden="true">{category.icon}</span>{" "}
              {category.nameBn}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
