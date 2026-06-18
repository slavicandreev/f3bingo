export default function CardLoading() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6">
      <div className="mb-6">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
        <div className="mt-2 h-4 w-72 animate-pulse rounded bg-gray-100" />
      </div>

      <div className="mb-4 flex gap-3">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-10 w-32 animate-pulse rounded-lg bg-gray-100"
          />
        ))}
      </div>

      <div className="mx-auto w-full max-w-[420px]">
        <div className="grid grid-cols-5 gap-1.5">
          {Array.from({ length: 25 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square animate-pulse rounded-md bg-gray-100"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
