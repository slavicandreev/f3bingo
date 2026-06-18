import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { BingoCard } from "@/components/bingo/bingo-card"
import { LEADERBOARD_SIZE } from "@/lib/constants"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

type Props = {
  params: Promise<{ userId: string }>
}

export async function generateMetadata({ params }: Props) {
  const { userId } = await params
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", userId)
    .single()

  return {
    title: profile
      ? `${profile.display_name}'s Card - F3 Legacy Summer Bingo`
      : "PAX Card - F3 Legacy Summer Bingo",
  }
}

export default async function PaxCardPage({ params }: Props) {
  const { userId } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single()

  if (!profile) notFound()

  const { data: squares } = await supabase
    .from("card_squares")
    .select("*, bingo_items!card_squares_item_position_fkey(*)")
    .eq("user_id", userId)
    .order("item_position")

  if (!squares || squares.length === 0) notFound()

  const { data: leaderboard } = await supabase
    .from("leaderboard_view")
    .select("user_id")
    .limit(LEADERBOARD_SIZE)

  let leaderboardRank: number | null = null
  if (leaderboard) {
    const idx = leaderboard.findIndex((entry) => entry.user_id === userId)
    if (idx !== -1) leaderboardRank = idx + 1
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6">
      <Link
        href="/leaderboard"
        className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Leaderboard
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {profile.display_name}&apos;s Card
        </h1>
        <p className="text-sm text-gray-500">
          F3 Legacy Summer Bingo — July 1 to August 31, 2026
        </p>
      </div>

      <BingoCard
        squares={squares as any}
        leaderboardRank={leaderboardRank}
        readOnly
      />
    </div>
  )
}
