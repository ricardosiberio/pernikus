export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded border border-slate-200 bg-white p-8">
        <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded border border-slate-200 bg-white"
            >
              <div className="aspect-square w-full animate-pulse bg-slate-100" />
              <div className="space-y-3 p-4">
                <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
                <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
