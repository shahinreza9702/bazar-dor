export function ProductCardSkeleton() {
  return (
    <div className="flex min-h-[104px] animate-pulse items-center justify-between gap-3 rounded-xl border border-[#e1e9e2] bg-[#fbfdfb] p-3 sm:p-4">
      <div className="flex min-w-0 items-center gap-3">
        <div className="h-10 w-10 shrink-0 rounded-xl bg-gray-200 sm:h-11 sm:w-11" />

        <div className="w-full">
          <div className="h-3.5 w-24 rounded bg-gray-200 sm:h-4 sm:w-32" />
          <div className="mt-2 h-2.5 w-16 rounded bg-gray-100" />
          <div className="mt-2.5 h-2 w-12 rounded bg-gray-100" />
          <div className="mt-1.5 h-4 w-20 rounded bg-gray-200" />
        </div>
      </div>

      <div className="h-6 w-14 shrink-0 rounded-full bg-gray-200" />
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function SectionSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="mt-7">
      <div className="mb-3 h-6 w-40 animate-pulse rounded bg-gray-200" />
      <ProductGridSkeleton count={count} />
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6">
      <div className="mb-5 h-4 w-48 animate-pulse rounded bg-gray-200" />
      <div className="h-28 animate-pulse rounded-2xl border bg-white sm:h-32" />
      <div className="mt-5 h-12 animate-pulse rounded-2xl border bg-white" />
      <ProductGridSkeleton count={8} />
    </div>
  );
}

export function AuthPageSkeleton() {
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-md items-center justify-center px-4 py-10">
      <div className="w-full">
        <div className="mb-6 flex flex-col items-center">
          <div className="grid h-14 w-14 animate-pulse place-items-center rounded-2xl bg-gray-200" />
          <div className="mt-3 h-6 w-32 animate-pulse rounded bg-gray-200" />
          <div className="mt-2 h-3.5 w-56 animate-pulse rounded bg-gray-100" />
        </div>
        <div className="animate-pulse rounded-2xl border bg-white p-6 sm:p-8">
          <div className="h-3.5 w-16 rounded bg-gray-200" />
          <div className="mt-2 h-11 rounded-xl bg-gray-100" />
          <div className="mt-5 h-3.5 w-20 rounded bg-gray-200" />
          <div className="mt-2 h-11 rounded-xl bg-gray-100" />
          <div className="mt-5 h-11 rounded-xl bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
