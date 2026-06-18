import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="text-center">
        <h1 className="text-6xl font-black text-amber-200/20">404</h1>
        <p className="mt-4 text-lg text-amber-200/60">Page not found</p>
        <Link href="/" className="mt-6 inline-block">
          <Button variant="outline" className="border-[#4a5c3a] text-amber-200 hover:bg-[#2a3a1a] bg-transparent">
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
