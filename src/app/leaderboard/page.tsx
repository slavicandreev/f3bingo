import { createClient } from "@/lib/supabase/server"
import { LEADERBOARD_SIZE, PATCH_WINNERS } from "@/lib/constants"
import { Badge } from "@/components/ui/badge"
import { Trophy, Award, Medal } from "lucide-react"
import Link from "next/link"
import type { LeaderboardEntry } from "@/lib/types"

export const metadata = {
  title: "Leaderboard - F3 Legacy Summer Bingo",
}

const RANK_STYLES: Record<number, { icon: typeof Trophy; badge: "gold" | "silver" | "bronze"; label: string }> = {
  1: { icon: Trophy, badge: "gold", label: "1st" },
  2: { icon: Award, badge: "silver", label: "2nd" },
  3: { icon: Medal, badge: "bronze", label: "3rd" },
}

export default async function LeaderboardPage() {
  const supabase = await createClient()

  const { data: entries } = await supabase
    .from("leaderboard_view")
    .select("*")
    .limit(LEADERBOARD_SIZE)

  const leaderboard: LeaderboardEntry[] = entries ?? []

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-amber-100 tracking-wide">Leaderboard</h1>
        <p className="text-sm text-amber-200/50 font-medium tracking-wider">
          TOP {LEADERBOARD_SIZE} PAX — TOP {PATCH_WINNERS} EARN F3 LEGACY PATCHES
        </p>
      </div>

      {leaderboard.length === 0 ? (
        <div className="rounded-lg border border-[#3a4a2a] bg-[#2a3a1a] p-8 text-center">
          <Trophy className="mx-auto h-10 w-10 text-amber-200/30" />
          <p className="mt-3 text-amber-200/50">
            No completions yet. Be the first to get on the board!
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {leaderboard.map((entry, index) => {
            const rank = index + 1
            const style = RANK_STYLES[rank]
            const isCurrentUser = user?.id === entry.user_id
            const isPatchContender = rank <= PATCH_WINNERS

            return (
              <Link
                key={entry.user_id}
                href={`/pax/${entry.user_id}`}
                className={`flex items-center gap-4 rounded-lg border p-4 transition-colors ${
                  isPatchContender
                    ? "border-amber-500/30 bg-amber-900/20 hover:bg-amber-900/30"
                    : "border-[#3a4a2a] bg-[#2a3a1a] hover:bg-[#344428]"
                } ${isCurrentUser ? "ring-2 ring-amber-400 ring-offset-1 ring-offset-[#1e2d14]" : ""}`}
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center">
                  {style ? (
                    <style.icon
                      className={`h-6 w-6 ${
                        rank === 1
                          ? "text-yellow-400"
                          : rank === 2
                          ? "text-gray-300"
                          : "text-amber-600"
                      }`}
                    />
                  ) : (
                    <span className="text-lg font-bold text-amber-200/40">
                      {rank}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-100 truncate">
                      {entry.display_name}
                    </span>
                    {isCurrentUser && (
                      <Badge variant="secondary" className="bg-[#4a5c3a] text-amber-200 border-0">You</Badge>
                    )}
                  </div>
                  <p className="text-sm text-amber-200/50">
                    {entry.completed_count} square
                    {entry.completed_count !== 1 ? "s" : ""} completed
                  </p>
                </div>

                {style && (
                  <Badge variant={style.badge}>{style.label}</Badge>
                )}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
