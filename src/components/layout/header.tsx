import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { SignOutButton } from "@/components/auth/sign-out-button"
import { Trophy } from "lucide-react"

export async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header className="border-b border-[#3a4a2a] bg-[#2a3a1a]">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
        <Link href={user ? "/card" : "/"} className="flex items-center gap-2 font-black text-lg tracking-wide">
          <span className="text-amber-100">F3</span>
          <span className="text-amber-400">BINGO</span>
        </Link>

        <nav className="flex items-center gap-1">
          {user ? (
            <>
              <Link
                href="/card"
                className="rounded-md px-3 py-2 text-sm font-medium text-amber-200/80 hover:bg-[#3a4a2a] hover:text-amber-100"
              >
                My Card
              </Link>
              <Link
                href="/leaderboard"
                className="rounded-md px-3 py-2 text-sm font-medium text-amber-200/80 hover:bg-[#3a4a2a] hover:text-amber-100"
              >
                <span className="hidden sm:inline">Leaderboard</span>
                <Trophy className="h-4 w-4 sm:hidden" />
              </Link>
              <SignOutButton />
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-md bg-[#4a5c3a] px-4 py-2 text-sm font-medium text-amber-100 hover:bg-[#5a6b4a]"
            >
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
