import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-200">404</h1>
        <p className="mt-4 text-lg text-gray-600">Page not found</p>
        <Link href="/" className="mt-6 inline-block">
          <Button variant="outline">Go Home</Button>
        </Link>
      </div>
    </div>
  )
}
