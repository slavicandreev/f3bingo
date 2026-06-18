export default function CardLoading() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6">
      <div className="mb-6">
        <div className="h-8 w-48 animate-pulse rounded bg-[#2a3a1a]" />
        <div className="mt-2 h-4 w-72 animate-pulse rounded bg-[#2a3a1a]/50" />
      </div>

      <div className="mb-4 flex gap-3">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-10 w-32 animate-pulse rounded-lg bg-[#2a3a1a]"
          />
        ))}
      </div>

      <div className="mx-auto w-full max-w-[420px]">
        <div className="rounded-lg overflow-hidden border-2 border-[#4a5c3a]">
          <div className="grid grid-cols-5 bg-[#4a5c3a]">
            {["B", "I", "N", "G", "O"].map((l) => (
              <div key={l} className="flex items-center justify-center py-2 text-xl font-black text-amber-100/30">
                {l}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-5 gap-px bg-[#c4b998]">
            {Array.from({ length: 25 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square animate-pulse bg-[#e5e0cc]"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
