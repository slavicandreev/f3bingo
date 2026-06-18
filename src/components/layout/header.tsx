import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { SignOutButton } from "@/components/auth/sign-out-button"
import { Trophy, Grid3X3 } from "lucide-react"

export async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
        <Link href={user ? "/card" : "/"} className="flex items-center gap-2 font-bold text-lg">
          <Grid3X3 className="h-6 w-6 text-blue-600" />
          <span className="text-gray-900">F3 Bingo</span>
        </Link>

        <nav className="flex items-center gap-1">
          {user ? (
            <>
              <Link
                href="/card"
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              >
                My Card
              </Link>
              <Link
                href="/leaderboard"
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              >
                <span className="hidden sm:inline">Leaderboard</span>
                <Trophy className="h-4 w-4 sm:hidden" />
              </Link>
              <SignOutButton />
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
