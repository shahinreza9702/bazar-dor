"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

const sortOptions = [
  { value: "default", label: "ডিফল্ট" },
  { value: "asc", label: "দাম: কম থেকে বেশি" },
  { value: "desc", label: "দাম: বেশি থেকে কম" },
] as const;

export default function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const current = searchParams.get("sort") || "default";

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "default") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }

    const query = params.toString();
    const pathname = window.location.pathname;

    startTransition(() => {
      router.push(query ? `${pathname}?${query}` : pathname);
    });
  };

  return (
    <form
      className="mt-5 flex items-center justify-end gap-3 rounded-2xl border bg-white p-4"
      onSubmit={(event) => event.preventDefault()}
    >
      <label
        htmlFor="sort"
        className="text-sm text-gray-500"
      >
        সাজান
      </label>

      <div className="relative">
        <select
          id="sort"
          value={current}
          onChange={(event) => handleChange(event.target.value)}
          disabled={pending}
          className="appearance-none rounded-xl border bg-white py-2 pl-3 pr-9 text-sm focus:border-[#078b43] focus:outline-none disabled:opacity-60"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <span
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400"
          aria-hidden="true"
        >
          {pending ? "⏳" : "▾"}
        </span>
      </div>
    </form>
  );
}
