import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { BingoCard } from "@/components/bingo/bingo-card"
import { LEADERBOARD_SIZE } from "@/lib/constants"

export const metadata = {
  title: "My Card - F3 Legacy Summer Bingo",
}

export default async function CardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: squares } = await supabase
    .from("card_squares")
    .select("*, bingo_items!card_squares_item_position_fkey(*)")
    .eq("user_id", user.id)
    .order("item_position")

  if (!squares || squares.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-4">
        <p className="text-amber-200/60">
          Setting up your bingo card... Please refresh the page.
        </p>
      </div>
    )
  }

  const { data: leaderboard } = await supabase
    .from("leaderboard_view")
    .select("user_id")
    .limit(LEADERBOARD_SIZE)

  let leaderboardRank: number | null = null
  if (leaderboard) {
    const idx = leaderboard.findIndex((entry) => entry.user_id === user.id)
    if (idx !== -1) leaderboardRank = idx + 1
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-amber-100 tracking-wide">My Bingo Card</h1>
        <p className="text-sm text-amber-200/50 font-medium tracking-wider">
          F3 LEGACY SUMMER BINGO — JULY 1 TO AUGUST 31, 2026
        </p>
      </div>
      <BingoCard
        squares={squares as any}
        leaderboardRank={leaderboardRank}
      />
    </div>
  )
}
