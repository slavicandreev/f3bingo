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
        <h1 className="text-2xl font-bold text-gray-900">Leaderboard</h1>
        <p className="text-sm text-gray-500">
          Top {LEADERBOARD_SIZE} PAX — Top {PATCH_WINNERS} earn F3 Legacy patches
        </p>
      </div>

      {leaderboard.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
          <Trophy className="mx-auto h-10 w-10 text-gray-300" />
          <p className="mt-3 text-gray-500">
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
                className={`flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-gray-50 ${
                  isPatchContender
                    ? "border-yellow-200 bg-yellow-50/50"
                    : "border-gray-200 bg-white"
                } ${isCurrentUser ? "ring-2 ring-blue-400 ring-offset-1" : ""}`}
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center">
                  {style ? (
                    <style.icon
                      className={`h-6 w-6 ${
                        rank === 1
                          ? "text-yellow-500"
                          : rank === 2
                          ? "text-gray-400"
                          : "text-amber-700"
                      }`}
                    />
                  ) : (
                    <span className="text-lg font-bold text-gray-400">
                      {rank}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 truncate">
                      {entry.display_name}
                    </span>
                    {isCurrentUser && (
                      <Badge variant="secondary">You</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
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
